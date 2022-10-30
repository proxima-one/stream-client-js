import { StreamRegistry } from "./streamRegistry";
import { Offset, StreamEndpoint, StreamStats } from "../model";

export class SingleStreamDbRegistry implements StreamRegistry {
  public constructor(private readonly streamDbUrl: string) {
  }

  public async getStreamEndpoints(streamName: string, offset: Offset): Promise<StreamEndpoint[]> {
    // assume single streamdb has all requested streams
    return [
      new StreamEndpoint(this.streamDbUrl, new StreamStats(
        Offset.zero,
        undefined,
        undefined,
        undefined
      ))];
  }
}
