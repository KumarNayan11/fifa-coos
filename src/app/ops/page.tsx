export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { requireOps } from "@/lib/auth";
import { DashboardService } from "@/features/dashboard/services/dashboard.service";
import { TelemetryService } from "@/features/telemetry/services/telemetry.service";
import { MetricCard } from "@/features/dashboard/components/MetricCard";
import { IncidentOverviewPanel } from "@/features/dashboard/components/IncidentOverviewPanel";
import { TelemetryOverviewPanel } from "@/features/dashboard/components/TelemetryOverviewPanel";
import { AutoRefresh } from "@/components/shared/AutoRefresh";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, ShieldAlert } from "lucide-react";

export default async function OpsDashboardPage() {
  // 1. Authentication & Authorization Failure
  // requireOps() will redirect to /ops/login or /unauthorized if invalid
  await requireOps();

  let metrics;
  let recentIncidents;
  let telemetry;

  try {
    // 2. Fetch Data in Parallel
    [metrics, recentIncidents, telemetry] = await Promise.all([
      DashboardService.getDashboardMetrics(),
      DashboardService.getRecentIncidents(10),
      TelemetryService.getDashboardTelemetry().catch((e) => {
        // Distinguish telemetry simulation failure/provider unavailable from DB crash
        console.error("Telemetry fetching failed but continuing with dashboard load", e);
        return null; // Telemetry is non-critical for basic rendering
      }),
    ]);
  } catch {
    // 3. Database / Infrastructure Failure (for critical incidents/metrics)
    return (
      <Container>
        <PageHeader
          title="Operations Dashboard"
          description="Command Center real-time operational overview."
        />
        <div className="mt-8 p-12 text-center bg-red-50 text-red-700 border border-red-200 rounded-lg">
          <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-red-500" />
          <h2 className="text-lg font-semibold">Service Unavailable</h2>
          <p className="mt-2">
            Unable to connect to the database or retrieve dashboard telemetry. Please try again
            later.
          </p>
        </div>
      </Container>
    );
  }

  // Configurable auto-refresh interval (30 seconds)
  const REFRESH_INTERVAL_MS = 30000;

  // 4. Empty Data State (No incidents ever created)
  if (metrics.totalIncidents === 0 && !telemetry) {
    return (
      <Container>
        <AutoRefresh intervalMs={REFRESH_INTERVAL_MS} />
        <PageHeader
          title="Operations Dashboard"
          description="Command Center real-time operational overview."
        />
        <div className="mt-8 p-12 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <ShieldAlert className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">No Operations Data</h2>
          <p className="mt-2">
            The command center database is currently empty. New incidents will appear here once
            reported.
          </p>
        </div>
      </Container>
    );
  }

  // 5. Populated Data State
  return (
    <Container>
      <AutoRefresh intervalMs={REFRESH_INTERVAL_MS} />
      <PageHeader
        title="Operations Dashboard"
        description="Command Center real-time operational overview."
      />

      <div className="mt-8 space-y-12">
        {/* Incidents Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Incidents</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Incidents"
              value={metrics.totalIncidents}
              icon={<AlertCircle className="h-4 w-4" />}
              description={`${metrics.incidentsCreatedToday} created today`}
            />
            <MetricCard
              title="Open Incidents"
              value={metrics.openIncidents}
              icon={<Clock className="h-4 w-4" />}
              description="Awaiting resolution"
            />
            <MetricCard
              title="Resolved"
              value={metrics.resolvedIncidents}
              icon={<CheckCircle className="h-4 w-4" />}
              description="Successfully closed"
            />
            <MetricCard
              title="Critical Unresolved"
              value={metrics.unresolvedCriticalIncidents}
              icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
              description="Requires immediate attention"
              className={metrics.unresolvedCriticalIncidents > 0 ? "border-red-200 bg-red-50" : ""}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-full lg:col-span-7">
              <IncidentOverviewPanel incidents={recentIncidents} />
            </div>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Telemetry Section */}
        <section className="space-y-6">
          {telemetry ? (
            <TelemetryOverviewPanel telemetry={telemetry} />
          ) : (
            <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              <p>Telemetry data is currently unavailable.</p>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
