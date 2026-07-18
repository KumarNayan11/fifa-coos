import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireRole, requireVolunteer } from "../auth";
import { USER_ROLES } from "../../config/constants";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { prisma } from "../prisma";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("Redirected");
  }),
}));

vi.mock("../supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe("Auth Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requireRole", () => {
    it("should redirect to /ops/login if no session exists", async () => {
      vi.mocked(createClient).mockResolvedValue({
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error() }) },
      } as never);

      await expect(requireRole([USER_ROLES.OPS_MANAGER])).rejects.toThrow("Redirected");
      expect(redirect).toHaveBeenCalledWith("/ops/login");
    });

    it("should redirect to /unauthorized if role does not match", async () => {
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi
            .fn()
            .mockResolvedValue({
              data: { user: { id: "1", email: "test@test.com" } },
              error: null,
            }),
        },
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: USER_ROLES.FAN } as never);

      await expect(requireRole([USER_ROLES.OPS_MANAGER])).rejects.toThrow("Redirected");
      expect(redirect).toHaveBeenCalledWith("/unauthorized");
    });

    it("should return session if role matches", async () => {
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi
            .fn()
            .mockResolvedValue({
              data: { user: { id: "1", email: "test@test.com" } },
              error: null,
            }),
        },
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        role: USER_ROLES.OPS_MANAGER,
      } as never);

      const session = await requireRole([USER_ROLES.OPS_MANAGER]);
      expect(session).toEqual({ id: "1", email: "test@test.com", role: USER_ROLES.OPS_MANAGER });
    });
  });

  describe("requireVolunteer", () => {
    it("should allow volunteer role", async () => {
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi
            .fn()
            .mockResolvedValue({
              data: { user: { id: "1", email: "test@test.com" } },
              error: null,
            }),
        },
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: USER_ROLES.VOLUNTEER } as never);

      const session = await requireVolunteer();
      expect(session.role).toBe(USER_ROLES.VOLUNTEER);
    });
  });
});
