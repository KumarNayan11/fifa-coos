/**
 * FIFACoOS - AI Security Guardrails
 * Provides heuristic and deterministic functions to protect AI components from malicious inputs
 * and data leakage.
 */

/**
 * Deterministically removes obvious PII from text.
 * Targets specific patterns: emails, credit cards, standard phone formats.
 * Does NOT attempt to heuristically guess names or free-form PII.
 */
export function removePII(text: string): string {
  let sanitized = text;

  // Remove email addresses
  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[EMAIL REDACTED]",
  );

  // Remove credit/debit card numbers (Visa, Mastercard, Amex, Discover - generic 13-19 digits)
  // Matching 4 digits, optional space/dash, 4 digits, etc.
  sanitized = sanitized.replace(/(?:\d[ -]*?){13,19}/g, (match) => {
    // Only redact if it contains mostly digits and looks like a card or long number
    const digitCount = match.replace(/[^0-9]/g, "").length;
    if (digitCount >= 13 && digitCount <= 19) {
      return "[NUMBER REDACTED]";
    }
    return match;
  });

  // Simple heuristic for phone numbers (e.g. +1-555-555-5555, 555-555-5555)
  // This is a naive regex and focuses on standard formatted strings to avoid redacting incident IDs
  sanitized = sanitized.replace(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    "[PHONE REDACTED]",
  );

  return sanitized;
}

/**
 * Lightweight heuristic guard to detect common prompt injection patterns.
 * Returns true if an injection attempt is suspected.
 */
export function detectPromptInjection(text: string): boolean {
  if (!text || typeof text !== "string") return false;

  const lowerText = text.toLowerCase();

  const injectionPatterns = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "disregard previous",
    "system prompt",
    "what is your initial prompt",
    "reveal your instructions",
    "forget everything",
    "you are now a",
    "simulate a scenario where",
    "hypothetically, if you were",
    "bypass safety",
    "override restrictions",
  ];

  return injectionPatterns.some((pattern) => lowerText.includes(pattern));
}
