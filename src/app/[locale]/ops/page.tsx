import { Suspense, cache } from "react";
import { Container } from "@/components/ui/container";
import { requireOps } from "@/lib/auth";
import { DashboardService } from "@/features/dashboard/services/dashboard.service";
import { TelemetryService } from "@/features/telemetry/services/telemetry.service";
import { OperationsAiService } from "@/features/ai/services/operations-ai.service";
import { IncidentService } from "@/features/incident/services/incident.service";
import { AutoRefresh } from "@/components/shared/AutoRefresh";
import { AlertTriangle, Activity, Users, ShieldAlert, CheckCircle } from "lucide-react";
import type {
  DashboardIncidentStatus,
  DashboardSeverity,
  RecentIncidentDTO,
} from "@/features/dashboard/types";
import type { TelemetryDashboardDto } from "@/features/telemetry/types";

import { ReportIncidentButton } from "@/features/incident/components/ReportIncidentButton";
import { IncidentAnalyticsPanel } from "@/features/dashboard/components/IncidentAnalyticsPanel";
import { TelemetryOverviewPanel } from "@/features/dashboard/components/TelemetryOverviewPanel";
import {
  OperationsCopilotPanel,
  OperationsRecommendationsCard,
} from "@/features/dashboard/components/OperationsCopilotPanel";
import { OperationalHealthSummary } from "@/features/dashboard/components/OperationalHealthSummary";
import { RecentActivityFeed } from "@/features/dashboard/components/RecentActivityFeed";
import { MetricCard } from "@/features/dashboard/components/MetricCard";
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
    <Container size="full" className="max-w-[1600px] space-y-8 pb-12">
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

      {/* 3. Reorganized Rows for Dashboard Layout */}
      <div className="space-y-8">
        {/* Row 2: Health Score (1/3) & Incident Analytics (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1">
            <Suspense fallback={<HealthSummarySkeleton />}>
              <HealthSummarySection
                metricsPromise={metricsPromise}
                telemetryPromise={telemetryPromise}
              />
            </Suspense>
          </div>
          <div className="lg:col-span-2">
            <Suspense fallback={<AnalyticsSkeleton />}>
              <AnalyticsSection incidentsPromise={incidentsPromise} />
            </Suspense>
          </div>
        </div>

        {/* Row 3: Telemetry (2/3) & Executive Briefing (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2">
            <Suspense fallback={<TelemetrySkeleton />}>
              <TelemetrySection telemetryPromise={telemetryPromise} />
            </Suspense>
          </div>
          <div className="lg:col-span-1">
            <Suspense fallback={<CopilotSkeleton />}>
              <BriefingSection
                incidentsPromise={incidentsPromise}
                telemetryPromise={telemetryPromise}
                locale={locale as Locale}
              />
            </Suspense>
          </div>
        </div>

        {/* Row 4: Recent Activity (1/3) & AI Recommendations / Recommended Actions (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1">
            <Suspense fallback={<ActivitySkeleton />}>
              <ActivitySection incidentsPromise={incidentsPromise} />
            </Suspense>
          </div>
          <div className="lg:col-span-2">
            <Suspense fallback={<CopilotSkeleton />}>
              <RecommendationsSection
                incidentsPromise={incidentsPromise}
                telemetryPromise={telemetryPromise}
                locale={locale as Locale}
              />
            </Suspense>
          </div>
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

  // Calculate simple deterministic trends for last 30 minutes
  const now = new Date();
  const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

  const recentActive = incidents.filter(
    (inc) =>
      ["reported", "verified", "assigned"].includes(inc.status) &&
      new Date(inc.created_at) >= thirtyMinsAgo,
  ).length;

  const recentCritical = incidents.filter(
    (inc) =>
      ["reported", "verified", "assigned"].includes(inc.status) &&
      inc.severity === "critical" &&
      new Date(inc.created_at) >= thirtyMinsAgo,
  ).length;

  let recentAssignments = 0;
  incidents.forEach((inc) => {
    inc.assignments.forEach((assign) => {
      if (new Date(assign.assigned_at) >= thirtyMinsAgo) {
        recentAssignments++;
      }
    });
  });

  const recentResolved = incidents.filter(
    (inc) => inc.status === "resolved" && new Date(inc.updated_at) >= thirtyMinsAgo,
  ).length;

  const activeTrend =
    recentActive > 0
      ? {
          value: Math.round((recentActive / Math.max(1, metrics.openIncidents)) * 100),
          label: "new active",
          isPositive: false,
        }
      : undefined;

  const criticalTrend =
    recentCritical > 0
      ? {
          value: Math.round(
            (recentCritical / Math.max(1, metrics.unresolvedCriticalIncidents)) * 100,
          ),
          label: "new critical",
          isPositive: false,
        }
      : undefined;

  const assignmentsTrend =
    recentAssignments > 0
      ? {
          value: Math.round((recentAssignments / Math.max(1, activeAssignments)) * 100),
          label: "recent staff",
          isPositive: true,
        }
      : undefined;

  const resolvedTrend =
    recentResolved > 0
      ? {
          value: Math.round((recentResolved / Math.max(1, metrics.resolvedIncidents)) * 100),
          label: "recent closed",
          isPositive: true,
        }
      : undefined;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Incidents"
        value={metrics.openIncidents}
        icon={<Activity className="h-5 w-5 text-indigo-500" />}
        trend={activeTrend}
        description="Requires resolution"
        status={metrics.openIncidents > 5 ? "warning" : "info"}
      />

      <MetricCard
        title="Critical Priority"
        value={metrics.unresolvedCriticalIncidents}
        icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        trend={criticalTrend}
        description="Highest severity alerts"
        status={metrics.unresolvedCriticalIncidents > 0 ? "danger" : "neutral"}
      />

      <MetricCard
        title="Active Assignments"
        value={activeAssignments}
        icon={<Users className="h-5 w-5 text-blue-500" />}
        trend={assignmentsTrend}
        description="Personnel currently dispatched"
        status="neutral"
      />

      <MetricCard
        title="Resolved Today"
        value={metrics.resolvedIncidents}
        icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
        trend={resolvedTrend}
        description="Total successfully closed"
        status="success"
      />
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

const getCachedDecisionSupport = cache(
  async (
    recentDtos: RecentIncidentDTO[],
    telemetry: TelemetryDashboardDto | null,
    locale: Locale,
  ) => {
    return OperationsAiService.getDecisionSupport(recentDtos, telemetry, locale);
  },
);

async function BriefingSection({
  incidentsPromise,
  telemetryPromise,
  locale,
}: {
  incidentsPromise: ReturnType<typeof IncidentService.listIncidents>;
  telemetryPromise: ReturnType<typeof TelemetryService.getDashboardTelemetry>;
  locale: Locale;
}) {
  const [incidents, telemetry] = await Promise.all([incidentsPromise, telemetryPromise]);

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

  const decisionSupport = await getCachedDecisionSupport(recentDtos, telemetry, locale);
  return <OperationsCopilotPanel decisionSupport={decisionSupport} />;
}

async function RecommendationsSection({
  incidentsPromise,
  telemetryPromise,
  locale,
}: {
  incidentsPromise: ReturnType<typeof IncidentService.listIncidents>;
  telemetryPromise: ReturnType<typeof TelemetryService.getDashboardTelemetry>;
  locale: Locale;
}) {
  const [incidents, telemetry] = await Promise.all([incidentsPromise, telemetryPromise]);

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

  const decisionSupport = await getCachedDecisionSupport(recentDtos, telemetry, locale);
  return <OperationsRecommendationsCard decisionSupport={decisionSupport} />;
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
