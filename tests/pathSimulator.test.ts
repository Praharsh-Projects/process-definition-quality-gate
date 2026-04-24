import { describe, expect, it } from "vitest";

import definition from "../fixtures/definitions/grid-connection-request.json";
import { simulatePath } from "../src/simulator/pathSimulator.js";

describe("path simulation", () => {
  it("routes high-capacity requests through technical review", () => {
    const path = simulatePath(definition, { capacityKw: 80 });

    expect(path).toEqual(["start", "validate-intake", "capacity-review", "technical-review", "offer-preparation", "complete"]);
  });

  it("routes low-capacity requests directly to offer preparation", () => {
    const path = simulatePath(definition, { capacityKw: 20 });

    expect(path).toEqual(["start", "validate-intake", "capacity-review", "offer-preparation", "complete"]);
  });
});

