import { describe, expect, it } from "vitest";

import validDefinition from "../fixtures/definitions/grid-connection-request.json";
import invalidDefinition from "../fixtures/definitions/invalid-grid-connection.json";
import { validateDefinition } from "../src/validator/definitionValidator.js";

describe("definition validation", () => {
  it("passes a valid process definition", () => {
    const result = validateDefinition(validDefinition);

    expect(result.passed).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails invalid process definitions with useful errors", () => {
    const result = validateDefinition(invalidDefinition);

    expect(result.passed).toBe(false);
    expect(result.errors.some((error) => error.includes("Node ids must be unique"))).toBe(true);
  });
});

