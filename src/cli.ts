import { readFile } from "node:fs/promises";

import { renderDefinitionMarkdown } from "./generator/docGenerator.js";
import { readJsonFile, writeTextFile } from "./io.js";
import { processDefinitionSchema } from "./schema/processDefinition.js";
import { simulatePath } from "./simulator/pathSimulator.js";
import { validateDefinition } from "./validator/definitionValidator.js";

function parseArgs(args: string[]) {
  const [command, target, ...rest] = args;
  const options = new Map<string, string>();
  for (let index = 0; index < rest.length; index += 2) {
    options.set(rest[index], rest[index + 1]);
  }
  return { command, target, options };
}

async function run(): Promise<number> {
  const { command, target, options } = parseArgs(process.argv.slice(2));
  if (!command || !target) {
    console.error("Usage: cli <validate|simulate|generate-docs> <definition.json> [options]");
    return 1;
  }

  const definitionRaw = await readJsonFile<unknown>(target);
  const validation = validateDefinition(definitionRaw);

  if (command === "validate") {
    const report = [
      "# Validation Report",
      "",
      `- Definition: \`${target}\``,
      `- Passed: ${validation.passed ? "yes" : "no"}`,
      "",
      "## Errors",
      ...(validation.errors.length > 0 ? validation.errors.map((error) => `- ${error}`) : ["- none"]),
      "",
      "## Warnings",
      ...(validation.warnings.length > 0 ? validation.warnings.map((warning) => `- ${warning}`) : ["- none"]),
      ""
    ].join("\n");
    const reportPath = options.get("--report");
    if (reportPath) {
      await writeTextFile(reportPath, report);
    } else {
      console.log(report);
    }
    return validation.passed ? 0 : 1;
  }

  const definition = processDefinitionSchema.parse(definitionRaw);

  if (command === "simulate") {
    const inputPath = options.get("--input");
    if (!inputPath) {
      console.error("simulate requires --input <variables.json>");
      return 1;
    }
    const input = JSON.parse(await readFile(inputPath, "utf8")) as Record<string, unknown>;
    const output = JSON.stringify({ path: simulatePath(definition, input) }, null, 2);
    const outPath = options.get("--out");
    if (outPath) {
      await writeTextFile(outPath, output);
    } else {
      console.log(output);
    }
    return 0;
  }

  if (command === "generate-docs") {
    const rendered = renderDefinitionMarkdown(definition, validation);
    const outPath = options.get("--out");
    if (outPath) {
      await writeTextFile(outPath, rendered);
    } else {
      console.log(rendered);
    }
    return 0;
  }

  console.error(`Unknown command '${command}'.`);
  return 1;
}

run().then((code) => {
  process.exitCode = code;
});

