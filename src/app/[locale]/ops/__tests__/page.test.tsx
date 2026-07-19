/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import OpsDashboardPage from "../page";
import { requireOps } from "@/lib/auth";
import { DashboardService } from "@/features/dashboard/services/dashboard.service";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  requireOps: vi.fn(),
}));

vi.mock("@/features/dashboard/services/dashboard.service", () => ({
  DashboardService: {
    getDashboardMetrics: vi.fn(),
    getRecentIncidents: vi.fn(),
  },
}));

vi.mock("@/features/telemetry/services/telemetry.service", () => ({
  TelemetryService: {
    getDashboardTelemetry: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/components/ui/page-header", () => ({
  PageHeader: () => <div>Operations Dashboard</div>,
}));

vi.mock("@/components/ui/container", () => ({
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/features/dashboard/components/MetricCard", () => ({
  MetricCard: ({ title, value }: any) => (
    <div>
      {title}: {value}
    </div>
  ),
}));

vi.mock("@/features/dashboard/components/IncidentOverviewPanel", () => ({
  IncidentOverviewPanel: ({ incidents }: any) => (
    <div>{incidents.length === 0 ? "No Operations Data" : incidents[0].title}</div>
  ),
}));

describe("OpsDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render successfully with populated database", async () => {
    vi.mocked(requireOps).mockResolvedValueOnce({ role: "ops_manager", expires: "" } as any);

    vi.mocked(DashboardService.getDashboardMetrics).mockResolvedValueOnce({
      totalIncidents: 10,
      openIncidents: 5,
      resolvedIncidents: 5,
      incidentsCreatedToday: 2,
      unresolvedCriticalIncidents: 1,
      incidentsBySeverity: [
        { severity: "low", count: 2 },
        { severity: "medium", count: 3 },
        { severity: "high", count: 4 },
        { severity: "critical", count: 1 },
      ],
    });

    vi.mocked(DashboardService.getRecentIncidents).mockResolvedValueOnce([
      {
        id: "1",
        title: "Test Populated Incident",
        severity: "high",
        status: "reported",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedPersonnel: [],
      },
    ]);

    // Next.js Server Components are just async functions
    const pageContent = await OpsDashboardPage({ params: Promise.resolve({ locale: "en" }) });
    render(pageContent);

    expect(screen.getByText("Operations Dashboard")).toBeDefined();
    expect(screen.getByText("Total Incidents: 10")).toBeDefined();
    expect(screen.getByText("Test Populated Incident")).toBeDefined();
  });

  it("should render empty state when database is empty", async () => {
    vi.mocked(requireOps).mockResolvedValueOnce({ role: "ops_manager", expires: "" } as any);

    vi.mocked(DashboardService.getDashboardMetrics).mockResolvedValueOnce({
      totalIncidents: 0,
      openIncidents: 0,
      resolvedIncidents: 0,
      incidentsCreatedToday: 0,
      unresolvedCriticalIncidents: 0,
      incidentsBySeverity: [],
    });

    vi.mocked(DashboardService.getRecentIncidents).mockResolvedValueOnce([]);

    const pageContent = await OpsDashboardPage({ params: Promise.resolve({ locale: "en" }) });
    render(pageContent);

    expect(screen.getByText("No Operations Data")).toBeDefined();
  });

  it("should render service unavailable when database fails", async () => {
    vi.mocked(requireOps).mockResolvedValueOnce({ role: "ops_manager", expires: "" } as any);

    vi.mocked(DashboardService.getDashboardMetrics).mockRejectedValueOnce(
      new Error("Database failure"),
    );

    const pageContent = await OpsDashboardPage({ params: Promise.resolve({ locale: "en" }) });
    render(pageContent);

    expect(screen.getByText("Service Unavailable")).toBeDefined();
  });

  it("should call requireOps to enforce authorization", async () => {
    vi.mocked(requireOps).mockResolvedValueOnce({ role: "ops_manager", expires: "" } as any);
    vi.mocked(DashboardService.getDashboardMetrics).mockRejectedValueOnce(new Error()); // short-circuit

    await OpsDashboardPage({ params: Promise.resolve({ locale: "en" }) });

    expect(requireOps).toHaveBeenCalled();
  });
});
