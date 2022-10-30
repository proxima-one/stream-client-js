import { Offset } from "./model";
import { ProximaStreamClient, SingleStreamDbRegistry } from "./client";
import { BufferedStreamReader } from "./lib/reader";
import { sleep } from "./utils";

async function main() {
  // connect to local StreamDB
  // const client = new ProximaStreamClient({
  //   registry: new SingleStreamDbRegistry("localhost:50051"),
  // });

  // by default connect through Stream Registry
  const client = new ProximaStreamClient();

  let currentOffset = Offset.zero;
  for (let i = 0; i < 100; i++) {
    const events = await client.fetchEvents("proxima.eth-main.blocks.1_0", currentOffset, 100, "next");
    currentOffset = events[events.length - 1].offset;

    console.log(`fetched till ${currentOffset.toString()}`);
  }

  console.log("starting the stream");

  const stream = await client.streamEvents("proxima.eth-main.blocks.1_0", Offset.zero);
  const reader = BufferedStreamReader.fromStream(stream, 10000);

  while (true) {
    const batch = await reader.read(100);
    if (!batch)
      break;

    console.log(`doing some stuff with a batch of ${batch.length}. ${batch[batch.length-1].offset.toString()}`);
    await sleep(100);
  }
}

main();
