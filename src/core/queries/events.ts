import { strict as assert } from "assert";
import {
  Address, Hash,
} from "../model/core";
import * as _ from "lodash";
import { splitArrayToBatches } from "../../core/common";
import { BlockEvents } from "../model";

export class EventsQuery {
  type = "events" as const;

  public get count(): number {
    return this.blockHashes.length;
  }

  private constructor(
    public readonly blockHashes: ReadonlyArray<Hash>,
    public readonly address?: Address
  ) { }

  public static forContract(
    address: Address,
    blockHashes: ReadonlyArray<Hash>
  ) {
    assert(blockHashes.length < 1000000);
    return new EventsQuery(blockHashes, address);
  }

  public static all(blockHashes: ReadonlyArray<Hash>) {
    assert(blockHashes.length < 1000000);
    return new EventsQuery(blockHashes, undefined);
  }

  public splitToBatches(batchSize: number): EventsQuery[] {
    if (batchSize >= this.count) return [this];

    const batches = splitArrayToBatches(this.blockHashes, batchSize);
    return batches.map(
      batch => new EventsQuery(batch, this.address)
    );
  }
}

export class EventsResponse {
  public static readonly empty = new EventsResponse([]);
  public readonly blocks: BlockEvents[];

  public constructor(blocks: BlockEvents[]) {
    this.blocks = blocks;
  }

  public get eventsCount(): number {
    return this.blocks.reduce((prev, curr) => prev + curr.eventsCount, 0);
  }

  public static fromBatches(batches: EventsResponse[]): EventsResponse {
    if (batches.length === 0) return this.empty;

    if (batches.length === 1) return batches[0];

    const blocks = _.chain(
      batches.reduce(
        (prev, curr) => prev.concat(curr.blocks),
        <BlockEvents[]>[]
      )
    )
      .orderBy(x => x.blockRef.number)
      .value();

    if (blocks.length === 0) return this.empty;

    return new EventsResponse(blocks);
  }
}
