import * as core from "../..";
import { BlockHeader, BlockHeadersResponse, BlockResponse, Block, Transaction, TransactionData, TransactionReceipt, Event, EventPayload } from "../../../gen/proto/eth-connector/v1/eth-connector_pb";
import { Address, Hash } from "../../model";
import { Bytes, Timestamp } from "../../common";
import BigNumber from "bignumber.js";
import Long from "long";

export function mapBlockHeadersResponseToTransport(model: core.BlockHeadersResponse): BlockHeadersResponse  {
  const response = new BlockHeadersResponse();
  response.setBlockheadersList(model.blockHeaders.map(x => mapBlockHeaderToTransport(x)));
  return response;
}

export function mapBlockResponseToTransport(model: core.BlockResponse): BlockResponse  {
  const response = new BlockResponse();
  response.setBlocksList(model.blocks.map(x => mapBlockToTransport(x)));
  return response;
}

export function mapBlockHeaderToTransport(model: core.BlockHeader): BlockHeader {
  return new BlockHeader()
    .setNumber(model.number)
    .setTimestamp(model.timestamp.epochSeconds)
    .setHash(model.hash.toByteArray())
    .setParenthash(model.parentHash.toByteArray())
    .setReceiptsroot(model.receiptsRoot.toByteArray())
    .setTransactionsroot(model.transactionsRoot.toByteArray())
    .setMiner(model.miner.toByteArray())
    .setGasused(model.gasUsed)
    .setGaslimit(model.gasLimit)
    .setDifficulty(model.difficulty.toString())
    .setExtradata(model.extraData)
    .setNonce(model.nonce.toByteArray())
    .setSha3uncles(model.sha3Uncles.toByteArray())
    .setMixhash(model.mixHash.toByteArray())
    .setStateroot(model.stateRoot.toByteArray())
    .setTotaldifficulty(model.totalDifficulty.toString())
    .setSize(model.size);
}


export function mapBlockToTransport(model: core.Block | undefined): Block {
  if (!model)
    return new Block();

  return new Block()
    .setHeader(mapBlockHeaderToTransport(model.header))
    .setTransactionsList(model.transactions.map(t => mapTransactionToTransport(t)));
}

export function mapEventToTransport(model: core.Event): Event {
  return new Event()
    .setIndex(model.index)
    .setPayload(new EventPayload()
      .setAddress(model.payload.address.toByteArray())
      .setData(model.payload.data.toByteArray())
      .setTopicsList(model.payload.topics.map(t => t.toByteArray())));
}

export function mapTransactionToTransport(model: core.Transaction): Transaction {
  const data = model.data;
  const receipt = model.receipt;

  const transactionData = new TransactionData()
    .setFrom(data.from.toByteArray())
    .setValue(data.value)
    .setHash(data.hash.toByteArray())
    .setGas(data.gas.toNumber())
    .setGasprice(data.gasPrice.toNumber())
    .setInput(data.input.toByteArray());

  if (data.to)
    transactionData.setTo(data.to.toByteArray());

  const transaction = new Transaction()
    .setData(transactionData);

  if (receipt)
    transaction.setReceipt(new TransactionReceipt()
      .setCumulativegasused(receipt.cumulativeGasUsed)
      .setGasused(receipt.gasUsed)
      .setStatus(receipt.status)
      .setEventsList(receipt.events.map(e => mapEventToTransport(e))));

  return transaction;
}

export function mapBlockHeaderToModel(transport: BlockHeader): core.BlockHeader {
  return new core.BlockHeader(
    transport.getNumber(),
    Hash.fromByteArray(transport.getHash_asU8()),
    Hash.fromByteArray(transport.getParenthash_asU8()),
    Hash.fromByteArray(transport.getReceiptsroot_asU8()),
    Hash.fromByteArray(transport.getTransactionsroot_asU8()),
    Timestamp.fromEpochSeconds(transport.getTimestamp()),
    Address.fromByteArray(transport.getMiner_asU8()),
    transport.getGasused(),
    transport.getGaslimit(),
    new BigNumber(transport.getDifficulty()),
    transport.getExtradata(),
    Bytes.fromByteArray(transport.getNonce_asU8()),
    Hash.fromByteArray(transport.getSha3uncles_asU8()),
    Hash.fromByteArray(transport.getMixhash_asU8()),
    Hash.fromByteArray(transport.getStateroot_asU8()),
    new BigNumber(transport.getTotaldifficulty()),
    transport.getSize()
  );
}

export function mapEventToModel(transport: Event): core.Event {
  const payload = transport.getPayload()!;
  return new core.Event(transport.getIndex(),
    new core.EventPayload(
      Address.fromByteArray(payload.getAddress_asU8()),
      payload.getTopicsList_asU8().map(x => Bytes.fromByteArray(x)),
      Bytes.fromByteArray(payload.getData_asU8())));
}

export function mapTransactionToModel(transport: Transaction): core.Transaction {
  const data = transport.getData()!;
  const receipt = transport.getReceipt();
  return new core.Transaction(
    new core.TransactionData(
      Address.fromByteArray(data.getFrom_asU8()),
      data.getTo_asU8() ? Address.fromByteArray(data.getTo_asU8()) : undefined,
      data.getValue(),
      Hash.fromByteArray(data.getHash_asU8()),
      Bytes.fromByteArray(data.getInput_asU8()),
      Long.fromNumber(data.getGas()),
      Long.fromNumber(data.getGasprice())
    ),
    receipt ? new core.TransactionReceipt(
      receipt.getCumulativegasused(),
      receipt.getGasused(),
      receipt.getStatus(),
      receipt.getEventsList().map(ev => mapEventToModel(ev))
    ) : undefined
  )
}

export function mapBlockToModel(transport: Block): core.Block {
  return new core.Block(
    mapBlockHeaderToModel(transport.getHeader()!),
    transport.getTransactionsList().map(t => mapTransactionToModel(t))
  );
}
