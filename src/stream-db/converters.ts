import * as proto_model from "../gen/model/v1/model";
import { strict as assert } from "assert";
import { StreamEvent, Offset } from "../public";
import { Timestamp } from "../model/timestamp";

export function stateTransitionProtoToStreamEvent(
  transition: proto_model.StateTransition
): StreamEvent {
  assert(transition.from && transition.to && transition.event);

  return new StreamEvent(
    protoToOffset(transition.to),
    transition.event.payload,
    transition.event.timestamp
      ? protoToTimestamp(transition.event.timestamp)
      : Timestamp.zero,
    transition.event.undo
  );
}

export function timestampToProto(timestamp: Timestamp): proto_model.Timestamp {
  return proto_model.Timestamp.fromPartial({
    epochMs: timestamp.epochMs,
    parts: timestamp.parts.map(part => {
      return part.toString();
    }),
  });
}

export function protoToTimestamp(
  timestampProto: proto_model.Timestamp
): Timestamp {
  return new Timestamp(timestampProto.epochMs, timestampProto.parts);
}

export function protoToOffset(offsetProto: proto_model.Offset): Offset {
  return new Offset(
    offsetProto.id,
    BigInt(offsetProto.height),
    offsetProto.timestamp
      ? new Timestamp(
          offsetProto.timestamp.epochMs,
          offsetProto.timestamp.parts
        )
      : Timestamp.zero
  );
}
export function offsetToProto(offset: Offset): proto_model.Offset {
  return proto_model.Offset.fromPartial({
    id: offset.id,
    height: Number(offset.height.toString())
      ? Number(offset.height.toString())
      : 1, //TODO: Fix issue with 0
    timestamp: proto_model.Timestamp.fromPartial({
      epochMs: offset.timestamp.epochMs,
      parts: offset.timestamp.parts.map(part => {
        return String(part);
      }),
    }),
  });
}
