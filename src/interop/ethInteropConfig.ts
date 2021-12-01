import { Endpoint } from "./endpoints/endpoint";
import * as _ from "lodash";
import { EndpointMetadata } from "./endpoints/endpointMetadata";
import { ConnectionParams } from "./endpoints/connectionParams";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import path from "path";

export class EthInteropConfig {
  public static readonly empty = new EthInteropConfig([]);
  public readonly endpoints: Endpoint[];

  public constructor(endpoints: Endpoint[]) {
    this.endpoints = endpoints;
  }

  public static fromYamlFile(filePath: string): EthInteropConfig {
    const absPath = path.resolve(filePath);

    if (!fs.existsSync(absPath))
      return this.empty;

    const ymlContent = fs.readFileSync(absPath);

    return this.fromState(yaml.load(ymlContent.toString("utf8")) as EthInteropConfigState);
  }

  public static fromState(state?: EthInteropConfigState): EthInteropConfig {
    if (_.isNil(state) || _.isNil(state.endpoints) || _.isEmpty(state.endpoints))
      return this.empty;

    return new EthInteropConfig(Object.entries(state.endpoints)
      .filter(([key, val]) => val.disabled !== true)
      .map(([key, value]) => {
      return new Endpoint(
        key,
        new EndpointMetadata(
          value.archive || false,
          value.dedicated || false,
          value.slots || 1,
          value.streaming || false,
          value.requestLimits ? {
            count: value.requestLimits.count,
            intervalMs: value.requestLimits.intervalInSeconds * 1000
          } : undefined,
          value.fetch === false ? false : true,
          ),
        ConnectionParams.fromConnectionString(value.connectionString)
      );
    }));
  }
}

export interface EthInteropConfigState {
  endpoints: {
    [id: string]: {
      connectionString: string;
      disabled?: boolean;
      archive?: boolean;
      dedicated?: boolean;
      streaming?: boolean;
      fetch?: boolean;
      slots?: number;
      requestLimits?: {
        count: number;
        intervalInSeconds: number;
      }
    }
  }
}
