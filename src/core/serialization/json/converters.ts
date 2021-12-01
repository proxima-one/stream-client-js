import { Address, BlockIndex, Hash } from "../../model";
import { Block, BlockHeader, Event, EventPayload, Transaction, TransactionData, TransactionReceipt } from "../../model";
import { BlockHeaderState, BlockIndexState, BlockState, EventPayloadState, TransactionState } from "./state";
import { Bytes, Timestamp } from "../../common";
import Long from "long";
import BigNumber from "bignumber.js";

export function stateToBlock(state: BlockState): Block {
  return new Block(stateToBlockHeader(state.header), state.transactions.map(t => stateToTransaction(t)));
}

export function blockToState(block: Block): BlockState {
  return {
    header: blockHeaderToState(block.header),
    transactions: block.transactions.map(t => transactionToState(t))
  };
}

export function stateToBlockHeader(state: BlockHeaderState): BlockHeader {
  return new BlockHeader(
    state.number,
    Hash.fromHexString(state.hash),
    Hash.fromHexString(state.parentHash),
    Hash.fromHexString(state.receiptsRoot),
    Hash.fromHexString(state.transactionsRoot),
    Timestamp.fromEpochSeconds(state.timestamp),
    Address.fromHexString(state.miner),
    state.gasUsed,
    state.gasLimit,
    new BigNumber(state.difficulty ? state.difficulty : '0'),
    state.extraData,
    Bytes.fromHexString(state.nonce),
    Hash.fromHexString(state.sha3Uncles),
    Hash.fromHexString(state.mixHash),
    Hash.fromHexString(state.stateRoot),
    new BigNumber(state.totalDifficulty ? state.totalDifficulty : '0'),
    state.size
  );
}

export function blockHeaderToState(model: BlockHeader): BlockHeaderState {
  return {
    number: model.number,
    hash: model.hash.toHexString(),
    parentHash: model.parentHash.toHexString(),
    receiptsRoot: model.receiptsRoot.toHexString(),
    transactionsRoot: model.transactionsRoot.toHexString(),
    timestamp: model.timestamp.epochSeconds,
    miner: model.miner.toHexString(),
    gasUsed: model.gasUsed,
    gasLimit: model.gasLimit,
    difficulty: model.difficulty.toString(), //toFixed?
    extraData: model.extraData,
    nonce: model.nonce.toHexString(),
    sha3Uncles: model.sha3Uncles.toHexString(),
    mixHash: model.mixHash.toHexString(),
    stateRoot: model.stateRoot.toHexString(),
    totalDifficulty: model.totalDifficulty.toString(), //toFixed?
    size: model.size
  }
}

export function transactionToState(model: Transaction): TransactionState {
  return {
    data: {
      from: model.data.from.toHexString(),
        to: model.data.to?.toHexString(),
        value: model.data.value,
        hash: model.data.hash.toHexString(),
        gas: model.data.gas.toString(),
        gasPrice: model.data.gasPrice.toString(),
        input: model.data.input.toHexString()
    },
    receipt: model.receipt ? {
      status: model.receipt.status,
      gasUsed: model.receipt.gasUsed,
      cumulativeGasUsed: model.receipt.cumulativeGasUsed,
      events: model.receipt.events.map(ev => {
        return {
          index: ev.index,
          payload: {
            address: ev.payload.address.toHexString(),
            topics: ev.payload.topics.map(t => t.toHexString()),
            data: ev.payload.data.toHexString(),
          }
        }
      })
    } : undefined,
  }
}

export function stateToTransaction(state: TransactionState): Transaction {
  const data = state.data;
  const receipt = state.receipt;
  return new Transaction(
    new TransactionData(
      Address.fromHexString(data.from),
      data.to ? Address.fromHexString(data.to) : undefined,
      data.value,
      Hash.fromHexString(data.hash),
      data.input ? Bytes.fromHexString(data.input) : Bytes.fromHexString("0x00"), // some states are missing input
      Long.fromString(data.gas),
      Long.fromString(data.gasPrice)
    ),
    receipt ? new TransactionReceipt(
      receipt.cumulativeGasUsed,
      receipt.gasUsed,
      receipt.status,
      receipt.events.map(ev => {
        return new Event(ev.index, stateToEventPayload(ev.payload))
      })
    ) : undefined
  )
}

export function stateToEventPayload(state: EventPayloadState): EventPayload {
  return new EventPayload(
    Address.fromHexString(state.address),
    state.topics.map(x => Bytes.fromHexString(x)),
    Bytes.fromHexString(state.data)
  );
}

export function blockIndexToState(blockIndex: BlockIndex): BlockIndexState {
  return {
    header: blockHeaderToState(blockIndex.header),
    contentRef: blockIndex.contentRef
  }
}

export function stateToBlockIndex(state: BlockIndexState): BlockIndex {
  return new BlockIndex(
    stateToBlockHeader(state.header),
    state.contentRef
  )
}
