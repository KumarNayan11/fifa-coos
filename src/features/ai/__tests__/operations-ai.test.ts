import { describe, it, expect, vi, beforeEach } from "vitest";
import { OperationsAiService } from "../services/operations-ai.service";
import { composeOpsPrompt } from "../services/ops-prompt-composer";
import { generateObject } from "ai";
import { opsCopilotResponseSchema } from "../types/ops-ai.types";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@ai-sdk/google", () => ({
  google: vi.fn().mockReturnValue("mocked-google-model"),
}));

describe("Operations AI Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ops-prompt-composer", () => {
    it("should assemble a prompt containing incidents and telemetry", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const incidents: any[] = [{ title: "Test Incident", status: "reported", severity: "high" }];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const telemetry: any = {
        globalCrowdDensity: 45,
        gateThroughput: 12,
        zones: [{ zoneId: "z1", zoneName: "Zone 1", crowdDensity: 40, incidentProbability: 5 }],
      };

      const prompt = composeOpsPrompt(incidents, telemetry, "en");

      expect(prompt).toContain("## System Identity");
      expect(prompt).toContain("## Advisory Policy");
      expect(prompt).toContain("NEVER state that an action has already been taken");
      expect(prompt).toContain("Test Incident");
      expect(prompt).toContain("Global Crowd Density: 45%");
      expect(prompt).toContain("Zone 1 (ID: z1)");
    });

    it("should gracefully handle empty incidents and null telemetry", () => {
      const prompt = composeOpsPrompt([], null, "en");

      expect(prompt).toContain("No active incidents reported.");
      expect(prompt).toContain("Telemetry data is currently unavailable.");
    });
  });

  describe("operations-ai.service", () => {
    it("should return validated response on successful AI generation", async () => {
      const mockResponse = {
        overallStatus: "WARNING",
        priorityLevel: "MEDIUM",
        recommendedActions: ["Action 1"],
        reasoning: "Test reason",
        confidenceScore: 85,
        affectedZones: ["z1"],
      };

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: mockResponse,
      } as never);

      const result = await OperationsAiService.getDecisionSupport([], null, "en");

      expect(generateObject).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it("should fallback to null if AI provider throws an error", async () => {
      vi.mocked(generateObject).mockRejectedValueOnce(new Error("AI offline"));

      const result = await OperationsAiService.getDecisionSupport([], null, "en");

      expect(result).toBeNull();
    });

    it("should handle Zod schema validation errors safely if thrown by generateObject", async () => {
      // generateObject throws when the LLM output violates the zod schema
      vi.mocked(generateObject).mockRejectedValueOnce(new Error("Schema validation failed"));

      const result = await OperationsAiService.getDecisionSupport([], null, "en");

      expect(result).toBeNull();
    });
  });

  describe("opsCopilotResponseSchema validation", () => {
    it("should reject confidence scores outside 0-100", () => {
      const invalidData = {
        overallStatus: "NORMAL",
        priorityLevel: "LOW",
        recommendedActions: [],
        reasoning: "ok",
        confidenceScore: 105, // invalid
        affectedZones: [],
      };

      const result = opsCopilotResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid enum values", () => {
      const invalidData = {
        overallStatus: "SUPER_BAD", // invalid enum
        priorityLevel: "LOW",
        recommendedActions: [],
        reasoning: "ok",
        confidenceScore: 50,
        affectedZones: [],
      };

      const result = opsCopilotResponseSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
