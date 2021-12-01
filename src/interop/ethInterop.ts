import { QueryExecutor } from "./queries";
import { EthInteropConfig } from "./ethInteropConfig";
import { EndpointPool } from "./endpoints";
import { QueryStats } from "./queryStats";
import { UtcTimeProvider } from "./timeProvider";
import { Observable } from "rxjs";
import { retryExecutor, splitExecutor } from "./executors";
import * as core from "../core";

export class EthInterop {
  private readonly config: EthInteropConfig;
  private readonly pool: EndpointPool;

  private constructor(config: EthInteropConfig, pool: EndpointPool) {
    this.config = config;
    this.pool = pool;
  }

  public static async create(config: EthInteropConfig): Promise<EthInterop> {
    const pool = new EndpointPool(config.endpoints, new UtcTimeProvider());

    // todo: support pool state restore (statistics)
    return new EthInterop(config, pool);
  }

  public async executeQuery<TQuery extends core.Query>(query: TQuery, options: QueryExecutionOptions): Promise<core.QueryResponse<TQuery>> {
    const executor =
      retryExecutor(options,
        splitExecutor(options,
          (ctx, q) => this.executeQueryImpl(q)
        )
      );

    const result = await executor({}, query);
    if (result instanceof Error)
      throw result;

    return <core.QueryResponse<TQuery>>result;
  }

  public getStats(): {endpoints: {id: string, stats: {totalQueries: number, failedQueries: number, failRatio: number}}[]} {
    return {
      endpoints: this.pool.endpoints.map(e => {
        return {
          id: e.endpoint.id,
          stats: {
            totalQueries: e.stats.totalQueries,
            failedQueries: e.stats.failedQueries,
            failRatio: e.stats.totalQueries === 0 ? 0 : Math.round(e.stats.failedQueries / e.stats.totalQueries * 1000) / 1000
          }
        };
      })
    }
  }

  // public async getNewBlockHeadersStream(): Promise<Observable<core.BlockHeader>> {
  //   const endpoint = await this.pool.acquire({streaming: true});
  //   try {
  //     return new NewBlockHeadersStream(endpoint.web3).getStream();
  //   } finally {
  //     endpoint.release();
  //   }
  // }

  private async executeQueryImpl<TQuery extends core.Query>(query: TQuery): Promise<core.QueryResponse<TQuery> | Error> {
    const endpoint = await this.pool.acquire({fetch: true});
    const timestamp = now();

    try {
      const response = await QueryExecutor.execute(endpoint.web3, query);
      endpoint.commitQueryStats(new QueryStats(query, true, now() - timestamp));
      return response;
    } catch(err) {
      endpoint.commitQueryStats(new QueryStats(query, false, now() - timestamp));
      return err instanceof Error ? err : new Error(JSON.stringify(err));
    } finally {
      endpoint.release();
    }
  }

  public dispose(): void {
    this.pool.dispose();
  }
}

const now = (): number => {
  return new Date().getTime();
}

export class QueryExecutionOptions {
  public readonly retriesCount: number;
  public readonly timeoutMs: number;
  public readonly batchSizeHint?: number;

  public static readonly default = new QueryExecutionOptions(100, 600 * 1000, undefined);

  // could be extended with:
  // - parallel execution on multiple endpoints
  //   - for speed
  //   - for data check

  public constructor(retriesCount: number, timeoutMs: number, batchSizeHint: number | undefined = undefined) {
    this.retriesCount = retriesCount;
    this.timeoutMs = timeoutMs;
    this.batchSizeHint = batchSizeHint;
  }

  public withBatchSizeHint(value: number | undefined): QueryExecutionOptions {
    return new QueryExecutionOptions(this.retriesCount, this.timeoutMs, value);
  }
}
