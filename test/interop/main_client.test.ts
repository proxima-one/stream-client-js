import { RemoteStreamRegistry, StreamClient} from "../../src";
import { firstValueFrom, map, take, toArray } from "rxjs";
import { Offset } from "../../src/gen/model/v1/model";
import { strict as assert } from "assert";

//const testEndpoint = "https://stream-api.cluster.amur-dev.proxima.one";
const testEndpoint = "http://localhost:7000"
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
    expect(stream.metadata).toMatchSnapshot();
    expect(stream.endpoints).toBeDefined()
    expect(stream.name).toMatch(name)
  });

  it("should get an offset for a specified height and/or timestamp", async () => {
    jest.setTimeout(30000)
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
    expect(stream).toBeDefined()
    expect(stream.stats).toBeDefined()
    assert(stream.stats)
    const height = stream.stats.start.height || 0
    const offset = await client.findOffset(name, {height: Number(height)})
    expect(offset).toBeDefined()
    expect(offset).toMatchSnapshot()
    assert(offset)
    const events = await client.fetchEvents(name, offset, 100, "next")
    expect(events).toMatchSnapshot()
    const newOffset = await client.findOffset(name, {height: Number(height) + 1000})
    const endHeight = stream.stats.end.height
    //await client.findOffset(name, {height: Number(endHeight)-1})
    await client.findOffset(name, {height: Number(height) + 20})
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
    const height = stream.stats.start.height || 0
    const newOffset = await client.findOffset(name, {height: Number(height) + 1})
    assert(newOffset)
    const newEvents = (await (await client.streamEvents(name, newOffset))).observable.subscribe((e) => {
      expect(e).toMatchSnapshot()
      return e
    })
  });
});
