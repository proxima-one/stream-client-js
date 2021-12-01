// @ts-ignore
import { Bytes } from "./bytes";

describe("bytes", () => {
  it("should create and convert bytes", () => {
    const bytes = Bytes.fromHexString("0x59f9d9ccd4818a30705a87d4b993126be6e231f318520426e1ceac4f0294f9de");
    const restoredBytes = Bytes.fromByteArray(bytes.toByteArray());

    expect(bytes.toByteArray()).toEqual(restoredBytes.toByteArray());
    expect(bytes.toHexString()).toEqual(restoredBytes.toHexString());
  });
});
