import {
  StreamInfo,
  Offset, StateTransition, PausableStream, SimplePauseController
} from "@proxima-one/proxima-streams";
import { StreamConsumerServiceClient, FindStreamRequest, FindStreamResponse, FindOffsetRequest, GetStateTransitionsRequest, Direction, StreamStateTransitionsRequest } from "../gen/stream_consumer/v1alpha1/stream_consumer";
import { toOffsetModel, toOffsetProto, toStateTransitionModel} from "./converters"; 
import {strict as assert} from "assert";
import * as grpc from "@grpc/grpc-js";
import { watchFile } from "fs-extra";
import { isNull } from "lodash";
import { sleep } from "@proxima-one/proxima-utils";

export class StreamDBConsumerClient {
  //client (consumer)
  private consumer: StreamConsumerServiceClient;

  constructor(uri: string, auth = "") {
    const secure = uri.includes(":443");
    const credentials = secure
      ? grpc.credentials.createSsl()
      : grpc.credentials.createInsecure();
    this.consumer = new StreamConsumerServiceClient(uri, credentials, {
      "grpc.keepalive_timeout_ms": 1 * 1000,
      "grpc.keepalive_time_ms": 10 * 1000,
      "grpc.keepalive_permit_without_calls": 1,
      "grpc.max_receive_message_length": 100 * 1024 * 1024,
    })
  }
  
  public findStream(id: string): Promise<StreamInfo | undefined> {
    return new Promise(
      (resolve, reject) => {
       this.consumer.findStream(FindStreamRequest.fromPartial({streamId: id}), function(error: any, response: FindStreamResponse){
        if (error) return reject(error);
        if (response == undefined) return resolve(undefined)
        const resp = response.stream
        if (resp != undefined && resp.start && resp.end) {
          return resolve(new StreamInfo(resp.id, toOffsetModel(resp.start), toOffsetModel(resp.end)))
        } 
        return resolve(undefined);  
      })   
    })
  }

  public findOffset(stream: string, height: bigint): Promise<Offset | undefined> {
    return new Promise(
      (resolve, reject) => {
        this.consumer.findOffset(FindOffsetRequest.fromPartial({
          streamId: stream, 
          height: Number(height),
          timestamp: undefined
        }), function(error, response){
          if (error) return reject(error) 
          if (response == undefined) return resolve(undefined)
          const resp = response.offset
          if (resp != undefined) {
            return resolve(toOffsetModel(resp))
          }
          return resolve(undefined)
        })
      }
    )
  }

  public getStateTransitions(stream: string, offset: Offset, count: number, direction: "next" | "last"): Promise<StateTransition[]> {
    return new Promise<StateTransition[]>(
      (resolve, reject) => {
        this.consumer.getStateTransitions(GetStateTransitionsRequest.fromPartial({
          streamId: stream, 
          offset: toOffsetProto(offset),
          count: count, 
          direction: direction == "next" ? Direction.NEXT : Direction.LAST
        }), function(error, response) {
          if (error) {
            return resolve([]) 
          }
          if (response && response.stateTransitions) {
            const resp = response.stateTransitions
            return resolve(resp.map((transition) => {
              return toStateTransitionModel(transition)
            }))
          }
          return resolve([])
        })
      }
    )
  }

  public async streamStateTransitions(stream: string, offset: Offset): Promise<PausableStream<StateTransition>> {
    const grpcStreamResponse = this.consumer.streamStateTransitions(StreamStateTransitionsRequest.fromPartial({streamId: stream, 
          offset: toOffsetProto(offset)}), undefined) 

    return PausableStream.create<StateTransition>((observer, pauseState) => {
          grpcStreamResponse.on("data", (d) => {
            for (const obj of d.stateTransition) {
              observer.next(toStateTransitionModel(obj))
            }
            
          });
          grpcStreamResponse.on("error", (err) => observer.error(err));
          grpcStreamResponse.on("end", () => observer.complete());
          grpcStreamResponse.on("close", () => observer.error("connection closed"));
          const checkLoop = async () => {
            while (true) {
              if (pauseState.isPaused) {
                grpcStreamResponse.pause()
                await pauseState.waitUntilResumed()
                grpcStreamResponse.resume()
              } else {
                await sleep(100)
              }
            }
          } 
          checkLoop()

    })
  }
}
