/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientReadableStream,
  ClientUnaryCall,
  handleServerStreamingCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Offset, StateTransition, Stream, Timestamp } from "../../model/v1/model";

export const protobufPackage = "stream_consumer.v1alpha1";

export enum Direction {
  NEXT = 0,
  LAST = 1,
  UNRECOGNIZED = -1,
}

export function directionFromJSON(object: any): Direction {
  switch (object) {
    case 0:
    case "NEXT":
      return Direction.NEXT;
    case 1:
    case "LAST":
      return Direction.LAST;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Direction.UNRECOGNIZED;
  }
}

export function directionToJSON(object: Direction): string {
  switch (object) {
    case Direction.NEXT:
      return "NEXT";
    case Direction.LAST:
      return "LAST";
    case Direction.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface FindStreamRequest {
  streamId: string;
}

export interface FindStreamResponse {
  stream: Stream | undefined;
}

export interface FindOffsetRequest {
  streamId: string;
  height?: number | undefined;
  timestamp?: Timestamp | undefined;
}

export interface FindOffsetResponse {
  offset: Offset | undefined;
}

export interface GetStateTransitionsRequest {
  streamId: string;
  offset: Offset | undefined;
  count: number;
  direction: Direction;
}

export interface GetStateTransitionsResponse {
  stateTransitions: StateTransition[];
}

export interface StreamStateTransitionsRequest {
  streamId: string;
  offset: Offset | undefined;
}

export interface StreamStateTransitionsResponse {
  stateTransition: StateTransition[];
}

function createBaseFindStreamRequest(): FindStreamRequest {
  return { streamId: "" };
}

export const FindStreamRequest = {
  encode(message: FindStreamRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamId !== "") {
      writer.uint32(10).string(message.streamId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FindStreamRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFindStreamRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.streamId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FindStreamRequest {
    return { streamId: isSet(object.streamId) ? String(object.streamId) : "" };
  },

  toJSON(message: FindStreamRequest): unknown {
    const obj: any = {};
    message.streamId !== undefined && (obj.streamId = message.streamId);
    return obj;
  },

  create<I extends Exact<DeepPartial<FindStreamRequest>, I>>(base?: I): FindStreamRequest {
    return FindStreamRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FindStreamRequest>, I>>(object: I): FindStreamRequest {
    const message = createBaseFindStreamRequest();
    message.streamId = object.streamId ?? "";
    return message;
  },
};

function createBaseFindStreamResponse(): FindStreamResponse {
  return { stream: undefined };
}

export const FindStreamResponse = {
  encode(message: FindStreamResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stream !== undefined) {
      Stream.encode(message.stream, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FindStreamResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFindStreamResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stream = Stream.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FindStreamResponse {
    return { stream: isSet(object.stream) ? Stream.fromJSON(object.stream) : undefined };
  },

  toJSON(message: FindStreamResponse): unknown {
    const obj: any = {};
    message.stream !== undefined && (obj.stream = message.stream ? Stream.toJSON(message.stream) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FindStreamResponse>, I>>(base?: I): FindStreamResponse {
    return FindStreamResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FindStreamResponse>, I>>(object: I): FindStreamResponse {
    const message = createBaseFindStreamResponse();
    message.stream = (object.stream !== undefined && object.stream !== null)
      ? Stream.fromPartial(object.stream)
      : undefined;
    return message;
  },
};

function createBaseFindOffsetRequest(): FindOffsetRequest {
  return { streamId: "", height: undefined, timestamp: undefined };
}

export const FindOffsetRequest = {
  encode(message: FindOffsetRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamId !== "") {
      writer.uint32(10).string(message.streamId);
    }
    if (message.height !== undefined) {
      writer.uint32(16).int64(message.height);
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(message.timestamp, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FindOffsetRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFindOffsetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.streamId = reader.string();
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

  fromJSON(object: any): FindOffsetRequest {
    return {
      streamId: isSet(object.streamId) ? String(object.streamId) : "",
      height: isSet(object.height) ? Number(object.height) : undefined,
      timestamp: isSet(object.timestamp) ? Timestamp.fromJSON(object.timestamp) : undefined,
    };
  },

  toJSON(message: FindOffsetRequest): unknown {
    const obj: any = {};
    message.streamId !== undefined && (obj.streamId = message.streamId);
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.timestamp !== undefined &&
      (obj.timestamp = message.timestamp ? Timestamp.toJSON(message.timestamp) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FindOffsetRequest>, I>>(base?: I): FindOffsetRequest {
    return FindOffsetRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FindOffsetRequest>, I>>(object: I): FindOffsetRequest {
    const message = createBaseFindOffsetRequest();
    message.streamId = object.streamId ?? "";
    message.height = object.height ?? undefined;
    message.timestamp = (object.timestamp !== undefined && object.timestamp !== null)
      ? Timestamp.fromPartial(object.timestamp)
      : undefined;
    return message;
  },
};

function createBaseFindOffsetResponse(): FindOffsetResponse {
  return { offset: undefined };
}

export const FindOffsetResponse = {
  encode(message: FindOffsetResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.offset !== undefined) {
      Offset.encode(message.offset, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FindOffsetResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFindOffsetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.offset = Offset.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FindOffsetResponse {
    return { offset: isSet(object.offset) ? Offset.fromJSON(object.offset) : undefined };
  },

  toJSON(message: FindOffsetResponse): unknown {
    const obj: any = {};
    message.offset !== undefined && (obj.offset = message.offset ? Offset.toJSON(message.offset) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FindOffsetResponse>, I>>(base?: I): FindOffsetResponse {
    return FindOffsetResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FindOffsetResponse>, I>>(object: I): FindOffsetResponse {
    const message = createBaseFindOffsetResponse();
    message.offset = (object.offset !== undefined && object.offset !== null)
      ? Offset.fromPartial(object.offset)
      : undefined;
    return message;
  },
};

function createBaseGetStateTransitionsRequest(): GetStateTransitionsRequest {
  return { streamId: "", offset: undefined, count: 0, direction: 0 };
}

export const GetStateTransitionsRequest = {
  encode(message: GetStateTransitionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamId !== "") {
      writer.uint32(10).string(message.streamId);
    }
    if (message.offset !== undefined) {
      Offset.encode(message.offset, writer.uint32(18).fork()).ldelim();
    }
    if (message.count !== 0) {
      writer.uint32(24).int32(message.count);
    }
    if (message.direction !== 0) {
      writer.uint32(32).int32(message.direction);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStateTransitionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStateTransitionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.streamId = reader.string();
          break;
        case 2:
          message.offset = Offset.decode(reader, reader.uint32());
          break;
        case 3:
          message.count = reader.int32();
          break;
        case 4:
          message.direction = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStateTransitionsRequest {
    return {
      streamId: isSet(object.streamId) ? String(object.streamId) : "",
      offset: isSet(object.offset) ? Offset.fromJSON(object.offset) : undefined,
      count: isSet(object.count) ? Number(object.count) : 0,
      direction: isSet(object.direction) ? directionFromJSON(object.direction) : 0,
    };
  },

  toJSON(message: GetStateTransitionsRequest): unknown {
    const obj: any = {};
    message.streamId !== undefined && (obj.streamId = message.streamId);
    message.offset !== undefined && (obj.offset = message.offset ? Offset.toJSON(message.offset) : undefined);
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.direction !== undefined && (obj.direction = directionToJSON(message.direction));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStateTransitionsRequest>, I>>(base?: I): GetStateTransitionsRequest {
    return GetStateTransitionsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStateTransitionsRequest>, I>>(object: I): GetStateTransitionsRequest {
    const message = createBaseGetStateTransitionsRequest();
    message.streamId = object.streamId ?? "";
    message.offset = (object.offset !== undefined && object.offset !== null)
      ? Offset.fromPartial(object.offset)
      : undefined;
    message.count = object.count ?? 0;
    message.direction = object.direction ?? 0;
    return message;
  },
};

function createBaseGetStateTransitionsResponse(): GetStateTransitionsResponse {
  return { stateTransitions: [] };
}

export const GetStateTransitionsResponse = {
  encode(message: GetStateTransitionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.stateTransitions) {
      StateTransition.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStateTransitionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStateTransitionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stateTransitions.push(StateTransition.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStateTransitionsResponse {
    return {
      stateTransitions: Array.isArray(object?.stateTransitions)
        ? object.stateTransitions.map((e: any) => StateTransition.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetStateTransitionsResponse): unknown {
    const obj: any = {};
    if (message.stateTransitions) {
      obj.stateTransitions = message.stateTransitions.map((e) => e ? StateTransition.toJSON(e) : undefined);
    } else {
      obj.stateTransitions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStateTransitionsResponse>, I>>(base?: I): GetStateTransitionsResponse {
    return GetStateTransitionsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStateTransitionsResponse>, I>>(object: I): GetStateTransitionsResponse {
    const message = createBaseGetStateTransitionsResponse();
    message.stateTransitions = object.stateTransitions?.map((e) => StateTransition.fromPartial(e)) || [];
    return message;
  },
};

function createBaseStreamStateTransitionsRequest(): StreamStateTransitionsRequest {
  return { streamId: "", offset: undefined };
}

export const StreamStateTransitionsRequest = {
  encode(message: StreamStateTransitionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamId !== "") {
      writer.uint32(10).string(message.streamId);
    }
    if (message.offset !== undefined) {
      Offset.encode(message.offset, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamStateTransitionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamStateTransitionsRequest();
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

  fromJSON(object: any): StreamStateTransitionsRequest {
    return {
      streamId: isSet(object.streamId) ? String(object.streamId) : "",
      offset: isSet(object.offset) ? Offset.fromJSON(object.offset) : undefined,
    };
  },

  toJSON(message: StreamStateTransitionsRequest): unknown {
    const obj: any = {};
    message.streamId !== undefined && (obj.streamId = message.streamId);
    message.offset !== undefined && (obj.offset = message.offset ? Offset.toJSON(message.offset) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamStateTransitionsRequest>, I>>(base?: I): StreamStateTransitionsRequest {
    return StreamStateTransitionsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StreamStateTransitionsRequest>, I>>(
    object: I,
  ): StreamStateTransitionsRequest {
    const message = createBaseStreamStateTransitionsRequest();
    message.streamId = object.streamId ?? "";
    message.offset = (object.offset !== undefined && object.offset !== null)
      ? Offset.fromPartial(object.offset)
      : undefined;
    return message;
  },
};

function createBaseStreamStateTransitionsResponse(): StreamStateTransitionsResponse {
  return { stateTransition: [] };
}

export const StreamStateTransitionsResponse = {
  encode(message: StreamStateTransitionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.stateTransition) {
      StateTransition.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamStateTransitionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamStateTransitionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stateTransition.push(StateTransition.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamStateTransitionsResponse {
    return {
      stateTransition: Array.isArray(object?.stateTransition)
        ? object.stateTransition.map((e: any) => StateTransition.fromJSON(e))
        : [],
    };
  },

  toJSON(message: StreamStateTransitionsResponse): unknown {
    const obj: any = {};
    if (message.stateTransition) {
      obj.stateTransition = message.stateTransition.map((e) => e ? StateTransition.toJSON(e) : undefined);
    } else {
      obj.stateTransition = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamStateTransitionsResponse>, I>>(base?: I): StreamStateTransitionsResponse {
    return StreamStateTransitionsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StreamStateTransitionsResponse>, I>>(
    object: I,
  ): StreamStateTransitionsResponse {
    const message = createBaseStreamStateTransitionsResponse();
    message.stateTransition = object.stateTransition?.map((e) => StateTransition.fromPartial(e)) || [];
    return message;
  },
};

export type StreamConsumerServiceService = typeof StreamConsumerServiceService;
export const StreamConsumerServiceService = {
  findStream: {
    path: "/stream_consumer.v1alpha1.StreamConsumerService/FindStream",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: FindStreamRequest) => Buffer.from(FindStreamRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => FindStreamRequest.decode(value),
    responseSerialize: (value: FindStreamResponse) => Buffer.from(FindStreamResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => FindStreamResponse.decode(value),
  },
  findOffset: {
    path: "/stream_consumer.v1alpha1.StreamConsumerService/FindOffset",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: FindOffsetRequest) => Buffer.from(FindOffsetRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => FindOffsetRequest.decode(value),
    responseSerialize: (value: FindOffsetResponse) => Buffer.from(FindOffsetResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => FindOffsetResponse.decode(value),
  },
  getStateTransitions: {
    path: "/stream_consumer.v1alpha1.StreamConsumerService/GetStateTransitions",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetStateTransitionsRequest) =>
      Buffer.from(GetStateTransitionsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetStateTransitionsRequest.decode(value),
    responseSerialize: (value: GetStateTransitionsResponse) =>
      Buffer.from(GetStateTransitionsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetStateTransitionsResponse.decode(value),
  },
  streamStateTransitions: {
    path: "/stream_consumer.v1alpha1.StreamConsumerService/StreamStateTransitions",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: StreamStateTransitionsRequest) =>
      Buffer.from(StreamStateTransitionsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => StreamStateTransitionsRequest.decode(value),
    responseSerialize: (value: StreamStateTransitionsResponse) =>
      Buffer.from(StreamStateTransitionsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => StreamStateTransitionsResponse.decode(value),
  },
} as const;

export interface StreamConsumerServiceServer extends UntypedServiceImplementation {
  findStream: handleUnaryCall<FindStreamRequest, FindStreamResponse>;
  findOffset: handleUnaryCall<FindOffsetRequest, FindOffsetResponse>;
  getStateTransitions: handleUnaryCall<GetStateTransitionsRequest, GetStateTransitionsResponse>;
  streamStateTransitions: handleServerStreamingCall<StreamStateTransitionsRequest, StreamStateTransitionsResponse>;
}

export interface StreamConsumerServiceClient extends Client {
  findStream(
    request: FindStreamRequest,
    callback: (error: ServiceError | null, response: FindStreamResponse) => void,
  ): ClientUnaryCall;
  findStream(
    request: FindStreamRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: FindStreamResponse) => void,
  ): ClientUnaryCall;
  findStream(
    request: FindStreamRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: FindStreamResponse) => void,
  ): ClientUnaryCall;
  findOffset(
    request: FindOffsetRequest,
    callback: (error: ServiceError | null, response: FindOffsetResponse) => void,
  ): ClientUnaryCall;
  findOffset(
    request: FindOffsetRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: FindOffsetResponse) => void,
  ): ClientUnaryCall;
  findOffset(
    request: FindOffsetRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: FindOffsetResponse) => void,
  ): ClientUnaryCall;
  getStateTransitions(
    request: GetStateTransitionsRequest,
    callback: (error: ServiceError | null, response: GetStateTransitionsResponse) => void,
  ): ClientUnaryCall;
  getStateTransitions(
    request: GetStateTransitionsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetStateTransitionsResponse) => void,
  ): ClientUnaryCall;
  getStateTransitions(
    request: GetStateTransitionsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetStateTransitionsResponse) => void,
  ): ClientUnaryCall;
  streamStateTransitions(
    request: StreamStateTransitionsRequest,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<StreamStateTransitionsResponse>;
  streamStateTransitions(
    request: StreamStateTransitionsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>,
  ): ClientReadableStream<StreamStateTransitionsResponse>;
}

export const StreamConsumerServiceClient = makeGenericClientConstructor(
  StreamConsumerServiceService,
  "stream_consumer.v1alpha1.StreamConsumerService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): StreamConsumerServiceClient;
  service: typeof StreamConsumerServiceService;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
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
