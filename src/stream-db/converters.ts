import * as proto_model from "../gen/model/v1/model";
import { strict as assert } from "assert";
import { StreamEvent, Timestamp, Offset } from "../model";

export function stateTransitionProtoToStreamEvent(
  transition: proto_model.StateTransition
): StreamEvent {
  assert(transition.from && transition.to && transition.event);

  return new StreamEvent(
    protoToOffset(transition.to).dump(),
    transition.event.payload,
    transition.event.timestamp
      ? protoToTimestamp(transition.event.timestamp)
      : 0,
    transition.event.undo
  );
}

export function timestampToProto(timestamp: number): proto_model.Timestamp {
  return proto_model.Timestamp.fromPartial({
    epochMs: timestamp,
    parts: [],
  });
}

export function protoToTimestamp(
  timestampProto: proto_model.Timestamp
): number {
  return timestampProto.epochMs;
}

export function protoToOffset(offsetProto: proto_model.Offset): Offset {
  return new Offset(
    offsetProto.id,
    BigInt(offsetProto.height),
    offsetProto.timestamp
      ? Timestamp.fromEpochMs(offsetProto.timestamp.epochMs)
      : Timestamp.zero
  );
}
export function offsetToProto(offset: Offset): proto_model.Offset {
  return proto_model.Offset.fromPartial({
    id: offset.id,
    height: Number(offset.height.toString())
      ? Number(offset.height.toString())
      : 1,
    timestamp: proto_model.Timestamp.fromPartial({
      epochMs: offset.timestamp.epochMs,
      parts: [],
    }),
  });
}
