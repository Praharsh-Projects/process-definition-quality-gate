import { processDefinitionSchema, type ProcessDefinition } from "../schema/processDefinition.js";

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function collectTargets(definition: ProcessDefinition): string[] {
  const targets: string[] = [];
  for (const node of definition.nodes) {
    if (node.next) {
      targets.push(node.next);
    }
    for (const branch of node.branches ?? []) {
      targets.push(branch.target);
    }
  }
  return targets;
}

function findReachableNodes(definition: ProcessDefinition): Set<string> {
  const nodeMap = new Map(definition.nodes.map((node) => [node.id, node]));
  const visited = new Set<string>();
  const queue = [definition.startNodeId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) {
      continue;
    }
    visited.add(current);
    const node = nodeMap.get(current);
    if (!node) {
      continue;
    }
    if (node.next) {
      queue.push(node.next);
    }
    for (const branch of node.branches ?? []) {
      queue.push(branch.target);
    }
  }

  return visited;
}

export function validateDefinition(rawDefinition: unknown): ValidationResult {
  const parsed = processDefinitionSchema.safeParse(rawDefinition);
  if (!parsed.success) {
    return {
      passed: false,
      errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      warnings: []
    };
  }

  const definition = parsed.data;
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = definition.nodes.map((node) => node.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    errors.push("Node ids must be unique.");
  }

  const nodeMap = new Map(definition.nodes.map((node) => [node.id, node]));
  if (!nodeMap.has(definition.startNodeId)) {
    errors.push(`Start node '${definition.startNodeId}' is not defined.`);
  }

  const targets = collectTargets(definition);
  for (const target of targets) {
    if (!nodeMap.has(target)) {
      errors.push(`Transition target '${target}' is not defined.`);
    }
  }

  const startNodes = definition.nodes.filter((node) => node.type === "start");
  const endNodes = definition.nodes.filter((node) => node.type === "end");
  if (startNodes.length !== 1) {
    errors.push("Exactly one start node is required.");
  }
  if (endNodes.length === 0) {
    errors.push("At least one end node is required.");
  }

  for (const node of definition.nodes) {
    if (node.type === "userTask") {
      if (!node.owner) {
        errors.push(`User task '${node.id}' must define an owner.`);
      }
      if (!node.slaHours) {
        warnings.push(`User task '${node.id}' does not define an SLA.`);
      }
    }
    if (node.type === "decision" && (!node.branches || node.branches.length < 2)) {
      errors.push(`Decision node '${node.id}' must define at least two branches.`);
    }
    if (!["decision", "end"].includes(node.type) && !node.next) {
      errors.push(`Node '${node.id}' must define a next transition.`);
    }
  }

  const reachable = findReachableNodes(definition);
  for (const node of definition.nodes) {
    if (!reachable.has(node.id)) {
      warnings.push(`Node '${node.id}' is unreachable from the start node.`);
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}

