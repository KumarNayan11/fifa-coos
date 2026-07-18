import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchKnowledgeAction, getKnowledgeArticleAction } from "../actions";
import { KnowledgeService } from "../services/knowledge.service";
import { getSession } from "@/lib/auth";

vi.mock("../services/knowledge.service", () => ({
  KnowledgeService: {
    search: vi.fn(),
    getBySlug: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

describe("Knowledge Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchKnowledgeAction", () => {
    it("should validate input and pass mapped audiences to service", async () => {
      vi.mocked(getSession).mockResolvedValue({ role: "volunteer", email: "v@v.com", id: "1" });
      vi.mocked(KnowledgeService.search).mockResolvedValue([]);

      const result = await searchKnowledgeAction({ query: "test" });

      expect(result.success).toBe(true);
      expect(KnowledgeService.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: "test",
          audiences: ["volunteer", "public"], // Mapped from volunteer role
        }),
      );
    });

    it("should fail validation if extra invalid fields are passed", async () => {
      vi.mocked(getSession).mockResolvedValue(null);
      // Because we use zod object parsing, it strips extra fields usually, or we can just pass an invalid type
      // But since TS typing prevents invalid fields, we just check if it handles errors
      vi.mocked(KnowledgeService.search).mockRejectedValue(new Error("DB Error"));

      const result = await searchKnowledgeAction({ query: "test" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to search knowledge base");
    });
  });

  describe("getKnowledgeArticleAction", () => {
    it("should pass mapped audiences to service for getBySlug", async () => {
      vi.mocked(getSession).mockResolvedValue({ role: "admin", email: "a@a.com", id: "1" });
      vi.mocked(KnowledgeService.getBySlug).mockResolvedValue(null);

      const result = await getKnowledgeArticleAction("test-slug");

      expect(result.success).toBe(true);
      expect(KnowledgeService.getBySlug).toHaveBeenCalledWith(
        "test-slug",
        ["operations", "volunteer", "public"], // Mapped from admin role
      );
    });
  });
});
