import { StreamDBConsumerClient } from "./streamdb/consumerClient";
import { Offset } from "./model";

async function main() {
  const streamDb = new StreamDBConsumerClient("localhost:50051");
  //const streamDb = new StreamDBConsumerClient("core-us-proxy.core-us-proxy.buh.apps.proxima.one:443");
  const stream = await streamDb.streamStateTransitions(
    "proxima.eth-main.blocks.1_0",
    ""
  );

  stream.observable.subscribe(stateTransition => {
    console.log(`Offset: ${stateTransition.offset.toString()}`);
  });

  let action = 0;
  setInterval(() => {
    if (action++ % 2 == 0) stream.controller.pause();
    else stream.controller.resume();
  }, 3000);
}

main();
