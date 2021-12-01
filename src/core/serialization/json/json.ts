import { Serdes } from "./serdes";

function serialize(json: any): Buffer {
  return Buffer.from(JSON.stringify(json));
}

function deserialize(buffer: Buffer): any {
  return JSON.parse(buffer.toString());
}

export function createSimpleJsonSerdes<T>(): Serdes<T> {
  return {
    serialize(val: T): Buffer {
      return serialize(val)
    },
    deserialize(buffer: Buffer): T {
      return deserialize(buffer) as T;
    }
  };
}

export function createJsonSerdes<T, TJson>(toJson: (model:T) => TJson, fromJson: (state: TJson) => T): Serdes<T> {
  return {
    serialize(val: T): Buffer {
      return serialize(toJson(val));
    },
    deserialize(buffer: Buffer): T {
      return fromJson(deserialize(buffer) as TJson);
    }
  };
}
