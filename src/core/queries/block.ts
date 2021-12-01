import * as _ from "lodash";

import { createBatchesArray } from "../common";
import { Block, Hash } from "../model";

/**
 * Query to fetch transactions in the range [txFrom, txTo) in given block
 */
export class BlockQuery {
  type = "block" as const;

  public readonly blockHashes: ReadonlyArray<Hash>;

  public constructor(blockHashes: ReadonlyArray<Hash>) {
    this.blockHashes = blockHashes;
  }

  public splitToBatches(batchSize: number): ReadonlyArray<BlockQuery> {
    if (batchSize >= this.blockHashes.length)
      return [this];

    const batches = createBatchesArray(0, this.blockHashes.length, batchSize);
    return batches.map(batch => new BlockQuery(this.blockHashes.slice(batch.from, batch.to)));
  }
}

export class BlockResponse {
  public readonly blocks: ReadonlyArray<Block | undefined>;

  public constructor(blocks: ReadonlyArray<Block | undefined>) {
    this.blocks = blocks;
  }

  public static fromBatches(batches: ReadonlyArray<BlockResponse>): BlockResponse {
    return new BlockResponse(_.flatten(batches.map(x => x.blocks)));
  }
}
