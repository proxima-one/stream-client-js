// package: model.v1
// file: model/v1/model.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Offset extends jspb.Message { 
    getId(): string;
    setId(value: string): Offset;
    getHeight(): number;
    setHeight(value: number): Offset;

    hasTimestamp(): boolean;
    clearTimestamp(): void;
    getTimestamp(): Timestamp | undefined;
    setTimestamp(value?: Timestamp): Offset;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Offset.AsObject;
    static toObject(includeInstance: boolean, msg: Offset): Offset.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Offset, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Offset;
    static deserializeBinaryFromReader(message: Offset, reader: jspb.BinaryReader): Offset;
}

export namespace Offset {
    export type AsObject = {
        id: string,
        height: number,
        timestamp?: Timestamp.AsObject,
    }
}

export class Timestamp extends jspb.Message { 
    getEpochms(): number;
    setEpochms(value: number): Timestamp;
    clearPartsList(): void;
    getPartsList(): Array<string>;
    setPartsList(value: Array<string>): Timestamp;
    addParts(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Timestamp.AsObject;
    static toObject(includeInstance: boolean, msg: Timestamp): Timestamp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Timestamp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Timestamp;
    static deserializeBinaryFromReader(message: Timestamp, reader: jspb.BinaryReader): Timestamp;
}

export namespace Timestamp {
    export type AsObject = {
        epochms: number,
        partsList: Array<string>,
    }
}

export class Event extends jspb.Message { 

    hasTimestamp(): boolean;
    clearTimestamp(): void;
    getTimestamp(): Timestamp | undefined;
    setTimestamp(value?: Timestamp): Event;
    getPayload(): Uint8Array | string;
    getPayload_asU8(): Uint8Array;
    getPayload_asB64(): string;
    setPayload(value: Uint8Array | string): Event;
    getUndo(): boolean;
    setUndo(value: boolean): Event;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Event.AsObject;
    static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Event;
    static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
    export type AsObject = {
        timestamp?: Timestamp.AsObject,
        payload: Uint8Array | string,
        undo: boolean,
    }
}

export class StateTransition extends jspb.Message { 

    hasFrom(): boolean;
    clearFrom(): void;
    getFrom(): Offset | undefined;
    setFrom(value?: Offset): StateTransition;

    hasTo(): boolean;
    clearTo(): void;
    getTo(): Offset | undefined;
    setTo(value?: Offset): StateTransition;

    hasEvent(): boolean;
    clearEvent(): void;
    getEvent(): Event | undefined;
    setEvent(value?: Event): StateTransition;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StateTransition.AsObject;
    static toObject(includeInstance: boolean, msg: StateTransition): StateTransition.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StateTransition, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StateTransition;
    static deserializeBinaryFromReader(message: StateTransition, reader: jspb.BinaryReader): StateTransition;
}

export namespace StateTransition {
    export type AsObject = {
        from?: Offset.AsObject,
        to?: Offset.AsObject,
        event?: Event.AsObject,
    }
}

export class Stream extends jspb.Message { 
    getId(): string;
    setId(value: string): Stream;

    hasStart(): boolean;
    clearStart(): void;
    getStart(): Offset | undefined;
    setStart(value?: Offset): Stream;

    hasEnd(): boolean;
    clearEnd(): void;
    getEnd(): Offset | undefined;
    setEnd(value?: Offset): Stream;

    hasUserData(): boolean;
    clearUserData(): void;
    getUserData(): Uint8Array | string;
    getUserData_asU8(): Uint8Array;
    getUserData_asB64(): string;
    setUserData(value: Uint8Array | string): Stream;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Stream.AsObject;
    static toObject(includeInstance: boolean, msg: Stream): Stream.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Stream, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Stream;
    static deserializeBinaryFromReader(message: Stream, reader: jspb.BinaryReader): Stream;
}

export namespace Stream {
    export type AsObject = {
        id: string,
        start?: Offset.AsObject,
        end?: Offset.AsObject,
        userData: Uint8Array | string,
    }
}

export class StreamStateRef extends jspb.Message { 
    getStreamId(): string;
    setStreamId(value: string): StreamStateRef;

    hasOffset(): boolean;
    clearOffset(): void;
    getOffset(): Offset | undefined;
    setOffset(value?: Offset): StreamStateRef;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamStateRef.AsObject;
    static toObject(includeInstance: boolean, msg: StreamStateRef): StreamStateRef.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamStateRef, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamStateRef;
    static deserializeBinaryFromReader(message: StreamStateRef, reader: jspb.BinaryReader): StreamStateRef;
}

export namespace StreamStateRef {
    export type AsObject = {
        streamId: string,
        offset?: Offset.AsObject,
    }
}

export class State extends jspb.Message { 

    hasFrom(): boolean;
    clearFrom(): void;
    getFrom(): Offset | undefined;
    setFrom(value?: Offset): State;

    hasTo(): boolean;
    clearTo(): void;
    getTo(): Offset | undefined;
    setTo(value?: Offset): State;

    hasEvent(): boolean;
    clearEvent(): void;
    getEvent(): Event | undefined;
    setEvent(value?: Event): State;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): State.AsObject;
    static toObject(includeInstance: boolean, msg: State): State.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: State, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): State;
    static deserializeBinaryFromReader(message: State, reader: jspb.BinaryReader): State;
}

export namespace State {
    export type AsObject = {
        from?: Offset.AsObject,
        to?: Offset.AsObject,
        event?: Event.AsObject,
    }
}
