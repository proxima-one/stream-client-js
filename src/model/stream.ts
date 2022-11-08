import { Offset } from ".";

export class StreamEvent {
  public constructor(
    public readonly offset: Offset,
    public readonly payload: Uint8Array,
    public readonly timestamp: number,
    public readonly undo: boolean
  ) {}

  public typed<T>(deserializer: (x: Uint8Array) => T) {
    return new TypedStreamEvent(
      this.offset,
      deserializer(this.payload),
      this.timestamp,
      this.undo
    );
  }
}

export class TypedStreamEvent<T> {
  public constructor(
    public readonly offset: Offset,
    public readonly payload: T,
    public readonly timestamp: number,
    public readonly undo: boolean
  ) {}
}

export class Stream {
  public constructor(
    public readonly name: string,
    public readonly metadata: StreamMetadata,
    public readonly endpoints: Readonly<Record<string, StreamEndpoint>>
  ) {}
}

export class StreamStats {
  public constructor(
    public readonly start: Offset,
    public readonly end: Offset | undefined,
    public readonly length: number | undefined,
    public readonly storageSize: number | undefined
  ) {}
}

export class StreamEndpoint {
  public constructor(
    public readonly uri: string,
    public readonly stats: StreamStats
  ) {}
}

export class StreamMetadata {
  public constructor(
    public readonly description: string,
    public readonly labels: Readonly<Record<string, string>>
  ) {}
}
