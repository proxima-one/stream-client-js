import { Log } from "web3-core";
import Web3 from "web3";
import * as _ from "lodash";
import { Bytes } from "../../core/common";
import * as core from "../../core";

export class EventsQueryExecutor {
  private readonly web3: Web3;
  private readonly query: core.EventsQuery;

  public constructor(web3: Web3, query: core.EventsQuery) {
    this.web3 = web3;
    this.query = query;
  }

  public async execute(): Promise<core.EventsResponse> {
    // this.web3.eth.getPastLogs({
    //
    // });
    // const response = await this.web3.eth.getPastLogs({
    //   address: this.query.address ? this.query.address.toHexString() : undefined,
    //   fromBlock: this.query.blockFrom,
    //   toBlock: this.query.blockTo - 1
    // });
    //
    // return fromWeb3Response(response);

    throw new Error("not implemented");
  }
}

export function fromWeb3Response(logs: Log[]): core.EventsResponse {
  // group logs to blocks -> transactions -> logs structure with correct order
  const blocks = _.chain(logs)
    .groupBy(x => x.blockNumber)
    .map(values => new core.BlockEvents(
      new core.BlockReference(
        values[0].blockNumber,
        core.Hash.fromHexString(values[0].blockHash)
      ),
      _.chain(values)
        .groupBy(x => x.transactionHash)
        .map(transactionLogs => new core.TransactionEvents(
          new core.TransactionReference(
            core.Hash.fromHexString(transactionLogs[0].transactionHash),
            transactionLogs[0].transactionIndex
          ),
          _.chain(transactionLogs)
            .map(l => new core.Event(
              l.logIndex,
              new core.EventPayload(
                core.Address.fromHexString(l.address),
                l.topics.map(t => Bytes.fromHexString(t)),
                Bytes.fromHexString(l.data)
              )
            ))
            .orderBy(x => x.index)
            .value()
        ))
        .orderBy(x => x.transactionRef.index)
        .value()
    ))
    .orderBy(x => x.blockRef.number)
    .value();

  return new core.EventsResponse(blocks);
}
