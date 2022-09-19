import { ProximaStreamsClient} from "../../src";
import { firstValueFrom, map, take, toArray } from "rxjs";

const testEndpoint = "https://stream-api.cluster.amur-dev.proxima.one";

describe("MainStreamClient", () => {
  let client: ProximaStreamsClient;
  beforeEach(() => {
    client = new ProximaStreamsClient(testEndpoint);
  });

  it("should get all streams", async () => {
    const streams =  await client.getStreams()
    expect(
      streams.map((x) =>
        x.meta
      )
    ).toMatchSnapshot();
  });

  it("should get a single stream information", async () => {
    const streams = await client.getStreams()
    const stream_name = ""
    const stream = await client.getStream(stream_name)
    //expect(stream).toBeDefined()
    //expect(JSON.parse(stream.meta.toString("utf8"))).toMatchSnapshot();
  });

  // it("should get a single stream consumer for streamdbv2", async () => {
  //   const stream_name = "polygon-mumbai-blockheader.streams.proxima.one"
  //   const streamConsumer = await client.getStreamConsumer(stream_name)
  // });

  // it("should get a single streams", async () => {
  //   const stream_name = "polygon-mumbai-blockheader.streams.proxima.one"
  //   const streamConsumer = await client.getStreamConsumer(stream_name)
  // });
});
