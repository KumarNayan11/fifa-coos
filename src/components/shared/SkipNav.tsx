import { useTranslations } from "next-intl";

/**
 * FIFACoOS — Skip Navigation Component
 *
 * Visually hidden link that becomes visible when focused via keyboard.
 * Allows screen reader and keyboard users to skip repetitive navigation
 * and jump straight to the main content.
 */
export function SkipNav() {
  const t = useTranslations("accessibility");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:shadow-md rounded-md font-medium"
    >
      {t("skipToContent")}
    </a>
  );
}
