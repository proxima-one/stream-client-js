import * as core  from "../core";

export class QueryStats {
  public readonly query: core.Query;
  public readonly successful: boolean;
  public readonly durationMs: number;

  public constructor(query: core.Query, successful: boolean, durationMs: number) {
    this.query = query;
    this.successful = successful;
    this.durationMs = durationMs;
  }
}
