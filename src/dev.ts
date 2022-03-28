import { StreamClient } from "./client";
import { catchError } from "rxjs";
import { StreamReader } from "./streamReader";

const testEndpoint = "streams.proxima.one:443";
const client = new StreamClient(testEndpoint);

let lastEventTs = -1;
async function main() {
  const streamReader = new StreamReader(client, "v4.domain-events.polygon-mumbai.mangrove.streams.proxima.one");

  while(true) {
    const messages = await streamReader.tryRead(1000, 10 * 60 * 1000);
    for(const message of messages) {
      console.log(message.id);
    }
  }
}

main().catch(err => {
  console.error(err);
});
