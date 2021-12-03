import { ChannelCredentials, credentials } from "@grpc/grpc-js";
import {ProximaStreamsServiceClient} from "../../src"

describe("proxima streams e2e", () => {

  describe("Proxima Stream Consume Messages", () => {
    let IsConnected: boolean
    let streamClient: ProximaStreamsServiceClient

    beforeAll(() => {
      const streamAddress = "streamdb.cluster.prod.proxima.one:443"
      const streamCredentials = credentials.createInsecure()
      streamClient = new ProximaStreamsServiceClient(streamAddress, streamCredentials)
      IsConnected = true
    });
  
    afterAll(() => {});

    it("Should be connecting to the endpoints", () => {
      expect(IsConnected).toBeTruthy()
      console.log(streamClient)
    });

    it("should be able to consume messages at start point from stream endpoint", async () => {
      jest.setTimeout(100 * 1000);
      const starting = 10000000

      
      throw new Error("Not implemented")
      //const response = await QueryExecutor.execute(web3, query);
      // expect(response.blockHeaders).toHaveLength(1);
      // const firstBlock = response.blockHeaders[0];
      // expect(firstBlock.number).toBe(0);
      // expect(response).toMatchSnapshot();
    });

    it("should query blocks range", async () => {
      jest.setTimeout(100 * 1000);

      throw new Error("Not implemented")
      // const query = core.BlockHeadersQuery.create(1000000, 100);
      // const response = await QueryExecutor.execute(web3, query);

      // expect(response.blockHeaders).toHaveLength(query.count);
      // for (let i = 0; i < response.blockHeaders.length; i++) {
      //   expect(response.blockHeaders[i].number).toBe(query.from + i);
      // }
      // expect(response).toMatchSnapshot();
    });
  });
});
