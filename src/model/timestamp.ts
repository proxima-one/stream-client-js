export class Timestamp {
  public static readonly zero = new Timestamp(0);
  public static readonly one = new Timestamp(1);

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

  public addParts(...parts: TimestampPart[]) {
    return new Timestamp(this.epochMs, [...this.parts, ...parts]);
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

    // shorter length means less
    return this.parts.length - timestamp.parts.length;
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

  public toString(): string {
    if (this.parts.length == 0) return this.epochMs.toString();

    const partsStr = this.parts.join(",");
    const partsBase64 = Buffer.from(partsStr).toString("base64");

    return `${this.epochMs}~${partsBase64}`;
  }

  public static fromString(value: string): Timestamp {
    const partsSeparatorIdx = value.indexOf("~");
    if (partsSeparatorIdx < 0) return this.fromEpochMs(value);

    const partsBase64 = value.substring(partsSeparatorIdx + 1);
    const partsStr = Buffer.from(partsBase64, "base64").toString("utf-8");
    const parts = partsStr
      .split(",")
      .map(part => (isNumeric(part) ? parseInt(part) : part));
    const epochMs = parseInt(value.substring(0, partsSeparatorIdx));

    return new Timestamp(epochMs, parts);
  }
}

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export type TimestampPart = number | string;
