import Web3 from "web3";
import * as _ from "lodash";
// @ts-ignore
import { ConnectionParams, QueryExecutor, Web3EndpointFactory } from "../../src/interop";
//import bep20 from "./_abis/BEP20.json";
// @ts-ignore
import bep20 = require("./_abis/BEP20.json");
import { core } from "../../src";

const connectionString = process.env["TEST_ENDPOINT_CONN_STRING"]
  || "provider=http;host=https://bsc-dataseed.binance.org";
const connectionStringEth = process.env["TEST_ENDPOINT_CONN_STRING_ETH"]
  || "provider=http;host=https://api.krafteq.de/stable/eth/main/gdghiZu8aaa56AhlduidFLOafhfqpGzfqmzoGade/rpc";

const connectionParams = ConnectionParams.fromConnectionString(connectionString);
const connectionParamsEth = ConnectionParams.fromConnectionString(connectionStringEth);

describe("proxima streams e2e", () => {
  let web3: Web3;
  let web3Eth: Web3;

  beforeEach(() => {
    web3 = Web3EndpointFactory.create(connectionParams);
    web3Eth = Web3EndpointFactory.create(connectionParamsEth);
  });

  afterEach(() => {
  });

  describe("Proxima Stream Consume Messages", () => {
    it("should be able to consume messages at start point from stream endpoint", async () => {
      jest.setTimeout(100 * 1000);
      const starting = 10000000
      
      //const response = await QueryExecutor.execute(web3, query);

      // expect(response.blockHeaders).toHaveLength(1);
      // const firstBlock = response.blockHeaders[0];
      // expect(firstBlock.number).toBe(0);
      // expect(response).toMatchSnapshot();
    });

    // it("should query blocks range", async () => {
    //   jest.setTimeout(100 * 1000);
    //   const query = core.BlockHeadersQuery.create(1000000, 100);
    //   const response = await QueryExecutor.execute(web3, query);

    //   expect(response.blockHeaders).toHaveLength(query.count);
    //   for (let i = 0; i < response.blockHeaders.length; i++) {
    //     expect(response.blockHeaders[i].number).toBe(query.from + i);
    //   }
    //   expect(response).toMatchSnapshot();
    // });
  });
});
