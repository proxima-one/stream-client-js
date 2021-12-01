import Web3 from "web3";
import { fixedOutputBlockFormatter } from "./web3formatters";

const helpers = require('web3-core-helpers');
var formatter = helpers.formatters;

export function extend(web3: Web3) {
  web3.eth.extend({
    methods: [{
      name: 'getBlockByHashCustom',
      call: 'eth_getBlockByHash',
      params: 2,
      inputFormatter: [formatter.inputBlockNumberFormatter, function (val: any) { return !!val; }],
      outputFormatter: fixedOutputBlockFormatter as any
    }]
  });
}
