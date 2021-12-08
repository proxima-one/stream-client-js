import { ChannelCredentials, credentials } from "@grpc/grpc-js";
import {ProximaService, ProximaServiceTypes, StreamClient} from "../../src/"




describe("proxima streams e2e", () => {

  describe("Proxima Stream Consume Messages", () => {
    let IsConnected: boolean
    let streamClient: ProximaService.MessagesServiceClient

    beforeAll(() => {
      const streamAddress = "streamdb.cluster.prod.proxima.one:443"
      const streamCredentials = credentials.createInsecure()
      const streamSecureCredentials = credentials.createSsl()
      streamClient = new ProximaService.MessagesServiceClient(streamAddress, streamSecureCredentials)
      IsConnected = true
    });
  
    afterAll(() => {
    });

    it("Should be connecting to the endpoints", (done) => {
      expect(IsConnected).toBeTruthy()
      expect(streamClient).toBeTruthy()
      done()
      //streamClient.waitForReady()
    });

    it("should be able to consume messages at start point from stream endpoint", (done) => {
      jest.setTimeout(100 * 1000);
      let streamId = "multiplefi"
      let latest = ""
      let request = new ProximaServiceTypes.StreamMessagesRequest()
        .setStreamId(streamId)
        .setLastMessageId(latest)

      let messageStream = streamClient.streamMessages(request)
      messageStream.on("data", (data) => {
        done()
      })
    });

    it("should query blocks range", (done) => {
      jest.setTimeout(100 * 1000);
      let streamId = "multiplefi"
      let latest = ""
      let messageCount = 100
      let request = new ProximaServiceTypes.GetNextMessagesRequest()
        .setStreamId(streamId)
        .setLastMessageId(latest)
        .setCount(messageCount)
      
      streamClient.getNextMessages(request, (serviceError, responses) => {
        expect(serviceError).toBeFalsy()
        expect(responses).toMatchSnapshot();
        done()
      })
    });
  });
});
