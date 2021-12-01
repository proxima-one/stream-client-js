import { createJsonSerdes } from "./json";
import { Block, BlockHeader } from "../../model/block";
import {
  blockHeaderToState,
  blockIndexToState,
  blockToState,
  stateToBlock,
  stateToBlockHeader,
  stateToBlockIndex
} from "./converters";
import { BlockIndex } from "../../model";

export const blockSerdes: Serdes<Block> = createJsonSerdes(blockToState, stateToBlock);
export const blockHeaderSerdes: Serdes<BlockHeader> = createJsonSerdes(blockHeaderToState, stateToBlockHeader);
export const blockIndexSerdes: Serdes<BlockIndex> = createJsonSerdes(blockIndexToState, stateToBlockIndex);


export type Serdes<T> = {
  serialize(val: T): Buffer;
  deserialize(buffer: Buffer): T;
}
