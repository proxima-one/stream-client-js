import { State } from "./model";
import { StreamReader } from "./streamReader";
import { ProximaStreamsClient } from "./client";

const testEndpoint = "streams.proxima.one:443";
const client = new ProximaStreamsClient(testEndpoint);

async function main() {
  const streamReader = new StreamReader(
    client,
    "v4.domain-events.polygon-mumbai.mangrove.streams.proxima.one",
    State.genesis
  );

  while (true) {
    const transitions = await streamReader.tryRead(1000, 10 * 60 * 1000);

    for (const transition of transitions) {
      console.log(transition.newState);
    }
  }
}

main().catch((err) => {
  console.error(err);
});
