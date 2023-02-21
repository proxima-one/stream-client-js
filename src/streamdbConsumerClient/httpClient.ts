import {Offset, StreamEvent} from "../model";
import {Axios} from "axios";
import {
  GetStateTransitionsResponse,
  StreamStateTransitionsResponse
} from "../gen/stream_consumer/v1alpha1/stream_consumer";
import {stateTransitionProtoToStreamEvent} from "../streamdb/converters";
import {PausableStream, StreamController} from "../lib/pausableStream";
import {ExponentialBackoff, WebsocketBuilder} from "websocket-ts";
import {StreamDBConsumerClient} from "./consumerClient";

export class StreamDBConsumerHttpClient implements StreamDBConsumerClient {
  private readonly client: Axios;

  constructor(private readonly uri: string) {
    this.client = new Axios({
      baseURL: this.uri,
      validateStatus: status =>
        (status >= 200 && status < 300) || status == 404,
    });
  }

  public getEvents(
    stream: string,
    offset: Offset,
    count: number,
    direction: "next" | "last"
  ): Promise<StreamEvent[]> {
    return this.client
      .post(`/api/consumer/${stream}/transitions`,
        JSON.stringify({
            offset: offset,
            count: count,
            direction: direction.toUpperCase(),
          }, (key, value) => (typeof value === "bigint" ? value.toString() : value)
        )
      ).then(resp =>
        (JSON.parse(resp.data) as GetStateTransitionsResponse)
          .stateTransitions
          .map(stateTransitionProtoToStreamEvent)
      );
  }

  public getEventsStream(
    stream: string,
    offset: Offset,
    controller?: StreamController
  ): PausableStream<StreamEvent> {
    return PausableStream.create<StreamEvent>((observer, _) => {
      new WebsocketBuilder(webSocketUriForOffset(this.uri, stream, offset))
        .onClose(() => observer.complete())
        .onError((_, ev) => observer.error(ev.type))
        .onMessage((_, ev) =>
          (JSON.parse(ev.data)["result"] as StreamStateTransitionsResponse)
            .stateTransition
            .map(stateTransitionProtoToStreamEvent)
            .forEach(transition => observer.next(transition)))
        .withBackoff(new ExponentialBackoff(100, 7))
        .build();
    }, controller);
  }
}

function webSocketUriForOffset(httpEndpoint: string, streamId: string, offset: Offset): string {
  const wsEndpoint = httpEndpoint
    .replace("https://", "wss://")
    .replace("http://", "ws://");

  const params = new URLSearchParams({
    "offset.height": offset.height.toString(),
    "offset.timestamp.epochMs": offset.timestamp.epochMs.toString(),
  });

  const parts = ["", ...offset.timestamp.parts].join("&offset.timestamp.parts=");

  return `${wsEndpoint}/api/consumer/${streamId}/stream?${params.toString()}${parts}`;
}
