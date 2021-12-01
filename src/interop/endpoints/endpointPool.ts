import Web3 from "web3";
import { strict as assert } from "assert";
import * as _ from "lodash";

import { Endpoint } from "./endpoint";
import { Web3EndpointFactory } from "./web3EndpointFactory";
import { Capabilities } from "./capabilities";
import { QueryStats } from "../queryStats";
import { ITimeProvider } from "../timeProvider";
import { EndpointQueryRun, EndpointRuntimeStats, EndpointSelector, EndpointSelectorState } from "./endpointSelector";
import { LimitedResourceAccessor } from "./limitedResourceAccessor";

// ! STATEFUL
export class EndpointPool {
  public readonly endpoints: EndpointState[];
  private readonly timeProvider: ITimeProvider;
  private readonly resourceAccessor: LimitedResourceAccessor;
  private readonly stateChangedInterval: NodeJS.Timeout;

  public constructor(endpoints: Endpoint[], timeProvider: ITimeProvider) {
    this.timeProvider = timeProvider;
    this.resourceAccessor = new LimitedResourceAccessor();
    this.endpoints = endpoints.map(e => {
      return new EndpointState(
        e,
        new EndpointExecutionStats(),
        Web3EndpointFactory.create(e.connection),
        () => this.resourceAccessor.stateChanged());
    });
    this.stateChangedInterval = setInterval(() => {
      this.resourceAccessor.stateChanged();
    }, 1000);
  }

  public acquire(capabilities?: Capabilities): Promise<EndpointLock> {
    return this.resourceAccessor.getResource(() => {
      const selector = this.buildSelector();
      const endpointId = selector.select(this.timeProvider.now(), capabilities);
      if (!endpointId)
        return undefined;

      const endpoint = this.endpoints.find(x => x.endpoint.id === endpointId)!;
      return endpoint.createLock(this.timeProvider);
    });
  }

  public dispose(): void {
    clearInterval(this.stateChangedInterval);
  }

  private buildSelector(): EndpointSelector {
    const endpoints = this.endpoints.map(s => {
      return new EndpointSelectorState(
        s.endpoint.id,
        s.endpoint.metadata,
        s.buildRuntimeStats()
      );
    });

    return new EndpointSelector(endpoints);
  }
}

export class EndpointLock {
  private readonly endpointState: EndpointState;
  private readonly timeProvider: ITimeProvider;

  public get web3(): Web3 {
    return this.endpointState.web3;
  }

  public constructor(endpointState: EndpointState, timeProvider: ITimeProvider) {
    this.endpointState = endpointState;
    this.timeProvider = timeProvider;
  }

  public commitQueryStats(queryStats: QueryStats): void {
    this.endpointState.commitQueryStats(this.timeProvider.now(), queryStats);
  }

  public release(): void {
    this.endpointState.releaseLock(this);
  }
}

class EndpointState {
  trackQueriesInterval = 100000 as const;

  public readonly endpoint: Endpoint;
  public readonly stats: EndpointExecutionStats;
  public readonly web3: Web3;
  private readonly onStateChanged: () => void;
  public locks: EndpointLock[];

  public constructor(endpoint: Endpoint, stats: EndpointExecutionStats, web3: Web3, stateChangedCb: () => void) {
    this.endpoint = endpoint;
    this.stats = stats;
    this.web3 = web3;
    this.onStateChanged = stateChangedCb;
    this.locks = [];
  }

  public createLock(timeProvider: ITimeProvider): EndpointLock {
    const lock = new EndpointLock(this, timeProvider);
    this.locks.push(lock);
    return lock;
  }

  public releaseLock(lock: EndpointLock): void {
    const lockInd = this.locks.findIndex(x => x === lock);
    assert(lockInd >= 0, "unknown lock");

    this.locks.splice(lockInd, 1);
    this.onStateChanged();
  }

  public buildRuntimeStats(): EndpointRuntimeStats {
    return new EndpointRuntimeStats(
      this.locks.length,
      this.stats.lastRuns
    );
  }

  public commitQueryStats(timestamp: number, queryStats: QueryStats): void {
    this.stats.totalQueries++;
    if (!queryStats.successful)
      this.stats.failedQueries++;

    this.stats.lastRuns.push(new EndpointQueryRun(timestamp, queryStats.successful));

    if (this.stats.totalQueries % 100 === 0) {
      this.stats.cleanup(timestamp - this.trackQueriesInterval);
    }
  }
}

class EndpointExecutionStats {
  public totalQueries: number;
  public failedQueries: number;
  public lastRuns: EndpointQueryRun[];

  public constructor() {
    this.totalQueries = 0;
    this.failedQueries = 0;
    this.lastRuns = [];
  }

  public cleanup(threshold: number): void {
    const oldRunsIdx = this.lastRuns.findIndex(x => x.timestampMs >= threshold);

    if (oldRunsIdx > 0) {
      this.lastRuns.splice(0, oldRunsIdx);
    }
  }
}

