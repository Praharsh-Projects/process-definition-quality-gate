import type { ProcessDefinition } from "../schema/processDefinition.js";

export function renderDefinitionMarkdown(definition: ProcessDefinition, validationSummary: { errors: string[]; warnings: string[] }): string {
  const lines: string[] = [
    `# ${definition.name}`,
    "",
    `- Key: \`${definition.key}\``,
    `- Version: ${definition.version}`,
    `- Start node: \`${definition.startNodeId}\``,
    "",
    "## Nodes",
    "",
    "| Node ID | Type | Name | Owner | SLA (hours) |",
    "|---|---|---|---|---|"
  ];

  for (const node of definition.nodes) {
    lines.push(`| ${node.id} | ${node.type} | ${node.name} | ${node.owner ?? "-"} | ${node.slaHours ?? "-"} |`);
  }

  lines.push("", "## Mermaid Flow", "", "```mermaid", "flowchart TD");
  for (const node of definition.nodes) {
    if (node.next) {
      lines.push(`  ${node.id}["${node.name}"] --> ${node.next}`);
    }
    for (const branch of node.branches ?? []) {
      lines.push(`  ${node.id}["${node.name}"] -->|${branch.condition}| ${branch.target}`);
    }
  }
  lines.push("```", "", "## Validation Summary", "");

  if (validationSummary.errors.length === 0) {
    lines.push("- Errors: none");
  } else {
    for (const error of validationSummary.errors) {
      lines.push(`- Error: ${error}`);
    }
  }

  if (validationSummary.warnings.length === 0) {
    lines.push("- Warnings: none");
  } else {
    for (const warning of validationSummary.warnings) {
      lines.push(`- Warning: ${warning}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

