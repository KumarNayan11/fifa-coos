import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  status?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  description,
  trend,
  status,
  className,
}: MetricCardProps) {
  const getStatusStyles = (stat?: string) => {
    switch (stat) {
      case "danger":
        return "border-red-200 bg-red-50 text-red-900";
      case "warning":
        return "border-amber-200 bg-amber-50 text-amber-900";
      case "success":
        return "border-emerald-200 bg-emerald-50/50 text-emerald-900";
      case "info":
        return "border-indigo-200 bg-indigo-50/30 text-indigo-900";
      case "neutral":
      default:
        return "border-gray-200 bg-white text-gray-900";
    }
  };

  const getTrendIcon = (val: number, isPos?: boolean) => {
    const isGood = isPos !== false; // default to true if undefined
    if (val > 0)
      return {
        icon: "▲",
        color: isGood ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      };
    if (val < 0)
      return {
        icon: "▼",
        color: isGood ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400",
      };
    return { icon: "→", color: "text-gray-400" };
  };

  const trendIconInfo = trend ? getTrendIcon(trend.value, trend.isPositive) : null;

  return (
    <Card
      className={cn(
        "overflow-hidden border transition-all duration-300 hover:shadow-md",
        getStatusStyles(status),
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-400 shrink-0">{icon}</div>}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        {(description || trend) && (
          <div className="text-xs text-gray-500 flex items-center flex-wrap gap-1.5 mt-1">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded bg-white border shadow-sm text-[10px]",
                  trendIconInfo?.color,
                )}
                aria-label={`Trend: ${trend.value > 0 ? "increasing" : trend.value < 0 ? "decreasing" : "stable"} by ${Math.abs(trend.value)}%`}
              >
                <span>{trendIconInfo?.icon}</span>
                <span>{Math.abs(trend.value)}%</span>
              </span>
            )}
            {description && <span className="text-gray-600">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
