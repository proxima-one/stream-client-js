# StreamDB Client JS

## Installation

StreamDB Client requires [Node.js](https://nodejs.org/) v12+ to run.

Install @proximaone/stream-client-js package.
```sh
yarn add @proximaone/stream-client-js
```

Install the dependencies and devDependencies.

```sh
yarn install
```

## Client Usage 

Client for StreamDB uses generated gRPC stubs to provide fast access to data. 

```typescript 
    const client = new StreamClient({});
    const name = "eth-main-blockheader0.new-runtime"
    const stream =  await client.getStream(name)
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

  main().catch(err => console.error(err));
```
