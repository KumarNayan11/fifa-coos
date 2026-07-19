/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { OperationalHealthSummary } from "../OperationalHealthSummary";

describe("OperationalHealthSummary", () => {
  afterEach(() => {
    cleanup();
  });
  const baseMetrics = {
    totalIncidents: 10,
    openIncidents: 2,
    resolvedIncidents: 8,
    incidentsCreatedToday: 1,
    unresolvedCriticalIncidents: 0,
    incidentsBySeverity: [],
  };

  const baseTelemetry = {
    globalCrowdDensity: 50,
    averageWaitTime: 5,
    gateThroughput: 100,
    globalDensityTrend: { value: 0, label: "stable", isPositive: true },
    throughputTrend: { value: 0, label: "stable", isPositive: true },
    waitTimeTrend: { value: 0, label: "stable", isPositive: true },
    zones: [],
    pois: [],
  };

  it("should calculate perfect score when everything is optimal", () => {
    render(<OperationalHealthSummary metrics={baseMetrics} telemetry={baseTelemetry} />);
    expect(screen.getByText("100")).toBeDefined();
  });

  it("should deduct for critical incidents", () => {
    // 1 critical = -15
    render(
      <OperationalHealthSummary
        metrics={{ ...baseMetrics, unresolvedCriticalIncidents: 1 }}
        telemetry={baseTelemetry}
      />,
    );
    expect(screen.getByText("85")).toBeDefined();
  });

  it("should deduct for high density and wait times", () => {
    // 1 critical = -15
    // Density 80 (10 over 70) * 0.5 = -5
    // Wait time 14 (4 over 10) * 1.5 = -6
    // Total deductions = 26. Score = 74
    render(
      <OperationalHealthSummary
        metrics={{ ...baseMetrics, unresolvedCriticalIncidents: 1 }}
        telemetry={{ ...baseTelemetry, globalCrowdDensity: 80, averageWaitTime: 14 }}
      />,
    );
    expect(screen.getByText("74")).toBeDefined();
  });

  it("should handle missing telemetry safely", () => {
    render(<OperationalHealthSummary metrics={baseMetrics} telemetry={null} />);
    // Telemetry missing = no telemetry deductions. Score = 100
    expect(screen.getByText("100")).toBeDefined();
    // Verify N/A is shown for telemetry values
    const naElements = screen.getAllByText("N/A");
    expect(naElements.length).toBe(2);
  });
});
