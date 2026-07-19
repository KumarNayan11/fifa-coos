import { ZodError } from "zod";

/**
 * Sanitizes errors to prevent leaking sensitive information to the client.
 * - Extracts messages from Zod validation errors.
 * - Hides internal stack traces, DB queries, Prisma errors behind a generic message.
 * - Logs the actual error on the server side for debugging.
 */
export function sanitizeError(
  error: unknown,
  fallbackMessage = "An unexpected error occurred.",
): string {
  if (error instanceof ZodError) {
    // Return the first Zod error message or join them.
    return error.issues?.[0]?.message || "Validation failed";
  }

  // Log the original error for server-side debugging
  console.error("[Server Action Error]:", error);

  if (error instanceof Error) {
    // If we specifically threw a safe business logic error (like "Incident is already resolved"),
    // we might want to return it. For now, let's whitelist a few known safe error messages.
    const safeMessages = [
      "Cannot update a closed incident.",
      "Cannot assign a resolved or closed incident.",
      "Incident is already resolved or closed.",
      "Cannot resolve an unassigned incident.",
      "Only resolved incidents can be closed.",
    ];
    if (safeMessages.includes(error.message)) {
      return error.message;
    }
  }

  return fallbackMessage;
}
