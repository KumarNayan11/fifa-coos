/**
 * FIFACoOS — AI Service (Fan Copilot)
 *
 * Core AI processing pipeline using Vercel AI SDK + Google Gemini 2.5 Flash.
 * Implements the Unified Intelligence Engine (UIE) pattern:
 *   1. Gather deterministic context (Knowledge Retrieval)
 *   2. Compose modular system prompt (Prompt Composer)
 *   3. Invoke LLM via streamObject (LLM Gateway)
 *   4. Automatic Zod validation (Response Validator)
 *
 * @see AI_ARCHITECTURE.md §7 — AI Component Architecture
 * @see AI_ARCHITECTURE.md §11 — Prompt Engineering Strategy
 * @see TECHNOLOGY_DECISIONS.md §5.6 — Vercel AI SDK + Gemini
 */

import { streamObject } from "ai";
import { google } from "@ai-sdk/google";

import { fanCopilotResponseSchema } from "../types/ai.schemas";
import { searchKnowledge } from "./search.service";
import { STADIUM } from "../data/stadium";
import type { POI, KnowledgeArticle } from "../types/fan.types";

// ---------------------------------------------------------------------------
// Model Configuration
// ---------------------------------------------------------------------------

const MODEL_ID = "gemini-2.5-flash-preview-05-20";

// ---------------------------------------------------------------------------
// System Prompt Composer (AI_ARCHITECTURE.md §11)
// ---------------------------------------------------------------------------

/**
 * Compose the modular system prompt for the Fan Copilot.
 * Each section is a discrete module per the architecture.
 */
function composeSystemPrompt(matchingFAQs: KnowledgeArticle[], matchingPOIs: POI[]): string {
  const sections: string[] = [];

  // Module 1: System Identity
  sections.push(`## System Identity
You are FIFACoOS Fan Copilot, an AI-powered stadium assistant for the ${STADIUM.eventName} at ${STADIUM.name} in ${STADIUM.city}.
Your job is to help fans navigate the stadium, find facilities, check wait times, and answer frequently asked questions.`);

  // Module 2: Role Context (Fan = helpful, concise, safety-first)
  sections.push(`## Role Context
You are assisting an ANONYMOUS FAN. You must be:
- Helpful and friendly
- Concise and direct — fans are on their feet and in a hurry
- Safety-first — always prioritize safety information
- Stadium-specific — only provide information about THIS stadium
You do NOT have access to operational, security, or staff-only data.`);

  // Module 3: Response Style
  sections.push(`## Response Style
- Keep responses concise (2-4 sentences for simple queries, up to 6 for complex ones)
- Be stadium-specific — reference actual POI names and zones
- Be multilingual ready — if the user writes in another language, respond in that language
- Never invent data that is not in the provided context (e.g., do not make up wait times)
- Never expose operational information (incidents, staff deployment, security protocols)
- Use plain text only — no markdown formatting, no bullet lists, no headers
- If you are unsure, say so honestly and suggest the fan visit an Information Desk`);

  // Module 4: Stadium Context
  sections.push(`## Stadium Information
- Name: ${STADIUM.name}
- Location: ${STADIUM.city}, ${STADIUM.country}
- Capacity: ${STADIUM.capacity.toLocaleString()} spectators
- Gates Open: ${STADIUM.openingTime}
- Match Kickoff: ${STADIUM.matchKickoff}
- Emergency: ${STADIUM.emergencyNumber}
- Info Hotline: ${STADIUM.infoHotline}`);

  // Module 5: Knowledge Context (injected FAQs)
  if (matchingFAQs.length > 0) {
    const faqText = matchingFAQs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n");
    sections.push(`## Relevant FAQs\n${faqText}`);
  }

  // Module 6: POI Context (injected POIs)
  if (matchingPOIs.length > 0) {
    const poiText = matchingPOIs
      .map(
        (poi) =>
          `- ${poi.name} (ID: ${poi.id}, Type: ${poi.type}, Zone: ${poi.zoneId}, Accessible: ${poi.isAccessible}): ${poi.description}`,
      )
      .join("\n");
    sections.push(`## Relevant Points of Interest\n${poiText}`);
  }

  // Module 7: Safety Constraints
  sections.push(`## Safety Constraints
- NEVER recommend evacuation procedures — direct fans to staff
- NEVER provide security-related operational data
- NEVER fabricate POI names, gate numbers, or wait times not in the provided data
- If asked about emergencies, always include the emergency number: ${STADIUM.emergencyNumber}
- If unsure about any factual claim, set your confidence below 50`);

  // Module 8: Output Schema Instructions
  sections.push(`## Output Requirements
You must respond with a structured JSON object matching the provided schema.
- Set "intent" to the primary intent of the query
- Set "response" to your natural language answer (plain text, no markdown)
- Set "suggestedPOIs" to an array of POI IDs from the provided data (or empty array)
- Set "confidence" to your self-assessed confidence (0-100). Set below 50 if unsure.`);

  return sections.join("\n\n");
}

// ---------------------------------------------------------------------------
// AI Processing (UIE Core Function)
// ---------------------------------------------------------------------------

/** Messages format for the AI conversation */
export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Process a fan query through the AI pipeline.
 *
 * This is the core UIE function: Decision = F(Query, Context)
 *
 * Pipeline steps:
 * 1. searchKnowledge() — deterministic context gathering
 * 2. composeSystemPrompt() — modular prompt assembly
 * 3. streamObject() — LLM invocation with automatic Zod validation
 *
 * @param messages - Conversation history
 * @returns A streamable object result with Zod-validated schema
 */
export function processFanQuery(messages: AIMessage[]) {
  // Extract the latest user message for knowledge search
  const latestMessage = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";

  // Step 1: Deterministic knowledge retrieval
  const { faqs, pois } = searchKnowledge(latestMessage);

  // Step 2: Compose the modular system prompt
  const systemPrompt = composeSystemPrompt(faqs, pois);

  // Step 3: Invoke LLM with streamObject + Zod schema validation
  return streamObject({
    model: google(MODEL_ID),
    schema: fanCopilotResponseSchema,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });
}
