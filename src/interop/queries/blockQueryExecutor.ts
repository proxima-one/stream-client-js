import * as _ from "lodash";
import Web3 from "web3";
import { TransactionReceipt as EthTransactionReceipt } from "web3-core";
import { barrier, splitArrayToBatches } from "../../core/common";
import { strict as assert } from "assert";
import { BlockTransactionObject } from "web3-eth";
import * as core from "../../core";

export class BlockQueryExecutor {
  private readonly web3: Web3;
  private readonly query: core.BlockQuery;

  private ethBlocks: (BlockTransactionObject | undefined)[] = [];
  private ethReceipts: Record<string, EthTransactionReceipt> = {};

  public constructor(web3: Web3, query: core.BlockQuery) {
    this.web3 = web3;
    this.query = query;
  }

  public async execute(): Promise<core.BlockResponse> {
    const blocks: core.Block[] = [];
    await this.fetchBlocks();
    await this.fetchTransactionReceipts();

    return new core.BlockResponse(this.ethBlocks.map(ethBlock => {
      if (!ethBlock)
        return undefined;
      return new core.Block(
        core.BlockHeader.fromRpcDto(ethBlock!),
        ethBlock.transactions.map(t => {
          const receipt = this.ethReceipts[t.hash.toLowerCase()];
          return new core.Transaction(
            core.TransactionData.fromRpcDto(t!),
            receipt ? core.TransactionReceipt.fromRpcDto(receipt) : undefined
          );
        })
      )
    }));
  }

  private async fetchBlocks() {
    const batch = new this.web3.eth.BatchRequest();
    this.ethBlocks = this.query.blockHashes.map(h => undefined);
    const wait = barrier(this.ethBlocks.length);

    for (let i = 0; i < this.ethBlocks.length; i++) {
      const blockHash = this.query.blockHashes[i].toHexString();
      batch.add(((this.web3.eth as any).getBlockByHashCustom as any).request(blockHash, true, (err: any, block: any) => {
        this.ethBlocks[i] = block;
        if (err) {
          wait.unlockWithError(err);
        }
        wait.unlock();
      }));
    }

    batch.execute();
    await wait.lock;
  }

  private async fetchTransactionReceipts() {
    const transactionHashes = _.flatten(this.ethBlocks.map(b => b!.transactions?.map(t => t.hash)));
    const batches = splitArrayToBatches(transactionHashes, 100);

    for (let hashesBatch of batches) {
      const wait = barrier(hashesBatch.length);
      const batch = new this.web3.eth.BatchRequest();

      for (let i = 0; i < hashesBatch.length; i++) {
        const hash = hashesBatch[i];
        assert(hash);

        batch.add((this.web3.eth.getTransactionReceipt as any).request(hash, (err: any, receipt: any) => {
          if (err) {
            wait.unlockWithError(err);
          } else {
            if (!_.isNil(receipt))
              this.ethReceipts[receipt.transactionHash.toLowerCase()] = receipt;
            else
              console.log(`got null for receipt ${hash}`);
          }
          wait.unlock();
        }));
      }

      batch.execute();
      await wait.lock;
    }
  }
}
