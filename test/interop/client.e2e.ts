import { ProximaStreamsClient, State, StreamStateRef } from "../../src";
import { firstValueFrom, map, take, toArray } from "rxjs";

const testEndpoint = "streams.proxima.one:443";

describe("StreamClient", () => {
  let client: ProximaStreamsClient;
  beforeEach(() => {
    client = new ProximaStreamsClient(testEndpoint);
  });

  it("should fetch eth block headers", async () => {
    const blockHeaderTransitions = await client.getTransitionsAfter(
      new StreamStateRef("eth-main-blockheader.streams.proxima.one", State.genesis), 10
    );

    expect(blockHeaderTransitions.map(x => x.event.payloadAsJson)).toMatchSnapshot();
  });

  it("should stream events", async () => {
    const blockHeadersStream = client
      .streamTransitionsAfter(new StreamStateRef("eth-main-blockheader.streams.proxima.one", State.genesis))
      .pipe(map((x) => x.event.payloadAsJson));

    const firstBlockHeaders = await firstValueFrom(
      blockHeadersStream.pipe(take(10), toArray())
    );

    expect(firstBlockHeaders).toMatchSnapshot();
  });
});
