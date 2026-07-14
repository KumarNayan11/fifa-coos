/**
 * FIFACoOS — Application Metadata
 *
 * Next.js Metadata generation helpers for consistent SEO across all pages.
 *
 * @see DEVELOPER_GUIDE.md Section 10 — Metadata
 */

import type { Metadata } from "next";

import { APP_CONFIG } from "@/config/app";

/**
 * Creates consistent page metadata with the application title template.
 *
 * @param title - The page-specific title
 * @param description - The page-specific description
 * @param options - Additional metadata overrides
 * @returns A Next.js Metadata object
 */
export function createMetadata(
  title?: string,
  description?: string,
  options?: Partial<Metadata>,
): Metadata {
  return {
    title: title
      ? APP_CONFIG.metadata.titleTemplate.replace("%s", title)
      : APP_CONFIG.metadata.title,
    description: description ?? APP_CONFIG.metadata.description,
    ...options,
  };
}
