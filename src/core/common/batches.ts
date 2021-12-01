import { strict as assert } from "assert";
import { min } from "./math";

export function createBatchesArray(from: number, to: number, batchSize: number): {from: number, to: number}[] {
  assert(batchSize > 0, "batchSize should be positive");

  const arr: {from: number, to: number}[] = [];
  for (let i = from; i < to; i+= batchSize) {
    arr.push({from: i, to:  min(to, i + batchSize)});
  }

  return arr;
}

export function splitArrayToBatches<T>(arr: ReadonlyArray<T>, batchSize: number): ReadonlyArray<ReadonlyArray<T>> {
  assert(typeof batchSize === "number", "batchSize should be number");
  assert(batchSize > 0, "batchSize should be positive");

  const batches = createBatchesArray(0, arr.length, batchSize);
  //console.log("splitArrayToBatches", JSON.stringify(batches, null, 2));
  return batches.map(range => arr.slice(range.from, range.to));
}
