import { prisma } from "@/lib/prisma";
import { KnowledgeSearchInput, KnowledgeSearchResult } from "../types";

const normalize = (str: string) => {
  return str.toLowerCase().trim().replace(/\s+/g, " ");
};

export class KnowledgeService {
  static async search(input: KnowledgeSearchInput): Promise<KnowledgeSearchResult[]> {
    const { query, category, audiences } = input;

    // Base Prisma query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      is_published: true,
      audience: {
        hasSome: audiences,
      },
    };

    if (category) {
      where.category = category;
    }

    const rawArticles = await prisma.knowledgeArticle.findMany({
      where,
    });

    if (!query || query.trim() === "") {
      // If no query, return top 20 sorted by updated_at
      return rawArticles
        .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
        .slice(0, 20)
        .map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          category: a.category,
          version: a.version,
          score: 0,
          content_markdown: a.content_markdown,
          updated_at: a.updated_at.toISOString(),
        }));
    }

    const normQuery = normalize(query);

    const scoredArticles = rawArticles
      .map((article) => {
        let score = 0;
        const normSlug = normalize(article.slug);
        const normTitle = normalize(article.title);
        const normContent = normalize(article.content_markdown);
        const normKeywords = article.keywords.map(normalize);

        if (normSlug === normQuery) score += 100;
        if (normKeywords.includes(normQuery)) score += 60;
        if (normTitle.includes(normQuery)) score += 40;
        if (normKeywords.some((k) => k.includes(normQuery))) score += 25;
        if (normContent.includes(normQuery)) score += 10;

        return {
          article,
          score,
        };
      })
      .filter((sa) => sa.score > 0);

    // Sort by score DESC, title ASC, updated_at DESC
    scoredArticles.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const titleCompare = a.article.title.localeCompare(b.article.title);
      if (titleCompare !== 0) return titleCompare;
      return b.article.updated_at.getTime() - a.article.updated_at.getTime();
    });

    return scoredArticles.slice(0, 20).map((sa) => ({
      id: sa.article.id,
      title: sa.article.title,
      slug: sa.article.slug,
      category: sa.article.category,
      version: sa.article.version,
      score: sa.score,
      content_markdown: sa.article.content_markdown,
      updated_at: sa.article.updated_at.toISOString(),
    }));
  }

  static async getBySlug(
    slug: string,
    allowedAudiences: string[],
  ): Promise<KnowledgeSearchResult | null> {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { slug },
    });

    if (!article) return null;
    if (!article.is_published) return null;

    // Enforce audience
    const hasOverlap = article.audience.some((a) => allowedAudiences.includes(a));
    if (!hasOverlap) return null;

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.category,
      version: article.version,
      content_markdown: article.content_markdown,
      updated_at: article.updated_at.toISOString(),
    };
  }
}
