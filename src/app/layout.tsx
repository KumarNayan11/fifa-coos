/**
 * FIFACoOS — Root Layout
 *
 * Global layout for the entire application.
 * Defines metadata, viewport, fonts, and the provider wrapper.
 * All pages inherit this layout.
 *
 * @see DEVELOPER_GUIDE.md Section 10 — Metadata
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { APP_CONFIG } from "@/config/app";
import { Providers } from "./providers";
import "./globals.css";

// ---------------------------------------------------------------------------
// Fonts — Next.js font optimization (self-hosted, zero layout shift)
// ---------------------------------------------------------------------------

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ---------------------------------------------------------------------------
// Metadata & Viewport
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.metadata.title,
    template: APP_CONFIG.metadata.titleTemplate,
  },
  description: APP_CONFIG.metadata.description,
  applicationName: APP_CONFIG.name,
  keywords: [
    "FIFA",
    "World Cup 2026",
    "Stadium Operations",
    "AI Copilot",
    "Smart Stadium",
    "PromptWars",
  ],
  authors: [{ name: "FIFACoOS Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={APP_CONFIG.metadata.locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
