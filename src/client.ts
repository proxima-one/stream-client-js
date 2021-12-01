#!/usr/bin/env node

import * as grpc from "@grpc/grpc-js";
import { mapBlockHeaderToModel, mapBlockToModel } from "./core/serialization/mapping";

import { EthConnectorServiceClient } from "./gen/proto/eth-connector/v1/eth-connector_grpc_pb";
import { BlockHeadersQuery, BlockQuery, QueryRequest, QueryResponse } from "./gen/proto/eth-connector/v1/eth-connector_pb";

const log = console.log;

const client = new EthConnectorServiceClient("127.0.0.1:50051", grpc.credentials.createInsecure());

const executeQuery = async (request: QueryRequest) => {
    return new Promise<QueryResponse>((resolve, reject) => {
        client.executeQuery(request, (err, response: QueryResponse) => {
            if (err != null) {
                log(`[execute query] err:\nerr.message: ${err.message}\nerr.stack:\n${err.stack}`);
                reject(err); return;
            }

            if (response.hasBlockheaders()){
              log("[execute query] block headers response (first header): ", mapBlockHeaderToModel(response.getBlockheaders()!.getBlockheadersList()[0]));
            }
            else if (response.hasBlock()) {
              log("[execute query] block response: ", mapBlockToModel(response.getBlock()?.getBlocksList()[0]!));
            }
            else
              throw new Error("Unknown response");

            resolve(response);
        });
    });
};


async function main() {
  const blockHeadersRequest = new QueryRequest()
    .setBlockheaders(new BlockHeadersQuery()
      .setFrom(5000000)
      .setTo(102));

  const blockHeadersResponse = await executeQuery(blockHeadersRequest);
  const hashes = blockHeadersResponse.getBlockheaders()!.getBlockheadersList().map(x => x.getHash_asB64());

  const blockRequest = new QueryRequest()
    .setBlock(new BlockQuery()
      .setHashesList(hashes.slice(0, 2)));

  await executeQuery(blockRequest);
}

main().then((_) => log("finished main"));

process.on("uncaughtException", (err) => {
    log(`process on uncaughtException error: ${err}`);
});

process.on("unhandledRejection", (err) => {
    log(`process on unhandledRejection error: ${err}`);
});
