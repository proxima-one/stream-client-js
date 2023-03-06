import { Axios } from "axios";
import { Offset, Stream, StreamEndpoint, StreamMetadata } from "../model";
import { execAndReturnWithRetry, mapLookup } from "../utils";
import { StreamRegistry } from "./streamRegistry";

export interface StreamRegistryOptions {
  endpoint: string;
  retryPolicy: {
    retryCount: number;
    waitInMs: number;
  };
}

const DefaultRegistryClientOptions: StreamRegistryOptions = {
  endpoint: "https://streams.api.proxima.one",
  retryPolicy: {
    retryCount: 10,
    waitInMs: 300,
  },
};

export class StreamRegistryClient implements StreamRegistry {
  private readonly client: Axios;

  public constructor(
    private readonly options: StreamRegistryOptions = DefaultRegistryClientOptions
  ) {
    this.client = new Axios({
      baseURL: options.endpoint,
      validateStatus: status =>
        (status >= 200 && status < 300) || status == 404,
    });
  }

  public async getStreamEndpoints(
    stream: string,
    offset: Offset
  ): Promise<StreamEndpoint[]> {
    const resp = await this.call(
      async () =>
        await this.client.get(
          `/streams/${stream}/offsets/${offset.toString()}/endpoints`
        )
    );

    if (resp.status == 404) return [];

    return parseStreamEndpoints(JSON.parse(resp.data));
  }

  public async findStreams(filter: StreamFilter): Promise<Stream[]> {
    const resp = await this.call(
      async () =>
        await this.client.post(`/streams`, JSON.stringify(filter), {
          headers: {
            "Content-Type": "application/json",
          },
        })
    );

    if (resp.status == 404) return [];

    return parseStreams(JSON.parse(resp.data));
  }

  public async getStreams(): Promise<Stream[]> {
    const resp = await this.call(async () => await this.client.get(`/streams`));

    if (resp.status == 404) return [];

    return parseStreams(JSON.parse(resp.data));
  }

  public async findStream(stream: string): Promise<Stream | undefined> {
    const resp = await this.call(
      async () => await this.client.get(`/streams/${stream}`)
    );

    if (resp.status == 404 || resp.data == undefined) return undefined;

    return parseStream(JSON.parse(resp.data));
  }

  public async findOffset(
    stream: string,
    filter: {
      height?: number;
      timestampMs?: number;
    }
  ): Promise<Offset | undefined> {
    if (filter.height !== undefined && filter.timestampMs !== undefined)
      throw new Error("Either height or timestampMs must be provided");

    const resp = await this.call(
      async () =>
        await this.client.get(`/streams/${stream}/offsets/find`, {
          params: {
            height: filter.height,
            timestamp: filter.timestampMs,
          },
        })
    );

    if (resp.status == 404 || resp.data == undefined) return undefined;

    return Offset.fromString(JSON.parse(resp.data).id);
  }

  private async call<T>(func: () => Promise<T>) {
    return await execAndReturnWithRetry<T>(
      async () => await func(),
      this.options.retryPolicy.retryCount,
      this.options.retryPolicy.waitInMs
    );
  }
}

function parseStreams(data: any): Stream[] {
  return (data.items as []).map(parseStream);
}

function parseStream(data: any): Stream {
  const metadata = data.metadata;
  const endpoints = data.endpoints as Record<string, any>;

  return new Stream(
    data.name,
    new StreamMetadata(
      metadata.description ?? "",
      (metadata.labels ?? {}) as Record<string, string>
    ),
    endpoints ? mapLookup(endpoints, parseStreamEndpoint) : {}
  );
}

function parseStreamEndpoints(data: any): StreamEndpoint[] {
  return data.items.map(parseStreamEndpoint);
}

function parseStreamEndpoint(endpoint: any): StreamEndpoint {
  const stats = endpoint.stats;

  return {
    uri: endpoint.uri,
    httpUri: endpoint.httpUri,
    stats: {
      start: Offset.fromString(stats.start),
      end: Offset.fromString(stats.end),
      length: stats.length,
      storageSize: stats.storageSize,
    },
  };
}

export interface StreamFilter {
  labels?: Record<string, string>;
}
