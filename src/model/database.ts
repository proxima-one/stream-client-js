import {
  StreamInfo,
  Offset, StreamOffsets, StreamEventsProducerState, StateTransition, StreamEvent, PausableStream
} from "@proxima-one/proxima-streams";

export interface StreamConsumer {
  findStream(id: string): Promise<StreamInfo | undefined>;
  findOffset(stream: string, height: bigint): Promise<Offset | undefined>;
  getStateTransitions(stream: string, offset: Offset, count: number, direction: "next" | "last"): Promise<StateTransition[]>;
  streamStateTransitions(stream: string, offset: Offset): Promise<PausableStream<StateTransition>>;
}
