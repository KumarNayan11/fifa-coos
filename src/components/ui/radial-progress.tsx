import { cn } from "@/lib/utils";

interface RadialProgressProps {
  value: number;
  max?: number;
  label?: string;
  statusColor?: string; // Optional custom stroke color class (e.g. "stroke-green-600")
  className?: string;
}

export function RadialProgress({
  value,
  max = 100,
  label,
  statusColor,
  className,
}: RadialProgressProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.2
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  // Default color logic if no custom statusColor is provided
  const getStrokeColor = (pct: number) => {
    if (pct >= 90) return "stroke-green-600";
    if (pct >= 70) return "stroke-amber-500";
    return "stroke-red-600";
  };

  const activeStrokeColor = statusColor || getStrokeColor(percentage);

  return (
    <div
      className={cn("relative flex flex-col items-center justify-center", className)}
      role="img"
      aria-label={`${label ? `${label}: ` : ""}${value} out of ${max}`}
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-gray-100 fill-transparent"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            className={cn("transition-all duration-500 ease-out", activeStrokeColor)}
            strokeWidth="8"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-gray-900 leading-none">{value}</span>
          {label && (
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-1 select-none">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
