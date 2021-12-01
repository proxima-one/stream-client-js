import { BlockHeader } from "./block";

export class BlockIndex {
  public constructor(
    public readonly header: BlockHeader,
    public readonly contentRef: string
  ) {}
}
