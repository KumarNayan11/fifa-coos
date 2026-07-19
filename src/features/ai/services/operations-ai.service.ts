import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { RecentIncidentDTO } from "@/features/dashboard/types";
import { TelemetryDashboardDto } from "@/features/telemetry/types";
import { opsCopilotResponseSchema, OpsCopilotResponse } from "../types/ops-ai.types";
import { composeOpsPrompt } from "./ops-prompt-composer";
import { GEMINI_MODEL } from "@/lib/ai/config";
import type { Locale } from "@/i18n/routing";
import { detectPromptInjection, removePII } from "@/lib/ai/security";
export class OperationsAiService {
  /**
   * Generates AI decision support based on current incidents and telemetry.
   * Handles errors gracefully returning null so the dashboard does not crash.
   */
  public static async getDecisionSupport(
    incidents: RecentIncidentDTO[],
    telemetry: TelemetryDashboardDto | null,
    locale: Locale,
  ): Promise<OpsCopilotResponse | null> {
    try {
      if (process.env.PLAYWRIGHT_TEST === "1") {
        return {
          overallStatus: "CRITICAL",
          priorityLevel: "HIGH",
          recommendedActions: ["Dispatch medical team to Gate 2", "Notify airport security"],
          reasoning: "Test reasoning",
          confidenceScore: 90,
          affectedZones: ["Zone A"],
        } as OpsCopilotResponse;
      }

      // Guardrail: Check incident titles for prompt injection
      const isInjection = incidents.some((inc) => detectPromptInjection(inc.title));
      if (isInjection) {
        return null; // Forces fallback in dashboard
      }

      // Guardrail: Remove PII from incident titles
      const sanitizedIncidents = incidents.map((inc) => ({
        ...inc,
        title: removePII(inc.title),
      }));

      const systemPrompt = composeOpsPrompt(sanitizedIncidents, telemetry, locale);

      const result = await generateObject({
        model: google(GEMINI_MODEL),
        schema: opsCopilotResponseSchema,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content:
              "Please provide an operational assessment and recommendations based on the current context.",
          },
        ],
      });

      return result.object;
    } catch (error) {
      console.error("[OperationsAiService] Error generating decision support:", error);
      return null;
    }
  }
}
