/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Offset } from "../../model/v1/model";

export const protobufPackage = "stream_stats.v1alpha1";

export interface GetStreamStatsRequest {
  streamId: string;
}

export interface GetStreamStatsResponse {
  stats: StreamStats | undefined;
}

export interface GetStreamsStatsResponse {
  stats: StreamStats[];
}

export interface GetStreamsStatsRequest {
  streamIds: string[];
  all?: boolean | undefined;
}

export interface StreamStats {
  id: string;
  start: Offset | undefined;
  end: Offset | undefined;
  totalStorageSize: number;
  messageCount: number;
}

function createBaseGetStreamStatsRequest(): GetStreamStatsRequest {
  return { streamId: "" };
}

export const GetStreamStatsRequest = {
  encode(message: GetStreamStatsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamId !== "") {
      writer.uint32(10).string(message.streamId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStreamStatsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStreamStatsRequest();
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

  fromJSON(object: any): GetStreamStatsRequest {
    return { streamId: isSet(object.streamId) ? String(object.streamId) : "" };
  },

  toJSON(message: GetStreamStatsRequest): unknown {
    const obj: any = {};
    message.streamId !== undefined && (obj.streamId = message.streamId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStreamStatsRequest>, I>>(base?: I): GetStreamStatsRequest {
    return GetStreamStatsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStreamStatsRequest>, I>>(object: I): GetStreamStatsRequest {
    const message = createBaseGetStreamStatsRequest();
    message.streamId = object.streamId ?? "";
    return message;
  },
};

function createBaseGetStreamStatsResponse(): GetStreamStatsResponse {
  return { stats: undefined };
}

export const GetStreamStatsResponse = {
  encode(message: GetStreamStatsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stats !== undefined) {
      StreamStats.encode(message.stats, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStreamStatsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStreamStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stats = StreamStats.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStreamStatsResponse {
    return { stats: isSet(object.stats) ? StreamStats.fromJSON(object.stats) : undefined };
  },

  toJSON(message: GetStreamStatsResponse): unknown {
    const obj: any = {};
    message.stats !== undefined && (obj.stats = message.stats ? StreamStats.toJSON(message.stats) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStreamStatsResponse>, I>>(base?: I): GetStreamStatsResponse {
    return GetStreamStatsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStreamStatsResponse>, I>>(object: I): GetStreamStatsResponse {
    const message = createBaseGetStreamStatsResponse();
    message.stats = (object.stats !== undefined && object.stats !== null)
      ? StreamStats.fromPartial(object.stats)
      : undefined;
    return message;
  },
};

function createBaseGetStreamsStatsResponse(): GetStreamsStatsResponse {
  return { stats: [] };
}

export const GetStreamsStatsResponse = {
  encode(message: GetStreamsStatsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.stats) {
      StreamStats.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStreamsStatsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStreamsStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stats.push(StreamStats.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStreamsStatsResponse {
    return { stats: Array.isArray(object?.stats) ? object.stats.map((e: any) => StreamStats.fromJSON(e)) : [] };
  },

  toJSON(message: GetStreamsStatsResponse): unknown {
    const obj: any = {};
    if (message.stats) {
      obj.stats = message.stats.map((e) => e ? StreamStats.toJSON(e) : undefined);
    } else {
      obj.stats = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStreamsStatsResponse>, I>>(base?: I): GetStreamsStatsResponse {
    return GetStreamsStatsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStreamsStatsResponse>, I>>(object: I): GetStreamsStatsResponse {
    const message = createBaseGetStreamsStatsResponse();
    message.stats = object.stats?.map((e) => StreamStats.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetStreamsStatsRequest(): GetStreamsStatsRequest {
  return { streamIds: [], all: undefined };
}

export const GetStreamsStatsRequest = {
  encode(message: GetStreamsStatsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.streamIds) {
      writer.uint32(10).string(v!);
    }
    if (message.all !== undefined) {
      writer.uint32(16).bool(message.all);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStreamsStatsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStreamsStatsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.streamIds.push(reader.string());
          break;
        case 2:
          message.all = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStreamsStatsRequest {
    return {
      streamIds: Array.isArray(object?.streamIds) ? object.streamIds.map((e: any) => String(e)) : [],
      all: isSet(object.all) ? Boolean(object.all) : undefined,
    };
  },

  toJSON(message: GetStreamsStatsRequest): unknown {
    const obj: any = {};
    if (message.streamIds) {
      obj.streamIds = message.streamIds.map((e) => e);
    } else {
      obj.streamIds = [];
    }
    message.all !== undefined && (obj.all = message.all);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStreamsStatsRequest>, I>>(base?: I): GetStreamsStatsRequest {
    return GetStreamsStatsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStreamsStatsRequest>, I>>(object: I): GetStreamsStatsRequest {
    const message = createBaseGetStreamsStatsRequest();
    message.streamIds = object.streamIds?.map((e) => e) || [];
    message.all = object.all ?? undefined;
    return message;
  },
};

function createBaseStreamStats(): StreamStats {
  return { id: "", start: undefined, end: undefined, totalStorageSize: 0, messageCount: 0 };
}

export const StreamStats = {
  encode(message: StreamStats, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.start !== undefined) {
      Offset.encode(message.start, writer.uint32(18).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Offset.encode(message.end, writer.uint32(26).fork()).ldelim();
    }
    if (message.totalStorageSize !== 0) {
      writer.uint32(32).int64(message.totalStorageSize);
    }
    if (message.messageCount !== 0) {
      writer.uint32(40).int64(message.messageCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamStats {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamStats();
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
          message.totalStorageSize = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.messageCount = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamStats {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      start: isSet(object.start) ? Offset.fromJSON(object.start) : undefined,
      end: isSet(object.end) ? Offset.fromJSON(object.end) : undefined,
      totalStorageSize: isSet(object.totalStorageSize) ? Number(object.totalStorageSize) : 0,
      messageCount: isSet(object.messageCount) ? Number(object.messageCount) : 0,
    };
  },

  toJSON(message: StreamStats): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.start !== undefined && (obj.start = message.start ? Offset.toJSON(message.start) : undefined);
    message.end !== undefined && (obj.end = message.end ? Offset.toJSON(message.end) : undefined);
    message.totalStorageSize !== undefined && (obj.totalStorageSize = Math.round(message.totalStorageSize));
    message.messageCount !== undefined && (obj.messageCount = Math.round(message.messageCount));
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamStats>, I>>(base?: I): StreamStats {
    return StreamStats.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StreamStats>, I>>(object: I): StreamStats {
    const message = createBaseStreamStats();
    message.id = object.id ?? "";
    message.start = (object.start !== undefined && object.start !== null)
      ? Offset.fromPartial(object.start)
      : undefined;
    message.end = (object.end !== undefined && object.end !== null) ? Offset.fromPartial(object.end) : undefined;
    message.totalStorageSize = object.totalStorageSize ?? 0;
    message.messageCount = object.messageCount ?? 0;
    return message;
  },
};

export type StreamStatsServiceService = typeof StreamStatsServiceService;
export const StreamStatsServiceService = {
  getStreamStats: {
    path: "/stream_stats.v1alpha1.StreamStatsService/GetStreamStats",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetStreamStatsRequest) => Buffer.from(GetStreamStatsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetStreamStatsRequest.decode(value),
    responseSerialize: (value: GetStreamStatsResponse) => Buffer.from(GetStreamStatsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetStreamStatsResponse.decode(value),
  },
  getStreamsStats: {
    path: "/stream_stats.v1alpha1.StreamStatsService/GetStreamsStats",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetStreamsStatsRequest) => Buffer.from(GetStreamsStatsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetStreamsStatsRequest.decode(value),
    responseSerialize: (value: GetStreamsStatsResponse) => Buffer.from(GetStreamsStatsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetStreamsStatsResponse.decode(value),
  },
} as const;

export interface StreamStatsServiceServer extends UntypedServiceImplementation {
  getStreamStats: handleUnaryCall<GetStreamStatsRequest, GetStreamStatsResponse>;
  getStreamsStats: handleUnaryCall<GetStreamsStatsRequest, GetStreamsStatsResponse>;
}

export interface StreamStatsServiceClient extends Client {
  getStreamStats(
    request: GetStreamStatsRequest,
    callback: (error: ServiceError | null, response: GetStreamStatsResponse) => void,
  ): ClientUnaryCall;
  getStreamStats(
    request: GetStreamStatsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetStreamStatsResponse) => void,
  ): ClientUnaryCall;
  getStreamStats(
    request: GetStreamStatsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetStreamStatsResponse) => void,
  ): ClientUnaryCall;
  getStreamsStats(
    request: GetStreamsStatsRequest,
    callback: (error: ServiceError | null, response: GetStreamsStatsResponse) => void,
  ): ClientUnaryCall;
  getStreamsStats(
    request: GetStreamsStatsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetStreamsStatsResponse) => void,
  ): ClientUnaryCall;
  getStreamsStats(
    request: GetStreamsStatsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetStreamsStatsResponse) => void,
  ): ClientUnaryCall;
}

export const StreamStatsServiceClient = makeGenericClientConstructor(
  StreamStatsServiceService,
  "stream_stats.v1alpha1.StreamStatsService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): StreamStatsServiceClient;
  service: typeof StreamStatsServiceService;
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
