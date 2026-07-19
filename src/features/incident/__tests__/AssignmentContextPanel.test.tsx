/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AssignmentContextPanel } from "../components/AssignmentContextPanel";

afterEach(() => {
  cleanup();
});

describe("AssignmentContextPanel", () => {
  it("renders empty state gracefully", () => {
    render(<AssignmentContextPanel assignments={[]} />);
    expect(screen.getByText("No personnel assigned")).toBeDefined();
    expect(screen.getByText("This incident is currently awaiting assignment.")).toBeDefined();
  });

  it("renders multiple assignments correctly", () => {
    const assignments = [
      {
        id: "1",
        assigned_at: new Date("2024-01-01T10:00:00Z"),
        user: { id: "u1", full_name: "John Security", role: "security" },
      },
      {
        id: "2",
        assigned_at: new Date("2024-01-01T10:30:00Z"),
        user: { id: "u2", full_name: "Jane Ops", role: "ops_manager" },
      },
    ];

    render(<AssignmentContextPanel assignments={assignments} />);

    expect(screen.getByText("John Security")).toBeDefined();
    expect(screen.getByText("security")).toBeDefined();

    expect(screen.getByText("Jane Ops")).toBeDefined();
    expect(screen.getByText("ops manager")).toBeDefined(); // Testing role formatting
  });

  it("handles missing user full_name", () => {
    const assignments = [
      {
        id: "1",
        assigned_at: new Date("2024-01-01T10:00:00Z"),
        user: { id: "u1", full_name: null, role: "security" },
      },
    ];

    render(<AssignmentContextPanel assignments={assignments} />);
    expect(screen.getByText("Unknown User")).toBeDefined();
  });
});
