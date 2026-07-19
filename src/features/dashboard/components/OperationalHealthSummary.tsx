import { DashboardMetricsDTO } from "@/features/dashboard/types";
import { TelemetryDashboardDto } from "@/features/telemetry/types";
import { Activity, ShieldAlert, Users, Clock } from "lucide-react";
import { RadialProgress } from "@/components/ui/radial-progress";

interface OperationalHealthSummaryProps {
  metrics: DashboardMetricsDTO;
  telemetry: TelemetryDashboardDto | null;
}

export function OperationalHealthSummary({ metrics, telemetry }: OperationalHealthSummaryProps) {
  // Presentation-only Health Score Calculation
  // Starts at 100, deducts based on critical incidents and high telemetry values
  let healthScore = 100;
  let deductions = 0;

  // Deduct 15 points per critical incident
  deductions += metrics.unresolvedCriticalIncidents * 15;

  if (telemetry) {
    // Deduct points for high crowd density (over 70%)
    if (telemetry.globalCrowdDensity > 70) {
      deductions += (telemetry.globalCrowdDensity - 70) * 0.5;
    }
    // Deduct points for high wait times (over 10 mins)
    if (telemetry.averageWaitTime > 10) {
      deductions += (telemetry.averageWaitTime - 10) * 1.5;
    }
  }

  healthScore = Math.max(0, Math.min(100, Math.round(100 - deductions)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center h-full">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
        Stadium Health Score
      </h2>

      <RadialProgress
        value={healthScore}
        max={100}
        label={healthScore >= 90 ? "Excellent" : healthScore >= 70 ? "Good" : "Critical"}
        className="mb-6"
      />

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-gray-50 rounded p-3 flex flex-col items-center border border-gray-100">
          <ShieldAlert
            className={`h-4 w-4 mb-1 ${metrics.unresolvedCriticalIncidents > 0 ? "text-red-500" : "text-gray-400"}`}
          />
          <span className="text-xs text-gray-500 uppercase">Critical</span>
          <span className="text-sm font-bold text-gray-900">
            {metrics.unresolvedCriticalIncidents}
          </span>
        </div>
        <div className="bg-gray-50 rounded p-3 flex flex-col items-center border border-gray-100">
          <Activity className="h-4 w-4 mb-1 text-indigo-500" />
          <span className="text-xs text-gray-500 uppercase">Active</span>
          <span className="text-sm font-bold text-gray-900">{metrics.openIncidents}</span>
        </div>
        <div className="bg-gray-50 rounded p-3 flex flex-col items-center border border-gray-100">
          <Users className="h-4 w-4 mb-1 text-blue-500" />
          <span className="text-xs text-gray-500 uppercase">Density</span>
          <span className="text-sm font-bold text-gray-900">
            {telemetry ? `${telemetry.globalCrowdDensity.toFixed(0)}%` : "N/A"}
          </span>
        </div>
        <div className="bg-gray-50 rounded p-3 flex flex-col items-center border border-gray-100">
          <Clock className="h-4 w-4 mb-1 text-amber-500" />
          <span className="text-xs text-gray-500 uppercase">Avg Wait</span>
          <span className="text-sm font-bold text-gray-900">
            {telemetry ? `${telemetry.averageWaitTime.toFixed(0)}m` : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
