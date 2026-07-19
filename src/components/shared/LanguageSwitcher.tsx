"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { ChangeEvent, useTransition } from "react";
import { Globe } from "lucide-react";
import { announce } from "@/lib/accessibility/announcements";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
      announce(`Language changed to ${nextLocale === "en" ? "English" : "Hindi"}`);
    });
  };

  return (
    <div className="relative inline-flex items-center gap-1 rounded-md hover:bg-accent/50 focus-within:bg-accent/50 px-2 py-1 transition-colors duration-200">
      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <select
        className="appearance-none bg-transparent py-1 pl-1 pr-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md disabled:opacity-50 cursor-pointer"
        value={locale}
        onChange={onChange}
        disabled={isPending}
        aria-label={t("language")}
      >
        <option value="en">EN</option>
        <option value="hi">हिन्दी</option>
      </select>
      {/* Custom dropdown arrow */}
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
