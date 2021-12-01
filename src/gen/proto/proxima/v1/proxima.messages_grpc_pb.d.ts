// package: proxima.streams.v1alpha1
// file: proto/proxima/v1/proxima.messages.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as proto_proxima_v1_proxima_messages_pb from "../../../proto/proxima/v1/proxima.messages_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IProximaStreamsServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getNextMessages: IProximaStreamsServiceService_IGetNextMessages;
    streamMessages: IProximaStreamsServiceService_IStreamMessages;
}

interface IProximaStreamsServiceService_IGetNextMessages extends grpc.MethodDefinition<proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest, proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse> {
    path: "/proxima.streams.v1alpha1.ProximaStreamsService/GetNextMessages";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest>;
    requestDeserialize: grpc.deserialize<proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest>;
    responseSerialize: grpc.serialize<proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse>;
    responseDeserialize: grpc.deserialize<proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse>;
}
interface IProximaStreamsServiceService_IStreamMessages extends grpc.MethodDefinition<proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest, proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse> {
    path: "/proxima.streams.v1alpha1.ProximaStreamsService/StreamMessages";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest>;
    requestDeserialize: grpc.deserialize<proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest>;
    responseSerialize: grpc.serialize<proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse>;
    responseDeserialize: grpc.deserialize<proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse>;
}

export const ProximaStreamsServiceService: IProximaStreamsServiceService;

export interface IProximaStreamsServiceServer extends grpc.UntypedServiceImplementation {
    getNextMessages: grpc.handleUnaryCall<proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest, proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse>;
    streamMessages: grpc.handleServerStreamingCall<proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest, proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse>;
}

export interface IProximaStreamsServiceClient {
    getNextMessages(request: proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest, callback: (error: grpc.ServiceError | null, response: proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse) => void): grpc.ClientUnaryCall;
    getNextMessages(request: proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse) => void): grpc.ClientUnaryCall;
    getNextMessages(request: proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse) => void): grpc.ClientUnaryCall;
    streamMessages(request: proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse>;
    streamMessages(request: proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse>;
}

export class ProximaStreamsServiceClient extends grpc.Client implements IProximaStreamsServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getNextMessages(request: proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest, callback: (error: grpc.ServiceError | null, response: proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse) => void): grpc.ClientUnaryCall;
    public getNextMessages(request: proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse) => void): grpc.ClientUnaryCall;
    public getNextMessages(request: proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse) => void): grpc.ClientUnaryCall;
    public streamMessages(request: proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse>;
    public streamMessages(request: proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse>;
}
