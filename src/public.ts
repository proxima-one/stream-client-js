import { StreamDBConsumerClient } from "./stream-db/streamDbDatabase";
import { Timestamp } from "./model/timestamp";
import { execAndReturnWithRetry } from "./utils";
import axios from "axios";
import { strict as assert } from "assert";
import { PausableStream } from "./stream-db/pausableStream";
import { offsetToProto } from "./stream-db/converters";
import { Offset } from "./model/offset";
import { Stream, StreamEndpoint, StreamStats } from "./model";

export class StreamClient {
  private readonly registry: StreamRegistry;
  private clientCache: Record<string, StreamDBConsumerClient>;

  public constructor(private readonly options: StreamClientOptions) {
    this.registry = options.registry ?? new RemoteStreamRegistry();
    this.clientCache = {};
  }

  public async findOffset(
    stream: string,
    height?: number,
    timestamp?: number
  ): Promise<string | undefined> {
    const offset = await this.registry.findOffset(stream, height, timestamp);
    return offset;
  }

  //return stream matching the name
  public async getStream(name: string): Promise<Stream> {
    // 1. return first endpoint having the stream
    // 2. throw error if stream not found
    try {
      return await this.registry.getStream(name);
    } catch (e) {
      console.log(e);
      throw new Error("Stream not found" + e);
    }
  }

  public async getStreams(): Promise<Stream[]> {
    // 1. return first endpoint having the stream
    // 2. throw error if stream not found
    try {
      return await this.registry.getStreams();
    } catch (e) {
      console.log(e);
      throw new Error("Stream not found" + e);
    }
  }

  public async fetchEvents(
    streamName: string,
    offset: string,
    count: number,
    direction: "next" | "last"
  ): Promise<StreamEvent[]> {
    // 1. find endpoint having the offset
    // 2. proxy request to it
    // 3. note, it's worth keeping clients to every streamdb endpoint cached (as well as grpc connections to them)
    const endpoints: StreamEndpoint[] = await this.registry.findStreamEndpoints(
      streamName,
      offset
    );
    for (const endpoint of endpoints) {
      const client = this.getStreamConsumerClient(endpoint.uri);
      const stateTransitions = await client.getStateTransitions(
        streamName,
        offset,
        count,
        direction
      );
      return stateTransitions;
    }
    return [];
  }

  private getStreamConsumerClient(endpoint: string) {
    if (!(endpoint in this.clientCache)) {
      const client = new StreamDBConsumerClient(endpoint);
      this.clientCache[endpoint] = client;
    }
    return this.clientCache[endpoint];
  }

  // 1. find endpoint having the offset
  // 2. stream events from it
  public async streamEvents(
    streamName: string,
    offset: string
  ): Promise<PausableStream<StreamEvent>> {
    try {
      const endpoints: StreamEndpoint[] =
        await this.registry.findStreamEndpoints(streamName, offset);
      for (const endpoint of endpoints) {
        const client = this.getStreamConsumerClient(endpoint.uri);
        const eventStream = await client.streamStateTransitions(
          streamName,
          offset
        );
        return eventStream;
      }
      throw new Error("Cannot stream data");
    } catch (e) {
      throw new Error("Cannot stream data");
    }
  }
}

export class StreamEvent {
  public constructor(
    public readonly offset: Offset | string,
    public readonly payload: Uint8Array,
    public readonly timestamp: number,
    public readonly undo: boolean
  ) {}
}

export interface StreamClientOptions {
  registry?: StreamRegistry;
}

export interface StreamRegistryOptions {
  retryPolicy: {
    retryCount: number;
    waitInMs: number;
  };
}

export const DefaultRegistryClientOptions: StreamRegistryOptions = {
  retryPolicy: {
    retryCount: 10,
    waitInMs: 300,
  },
};

//Stream Registry (get stream and get streams?)
export interface StreamRegistry {
  findStreamEndpoints(
    streamName: string,
    offset: string
  ): Promise<StreamEndpoint[]>;
  getStreams(): Promise<Stream[]>;
  getStream(streamName: string): Promise<Stream>;
  findOffset(
    stream: string,
    height?: number,
    timestamp?: number
  ): Promise<string | undefined>;
}

export class RemoteStreamRegistry implements StreamRegistry, StreamDiscovery {
  private _streams: SimpleCache<Stream>;

  public constructor(
    private readonly endpoint: string = "https://stream-api.cluster.amur-dev.proxima.one",
    public readonly options: StreamRegistryOptions = DefaultRegistryClientOptions
  ) {
    this._streams = new SimpleCache<Stream>();
  }

  public async findStreams(filter: StreamFilter): Promise<Stream[]> {
    try {
      const streams = await execAndReturnWithRetry<any>(
        async () => {
          return await axios.post(this.endpoint + "/streams/search", filter);
        },
        this.options.retryPolicy.retryCount,
        this.options.retryPolicy.waitInMs
      );
      return streams.data.items;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  public async findStreamEndpoints(
    streamName: string,
    offset: string
  ): Promise<StreamEndpoint[]> {
    try {
      const resp = await execAndReturnWithRetry<any>(
        async () => {
          return await axios.get(
            this.endpoint +
              "/streams/" +
              streamName +
              "/offsets/" +
              offset +
              "/endpoints"
          );
        },
        this.options.retryPolicy.retryCount,
        this.options.retryPolicy.waitInMs
      );
      return resp.data.items;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  public async getStreams(): Promise<Stream[]> {
    try {
      const streams = await execAndReturnWithRetry<any>(
        async () => {
          return await axios.get(this.endpoint + "/streams");
        },
        this.options.retryPolicy.retryCount,
        this.options.retryPolicy.waitInMs
      );
      return streams.data.items;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  public async getStream(streamName: string): Promise<Stream> {
    if (this._streams.contains(streamName)) {
      return this._streams.get(streamName);
    }
    //seek cache
    try {
      const resp = await execAndReturnWithRetry<any>(
        async () => {
          return await axios.get(this.endpoint + "/streams/" + streamName);
        },
        this.options.retryPolicy.retryCount,
        this.options.retryPolicy.waitInMs
      );
      if (resp.data) {
        const stream = resp.data;
        this._streams.set(streamName, stream);
        return stream;
      } else {
        throw new Error("Cannot get stream");
      }
    } catch (e) {
      console.log(e);
      throw new Error("Cannot get stream");
    }
  }

  public async findOffset(
    stream: string,
    height?: number,
    timestamp?: number
  ): Promise<string | undefined> {
    try {
      const queryString = height
        ? "height=" + height.toString()
        : "timestamp=" + timestamp?.toString();
      const resp = await execAndReturnWithRetry<any>(
        async () => {
          return await axios.get(
            this.endpoint +
              "/streams/" +
              stream +
              "/offsets/find?" +
              queryString
          );
        },
        this.options.retryPolicy.retryCount,
        this.options.retryPolicy.waitInMs
      );

      if (resp.data) {
        return resp.data.id;
      } else {
        return undefined;
      }
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}

export class SingleStreamDbRegistry implements StreamRegistry {
  public constructor(private readonly streamDbUrl: string) {}

  public async findStreamEndpoints(
    streamName: string,
    filter: string
  ): Promise<StreamEndpoint[]> {
    // assume single streamdb has all requested streams
    return [
      {
        uri: this.streamDbUrl,
        from: Offset.zero.dump(),
        to: Offset.zero.dump(),
        totalMessages: 0
      },
    ];
  }

  public async getStreams(): Promise<Stream[]> {
    return [];
  }
  public async findOffset(
    stream: string,
    height?: number,
    timestamp?: number
  ): Promise<string | undefined> {
    throw new Error("Not implemented");
  }

  public async getStream(name: string): Promise<Stream> {
    throw new Error("Not implemented");
  }
}

export interface StreamDiscovery {
  findStreams(filter: StreamFilter): Promise<Stream[]>;
}

export interface StreamFilter {
  labels?: Record<string, string>;
}

// export interface Stream {
//   name: string;
//   metadata: StreamMetadata;
//   stats?: StreamStats;
//   endpoints?: StreamEndpoint[];
// }

// export interface StreamMetadata {
//   description: string;
//   labels: Record<string, string>;
// }

// export type StreamStats = {
//   id: string;
//   start?: string;
//   end?: string;
//   messageCount: number;
//   totalStorageSize: number;
// };

// export interface StreamEndpoint {
//   uri: string;
//   from?: string;
//   to?: string;
//   messageCount?: number;
// }

export type FindOffsetFilter = {
  from: {
    height: number;
    timestamp?: Timestamp;
  };
  to?: {
    height: number;
    timestamp?: Timestamp;
  };
};

class SimpleCache<T> {
  private _objects: Record<string, T>;
  private _durations: Record<string, number>;

  constructor(public readonly ttl = 300000) {
    this._objects = {};
    this._durations = {};
  }

  public set(key: string, value: T) {
    this._objects[key] = value;
    this._durations[key] = Date.now() + this.ttl;
  }

  public contains(key: string): boolean {
    this._removeIfOverdue(key);
    return key in this._objects;
  }

  private _removeIfOverdue(key: string): void {
    if (key in this._durations && this._durations[key] <= Date.now()) {
      this.remove(key);
    }
  }

  public remove(key: string) {
    delete this._objects[key];
    delete this._durations[key];
  }

  public get(key: string): T {
    if (this.contains(key)) {
      return this._objects[key];
    }
    throw new Error("Cache does not contain value at key: " + key);
  }
}
