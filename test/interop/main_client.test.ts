import { StreamClient} from "../../src";
import { firstValueFrom, map, take, toArray } from "rxjs";

const testEndpoint = "https://stream-api.cluster.amur-dev.proxima.one";

describe("StreamClient", () => {
  let client: StreamClient;
  beforeEach(() => {
    client = new StreamClient({});
  });

  it("should get stream endpoints and data", async () => {
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
    expect(stream.metadata).toMatchSnapshot();
    expect(stream.endpoints).toBeDefined()
    expect(stream.name).toMatch(name)
  });

  it("should get an offset for a specified height and/or timestamp", async () => {
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
    expect(stream).toBeDefined()
    expect(stream.stats).toBeDefined()
    const height = stream.stats.start.height
    const offset = await client.findOffset(name, {height: Number(height) + 10})
    expect(offset).toMatchSnapshot()
    const events = await client.fetchEvents(name, offset, 100, "next")
    expect(events).toMatchSnapshot()
  });

  it("should be able to stream events in pausable stream", async () => {
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
    expect(stream).toBeDefined()
    expect(stream.stats).toBeDefined()
    const height = stream.stats.start.height
    const offset = await client.findOffset(name, {height: Number(height) + 10})
    expect(offset).toMatchSnapshot()
    const eventsStream = await client.streamEvents(name, offset)
    expect(eventsStream).toBeDefined()
  });
});
