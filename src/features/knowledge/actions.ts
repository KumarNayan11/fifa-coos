"use server";

import { getSession } from "@/lib/auth";
import { KnowledgeService } from "./services/knowledge.service";
import { KnowledgeSearchInput, knowledgeSearchInputSchema, KnowledgeSearchResult } from "./types";
import { Audience } from "@prisma/client";
import { sanitizeError } from "@/lib/errors";

const mapRoleToAudiences = (role?: string): Audience[] => {
  if (role === "admin" || role === "ops_manager" || role === "security") {
    return [Audience.operations, Audience.volunteer, Audience.public];
  }
  if (role === "volunteer") {
    return [Audience.volunteer, Audience.public];
  }
  return [Audience.public];
};

export async function searchKnowledgeAction(
  input: Omit<KnowledgeSearchInput, "audiences">,
): Promise<{ success: boolean; data?: KnowledgeSearchResult[]; error?: string }> {
  try {
    const session = await getSession();
    const audiences = mapRoleToAudiences(session?.role);

    const validatedInput = knowledgeSearchInputSchema.parse({
      ...input,
      audiences,
    });

    const results = await KnowledgeService.search(validatedInput);
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: sanitizeError(error, "Failed to search knowledge base") };
  }
}

export async function getKnowledgeArticleAction(
  slug: string,
): Promise<{ success: boolean; data?: KnowledgeSearchResult | null; error?: string }> {
  try {
    const session = await getSession();
    const audiences = mapRoleToAudiences(session?.role);

    const article = await KnowledgeService.getBySlug(slug, audiences);
    return { success: true, data: article };
  } catch (error) {
    return { success: false, error: sanitizeError(error, "Failed to retrieve knowledge article") };
  }
}
