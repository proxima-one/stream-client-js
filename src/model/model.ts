import { Timestamp } from "./timestamp";

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
  public constructor(
    public readonly payload: Buffer,
    public readonly timestamp: Timestamp,
    public readonly undo: boolean
  ) {}
}

export class Transition {
  public constructor(
    public readonly newState: State,
    public readonly event: Event
  ) {}
}
