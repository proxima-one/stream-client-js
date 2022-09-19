// package: stream_consumer.v1alpha1
// file: stream_consumer/v1alpha1/stream_consumer.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as model_v1_model_pb from "../../model/v1/model_pb";

export class FindStreamRequest extends jspb.Message { 
    getStreamId(): string;
    setStreamId(value: string): FindStreamRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FindStreamRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FindStreamRequest): FindStreamRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FindStreamRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FindStreamRequest;
    static deserializeBinaryFromReader(message: FindStreamRequest, reader: jspb.BinaryReader): FindStreamRequest;
}

export namespace FindStreamRequest {
    export type AsObject = {
        streamId: string,
    }
}

export class FindStreamResponse extends jspb.Message { 

    hasStream(): boolean;
    clearStream(): void;
    getStream(): model_v1_model_pb.Stream | undefined;
    setStream(value?: model_v1_model_pb.Stream): FindStreamResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FindStreamResponse.AsObject;
    static toObject(includeInstance: boolean, msg: FindStreamResponse): FindStreamResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FindStreamResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FindStreamResponse;
    static deserializeBinaryFromReader(message: FindStreamResponse, reader: jspb.BinaryReader): FindStreamResponse;
}

export namespace FindStreamResponse {
    export type AsObject = {
        stream?: model_v1_model_pb.Stream.AsObject,
    }
}

export class FindOffsetRequest extends jspb.Message { 
    getStreamId(): string;
    setStreamId(value: string): FindOffsetRequest;

    hasHeight(): boolean;
    clearHeight(): void;
    getHeight(): number;
    setHeight(value: number): FindOffsetRequest;

    hasTimestamp(): boolean;
    clearTimestamp(): void;
    getTimestamp(): model_v1_model_pb.Timestamp | undefined;
    setTimestamp(value?: model_v1_model_pb.Timestamp): FindOffsetRequest;

    getOffsetFilterCase(): FindOffsetRequest.OffsetFilterCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FindOffsetRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FindOffsetRequest): FindOffsetRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FindOffsetRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FindOffsetRequest;
    static deserializeBinaryFromReader(message: FindOffsetRequest, reader: jspb.BinaryReader): FindOffsetRequest;
}

export namespace FindOffsetRequest {
    export type AsObject = {
        streamId: string,
        height: number,
        timestamp?: model_v1_model_pb.Timestamp.AsObject,
    }

    export enum OffsetFilterCase {
        OFFSET_FILTER_NOT_SET = 0,
        HEIGHT = 2,
        TIMESTAMP = 3,
    }

}

export class FindOffsetResponse extends jspb.Message { 

    hasOffset(): boolean;
    clearOffset(): void;
    getOffset(): model_v1_model_pb.Offset | undefined;
    setOffset(value?: model_v1_model_pb.Offset): FindOffsetResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FindOffsetResponse.AsObject;
    static toObject(includeInstance: boolean, msg: FindOffsetResponse): FindOffsetResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FindOffsetResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FindOffsetResponse;
    static deserializeBinaryFromReader(message: FindOffsetResponse, reader: jspb.BinaryReader): FindOffsetResponse;
}

export namespace FindOffsetResponse {
    export type AsObject = {
        offset?: model_v1_model_pb.Offset.AsObject,
    }
}

export class GetStateTransitionsRequest extends jspb.Message { 
    getStreamId(): string;
    setStreamId(value: string): GetStateTransitionsRequest;

    hasOffset(): boolean;
    clearOffset(): void;
    getOffset(): model_v1_model_pb.Offset | undefined;
    setOffset(value?: model_v1_model_pb.Offset): GetStateTransitionsRequest;
    getCount(): number;
    setCount(value: number): GetStateTransitionsRequest;
    getDirection(): Direction;
    setDirection(value: Direction): GetStateTransitionsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetStateTransitionsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetStateTransitionsRequest): GetStateTransitionsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetStateTransitionsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetStateTransitionsRequest;
    static deserializeBinaryFromReader(message: GetStateTransitionsRequest, reader: jspb.BinaryReader): GetStateTransitionsRequest;
}

export namespace GetStateTransitionsRequest {
    export type AsObject = {
        streamId: string,
        offset?: model_v1_model_pb.Offset.AsObject,
        count: number,
        direction: Direction,
    }
}

export class GetStateTransitionsResponse extends jspb.Message { 
    clearStateTransitionsList(): void;
    getStateTransitionsList(): Array<model_v1_model_pb.StateTransition>;
    setStateTransitionsList(value: Array<model_v1_model_pb.StateTransition>): GetStateTransitionsResponse;
    addStateTransitions(value?: model_v1_model_pb.StateTransition, index?: number): model_v1_model_pb.StateTransition;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetStateTransitionsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetStateTransitionsResponse): GetStateTransitionsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetStateTransitionsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetStateTransitionsResponse;
    static deserializeBinaryFromReader(message: GetStateTransitionsResponse, reader: jspb.BinaryReader): GetStateTransitionsResponse;
}

export namespace GetStateTransitionsResponse {
    export type AsObject = {
        stateTransitionsList: Array<model_v1_model_pb.StateTransition.AsObject>,
    }
}

export class StreamStateTransitionsRequest extends jspb.Message { 
    getStreamId(): string;
    setStreamId(value: string): StreamStateTransitionsRequest;

    hasOffset(): boolean;
    clearOffset(): void;
    getOffset(): model_v1_model_pb.Offset | undefined;
    setOffset(value?: model_v1_model_pb.Offset): StreamStateTransitionsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamStateTransitionsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StreamStateTransitionsRequest): StreamStateTransitionsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamStateTransitionsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamStateTransitionsRequest;
    static deserializeBinaryFromReader(message: StreamStateTransitionsRequest, reader: jspb.BinaryReader): StreamStateTransitionsRequest;
}

export namespace StreamStateTransitionsRequest {
    export type AsObject = {
        streamId: string,
        offset?: model_v1_model_pb.Offset.AsObject,
    }
}

export class StreamStateTransitionsResponse extends jspb.Message { 
    clearStateTransitionList(): void;
    getStateTransitionList(): Array<model_v1_model_pb.StateTransition>;
    setStateTransitionList(value: Array<model_v1_model_pb.StateTransition>): StreamStateTransitionsResponse;
    addStateTransition(value?: model_v1_model_pb.StateTransition, index?: number): model_v1_model_pb.StateTransition;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamStateTransitionsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: StreamStateTransitionsResponse): StreamStateTransitionsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamStateTransitionsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamStateTransitionsResponse;
    static deserializeBinaryFromReader(message: StreamStateTransitionsResponse, reader: jspb.BinaryReader): StreamStateTransitionsResponse;
}

export namespace StreamStateTransitionsResponse {
    export type AsObject = {
        stateTransitionList: Array<model_v1_model_pb.StateTransition.AsObject>,
    }
}

export enum Direction {
    NEXT = 0,
    LAST = 1,
}
