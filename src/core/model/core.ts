import { strict as assert } from 'assert';
import { Bytes } from "../common";

export class BlockReference {
  public constructor(
    public readonly number: number,
    public readonly hash: Hash
  ) { }
}

export class TransactionReference {
  public constructor(
    public readonly hash: Hash,
    public readonly index: number
  ) {}
}

export class Hash {
  private readonly bytes: Bytes;

  private constructor(bytes: Bytes) {
    assert(bytes.length == 32, "hash must be 32 bytes");

    this.bytes = bytes;
  }

  public static fromByteArray(value: Uint8Array): Hash {
    const bytes = Bytes.fromByteArray(value);
    return new Hash(bytes);
  }

  public static fromHexString(value: string): Hash {
    const bytes = Bytes.fromHexString(value);
    return new Hash(bytes);
  }

  public toHexString(): string {
    return this.bytes.toHexString();
  }

  public toByteArray(): Uint8Array {
    return this.bytes.toByteArray();
  }
}

export class Address {
  private readonly bytes: Bytes;

  private constructor(bytes: Bytes) {
    assert(bytes.length == 20, "hash must be 20 bytes");
    this.bytes = bytes;
  }

  public static fromByteArray(value: Uint8Array): Address {
    const bytes = Bytes.fromByteArray(value);
    return new Address(bytes);
  }

  public static fromHexString(value: string): Address {
    const bytes = Bytes.fromHexString(value);
    return new Address(bytes);
  }

  public toHexString(): string {
    return this.bytes.toHexString();
  }

  public toByteArray(): Uint8Array {
    return this.bytes.toByteArray();
  }

  public equals(another: Address) {
    return this.toHexString() === another.toHexString();
  }
}
