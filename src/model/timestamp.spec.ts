import { Timestamp } from "./timestamp";

describe("Timestamp", () => {
  it("can be serialized/deserialized to string", () => {
    const times = [
      new Timestamp(1667073019000, ["part1", 123]),
      new Timestamp(1667073019000),
    ];

    for (const time of times) {
      const restoredTime = Timestamp.fromString(time.toString());

      expect(restoredTime.equals(time)).toBeTruthy();
    }
  });
});
