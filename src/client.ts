import * as grpc from "@grpc/grpc-js";
import * as ProximaService from "./gen/proto/messages/v1alpha1/messages_grpc_pb";
import * as ProximaServiceTypes from "./gen/proto/messages/v1alpha1/messages_pb";
import { map, Observable } from "rxjs";

export type StreamMessagesResponse =
  ProximaServiceTypes.StreamMessagesResponse.AsObject;
export type GetNextMessagesResponse =
  ProximaServiceTypes.GetNextMessagesResponse.AsObject;

export class StreamClient {
  private client: ProximaService.MessagesServiceClient;
  private readonly authorization: string;

  public constructor(uri: string, auth: string = "") {
    this.authorization = auth;
    const secure = uri.includes(":443");
    const credentials = secure
      ? grpc.credentials.createSsl()
      : grpc.credentials.createInsecure();
    this.client = new ProximaService.MessagesServiceClient(
      uri,
      credentials,
      {}
    );
  }

  public streamMessages(
    streamId: string,
    latest?: string
  ): Observable<StreamMessagesResponse> {
    let request = new ProximaServiceTypes.StreamMessagesRequest().setStreamId(
      streamId
    );

    if (latest != undefined) request = request.setLastMessageId(latest);

    const stream = this.client.streamMessages(request, this.authMeta());
    return toObservable(stream).pipe(map((x) => x.toObject()));
  }

  public async getNextMessages(
    streamId: string,
    messageCount: number,
    latest?: string
  ): Promise<GetNextMessagesResponse> {
    let request = new ProximaServiceTypes.GetNextMessagesRequest()
      .setStreamId(streamId)
      .setCount(messageCount);

    if (latest != undefined) request = request.setLastMessageId(latest);

    return new Promise((resolve, reject) => {
      this.client.getNextMessages(
        request,
        this.authMeta(),
        (err, response: ProximaServiceTypes.GetNextMessagesResponse) => {
          if (err != null) {
            console.log(
              `[execute query] err:\nerr.message: ${err.message}\nerr.stack:\n${err.stack}`
            );
            reject(err);
            return;
          }
          resolve(response.toObject());
        }
      );
    });
  }

  private authMeta(): grpc.Metadata {
    const meta = new grpc.Metadata();
    meta.add("authorization", "Bearer " + this.authorization);
    return meta;
  }
}

function toObservable<T>(
  grpcStreamResponse: grpc.ClientReadableStream<T>
): Observable<T> {
  return new Observable<T>((observer) => {
    grpcStreamResponse.on("data", (d) => observer.next(d));
    grpcStreamResponse.on("error", (err) => observer.error(err));
    grpcStreamResponse.on("end", () => observer.complete());
    grpcStreamResponse.on("close", () => observer.error("connection closed"));

    return () => {
      console.log("cancelling grpc stream");
      grpcStreamResponse.cancel();
    };
  });
}
