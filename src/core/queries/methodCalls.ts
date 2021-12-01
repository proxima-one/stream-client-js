import Web3 from "web3";

export class MethodCallsQuery {
  type = "methodCalls" as const;

  public readonly calls: ReadonlyArray<MethodCall>;

  public get count(): number {
    return this.calls.length;
  }

  public constructor(calls: ReadonlyArray<MethodCall>) {
    this.calls = calls;
  }

  public static single(call: MethodCall): MethodCallsQuery {
    return new MethodCallsQuery([call]);
  }
}

export class MethodCall {
  public readonly blockNumber?: number;
  public readonly functionCall: (web3: Web3) => any;
  public readonly allowFailure: boolean;

  public constructor(functionObj: (web3: Web3) => any, blockNumber?: number, allowFailure?: boolean) {
    this.blockNumber = blockNumber;
    this.functionCall = functionObj;
    this.allowFailure = allowFailure || false;
  }
}

export class MethodCallsResponse {
  public readonly callResults: ReadonlyArray<MethodCallResult>;

  public constructor(callResults: ReadonlyArray<MethodCallResult>) {
    this.callResults = callResults;
  }
}

export class MethodCallResult {
  public readonly returnObj: any;
  public readonly isSuccessful: boolean;

  public constructor(returnObj: any, isSuccessful: boolean) {
    this.returnObj = returnObj;
    this.isSuccessful = isSuccessful;
  }
}
