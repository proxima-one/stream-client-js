import { StreamClient } from "../../src";
import { firstValueFrom, flatMap, take, toArray } from "rxjs";

const testEndpoint = "streamdb.cluster.prod.proxima.one:443";

function decodeJson(binary: Uint8Array | string): any {
  const buffer =
    typeof binary == "string"
      ? Buffer.from(binary, "base64")
      : Buffer.from(binary);
  return JSON.parse(buffer.toString("utf8"));
}

describe("StreamClient", () => {
  let client: StreamClient;
  beforeEach(() => {
    client = new StreamClient(testEndpoint);
  });

  it("should fetch eth block headers", async () => {
    const blockHeadersResponse = await client.getNextMessages(
      "eth-main-headers",
      10
    );
    const blockHeaders = blockHeadersResponse.messagesList.map((x) =>
      decodeJson(x.payload)
    );

    expect(blockHeaders).toMatchSnapshot();
  });

  it("should stream eth block headers", async () => {
    const blockHeadersStream = client
      .streamMessages("eth-main-headers")
      .pipe(
        flatMap((response) =>
          response.messagesList.map((x) => decodeJson(x.payload))
        )
      );

    const firstBlockHeaders = await firstValueFrom(
      blockHeadersStream.pipe(take(10), toArray())
    );

    expect(firstBlockHeaders).toMatchSnapshot();
  });
});
