"use server";

import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { USER_ROLES } from "@/config/constants";
import { KnowledgeService } from "@/features/knowledge/services/knowledge.service";
import { VolunteerAiService } from "./services/volunteer-ai.service";
import { VolunteerCopilotResponse } from "./types/volunteer-ai.types";

const askVolunteerCopilotSchema = z.object({
  question: z.string().min(1, "Question cannot be empty").max(1000),
});

export type AskVolunteerCopilotState = {
  success: boolean;
  data?: VolunteerCopilotResponse;
  error?: string;
};

export async function askVolunteerCopilotAction(
  prevState: AskVolunteerCopilotState,
  formData: FormData,
): Promise<AskVolunteerCopilotState> {
  try {
    const session = await requireRole([
      USER_ROLES.VOLUNTEER,
      USER_ROLES.OPS_MANAGER,
      USER_ROLES.SECURITY,
    ]);

    // Authorization logic to map user roles to audiences
    const allowedAudiences: ("operations" | "volunteer" | "public" | "security")[] = ["public"];
    if (session.role === USER_ROLES.VOLUNTEER) {
      allowedAudiences.push("volunteer");
    } else if (session.role === USER_ROLES.OPS_MANAGER || session.role === USER_ROLES.SECURITY) {
      allowedAudiences.push("volunteer", "operations", "security");
    }

    const question = formData.get("question") as string;
    const parsed = askVolunteerCopilotSchema.safeParse({ question });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error?.errors?.[0]?.message || "Validation failed",
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
          answer:
            "I couldn't find a volunteer policy that matches your question. Please try rephrasing your question. If you need immediate operational guidance, contact the Operations Center or your supervisor.",
          referencedArticles: [],
        },
      };
    }

    // 2. AI Reasoning
    const aiResponse = await VolunteerAiService.getVolunteerAnswer(parsed.data.question, {
      articles: searchResults,
    });

    if (!aiResponse) {
      // Fallback Case B: AI unavailable or parsing failed
      return {
        success: true,
        data: {
          answer:
            "I found relevant volunteer policies, but I'm currently unable to summarize them. Please review the referenced policy articles or contact the Operations Center if you need clarification.",
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
      error: "An unexpected error occurred while processing your request.",
    };
  }
}
