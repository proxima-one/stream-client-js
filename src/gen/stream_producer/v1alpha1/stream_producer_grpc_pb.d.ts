// package: stream_producer.v1alpha1
// file: stream_producer/v1alpha1/stream_producer.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as stream_producer_v1alpha1_stream_producer_pb from "../../stream_producer/v1alpha1/stream_producer_pb";
import * as model_v1_model_pb from "../../model/v1/model_pb";

interface IStreamProducerServiceService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  createProducer: IStreamProducerServiceService_ICreateProducer;
  getProducer: IStreamProducerServiceService_IGetProducer;
  produceEvents: IStreamProducerServiceService_IProduceEvents;
}

interface IStreamProducerServiceService_ICreateProducer
  extends grpc.MethodDefinition<
    stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse
  > {
  path: "/stream_producer.v1alpha1.StreamProducerService/CreateProducer";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest>;
  requestDeserialize: grpc.deserialize<stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest>;
  responseSerialize: grpc.serialize<stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse>;
  responseDeserialize: grpc.deserialize<stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse>;
}
interface IStreamProducerServiceService_IGetProducer
  extends grpc.MethodDefinition<
    stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse
  > {
  path: "/stream_producer.v1alpha1.StreamProducerService/GetProducer";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest>;
  requestDeserialize: grpc.deserialize<stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest>;
  responseSerialize: grpc.serialize<stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse>;
  responseDeserialize: grpc.deserialize<stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse>;
}
interface IStreamProducerServiceService_IProduceEvents
  extends grpc.MethodDefinition<
    stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse
  > {
  path: "/stream_producer.v1alpha1.StreamProducerService/ProduceEvents";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest>;
  requestDeserialize: grpc.deserialize<stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest>;
  responseSerialize: grpc.serialize<stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse>;
  responseDeserialize: grpc.deserialize<stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse>;
}

export const StreamProducerServiceService: IStreamProducerServiceService;

export interface IStreamProducerServiceServer
  extends grpc.UntypedServiceImplementation {
  createProducer: grpc.handleUnaryCall<
    stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse
  >;
  getProducer: grpc.handleUnaryCall<
    stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse
  >;
  produceEvents: grpc.handleUnaryCall<
    stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse
  >;
}

export interface IStreamProducerServiceClient {
  createProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  createProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  createProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  getProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  getProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  getProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  produceEvents(
    request: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  produceEvents(
    request: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  produceEvents(
    request: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse
    ) => void
  ): grpc.ClientUnaryCall;
}

export class StreamProducerServiceClient
  extends grpc.Client
  implements IStreamProducerServiceClient
{
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>
  );
  public createProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public createProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public createProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public getProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public getProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public getProducer(
    request: stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public produceEvents(
    request: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public produceEvents(
    request: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse
    ) => void
  ): grpc.ClientUnaryCall;
  public produceEvents(
    request: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse
    ) => void
  ): grpc.ClientUnaryCall;
}
