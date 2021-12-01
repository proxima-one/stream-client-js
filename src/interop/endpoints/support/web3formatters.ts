/* eslint-disable no-param-reassign */
import utils = require("web3-utils")
import * as _ from "lodash";
import { formatters } from 'web3-core-helpers';

export function fixedTransactionFormatter (tx: any){
  if (tx.blockNumber !== null) {
    tx.blockNumber = utils.hexToNumber(tx.blockNumber);
  }
  if (tx.transactionIndex !== null) {
    tx.transactionIndex = utils.hexToNumber(tx.transactionIndex);
  }
  tx.nonce = utils.hexToNumber(tx.nonce);
  tx.gas = formatters.outputBigNumberFormatter(tx.gas);
  tx.gasPrice = formatters.outputBigNumberFormatter(tx.gasPrice);
  tx.value = formatters.outputBigNumberFormatter(tx.value);
  if (tx.to && utils.isAddress(tx.to)) { // tx.to could be `0x0` or `null` while contract creation
    tx.to = utils.toChecksumAddress(tx.to);
  } else {
    tx.to = null; // set to `null` if invalid address
  }
  if (tx.from) {
    tx.from = utils.toChecksumAddress(tx.from);
  }
  return tx;
};

export function fixedOutputBlockFormatter (block: any) {
  // transform to number
  block.gasLimit = utils.hexToNumber(block.gasLimit);
  block.gasUsed = utils.hexToNumber(block.gasUsed);
  block.size = utils.hexToNumber(block.size);
  block.timestamp = utils.hexToNumber(block.timestamp);
  if (block.number !== null)
    block.number = utils.hexToNumber(block.number);

  if (block.difficulty)
    block.difficulty = formatters.outputBigNumberFormatter(block.difficulty);
  if (block.totalDifficulty)
    block.totalDifficulty = formatters.outputBigNumberFormatter(block.totalDifficulty);

  if (_.isArray(block.transactions)) {
    block.transactions.forEach(function (item: any) {
      if (!_.isString(item))
        return fixedTransactionFormatter(item);
    });
  }

  if (block.miner)
    block.miner = utils.toChecksumAddress(block.miner);

  return block;
};
