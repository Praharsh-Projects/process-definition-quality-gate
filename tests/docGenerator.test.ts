import { describe, expect, it } from "vitest";

import definition from "../fixtures/definitions/grid-connection-request.json";
import { renderDefinitionMarkdown } from "../src/generator/docGenerator.js";

describe("doc generation", () => {
  it("renders markdown that includes the mermaid section", () => {
    const markdown = renderDefinitionMarkdown(definition, { errors: [], warnings: [] });

    expect(markdown).toContain("## Mermaid Flow");
    expect(markdown).toContain("capacity-review");
  });
});

