import { Timestamp } from "./timestamp";
import { JsonObject } from "./json";

export class State {
  public static readonly genesis: State = new State("");

  public constructor(public readonly id: string) {}

  public get isGenesis(): boolean {
    return this.id == "";
  }

  public toString() {
    return this.id;
  }
}

export class StreamStateRef {
  public constructor(
    public readonly stream: string,
    public readonly state: State
  ) {}
}

export class Event {
  private jsonPayload?: JsonObject;

  public constructor(
    public readonly payload: Uint8Array | string,
    public readonly timestamp: Timestamp,
    public readonly undo: boolean
  ) {}

  public get payloadAsJson(): JsonObject {
    if (this.jsonPayload) return this.jsonPayload;

    return (this.jsonPayload = decodeJson(this.payload));
  }
}

export class Transition {
  public constructor(
    public readonly newState: State,
    public readonly event: Event
  ) {}
}

function decodeJson(binary: Uint8Array | string): any {
  const buffer =
    typeof binary == "string"
      ? Buffer.from(binary, "base64")
      : Buffer.from(binary);
  return JSON.parse(buffer.toString("utf8"));
}
