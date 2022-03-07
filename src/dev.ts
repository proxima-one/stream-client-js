import { StreamClient } from "./client";
import { catchError } from "rxjs";

const testEndpoint = "streams.proxima.one:443";
const client = new StreamClient(testEndpoint);

let lastEventTs = -1;
async function main() {
  const stream = client
    .streamMessages("domain-events.mangrove.streams.proxima.one");

  stream
    .pipe(catchError(err => {
      const elapsed = new Date().getTime() - lastEventTs;
      console.log(`Waited for ${elapsed/1000} seconds`);
      throw err;
    }))
    .subscribe(x => {
    console.log(x.id);
    lastEventTs = new Date().getTime();
  });
}


main().catch(err => {
  console.error(err);
});
