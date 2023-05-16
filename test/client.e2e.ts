import { Offset, ProximaStreamClient, StreamRegistryClient, StreamEndpoint } from "../src"
import { strict as assert } from "assert";
import { firstValueFrom, take, toArray } from "rxjs";

const streamTests = [{
  stream: "proxima.eth-main.blocks.1_0",
  timestamp: 1438473608000,
}, {
  stream: "proxima.exchange-rates.0_1",
  timestamp: 1438473600000,
}];

describe("StreamRegistryClient", () => {
  it("should get all streams", async () => {
    const registry = new StreamRegistryClient();
    const streams = await registry.getStreams();
    expect(streams.length).toBeGreaterThan(0);
  });

  for (const test of streamTests) {
    it("should be able to search for streams", async () => {
      const registry = new StreamRegistryClient();
      const stream = await registry.findStream(test.stream);
      const badStream = await registry.findStream("not-existing-stream");
      expect(badStream).toBeUndefined();

      expect(stream).toBeDefined();
      expect(stream!.name).toBe(test.stream)

      const filter = {
        labels: {
          "encoding": "json",
        }
      }

      const streams = await registry.findStreams(filter)
      expect(streams.length).toBeGreaterThan(0)
      streams.forEach((value) => {
        expect(value.metadata.labels["encoding"]).toBe("json")
      })
    })

    it("should be able to find offsets", async () => {
      const registry = new StreamRegistryClient();

      const badOffset = await registry.findOffset(test.stream, {height: 1000000000});
      expect(badOffset).toBeUndefined();

      const offset = await registry.findOffset(test.stream, {height: 999});
      expect(offset).toBeDefined();
      expect(offset!.height.toString()).toBe("999");

      const badTimestampOffset = await registry.findOffset(test.stream, {timestampMs: new Date().getTime() + 1000000});
      expect(badTimestampOffset).toBeUndefined();

      const timestampOffset = await registry.findOffset(test.stream, {timestampMs: test.timestamp});
      expect(timestampOffset).toBeDefined();
      expect(timestampOffset!.timestamp.epochMs).toBe(test.timestamp);
    });
  }
});

describe("ProximaStreamClient", () => {
  jest.setTimeout(30000);

  const registry = new StreamRegistryClient();

  for (const test of streamTests) {
    it("should fetch events of existing stream", async () => {
      const client = new ProximaStreamClient();
      const offset = await registry.findOffset(test.stream, {height: 777});
      assert(offset);

      const count = 100;

      const nextEvents = await client.fetchEvents(test.stream, offset, count, "next");
      expect(nextEvents).toMatchSnapshot();
      expect(nextEvents.length).toBe(count);
      expect(nextEvents[0].offset.height).toBe(offset.height + BigInt(1));

      const lastEvents = await client.fetchEvents(test.stream, offset, count, "last");
      expect(lastEvents).toMatchSnapshot();
      expect(lastEvents.length).toBe(count);
      expect(lastEvents[lastEvents.length - 1].offset.height).toBe(offset.height);
    });

    it("should stream events from existing stream", async () => {
      const client = new ProximaStreamClient();
      const offset = Offset.zero;

      const stream = await client.streamEvents(test.stream, offset);
      expect(stream).toBeDefined();

      const firstEvents = await firstValueFrom(stream.observable.pipe(take(100), toArray()));
      expect(firstEvents.length).toBe(100);
    });

    it("should fetch events from existing stream and provided single streamdb instance", async () => {
      const client = new ProximaStreamClient({registry});
      const offset = Offset.zero;
      const count = 100;

      const nextEvents = await client.fetchEvents(test.stream, offset, count, "next")
      expect(nextEvents).toMatchSnapshot();
      expect(nextEvents.length).toBe(100);
    });

    it("should return zero events if fetching from zero with last direction", async () => {
      const client = new ProximaStreamClient({registry});
      const offset = Offset.zero;
      const count = 100;
      const lastEvents = await client.fetchEvents(test.stream, offset, count, "last")
      expect(lastEvents).toHaveLength(0);
    });
  }
});
