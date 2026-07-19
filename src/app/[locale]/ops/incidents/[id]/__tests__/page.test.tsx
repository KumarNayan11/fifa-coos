/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import IncidentDetailsPage from "../page";

// Mock Services
vi.mock("@/lib/auth", () => ({
  requireOps: vi.fn(),
}));

vi.mock("@/features/incident/services/incident.service", () => ({
  IncidentService: {
    getIncident: vi.fn().mockResolvedValue({
      id: "inc-123",
      title: "Test Incident",
      description: "Test description",
      severity: "high",
      status: "assigned",
      zone_id: "z1",
      zone: { name: "Test Zone" },
      created_at: new Date("2024-01-01T10:00:00Z"),
      updated_at: new Date("2024-01-01T10:00:00Z"),
      assignments: [],
    }),
  },
}));

vi.mock("@/features/telemetry/services/telemetry.service", () => ({
  TelemetryService: {
    getDashboardTelemetry: vi.fn().mockResolvedValue({
      zones: [{ zoneId: "z1", crowdDensity: 80, incidentProbability: 20 }],
      pois: [],
    }),
  },
}));

vi.mock("@/features/incident/actions", () => ({
  getUsers: vi.fn().mockResolvedValue({ success: true, data: [] }),
}));

vi.mock("@/features/ai/services/operations-ai.service", () => ({
  OperationsAiService: {
    getDecisionSupport: vi.fn().mockResolvedValue({
      reasoning: "AI reasoning here.",
      recommendedActions: ["Action 1"],
      confidenceScore: 90,
    }),
  },
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  usePathname: vi.fn(() => "/ops/incidents/inc-123"),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

describe("IncidentDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the operational workspace layout successfully", async () => {
    const params = Promise.resolve({ id: "inc-123", locale: "en" });
    const Page = await IncidentDetailsPage({ params });
    render(Page);

    // Verify main components are present
    expect(screen.getByText("Incident: Test Incident")).toBeDefined();
    expect(screen.getByText("Test description")).toBeDefined();

    // AI Panel
    expect(screen.getByText("AI Operational Intelligence")).toBeDefined();
    expect(screen.getByText("AI reasoning here.")).toBeDefined();

    // Assignment Context
    expect(screen.getByText("Assignment Context")).toBeDefined();

    // Operational Snapshot
    expect(screen.getByText("Operational Snapshot")).toBeDefined();
    expect(screen.getByText("Test Zone")).toBeDefined(); // Location

    // Related Telemetry
    expect(screen.getByText("Related Telemetry")).toBeDefined();
    expect(screen.getByText("80%")).toBeDefined(); // Crowd density

    // Activity Timeline
    expect(screen.getByText("Activity Timeline")).toBeDefined();
  });
});
