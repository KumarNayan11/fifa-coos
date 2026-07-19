import { OpsCopilotResponse } from "@/features/ai/types/ops-ai.types";
import { BrainCircuit, AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";

interface OperationsCopilotPanelProps {
  decisionSupport: OpsCopilotResponse | null;
}

export function OperationsCopilotPanel({ decisionSupport }: OperationsCopilotPanelProps) {
  if (!decisionSupport) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <BrainCircuit className="h-10 w-10 mx-auto mb-4 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">AI Copilot Unavailable</h2>
        <p className="mt-2 text-sm">
          Decision support is currently offline or unreachable. Please rely on manual assessments.
        </p>
      </div>
    );
  }

  const {
    overallStatus,
    priorityLevel,
    recommendedActions,
    reasoning,
    confidenceScore,
    affectedZones,
  } = decisionSupport;

  // Visual cues based on status/priority
  const getStatusIcon = () => {
    switch (overallStatus) {
      case "CRITICAL":
        return <ShieldAlert className="h-6 w-6 text-red-600" />;
      case "WARNING":
        return <AlertTriangle className="h-6 w-6 text-amber-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getPriorityColor = () => {
    switch (priorityLevel) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50/80 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BrainCircuit className="h-6 w-6 text-indigo-600" />
          <h2 className="text-base font-bold uppercase tracking-wider text-gray-900">
            Executive Briefing
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
              AI Confidence
            </span>
            <span
              className={`text-sm font-bold ${confidenceScore >= 80 ? "text-green-600" : confidenceScore >= 50 ? "text-amber-600" : "text-red-600"}`}
            >
              {confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Status Banner */}
        <div
          className={`mb-6 flex items-center justify-between p-4 rounded-lg border ${getPriorityColor()}`}
        >
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider opacity-80">
                System Status
              </h3>
              <p className="font-bold text-lg">{overallStatus}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-sm uppercase tracking-wider opacity-80">Priority</h3>
            <p className="font-bold text-lg">{priorityLevel}</p>
          </div>
        </div>

        {/* Rationale */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Situational Analysis
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
            {reasoning}
          </p>
          {affectedZones.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 mt-1">Impacted Zones:</span>
              {affectedZones.map((z) => (
                <span
                  key={z}
                  className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full font-medium"
                >
                  {z}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-auto">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1.5 text-indigo-500" />
            Recommended Actions
          </h3>
          <ul className="space-y-3">
            {recommendedActions.map((action, index) => (
              <li
                key={index}
                className="flex items-start bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50"
              >
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5 shadow-sm">
                  {index + 1}
                </span>
                <span className="text-indigo-950 text-sm font-medium leading-snug">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
