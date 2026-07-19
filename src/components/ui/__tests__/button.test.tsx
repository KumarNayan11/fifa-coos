/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button Component", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeDefined();
    expect(button.hasAttribute("disabled")).toBe(false);
  });

  it("handles isLoading prop correctly", () => {
    render(<Button isLoading>Submit</Button>);

    // The button should be disabled
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");

    // The spinner should be rendered with aria-hidden
    const spinner = button.querySelector(".animate-spin");
    expect(spinner).toBeDefined();
    expect(spinner?.getAttribute("aria-hidden")).toBe("true");

    // The text should have opacity-0
    const textContainer = screen.getByText("Submit").closest("span");
    expect(textContainer?.className).toContain("opacity-0");
  });

  it("combines disabled and isLoading states", () => {
    render(
      <Button isLoading disabled>
        Submit Disabled
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Submit Disabled" });
    expect(button.hasAttribute("disabled")).toBe(true);
  });
});
