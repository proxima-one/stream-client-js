import { strict as assert } from "assert";
import { Timestamp } from "./timestamp";

export class Offset {
  public static readonly zero = new Offset("ZERO", BigInt(1), Timestamp.zero);

  public constructor(
    public readonly id: string,
    public readonly height: bigint,
    public readonly timestamp: Timestamp
  ) {
    //assert(id.length > 0 || height == BigInt(0));
  }

  public equals(offset: Offset): boolean {
    return this.id == offset.id;
  }

  public sameHeight(offset: Offset): boolean {
    return this.height == offset.height;
  }

  public canSucceed(offset: Offset): boolean {
    return (
      this.height - BigInt(1) == offset.height &&
      this.timestamp.greaterThan(offset.timestamp)
    );
  }

  public canPrecede(offset: Offset): boolean {
    if (this.equals(Offset.zero)) return true;

    return (
      this.height + BigInt(1) == offset.height &&
      this.timestamp.lessThan(offset.timestamp)
    );
  }

  public dump(): string {
    return `${this.height}-${this.id}@(${this.timestamp.dump()})`;
  }

  public static parse(raw: string) {
    const offsetParts = raw.split("-");
    const secondParts = offsetParts[1].split("@");

    const height = BigInt(offsetParts[0]);
    const id = secondParts[0];

    const timestampParts = secondParts[1]
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
    return new Offset(id, height, timestamp);
  }
}
