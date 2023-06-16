import { StreamDBConsumerClient } from "../streamdb/consumerClient";
import { PausableStream, SimplePauseController } from "../lib/pausableStream";
import { Offset, StreamEndpoint, StreamEvent, Timestamp } from "../model";
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
  private readonly apiKey?: string;

  public constructor(
    private readonly options: StreamClientOptions = {
      registry: new StreamRegistryClient(),
    }
  ) {
    this.registry = options.registry ?? new StreamRegistryClient();
    this.apiKey = options.apiKey ?? this.registry.getApiKey();
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

    const client = this.getStreamConsumerClient(endpoint.uri);
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
        const client = this.getStreamConsumerClient(endpoint.uri);
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


  public async multipleStreamEvents(
    streams: {stream: string,
    offset: Offset}[]
  ): Promise<PausableStream<StreamEvent>> {
    const controller = new SimplePauseController();
    return PausableStream.create<StreamEvent>(subscriber => {

      const init = async (waitFor?: number) => {
        if (waitFor) await sleep(waitFor);

         const current = streams.reduce((acc: StreamCurrentState, curr) => {
           acc[curr.stream] = { offset: curr.offset, events: [] };
           return acc;
         }, {});

         while (true) {
           let timestampTill = new Timestamp(Number.MAX_VALUE);
           for (const streamItem of streams) {
             const stream = streamItem.stream;

             const events = current[stream].events.length > 0
               ? current[stream].events
               : await this.fetchEvents(
                 stream,
                 current[stream].offset,
                 100,
                 "next"
               );

             const offset = events[events.length - 1].offset;
             current[stream].offset = offset;
             current[stream].events = events;

             if (offset.timestamp.lessThan(timestampTill)) {
               timestampTill = offset.timestamp
             }

             console.log(`fetched till ${current[stream].offset.toString()}`);
           }

           for (const streamItem of streams) {
             const stream = streamItem.stream;
             const pausedEvents = [];
             for (const event of current[stream].events) {
               if (event.timestamp.lessThanOrEqual(timestampTill))
                 subscriber.next(event);
               else
                 pausedEvents.push(event);
             }

             current[stream].events = pausedEvents;
           }
         }
      };

      init();

      return () => { };
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

  private getStreamConsumerClient(endpoint: string) {
    return (
      this.clients[endpoint] ??
      (this.clients[endpoint] = new StreamDBConsumerClient(
        endpoint,
        this.apiKey
      ))
    );
  }
}

export interface StreamClientOptions {
  registry?: StreamRegistry;
  apiKey?: string;
}

interface StreamCurrentState {
  [key: string]: { offset: Offset, events: StreamEvent[] };
}
