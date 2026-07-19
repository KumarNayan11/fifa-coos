import { describe, it, expect } from "vitest";
import { composeVolunteerPrompt } from "../services/volunteer-prompt-composer";
import { KnowledgeContext } from "@/features/knowledge/types";

describe("composeVolunteerPrompt", () => {
  it("should format articles into the prompt correctly", () => {
    const mockContext: KnowledgeContext = {
      articles: [
        {
          id: "1",
          slug: "test-slug",
          title: "Test Title",
          content_markdown: "Test content.",
          category: "Test",
          version: "1.0",
          updated_at: "now",
        },
      ],
    };

    const prompt = composeVolunteerPrompt(mockContext, "en");

    expect(prompt).toContain("Title: Test Title");
    expect(prompt).toContain("Slug: test-slug");
    expect(prompt).toContain("Test content.");
    expect(prompt).toContain("explicitly state that the information is unavailable");
    expect(prompt).toContain("Respond entirely in English.");
  });

  it("should format articles into the prompt correctly for hindi", () => {
    const mockContext: KnowledgeContext = {
      articles: [],
    };

    const prompt = composeVolunteerPrompt(mockContext, "hi");
    expect(prompt).toContain("पूरा उत्तर हिन्दी में दें।");
  });

  it("should handle empty articles gracefully", () => {
    const mockContext: KnowledgeContext = {
      articles: [],
    };

    const prompt = composeVolunteerPrompt(mockContext, "en");
    expect(prompt).toContain("No policies available.");
  });
});
