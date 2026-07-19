import { Activity, Users, Clock, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import type { ZoneTelemetryDto, PoiTelemetryDto } from "@/features/telemetry/types";

interface RelatedTelemetryPanelProps {
  zoneTelemetry?: ZoneTelemetryDto;
  poiTelemetry?: PoiTelemetryDto[];
}

export function RelatedTelemetryPanel({
  zoneTelemetry,
  poiTelemetry = [],
}: RelatedTelemetryPanelProps) {
  if (!zoneTelemetry && poiTelemetry.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed flex flex-col items-center">
        <Info className="h-6 w-6 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-900">No telemetry available</p>
        <p className="text-xs mt-1">Metrics for this zone are currently offline or unavailable.</p>
      </div>
    );
  }

  const renderTrend = (trend?: { isPositive: boolean; label: string; value: number }) => {
    if (!trend) return null;
    return (
      <div
        className={`flex items-center text-xs mt-1 font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {trend.isPositive ? (
          <ArrowUpRight className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDownRight className="h-3 w-3 mr-1" />
        )}
        {trend.value}% {trend.label}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {zoneTelemetry && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <Users className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Crowd Density</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 font-mono">
                {zoneTelemetry.crowdDensity}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${
                  zoneTelemetry.crowdDensity > 75
                    ? "bg-red-500"
                    : zoneTelemetry.crowdDensity > 50
                      ? "bg-amber-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${zoneTelemetry.crowdDensity}%` }}
                role="img"
                aria-label={`Crowd Density: ${zoneTelemetry.crowdDensity}%`}
              />
            </div>
            {renderTrend(zoneTelemetry.trend)}
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-1.5 text-gray-500 mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Incident Prob</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 font-mono">
                {zoneTelemetry.incidentProbability}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${
                  zoneTelemetry.incidentProbability > 20
                    ? "bg-red-500"
                    : zoneTelemetry.incidentProbability > 10
                      ? "bg-amber-500"
                      : "bg-indigo-500"
                }`}
                style={{ width: `${zoneTelemetry.incidentProbability}%` }}
                role="img"
                aria-label={`Incident Probability: ${zoneTelemetry.incidentProbability}%`}
              />
            </div>
          </div>
        </div>
      )}

      {poiTelemetry.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
              Nearby POIs
            </h4>
          </div>
          <div className="divide-y divide-gray-100">
            {poiTelemetry.map((poi) => (
              <div key={poi.poiId} className="p-3 text-sm flex justify-between items-center">
                <div>
                  <p
                    className="font-medium text-gray-900 truncate max-w-[150px]"
                    title={poi.poiName}
                  >
                    {poi.poiName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{poi.type.replace("_", " ")}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-gray-900 font-medium">
                    <Clock className="h-3 w-3 text-gray-400" />
                    {poi.waitTime}m
                  </div>
                  <p className="text-xs text-gray-500">{poi.throughput} ppl/hr</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
