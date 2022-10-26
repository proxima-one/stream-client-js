// TODO: use streamId as last part

export class Timestamp {
  public static readonly zero = new Timestamp(0);

  public readonly parts: TimestampPart[];
  public constructor(public readonly epochMs: number, parts?: TimestampPart[]) {
    this.parts = parts ?? [];
  }

  public static fromEpochSeconds(seconds: number | string): Timestamp {
    return typeof seconds === "string"
      ? new Timestamp(Math.round(parseInt(seconds)) * 1000)
      : new Timestamp(Math.round(seconds) * 1000);
  }

  public static fromEpochMs(ms: number | string): Timestamp {
    return typeof ms === "string"
      ? new Timestamp(Math.round(parseInt(ms)))
      : new Timestamp(Math.round(ms));
  }

  public withParts(parts: TimestampPart[]) {
    return new Timestamp(this.epochMs, parts);
  }

  public equals(timestamp: Timestamp): boolean {
    return this.compare(timestamp) == 0;
  }

  public greaterThanOrEqual(timestamp: Timestamp) {
    return this.compare(timestamp) >= 0;
  }

  public lessThanOrEqual(timestamp: Timestamp) {
    return this.compare(timestamp) <= 0;
  }

  public lessThan(timestamp: Timestamp) {
    return this.compare(timestamp) < 0;
  }

  public greaterThan(timestamp: Timestamp) {
    return this.compare(timestamp) > 0;
  }

  public compare(timestamp: Timestamp): number {
    if (this.epochMs < timestamp.epochMs) return -1;

    if (this.epochMs > timestamp.epochMs) return 1;

    const minLength = Math.min(this.parts.length, timestamp.parts.length);
    for (let i = 0; i < minLength; i++) {
      if (this.parts[i] > timestamp.parts[i]) return 1;

      if (this.parts[i] < timestamp.parts[i]) return -1;
    }

    return 0;
  }

  public static max(timestamps: Timestamp[]) {
    let res: Timestamp | undefined = undefined;
    for (const timestamp of timestamps) {
      if (!res || res.lessThan(timestamp)) res = timestamp;
    }
    return res;
  }

  public static min(timestamps: Timestamp[]) {
    let res: Timestamp | undefined = undefined;
    for (const timestamp of timestamps) {
      if (!res || res.greaterThan(timestamp)) res = timestamp;
    }
    return res;
  }

  public dump(): string {
    const partsStr = this.parts.length > 0 ? "," + this.parts.join(",") : ""
    return `${this.epochMs},${partsStr}`;
  }

  public toString(): string {
    return this.dump()
  }

  public static parse(rawTimestamp: string): Timestamp {
      const timestampParts = rawTimestamp
      .replace("(", "")
      .replace(")", "")
      .split(",");
    const epochMs = Number(timestampParts[0]);
    const timestamp = new Timestamp(epochMs);
    if (timestampParts.length > 1) {
      const parts = timestampParts.slice(1).map(part => {
        return String(part);
      });
      timestamp.withParts(parts);
    }
    return timestamp
    }
 }

export type TimestampPart = number | string;
// [16234234234234, "eth-main", 78, 10] ERC20 Transfer
// [16234234234234, "eth-main", 78, 2] Uniswap SWAP
// [16234234234234, "ex-rate-api"]
// [16234234234234, "bsc-main", 78, 2] Panckeaswap SWAP
