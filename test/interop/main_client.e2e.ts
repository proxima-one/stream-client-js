import { StreamRegistryClient, ProximaStreamClient, SingleStreamDbRegistry, Offset } from "../../src"

const STREAM_NAME = "proxima.eth-main.blocks.1_0"

describe("StreamRegistryClient", () => {
  jest.setTimeout(30000);

  it("should get all streams", async () => {
      const registry = new StreamRegistryClient()
      const streams = await registry.getStreams()
      expect(streams.length).toBeGreaterThan(0)
  });

  it("should be able to search for streams",  async () => {
      const registry = new StreamRegistryClient()
      const stream = await registry.findStream(STREAM_NAME)
      expect(stream).toBeDefined()
      if (stream) { expect(stream.name).toBe(STREAM_NAME) }

      const filter = {
        labels: {
        "encoding": "json",
      }}
      const streams = await registry.findStreams(filter)
      expect(streams.length).toBeGreaterThan(0)
      streams.forEach((value) => {
        expect(value.metadata.labels["encoding"]).toBe("json")
      })
  })

  it("should be able to find offsets (good and bad)", async () => {
    const registry = new StreamRegistryClient()
    //by height
    const badOffset = await registry.findOffset(STREAM_NAME, 100000000)
    expect(badOffset).toBeUndefined()

    const offset = await registry.findOffset(STREAM_NAME, 15983284)
    expect(offset).toBeDefined()
    if (offset) {expect(offset.height.toString()).toBe("15983284")}

    //by timestamp
    const badTimestampOffset = await registry.findOffset(STREAM_NAME)
    expect(badTimestampOffset).toBeUndefined()

    const timestampOffset = await registry.findOffset(STREAM_NAME, 0, 1668610127000)
    expect(timestampOffset).toBeDefined()
    if (timestampOffset) {expect(timestampOffset.timestamp.epochMs).toBe(1668610127000)}

   })
});

describe("ProximaStreamClient", () => {
  jest.setTimeout(30000);

  it("should fetch events of existing stream", async () => {
      const client = new ProximaStreamClient()
      const offset = Offset.zero;
      const count = 1000

      const nextEvents = await client.fetchEvents(STREAM_NAME, offset, count, "next")
      expect(nextEvents).toMatchSnapshot()
      expect(nextEvents.length).toBe(1000)

      const lastEvents = await client.fetchEvents(STREAM_NAME, offset, count, "last")
      expect(lastEvents).toMatchSnapshot()
      expect(lastEvents.length).toBe(1000)
  });

  it("should stream events from existing stream", async () => {
    const STREAM_NAME = "proxima.eth-main.blocks.1_0"
    const client = new ProximaStreamClient()
    const offset = Offset.zero

    const pausableStream = await client.streamEvents(STREAM_NAME, offset)
    expect(pausableStream).toBeDefined()

  })

  it("should stream events from existing stream 2", async () => {
    const STREAM_NAME = "proxima.eth-main.blocks.1_0"
    const STREAM_DB_URI = "streams.buh.apps.proxima.one:443"
    const client = new ProximaStreamClient({registry: new SingleStreamDbRegistry(STREAM_DB_URI)})
    const offset = Offset.zero
    const count = 1000

    const nextEvents = await client.fetchEvents(STREAM_NAME, offset, count, "next")
    expect(nextEvents).toMatchSnapshot()
    expect(nextEvents.length).toBe(1000)
  })
});
