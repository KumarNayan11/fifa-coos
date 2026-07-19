/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadialProgress } from "../radial-progress";

describe("RadialProgress Component", () => {
  it("renders progress value and label correctly", () => {
    render(<RadialProgress value={75} max={100} label="Good" />);

    // Check score number
    expect(screen.getByText("75")).toBeDefined();
    // Check status label
    expect(screen.getByText("Good")).toBeDefined();
  });

  it("handles color boundaries correctly", () => {
    const { container: greenContainer } = render(<RadialProgress value={95} />);
    const activeCircleGreen = greenContainer.querySelector("circle.stroke-green-600");
    expect(activeCircleGreen).toBeDefined();

    const { container: amberContainer } = render(<RadialProgress value={75} />);
    const activeCircleAmber = amberContainer.querySelector("circle.stroke-amber-500");
    expect(activeCircleAmber).toBeDefined();

    const { container: redContainer } = render(<RadialProgress value={50} />);
    const activeCircleRed = redContainer.querySelector("circle.stroke-red-600");
    expect(activeCircleRed).toBeDefined();
  });

  it("respects custom statusColor override", () => {
    const { container } = render(<RadialProgress value={75} statusColor="stroke-blue-500" />);
    const activeCircle = container.querySelector("circle.stroke-blue-500");
    expect(activeCircle).toBeDefined();
  });
});
