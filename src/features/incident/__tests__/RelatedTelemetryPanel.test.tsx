/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { RelatedTelemetryPanel } from "../components/RelatedTelemetryPanel";

afterEach(() => {
  cleanup();
});

describe("RelatedTelemetryPanel", () => {
  it("renders empty state gracefully when no telemetry is provided", () => {
    render(<RelatedTelemetryPanel zoneTelemetry={undefined} poiTelemetry={[]} />);
    expect(screen.getByText("No telemetry available")).toBeDefined();
  });

  it("renders zone telemetry correctly without trend", () => {
    const zoneTelemetry = {
      zoneId: "z1",
      zoneName: "Sector A",
      crowdDensity: 85,
      incidentProbability: 15,
    };

    render(<RelatedTelemetryPanel zoneTelemetry={zoneTelemetry} />);

    expect(screen.getByText("85%")).toBeDefined();
    expect(screen.getByText("15%")).toBeDefined();
    expect(screen.queryByText("vs last hour")).toBeNull();
  });

  it("renders zone telemetry correctly with trend", () => {
    const zoneTelemetry = {
      zoneId: "z1",
      zoneName: "Sector A",
      crowdDensity: 85,
      incidentProbability: 15,
      trend: {
        isPositive: true,
        label: "vs last hour",
        value: 5,
      },
    };

    render(<RelatedTelemetryPanel zoneTelemetry={zoneTelemetry} />);

    expect(screen.getByText(/5% vs last hour/)).toBeDefined();
  });

  it("renders POI telemetry correctly", () => {
    const poiTelemetry = [
      {
        poiId: "p1",
        poiName: "Gate North",
        zoneId: "z1",
        type: "entry_gate",
        waitTime: 10,
        throughput: 500,
      },
    ];

    render(<RelatedTelemetryPanel poiTelemetry={poiTelemetry} />);

    expect(screen.getByText("Gate North")).toBeDefined();
    expect(screen.getByText("entry gate")).toBeDefined();
    expect(screen.getByText(/10m/)).toBeDefined();
    expect(screen.getByText(/500 ppl\/hr/)).toBeDefined();
  });
});
