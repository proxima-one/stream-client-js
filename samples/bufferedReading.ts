import { ProximaStreamClient, Offset, BufferedStreamReader } from "..";
import { strict as assert } from "assert";

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const client = new ProximaStreamClient();
    const name = "proxima.eth-main.blocks.1_0";
    const pausable = await client.streamEvents(name, Offset.zero);
    const bufferedStream = BufferedStreamReader.fromStream(pausable);
    const chunkSize = 1000;
    while (true) {
        const chunk = await bufferedStream.read(chunkSize);
        if (chunk === undefined) {
            console.log("Completed");
            break;
        }
        assert(chunk.length <= chunkSize);
        console.log(`Processing batch from ${chunk[0].offset} to ${chunk[chunk.length - 1].offset}...`);
        await sleep(500);
    }
}

main().catch(err => console.error(err));
