"use client";

/**
 * FIFACoOS — Quick Actions Component
 *
 * Pre-defined prompt suggestions displayed as clickable buttons.
 * Clicking sends the prompt directly to the chat.
 */

import { MapPin, Utensils, Accessibility, ShieldAlert } from "lucide-react";

export interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const QUICK_ACTIONS = [
  {
    label: "Find food nearby",
    prompt: "Where is the nearest food court?",
    icon: Utensils,
  },
  {
    label: "Accessible restrooms",
    prompt: "Where are the accessible restrooms?",
    icon: Accessibility,
  },
  {
    label: "How to get to Gate B",
    prompt: "How do I get to Gate B?",
    icon: MapPin,
  },
  {
    label: "Prohibited items",
    prompt: "What items are not allowed in the stadium?",
    icon: ShieldAlert,
  },
] as const;

/**
 * Quick action buttons for common fan queries.
 */
export function QuickActions({ onSelect, disabled = false }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onSelect(action.prompt)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
