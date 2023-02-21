import { StreamEvent, Offset } from "../model";
import { PausableStream, StreamController } from "../lib/pausableStream";

export interface StreamDBConsumerClient {
  getEvents(
    stream: string,
    offset: Offset,
    count: number,
    direction: "next" | "last"
  ): Promise<StreamEvent[]>;

  getEventsStream(
    stream: string,
    offset: Offset,
    controller?: StreamController
  ): PausableStream<StreamEvent>;
}
