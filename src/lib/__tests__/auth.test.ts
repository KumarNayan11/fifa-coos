import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyCredentials, createSession, verifySession } from "../auth";
import { SignJWT } from "jose";
import { USER_ROLES } from "../../config/constants";

// Mock env for testing
vi.mock("../../config/env", () => ({
  env: {
    OPS_USERNAME: "test_admin",
    OPS_PASSWORD: "test_password",
    SESSION_SECRET: "test_super_secret_key_1234567890",
  },
}));

describe("Auth Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("verifyCredentials", () => {
    it("should return true for valid credentials", () => {
      expect(verifyCredentials("test_admin", "test_password")).toBe(true);
    });

    it("should return false for invalid password", () => {
      expect(verifyCredentials("test_admin", "wrong")).toBe(false);
    });

    it("should return false for invalid username", () => {
      expect(verifyCredentials("wrong", "test_password")).toBe(false);
    });

    it("should return false for missing credentials", () => {
      expect(verifyCredentials(undefined, undefined)).toBe(false);
    });
  });

  describe("JWT Session Management", () => {
    it("should create and successfully verify a valid JWT session", async () => {
      const token = await createSession(USER_ROLES.OPS);
      expect(typeof token).toBe("string");

      const session = await verifySession(token);
      expect(session).not.toBeNull();
      expect(session?.role).toBe(USER_ROLES.OPS);
    });

    it("should reject a tampered JWT", async () => {
      const token = await createSession(USER_ROLES.OPS);

      // Tamper with the token (changing the signature part)
      const tamperedToken = token.slice(0, -5) + "abcde";

      const session = await verifySession(tamperedToken);
      expect(session).toBeNull();
    });

    it("should reject an expired JWT", async () => {
      // Create a token that is already expired
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      const secretKey = new TextEncoder().encode("test_super_secret_key_1234567890");

      const expiredToken = await new SignJWT({
        role: USER_ROLES.OPS,
        expires: pastDate.toISOString(),
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt(Math.floor(pastDate.getTime() / 1000))
        .setExpirationTime(Math.floor(pastDate.getTime() / 1000))
        .sign(secretKey);

      const session = await verifySession(expiredToken);
      expect(session).toBeNull();
    });
  });
});
