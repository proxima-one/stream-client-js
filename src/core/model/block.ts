import {
  Address,
  BlockReference,
  Hash,
  TransactionReference
} from "./core";
import { Transaction as TransactionDto, TransactionReceipt as ReceiptDto } from "web3-core";
import * as _ from "lodash";
import { Bytes, Timestamp } from "../common";
import Long from "long";
import BigNumber from "bignumber.js";

export class Block {
  public constructor(
    public readonly header: BlockHeader,
    public readonly transactions: ReadonlyArray<Transaction>
  ) { }

  public get isValid() {
    return !this.transactions.find(tx => !tx.hasReceipt);
  }
}

export class BlockHeader {
  public constructor(
    public readonly number: number,
    public readonly hash: Hash,
    public readonly parentHash: Hash,
    public readonly receiptsRoot: Hash,
    public readonly transactionsRoot: Hash,
    public readonly timestamp: Timestamp,
    public readonly miner: Address,
    public readonly gasUsed: number,
    public readonly gasLimit: number,
    public readonly difficulty: BigNumber,
    public readonly extraData: string,
    public readonly nonce: Bytes,
    public readonly sha3Uncles: Hash,
    public readonly mixHash: Hash,
    public readonly stateRoot: Hash,
    public readonly totalDifficulty: BigNumber,
    public readonly size: number
) { }

  public id(): string {
    return `${this.number}-${this.hash.toHexString()}`;
  }

  public static fromRpcDto(dto: any): BlockHeader {
    return new BlockHeader(
      dto.number,
      Hash.fromHexString(dto.hash),
      Hash.fromHexString(dto.parentHash),
      Hash.fromHexString(dto.receiptsRoot),
      Hash.fromHexString(dto.transactionsRoot),
      Timestamp.fromEpochSeconds(dto.timestamp),
      Address.fromHexString(dto.miner),
      dto.gasUsed,
      dto.gasLimit,
      new BigNumber(dto.difficulty),
      dto.extraData,
      Bytes.fromHexString(dto.nonce),
      Hash.fromHexString(dto.sha3Uncles),
      Hash.fromHexString(dto.mixHash),
      Hash.fromHexString(dto.stateRoot),
      new BigNumber(dto.totalDifficulty),
      dto.size
    );
  }

  public toSmallString(): string {
    return `num: ${this.number} hash: ${this.hash.toHexString()} parent: ${this.parentHash.toHexString()}`;
  }
}

export class BlockEvents {
  public constructor(
    public readonly blockRef: BlockReference,
    public readonly transactions: ReadonlyArray<TransactionEvents>
  ) { }

  public get eventsCount(): number {
    return this.transactions.reduce((prev, curr) => prev + curr.eventsCount, 0);
  }
}

export class TransactionEvents {
  public constructor(
    public readonly transactionRef: TransactionReference,
    public readonly events: ReadonlyArray<Event>) { }

  public get eventsCount(): number {
    return this.events.length;
  }
}

export class Event {
  public constructor(
    public readonly index: number,
    public readonly payload: EventPayload) { }
}

export class EventPayload {
  public constructor(
    public readonly address: Address,
    public readonly topics: ReadonlyArray<Bytes>,
    public readonly data: Bytes
  ) {}
}

export class Transaction {
  public constructor(
    public readonly data: TransactionData,
    public readonly receipt: TransactionReceipt | undefined
  ) {}

  public get hasReceipt() {
    return !_.isNil(this.receipt);
  }
}

export class TransactionData {
  public constructor(
    public readonly from: Address,
    public readonly to: Address | undefined,
    public readonly value: string,
    public readonly hash: Hash,
    public readonly input: Bytes,
    public readonly gas: Long,
    public readonly gasPrice: Long) {}

  public static fromRpcDto(dto: TransactionDto): TransactionData {
    return new TransactionData(
      Address.fromHexString(dto.from),
      dto.to ? Address.fromHexString(dto.to) : undefined,
      dto.value,
      Hash.fromHexString(dto.hash),
      Bytes.fromHexString(dto.input),
      Long.fromString(dto.gas as any),
      Long.fromString(dto.gasPrice)
    );
  }
}

export class TransactionReceipt {
  public constructor(
    public readonly cumulativeGasUsed: number,
    public readonly gasUsed: number,
    public readonly status: boolean,
    public readonly events: ReadonlyArray<Event>) { }

  public static fromRpcDto(dto: ReceiptDto): TransactionReceipt {
    return new TransactionReceipt(dto.cumulativeGasUsed, dto.gasUsed, dto.status, dto.logs.map(l => {
      return new Event(l.logIndex, new EventPayload(
        Address.fromHexString(l.address),
        l.topics.map(t => Bytes.fromHexString(t)),
        Bytes.fromHexString(l.data)
      ));
    }));
  }
}
