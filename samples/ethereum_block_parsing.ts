import { strict as assert } from "assert";
import { StreamClient, decodeJson } from "../src/index";

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

main().catch(err => console.error(err));
