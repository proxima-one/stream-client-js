import { strict as assert } from "assert";
import { BlockHeader } from "../model";
import * as _ from "lodash";
import { createBatchesArray } from "../../core/common";

/**
 * Query to fetch block headers in interval [from, to)
 */
export class BlockHeadersQuery {
  type = "blockHeaders" as const;

  public readonly from: number;
  public readonly to: number;

  private constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }

  public get count() {
    return this.to - this.from;
  }

  public static create(from: number, count: number) {
    assert(count < 100000, "Range is too big. Should be less than 100000");
    assert(count > 0, "Range should be bigger than 0");

    return new BlockHeadersQuery(from, from + count);
  }

  public splitToBatches(batchSize: number): BlockHeadersQuery[] {
    if (batchSize >= this.count)
      return [this];

    const batches = createBatchesArray(this.from, this.to, batchSize);
    return batches.map(batch => BlockHeadersQuery.create(batch.from, batch.to - batch.from));
  }
}

export class BlockHeadersResponse {
  public static readonly empty = new BlockHeadersResponse([]);
  public readonly blockHeaders: ReadonlyArray<BlockHeader>;

  public constructor(blockHeaders: ReadonlyArray<BlockHeader>) {
    this.blockHeaders = blockHeaders;
  }

  public static fromBatches(batches: ReadonlyArray<BlockHeadersResponse>): BlockHeadersResponse {
    if (batches.length === 0)
      return this.empty;

    if (batches.length === 1)
      return batches[0];

    const blocks = _.chain(batches.reduce((prev, curr) => prev.concat(curr.blockHeaders), <BlockHeader[]>[]))
      .orderBy(x => x.number)
      .value();

    if (blocks.length === 0)
      return this.empty;

    this.assertBlocksAreInContinuousRange(blocks);

    return new BlockHeadersResponse(blocks);
  }

  private static assertBlocksAreInContinuousRange(blocks: BlockHeader[]) {
    const numbers = blocks.map(x => x.number);
    const from = _.min(numbers)!;
    const to = _.max(numbers)!;

    const expectedCount = to - from + 1;
    const uniqCount = _.uniq(numbers).length;

    assert(uniqCount === expectedCount, "Can't merge batch response: batches content is not plausible");
  }
}


