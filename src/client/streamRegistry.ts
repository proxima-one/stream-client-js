import { Offset, StreamEndpoint } from "../model";

export interface StreamRegistry {
  getStreamEndpoints(stream: string, offset: Offset): Promise<StreamEndpoint[]>;
  getApiKey(): string | undefined;
}
