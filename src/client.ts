import * as grpc from "@grpc/grpc-js";
import * as ProximaService from "./gen/proto/messages/v1alpha1/messages_grpc_pb";
import * as ProximaServiceTypes from "./gen/proto/messages/v1alpha1/messages_pb";
import { mergeMap, Observable } from "rxjs";
import * as proto_messages_v1alpha1_messages_pb from "./gen/proto/messages/v1alpha1/messages_pb";

export type StreamMessagesResponse =
  ProximaServiceTypes.StreamMessagesResponse.AsObject;
export type GetNextMessagesResponse =
  ProximaServiceTypes.GetNextMessagesResponse.AsObject;

export type StreamMessage = ProximaServiceTypes.StreamMessage.AsObject;

export class StreamClient {
  private client: ProximaService.MessagesServiceClient;
  private readonly authorization: string;

  public constructor(uri: string, auth: string = "") {
    this.authorization = auth;
    const secure = uri.includes(":443");
    const credentials = secure
      ? grpc.credentials.createSsl()
      : grpc.credentials.createInsecure();
    this.client = new ProximaService.MessagesServiceClient(uri, credentials, {
      // "grpc.keepalive_timeout_ms": 1 * 1000,
      // "grpc.keepalive_time_ms": 100 * 1000,
      // "grpc.keepalive_permit_without_calls": 1,
      "grpc.max_receive_message_length": 100 * 1024 * 1024,
    });
  }

  public streamMessages(
    streamId: string,
    opts: { latest?: string } = {}
  ): Observable<StreamMessage> {
    let request = new ProximaServiceTypes.StreamMessagesRequest().setStreamId(
      streamId
    );

    if (opts.latest != undefined)
      request = request.setLastMessageId(opts.latest);

    const stream = this.client.streamMessages(request, this.authMeta());
    return toObservable<proto_messages_v1alpha1_messages_pb.StreamMessagesResponse>(
      stream
    ).pipe(mergeMap((x) => x.toObject().messagesList.flat()));
  }

  public async getNextMessages(
    streamId: string,
    opts: {
      messageCount?: number;
      latest?: string;
    } = {}
  ): Promise<GetNextMessagesResponse> {
    let request = new ProximaServiceTypes.GetNextMessagesRequest()
      .setStreamId(streamId)
      .setCount(opts.messageCount ?? 100);

    if (opts.latest != undefined)
      request = request.setLastMessageId(opts.latest);

    return new Promise<GetNextMessagesResponse>((resolve, reject) => {
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
