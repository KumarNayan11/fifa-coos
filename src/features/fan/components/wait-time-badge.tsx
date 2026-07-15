/**
 * FIFACoOS — Wait Time Badge Component
 *
 * Displays a color-coded wait time indicator.
 */

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatWaitTime, getWaitTimeSeverity } from "../services/wait-time.service";
import { cn } from "@/lib/utils";

export interface WaitTimeBadgeProps {
  minutes: number;
}

export function WaitTimeBadge({ minutes }: WaitTimeBadgeProps) {
  const severity = getWaitTimeSeverity(minutes);
  const formatted = formatWaitTime(minutes);

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1 font-normal",
        severity === "low" &&
          "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
        severity === "medium" &&
          "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        severity === "high" && "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
      )}
    >
      <Clock className="h-3 w-3" aria-hidden="true" />
      {formatted}
    </Badge>
  );
}
