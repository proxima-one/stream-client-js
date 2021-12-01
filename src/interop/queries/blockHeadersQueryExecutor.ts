import Web3 from "web3";
import { barrier } from "../../core/common";
import * as core from "../../core";

export class BlockHeadersQueryExecutor {
  private readonly web3: Web3;
  private readonly query: core.BlockHeadersQuery;

  public constructor(web3: Web3, query: core.BlockHeadersQuery) {
    this.web3 = web3;
    this.query = query;
  }

  public async execute(): Promise<core.BlockHeadersResponse> {
    const batch = new this.web3.eth.BatchRequest();
    const blocks = Array.apply(null, Array(this.query.count));

    const wait = barrier(blocks.length);
    for (let i = 0; i < blocks.length; i++) {

      const blockNumber = i + this.query.from;
      batch.add((this.web3.eth.getBlock as any).request(blockNumber, (err: any, block: any) => {
        blocks[i] = block;
        if (err) {
          wait.unlockWithError(err);
        }
        wait.unlock();
      }));
    }

    batch.execute();
    await wait.lock;

    return new core.BlockHeadersResponse(blocks.map(dto => {
      return core.BlockHeader.fromRpcDto(dto);
    }));
  }
}

