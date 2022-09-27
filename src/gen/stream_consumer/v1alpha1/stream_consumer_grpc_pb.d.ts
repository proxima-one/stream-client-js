// package: stream_consumer.v1alpha1
// file: stream_consumer/v1alpha1/stream_consumer.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as stream_consumer_v1alpha1_stream_consumer_pb from "../../stream_consumer/v1alpha1/stream_consumer_pb";
import * as model_v1_model_pb from "../../model/v1/model_pb";

interface IStreamConsumerServiceService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  findStream: IStreamConsumerServiceService_IFindStream;
  findOffset: IStreamConsumerServiceService_IFindOffset;
  getStateTransitions: IStreamConsumerServiceService_IGetStateTransitions;
  streamStateTransitions: IStreamConsumerServiceService_IStreamStateTransitions;
}

interface IStreamConsumerServiceService_IFindStream
  extends grpc.MethodDefinition<
    stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse
  > {
  path: "/stream_consumer.v1alpha1.StreamConsumerService/FindStream";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest>;
  requestDeserialize: grpc.deserialize<stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest>;
  responseSerialize: grpc.serialize<stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse>;
  responseDeserialize: grpc.deserialize<stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse>;
}
interface IStreamConsumerServiceService_IFindOffset
  extends grpc.MethodDefinition<
    stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse
  > {
  path: "/stream_consumer.v1alpha1.StreamConsumerService/FindOffset";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest>;
  requestDeserialize: grpc.deserialize<stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest>;
  responseSerialize: grpc.serialize<stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse>;
  responseDeserialize: grpc.deserialize<stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse>;
}
interface IStreamConsumerServiceService_IGetStateTransitions
  extends grpc.MethodDefinition<
    stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse
  > {
  path: "/stream_consumer.v1alpha1.StreamConsumerService/GetStateTransitions";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest>;
  requestDeserialize: grpc.deserialize<stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest>;
  responseSerialize: grpc.serialize<stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse>;
  responseDeserialize: grpc.deserialize<stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse>;
}
interface IStreamConsumerServiceService_IStreamStateTransitions
  extends grpc.MethodDefinition<
    stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest,
    stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse
  > {
  path: "/stream_consumer.v1alpha1.StreamConsumerService/StreamStateTransitions";
  requestStream: false;
  responseStream: true;
  requestSerialize: grpc.serialize<stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest>;
  requestDeserialize: grpc.deserialize<stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest>;
  responseSerialize: grpc.serialize<stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse>;
  responseDeserialize: grpc.deserialize<stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse>;
}

export const StreamConsumerServiceService: IStreamConsumerServiceService;

export interface IStreamConsumerServiceServer
  extends grpc.UntypedServiceImplementation {
  findStream: grpc.handleUnaryCall<
    stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse
  >;
  findOffset: grpc.handleUnaryCall<
    stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse
  >;
  getStateTransitions: grpc.handleUnaryCall<
    stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse
  >;
  streamStateTransitions: grpc.handleServerStreamingCall<
    stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest,
    stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse
  >;
}

export interface IStreamConsumerServiceClient {
  findStream(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse
    ) => void
  ): grpc.ClientUnaryCall;
  findStream(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse
    ) => void
  ): grpc.ClientUnaryCall;
  findStream(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse
    ) => void
  ): grpc.ClientUnaryCall;
  findOffset(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse
    ) => void
  ): grpc.ClientUnaryCall;
  findOffset(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse
    ) => void
  ): grpc.ClientUnaryCall;
  findOffset(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse
    ) => void
  ): grpc.ClientUnaryCall;
  getStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  getStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  getStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  streamStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse>;
  streamStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse>;
}

export class StreamConsumerServiceClient
  extends grpc.Client
  implements IStreamConsumerServiceClient
{
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>
  );
  public findStream(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public findStream(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public findStream(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public findOffset(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public findOffset(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public findOffset(
    request: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public getStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public getStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public getStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public streamStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse>;
  public streamStateTransitions(
    request: stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest,
    metadata?: grpc.Metadata,
    options?: Partial<grpc.CallOptions>
  ): grpc.ClientReadableStream<stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse>;
}
