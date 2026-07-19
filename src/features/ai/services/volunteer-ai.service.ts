import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { KnowledgeContext } from "@/features/knowledge/types";
import {
  volunteerCopilotResponseSchema,
  VolunteerCopilotResponse,
} from "../types/volunteer-ai.types";
import { composeVolunteerPrompt } from "./volunteer-prompt-composer";
import { GEMINI_MODEL } from "@/lib/ai/config";
import type { Locale } from "@/i18n/routing";

export class VolunteerAiService {
  /**
   * Generates a volunteer copilot answer based on deterministic knowledge context.
   * Handles errors gracefully returning null on failure.
   */
  public static async getVolunteerAnswer(
    question: string,
    context: KnowledgeContext,
    locale: Locale,
  ): Promise<VolunteerCopilotResponse | null> {
    try {
      if (process.env.PLAYWRIGHT_TEST === "1") {
        return {
          answer: "Test answer based on policy.",
          referencedArticles: context.articles.map((a) => a.slug),
        } as VolunteerCopilotResponse;
      }

      const systemPrompt = composeVolunteerPrompt(context, locale);

      const result = await generateObject({
        model: google(GEMINI_MODEL),
        schema: volunteerCopilotResponseSchema,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      });

      return result.object;
    } catch (error) {
      console.error("[VolunteerAiService] Error generating volunteer answer:", error);
      return null;
    }
  }
}
