import { strict as assert } from "assert";

/*
  Represents bytes in Hex or ByteArray form
  Enforces conversions on demand
 */
export class Bytes {
  private readonly value: BytesFormat;

  public get length(): number {
    if (this.value.type === "ByteArray")
      return this.value.array.length;
    if (this.value.type === "HexString")
      return this.value.length;

    throw new Error("Inconsistent bytes state");
  }

  public constructor(value: BytesFormat) {
    this.value = value;
  }

  public toByteArray(): Uint8Array {
    if (this.value.type === "ByteArray")
      return this.value.array;

    if (this.value.type === "HexString") {
      const hex = this.value.hex;
      let offset = this.value.startsWith0x ? 2 : 0;

      let output = Buffer.alloc(this.value.length);
      for (let i = 0; i + offset < hex.length; i += 2) {
        const hexPos = i + offset;
        output[i / 2] = parseInt(hex.substr(hexPos, 2), 16);
      }
      return output;
    }

    throw new Error("Inconsistent bytes state");
  }

  public static fromHexString(hex: string): Bytes {
    assert(hex.length % 2 == 0, 'input ' + hex + ' has odd length');
    const startsWith0x = hex.length >= 2 && hex[0] === '0' && hex[1] === "x";

    return new Bytes({
      type: "HexString",
      hex: normalizeHex(hex),
      startsWith0x: startsWith0x,
      length: startsWith0x ? hex.length / 2 - 1 : hex.length / 2
    });
  }

  public static fromByteArray(byteArray: Uint8Array): Bytes {
    return new Bytes({
      type: "ByteArray",
      array: byteArray,
    });
  }

  public toHexString(): string {
    if (this.value.type === "HexString")
      return this.value.startsWith0x ? this.value.hex : "0x" + this.value.hex;
    if (this.value.type === "ByteArray") {
      let s = "";
      for (let i = 0; i < this.value.array.length; i++)
        s += ("0" + this.value.array[i].toString(16)).slice(-2);

      return "0x" + s;
    }

    throw new Error("Inconsistent bytes state");
  }
}

type BytesFormat = HexStringFormat | ByteArrayFormat;
type HexStringFormat = {
  type: "HexString";

  length: number;
  hex: string;
  startsWith0x: boolean;
}

type ByteArrayFormat = {
  type: "ByteArray"

  array: Uint8Array;
}

function normalizeHex(hex: string): string {
  return hasUpperHexChars(hex) ? hex.toLowerCase() : hex;
}

function hasUpperHexChars(hex: string): boolean {
  for (let i = 0; i < hex.length; i++) {
    if (hex[i] >= 'A' && hex[i] <= 'F')
      return true;
  }
  return false;
}
