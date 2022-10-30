import { strict as assert } from "assert";
import { Timestamp } from "./timestamp";

export class Offset {
  public static readonly zero = new Offset("", BigInt(0), Timestamp.zero);

  public constructor(
    public readonly id: string,
    public readonly height: bigint,
    public readonly timestamp: Timestamp
  ) {
    assert(id.length > 0 || height == BigInt(0));
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

  public toString(): string {
    return `${this.height}-${this.id}@(${this.timestamp.toString()})`;
  }

  public static parse(raw: string) {
    if (!raw) return Offset.zero;

    const offsetParts = raw.split("-");
    const secondParts = offsetParts[1].split("@");

    const height = BigInt(offsetParts[0]);
    const id = secondParts[0];

    const timestamp = Timestamp.parse(secondParts[1]);
    return new Offset(id, height, timestamp);
  }
}
