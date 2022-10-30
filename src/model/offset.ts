import { Timestamp } from "./timestamp";

export class Offset {
  public static readonly zero = new Offset("", BigInt(0), Timestamp.zero);

  public constructor(
    public readonly id: string,
    public readonly height: bigint,
    public readonly timestamp: Timestamp
  ) {}

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
    return this.height == BigInt(0)
      ? "0"
      : `${this.height}-${this.id}-${this.timestamp.toString()}`;
  }

  public static fromString(raw: string) {
    if (raw == "0") return this.zero;

    const parts = raw.split("-");
    const height = BigInt(parts[0]);
    const id = parts[1];
    const timestamp = Timestamp.fromString(parts[2]);

    return new Offset(id, height, timestamp);
  }
}
