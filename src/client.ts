import * as grpc from "@grpc/grpc-js";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as ProximaService from "./gen/proto/messages/v1alpha1/messages_grpc_pb";
import * as ProximaServiceTypes from "./gen/proto/messages/v1alpha1/messages_pb";
import { MessagesServiceClient } from "./gen/proto/messages/v1alpha1/messages_grpc_pb";
import { mergeMap, Observable } from "rxjs";
import { Event, State, Transition, StreamStateRef, Timestamp } from "./model";
import { StreamMessage, StreamMessagesResponse } from "./gen/proto/messages/v1alpha1/messages_pb";

export class ProximaStreamsClient {
  private client: MessagesServiceClient;

  public constructor(
    private readonly uri: string,
    private readonly auth: string = ""
  ) {
    const secure = uri.includes(":443");
    const credentials = secure
      ? grpc.credentials.createSsl()
      : grpc.credentials.createInsecure();
    this.client = new ProximaService.MessagesServiceClient(uri, credentials, {
      "grpc.keepalive_timeout_ms": 1 * 1000,
      "grpc.keepalive_time_ms": 10 * 1000,
      "grpc.keepalive_permit_without_calls": 1,
      "grpc.max_receive_message_length": 100 * 1024 * 1024,
    });
  }

  public streamTransitionsAfter(
    streamStateRef: StreamStateRef,
  ): Observable<Transition> {
    let request = new ProximaServiceTypes.StreamMessagesRequest();
    request.setStreamId(streamStateRef.stream);

    if (!streamStateRef.state.isGenesis)
      request = request.setLastMessageId(streamStateRef.state.id);

    console.debug(`creating grpc stream ${streamStateRef.stream}, ${streamStateRef.state.id}`);
    const stream = this.client.streamMessages(request, this.authMeta());

    return toObservable<StreamMessagesResponse>(
      stream
    ).pipe(mergeMap((x) => x.getMessagesList().flat().map(streamMessageToModel)));
  }

  public async getTransitionsAfter(
    streamStateRef: StreamStateRef,
    count: number,
  ): Promise<Transition[]> {
    let request = new ProximaServiceTypes.GetNextMessagesRequest()
      .setStreamId(streamStateRef.stream)
      .setCount(count);

    if (!streamStateRef.state.isGenesis)
      request = request.setLastMessageId(streamStateRef.state.id);

    return new Promise<Transition[]>((resolve, reject) => {
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
          resolve(response.getMessagesList().map(streamMessageToModel));
        }
      );
    });
  }

  private authMeta(): grpc.Metadata {
    const meta = new grpc.Metadata();
    meta.add("authorization", "Bearer " + this.auth);
    return meta;
  }
}

function streamMessageToModel(msg: StreamMessage): Transition {
  return new Transition(
    new State(msg.getId()),
    new Event(msg.getPayload_asU8(),
      timestampToModel(msg.getTimestamp()!),
      msg.getHeader()!.getUndo())
  );
}

function timestampToModel(timestamp: google_protobuf_timestamp_pb.Timestamp): Timestamp {
  return Timestamp.fromEpochMs(timestamp.getSeconds() * 1e3 + Math.floor(timestamp.getNanos() / 1e3));
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
