import {
  Direction,
  GetStateTransitionsRequest,
  StreamConsumerServiceClient, StreamStateTransitionsRequest
} from "../gen/stream_consumer/v1alpha1/stream_consumer";
import * as grpc from "@grpc/grpc-js";
import {Offset, StreamEvent} from "../model";
import {offsetToProto, stateTransitionProtoToStreamEvent} from "../streamdb/converters";
import {PausableStream, StreamController} from "../lib/pausableStream";
import {StreamDBConsumerClient} from "./consumerClient";

export class StreamDBConsumerGrpcClient implements StreamDBConsumerClient {
  private consumer: StreamConsumerServiceClient;

  constructor(uri: string) {
    const secure = uri.includes(":443");
    const credentials = secure
      ? grpc.credentials.createSsl()
      : grpc.credentials.createInsecure();
    this.consumer = new StreamConsumerServiceClient(uri, credentials, {
      "grpc.keepalive_timeout_ms": 100 * 1000,
      "grpc.keepalive_time_ms": 100 * 1000,
      "grpc.keepalive_permit_without_calls": 1,
      "grpc.max_receive_message_length": 100 * 1024 * 1024,
    });
  }

  public getEvents(
    stream: string,
    offset: Offset,
    count: number,
    direction: "next" | "last"
  ): Promise<StreamEvent[]> {
    return new Promise<StreamEvent[]>((resolve, reject) => {
      this.consumer.getStateTransitions(
        GetStateTransitionsRequest.fromPartial({
          streamId: stream,
          offset: offsetToProto(offset),
          count: count,
          direction: direction == "next" ? Direction.NEXT : Direction.LAST,
        }),
        (error, response) => {
          if (error) {
            return reject(error);
          }
          if (response && response.stateTransitions) {
            const resp = response.stateTransitions;
            return resolve(
              resp.map(transition => {
                return stateTransitionProtoToStreamEvent(transition);
              })
            );
          }
          return resolve([]);
        }
      );
    });
  }

  public getEventsStream(
    stream: string,
    offset: Offset,
    controller?: StreamController
  ): PausableStream<StreamEvent> {
    const grpcStreamResponse = this.consumer.streamStateTransitions(
      StreamStateTransitionsRequest.fromPartial({
        streamId: stream,
        offset: offsetToProto(offset),
      })
    );

    return PausableStream.create<StreamEvent>((observer, pauseState) => {
      grpcStreamResponse.on("data", d => {
        for (const obj of d.stateTransition) {
          observer.next(stateTransitionProtoToStreamEvent(obj));
        }
      });
      grpcStreamResponse.on("error", err => observer.error(err));
      grpcStreamResponse.on("end", () => observer.complete());
      grpcStreamResponse.on("close", () => observer.error("connection closed"));

      const checkInterval = setInterval(() => {
        if (pauseState.isPaused && !grpcStreamResponse.isPaused()) {
          grpcStreamResponse.pause();
        } else if (!pauseState.isPaused && grpcStreamResponse.isPaused()) {
          grpcStreamResponse.resume();
        }
      }, 100);

      // unsubscribe logic
      return () => {
        grpcStreamResponse.cancel();
        clearInterval(checkInterval);
      };
    }, controller);
  }
}
