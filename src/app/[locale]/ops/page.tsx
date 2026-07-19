import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { requireOps } from "@/lib/auth";
import { DashboardService } from "@/features/dashboard/services/dashboard.service";
import { TelemetryService } from "@/features/telemetry/services/telemetry.service";
import { OperationsAiService } from "@/features/ai/services/operations-ai.service";
import { IncidentService } from "@/features/incident/services/incident.service";
import { AutoRefresh } from "@/components/shared/AutoRefresh";
import { AlertTriangle, Activity, Users, ShieldAlert, CheckCircle } from "lucide-react";
import type { DashboardIncidentStatus, DashboardSeverity } from "@/features/dashboard/types";

import { ReportIncidentButton } from "@/features/incident/components/ReportIncidentButton";
import { IncidentAnalyticsPanel } from "@/features/dashboard/components/IncidentAnalyticsPanel";
import { TelemetryOverviewPanel } from "@/features/dashboard/components/TelemetryOverviewPanel";
import { OperationsCopilotPanel } from "@/features/dashboard/components/OperationsCopilotPanel";
import { OperationalHealthSummary } from "@/features/dashboard/components/OperationalHealthSummary";
import { RecentActivityFeed } from "@/features/dashboard/components/RecentActivityFeed";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function OpsDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await requireOps();
  const { locale } = await params;
  const REFRESH_INTERVAL_MS = 30000;

  // We initiate the promises here to run in parallel
  const metricsPromise = DashboardService.getDashboardMetrics();
  const incidentsPromise = IncidentService.listIncidents();
  const telemetryPromise = TelemetryService.getDashboardTelemetry().catch((e) => {
    console.error("Telemetry fetching failed", e);
    return null;
  });

  return (
    <Container className="space-y-8 pb-12">
      <AutoRefresh intervalMs={REFRESH_INTERVAL_MS} />

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Operations Dashboard</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live Command Center Overview
            <span className="text-xs text-gray-400 ml-2">
              (Updates every {REFRESH_INTERVAL_MS / 1000}s)
            </span>
          </p>
        </div>
        <ReportIncidentButton />
      </div>

      {/* 2. Executive KPIs */}
      <Suspense fallback={<KPIsSkeleton />}>
        <DashboardKPIs metricsPromise={metricsPromise} incidentsPromise={incidentsPromise} />
      </Suspense>

      {/* Main Grid: Operational Intelligence & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Intelligence & Summaries */}
        <div className="lg:col-span-1 space-y-8">
          <Suspense fallback={<HealthSummarySkeleton />}>
            <HealthSummarySection
              metricsPromise={metricsPromise}
              telemetryPromise={telemetryPromise}
            />
          </Suspense>

          <Suspense fallback={<CopilotSkeleton />}>
            <CopilotSection
              incidentsPromise={incidentsPromise}
              telemetryPromise={telemetryPromise}
              locale={locale as Locale}
            />
          </Suspense>

          <Suspense fallback={<ActivitySkeleton />}>
            <ActivitySection incidentsPromise={incidentsPromise} />
          </Suspense>
        </div>

        {/* Right Column: Analytics & Telemetry */}
        <div className="lg:col-span-2 space-y-8">
          <Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsSection incidentsPromise={incidentsPromise} />
          </Suspense>

          <Suspense fallback={<TelemetrySkeleton />}>
            <TelemetrySection telemetryPromise={telemetryPromise} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}

// --- Data Fetching Sub-components ---

async function DashboardKPIs({
  metricsPromise,
  incidentsPromise,
}: {
  metricsPromise: ReturnType<typeof DashboardService.getDashboardMetrics>;
  incidentsPromise: ReturnType<typeof IncidentService.listIncidents>;
}) {
  const [metrics, incidents] = await Promise.all([metricsPromise, incidentsPromise]);

  // Calculate total active assignments across open incidents
  let activeAssignments = 0;
  incidents.forEach((inc) => {
    if (["reported", "verified", "assigned"].includes(inc.status)) {
      activeAssignments += inc.assignments.length;
    }
  });

  if (metrics.totalIncidents === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <ShieldAlert className="h-10 w-10 mx-auto mb-4 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">No Operations Data</h2>
        <p className="mt-2">The command center database is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Active Incidents
          </h3>
          <Activity className="h-5 w-5 text-indigo-500" />
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">{metrics.openIncidents}</p>
        <p className="mt-1 text-sm text-gray-500">Requires resolution</p>
      </div>

      <div
        className={`bg-white p-5 rounded-xl shadow-sm border ${metrics.unresolvedCriticalIncidents > 0 ? "border-red-300 bg-red-50" : "border-gray-200"}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Critical Priority
          </h3>
          <AlertTriangle
            className={`h-5 w-5 ${metrics.unresolvedCriticalIncidents > 0 ? "text-red-500" : "text-gray-400"}`}
          />
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">
          {metrics.unresolvedCriticalIncidents}
        </p>
        <p className="mt-1 text-sm text-gray-500">Highest severity alerts</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Active Assignments
          </h3>
          <Users className="h-5 w-5 text-blue-500" />
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">{activeAssignments}</p>
        <p className="mt-1 text-sm text-gray-500">Personnel currently dispatched</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Resolved Today
          </h3>
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">{metrics.resolvedIncidents}</p>
        <p className="mt-1 text-sm text-gray-500">Total successfully closed</p>
      </div>
    </div>
  );
}

async function HealthSummarySection({
  metricsPromise,
  telemetryPromise,
}: {
  metricsPromise: ReturnType<typeof DashboardService.getDashboardMetrics>;
  telemetryPromise: ReturnType<typeof TelemetryService.getDashboardTelemetry>;
}) {
  const [metrics, telemetry] = await Promise.all([metricsPromise, telemetryPromise]);
  return <OperationalHealthSummary metrics={metrics} telemetry={telemetry} />;
}

async function CopilotSection({
  incidentsPromise,
  telemetryPromise,
  locale,
}: {
  incidentsPromise: ReturnType<typeof IncidentService.listIncidents>;
  telemetryPromise: ReturnType<typeof TelemetryService.getDashboardTelemetry>;
  locale: Locale;
}) {
  const [incidents, telemetry] = await Promise.all([incidentsPromise, telemetryPromise]);

  // Map raw incidents to RecentIncidentDTO for OperationsAiService exactly as it was
  const recentDtos = incidents.slice(0, 10).map((inc) => ({
    id: inc.id,
    title: inc.title,
    status: inc.status as DashboardIncidentStatus,
    severity: inc.severity as DashboardSeverity,
    createdAt: inc.created_at.toISOString(),
    updatedAt: inc.updated_at.toISOString(),
    assignedPersonnel: inc.assignments.map((a) => ({
      id: a.user.id,
      name: a.user.full_name || "Unknown",
    })),
  }));

  const decisionSupport = await OperationsAiService.getDecisionSupport(
    recentDtos,
    telemetry,
    locale,
  );
  return <OperationsCopilotPanel decisionSupport={decisionSupport} />;
}

async function AnalyticsSection({
  incidentsPromise,
}: {
  incidentsPromise: ReturnType<typeof IncidentService.listIncidents>;
}) {
  const incidents = await incidentsPromise;

  // Transform to match IncidentDataAnalytics
  const mapped = incidents.map((inc) => ({
    id: inc.id,
    title: inc.title,
    status: inc.status,
    severity: inc.severity,
    created_at: inc.created_at,
    updated_at: inc.updated_at,
    zone: inc.zone ? { name: inc.zone.name } : null,
    assignments: inc.assignments,
  }));

  return <IncidentAnalyticsPanel incidents={mapped} />;
}

async function ActivitySection({
  incidentsPromise,
}: {
  incidentsPromise: ReturnType<typeof IncidentService.listIncidents>;
}) {
  const incidents = await incidentsPromise;
  const mapped = incidents.map((inc) => ({
    id: inc.id,
    title: inc.title,
    status: inc.status,
    severity: inc.severity,
    created_at: inc.created_at,
    updated_at: inc.updated_at,
    zone: inc.zone ? { name: inc.zone.name } : null,
    assignments: inc.assignments,
  }));
  return <RecentActivityFeed incidents={mapped} />;
}

async function TelemetrySection({
  telemetryPromise,
}: {
  telemetryPromise: ReturnType<typeof TelemetryService.getDashboardTelemetry>;
}) {
  const telemetry = await telemetryPromise;
  if (!telemetry) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">
        <p>Telemetry data is currently unavailable.</p>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <TelemetryOverviewPanel telemetry={telemetry} />
    </div>
  );
}

// --- Skeleton Loaders ---

function KPIsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-100 rounded-xl h-32"></div>
      ))}
    </div>
  );
}

function HealthSummarySkeleton() {
  return <div className="bg-gray-100 rounded-xl h-80 animate-pulse"></div>;
}

function CopilotSkeleton() {
  return <div className="bg-gray-100 rounded-xl h-96 animate-pulse"></div>;
}

function AnalyticsSkeleton() {
  return <div className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>;
}

function ActivitySkeleton() {
  return <div className="bg-gray-100 rounded-xl h-96 animate-pulse"></div>;
}

function TelemetrySkeleton() {
  return <div className="bg-gray-100 rounded-xl h-[500px] animate-pulse"></div>;
}
