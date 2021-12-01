import { JsonObject } from "../../common";

export interface BlockState extends JsonObject {
  header: BlockHeaderState;
  transactions: ReadonlyArray<TransactionState>;
}

export interface TransactionState extends JsonObject {
  data: TransactionDataState;
  receipt?: TransactionReceiptState;
}

export interface BlockHeaderState extends JsonObject {
  number: number;
  receiptsRoot: string;
  transactionsRoot: string;
  parentHash: string;
  hash: string;
  miner: string;
  timestamp: number;
  gasUsed: number;
  gasLimit: number;
  difficulty: string;
  extraData: string;
  nonce: string;
  sha3Uncles: string;
  mixHash: string;
  stateRoot: string;
  totalDifficulty: string;
  size: number;
}

export interface TransactionReceiptState extends JsonObject {
  gasUsed: number;
  cumulativeGasUsed: number;
  events: ReadonlyArray<{
    payload: EventPayloadState;
    index: number
  }>;
  status: boolean
}

export interface EventPayloadState extends JsonObject {
  address: string;
  data: string;
  topics: ReadonlyArray<string>
}

export interface TransactionDataState extends JsonObject {
  gas: string;
  from: string;
  to: string | undefined;
  value: string;
  hash: string;
  gasPrice: string
  input: string;
}

export interface BlockIndexState {
  header: BlockHeaderState;
  contentRef: string;
}
