/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IncidentAnalyticsPanel } from "../IncidentAnalyticsPanel";

const mockIncidents = [
  {
    id: "1",
    title: "Low",
    status: "reported",
    severity: "low",
    created_at: new Date(),
    updated_at: new Date(),
    zone: { name: "North" },
    assignments: [],
  },
  {
    id: "2",
    title: "High",
    status: "verified",
    severity: "high",
    created_at: new Date(),
    updated_at: new Date(),
    zone: { name: "North" },
    assignments: [],
  },
  {
    id: "3",
    title: "Critical",
    status: "assigned",
    severity: "critical",
    created_at: new Date(),
    updated_at: new Date(),
    zone: { name: "South" },
    assignments: [],
  },
];

describe("IncidentAnalyticsPanel", () => {
  it("should render empty state correctly", () => {
    render(<IncidentAnalyticsPanel incidents={[]} />);
    expect(screen.getByText("No incidents found")).toBeDefined();
  });

  it("should calculate and render analytics correctly", () => {
    render(<IncidentAnalyticsPanel incidents={mockIncidents} />);

    // Check main title
    expect(screen.getByText("Incident Distribution")).toBeDefined();

    // Check categories
    expect(screen.getByText("By Severity")).toBeDefined();
    expect(screen.getByText("By Status")).toBeDefined();
    expect(screen.getByText("Top Zones")).toBeDefined();

    // Check data points
    expect(screen.getByText("Critical")).toBeDefined();
    expect(screen.getByText("North")).toBeDefined();

    // We expect 2 items in North zone (2 out of 3 total = 67%)
    const northCounts = screen.getAllByText("2 (67%)");
    expect(northCounts.length).toBeGreaterThan(0);
  });
});
