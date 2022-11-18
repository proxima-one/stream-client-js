import { Axios } from "axios";
import { Offset, Stream, StreamEndpoint, StreamMetadata } from "../model";
import { execAndReturnWithRetry, mapLookup, Parsing } from "../utils";
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
    return parseStreamEndpoints(JSON.parse(resp.data));
  }

  public async findStreams(filter: StreamFilter): Promise<Stream[]> {
    const resp = await this.call(
      async () => await this.client.post(`/streams/search`, filter)
    );
    return parseStreams(JSON.parse(resp.data));
  }

  public async getStreams(): Promise<Stream[]> {
    const resp = await this.call(async () => await this.client.get(`/streams`));
    return parseStreams(JSON.parse(resp.data));
  }

  public async findStream(stream: string): Promise<Stream | undefined> {
    const resp = await this.call(
      async () =>
        await this.client.get(`/streams/${stream}`, {
          validateStatus: x => x != 404,
        })
    );

    if (resp.status == 404) return undefined;

    return parseStream(JSON.parse(resp.data));
  }

  public async findOffset(
    stream: string,
    height?: number,
    timestampMs?: number
  ): Promise<Offset | undefined> {
    const resp = await this.call(
      async () =>
        await this.client.get(`/streams/${stream}/offsets/find`, {
          params: {
            height: height,
            timestamp: timestampMs,
          },
        })
    );

    return Offset.fromString(
      Parsing.parseStringProperty(JSON.parse(resp.data), "id")
    );
  }

  private async call<T>(func: () => Promise<T>) {
    return await execAndReturnWithRetry<T>(
      async () => await func(),
      this.options.retryPolicy.retryCount,
      this.options.retryPolicy.waitInMs
    );
  }
}

function parseStreams(data: unknown): Stream[] {
  const items = Parsing.parseArrayProperty(data, "items");
  return items.map(parseStream);
}

function parseStream(data: unknown): Stream {
  const metadata = Parsing.parseProperty(data, "metadata");
  const endpoints = Parsing.parsePropertyOrNull(data, "endpoints") as Record<
    string,
    unknown
  >;

  return new Stream(
    Parsing.parseStringProperty(data, "name"),
    new StreamMetadata(
      Parsing.parseStringOrNullProperty(metadata, "description") ?? "",
      (Parsing.parseProperty(metadata, "labels") ?? {}) as Record<
        string,
        string
      >
    ),
    endpoints ? mapLookup(endpoints, parseStreamEndpoint) : {}
  );
}

function parseStreamEndpoints(data: unknown): StreamEndpoint[] {
  const items = Parsing.parseArrayProperty(data, "items");
  return items.map(parseStreamEndpoint);
}

function parseStreamEndpoint(endpoint: unknown): StreamEndpoint {
  const stats = Parsing.parseProperty(endpoint, "stats");

  return {
    uri: Parsing.parseStringProperty(endpoint, "uri"),
    stats: {
      start: Offset.fromString(Parsing.parseStringProperty(stats, "start")),
      end: Offset.fromString(Parsing.parseStringProperty(stats, "end")),
      length: Parsing.parseNumberProperty(stats, "length"),
      storageSize: Parsing.parseNumberProperty(stats, "storageSize"),
    },
  };
}

export interface StreamFilter {
  labels?: Record<string, string>;
}
