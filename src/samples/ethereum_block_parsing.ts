import { strict as assert } from "assert";
import { StreamClient } from "../index";

async function main() {
  console.log(`Running stream client for a simple example...`);
  const client = new StreamClient({});
  const name = "eth-main-blockheader0.new-runtime";
  console.log(`Getting stream: ${name}...`);
  const stream = await client.getStream(name);
  console.log(`Success! Fetched stream ${stream}`);
  assert(stream.stats);
  const height = 1;
  const offset = await client.findOffset(name, Number(height) + 1);
  console.log(`Consuming stream ${name} from offset ${offset}`);
  assert(offset);
  const pausable = await client.streamEvents(name, offset);
  pausable.observable.subscribe(async event => {
    const e = {
      offset: event.offset,
      payload: decodeJson(event.payload),
      undo: event.undo,
      timestamp: event.timestamp,
    };
    return e;
  });
}

function decodeJson(binary: Uint8Array | string): any {
  const buffer =
    typeof binary == "string"
      ? Buffer.from(binary, "base64")
      : Buffer.from(binary);
  return JSON.parse(buffer.toString("utf8"));
}

main().catch(err => console.error(err));
