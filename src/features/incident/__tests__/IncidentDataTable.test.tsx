/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { IncidentDataTable } from "../components/IncidentDataTable";

afterEach(() => {
  cleanup();
});

// Mock the next/link component
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

const mockIncidents = [
  {
    id: "inc-1",
    title: "Fire in Sector A",
    status: "reported",
    severity: "critical",
    created_at: new Date("2024-01-01T10:00:00Z"),
    updated_at: new Date("2024-01-01T10:00:00Z"),
    zone: { name: "Sector A" },
    assignments: [],
  },
  {
    id: "inc-2",
    title: "Spilled drink",
    status: "resolved",
    severity: "low",
    created_at: new Date("2024-01-01T11:00:00Z"),
    updated_at: new Date("2024-01-01T11:30:00Z"),
    zone: { name: "Sector B" },
    assignments: [{ user: { full_name: "John Doe" } }],
  },
  {
    id: "inc-3",
    title: "Broken seat",
    status: "assigned",
    severity: "medium",
    created_at: new Date("2024-01-01T09:00:00Z"),
    updated_at: new Date("2024-01-01T09:15:00Z"),
    zone: { name: "Sector A" },
    assignments: [{ user: { full_name: "Jane Smith" } }],
  },
];

describe("IncidentDataTable", () => {
  it("should render all incidents initially", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    expect(screen.getByText("Fire in Sector A")).toBeDefined();
    expect(screen.getByText("Spilled drink")).toBeDefined();
    expect(screen.getByText("Broken seat")).toBeDefined();
  });

  it("should filter incidents by search query", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    const searchInput = screen.getByPlaceholderText("Search by ID, title, or zone...");
    fireEvent.change(searchInput, { target: { value: "Fire" } });

    expect(screen.getByText("Fire in Sector A")).toBeDefined();
    expect(screen.queryByText("Spilled drink")).toBeNull();
    expect(screen.queryByText("Broken seat")).toBeNull();
  });

  it("should filter incidents by status", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    const statusSelect = screen.getByLabelText("Filter by Status");
    fireEvent.change(statusSelect, { target: { value: "resolved" } });

    expect(screen.queryByText("Fire in Sector A")).toBeNull();
    expect(screen.getByText("Spilled drink")).toBeDefined();
    expect(screen.queryByText("Broken seat")).toBeNull();
  });

  it("should filter incidents by severity", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    const severitySelect = screen.getByLabelText("Filter by Severity");
    fireEvent.change(severitySelect, { target: { value: "medium" } });

    expect(screen.queryByText("Fire in Sector A")).toBeNull();
    expect(screen.queryByText("Spilled drink")).toBeNull();
    expect(screen.getByText("Broken seat")).toBeDefined();
  });

  it("should filter incidents by dynamically populated zone", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    const zoneSelect = screen.getByLabelText("Filter by Zone");
    // Verify options are dynamically populated (All Zones, Sector A, Sector B)
    const options = Array.from(zoneSelect.getElementsByTagName("option"));
    expect(options.length).toBe(3);

    fireEvent.change(zoneSelect, { target: { value: "Sector B" } });

    expect(screen.queryByText("Fire in Sector A")).toBeNull();
    expect(screen.getByText("Spilled drink")).toBeDefined();
    expect(screen.queryByText("Broken seat")).toBeNull();
  });

  it("should show empty state when filters eliminate all rows", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    const searchInput = screen.getByPlaceholderText("Search by ID, title, or zone...");
    fireEvent.change(searchInput, { target: { value: "Nonexistent" } });

    expect(screen.queryByText("Fire in Sector A")).toBeNull();
    expect(screen.getByText("No incidents match your filters")).toBeDefined();

    // Clear filters button should work
    const clearButton = screen.getByText("Clear all filters");
    fireEvent.click(clearButton);

    expect(screen.getByText("Fire in Sector A")).toBeDefined();
  });

  it("should sort incidents by newest first (default)", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    const rows = screen.getAllByRole("row");
    // Skip header row
    expect(rows[1].textContent).toContain("Spilled drink"); // 11:00
    expect(rows[2].textContent).toContain("Fire in Sector A"); // 10:00
    expect(rows[3].textContent).toContain("Broken seat"); // 09:00
  });

  it("should sort incidents by highest severity", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    const sortSelect = screen.getByLabelText("Sort Incidents");
    fireEvent.change(sortSelect, { target: { value: "highest_severity" } });

    const rows = screen.getAllByRole("row");
    expect(rows[1].textContent).toContain("Fire in Sector A"); // Critical
    expect(rows[2].textContent).toContain("Broken seat"); // Medium
    expect(rows[3].textContent).toContain("Spilled drink"); // Low
  });

  it("should support copying the ID", () => {
    render(<IncidentDataTable incidents={mockIncidents} />);

    const copyButtons = screen.getAllByTitle("Copy Full ID");
    fireEvent.click(copyButtons[0]);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
