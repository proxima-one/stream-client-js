import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import * as _ from "lodash";
// @ts-ignore
import defaultConfig from "./defaultConfig";

import {
  EthInterop,
  QueryExecutionOptions,
  EthInteropConfig, BlockHeadersStream
}
// @ts-ignore
from "@proximaone/proxima-eth";
import { skip, take } from "rxjs/operators";
import { core } from "../../src/";


describe("EthInterop", () => {
  let config: any = defaultConfig;
  const testConfigPath = process.env["TEST_INTEROP_CONFIG_PATH"];
  if (testConfigPath) {
    const configYaml = fs.readFileSync(testConfigPath);
    config = yaml.load(configYaml.toString("utf8"));
  }

  let interop: EthInterop;
  const ethDataSource: core.EthDataSource = {
    getNewBlockHeadersStream: () => interop.getNewBlockHeadersStream(),
    executeQuery: (query) => interop.executeQuery(query, QueryExecutionOptions.default)
  };

  beforeEach(async () => {
    interop = await EthInterop.create(EthInteropConfig.fromState(config));

  });

  afterEach(async () => {
    console.log("stats: ", interop.getStats().endpoints);
    interop.dispose();
  });

  it("should execute multiple queries in parallel", async () => {
    jest.setTimeout(100 * 1000);

    const execOptions = new QueryExecutionOptions(5, 20000);

    const query = core.BlockHeadersQuery.create(1000000, 100);
    const smallQueries = query.splitToBatches(20);

    const batches = await Promise.all(smallQueries.map(q => interop.executeQuery(q, execOptions)));
    const response = core.BlockHeadersResponse.fromBatches(batches);
  });

  it("should stream block headers", async () => {
    jest.setTimeout(100 * 1000);
    const stream = new BlockHeadersStream(ethDataSource).startFrom(0);

    return new Promise<void>(resolve => {
      stream
        .updateObservable(obs => obs.pipe(
          skip(10),
          take(30)
        ))
        .observable
        .subscribe(
          blockHeader => {
            //console.log("block: ", blockHeader.number, blockHeader.hash.toHexString())
          },
          err => console.log("error: ", err),
          () => {
            //console.log("complete");
            resolve();
          }
        );
    });
  });

  describe("load full blocks from different starting block numbers", () => {

    const batchHints = [{
      block: 0,
      value: 20
    }, {
      block: 3000000,
      value: 10
    }, {
      block: 4000000,
      value: 2
    }, {
      block: 5000000,
      value: 4
    }, {
      block: 6000000,
      value: 2
    }, {
      block: 7000000,
      value: 1
    }];
    const cases = [{
      start: 0,
      count: 1000
    },
      {
        start: 4787600,
        count: 100
      }
    //   {
    //   start: 1000000,
    //   count: 1000
    // },{
    //   start: 2000000,
    //   count: 1000
    // },{
    //   start: 3000000,
    //   count: 1000
    // },{
    //   start: 4000000,
    //   count: 1000
    // },{
    //   start: 5000000,
    //   count: 1000
    // },{
    //   start: 6000000,
    //   count: 500
    // },{
    //   start: 7000000,
    //   count: 300
    // },
    ];
    for (let testCase of cases)
      it(`should fetch ${testCase.count} blocks with transactions from ${testCase.start}`, async () => {
        jest.setTimeout(1000 * 1000);
        let hintIdx = batchHints.findIndex(x => x.block > testCase.start);
        hintIdx = hintIdx < 0 ? batchHints.length-1 : hintIdx - 1;
        const batchSizeHint = batchHints[hintIdx].value;

        const blockHeadersResponse = await interop.executeQuery(core.BlockHeadersQuery.create(testCase.start, testCase.count), QueryExecutionOptions.default);
        const blockResponse = await interop.executeQuery(new core.BlockQuery(blockHeadersResponse.blockHeaders.map(x => x.hash)), QueryExecutionOptions.default
          .withBatchSizeHint(batchSizeHint));

        const transactions = _.chain(blockResponse.blocks)
          .map(x => x!.transactions)
          .flatten()
          .value();

        const state = blockResponse.blocks.map(b => JSON.parse(core.json.blockSerdes.serialize(b!).toString()));
      });
  })
});
