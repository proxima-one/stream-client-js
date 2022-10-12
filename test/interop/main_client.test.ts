import { RemoteStreamRegistry, StreamClient} from "../../src";
import { strict as assert } from "assert";
import { Offset } from "../../src/model/offset";

const testEndpoint = "https://stream-api.cluster.amur-dev.proxima.one";
//const testEndpoint = "http://localhost:7000"
jest.setTimeout(30000)

describe("StreamClient", () => {
  let client: StreamClient;
  beforeEach(() => {
    client = new StreamClient({registry: new RemoteStreamRegistry(testEndpoint)});
  });

  it("should get stream endpoints and data", async () => {
    jest.setTimeout(30000)
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
    console.log(stream)
    expect(stream.metadata).toMatchSnapshot();
    expect(stream.endpoints).toBeDefined()
    expect(stream.name).toMatch(name)
  });

  it("should be able to get single stream, sttreams, and select stream", async () => {
    jest.setTimeout(30000)
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
    console.log(stream)
    expect(stream.metadata).toMatchSnapshot();
    expect(stream.endpoints).toBeDefined()
    expect(stream.name).toMatch(name)

    const allStreams = await client.getStreams()
    expect(allStreams).toMatchSnapshot();
    expect(allStreams.length).toBeGreaterThan(0);
  });

  it("should get an offset for a specified height and/or timestamp", async () => {
    jest.setTimeout(30000)
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
    expect(stream).toBeDefined()
    expect(stream.stats).toBeDefined()
    assert(stream.stats)
    const height = 1
    const offset = await client.findOffset(name, Number(height))
    console.log(offset)
    expect(offset).toBeDefined()
    expect(offset).toMatchSnapshot()
    assert(offset)
    const events = await client.fetchEvents(name, offset, 100, "next")
    expect(events).toMatchSnapshot()
    const newOffset = await client.findOffset(name, Number(height) + 1000)
    console.log(newOffset)
    assert(stream.stats.end)
    const endHeight = Offset.parse(stream.stats.end).height
    await client.findOffset(name, Number(height) + 20)
    assert(newOffset)
    const newEvents = await client.fetchEvents(name, newOffset, 100, "next")
    expect(newEvents).toMatchSnapshot()
  });

  it("should be able to stream events in pausable stream", async () => {
    jest.setTimeout(30000)
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
    expect(stream).toBeDefined()
    expect(stream.stats).toBeDefined()
    assert(stream.stats)
    const height = 1
    const newOffset = await client.findOffset(name, Number(height))
    assert(newOffset)
    // const newEvents = (await (await client.streamEvents(name, newOffset))).observable.subscribe((e) => {
    //   expect(e).toMatchSnapshot()
    //   return e
    // })
  });
});
