"use client";

import { useState } from "react";
import { OpsCopilotResponse } from "@/features/ai/types/ops-ai.types";
import { BrainCircuit, AlertTriangle, Info, ShieldAlert, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OperationsCopilotPanelProps {
  decisionSupport: OpsCopilotResponse | null;
}

export function OperationsCopilotPanel({ decisionSupport }: OperationsCopilotPanelProps) {
  if (!decisionSupport) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg h-[400px] flex flex-col justify-center items-center">
        <BrainCircuit className="h-10 w-10 mx-auto mb-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-base font-semibold text-gray-900">AI Copilot Unavailable</h2>
        <p className="mt-2 text-xs text-gray-500 max-w-xs">
          Decision support is currently offline or unreachable. Please rely on manual assessments.
        </p>
      </div>
    );
  }

  const { overallStatus, priorityLevel, confidenceScore, reasoning, affectedZones } =
    decisionSupport;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[400px] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-2.5">
          <BrainCircuit className="h-5 w-5 text-indigo-600 animate-pulse" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            Executive Briefing
          </h2>
        </div>
        {/* Prominent pill-styled badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset select-none shadow-sm bg-white",
            confidenceScore >= 80
              ? "text-green-700 ring-green-600/20"
              : confidenceScore >= 50
                ? "text-amber-700 ring-amber-600/20"
                : "text-red-700 ring-red-600/20",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full animate-ping absolute",
              confidenceScore >= 80
                ? "bg-green-400"
                : confidenceScore >= 50
                  ? "bg-amber-400"
                  : "bg-red-400",
            )}
          />
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full relative",
              confidenceScore >= 80
                ? "bg-green-500"
                : confidenceScore >= 50
                  ? "bg-amber-500"
                  : "bg-red-500",
            )}
            aria-hidden="true"
          />
          Conf: {confidenceScore}%
        </span>
      </div>

      {/* Content Area - Scrollable */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {/* Status Banner */}
        <div
          className={cn(
            "flex items-center justify-between p-3.5 rounded-lg border shadow-sm",
            overallStatus === "CRITICAL"
              ? "bg-red-50/50 border-red-200 text-red-900"
              : overallStatus === "WARNING"
                ? "bg-amber-50/50 border-amber-200 text-amber-900"
                : "bg-indigo-50/30 border-indigo-200 text-indigo-900",
          )}
        >
          <div className="flex items-center gap-2.5">
            {overallStatus === "CRITICAL" ? (
              <ShieldAlert className="h-5 w-5 text-red-600" />
            ) : overallStatus === "WARNING" ? (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            ) : (
              <Info className="h-5 w-5 text-blue-600" />
            )}
            <div>
              <h3 className="font-semibold text-[10px] uppercase tracking-wider text-gray-500">
                System Status
              </h3>
              <p className="font-extrabold text-sm uppercase">{overallStatus}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-[10px] uppercase tracking-wider text-gray-500">
              Priority
            </h3>
            <p className="font-extrabold text-sm uppercase">{priorityLevel}</p>
          </div>
        </div>

        {/* Situational Analysis */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider select-none">
            Situational Analysis
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-lg border border-gray-150/60 font-medium">
            {reasoning}
          </p>
          {affectedZones.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider select-none">
                Impacted Zones:
              </span>
              {affectedZones.map((z) => (
                <span
                  key={z}
                  className="text-[10px] font-bold bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded shadow-sm"
                >
                  {z}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface OperationsRecommendationsCardProps {
  decisionSupport: OpsCopilotResponse | null;
}

export function OperationsRecommendationsCard({
  decisionSupport,
}: OperationsRecommendationsCardProps) {
  const [showAll, setShowAll] = useState(false);

  if (!decisionSupport) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg h-full flex flex-col justify-center items-center">
        <BrainCircuit className="h-10 w-10 mx-auto mb-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-base font-semibold text-gray-900">AI Recommendations Unavailable</h2>
      </div>
    );
  }

  const { recommendedActions, confidenceScore } = decisionSupport;
  const visibleActions = showAll ? recommendedActions : recommendedActions.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="h-5 w-5 text-indigo-600" aria-hidden="true" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              AI Recommended Actions
            </h2>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset select-none shadow-sm bg-white",
              confidenceScore >= 80
                ? "text-green-700 ring-green-600/20"
                : confidenceScore >= 50
                  ? "text-amber-700 ring-amber-600/20"
                  : "text-red-700 ring-red-600/20",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full animate-ping absolute",
                confidenceScore >= 80
                  ? "bg-green-400"
                  : confidenceScore >= 50
                    ? "bg-amber-400"
                    : "bg-red-400",
              )}
            />
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full relative",
                confidenceScore >= 80
                  ? "bg-green-500"
                  : confidenceScore >= 50
                    ? "bg-amber-500"
                    : "bg-red-500",
              )}
              aria-hidden="true"
            />
            Conf: {confidenceScore}%
          </span>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[300px]">
          {visibleActions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No actions recommended at this time.</p>
          ) : (
            <ul className="space-y-2.5">
              {visibleActions.map((action, index) => (
                <li
                  key={index}
                  className="flex items-start bg-indigo-50/30 p-3.5 rounded-lg border border-indigo-100/40 hover:bg-indigo-50/50 transition-colors shadow-sm"
                >
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 shadow-sm select-none">
                    {index + 1}
                  </span>
                  <span className="text-indigo-950 text-sm font-medium leading-snug">{action}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {recommendedActions.length > 3 && (
        <div className="px-5 pb-5 pt-3 border-t bg-gray-50/30 flex justify-end shrink-0 select-none">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold hover:bg-gray-100"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `View All (${recommendedActions.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}
