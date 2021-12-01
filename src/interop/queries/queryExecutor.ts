import Web3 from "web3";
import { BlockHeadersQueryExecutor } from "./blockHeadersQueryExecutor";
import { EventsQueryExecutor } from "./eventsQueryExecutor";
import { BlockQueryExecutor } from "./blockQueryExecutor";
import { MethodCallsQueryExecutor } from "./methodCallsQueryExecutor";
import { Query, queryMatcher, QueryResponse } from "../../core";


export class QueryExecutor {
  public static async execute<TQuery extends Query>(web3: Web3, query: TQuery): Promise<QueryResponse<TQuery>> {
    const executor = queryMatcher({
      blockHeaders: async q => <QueryResponse<TQuery>>(await new BlockHeadersQueryExecutor(web3, q).execute()),
      events: async q => <QueryResponse<TQuery>>(await new EventsQueryExecutor(web3, q).execute()),
      block : async q => <QueryResponse<TQuery>>(await new BlockQueryExecutor(web3, q).execute()),
      methodCalls: async q => <QueryResponse<TQuery>>(await new MethodCallsQueryExecutor(web3, q).execute()),
    });

    return executor(query);
  }
}

