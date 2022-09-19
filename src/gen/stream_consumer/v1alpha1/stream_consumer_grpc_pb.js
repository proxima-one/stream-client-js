// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var stream_consumer_v1alpha1_stream_consumer_pb = require('../../stream_consumer/v1alpha1/stream_consumer_pb.js');
var model_v1_model_pb = require('../../model/v1/model_pb.js');

function serialize_stream_consumer_v1alpha1_FindOffsetRequest(arg) {
  if (!(arg instanceof stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest)) {
    throw new Error('Expected argument of type stream_consumer.v1alpha1.FindOffsetRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_consumer_v1alpha1_FindOffsetRequest(buffer_arg) {
  return stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_consumer_v1alpha1_FindOffsetResponse(arg) {
  if (!(arg instanceof stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse)) {
    throw new Error('Expected argument of type stream_consumer.v1alpha1.FindOffsetResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_consumer_v1alpha1_FindOffsetResponse(buffer_arg) {
  return stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_consumer_v1alpha1_FindStreamRequest(arg) {
  if (!(arg instanceof stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest)) {
    throw new Error('Expected argument of type stream_consumer.v1alpha1.FindStreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_consumer_v1alpha1_FindStreamRequest(buffer_arg) {
  return stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_consumer_v1alpha1_FindStreamResponse(arg) {
  if (!(arg instanceof stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse)) {
    throw new Error('Expected argument of type stream_consumer.v1alpha1.FindStreamResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_consumer_v1alpha1_FindStreamResponse(buffer_arg) {
  return stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_consumer_v1alpha1_GetStateTransitionsRequest(arg) {
  if (!(arg instanceof stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest)) {
    throw new Error('Expected argument of type stream_consumer.v1alpha1.GetStateTransitionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_consumer_v1alpha1_GetStateTransitionsRequest(buffer_arg) {
  return stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_consumer_v1alpha1_GetStateTransitionsResponse(arg) {
  if (!(arg instanceof stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse)) {
    throw new Error('Expected argument of type stream_consumer.v1alpha1.GetStateTransitionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_consumer_v1alpha1_GetStateTransitionsResponse(buffer_arg) {
  return stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_consumer_v1alpha1_StreamStateTransitionsRequest(arg) {
  if (!(arg instanceof stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest)) {
    throw new Error('Expected argument of type stream_consumer.v1alpha1.StreamStateTransitionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_consumer_v1alpha1_StreamStateTransitionsRequest(buffer_arg) {
  return stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stream_consumer_v1alpha1_StreamStateTransitionsResponse(arg) {
  if (!(arg instanceof stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse)) {
    throw new Error('Expected argument of type stream_consumer.v1alpha1.StreamStateTransitionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stream_consumer_v1alpha1_StreamStateTransitionsResponse(buffer_arg) {
  return stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var StreamConsumerServiceService = exports.StreamConsumerServiceService = {
  findStream: {
    path: '/stream_consumer.v1alpha1.StreamConsumerService/FindStream',
    requestStream: false,
    responseStream: false,
    requestType: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamRequest,
    responseType: stream_consumer_v1alpha1_stream_consumer_pb.FindStreamResponse,
    requestSerialize: serialize_stream_consumer_v1alpha1_FindStreamRequest,
    requestDeserialize: deserialize_stream_consumer_v1alpha1_FindStreamRequest,
    responseSerialize: serialize_stream_consumer_v1alpha1_FindStreamResponse,
    responseDeserialize: deserialize_stream_consumer_v1alpha1_FindStreamResponse,
  },
  findOffset: {
    path: '/stream_consumer.v1alpha1.StreamConsumerService/FindOffset',
    requestStream: false,
    responseStream: false,
    requestType: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetRequest,
    responseType: stream_consumer_v1alpha1_stream_consumer_pb.FindOffsetResponse,
    requestSerialize: serialize_stream_consumer_v1alpha1_FindOffsetRequest,
    requestDeserialize: deserialize_stream_consumer_v1alpha1_FindOffsetRequest,
    responseSerialize: serialize_stream_consumer_v1alpha1_FindOffsetResponse,
    responseDeserialize: deserialize_stream_consumer_v1alpha1_FindOffsetResponse,
  },
  getStateTransitions: {
    path: '/stream_consumer.v1alpha1.StreamConsumerService/GetStateTransitions',
    requestStream: false,
    responseStream: false,
    requestType: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsRequest,
    responseType: stream_consumer_v1alpha1_stream_consumer_pb.GetStateTransitionsResponse,
    requestSerialize: serialize_stream_consumer_v1alpha1_GetStateTransitionsRequest,
    requestDeserialize: deserialize_stream_consumer_v1alpha1_GetStateTransitionsRequest,
    responseSerialize: serialize_stream_consumer_v1alpha1_GetStateTransitionsResponse,
    responseDeserialize: deserialize_stream_consumer_v1alpha1_GetStateTransitionsResponse,
  },
  streamStateTransitions: {
    path: '/stream_consumer.v1alpha1.StreamConsumerService/StreamStateTransitions',
    requestStream: false,
    responseStream: true,
    requestType: stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsRequest,
    responseType: stream_consumer_v1alpha1_stream_consumer_pb.StreamStateTransitionsResponse,
    requestSerialize: serialize_stream_consumer_v1alpha1_StreamStateTransitionsRequest,
    requestDeserialize: deserialize_stream_consumer_v1alpha1_StreamStateTransitionsRequest,
    responseSerialize: serialize_stream_consumer_v1alpha1_StreamStateTransitionsResponse,
    responseDeserialize: deserialize_stream_consumer_v1alpha1_StreamStateTransitionsResponse,
  },
};

exports.StreamConsumerServiceClient = grpc.makeGenericClientConstructor(StreamConsumerServiceService);
