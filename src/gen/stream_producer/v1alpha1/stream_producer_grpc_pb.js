// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var stream_producer_v1alpha1_stream_producer_pb = require('../../stream_producer/v1alpha1/stream_producer_pb.js');
var model_v1_model_pb = require('../../model/v1/model_pb.js');

function serialize_stream_producer_v1alpha1_CreateProducerRequest(arg) {
  if (!(arg instanceof stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest)) {
    throw new Error('Expected argument of type stream_producer.v1alpha1.CreateProducerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_producer_v1alpha1_CreateProducerRequest(buffer_arg) {
  return stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_producer_v1alpha1_CreateProducerResponse(arg) {
  if (!(arg instanceof stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse)) {
    throw new Error('Expected argument of type stream_producer.v1alpha1.CreateProducerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_producer_v1alpha1_CreateProducerResponse(buffer_arg) {
  return stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_producer_v1alpha1_GetProducerRequest(arg) {
  if (!(arg instanceof stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest)) {
    throw new Error('Expected argument of type stream_producer.v1alpha1.GetProducerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_producer_v1alpha1_GetProducerRequest(buffer_arg) {
  return stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_producer_v1alpha1_GetProducerResponse(arg) {
  if (!(arg instanceof stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse)) {
    throw new Error('Expected argument of type stream_producer.v1alpha1.GetProducerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_producer_v1alpha1_GetProducerResponse(buffer_arg) {
  return stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_producer_v1alpha1_ProduceEventsRequest(arg) {
  if (!(arg instanceof stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest)) {
    throw new Error('Expected argument of type stream_producer.v1alpha1.ProduceEventsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_producer_v1alpha1_ProduceEventsRequest(buffer_arg) {
  return stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_producer_v1alpha1_ProduceEventsResponse(arg) {
  if (!(arg instanceof stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse)) {
    throw new Error('Expected argument of type stream_producer.v1alpha1.ProduceEventsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_producer_v1alpha1_ProduceEventsResponse(buffer_arg) {
  return stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var StreamProducerServiceService = exports.StreamProducerServiceService = {
  createProducer: {
    path: '/stream_producer.v1alpha1.StreamProducerService/CreateProducer',
    requestStream: false,
    responseStream: false,
    requestType: stream_producer_v1alpha1_stream_producer_pb.CreateProducerRequest,
    responseType: stream_producer_v1alpha1_stream_producer_pb.CreateProducerResponse,
    requestSerialize: serialize_stream_producer_v1alpha1_CreateProducerRequest,
    requestDeserialize: deserialize_stream_producer_v1alpha1_CreateProducerRequest,
    responseSerialize: serialize_stream_producer_v1alpha1_CreateProducerResponse,
    responseDeserialize: deserialize_stream_producer_v1alpha1_CreateProducerResponse,
  },
  getProducer: {
    path: '/stream_producer.v1alpha1.StreamProducerService/GetProducer',
    requestStream: false,
    responseStream: false,
    requestType: stream_producer_v1alpha1_stream_producer_pb.GetProducerRequest,
    responseType: stream_producer_v1alpha1_stream_producer_pb.GetProducerResponse,
    requestSerialize: serialize_stream_producer_v1alpha1_GetProducerRequest,
    requestDeserialize: deserialize_stream_producer_v1alpha1_GetProducerRequest,
    responseSerialize: serialize_stream_producer_v1alpha1_GetProducerResponse,
    responseDeserialize: deserialize_stream_producer_v1alpha1_GetProducerResponse,
  },
  produceEvents: {
    path: '/stream_producer.v1alpha1.StreamProducerService/ProduceEvents',
    requestStream: false,
    responseStream: false,
    requestType: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsRequest,
    responseType: stream_producer_v1alpha1_stream_producer_pb.ProduceEventsResponse,
    requestSerialize: serialize_stream_producer_v1alpha1_ProduceEventsRequest,
    requestDeserialize: deserialize_stream_producer_v1alpha1_ProduceEventsRequest,
    responseSerialize: serialize_stream_producer_v1alpha1_ProduceEventsResponse,
    responseDeserialize: deserialize_stream_producer_v1alpha1_ProduceEventsResponse,
  },
};

exports.StreamProducerServiceClient = grpc.makeGenericClientConstructor(StreamProducerServiceService);
