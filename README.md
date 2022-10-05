# StreamDB Client JS

## Installation

StreamDB Client requires [Node.js](https://nodejs.org/) v12+ to run.

Install @proximaone/streamdb-client-js package 
```sh
yarn add @proximaone/streamdb-client-js
```

Install the dependencies and devDependencies.

```sh
yarn install
```

## Client Usage 

Client for StreamDB uses generated gRPC stubs to provide fast access to data. 

### Installation 

```typescript 

import { StreamClient } from "../src";
import { map } from "rxjs";


async function main() {
    console.log(`Running stream client for a simple example...`)
    const client = new StreamClient({});
    const name = "eth-main-blockheader0.new-runtime"
    console.log(`Getting stream: ${name}...`)
    const stream =  await client.getStream(name)
    console.log(`Success! Fetched stream ${stream.toString()}`)
    const height = stream.stats.start.height
    const offset = await client.findOffset(name, {height: Number(height)})
    console.log(`Consuming stream ${name} from offset ${offset}`)
    const pausable = await client.streamEvents(name, offset) 
    pausable.observable.pipe(map(event => {
            const e =  {
              offset: event.offset,
              payload: decodeJson(event.payload),
              undo: event.undo,
              timestamp: event.timestamp,
            };
            console.log(e)
            return e
    }))
}
function decodeJson(binary: Uint8Array | string): any {
    const buffer =
      typeof binary == "string"
        ? Buffer.from(binary, "base64")
        : Buffer.from(binary);
    return JSON.parse(buffer.toString("utf8"));
  }

  main().catch(err => console.error(err));
```
