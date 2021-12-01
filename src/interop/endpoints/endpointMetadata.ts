export class EndpointMetadata {
  public readonly archive: boolean;
  public readonly dedicated: boolean;
  public readonly slots: number;
  public readonly requestLimits?: RequestLimits;
  public readonly streaming: boolean;
  public readonly fetch: boolean;

  public constructor(archive: boolean, dedicated: boolean, slots: number, streaming: boolean, requestLimits: RequestLimits | undefined, fetch: boolean) {
    this.archive = archive;
    this.dedicated = dedicated;
    this.slots = slots;
    this.requestLimits = requestLimits;
    this.streaming = streaming;
    this.fetch = fetch;
  }
}

export class RequestLimits {
  public readonly count: number;
  public readonly intervalMs: number;

  public constructor(count: number, intervalMs: number) {
    this.count = count;
    this.intervalMs = intervalMs;
  }
}
