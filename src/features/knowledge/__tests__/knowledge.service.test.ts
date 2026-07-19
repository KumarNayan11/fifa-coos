import { describe, it, expect, vi, beforeEach } from "vitest";
import { KnowledgeService } from "../services/knowledge.service";
import { prisma } from "@/lib/prisma";
import { Audience, KnowledgeArticle } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    knowledgeArticle: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("KnowledgeService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockArticles = [
    {
      id: "1",
      title: "Lost Child Procedure",
      slug: "lost-child-procedure",
      category: "Safety",
      audience: ["volunteer", "operations", "public"],
      keywords: ["lost child", "missing", "parent"],
      content_markdown: "Procedure for a lost child...",
      version: "1.0",
      is_published: true,
      created_at: new Date("2023-01-01T00:00:00Z"),
      updated_at: new Date("2023-01-02T00:00:00Z"),
    },
    {
      id: "2",
      title: "Medical Emergency SOP",
      slug: "medical-emergency-sop",
      category: "Emergency",
      audience: ["volunteer", "operations"],
      keywords: ["medical", "emergency", "injury"],
      content_markdown: "If a fan requires medical assistance, and they have a lost child...",
      version: "1.0",
      is_published: true,
      created_at: new Date("2023-01-01T00:00:00Z"),
      updated_at: new Date("2023-01-03T00:00:00Z"),
    },
  ];

  describe("search", () => {
    it("should return top results sorted by updated_at when query is empty", async () => {
      vi.mocked(prisma.knowledgeArticle.findMany).mockResolvedValue(
        mockArticles as unknown as KnowledgeArticle[],
      );

      const results = await KnowledgeService.search({
        query: "",
        audiences: [Audience.volunteer],
      });

      expect(results.length).toBe(2);
      expect(results[0].title).toBe("Medical Emergency SOP"); // updated later
      expect(results[0].score).toBe(0);
    });

    it("should score and sort results deterministically for a query", async () => {
      vi.mocked(prisma.knowledgeArticle.findMany).mockResolvedValue(
        mockArticles as unknown as KnowledgeArticle[],
      );

      const results = await KnowledgeService.search({
        query: "Lost Child",
        audiences: [Audience.volunteer],
      });

      expect(results.length).toBe(2);
      expect(results[0].title).toBe("Lost Child Procedure");
      expect(results[0].score).toBeGreaterThan(results[1].score!);
    });
  });

  describe("getBySlug", () => {
    it("should return null if article not found", async () => {
      vi.mocked(prisma.knowledgeArticle.findUnique).mockResolvedValue(null);
      const result = await KnowledgeService.getBySlug("non-existent", ["public"]);
      expect(result).toBeNull();
    });

    it("should enforce audience filtering", async () => {
      vi.mocked(prisma.knowledgeArticle.findUnique).mockResolvedValue({
        id: "unique-id-99",
        title: "Medical Emergency SOP",
        slug: "medical-emergency-sop",
        category: "Emergency",
        audience: ["volunteer", "operations"],
        keywords: [],
        content_markdown: "content",
        version: "1.0",
        is_published: true,
        created_at: new Date(),
        updated_at: new Date(),
      } as unknown as KnowledgeArticle);

      const result = await KnowledgeService.getBySlug("medical-emergency-sop", ["public"]);
      expect(result).toBeNull();

      const validResult = await KnowledgeService.getBySlug("medical-emergency-sop", ["volunteer"]);
      expect(validResult).toBeDefined();
      expect(validResult?.title).toBe("Medical Emergency SOP");
    });
  });
});
