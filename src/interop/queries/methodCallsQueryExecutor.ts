import * as core from "../../core";
import { barrier } from "../../core/common";
import { strict as assert } from "assert";
import _ = require("lodash");
import Web3 from "web3";

export class MethodCallsQueryExecutor {
  private readonly web3: Web3;
  private readonly query: core.MethodCallsQuery;

  public constructor(web3: Web3, query: core.MethodCallsQuery) {
    this.web3 = web3;
    this.query = query;
  }

  public async execute(): Promise<core.MethodCallsResponse> {
    const results: core.MethodCallResult[] = Array.apply(null, Array(this.query.count)) as core.MethodCallResult[];

    const batch = new this.web3.eth.BatchRequest();

    const wait = barrier(this.query.count);
    for (let i = 0; i < this.query.calls.length; i++) {
      const call = this.query.calls[i];
      const blockNumber = call.blockNumber;
      const ethCallObj = call.functionCall(this.web3).call;
      assert(ethCallObj, `user callback doesn't return eth call object`);
      batch.add(ethCallObj.request({blockNumber}, (err: any, result: any) => {
        results[i] = new core.MethodCallResult(result, _.isNil(err));
        if (!call.allowFailure && !_.isNil(err)) {
          wait.unlockWithError(err);
        }
        wait.unlock();
      }));
    }

    batch.execute();
    await wait.lock;

    return new core.MethodCallsResponse(results);
  }
}
