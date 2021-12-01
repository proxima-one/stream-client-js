
import { EndpointQueryRun, EndpointRuntimeStats, EndpointSelector, EndpointSelectorState }
// @ts-ignore
  from "./endpointSelector";
import { EndpointMetadata, RequestLimits } from "./endpointMetadata";

describe("EndpointSelector", () => {
  it("should select endpoint at first run", () => {
    const sut = new EndpointSelector([
      new EndpointSelectorState("e1", new EndpointMetadata(false, false, 1, false, undefined,
        true), new EndpointRuntimeStats(0, []))
    ]);

    const actual = sut.select(new Date().getTime());
    expect(actual).toBeTruthy();
    expect(actual).toBe("e1");
  });

  it("should not select endpoint when it's locked", () => {
    const sut = new EndpointSelector([
      new EndpointSelectorState("e1", new EndpointMetadata(false, false, 1, false, undefined,
        true), new EndpointRuntimeStats(1, []))
    ]);

    const actual = sut.select(new Date().getTime());
    expect(actual).toBeUndefined();
  });

  it("should not select endpoint when it exceeds request limits", () => {
    const sut = new EndpointSelector([
      new EndpointSelectorState("e1", new EndpointMetadata(
        false,
        false,
        1,
        false,
        new RequestLimits(2, 1000),
        true),
        new EndpointRuntimeStats(0, [
          new EndpointQueryRun(100, true),
          new EndpointQueryRun(1000, true),
          new EndpointQueryRun(1100, true),
        ])
      )
    ]);

    expect(sut.select(2000)).toBeUndefined();
    expect(sut.select(2001)).toBe("e1");
  });

  it("should not select endpoint when its failure ratio doesn't meet threshold", () => {
    const sut = new EndpointSelector([
      new EndpointSelectorState("e1", new EndpointMetadata(
        false,
        false,
        1,
        false,
        undefined,
        true),
        new EndpointRuntimeStats(0, [
          new EndpointQueryRun(100, true),
          new EndpointQueryRun(200, true),
          new EndpointQueryRun(300, true),
          new EndpointQueryRun(500, false),
        ])
      )
    ]);

    expect(sut.select(1000)).toBeUndefined();
    expect(sut.select(100000)).toBe("e1");
  });

  it("should not select endpoint if it meets required capabilities", () => {
    const sut = new EndpointSelector([
      new EndpointSelectorState("e1", new EndpointMetadata(
        false,
        false,
        1,
        false,
        undefined,
        true),
        new EndpointRuntimeStats(0, [])
      ),
      new EndpointSelectorState("e2", new EndpointMetadata(
        true,
        false,
        1,
        false,
        undefined,
        true),
        new EndpointRuntimeStats(0, [])
      )
    ]);

    expect(sut.select(1000, { archive: true })).toBe("e2");
  });

  it("should prioritize dedicated endpoint", () => {
    const sut = new EndpointSelector([
      new EndpointSelectorState("e1", new EndpointMetadata(
        false,
        false,
        2,
        false,
        undefined,
        true),
        new EndpointRuntimeStats(0, [])
      ),
      new EndpointSelectorState("e2", new EndpointMetadata(
        false,
        true,
        2,
        false,
        undefined,
        true),
        new EndpointRuntimeStats(1, [])
      )
    ]);

    expect(sut.select(1000)).toBe("e2");
  });


  it("should prioritize endpoints with less slots being used", () => {
    const sut = new EndpointSelector([
      new EndpointSelectorState("e1", new EndpointMetadata(
        false,
        false,
        5,
        false,
        undefined,
        true),
        new EndpointRuntimeStats(4, [])
      ),
      new EndpointSelectorState("e2", new EndpointMetadata(
        false,
        false,
        5,
        false,
        undefined,
        true),
        new EndpointRuntimeStats(3, [])
      ),
    ]);

    expect(sut.select(1000)).toBe("e2");
  });
});
