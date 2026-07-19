import type { Locale } from "@/i18n/routing";

/**
 * Returns the centralized prompt instruction to enforce the output language
 * based on the user's active locale.
 *
 * @param locale The active locale.
 * @returns A string instructing the AI which language to use.
 */
export function getLanguageInstruction(locale: Locale): string {
  switch (locale) {
    case "hi":
      return "पूरा उत्तर हिन्दी में दें।";
    case "en":
    default:
      return "Respond entirely in English.";
  }
}
