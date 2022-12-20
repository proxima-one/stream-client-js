import { Offset } from "./offset";
import { Timestamp } from "./timestamp";

describe("Offset", () => {
  it("can be serialized/deserialized to string", () => {
    const sut = new Offset(
      "0x123123123",
      BigInt(21342321323423),
      new Timestamp(1667073019000, ["part1", 123])
    );
    console.log(sut.toString());
    const restored = Offset.fromString(sut.toString());

    expect(restored.id).toEqual(sut.id);
    expect(restored.height).toEqual(sut.height);
    expect(restored.timestamp.equals(sut.timestamp)).toBeTruthy();
  });
});
