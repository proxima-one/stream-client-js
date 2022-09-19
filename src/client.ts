import { Stream } from "./model/stream";
import { StreamDBConsumerClient } from "./stream-db/streamDbDatabase";
import {
    StreamInfo,
    Offset, StateTransition, PausableStream, SimplePauseController
  } from "@proxima-one/proxima-streams";
import axios from "axios";


export class ProximaStreamsClient {
    public endpoint;
    constructor(endpoint = "https://stream-api.cluster.amur-dev.proxima.one") {
        this.endpoint = endpoint
    }

    async getStreams(): Promise<Stream[]> {
        try {
            const streams = await axios.get(this.endpoint + "/streams")
            return streams.data
        } catch(e) {
            console.log(e)
            return []
        }
    }

    async getStream(name: string, retries = 10): Promise<Stream | undefined> {
        try {
            const resp = await axios.get(this.endpoint + "/stream:" + name)
            if (resp.data) {
                const stream = resp.data
                return stream
            }  else if (retries > 0) {
                return this.getStream(name, retries - 1)
            } else {
                throw new Error("Cannot get stream")
            }
        } catch(e) {
            console.log(e)
            return undefined
        }
    }

    async getStreamConsumer(name: string, retries = 10): Promise<StreamDBConsumerClient> {
        try {
            const stream = await this.getStream(name)
            if (stream && stream.endpoints && stream.endpoints.length > 0) {
                return new StreamDBConsumerClient(stream.endpoints[0])
            } else if (retries > 0) {
                return this.getStreamConsumer(name, retries - 1)
            } else {
                throw new Error("Cannot get stream client")
            }
        } catch(e) {
            console.log(e)
            throw new Error("Cannot get stream client" + e)
        }
    }

    async findOffset(stream: string, height: bigint) {
        try {
            const consumer = await this.getStreamConsumer(stream)
            if (consumer) {
                return consumer.findOffset(stream, height)
            }
            return undefined
        } catch(e) {
            console.log(e)
            return undefined
        }
    }

    async getStateTransitions(stream: string, offset: Offset, count: number, direction: "next" | "last") {
        try {
            const consumer = await this.getStreamConsumer(stream)
            if (consumer) {
                return await consumer.getStateTransitions(stream, offset, count, direction)
            } 
            return undefined
        } catch(e) {
            console.log(e)
            return undefined
        }
    }

    async streamStateTransitions(stream: string, offset: Offset): Promise<PausableStream<StateTransition>> {
        try {
            const consumer = await this.getStreamConsumer(stream)
            if (consumer) {
                return await consumer.streamStateTransitions(stream, offset)
            } else {
                throw new Error("Could not get pausable stream")
            }
        } catch(e) {
            console.log(e)
            throw new Error("Could not get pausable stream" + e)
        }
    }
}