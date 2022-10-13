import {
  StreamConsumerServiceClient,
  GetStateTransitionsRequest,
  Direction,
  StreamStateTransitionsRequest,
} from "../gen/stream_consumer/v1alpha1/stream_consumer";
import { offsetToProto, stateTransitionProtoToStreamEvent } from "./converters";
import * as grpc from "@grpc/grpc-js";
import { sleep } from "@proxima-one/proxima-utils";
import { StreamEvent, Offset } from "../model";

import { PausableStream } from "./pausableStream";

export class StreamDBConsumerClient {
  private consumer: StreamConsumerServiceClient;

  constructor(uri: string) {
    const secure = uri.includes(":443");
    const credentials = secure
      ? grpc.credentials.createSsl()
      : grpc.credentials.createInsecure();
    this.consumer = new StreamConsumerServiceClient(uri, credentials, {
      "grpc.keepalive_timeout_ms": 1 * 1000,
      "grpc.keepalive_time_ms": 10 * 1000,
      "grpc.keepalive_permit_without_calls": 1,
      "grpc.max_receive_message_length": 100 * 1024 * 1024,
    });
  }

  public getStateTransitions(
    stream: string,
    offsetStr: string,
    count: number,
    direction: "next" | "last"
  ): Promise<StreamEvent[]> {
    return new Promise<StreamEvent[]>((resolve, reject) => {
      this.consumer.getStateTransitions(
        GetStateTransitionsRequest.fromPartial({
          streamId: stream,
          offset: offsetToProto(Offset.parse(offsetStr)),
          count: count,
          direction: direction == "next" ? Direction.NEXT : Direction.LAST,
        }),
        function (error, response) {
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

  public async streamStateTransitions(
    stream: string,
    offsetStr: string
  ): Promise<PausableStream<StreamEvent>> {
    const grpcStreamResponse = this.consumer.streamStateTransitions(
      StreamStateTransitionsRequest.fromPartial({
        streamId: stream,
        offset: offsetToProto(Offset.parse(offsetStr)),
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
      const checkLoop = async () => {
        while (true) {
          if (pauseState.isPaused) {
            grpcStreamResponse.pause();
            await pauseState.waitUntilResumed();
            grpcStreamResponse.resume();
          } else {
            await sleep(100);
          }
        }
      };
      checkLoop();
    });
  }
}
