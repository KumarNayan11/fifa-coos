import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TelemetryDashboardDto } from "@/features/telemetry/types";
import { MetricCard } from "./MetricCard";
import { Activity, Users, Clock, ShieldAlert, Map, Building2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface TelemetryOverviewPanelProps {
  telemetry: TelemetryDashboardDto;
}

export function TelemetryOverviewPanel({ telemetry }: TelemetryOverviewPanelProps) {
  // Aggregate global incident probability from zones
  const averageIncidentProbability =
    telemetry.zones.length > 0
      ? telemetry.zones.reduce((sum, zone) => sum + zone.incidentProbability, 0) /
        telemetry.zones.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold tracking-tight">Telemetry Overview</h2>
        <p className="text-sm text-gray-500">Live operational data and stadium conditions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Crowd Density"
          value={`${telemetry.globalCrowdDensity.toFixed(1)}%`}
          icon={<Users className="h-4 w-4" aria-hidden="true" />}
          trend={telemetry.globalDensityTrend}
          className={telemetry.globalCrowdDensity > 80 ? "border-amber-200 bg-amber-50" : ""}
        />
        <MetricCard
          title="Gate Throughput"
          value={`${telemetry.gateThroughput.toFixed(0)}/min`}
          icon={<Activity className="h-4 w-4" aria-hidden="true" />}
          trend={telemetry.throughputTrend}
        />
        <MetricCard
          title="Average Queue"
          value={`${telemetry.averageWaitTime.toFixed(1)} min`}
          icon={<Clock className="h-4 w-4" aria-hidden="true" />}
          trend={telemetry.waitTimeTrend}
          className={telemetry.averageWaitTime > 15 ? "border-red-200 bg-red-50" : ""}
        />
        <MetricCard
          title="Incident Risk"
          value={`${averageIncidentProbability.toFixed(1)}%`}
          icon={<ShieldAlert className="h-4 w-4" aria-hidden="true" />}
          className={averageIncidentProbability > 10 ? "border-red-200 text-red-700" : ""}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Zone Heatmap (Simulated)</CardTitle>
            <CardDescription>Current crowd density and conditions by zone</CardDescription>
          </CardHeader>
          <CardContent>
            {telemetry.zones.length > 0 && (
              <div className="space-y-2 mb-6 p-4 bg-gray-50/50 border rounded-lg">
                <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <span>Zone Status Overview</span>
                  <span>{telemetry.zones.length} Zones total</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden shadow-inner">
                  {telemetry.zones.filter((z) => z.crowdDensity < 50).length > 0 && (
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{
                        width: `${(telemetry.zones.filter((z) => z.crowdDensity < 50).length / telemetry.zones.length) * 100}%`,
                      }}
                      title="Low density zones"
                      role="img"
                      aria-label={`Low density zones: ${telemetry.zones.filter((z) => z.crowdDensity < 50).length}`}
                    />
                  )}
                  {telemetry.zones.filter((z) => z.crowdDensity >= 50 && z.crowdDensity <= 75)
                    .length > 0 && (
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{
                        width: `${(telemetry.zones.filter((z) => z.crowdDensity >= 50 && z.crowdDensity <= 75).length / telemetry.zones.length) * 100}%`,
                      }}
                      title="Medium density zones"
                      role="img"
                      aria-label={`Medium density zones: ${telemetry.zones.filter((z) => z.crowdDensity >= 50 && z.crowdDensity <= 75).length}`}
                    />
                  )}
                  {telemetry.zones.filter((z) => z.crowdDensity > 75).length > 0 && (
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{
                        width: `${(telemetry.zones.filter((z) => z.crowdDensity > 75).length / telemetry.zones.length) * 100}%`,
                      }}
                      title="High density zones"
                      role="img"
                      aria-label={`High density zones: ${telemetry.zones.filter((z) => z.crowdDensity > 75).length}`}
                    />
                  )}
                </div>
                <div className="flex gap-4 text-xs font-semibold mt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-green-500" />
                    Low ({telemetry.zones.filter((z) => z.crowdDensity < 50).length})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                    Medium (
                    {
                      telemetry.zones.filter((z) => z.crowdDensity >= 50 && z.crowdDensity <= 75)
                        .length
                    }
                    )
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-red-500" />
                    High ({telemetry.zones.filter((z) => z.crowdDensity > 75).length})
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {telemetry.zones.map((zone) => (
                <div key={zone.zoneId} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-none">{zone.zoneName}</p>
                    <p className="text-xs text-gray-500">
                      Risk: {zone.incidentProbability.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${zone.crowdDensity > 75 ? "bg-red-500" : zone.crowdDensity > 50 ? "bg-amber-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(100, zone.crowdDensity)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right font-mono">
                      {zone.crowdDensity.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
              {telemetry.zones.length === 0 && (
                <EmptyState
                  icon={<Map className="h-8 w-8" aria-hidden="true" />}
                  title="No zone telemetry available"
                  className="py-8"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>POI Wait Times</CardTitle>
            <CardDescription>Current queues at concessions & restrooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {telemetry.pois.filter((p) => p.type !== "gate").length > 0 ? (
                telemetry.pois
                  .filter((p) => p.type !== "gate")
                  .slice(0, 5)
                  .map((poi) => {
                    const waitTimePct = Math.min(100, (poi.waitTime / 30) * 100);
                    return (
                      <div key={poi.poiId} className="space-y-1.5">
                        <div className="flex justify-between items-baseline text-sm font-semibold text-gray-700">
                          <span className="truncate max-w-[170px]" title={poi.poiName}>
                            {poi.poiName}
                          </span>
                          <span className="font-mono text-xs text-gray-500">
                            {poi.waitTime.toFixed(0)}m
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${poi.waitTime > 15 ? "bg-red-500" : poi.waitTime > 5 ? "bg-amber-500" : "bg-green-500"}`}
                            style={{ width: `${Math.max(4, waitTimePct)}%` }}
                            role="img"
                            aria-label={`${poi.poiName} wait time: ${poi.waitTime.toFixed(0)} minutes`}
                          />
                        </div>
                      </div>
                    );
                  })
              ) : (
                <EmptyState
                  icon={<Building2 className="h-8 w-8" aria-hidden="true" />}
                  title="No POI telemetry available"
                  className="py-8"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
