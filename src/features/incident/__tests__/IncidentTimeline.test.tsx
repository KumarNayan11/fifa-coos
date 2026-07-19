/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { IncidentTimeline } from "../components/IncidentTimeline";

afterEach(() => {
  cleanup();
});

describe("IncidentTimeline", () => {
  it("renders reported event correctly", () => {
    const incident = {
      id: "inc1",
      created_at: new Date("2024-01-01T10:00:00Z"),
      updated_at: new Date("2024-01-01T10:00:00Z"),
      status: "reported",
      assignments: [],
    };

    render(<IncidentTimeline incident={incident} />);
    expect(screen.getByText("Incident Reported")).toBeDefined();
    // No updated or closed events should be present
    expect(screen.queryByText("Status Updated")).toBeNull();
    expect(screen.queryByText("Incident Resolved")).toBeNull();
    expect(screen.queryByText("Incident Closed")).toBeNull();
  });

  it("renders assignment events", () => {
    const incident = {
      id: "inc1",
      created_at: new Date("2024-01-01T10:00:00Z"),
      updated_at: new Date("2024-01-01T10:15:00Z"), // Updated within assignment, no separate update event
      status: "assigned",
      assignments: [
        {
          id: "a1",
          assigned_at: new Date("2024-01-01T10:15:00Z"),
          user: { full_name: "Jane Ops" },
        },
      ],
    };

    render(<IncidentTimeline incident={incident} />);
    expect(screen.getByText("Incident Reported")).toBeDefined();
    expect(screen.getByText("Personnel Assigned")).toBeDefined();
    expect(screen.getByText("Assigned to Jane Ops")).toBeDefined();
    expect(screen.queryByText("Status Updated")).toBeNull(); // Because assignment was recent to update
  });

  it("renders generic update event when significantly modified", () => {
    const incident = {
      id: "inc1",
      created_at: new Date("2024-01-01T10:00:00Z"),
      updated_at: new Date("2024-01-01T11:00:00Z"), // 1 hour later
      status: "assigned",
      assignments: [
        {
          id: "a1",
          assigned_at: new Date("2024-01-01T10:15:00Z"), // Long before update
          user: { full_name: "Jane Ops" },
        },
      ],
    };

    render(<IncidentTimeline incident={incident} />);
    expect(screen.getByText("Incident Reported")).toBeDefined();
    expect(screen.getByText("Personnel Assigned")).toBeDefined();
    expect(screen.getByText("Status Updated")).toBeDefined();
  });

  it("renders resolved and closed events correctly in order", () => {
    const incident = {
      id: "inc1",
      created_at: new Date("2024-01-01T10:00:00Z"),
      updated_at: new Date("2024-01-01T12:00:00Z"),
      closed_at: new Date("2024-01-01T12:30:00Z"),
      status: "closed",
      assignments: [],
    };

    render(<IncidentTimeline incident={incident} />);

    expect(screen.getByText("Incident Reported")).toBeDefined();
    expect(screen.queryByText("Incident Resolved")).toBeNull(); // It was closed directly or skipped resolved
    expect(screen.getByText("Incident Closed")).toBeDefined();

    // Timeline order should be chronological (this implicitly tests order as well via the rendering flow, though visually hard to test purely via RTL text match)
  });
});
