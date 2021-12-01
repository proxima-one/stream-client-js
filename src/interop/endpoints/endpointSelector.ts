import * as _ from "lodash";
import { Capabilities } from "./capabilities";
import { EndpointMetadata } from "./endpointMetadata";

export class EndpointSelector {
  private readonly endpoints: EndpointSelectorState[];

  public constructor(endpoints: EndpointSelectorState[]) {
    this.endpoints = endpoints;
  }

  public select(now: number, capabilities?: Capabilities): string | undefined {
    const selectedEndpoints = _.chain(this.endpoints)
      .filter(x => x.isCapableOf(capabilities))
      .filter(x => x.hasFreeSlots)
      .filter(x => x.isHealthyAt(now))
      .filter(x => x.meetsRequestLimits(now))
      .orderBy([
        x => x.metadata.dedicated ? 0 : 1,
        x => x.freeSlotsRatio,
      ], ["asc", "desc"])
      .value();

    if (selectedEndpoints.length === 0)
      return undefined;

    return selectedEndpoints[0].id;
  }
}

export class EndpointSelectorState {
  successfulRunsThreshold = 0.8 as const;
  successfulRunsIntervalMs = 60 * 1000;

  public readonly id: string;
  public readonly metadata: EndpointMetadata;
  public readonly runtimeStats: EndpointRuntimeStats;

  public constructor(id: string, metadata: EndpointMetadata, runtimeStats: EndpointRuntimeStats) {
    this.id = id;
    this.metadata = metadata;
    this.runtimeStats = runtimeStats;
  }

  public isCapableOf(capabilities?: Capabilities): boolean {
    if (!capabilities)
      return true;

    if (capabilities.archive && !this.metadata.archive)
      return false;

    if (capabilities.streaming && !this.metadata.streaming)
      return false;

    if (capabilities.fetch && !this.metadata.fetch)
      return false;

    return true;
  }

  public isHealthyAt(timestamp: number): boolean {
    const ratio = this.successfulRunsRatioSince(timestamp - this.successfulRunsIntervalMs);
    return ratio >= this.successfulRunsThreshold;
  }

  public meetsRequestLimits(timestamp: number): boolean {
    if (!this.metadata.requestLimits)
      return true;

    const leftBoundTimestamp = timestamp - this.metadata.requestLimits.intervalMs;
    const requestsCount = this.runtimeStats.lastRuns.filter(x => x.timestampMs >= leftBoundTimestamp).length;
    return requestsCount < this.metadata.requestLimits.count;
  }

  public get hasFreeSlots(): boolean {
    return this.runtimeStats.lockedSlots < this.metadata.slots;
  }

  public get freeSlotsRatio(): number {
    if (this.metadata.slots === 0)
      return 0;
    return 1 - this.runtimeStats.lockedSlots / this.metadata.slots;
  }

  private successfulRunsRatioSince(timestamp: number): number {
    if (this.runtimeStats.lastRuns.length === 0)
      return 1;

    const lastRuns = this.runtimeStats.lastRuns.filter(x => x.timestampMs >= timestamp);
    if (lastRuns.length === 0)
      return 1;

    const successfulRunsCount = lastRuns.filter(x => x.successful).length;
    return successfulRunsCount / lastRuns.length;
  }
}

export class EndpointRuntimeStats {
  public readonly lockedSlots: number;
  public readonly lastRuns: ReadonlyArray<EndpointQueryRun>;

  public constructor(lockedSlots: number, lastRuns: ReadonlyArray<EndpointQueryRun>) {
    this.lockedSlots = lockedSlots;
    this.lastRuns = lastRuns;
  }
}

export class EndpointQueryRun {
  public readonly timestampMs: number;
  public readonly successful: boolean;

  public constructor(timestampMs: number, successful: boolean) {
    this.timestampMs = timestampMs;
    this.successful = successful;
  }
}

