import { z } from "zod";

export const opsCopilotResponseSchema = z.object({
  overallStatus: z
    .enum(["NORMAL", "WARNING", "CRITICAL"])
    .describe("The overall operational status of the stadium"),
  priorityLevel: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .describe("The priority level of the recommendations"),
  recommendedActions: z
    .array(z.string())
    .describe("List of advisory actions recommended for operations staff"),
  reasoning: z.string().describe("The rationale behind the recommendations"),
  confidenceScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Confidence score of the AI's assessment (0-100)"),
  affectedZones: z.array(z.string()).describe("List of zone IDs affected by the current situation"),
});

export type OpsCopilotResponse = z.infer<typeof opsCopilotResponseSchema>;
