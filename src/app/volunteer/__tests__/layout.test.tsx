/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import VolunteerLayout from "../layout";

// Mock dependencies
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  destroySession: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("VolunteerLayout", () => {
  it("should render the layout shell with navigation and children", () => {
    render(
      <VolunteerLayout>
        <div data-testid="volunteer-child">Child Content</div>
      </VolunteerLayout>,
    );

    // Header
    expect(screen.getByText("Volunteer")).toBeDefined();
    expect(screen.getByText("Assistant")).toBeDefined();
    expect(screen.getByRole("button", { name: "Logout" })).toBeDefined();

    // Navigation
    expect(screen.getByText("Dashboard")).toBeDefined();
    expect(screen.getByText("Knowledge Search")).toBeDefined();
    expect(screen.getByText("Volunteer Copilot")).toBeDefined();
    expect(screen.getByText("Back to Home")).toBeDefined();

    // Children
    expect(screen.getByTestId("volunteer-child")).toBeDefined();
    expect(screen.getByText("Child Content")).toBeDefined();
  });
});
