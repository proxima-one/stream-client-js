import { strict as assert } from "assert";
import * as _ from "lodash";
import { parseConnectionString } from "../../core/common";

export class ConnectionParams {
  public readonly provider: ConnectionProviderParams<ConnectionProvider>;

  public constructor(provider: ConnectionProviderParams<ConnectionProvider>) {
    this.provider = provider;
  }

  public static create<TProvider extends ConnectionProvider>(
    provider: TProvider,
    providerInfo: ConnectionProviderParams<TProvider>): ConnectionParams {
    return new ConnectionParams(providerInfo);
  }

  public static fromConnectionString(connectionString: string): ConnectionParams {
    assert(connectionString);

    const options = parseConnectionString(connectionString);
    const provider = options["provider"];

    if (_.isEmpty(provider))
      throw new Error(`Invalid ConnectionString: Required "provider" property is not set. Sample: "provider=http"`)

    const providerInfoFactory = () => {
      switch (provider) {
        case "http":
          return HttpProviderParams.fromOptions(options);
        case "ws":
          return WsProviderParams.fromOptions(options);
        default:
          throw new Error(`Invalid ConnectionString: Unknown provider ${provider}`);
      }
    }

    return new ConnectionParams(providerInfoFactory());
  }
}

export type ConnectionProvider = "http" | "ws";
export class HttpProviderParams {
  public readonly host: string;
  public readonly credentials?: Credentials;

  public constructor(host: string, credentials?: Credentials) {
    this.host = host;
    this.credentials = credentials;
  }

  public static fromOptions(options: Record<string, string>): HttpProviderParams {
    assert(options.host);

    return new HttpProviderParams(
      options.host,
      options.user ? new Credentials(options.user, options.password) : undefined
    );
  }
}

export class WsProviderParams {
  public readonly host: string;
  public readonly credentials?: Credentials;

  public constructor(host: string, credentials?: Credentials) {
    this.host = host;
    this.credentials = credentials;
  }

  public static fromOptions(options: Record<string, string>): WsProviderParams {
    assert(options.host);

    return new WsProviderParams(
      options.host,
      options.user ? new Credentials(options.user, options.password) : undefined
    );
  }
}

export class Credentials {
  public readonly user: string;
  public readonly password: string;

  public constructor(user: string, password: string) {
    this.user = user;
    this.password = password;
  }
}
export type ConnectionProviderParams<T extends ConnectionProvider> =
  T extends "http" ? HttpProviderParams
  : T extends "ws" ? WsProviderParams
    : never;

