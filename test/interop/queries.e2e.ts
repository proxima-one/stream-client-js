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

describe("queries e2e", () => {
  let web3: Web3;
  let web3Eth: Web3;

  beforeEach(() => {
    web3 = Web3EndpointFactory.create(connectionParams);
    web3Eth = Web3EndpointFactory.create(connectionParamsEth);
  });

  afterEach(() => {
  });

  describe("BlockHeadersQuery", () => {
    it("should query genesis block", async () => {
      const query = core.BlockHeadersQuery.create(0, 1);
      const response = await QueryExecutor.execute(web3, query);

      expect(response.blockHeaders).toHaveLength(1);
      const firstBlock = response.blockHeaders[0];
      expect(firstBlock.number).toBe(0);
      expect(response).toMatchSnapshot();
    });

    it("should query blocks range", async () => {
      jest.setTimeout(100 * 1000);
      const query = core.BlockHeadersQuery.create(1000000, 100);
      const response = await QueryExecutor.execute(web3, query);

      expect(response.blockHeaders).toHaveLength(query.count);
      for (let i = 0; i < response.blockHeaders.length; i++) {
        expect(response.blockHeaders[i].number).toBe(query.from + i);
      }
      expect(response).toMatchSnapshot();
    });
  });

  describe("EventsQuery", () => {

  });

  describe("BlockTransactionsQuery", () => {
    it("should query block transactions", async () => {
      const query = new core.BlockQuery([core.Hash.fromHexString("0xf91e071d34e24d4f099552c536494439166617b2226826ec55fe62a5e37c5dd4")]);

      const response = await QueryExecutor.execute(web3, query);
      expect(response.blocks[0]!.transactions).not.toHaveLength(0);

      const someEvents = _.chain(response.blocks[0]!.transactions)
        .map(x => x.receipt!.events)
        .flatten()
        .filter(x => x.payload.address.toHexString().toLowerCase() === "0xf9045866e7b372DeF1EFf3712CE55FAc1A98dAF0".toLowerCase())
        .value();

      expect(someEvents).not.toHaveLength(0);
    });

    it("should fetch big block", async () => {
      jest.setTimeout(100 * 1000)
      for (let i = 0; i < 5; i++) {
        const query = new core.BlockQuery([core.Hash.fromHexString("0x2590b173cf722bf82a97ca5302890717da28e52e72584f70fcf33eaa0f20825d")]);
        const response = await QueryExecutor.execute(web3, query);
        expect(response.blocks[0]!.transactions).not.toHaveLength(0);
      }
    });

    it("should fetch pancake pair block", async () => {
      jest.setTimeout(100 * 1000)

      const query = new core.BlockQuery([core.Hash.fromHexString("0x12106d9bd08f556a31d740fca36d984adece12c55172a52686a48cdb73667056")]);
      const response = await QueryExecutor.execute(web3, query);
      expect(response.blocks[0]!.transactions).not.toHaveLength(0);

      console.log(JSON.stringify(core.json.blockToState(response.blocks[0]!)));
      const tx = response.blocks[0]!.transactions.find(x => x.data.hash.toHexString().toLowerCase() === "0x3b2dd5d7f0dbfe17a49f1580dfbd8539e6c7770ee35e76796f3cd3076e7aceb3");

      expect(tx).toBeTruthy();
      console.log(JSON.stringify(tx!.receipt, null, 2));
      expect(tx!.receipt).toBeTruthy();
    });

    it("should fetch univ3 pool block", async () => {
      jest.setTimeout(100 * 1000)

      const query = new core.BlockQuery([core.Hash.fromHexString("0xedf6a173c2e54a4f737bb9294d075f9cc4b0678727b4e943f6c2529565b42b1d")]);
      const response = await QueryExecutor.execute(web3Eth, query);
      expect(response.blocks[0]!.transactions).not.toHaveLength(0);

      const tx = response.blocks[0]!.transactions.find(x => x.data.hash.toHexString().toLowerCase() === "0x69dd35b1d9bf03ce6a119562b19f1ca8ccc939d4abba3235253294056a696df6");

      expect(tx).toBeTruthy();
      const txState = core.json.transactionToState(tx!);
      console.log(JSON.stringify(txState, null, 2));
      expect(tx!.receipt).toBeTruthy();
    });
  });

  describe("MethodCallsQuery", () => {
    it("should call contract method", async () => {
      const query = new core.MethodCallsQuery(
        [
          new core.MethodCall(
            web3 => new web3.eth.Contract(bep20 as any, "0x55d398326f99059ff775485246999027b3197955").methods.balanceOf("0x551e668d75ae61597410aea9babb8e7e0b8a543f"),
            7000000
          ),
          new core.MethodCall(
            web3 => new web3.eth.Contract(bep20 as any, "0x55d398326f99059ff775485246999027b3197955").methods.balanceOf("0x551e668d75ae61597410aea9babb8e7e0b8a543f"),
            6000000
          ),
          new core.MethodCall(
            web3 => new web3.eth.Contract(bep20 as any, "0x55d398326f99059ff775485246999027b3197955").methods.balanceOf("0x551e668d75ae61597410aea9babb8e7e0b8a543f")
          ),
          new core.MethodCall(
            web3 => new web3.eth.Contract(bep20 as any, "0x55d398326f99059ff775485246999027b3197955").methods.totalSupply()
          ),
          new core.MethodCall(
            web3 => new web3.eth.Contract(bep20 as any, "0x55d398326f99059ff775485246999027b3197955").methods.decimals()
          ),
          new core.MethodCall(
            web3 => new web3.eth.Contract(bep20 as any, "0x55d398326f99059ff775485246999027b3197955").methods.name()
          ),
          new core.MethodCall(
            web3 => new web3.eth.Contract(bep20 as any, "0x55d398326f99059ff775485246999027b3197955").methods.symbol()
          ),
        ]);

      const response = await QueryExecutor.execute(web3, query);
      console.log(response);
    });
  });
});
