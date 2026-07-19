"use server";

import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { USER_ROLES } from "@/config/constants";
import { KnowledgeService } from "@/features/knowledge/services/knowledge.service";
import { VolunteerAiService } from "./services/volunteer-ai.service";
import { VolunteerCopilotResponse } from "./types/volunteer-ai.types";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

const askVolunteerCopilotSchema = z.object({
  question: z.string().min(1, "Question cannot be empty").max(1000),
});

export type AskVolunteerCopilotState = {
  success: boolean;
  data?: VolunteerCopilotResponse;
  error?: string;
};

export async function askVolunteerCopilotAction(
  locale: Locale,
  prevState: AskVolunteerCopilotState,
  formData: FormData,
): Promise<AskVolunteerCopilotState> {
  const t = await getTranslations({ locale, namespace: "ai" });
  try {
    const session = await requireRole([
      USER_ROLES.VOLUNTEER,
      USER_ROLES.OPS_MANAGER,
      USER_ROLES.SECURITY,
    ]);

    // Authorization logic to map user roles to audiences
    const allowedAudiences: ("operations" | "volunteer" | "public")[] = ["public"];
    if (session.role === USER_ROLES.VOLUNTEER) {
      allowedAudiences.push("volunteer");
    } else if (session.role === USER_ROLES.OPS_MANAGER || session.role === USER_ROLES.SECURITY) {
      allowedAudiences.push("volunteer", "operations");
    }

    const question = formData.get("question") as string;
    const parsed = askVolunteerCopilotSchema.safeParse({ question });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error?.errors?.[0]?.message || t("validationFailed"),
      };
    }

    // 1. Deterministic Retrieval
    const searchResults = await KnowledgeService.search({
      query: parsed.data.question,
      audiences: allowedAudiences,
    });

    if (searchResults.length === 0) {
      // Fallback Case A: No matching policies found
      return {
        success: true,
        data: {
          answer: t("noPoliciesFound"),
          referencedArticles: [],
        },
      };
    }

    // 2. AI Reasoning
    const aiResponse = await VolunteerAiService.getVolunteerAnswer(
      parsed.data.question,
      { articles: searchResults },
      locale,
    );

    if (!aiResponse) {
      // Fallback Case B: AI unavailable or parsing failed
      return {
        success: true,
        data: {
          answer: t("aiUnavailable"),
          referencedArticles: searchResults.map((a) => a.slug),
        },
      };
    }

    return {
      success: true,
      data: aiResponse,
    };
  } catch (error) {
    console.error("[askVolunteerCopilotAction] Error:", error);
    return {
      success: false,
      error: t("unexpectedError"),
    };
  }
}
