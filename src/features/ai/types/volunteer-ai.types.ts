import { z } from "zod";

export const volunteerCopilotResponseSchema = z.object({
  answer: z
    .string()
    .describe(
      "The direct, clear, and concise answer to the volunteer's question based strictly on the provided policies.",
    ),
  referencedArticles: z
    .array(z.string())
    .describe("An array of article slugs that were used to formulate this answer."),
});

export type VolunteerCopilotResponse = z.infer<typeof volunteerCopilotResponseSchema>;
