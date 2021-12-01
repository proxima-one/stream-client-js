#!/usr/bin/env node
import * as dotenv from "dotenv";
dotenv.config();

import * as grpc from "@grpc/grpc-js";

import { EthConnectorServiceService, IEthConnectorServiceServer } from "./gen/proto/eth-connector/v1/eth-connector_grpc_pb";
import { QueryRequest, QueryResponse } from "./gen/proto/eth-connector/v1/eth-connector_pb";
import {
  EthInterop,
  EthInteropConfig,
  QueryExecutionOptions,
} from "./interop";
import * as core from "./core";
import {
  mapBlockHeadersResponseToTransport,
  mapBlockResponseToTransport
} from "./core/serialization/mapping";
import { Hash } from "./core/model/core";

const log = console.log;

async function createServerImplementation(): Promise<IEthConnectorServiceServer> {
  // create global interop so it reuses stats collected by running prev queries
  const config = EthInteropConfig.fromYamlFile("./config.yml");
  const interop = await EthInterop.create(config);

  return {
    executeQuery: async (call: grpc.ServerUnaryCall<QueryRequest, QueryResponse>, callback: grpc.sendUnaryData<QueryResponse>): Promise<void> => {
      let response = new QueryResponse();

      if (call.request.hasBlockheaders()) {
        const headers = call.request.getBlockheaders()!;
        const from = headers.getFrom();
        const to = headers.getTo();

        log(`[execute query] request (from-to): ${from}-${to}`);

        const query = core.BlockHeadersQuery.create(from, to);
        const modelResponse = await interop.executeQuery(query, QueryExecutionOptions.default);

        response.setBlockheaders(mapBlockHeadersResponseToTransport(modelResponse));
      } else if (call.request.hasBlock()) {
        const block = call.request.getBlock()!;
        const hashesList = block.getHashesList_asU8();

        log(`[execute query] request (first hash): `, hashesList[0]);

        const query = new core.BlockQuery(hashesList.map(x => Hash.fromByteArray(x)));
        const modelResponse = await interop.executeQuery(query, QueryExecutionOptions.default);

        response.setBlock(mapBlockResponseToTransport(modelResponse));
      } else
        throw new Error("Unknown request");

      callback(null, response);
    }
  }
}

async function startServer() {
  const server = new grpc.Server();

  const serverImpl = await createServerImplementation();
  server.addService(EthConnectorServiceService, serverImpl);
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      throw err;
    }
    log(`Server started, listening: 127.0.0.1:${port}`);
    server.start();
  });
}

async function main() {

  process.on("uncaughtException", (err) => {
    log(`process on uncaughtException error: ${err}`);
  });

  process.on("unhandledRejection", (err) => {
    log(`process on unhandledRejection error: ${err}`);
  });

  await startServer();
}

main().then(_ => log("finished main"));
