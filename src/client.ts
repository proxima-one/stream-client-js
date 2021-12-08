import * as grpc from "@grpc/grpc-js";
import * as ProximaService from "./gen/proto/messages/v1alpha1/messages_grpc_pb";
import * as ProximaServiceTypes from "./gen/proto/messages/v1alpha1/messages_pb";


export class StreamClient {
    private client: ProximaService.MessagesServiceClient

    public constructor(uri: string,
            auth: string = '') {
            const secure = uri.includes(":443")
            let credentials = secure ? grpc.credentials.createSsl() : grpc.credentials.createInsecure() 
            this.client = new ProximaService.MessagesServiceClient(uri, credentials)
    }

    public streamMessages(streamId: string, latest: string) {
        let request = new ProximaServiceTypes.StreamMessagesRequest()
        .setStreamId(streamId)
        .setLastMessageId(latest)
        return this.client.streamMessages(request)
    }

    public async getNextMessages(streamId: string, latest: string, messageCount: number): Promise<ProximaServiceTypes.GetNextMessagesResponse> {
        let request = new ProximaServiceTypes.GetNextMessagesRequest()
        .setStreamId(streamId)
        .setLastMessageId(latest)
        .setCount(messageCount)

        return new Promise<ProximaServiceTypes.GetNextMessagesResponse>((resolve, reject) => {
            this.client.getNextMessages(request, (err, response: ProximaServiceTypes.GetNextMessagesResponse) => {
                if (err != null) {
                    console.log(`[execute query] err:\nerr.message: ${err.message}\nerr.stack:\n${err.stack}`);
                    reject(err); return;
                }
                resolve(response)
            }) 
        })
    }
}