import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TelemetryDashboardDto } from "@/features/telemetry/types";
import { MetricCard } from "./MetricCard";
import { Activity, Users, Clock, ShieldAlert } from "lucide-react";

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
          icon={<Users className="h-4 w-4" />}
          trend={telemetry.globalDensityTrend}
          className={telemetry.globalCrowdDensity > 80 ? "border-amber-200 bg-amber-50" : ""}
        />
        <MetricCard
          title="Gate Throughput"
          value={`${telemetry.gateThroughput.toFixed(0)}/min`}
          icon={<Activity className="h-4 w-4" />}
          trend={telemetry.throughputTrend}
        />
        <MetricCard
          title="Average Queue"
          value={`${telemetry.averageWaitTime.toFixed(1)} min`}
          icon={<Clock className="h-4 w-4" />}
          trend={telemetry.waitTimeTrend}
          className={telemetry.averageWaitTime > 15 ? "border-red-200 bg-red-50" : ""}
        />
        <MetricCard
          title="Incident Risk"
          value={`${averageIncidentProbability.toFixed(1)}%`}
          icon={<ShieldAlert className="h-4 w-4" />}
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
            <div className="space-y-4">
              {telemetry.zones.map((zone) => (
                <div key={zone.zoneId} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{zone.zoneName}</p>
                    <p className="text-sm text-gray-500">
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
                    <span className="text-sm font-medium w-12 text-right">
                      {zone.crowdDensity.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
              {telemetry.zones.length === 0 && (
                <p className="text-sm text-gray-500">No zone telemetry available.</p>
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
              {telemetry.pois
                .filter((p) => p.type !== "gate")
                .slice(0, 5)
                .map((poi) => (
                  <div key={poi.poiId} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{poi.poiName}</p>
                      <p className="text-sm text-gray-500 capitalize">{poi.type}</p>
                    </div>
                    <div className="font-medium">{poi.waitTime.toFixed(0)} min</div>
                  </div>
                ))}
              {telemetry.pois.length === 0 && (
                <p className="text-sm text-gray-500">No POI telemetry available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
