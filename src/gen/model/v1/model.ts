/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "model.v1";

export interface Offset {
  id: string;
  height: number;
  timestamp: Timestamp | undefined;
}

export interface Timestamp {
  epochMs: number;
  parts: string[];
}

export interface Event {
  timestamp: Timestamp | undefined;
  payload: Uint8Array;
  undo: boolean;
}

export interface StateTransition {
  from: Offset | undefined;
  to: Offset | undefined;
  event: Event | undefined;
}

export interface Stream {
  id: string;
  start: Offset | undefined;
  end: Offset | undefined;
  userData?: Uint8Array | undefined;
}

export interface StreamStateRef {
  streamId: string;
  offset: Offset | undefined;
}

export interface State {
  from: Offset | undefined;
  to: Offset | undefined;
  event: Event | undefined;
}

function createBaseOffset(): Offset {
  return { id: "", height: 0, timestamp: undefined };
}

export const Offset = {
  encode(
    message: Offset,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.height !== 0) {
      writer.uint32(16).int64(message.height);
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(message.timestamp, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Offset {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOffset();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.height = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.timestamp = Timestamp.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Offset {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      height: isSet(object.height) ? Number(object.height) : 0,
      timestamp: isSet(object.timestamp)
        ? Timestamp.fromJSON(object.timestamp)
        : undefined,
    };
  },

  toJSON(message: Offset): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.timestamp !== undefined &&
      (obj.timestamp = message.timestamp
        ? Timestamp.toJSON(message.timestamp)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Offset>, I>>(object: I): Offset {
    const message = createBaseOffset();
    message.id = object.id ?? "";
    message.height = object.height ?? 0;
    message.timestamp =
      object.timestamp !== undefined && object.timestamp !== null
        ? Timestamp.fromPartial(object.timestamp)
        : undefined;
    return message;
  },
};

function createBaseTimestamp(): Timestamp {
  return { epochMs: 0, parts: [] };
}

export const Timestamp = {
  encode(
    message: Timestamp,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.epochMs !== 0) {
      writer.uint32(8).int64(message.epochMs);
    }
    for (const v of message.parts) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Timestamp {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTimestamp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.epochMs = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.parts.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Timestamp {
    return {
      epochMs: isSet(object.epochMs) ? Number(object.epochMs) : 0,
      parts: Array.isArray(object?.parts)
        ? object.parts.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: Timestamp): unknown {
    const obj: any = {};
    message.epochMs !== undefined &&
      (obj.epochMs = Math.round(message.epochMs));
    if (message.parts) {
      obj.parts = message.parts.map((e) => e);
    } else {
      obj.parts = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Timestamp>, I>>(
    object: I
  ): Timestamp {
    const message = createBaseTimestamp();
    message.epochMs = object.epochMs ?? 0;
    message.parts = object.parts?.map((e) => e) || [];
    return message;
  },
};

function createBaseEvent(): Event {
  return { timestamp: undefined, payload: new Uint8Array(), undo: false };
}

export const Event = {
  encode(message: Event, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== undefined) {
      Timestamp.encode(message.timestamp, writer.uint32(10).fork()).ldelim();
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload);
    }
    if (message.undo === true) {
      writer.uint32(24).bool(message.undo);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Event {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestamp = Timestamp.decode(reader, reader.uint32());
          break;
        case 2:
          message.payload = reader.bytes();
          break;
        case 3:
          message.undo = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Event {
    return {
      timestamp: isSet(object.timestamp)
        ? Timestamp.fromJSON(object.timestamp)
        : undefined,
      payload: isSet(object.payload)
        ? bytesFromBase64(object.payload)
        : new Uint8Array(),
      undo: isSet(object.undo) ? Boolean(object.undo) : false,
    };
  },

  toJSON(message: Event): unknown {
    const obj: any = {};
    message.timestamp !== undefined &&
      (obj.timestamp = message.timestamp
        ? Timestamp.toJSON(message.timestamp)
        : undefined);
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ));
    message.undo !== undefined && (obj.undo = message.undo);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Event>, I>>(object: I): Event {
    const message = createBaseEvent();
    message.timestamp =
      object.timestamp !== undefined && object.timestamp !== null
        ? Timestamp.fromPartial(object.timestamp)
        : undefined;
    message.payload = object.payload ?? new Uint8Array();
    message.undo = object.undo ?? false;
    return message;
  },
};

function createBaseStateTransition(): StateTransition {
  return { from: undefined, to: undefined, event: undefined };
}

export const StateTransition = {
  encode(
    message: StateTransition,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.from !== undefined) {
      Offset.encode(message.from, writer.uint32(10).fork()).ldelim();
    }
    if (message.to !== undefined) {
      Offset.encode(message.to, writer.uint32(18).fork()).ldelim();
    }
    if (message.event !== undefined) {
      Event.encode(message.event, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StateTransition {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStateTransition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = Offset.decode(reader, reader.uint32());
          break;
        case 2:
          message.to = Offset.decode(reader, reader.uint32());
          break;
        case 3:
          message.event = Event.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StateTransition {
    return {
      from: isSet(object.from) ? Offset.fromJSON(object.from) : undefined,
      to: isSet(object.to) ? Offset.fromJSON(object.to) : undefined,
      event: isSet(object.event) ? Event.fromJSON(object.event) : undefined,
    };
  },

  toJSON(message: StateTransition): unknown {
    const obj: any = {};
    message.from !== undefined &&
      (obj.from = message.from ? Offset.toJSON(message.from) : undefined);
    message.to !== undefined &&
      (obj.to = message.to ? Offset.toJSON(message.to) : undefined);
    message.event !== undefined &&
      (obj.event = message.event ? Event.toJSON(message.event) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StateTransition>, I>>(
    object: I
  ): StateTransition {
    const message = createBaseStateTransition();
    message.from =
      object.from !== undefined && object.from !== null
        ? Offset.fromPartial(object.from)
        : undefined;
    message.to =
      object.to !== undefined && object.to !== null
        ? Offset.fromPartial(object.to)
        : undefined;
    message.event =
      object.event !== undefined && object.event !== null
        ? Event.fromPartial(object.event)
        : undefined;
    return message;
  },
};

function createBaseStream(): Stream {
  return { id: "", start: undefined, end: undefined, userData: undefined };
}

export const Stream = {
  encode(
    message: Stream,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.start !== undefined) {
      Offset.encode(message.start, writer.uint32(18).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Offset.encode(message.end, writer.uint32(26).fork()).ldelim();
    }
    if (message.userData !== undefined) {
      writer.uint32(34).bytes(message.userData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Stream {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStream();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.start = Offset.decode(reader, reader.uint32());
          break;
        case 3:
          message.end = Offset.decode(reader, reader.uint32());
          break;
        case 4:
          message.userData = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Stream {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      start: isSet(object.start) ? Offset.fromJSON(object.start) : undefined,
      end: isSet(object.end) ? Offset.fromJSON(object.end) : undefined,
      userData: isSet(object.userData)
        ? bytesFromBase64(object.userData)
        : undefined,
    };
  },

  toJSON(message: Stream): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.start !== undefined &&
      (obj.start = message.start ? Offset.toJSON(message.start) : undefined);
    message.end !== undefined &&
      (obj.end = message.end ? Offset.toJSON(message.end) : undefined);
    message.userData !== undefined &&
      (obj.userData =
        message.userData !== undefined
          ? base64FromBytes(message.userData)
          : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Stream>, I>>(object: I): Stream {
    const message = createBaseStream();
    message.id = object.id ?? "";
    message.start =
      object.start !== undefined && object.start !== null
        ? Offset.fromPartial(object.start)
        : undefined;
    message.end =
      object.end !== undefined && object.end !== null
        ? Offset.fromPartial(object.end)
        : undefined;
    message.userData = object.userData ?? undefined;
    return message;
  },
};

function createBaseStreamStateRef(): StreamStateRef {
  return { streamId: "", offset: undefined };
}

export const StreamStateRef = {
  encode(
    message: StreamStateRef,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.streamId !== "") {
      writer.uint32(10).string(message.streamId);
    }
    if (message.offset !== undefined) {
      Offset.encode(message.offset, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamStateRef {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamStateRef();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.streamId = reader.string();
          break;
        case 2:
          message.offset = Offset.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamStateRef {
    return {
      streamId: isSet(object.streamId) ? String(object.streamId) : "",
      offset: isSet(object.offset) ? Offset.fromJSON(object.offset) : undefined,
    };
  },

  toJSON(message: StreamStateRef): unknown {
    const obj: any = {};
    message.streamId !== undefined && (obj.streamId = message.streamId);
    message.offset !== undefined &&
      (obj.offset = message.offset ? Offset.toJSON(message.offset) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StreamStateRef>, I>>(
    object: I
  ): StreamStateRef {
    const message = createBaseStreamStateRef();
    message.streamId = object.streamId ?? "";
    message.offset =
      object.offset !== undefined && object.offset !== null
        ? Offset.fromPartial(object.offset)
        : undefined;
    return message;
  },
};

function createBaseState(): State {
  return { from: undefined, to: undefined, event: undefined };
}

export const State = {
  encode(message: State, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.from !== undefined) {
      Offset.encode(message.from, writer.uint32(10).fork()).ldelim();
    }
    if (message.to !== undefined) {
      Offset.encode(message.to, writer.uint32(18).fork()).ldelim();
    }
    if (message.event !== undefined) {
      Event.encode(message.event, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): State {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = Offset.decode(reader, reader.uint32());
          break;
        case 2:
          message.to = Offset.decode(reader, reader.uint32());
          break;
        case 3:
          message.event = Event.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): State {
    return {
      from: isSet(object.from) ? Offset.fromJSON(object.from) : undefined,
      to: isSet(object.to) ? Offset.fromJSON(object.to) : undefined,
      event: isSet(object.event) ? Event.fromJSON(object.event) : undefined,
    };
  },

  toJSON(message: State): unknown {
    const obj: any = {};
    message.from !== undefined &&
      (obj.from = message.from ? Offset.toJSON(message.from) : undefined);
    message.to !== undefined &&
      (obj.to = message.to ? Offset.toJSON(message.to) : undefined);
    message.event !== undefined &&
      (obj.event = message.event ? Event.toJSON(message.event) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<State>, I>>(object: I): State {
    const message = createBaseState();
    message.from =
      object.from !== undefined && object.from !== null
        ? Offset.fromPartial(object.from)
        : undefined;
    message.to =
      object.to !== undefined && object.to !== null
        ? Offset.fromPartial(object.to)
        : undefined;
    message.event =
      object.event !== undefined && object.event !== null
        ? Event.fromPartial(object.event)
        : undefined;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  arr.forEach((byte) => {
    bin.push(String.fromCharCode(byte));
  });
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
