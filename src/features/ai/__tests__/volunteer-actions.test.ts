import { describe, it, expect, vi, beforeEach } from "vitest";
import { askVolunteerCopilotAction } from "../actions";
import { KnowledgeService } from "@/features/knowledge/services/knowledge.service";
import { VolunteerAiService } from "../services/volunteer-ai.service";
import { requireRole } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  requireRole: vi.fn(),
}));

vi.mock("@/features/knowledge/services/knowledge.service", () => ({
  KnowledgeService: {
    search: vi.fn(),
  },
}));

vi.mock("../services/volunteer-ai.service", () => ({
  VolunteerAiService: {
    getVolunteerAnswer: vi.fn(),
  },
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

describe("askVolunteerCopilotAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail validation if question is missing", async () => {
    vi.mocked(requireRole).mockResolvedValue({ id: "1", role: "volunteer" } as never);
    const formData = new FormData();
    const result = await askVolunteerCopilotAction("en", { success: false }, formData);
    expect(result.success).toBe(false);
    expect(result.error).toContain("validationFailed");
  });

  it("should return fallback Case A if no knowledge is found", async () => {
    vi.mocked(requireRole).mockResolvedValue({ id: "1", role: "volunteer" } as never);
    vi.mocked(KnowledgeService.search).mockResolvedValue([]);

    const formData = new FormData();
    formData.append("question", "What is the meaning of life?");

    const result = await askVolunteerCopilotAction("en", { success: false }, formData);

    expect(KnowledgeService.search).toHaveBeenCalledWith({
      query: "What is the meaning of life?",
      audiences: ["public", "volunteer"],
    });

    expect(result.success).toBe(true);
    expect(result.data?.answer).toContain("noPoliciesFound");
    expect(VolunteerAiService.getVolunteerAnswer).not.toHaveBeenCalled();
  });

  it("should return fallback Case B if AI fails", async () => {
    vi.mocked(requireRole).mockResolvedValue({ id: "1", role: "volunteer" } as never);
    vi.mocked(KnowledgeService.search).mockResolvedValue([
      {
        id: "1",
        slug: "test-policy",
        title: "Test",
        category: "Test",
        content_markdown: "Test content",
        version: "1.0",
        updated_at: "now",
      },
    ]);
    vi.mocked(VolunteerAiService.getVolunteerAnswer).mockResolvedValue(null);

    const formData = new FormData();
    formData.append("question", "What is the test policy?");

    const result = await askVolunteerCopilotAction("en", { success: false }, formData);

    expect(VolunteerAiService.getVolunteerAnswer).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.data?.answer).toContain("aiUnavailable");
  });

  it("should return AI response on success", async () => {
    vi.mocked(requireRole).mockResolvedValue({ id: "1", role: "volunteer" } as never);
    vi.mocked(KnowledgeService.search).mockResolvedValue([
      {
        id: "1",
        slug: "test-policy",
        title: "Test",
        category: "Test",
        content_markdown: "Test content",
        version: "1.0",
        updated_at: "now",
      },
    ]);
    vi.mocked(VolunteerAiService.getVolunteerAnswer).mockResolvedValue({
      answer: "This is a great policy.",
      referencedArticles: ["test-policy"],
    });

    const formData = new FormData();
    formData.append("question", "What is the test policy?");

    const result = await askVolunteerCopilotAction("en", { success: false }, formData);

    expect(result.success).toBe(true);
    expect(result.data?.answer).toBe("This is a great policy.");
    expect(result.data?.referencedArticles).toEqual(["test-policy"]);
  });
});
