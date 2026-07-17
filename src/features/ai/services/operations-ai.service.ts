import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { RecentIncidentDTO } from "@/features/dashboard/types";
import { TelemetryDashboardDto } from "@/features/telemetry/types";
import { opsCopilotResponseSchema, OpsCopilotResponse } from "../types/ops-ai.types";
import { composeOpsPrompt } from "./ops-prompt-composer";

const MODEL_ID = "gemini-2.5-flash";

export class OperationsAiService {
  /**
   * Generates AI decision support based on current incidents and telemetry.
   * Handles errors gracefully returning null so the dashboard does not crash.
   */
  public static async getDecisionSupport(
    incidents: RecentIncidentDTO[],
    telemetry: TelemetryDashboardDto | null,
  ): Promise<OpsCopilotResponse | null> {
    try {
      const systemPrompt = composeOpsPrompt(incidents, telemetry);

      const result = await generateObject({
        model: google(MODEL_ID),
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
