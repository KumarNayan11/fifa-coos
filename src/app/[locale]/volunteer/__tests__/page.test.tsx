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

vi.mock("@/features/knowledge/components/knowledge-search-panel", () => ({
  KnowledgeSearchPanel: () => <div>Knowledge Search</div>,
}));

vi.mock("@/features/ai/components/volunteer-workspace", () => ({
  VolunteerCopilotWorkspace: () => <div>Volunteer Copilot Workspace</div>,
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

    expect(screen.getByText("Knowledge Search")).toBeDefined();
    expect(screen.getByText("Volunteer Copilot Workspace")).toBeDefined();
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
