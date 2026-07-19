import { describe, it, expect, vi } from "vitest";
import { VolunteerAiService } from "../services/volunteer-ai.service";
import * as aiModule from "ai";
import { KnowledgeContext } from "@/features/knowledge/types";

vi.mock("ai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("ai")>();
  return {
    ...actual,
    generateObject: vi.fn(),
  };
});

describe("VolunteerAiService", () => {
  it("should return null gracefully if generateObject throws", async () => {
    vi.mocked(aiModule.generateObject).mockRejectedValueOnce(new Error("AI Failed"));

    const context: KnowledgeContext = { articles: [] };
    const result = await VolunteerAiService.getVolunteerAnswer("Test?", context, "en");

    expect(result).toBeNull();
  });

  it("should return parsed object if successful", async () => {
    vi.mocked(aiModule.generateObject).mockResolvedValueOnce({
      object: {
        answer: "Test Answer",
        referencedArticles: ["slug1"],
      },
    } as never);

    const context: KnowledgeContext = { articles: [] };
    const result = await VolunteerAiService.getVolunteerAnswer("Test?", context, "en");

    expect(result).toEqual({
      answer: "Test Answer",
      referencedArticles: ["slug1"],
    });
  });
});
