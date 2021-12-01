import { json } from "..";
import { mapBlockToTransport, mapBlockToModel } from "./mapping";

//todo: update block file to support all fields.
const sampleJson = require("../_testData/block.json");
const blockState = sampleJson as json.BlockState;

describe("mapping", () => {
  it("should map to the origin object", () => {
    const origin = json.stateToBlock(blockState);

    const transport = mapBlockToTransport(origin);
    const restored = mapBlockToModel(transport);

    expect(json.blockToState(origin)).toEqual(json.blockToState((restored)));
  });
});
