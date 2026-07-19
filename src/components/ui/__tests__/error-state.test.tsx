/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorState } from "../error-state";
import { Button } from "../button";

describe("ErrorState Component", () => {
  it("renders correctly with minimum props", () => {
    render(<ErrorState title="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
    // Should have default alert icon (aria-hidden)
    const iconContainer = screen.getByRole("alert").querySelector("div[aria-hidden='true']");
    expect(iconContainer).toBeDefined();
  });

  it("renders with description and action", () => {
    render(
      <ErrorState
        title="Failed to load"
        description="Network error occurred"
        action={<Button>Retry</Button>}
      />,
    );

    expect(screen.getByText("Failed to load")).toBeDefined();
    expect(screen.getByText("Network error occurred")).toBeDefined();
    expect(screen.getByRole("button", { name: "Retry" })).toBeDefined();
  });
});
