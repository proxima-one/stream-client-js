import { Query, QueryResponse } from "./queries";

export interface EthDataSource {
  executeQuery<TQuery extends Query>(query: TQuery): Promise<QueryResponse<TQuery>>;
}
