import { ProximaStreamClient, Offset } from "..";

export function decodeJson(binary: Uint8Array): any {
    const buffer = Buffer.from(binary);
    return JSON.parse(buffer.toString("utf8"));
}

async function main() {
    const client = new ProximaStreamClient();
    const name = "proxima.eth-main.blocks.1_0";
    const pauseable = await client.streamEvents(name, Offset.zero);
    pauseable.observable.forEach(event => {
        console.log({
            offset: event.offset,
            payload: decodeJson(event.payload),
            undo: event.undo,
            timestamp: event.timestamp,
        });
    });
}

main().catch(err => console.error(err));
