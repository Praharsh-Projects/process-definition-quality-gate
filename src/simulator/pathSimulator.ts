import type { ProcessDefinition } from "../schema/processDefinition.js";

function pickBranch(definition: ProcessDefinition, nodeId: string, variables: Record<string, unknown>): string {
  const node = definition.nodes.find((item) => item.id === nodeId);
  if (!node || node.type !== "decision") {
    throw new Error(`Decision node '${nodeId}' was not found.`);
  }

  for (const branch of node.branches ?? []) {
    if (branch.condition === "variables.capacityKw >= 50" && Number(variables.capacityKw ?? 0) >= 50) {
      return branch.target;
    }
    if (branch.condition === "default") {
      return branch.target;
    }
  }
  throw new Error(`Decision '${nodeId}' has no matching branch.`);
}

export function simulatePath(definition: ProcessDefinition, variables: Record<string, unknown>): string[] {
  const visited: string[] = [];
  let currentNodeId = definition.startNodeId;

  while (true) {
    const node = definition.nodes.find((item) => item.id === currentNodeId);
    if (!node) {
      throw new Error(`Node '${currentNodeId}' was not found.`);
    }
    visited.push(node.id);
    if (node.type === "end") {
      return visited;
    }
    if (node.type === "decision") {
      currentNodeId = pickBranch(definition, node.id, variables);
      continue;
    }
    if (!node.next) {
      throw new Error(`Node '${node.id}' does not define a next transition.`);
    }
    currentNodeId = node.next;
  }
}

