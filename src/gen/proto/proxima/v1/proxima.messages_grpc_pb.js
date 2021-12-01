// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_proxima_v1_proxima_messages_pb = require('../../../proto/proxima/v1/proxima.messages_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_proxima_streams_v1alpha1_GetNextMessagesRequest(arg) {
  if (!(arg instanceof proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest)) {
    throw new Error('Expected argument of type proxima.streams.v1alpha1.GetNextMessagesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_proxima_streams_v1alpha1_GetNextMessagesRequest(buffer_arg) {
  return proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_proxima_streams_v1alpha1_GetNextMessagesResponse(arg) {
  if (!(arg instanceof proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse)) {
    throw new Error('Expected argument of type proxima.streams.v1alpha1.GetNextMessagesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_proxima_streams_v1alpha1_GetNextMessagesResponse(buffer_arg) {
  return proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_proxima_streams_v1alpha1_StreamMessagesRequest(arg) {
  if (!(arg instanceof proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest)) {
    throw new Error('Expected argument of type proxima.streams.v1alpha1.StreamMessagesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_proxima_streams_v1alpha1_StreamMessagesRequest(buffer_arg) {
  return proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_proxima_streams_v1alpha1_StreamMessagesResponse(arg) {
  if (!(arg instanceof proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse)) {
    throw new Error('Expected argument of type proxima.streams.v1alpha1.StreamMessagesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_proxima_streams_v1alpha1_StreamMessagesResponse(buffer_arg) {
  return proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ProximaStreamsServiceService = exports.ProximaStreamsServiceService = {
  // returns requested amount of messages starting from any message
getNextMessages: {
    path: '/proxima.streams.v1alpha1.ProximaStreamsService/GetNextMessages',
    requestStream: false,
    responseStream: false,
    requestType: proto_proxima_v1_proxima_messages_pb.GetNextMessagesRequest,
    responseType: proto_proxima_v1_proxima_messages_pb.GetNextMessagesResponse,
    requestSerialize: serialize_proxima_streams_v1alpha1_GetNextMessagesRequest,
    requestDeserialize: deserialize_proxima_streams_v1alpha1_GetNextMessagesRequest,
    responseSerialize: serialize_proxima_streams_v1alpha1_GetNextMessagesResponse,
    responseDeserialize: deserialize_proxima_streams_v1alpha1_GetNextMessagesResponse,
  },
  // returns existing messages as an undefinite stream starting from any message
streamMessages: {
    path: '/proxima.streams.v1alpha1.ProximaStreamsService/StreamMessages',
    requestStream: false,
    responseStream: true,
    requestType: proto_proxima_v1_proxima_messages_pb.StreamMessagesRequest,
    responseType: proto_proxima_v1_proxima_messages_pb.StreamMessagesResponse,
    requestSerialize: serialize_proxima_streams_v1alpha1_StreamMessagesRequest,
    requestDeserialize: deserialize_proxima_streams_v1alpha1_StreamMessagesRequest,
    responseSerialize: serialize_proxima_streams_v1alpha1_StreamMessagesResponse,
    responseDeserialize: deserialize_proxima_streams_v1alpha1_StreamMessagesResponse,
  },
};

exports.ProximaStreamsServiceClient = grpc.makeGenericClientConstructor(ProximaStreamsServiceService);
