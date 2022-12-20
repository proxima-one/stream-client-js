import { Offset, ProximaStreamClient, SingleStreamDbRegistry, StreamRegistryClient } from "../src"
import { strict as assert } from "assert";
import { firstValueFrom, take, toArray } from "rxjs";

const testStream = "proxima.eth-main.blocks.1_0"

describe("StreamRegistryClient", () => {
  it("should get all streams", async () => {
    const registry = new StreamRegistryClient();
    const streams = await registry.getStreams();
    expect(streams.length).toBeGreaterThan(0);
  });

  it("should be able to search for streams", async () => {
    const registry = new StreamRegistryClient();
    const stream = await registry.findStream(testStream);
    const badStream = await registry.findStream("not-existing-stream");
    expect(badStream).toBeUndefined();

    expect(stream).toBeDefined();
    expect(stream!.name).toBe(testStream)

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

    const badOffset = await registry.findOffset(testStream, {height: 100000000});
    expect(badOffset).toBeUndefined();

    const offset = await registry.findOffset(testStream, {height: 15983284});
    expect(offset).toBeDefined();
    expect(offset!.height.toString()).toBe("15983284");

    const badTimestampOffset = await registry.findOffset(testStream, {timestampMs: new Date().getTime() + 1000000});
    expect(badTimestampOffset).toBeUndefined();

    const timestampOffset = await registry.findOffset(testStream, {timestampMs: 1668610127000});
    expect(timestampOffset).toBeDefined();
    expect(timestampOffset!.timestamp.epochMs).toBe(1668610127000);
  });
});

describe("ProximaStreamClient", () => {
  jest.setTimeout(30000);

  const registry = new StreamRegistryClient();

  it("should fetch events of existing stream", async () => {
    const client = new ProximaStreamClient();
    const offset = await registry.findOffset(testStream, {height: 15983284});
    assert(offset);

    const count = 100;

    const nextEvents = await client.fetchEvents(testStream, offset, count, "next");
    expect(nextEvents).toMatchSnapshot();
    expect(nextEvents.length).toBe(count);
    expect(nextEvents[0].offset.height).toBe(offset.height + BigInt(1));

    const lastEvents = await client.fetchEvents(testStream, offset, count, "last");
    expect(lastEvents).toMatchSnapshot();
    expect(lastEvents.length).toBe(count);
    expect(lastEvents[lastEvents.length-1].offset.height).toBe(offset.height);
  });

  it("should stream events from existing stream", async () => {
    const client = new ProximaStreamClient();
    const offset = Offset.zero;

    const stream = await client.streamEvents(testStream, offset);
    expect(stream).toBeDefined();

    const firstEvents = await firstValueFrom(stream.observable.pipe(take(100), toArray()));
    expect(firstEvents.length).toBe(100);
  });

  it("should fetch events from existing stream and provided single streamdb instance", async () => {
    const streamDbUri = "streams.buh.apps.proxima.one:443";
    const client = new ProximaStreamClient({registry: new SingleStreamDbRegistry(streamDbUri)});
    const offset = Offset.zero;
    const count = 100;

    const nextEvents = await client.fetchEvents(testStream, offset, count, "next")
    expect(nextEvents).toMatchSnapshot();
    expect(nextEvents.length).toBe(100);
  });
});
