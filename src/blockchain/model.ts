export interface BlockBase {
  number: number;
  hash: HashLike;
  parentHash: HashLike;
}

export type HashLike = string | { toHexString(): string };

export type BlockEvent<TBlock extends BlockBase> =
  NewBlockEvent<TBlock>
  | UndoBlockEvent<TBlock>;

export class NewBlockEvent<TBlock extends BlockBase> {
  type = "new" as const;

  public readonly block: TBlock;

  public constructor(block: TBlock) {
    this.block = block;
  }
}

export class UndoBlockEvent<TBlock extends BlockBase> {
  type = "undo" as const;

  public readonly block: TBlock;

  public constructor(block: TBlock) {
    this.block = block;
  }
}
