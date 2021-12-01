import { QueryExecutionOptions } from "./";
import * as core from "../core";
import { max } from "../core/common";

type ExecuteQueryFunc<TQuery extends core.Query> = (ctx: any, query: TQuery) => Promise<core.QueryResponse<TQuery> | Error>;

export function splitExecutor<TQuery extends core.Query>(options: QueryExecutionOptions, underlying: ExecuteQueryFunc<TQuery>): ExecuteQueryFunc<TQuery> {
  async function func(ctx: any, query: TQuery): Promise<core.QueryResponse<TQuery> | Error> {
    const tryNum = ctx.tryNum as (number | undefined);

    function adjustBatchSize(desiredSize: number): number {
      const initialBatchSize = options.batchSizeHint || desiredSize;
      if (tryNum === 0 || !tryNum)
        return initialBatchSize;

      return max(1, Math.floor(initialBatchSize / (1 << tryNum)));
    }

    if (query instanceof core.BlockHeadersQuery) {
      const batches = query.splitToBatches(adjustBatchSize(20)) as (core.BlockHeadersQuery & TQuery)[];
      const results = await Promise.all(batches.map(b => underlying(ctx, b)));

      const errors = results.filter(x => x instanceof Error) as Error[];

      if (errors.length > 0)
        return new Error(errors.join(";"));

      return <core.QueryResponse<TQuery>>core.BlockHeadersResponse.fromBatches(results as any);
    }

    if (query instanceof core.BlockQuery) {
      //console.debug(`executing block query with ${query.blockHashes.length} blocks. splitting to batches by 10`);
      const batches = query.splitToBatches(adjustBatchSize(10)) as (core.BlockQuery & TQuery)[];
      const results = await Promise.all(batches.map(b => underlying(ctx, b)));

      const errors = results.filter(x => x instanceof Error) as Error[];

      if (errors.length > 0)
        return new Error(errors.join(";"));

      return <core.QueryResponse<TQuery>>core.BlockResponse.fromBatches(results as any);
    }

    return underlying(ctx, query);
  }
  return func;
}

const reportFailedQueries = process.env["LOG_FAILED_QUERIES"] === "1";
export function retryExecutor<TQuery extends core.Query>(options: QueryExecutionOptions, underlying: ExecuteQueryFunc<TQuery>): ExecuteQueryFunc<TQuery> {
  async function func(ctx: any, query: TQuery): Promise<core.QueryResponse<TQuery> | Error> {
    let startTimestamp = now();
    const errors = [];
    const maxRuns = max(0, options.retriesCount) + 1;

    for (let currentTry = 0; currentTry < maxRuns; currentTry++) {
      const runResult = await underlying(Object.assign({}, ctx, {tryNum: currentTry}), query);

      if (runResult instanceof Error) {
        errors.push(runResult);
        if (reportFailedQueries)
          console.error(runResult);
        if (now() - startTimestamp > options.timeoutMs) {
          errors.push("Timeout occurred");
          break;
        }
        continue;
      }

      return runResult;
    }

    return new Error(`Error executing query: ${errors.map(e => JSON.stringify(e)).join(",")}`);
  }
  return func;
}

const now = (): number => {
  return new Date().getTime();
}
