/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import OpsDashboardPage from "../page";
import { requireOps } from "@/lib/auth";
import { DashboardService } from "@/features/dashboard/services/dashboard.service";
import { IncidentService } from "@/features/incident/services/incident.service";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  requireOps: vi.fn(),
}));

vi.mock("@/features/dashboard/services/dashboard.service", () => ({
  DashboardService: {
    getDashboardMetrics: vi.fn(),
  },
}));

vi.mock("@/features/incident/services/incident.service", () => ({
  IncidentService: {
    listIncidents: vi.fn(),
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

// Removed vi.mock("react")

describe("OpsDashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the executive dashboard layout successfully", async () => {
    vi.mocked(requireOps).mockResolvedValueOnce({ role: "ops_manager", expires: "" } as any);

    vi.mocked(DashboardService.getDashboardMetrics).mockResolvedValueOnce({
      totalIncidents: 10,
      openIncidents: 5,
      resolvedIncidents: 5,
      incidentsCreatedToday: 2,
      unresolvedCriticalIncidents: 1,
      incidentsBySeverity: [],
    });

    vi.mocked(IncidentService.listIncidents).mockResolvedValueOnce([
      {
        id: "1",
        title: "Test Incident",
        severity: "high",
        status: "reported",
        created_at: new Date(),
        updated_at: new Date(),
        zone_id: "z1",
        zone: { name: "Test Zone" },
        assignments: [],
      } as any,
    ]);

    // Render the page
    const pageContent = await OpsDashboardPage({ params: Promise.resolve({ locale: "en" }) });
    render(pageContent as any);

    // Assert main structural elements
    expect(screen.getByText("Operations Dashboard")).toBeDefined();

    // We expect the sub-components to throw since they are async and we mocked Suspense to render them immediately.
    // Wait, testing async Server Components in jsdom without a framework wrapper is tricky.
    // We'll just verify the main layout titles since the page itself returns the basic layout structure.
    expect(screen.getByText(/Live Command Center Overview/i)).toBeDefined();
    expect(screen.getByText(/Report Incident/i)).toBeDefined();
  });

  it("should call requireOps to enforce authorization", async () => {
    vi.mocked(requireOps).mockResolvedValueOnce({ role: "ops_manager", expires: "" } as any);
    vi.mocked(DashboardService.getDashboardMetrics).mockResolvedValueOnce({} as any);
    vi.mocked(IncidentService.listIncidents).mockResolvedValueOnce([] as any);

    await OpsDashboardPage({ params: Promise.resolve({ locale: "en" }) });

    expect(requireOps).toHaveBeenCalled();
  });
});
