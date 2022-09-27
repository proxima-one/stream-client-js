// package: stream_producer.v1alpha1
// file: stream_producer/v1alpha1/stream_producer.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as model_v1_model_pb from "../../model/v1/model_pb";

export class ProducerState extends jspb.Message {
  clearInputStreamsList(): void;
  getInputStreamsList(): Array<model_v1_model_pb.StreamStateRef>;
  setInputStreamsList(
    value: Array<model_v1_model_pb.StreamStateRef>
  ): ProducerState;
  addInputStreams(
    value?: model_v1_model_pb.StreamStateRef,
    index?: number
  ): model_v1_model_pb.StreamStateRef;
  clearOutputStreamsList(): void;
  getOutputStreamsList(): Array<model_v1_model_pb.StreamStateRef>;
  setOutputStreamsList(
    value: Array<model_v1_model_pb.StreamStateRef>
  ): ProducerState;
  addOutputStreams(
    value?: model_v1_model_pb.StreamStateRef,
    index?: number
  ): model_v1_model_pb.StreamStateRef;

  hasUserData(): boolean;
  clearUserData(): void;
  getUserData(): Uint8Array | string;
  getUserData_asU8(): Uint8Array;
  getUserData_asB64(): string;
  setUserData(value: Uint8Array | string): ProducerState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProducerState.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ProducerState
  ): ProducerState.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ProducerState,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): ProducerState;
  static deserializeBinaryFromReader(
    message: ProducerState,
    reader: jspb.BinaryReader
  ): ProducerState;
}

export namespace ProducerState {
  export type AsObject = {
    inputStreamsList: Array<model_v1_model_pb.StreamStateRef.AsObject>;
    outputStreamsList: Array<model_v1_model_pb.StreamStateRef.AsObject>;
    userData: Uint8Array | string;
  };
}

export class Producer extends jspb.Message {
  hasState(): boolean;
  clearState(): void;
  getState(): ProducerState | undefined;
  setState(value?: ProducerState): Producer;
  getUpdateToken(): string;
  setUpdateToken(value: string): Producer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Producer.AsObject;
  static toObject(includeInstance: boolean, msg: Producer): Producer.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: Producer,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): Producer;
  static deserializeBinaryFromReader(
    message: Producer,
    reader: jspb.BinaryReader
  ): Producer;
}

export namespace Producer {
  export type AsObject = {
    state?: ProducerState.AsObject;
    updateToken: string;
  };
}

export class StreamEvents extends jspb.Message {
  getStreamId(): string;
  setStreamId(value: string): StreamEvents;
  clearEventsList(): void;
  getEventsList(): Array<model_v1_model_pb.Event>;
  setEventsList(value: Array<model_v1_model_pb.Event>): StreamEvents;
  addEvents(
    value?: model_v1_model_pb.Event,
    index?: number
  ): model_v1_model_pb.Event;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamEvents.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: StreamEvents
  ): StreamEvents.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: StreamEvents,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): StreamEvents;
  static deserializeBinaryFromReader(
    message: StreamEvents,
    reader: jspb.BinaryReader
  ): StreamEvents;
}

export namespace StreamEvents {
  export type AsObject = {
    streamId: string;
    eventsList: Array<model_v1_model_pb.Event.AsObject>;
  };
}

export class CreateProducerRequest extends jspb.Message {
  getId(): string;
  setId(value: string): CreateProducerRequest;
  clearOutputStreamsList(): void;
  getOutputStreamsList(): Array<string>;
  setOutputStreamsList(value: Array<string>): CreateProducerRequest;
  addOutputStreams(value: string, index?: number): string;
  getForce(): boolean;
  setForce(value: boolean): CreateProducerRequest;

  hasUserData(): boolean;
  clearUserData(): void;
  getUserData(): Uint8Array | string;
  getUserData_asU8(): Uint8Array;
  getUserData_asB64(): string;
  setUserData(value: Uint8Array | string): CreateProducerRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProducerRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateProducerRequest
  ): CreateProducerRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CreateProducerRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): CreateProducerRequest;
  static deserializeBinaryFromReader(
    message: CreateProducerRequest,
    reader: jspb.BinaryReader
  ): CreateProducerRequest;
}

export namespace CreateProducerRequest {
  export type AsObject = {
    id: string;
    outputStreamsList: Array<string>;
    force: boolean;
    userData: Uint8Array | string;
  };
}

export class CreateProducerResponse extends jspb.Message {
  hasProducer(): boolean;
  clearProducer(): void;
  getProducer(): Producer | undefined;
  setProducer(value?: Producer): CreateProducerResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProducerResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateProducerResponse
  ): CreateProducerResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CreateProducerResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): CreateProducerResponse;
  static deserializeBinaryFromReader(
    message: CreateProducerResponse,
    reader: jspb.BinaryReader
  ): CreateProducerResponse;
}

export namespace CreateProducerResponse {
  export type AsObject = {
    producer?: Producer.AsObject;
  };
}

export class GetProducerRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetProducerRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProducerRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetProducerRequest
  ): GetProducerRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: GetProducerRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): GetProducerRequest;
  static deserializeBinaryFromReader(
    message: GetProducerRequest,
    reader: jspb.BinaryReader
  ): GetProducerRequest;
}

export namespace GetProducerRequest {
  export type AsObject = {
    id: string;
  };
}

export class GetProducerResponse extends jspb.Message {
  hasProducer(): boolean;
  clearProducer(): void;
  getProducer(): Producer | undefined;
  setProducer(value?: Producer): GetProducerResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProducerResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetProducerResponse
  ): GetProducerResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: GetProducerResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): GetProducerResponse;
  static deserializeBinaryFromReader(
    message: GetProducerResponse,
    reader: jspb.BinaryReader
  ): GetProducerResponse;
}

export namespace GetProducerResponse {
  export type AsObject = {
    producer?: Producer.AsObject;
  };
}

export class ProduceEventsRequest extends jspb.Message {
  getUpdateToken(): string;
  setUpdateToken(value: string): ProduceEventsRequest;

  hasProducerState(): boolean;
  clearProducerState(): void;
  getProducerState(): ProducerState | undefined;
  setProducerState(value?: ProducerState): ProduceEventsRequest;
  clearStreamEventsList(): void;
  getStreamEventsList(): Array<StreamEvents>;
  setStreamEventsList(value: Array<StreamEvents>): ProduceEventsRequest;
  addStreamEvents(value?: StreamEvents, index?: number): StreamEvents;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProduceEventsRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ProduceEventsRequest
  ): ProduceEventsRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ProduceEventsRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): ProduceEventsRequest;
  static deserializeBinaryFromReader(
    message: ProduceEventsRequest,
    reader: jspb.BinaryReader
  ): ProduceEventsRequest;
}

export namespace ProduceEventsRequest {
  export type AsObject = {
    updateToken: string;
    producerState?: ProducerState.AsObject;
    streamEventsList: Array<StreamEvents.AsObject>;
  };
}

export class ProduceEventsResponse extends jspb.Message {
  getUpdateToken(): string;
  setUpdateToken(value: string): ProduceEventsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProduceEventsResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ProduceEventsResponse
  ): ProduceEventsResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: ProduceEventsResponse,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): ProduceEventsResponse;
  static deserializeBinaryFromReader(
    message: ProduceEventsResponse,
    reader: jspb.BinaryReader
  ): ProduceEventsResponse;
}

export namespace ProduceEventsResponse {
  export type AsObject = {
    updateToken: string;
  };
}
