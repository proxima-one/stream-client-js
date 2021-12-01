import { BlockHeadersQuery, BlockHeadersResponse } from "./blockHeaders";
import { EventsQuery, EventsResponse } from "./events";
import { BlockQuery, BlockResponse } from "./block";
import { MethodCallsQuery, MethodCallsResponse } from "./methodCalls";

export type Query =
  | BlockHeadersQuery
  | EventsQuery
  | BlockQuery
  | MethodCallsQuery;

type QueryType = Query["type"];
type QueryMap<U> = { [K in QueryType]: U extends { type: K } ? U : never };
type QueryTypeMap = QueryMap<Query>;

type Pattern<T> = { [K in keyof QueryTypeMap]: (query: QueryTypeMap[K]) => T };

export function queryMatcher<T>(pattern: Pattern<T>): (query: Query) => T {
  return query => pattern[query.type](query as any);
}

export type QueryResponse<T extends Query> = T extends BlockHeadersQuery
  ? BlockHeadersResponse
  : T extends EventsQuery
  ? EventsResponse
  : T extends BlockQuery
  ? BlockResponse
  : T extends MethodCallsQuery
  ? MethodCallsResponse
  : never;
