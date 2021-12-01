import * as _ from "lodash";
// @ts-ignore
import { EventsQuery, EventsResponse } from "./events";
import { Address, Hash } from "../model/core";

describe("EventsQuery", () => {
  const addr = Address.fromHexString("0x7AE2F5B9e386cd1B50A4550696D957cB4900f03a");
  it("should create valid instance", () => {
    const sut = EventsQuery.forContract(addr, [
      Hash.fromHexString("0xf3e388fc7511179b247b2cd049d4d49e87639b401c32573ca0a13decf29fcca5"),
      Hash.fromHexString("0xec39955e1f86e023abca09a851558c50f12cc930245d9dd0d600bd5f9dceb337"),
      Hash.fromHexString("0xf291f588b3d88f2a8eeb220c2734fccf2747a52cc9161e57a04c952b4d3f85aa"),
    ]);
    expect(sut.count).toBe(3);
  });
});
