import { StreamEvent, Offset } from ".";
import { PausableStream } from "../lib/pausableStream";

export interface StreamConsumer {
  findStream(id: string): Promise<StreamInfo | undefined>;
  findOffset(stream: string, height: bigint): Promise<Offset | undefined>;
  getStateTransitions(
    stream: string,
    offset: Offset,
    count: number,
    direction: "next" | "last"
  ): Promise<StateTransition[]>;
  streamStateTransitions(
    stream: string,
    offset: Offset
  ): Promise<PausableStream<StateTransition>>;
}

export declare class StateTransition {
  readonly from: Offset;
  readonly to: Offset;
  readonly event: StreamEvent;
  constructor(from: Offset, to: Offset, event: StreamEvent);
  get undo(): boolean;
  toggleUndo(): StateTransition;
  equals(other: StateTransition): boolean;
}
export declare class StreamInfo {
  readonly id: string;
  readonly start: Offset;
  readonly end: Offset;
  constructor(id: string, start: Offset, end: Offset);
}
