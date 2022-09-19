export class StreamClient {
  private readonly registry: StreamRegistry;

  public constructor(
    private readonly options: StreamClientOptions,
  ) {
    this.registry = options.registry ?? new RemoteStreamRegistry();
  }

  public findOffset(stream: string, params: {height?: number, timestamp: Timestamp}): Offset {
    // 1. get all endpoints having the stream
    // 2. try every to find offset
    // 3. return first found offset

    throw new Error("not implemented");
  }

  public getStream(name: string): Stream {
    // 1. return first endpoint having the stream
    // 2. throw error if stream not found
    throw new Error("not implemented");
  }

  public fetchEvents(streamName: string, offset: Offset, count: number, direction: "next" | "last"): Promise<StreamEvent[]> {
    // 1. find endpoint having the offset
    // 2. proxy request to it
    // 3. note, it's worth keeping clients to every streamdb endpoint cached (as well as grpc connections to them)

    throw new Error("not implemented");
  }

  public streamEvents(streamName: string,  offset: Offset = Offset.zero): Promise<PausableStream<StreamEvent>> {
    // 1. find endpoint having the offset
    // 2. stream events from it

    throw new Error("not implemented");
  }
}

// copy-paste from proxima-streams
export type PausableStream<T> = never;

export class Offset {
  public static readonly zero: Offset;
  // copy-paste from proxima-streams
}

export class StreamEvent {
  public constructor(
    public readonly offset: Offset,
    public readonly payload: Uint8Array,
    public readonly timestamp: Timestamp,
    public readonly undo: boolean,
  ) {
  }
}


export class Timestamp {
 // copy-paste timestamp from proxima-streams
}

export interface StreamClientOptions {
  registry?: StreamRegistry;
}

export interface StreamRegistry {
  getStreamEndpoints(streamName: string, offset: Offset): Promise<StreamEndpoint[]>;
}

export class RemoteStreamRegistry implements StreamRegistry {
  public constructor(private readonly endpoint: string = "https://stream-api.cluster.amur-dev.proxima.one") { }

  public getStreamEndpoints(streamName: string, offset: Offset): Promise<StreamEndpoint[]> {
    throw new Error("not implemented");
  }
}


export class SingleStreamDbRegistry implements StreamRegistry {
  public constructor(private readonly streamDbUrl: string) { }

  public async getStreamEndpoints(streamName: string, offset: Offset): Promise<StreamEndpoint[]> {
    // assume single streamdb has all requested streams
    return [{
      url: this.streamDbUrl,
      from: Offset.zero,
    }];
  }
}

export interface StreamDiscovery {
  findStreams(filter: StreamFilter): Promise<Stream[]>
}

export interface StreamFilter {
  labels?: Record<string, string>;
}

export interface Stream {
  name: string;
  metadata: StreamMetadata;
}

export interface StreamMetadata {
  description: string;
  labels: Record<string, string>;
}

export interface StreamEndpoint {
  url: string;
  from: Offset;
  to?: Offset;
}
