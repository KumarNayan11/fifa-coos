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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BrainCircuit className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold tracking-tight text-gray-900">Operations Copilot</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor()}`}
          >
            {priorityLevel} PRIORITY
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>Confidence:</span>
            <span
              className={`font-medium ${confidenceScore >= 80 ? "text-green-600" : confidenceScore >= 50 ? "text-amber-600" : "text-red-600"}`}
            >
              {confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status & Rationale */}
        <div className="flex items-start space-x-4 bg-blue-50 border border-blue-100 p-4 rounded-lg">
          <div className="mt-0.5">{getStatusIcon()}</div>
          <div>
            <h3 className="font-semibold text-blue-900 flex items-center">
              Status: {overallStatus}
              {affectedZones.length > 0 && (
                <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                  Zones: {affectedZones.join(", ")}
                </span>
              )}
            </h3>
            <p className="mt-1 text-sm text-blue-800 leading-relaxed">{reasoning}</p>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center text-indigo-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            Recommended Actions (Advisory)
          </h3>
          <ul className="space-y-3">
            {recommendedActions.map((action, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
