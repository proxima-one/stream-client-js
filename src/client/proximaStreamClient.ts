import { StreamDBConsumerClient } from "../streamdbConsumerClient/consumerClient";
import { StreamDBConsumerHttpClient } from "../streamdbConsumerClient/httpClient";
import { PausableStream, SimplePauseController } from "../lib/pausableStream";
import { Offset, StreamEndpoint, StreamEvent } from "../model";
import { StreamRegistryClient } from "./streamRegistryClient";
import { StreamRegistry } from "./streamRegistry";
import _ from "lodash";
import NodeCache from "node-cache";
import { Subscription } from "rxjs";
import { sleep } from "../utils";

export class ProximaStreamClient {
  private readonly registry: StreamRegistry;
  private readonly clients: Record<string, StreamDBConsumerClient>;
  private readonly offsetsCache: NodeCache;

  public constructor(
    private readonly options: StreamClientOptions = {
      registry: new StreamRegistryClient(),
    }
  ) {
    this.registry = options.registry ?? new StreamRegistryClient();
    this.clients = {};
    this.offsetsCache = new NodeCache({ maxKeys: 10 * 1000 * 1000 });
  }

  public async fetchEvents(
    stream: string,
    offset: Offset,
    count: number,
    direction: "next" | "last"
  ): Promise<StreamEvent[]> {
    const endpoint = await this.findEndpointFor(stream, offset);
    if (!endpoint)
      throw new Error(
        `Can't fetch events for stream ${stream} ${offset.toString()}: no endpoints found`
      );

    const client = this.getStreamConsumerClient(endpoint);
    const events = await client.getEvents(stream, offset, count, direction);

    // store last event's offset endpoint to the cache
    if (direction == "next" && events.length > 0) {
      const lastOffset = events[events.length - 1].offset;
      this.offsetsCache.set(stream + lastOffset.toString(), endpoint);
    }

    return events;
  }

  public async streamEvents(
    stream: string,
    offset: Offset
  ): Promise<PausableStream<StreamEvent>> {
    let endpoint = await this.findEndpointFor(stream, offset);
    if (!endpoint)
      throw new Error(
        `Can't fetch events for stream ${stream} ${offset.toString()}: no endpoints found`
      );

    const controller = new SimplePauseController();
    return PausableStream.create<StreamEvent>(subscriber => {
      let currentOffset = offset;
      let currentEventStream: PausableStream<StreamEvent>;
      let currentEventSubscription: Subscription;

      const init = async (waitFor?: number) => {
        if (waitFor) await sleep(waitFor);
        if (currentEventSubscription) {
          console.log("unsubscribe from streamdb");
          currentEventSubscription.unsubscribe();
        }

        endpoint = await this.findEndpointFor(stream, currentOffset);
        if (!endpoint) {
          subscriber.error(
            `no endpoint for offset ${currentOffset.toString()}`
          );
          return;
        }

        //new StreamDBConsumerClient(endpoint)
        const client = this.getStreamConsumerClient(endpoint);
        currentEventStream = client.getEventsStream(
          stream,
          currentOffset,
          controller
        );

        currentEventSubscription = currentEventStream.observable.subscribe({
          next: v => {
            currentOffset = v.offset;
            subscriber.next(v);
          },
          error: err => {
            console.log("got error", err);
            init(5000);
          },
          complete: () => {
            init();
          },
        });
      };

      init();

      return () => {
        if (currentEventSubscription) currentEventSubscription.unsubscribe();
      };
    }, controller);
  }

  private async findEndpointFor(
    stream: string,
    offset: Offset
  ): Promise<StreamEndpoint | undefined> {
    const cacheKey = stream + offset.toString();
    const cachedEndpoint = this.offsetsCache.get<StreamEndpoint>(cacheKey);
    if (cachedEndpoint) return cachedEndpoint;

    const endpoints: StreamEndpoint[] = await this.registry.getStreamEndpoints(
      stream,
      offset
    );

    const endpoint = _.maxBy(
      endpoints,
      x => x.stats.end?.height ?? Number.MAX_VALUE
    );
    if (endpoint) this.offsetsCache.set(cacheKey, endpoint);
    return endpoint;
  }

  private getStreamConsumerClient(endpoint: StreamEndpoint) {
    return (
      this.clients[endpoint.uri] ??
      (this.clients[endpoint.uri] = new StreamDBConsumerHttpClient(endpoint.httpUri ?? endpoint.uri)) // todo: throw?
    );
  }
}

export interface StreamClientOptions {
  registry?: StreamRegistry;
}
