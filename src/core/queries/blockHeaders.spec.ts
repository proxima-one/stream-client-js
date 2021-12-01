// @ts-ignore
import { BlockHeadersQuery } from "./blockHeaders";

describe("BlockHeadersQuery", () => {
  it("should create valid instance", () => {
    const sut = BlockHeadersQuery.create(1000, 100);
    expect(sut.count).toBe(100);
    expect(sut.from).toBe(1000);
    expect(sut.to).toBe(1100);
  });

  it("should split to batches", () => {
    const sut = BlockHeadersQuery.create(1000, 90);
    const batches = sut.splitToBatches(20);

    expect(batches).toEqual([
      BlockHeadersQuery.create(1000, 20),
      BlockHeadersQuery.create(1020, 20),
      BlockHeadersQuery.create(1040, 20),
      BlockHeadersQuery.create(1060, 20),
      BlockHeadersQuery.create(1080, 10)
    ]);
  });

  it("should reject too big ranges", () => {
    expect(() => BlockHeadersQuery.create(1000, 100000)).toThrow();
  });

  it("should reject non-positive ranges", () => {
    expect(() => BlockHeadersQuery.create(1000, 0)).toThrow();
    expect(() => BlockHeadersQuery.create(1000, -1)).toThrow();
  });
});
