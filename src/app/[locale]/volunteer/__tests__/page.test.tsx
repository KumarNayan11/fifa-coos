/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import VolunteerDashboardPage from "../page";
import { requireVolunteer } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  requireVolunteer: vi.fn(),
}));

vi.mock("@/components/ui/container", () => ({
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("VolunteerDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render successfully with valid session", async () => {
    // Mock the session returned by requireVolunteer
    vi.mocked(requireVolunteer).mockResolvedValueOnce({
      id: "1",
      email: "volunteer@example.com",
      role: "volunteer",
    });

    const pageContent = await VolunteerDashboardPage();
    render(pageContent);

    expect(screen.getByText("Welcome, volunteer@example.com")).toBeDefined();
    expect(screen.getByText("Quick Actions")).toBeDefined();
    expect(screen.getByText("Knowledge Search")).toBeDefined();
    expect(screen.getByText("Volunteer Copilot")).toBeDefined();
    expect(screen.getByText("Recent Updates")).toBeDefined();
  });

  it("should call requireVolunteer to enforce authorization", async () => {
    vi.mocked(requireVolunteer).mockResolvedValueOnce({
      id: "1",
      email: "volunteer@example.com",
      role: "volunteer",
    });

    await VolunteerDashboardPage();
    expect(requireVolunteer).toHaveBeenCalled();
  });
});
