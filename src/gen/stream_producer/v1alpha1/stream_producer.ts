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
import _m0 from "protobufjs/minimal";
import { Event, StreamStateRef } from "../../model/v1/model";

export const protobufPackage = "stream_producer.v1alpha1";

export interface ProducerState {
  inputStreams: StreamStateRef[];
  outputStreams: StreamStateRef[];
}

export interface Producer {
  state: ProducerState | undefined;
  updateToken: string;
}

export interface StreamEvents {
  streamId: string;
  events: Event[];
}

export interface CreateProducerRequest {
  id: string;
  outputStreams: string[];
  force: boolean;
  userData?: Uint8Array | undefined;
}

export interface CreateProducerResponse {
  producer: Producer | undefined;
}

export interface GetProducerRequest {
  id: string;
}

export interface GetProducerResponse {
  producer: Producer | undefined;
}

export interface ProduceEventsRequest {
  updateToken: string;
  producerState: ProducerState | undefined;
  streamEvents: StreamEvents[];
}

export interface ProduceEventsResponse {
  updateToken: string;
}

function createBaseProducerState(): ProducerState {
  return { inputStreams: [], outputStreams: [] };
}

export const ProducerState = {
  encode(message: ProducerState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.inputStreams) {
      StreamStateRef.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.outputStreams) {
      StreamStateRef.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProducerState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProducerState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.inputStreams.push(StreamStateRef.decode(reader, reader.uint32()));
          break;
        case 2:
          message.outputStreams.push(StreamStateRef.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProducerState {
    return {
      inputStreams: Array.isArray(object?.inputStreams)
        ? object.inputStreams.map((e: any) => StreamStateRef.fromJSON(e))
        : [],
      outputStreams: Array.isArray(object?.outputStreams)
        ? object.outputStreams.map((e: any) => StreamStateRef.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ProducerState): unknown {
    const obj: any = {};
    if (message.inputStreams) {
      obj.inputStreams = message.inputStreams.map((e) => e ? StreamStateRef.toJSON(e) : undefined);
    } else {
      obj.inputStreams = [];
    }
    if (message.outputStreams) {
      obj.outputStreams = message.outputStreams.map((e) => e ? StreamStateRef.toJSON(e) : undefined);
    } else {
      obj.outputStreams = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProducerState>, I>>(base?: I): ProducerState {
    return ProducerState.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProducerState>, I>>(object: I): ProducerState {
    const message = createBaseProducerState();
    message.inputStreams = object.inputStreams?.map((e) => StreamStateRef.fromPartial(e)) || [];
    message.outputStreams = object.outputStreams?.map((e) => StreamStateRef.fromPartial(e)) || [];
    return message;
  },
};

function createBaseProducer(): Producer {
  return { state: undefined, updateToken: "" };
}

export const Producer = {
  encode(message: Producer, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.state !== undefined) {
      ProducerState.encode(message.state, writer.uint32(10).fork()).ldelim();
    }
    if (message.updateToken !== "") {
      writer.uint32(18).string(message.updateToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Producer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProducer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.state = ProducerState.decode(reader, reader.uint32());
          break;
        case 2:
          message.updateToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Producer {
    return {
      state: isSet(object.state) ? ProducerState.fromJSON(object.state) : undefined,
      updateToken: isSet(object.updateToken) ? String(object.updateToken) : "",
    };
  },

  toJSON(message: Producer): unknown {
    const obj: any = {};
    message.state !== undefined && (obj.state = message.state ? ProducerState.toJSON(message.state) : undefined);
    message.updateToken !== undefined && (obj.updateToken = message.updateToken);
    return obj;
  },

  create<I extends Exact<DeepPartial<Producer>, I>>(base?: I): Producer {
    return Producer.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Producer>, I>>(object: I): Producer {
    const message = createBaseProducer();
    message.state = (object.state !== undefined && object.state !== null)
      ? ProducerState.fromPartial(object.state)
      : undefined;
    message.updateToken = object.updateToken ?? "";
    return message;
  },
};

function createBaseStreamEvents(): StreamEvents {
  return { streamId: "", events: [] };
}

export const StreamEvents = {
  encode(message: StreamEvents, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamId !== "") {
      writer.uint32(10).string(message.streamId);
    }
    for (const v of message.events) {
      Event.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamEvents {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamEvents();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.streamId = reader.string();
          break;
        case 2:
          message.events.push(Event.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StreamEvents {
    return {
      streamId: isSet(object.streamId) ? String(object.streamId) : "",
      events: Array.isArray(object?.events) ? object.events.map((e: any) => Event.fromJSON(e)) : [],
    };
  },

  toJSON(message: StreamEvents): unknown {
    const obj: any = {};
    message.streamId !== undefined && (obj.streamId = message.streamId);
    if (message.events) {
      obj.events = message.events.map((e) => e ? Event.toJSON(e) : undefined);
    } else {
      obj.events = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamEvents>, I>>(base?: I): StreamEvents {
    return StreamEvents.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StreamEvents>, I>>(object: I): StreamEvents {
    const message = createBaseStreamEvents();
    message.streamId = object.streamId ?? "";
    message.events = object.events?.map((e) => Event.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreateProducerRequest(): CreateProducerRequest {
  return { id: "", outputStreams: [], force: false, userData: undefined };
}

export const CreateProducerRequest = {
  encode(message: CreateProducerRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    for (const v of message.outputStreams) {
      writer.uint32(18).string(v!);
    }
    if (message.force === true) {
      writer.uint32(24).bool(message.force);
    }
    if (message.userData !== undefined) {
      writer.uint32(34).bytes(message.userData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateProducerRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateProducerRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.outputStreams.push(reader.string());
          break;
        case 3:
          message.force = reader.bool();
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

  fromJSON(object: any): CreateProducerRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      outputStreams: Array.isArray(object?.outputStreams) ? object.outputStreams.map((e: any) => String(e)) : [],
      force: isSet(object.force) ? Boolean(object.force) : false,
      userData: isSet(object.userData) ? bytesFromBase64(object.userData) : undefined,
    };
  },

  toJSON(message: CreateProducerRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    if (message.outputStreams) {
      obj.outputStreams = message.outputStreams.map((e) => e);
    } else {
      obj.outputStreams = [];
    }
    message.force !== undefined && (obj.force = message.force);
    message.userData !== undefined &&
      (obj.userData = message.userData !== undefined ? base64FromBytes(message.userData) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateProducerRequest>, I>>(base?: I): CreateProducerRequest {
    return CreateProducerRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateProducerRequest>, I>>(object: I): CreateProducerRequest {
    const message = createBaseCreateProducerRequest();
    message.id = object.id ?? "";
    message.outputStreams = object.outputStreams?.map((e) => e) || [];
    message.force = object.force ?? false;
    message.userData = object.userData ?? undefined;
    return message;
  },
};

function createBaseCreateProducerResponse(): CreateProducerResponse {
  return { producer: undefined };
}

export const CreateProducerResponse = {
  encode(message: CreateProducerResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.producer !== undefined) {
      Producer.encode(message.producer, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateProducerResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateProducerResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.producer = Producer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateProducerResponse {
    return { producer: isSet(object.producer) ? Producer.fromJSON(object.producer) : undefined };
  },

  toJSON(message: CreateProducerResponse): unknown {
    const obj: any = {};
    message.producer !== undefined && (obj.producer = message.producer ? Producer.toJSON(message.producer) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateProducerResponse>, I>>(base?: I): CreateProducerResponse {
    return CreateProducerResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateProducerResponse>, I>>(object: I): CreateProducerResponse {
    const message = createBaseCreateProducerResponse();
    message.producer = (object.producer !== undefined && object.producer !== null)
      ? Producer.fromPartial(object.producer)
      : undefined;
    return message;
  },
};

function createBaseGetProducerRequest(): GetProducerRequest {
  return { id: "" };
}

export const GetProducerRequest = {
  encode(message: GetProducerRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProducerRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProducerRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProducerRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetProducerRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProducerRequest>, I>>(base?: I): GetProducerRequest {
    return GetProducerRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProducerRequest>, I>>(object: I): GetProducerRequest {
    const message = createBaseGetProducerRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetProducerResponse(): GetProducerResponse {
  return { producer: undefined };
}

export const GetProducerResponse = {
  encode(message: GetProducerResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.producer !== undefined) {
      Producer.encode(message.producer, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProducerResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProducerResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.producer = Producer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProducerResponse {
    return { producer: isSet(object.producer) ? Producer.fromJSON(object.producer) : undefined };
  },

  toJSON(message: GetProducerResponse): unknown {
    const obj: any = {};
    message.producer !== undefined && (obj.producer = message.producer ? Producer.toJSON(message.producer) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProducerResponse>, I>>(base?: I): GetProducerResponse {
    return GetProducerResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProducerResponse>, I>>(object: I): GetProducerResponse {
    const message = createBaseGetProducerResponse();
    message.producer = (object.producer !== undefined && object.producer !== null)
      ? Producer.fromPartial(object.producer)
      : undefined;
    return message;
  },
};

function createBaseProduceEventsRequest(): ProduceEventsRequest {
  return { updateToken: "", producerState: undefined, streamEvents: [] };
}

export const ProduceEventsRequest = {
  encode(message: ProduceEventsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.updateToken !== "") {
      writer.uint32(10).string(message.updateToken);
    }
    if (message.producerState !== undefined) {
      ProducerState.encode(message.producerState, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.streamEvents) {
      StreamEvents.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProduceEventsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProduceEventsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.updateToken = reader.string();
          break;
        case 2:
          message.producerState = ProducerState.decode(reader, reader.uint32());
          break;
        case 3:
          message.streamEvents.push(StreamEvents.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProduceEventsRequest {
    return {
      updateToken: isSet(object.updateToken) ? String(object.updateToken) : "",
      producerState: isSet(object.producerState) ? ProducerState.fromJSON(object.producerState) : undefined,
      streamEvents: Array.isArray(object?.streamEvents)
        ? object.streamEvents.map((e: any) => StreamEvents.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ProduceEventsRequest): unknown {
    const obj: any = {};
    message.updateToken !== undefined && (obj.updateToken = message.updateToken);
    message.producerState !== undefined &&
      (obj.producerState = message.producerState ? ProducerState.toJSON(message.producerState) : undefined);
    if (message.streamEvents) {
      obj.streamEvents = message.streamEvents.map((e) => e ? StreamEvents.toJSON(e) : undefined);
    } else {
      obj.streamEvents = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProduceEventsRequest>, I>>(base?: I): ProduceEventsRequest {
    return ProduceEventsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProduceEventsRequest>, I>>(object: I): ProduceEventsRequest {
    const message = createBaseProduceEventsRequest();
    message.updateToken = object.updateToken ?? "";
    message.producerState = (object.producerState !== undefined && object.producerState !== null)
      ? ProducerState.fromPartial(object.producerState)
      : undefined;
    message.streamEvents = object.streamEvents?.map((e) => StreamEvents.fromPartial(e)) || [];
    return message;
  },
};

function createBaseProduceEventsResponse(): ProduceEventsResponse {
  return { updateToken: "" };
}

export const ProduceEventsResponse = {
  encode(message: ProduceEventsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.updateToken !== "") {
      writer.uint32(10).string(message.updateToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProduceEventsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProduceEventsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.updateToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProduceEventsResponse {
    return { updateToken: isSet(object.updateToken) ? String(object.updateToken) : "" };
  },

  toJSON(message: ProduceEventsResponse): unknown {
    const obj: any = {};
    message.updateToken !== undefined && (obj.updateToken = message.updateToken);
    return obj;
  },

  create<I extends Exact<DeepPartial<ProduceEventsResponse>, I>>(base?: I): ProduceEventsResponse {
    return ProduceEventsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProduceEventsResponse>, I>>(object: I): ProduceEventsResponse {
    const message = createBaseProduceEventsResponse();
    message.updateToken = object.updateToken ?? "";
    return message;
  },
};

export type StreamProducerServiceService = typeof StreamProducerServiceService;
export const StreamProducerServiceService = {
  createProducer: {
    path: "/stream_producer.v1alpha1.StreamProducerService/CreateProducer",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateProducerRequest) => Buffer.from(CreateProducerRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateProducerRequest.decode(value),
    responseSerialize: (value: CreateProducerResponse) => Buffer.from(CreateProducerResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateProducerResponse.decode(value),
  },
  getProducer: {
    path: "/stream_producer.v1alpha1.StreamProducerService/GetProducer",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetProducerRequest) => Buffer.from(GetProducerRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetProducerRequest.decode(value),
    responseSerialize: (value: GetProducerResponse) => Buffer.from(GetProducerResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetProducerResponse.decode(value),
  },
  produceEvents: {
    path: "/stream_producer.v1alpha1.StreamProducerService/ProduceEvents",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ProduceEventsRequest) => Buffer.from(ProduceEventsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ProduceEventsRequest.decode(value),
    responseSerialize: (value: ProduceEventsResponse) => Buffer.from(ProduceEventsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ProduceEventsResponse.decode(value),
  },
} as const;

export interface StreamProducerServiceServer extends UntypedServiceImplementation {
  createProducer: handleUnaryCall<CreateProducerRequest, CreateProducerResponse>;
  getProducer: handleUnaryCall<GetProducerRequest, GetProducerResponse>;
  produceEvents: handleUnaryCall<ProduceEventsRequest, ProduceEventsResponse>;
}

export interface StreamProducerServiceClient extends Client {
  createProducer(
    request: CreateProducerRequest,
    callback: (error: ServiceError | null, response: CreateProducerResponse) => void,
  ): ClientUnaryCall;
  createProducer(
    request: CreateProducerRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CreateProducerResponse) => void,
  ): ClientUnaryCall;
  createProducer(
    request: CreateProducerRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CreateProducerResponse) => void,
  ): ClientUnaryCall;
  getProducer(
    request: GetProducerRequest,
    callback: (error: ServiceError | null, response: GetProducerResponse) => void,
  ): ClientUnaryCall;
  getProducer(
    request: GetProducerRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetProducerResponse) => void,
  ): ClientUnaryCall;
  getProducer(
    request: GetProducerRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetProducerResponse) => void,
  ): ClientUnaryCall;
  produceEvents(
    request: ProduceEventsRequest,
    callback: (error: ServiceError | null, response: ProduceEventsResponse) => void,
  ): ClientUnaryCall;
  produceEvents(
    request: ProduceEventsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ProduceEventsResponse) => void,
  ): ClientUnaryCall;
  produceEvents(
    request: ProduceEventsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ProduceEventsResponse) => void,
  ): ClientUnaryCall;
}

export const StreamProducerServiceClient = makeGenericClientConstructor(
  StreamProducerServiceService,
  "stream_producer.v1alpha1.StreamProducerService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): StreamProducerServiceClient;
  service: typeof StreamProducerServiceService;
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

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
