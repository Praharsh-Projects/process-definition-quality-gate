import { z } from "zod";

const branchSchema = z.object({
  condition: z.string().min(1),
  target: z.string().min(1)
});

const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["start", "serviceTask", "userTask", "decision", "end"]),
  name: z.string().min(1),
  next: z.string().optional(),
  branches: z.array(branchSchema).optional(),
  owner: z.string().optional(),
  slaHours: z.number().positive().optional()
});

export const processDefinitionSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  version: z.number().int().positive(),
  startNodeId: z.string().min(1),
  nodes: z.array(nodeSchema).min(2)
});

export type ProcessDefinition = z.infer<typeof processDefinitionSchema>;
export type ProcessNode = ProcessDefinition["nodes"][number];

