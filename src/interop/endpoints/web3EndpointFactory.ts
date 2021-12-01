import { ConnectionParams, HttpProviderParams, WsProviderParams } from "./connectionParams";
import Web3 from "web3";
import {HttpProviderOptions,WebsocketProviderOptions} from "web3-core-helpers";
import { strict as assert } from "assert";
import { extend } from "./support/extend";

export class Web3EndpointFactory {
  public static create(connectionParams: ConnectionParams): Web3 {
    const web3 = this.createImpl(connectionParams);
    extend(web3);
    return web3;
  }

  private static createImpl(connectionParams: ConnectionParams): Web3 {
    const provider = connectionParams.provider;
    assert(provider);

    if (provider instanceof HttpProviderParams) {
      const opts: HttpProviderOptions = {};

      if (provider.credentials)
        opts.headers = [
          {
            name: "Authorization",
            value: `Basic ${Buffer.from(`${provider.credentials.user}:${provider.credentials.password}`).toString('base64')}`,
          }
        ];

      return new Web3(new Web3.providers.HttpProvider(provider.host, opts));
    }

    if (provider instanceof WsProviderParams) {
      const opts: WebsocketProviderOptions = {};

      if (provider.credentials)
        opts.headers = [
          {
            name: "Authorization",
            value: `Basic ${Buffer.from(`${provider.credentials.user}:${provider.credentials.password}`).toString('base64')}`,
          }
        ];

      return new Web3(new Web3.providers.WebsocketProvider(provider.host, opts));
    }

    throw new Error(`Unknown connection provider ${connectionParams.provider.constructor.name}`);
  }
}
