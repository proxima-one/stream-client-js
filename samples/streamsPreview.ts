import { ProximaStreamClient, StreamRegistryClient, Offset } from "../build";
import { strict as assert } from "assert";

export function decodeJson(binary: Uint8Array): any {
    const buffer = Buffer.from(binary);
    return JSON.parse(buffer.toString("utf8"));
}

async function main() {
    const client = new ProximaStreamClient();
    const registryClient = new StreamRegistryClient();
    const streams = await registryClient.getStreams();
    await Promise.all(streams.map(async stream => {
        const encoding = stream.metadata.labels["encoding"];
        if (encoding != "json") {
            console.log(`Stream ${stream.name} (${stream.metadata.description}) has unknown encoding: ${encoding}`);
            return;
        }
        const events = await client.fetchEvents(stream.name, Offset.zero, 1, "next");
        assert(events.length == 1);
        const event = events.pop()!;
        console.log(`Stream: ${stream.name} (${stream.metadata.description})`);
        console.log(decodeJson(event.payload));
    }));
}

main().catch(err => console.error(err));
