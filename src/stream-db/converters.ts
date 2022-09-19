import { Offset as ModelOffset, Timestamp as ModelTimestamp, StateTransition as ModelStateTransition, StreamEvent as ModelStreamEvent, StreamEventsProducerState as ModelProducerState, StreamEvent, StreamOffsets}from "@proxima-one/proxima-streams";
import { Offset, Timestamp, StateTransition, Event, StreamStateRef } from "../gen/model/v1/model";
import {strict as assert} from "assert";
import {Bytes} from "@proxima-one/proxima-core";

export function toStateTransitionModel(transition: StateTransition): ModelStateTransition {
    assert(transition.from && transition.to && transition.event)
    return new ModelStateTransition(toOffsetModel(transition.from), toOffsetModel(transition.to), toStreamEventModel(transition.event))
}

export function toStreamEventModel(event: Event): ModelStreamEvent {
    return new ModelStreamEvent(event.timestamp ? new ModelTimestamp(event.timestamp.epochMs, event.timestamp.parts) : ModelTimestamp.zero, 
        Bytes.fromByteArray(Buffer.from(event.payload.toString())), event.undo)
}

export function toOffsetModel(offsetProto: Offset): ModelOffset {
    return new ModelOffset(offsetProto.id, BigInt(offsetProto.height), 
        offsetProto.timestamp ? new ModelTimestamp(offsetProto.timestamp.epochMs, offsetProto.timestamp.parts) : ModelTimestamp.zero)
}
export function toOffsetProto(offsetModel: ModelOffset): Offset {
    return Offset.fromPartial({id: offsetModel.id, 
        height: Number(offsetModel.height.toString()), timestamp: 
            Timestamp.fromPartial({epochMs: offsetModel.timestamp.epochMs, 
                parts: offsetModel.timestamp.parts.map((part) => {
                return String(part)
            })})})
}

export function toStreamOffsets(stateRefs: StreamStateRef[]): StreamOffsets {
    const offsets: Record<string, ModelOffset> = {}

    for (const v of stateRefs) {
        assert(v.offset)
        offsets[v.streamId] =  toOffsetModel(v.offset)
    }
    return new StreamOffsets(offsets)
}

