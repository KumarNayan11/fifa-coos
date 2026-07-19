/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { POICard } from "../components/poi-card";
import type { POI } from "../types/fan.types";

const mockPoi: POI = {
  id: "poi-1",
  name: "Gate A Entry",
  type: "gate",
  zoneId: "zone-north",
  coordinates: { lat: 29.6852, lng: -95.4102 }, // Close to center (lat: 29.685, lng: -95.41)
  isAccessible: true,
  description: "Main north entry gate.",
};

describe("POICard Component", () => {
  it("renders POI card details correctly with computed distance", () => {
    render(<POICard poi={mockPoi} waitTimeMinutes={10} />);

    expect(screen.getByText("Gate A Entry")).toBeDefined();
    // Category tag mapped to lowercase version
    expect(screen.getByText("gate")).toBeDefined();
    // Wait time badge
    expect(screen.getByText("~10 min (moderate)")).toBeDefined();
    // Accessible badge icon title
    expect(screen.getByLabelText("Accessible Facility")).toBeDefined();

    // Distance string (Haversine distance from 29.685, -95.41 to 29.6852, -95.4102 is ~28m)
    expect(screen.getByText(/≈ \d+ m/)).toBeDefined();
  });
});
