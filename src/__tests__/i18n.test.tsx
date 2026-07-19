// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

// Mock next-intl hooks
vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      language: "Language",
    };
    return messages[key] || key;
  },
}));

// Mock routing hooks
const replaceMock = vi.fn();
vi.mock("@/i18n/routing", () => ({
  usePathname: () => "/fan",
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("renders correctly with current locale", () => {
    render(<LanguageSwitcher />);
    const select = screen.getByRole("combobox", { name: "Language" });
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("en");
  });

  it("calls router.replace on language change", () => {
    render(<LanguageSwitcher />);
    const select = screen.getByRole("combobox", { name: "Language" });

    fireEvent.change(select, { target: { value: "hi" } });

    expect(replaceMock).toHaveBeenCalledWith("/fan", { locale: "hi" });
  });
});
