import { createBatchesArray, splitArrayToBatches } from "./batches";

describe("createBatchesArray", () => {
  it("should create valid array", () => {
    const arr = createBatchesArray(100, 300, 70);
    expect(arr).toEqual([{
      from: 100,
      to: 170
    },{
      from: 170,
      to: 240
    },{
      from: 240,
      to: 300
    },
    ]);
  });
});


describe("splitArrayToBatches", () => {
  it("should create valid array", () => {
    const array = [];

    for ( let i = 0; i < 10000; i++) {
      array.push(i);
    }

    const batches = splitArrayToBatches(array, 10);
    expect(batches).toHaveLength(10000 / 10);

    for (let i = 1; i < batches.length; i++) {
      expect(batches[i]).toHaveLength(10);
      expect(batches[i][0]).toEqual(batches[i-1][batches[i-1].length-1]+1);
    }
  });
});
