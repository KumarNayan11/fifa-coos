/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecentActivityFeed } from "../RecentActivityFeed";
import type { IncidentDataAnalytics } from "../IncidentAnalyticsPanel";

describe("RecentActivityFeed", () => {
  it("should render empty state when no activity", () => {
    render(<RecentActivityFeed incidents={[]} />);
    expect(screen.getByText("No recent activity")).toBeDefined();
  });

  it("should format and sort activities correctly", () => {
    // Note: the component sorts by updated_at descending (newest first)
    const mockIncidents = [
      {
        id: "1",
        title: "Old incident",
        status: "reported",
        severity: "low",
        created_at: new Date("2024-01-01T10:00:00Z"),
        updated_at: new Date("2024-01-01T10:00:00Z"), // Oldest
        zone: null,
        assignments: [],
      },
      {
        id: "2",
        title: "Just verified",
        status: "verified",
        severity: "high",
        created_at: new Date("2024-01-01T10:00:00Z"),
        updated_at: new Date("2024-01-01T12:00:00Z"), // Newest
        zone: null,
        assignments: [],
      },
      {
        id: "3",
        title: "Being assigned",
        status: "assigned",
        severity: "critical",
        created_at: new Date("2024-01-01T10:00:00Z"),
        updated_at: new Date("2024-01-01T11:00:00Z"), // Middle
        zone: null,
        assignments: [{ user: { full_name: "Jane Doe" } }],
      },
    ] as unknown as IncidentDataAnalytics[];

    const { container } = render(<RecentActivityFeed incidents={mockIncidents} />);

    // Check titles for mapped activities
    expect(screen.getByText("New Incident Reported")).toBeDefined();
    expect(screen.getByText("Incident Verified")).toBeDefined();
    expect(screen.getByText("Personnel Assigned")).toBeDefined();

    // Check assignment desc
    expect(screen.getByText("Being assigned assigned to Jane Doe")).toBeDefined();

    // Check ordering in DOM (Newest updated_at first: 2, 3, 1)
    const items = container.querySelectorAll("li");
    expect(items.length).toBe(3);

    // First item should be ID 2 (verified)
    expect(items[0].textContent).toContain("Just verified");
    // Second item should be ID 3 (assigned)
    expect(items[1].textContent).toContain("Being assigned");
    // Third item should be ID 1 (reported)
    expect(items[2].textContent).toContain("Old incident");
  });
});
