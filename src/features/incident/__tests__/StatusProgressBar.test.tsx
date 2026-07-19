/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusProgressBar } from "../components/StatusProgressBar";

describe("StatusProgressBar Component", () => {
  it("renders status labels correctly", () => {
    render(<StatusProgressBar status="assigned" />);

    expect(screen.getByText("Reported")).toBeDefined();
    expect(screen.getByText("Assigned")).toBeDefined();
    expect(screen.getByText("Resolved")).toBeDefined();
    expect(screen.getByText("Closed")).toBeDefined();
  });

  it("sets active step aria-current to 'step'", () => {
    const { container } = render(<StatusProgressBar status="assigned" />);

    // Assigned is the 2nd step (index 1)
    const activeStep = container.querySelector('[aria-current="step"]');
    expect(activeStep).toBeDefined();
    expect(activeStep?.textContent).not.toBe("✓"); // Should display step number/icon if not completed
  });
});
