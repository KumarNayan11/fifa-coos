import { z } from "zod";
import { Audience } from "@prisma/client";

export const knowledgeSearchInputSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  audiences: z.array(z.nativeEnum(Audience)),
});

export type KnowledgeSearchInput = z.infer<typeof knowledgeSearchInputSchema>;

export type KnowledgeSearchResult = {
  id: string;
  title: string;
  slug: string;
  category: string;
  version: string;
  score?: number;
  content_markdown: string;
  updated_at: string;
};

export type KnowledgeContext = {
  articles: KnowledgeSearchResult[];
};
