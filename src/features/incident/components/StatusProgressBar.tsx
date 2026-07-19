import { Check, AlertCircle, UserPlus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusProgressBarProps {
  status: "reported" | "assigned" | "resolved" | "closed";
}

export function StatusProgressBar({ status }: StatusProgressBarProps) {
  const steps = [
    { key: "reported", label: "Reported", icon: AlertCircle },
    { key: "assigned", label: "Assigned", icon: UserPlus },
    { key: "resolved", label: "Resolved", icon: CheckCircle2 },
    { key: "closed", label: "Closed", icon: CheckCircle2 },
  ];

  const getStepIndex = (s: string) => steps.findIndex((step) => step.key === s);
  const currentIndex = getStepIndex(status);

  return (
    <div
      className="w-full py-6 px-4 bg-gray-50/50 rounded-xl border border-gray-100 mt-4"
      aria-label="Incident status progression"
    >
      <div className="flex items-center justify-between relative max-w-xl mx-auto">
        {/* Progress Line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-10 rounded-full" />
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 flex-1 relative">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 shadow-md bg-white z-10",
                  isCompleted && "border-indigo-600 bg-indigo-600 text-white",
                  isActive && "border-indigo-600 text-indigo-600 ring-4 ring-indigo-100",
                  isPending && "border-gray-200 text-gray-400",
                )}
                aria-current={isActive ? "step" : undefined}
                title={`${step.label}: ${isCompleted ? "Completed" : isActive ? "Active" : "Pending"}`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 stroke-[3]" aria-label="Completed" />
                ) : (
                  <StepIcon className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider text-center hidden sm:block select-none",
                  isActive || isCompleted ? "text-gray-900" : "text-gray-400",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
