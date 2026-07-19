import { notFound } from "next/navigation";
import { requireOps } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { IncidentService } from "@/features/incident/services/incident.service";
import { TelemetryService } from "@/features/telemetry/services/telemetry.service";
import { getUsers } from "@/features/incident/actions";
import { OperationsAiService } from "@/features/ai/services/operations-ai.service";
import { IncidentActionsPanel } from "@/features/incident/components/IncidentActionsPanel";
import { Brain, MapPin, Clock, Calendar, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BackButton } from "@/components/shared/BackButton";

import { IncidentTimeline } from "@/features/incident/components/IncidentTimeline";
import { RelatedTelemetryPanel } from "@/features/incident/components/RelatedTelemetryPanel";
import { AssignmentContextPanel } from "@/features/incident/components/AssignmentContextPanel";
import { CopyIdButton } from "@/components/shared/CopyIdButton";

export default async function IncidentDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  await requireOps();
  const unwrappedParams = await params;

  // 1. Fetch Incident Data
  let incident;
  try {
    incident = await IncidentService.getIncident(unwrappedParams.id);
  } catch {
    notFound();
  }

  // 2. Fetch Users (for assignment panel dropdowns if needed by IncidentActionsPanel)
  const usersRes = await getUsers();
  const users = usersRes.success && usersRes.data ? usersRes.data : [];
  const mappedUsers = users.map((u) => ({
    id: u.id,
    name: u.full_name || "Unknown",
    role: u.role,
  }));

  // 3. Fetch AI Support (preserving exact existing behavior)
  const formattedIncident = {
    id: incident.id,
    title: incident.title,
    severity: incident.severity as "low" | "medium" | "high" | "critical",
    status: incident.status as "reported" | "assigned" | "resolved" | "closed",
    zoneId: incident.zone_id,
    zoneName: incident.zone?.name || "Unknown",
    createdAt: incident.created_at.toISOString(),
    updatedAt: (incident.updated_at || incident.created_at).toISOString(),
    assignedPersonnel: incident.assignments.map(
      (a: { user: { id: string; full_name: string | null; role: string } }) => ({
        id: a.user.id,
        name: a.user.full_name || "Unknown User",
        role: a.user.role,
      }),
    ),
  };

  const aiSupport = await OperationsAiService.getDecisionSupport(
    [formattedIncident],
    null,
    unwrappedParams.locale as "en" | "es" | "fr" | "hi", // fallback cast
  );

  // 4. Fetch Telemetry & Filter for Zone (without new backend logic)
  let dashboardTelemetry = null;
  try {
    dashboardTelemetry = await TelemetryService.getDashboardTelemetry();
  } catch (error) {
    // Fail gracefully as per requirements
    console.error("Failed to load telemetry for incident page", error);
  }

  const zoneTelemetry = dashboardTelemetry?.zones.find((z) => z.zoneId === incident.zone_id);
  const poiTelemetry = dashboardTelemetry?.pois.filter((p) => p.zoneId === incident.zone_id) || [];

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "reported":
        return "secondary";
      case "assigned":
        return "info";
      case "resolved":
        return "success";
      case "closed":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Container className="space-y-6 pb-12">
      {/* Header Area */}
      <div className="space-y-4 pt-4">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/ops" },
            { label: "Incidents", href: "/ops/incidents" },
            { label: incident.id.slice(0, 8) },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton href="/ops/incidents" label="Back to Incidents" />
          <CopyIdButton idToCopy={incident.id} />
        </div>
      </div>

      <PageHeader
        title={`Incident: ${incident.title}`}
        description={`Manage operational response and view full situational context.`}
      />

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* LEFT COLUMN: Primary Context */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
                  <p className="text-sm font-mono text-gray-500 mt-1">ID: {incident.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={getSeverityVariant(incident.severity)}
                    className="px-3 py-1 text-sm uppercase"
                  >
                    {incident.severity}
                  </Badge>
                  <Badge
                    variant={getStatusVariant(incident.status)}
                    className="px-3 py-1 text-sm capitalize"
                  >
                    {incident.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Description
                </h3>
                <p className="whitespace-pre-wrap">{incident.description}</p>
              </div>
            </div>
          </div>

          {/* AI Operational Intelligence */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-sm border border-indigo-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-indigo-100 bg-white/50 flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-indigo-900">AI Operational Intelligence</h2>
            </div>
            <div className="p-6">
              {aiSupport ? (
                <div className="space-y-5">
                  <div className="bg-white p-4 rounded-md shadow-sm border border-indigo-50">
                    <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">
                      Analysis
                    </h3>
                    <p className="text-sm text-indigo-900 leading-relaxed">{aiSupport.reasoning}</p>
                  </div>

                  {aiSupport.recommendedActions.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">
                        Top Recommendation
                      </h3>
                      <div className="bg-indigo-600 text-white p-4 rounded-md shadow-sm flex justify-between items-center gap-4">
                        <span className="font-medium">{aiSupport.recommendedActions[0]}</span>
                        <Badge
                          variant="secondary"
                          className="bg-indigo-700/50 text-indigo-50 hover:bg-indigo-700/50 whitespace-nowrap"
                        >
                          {aiSupport.confidenceScore}% Conf
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShieldCheck className="h-8 w-8 text-indigo-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-indigo-900">AI Analysis Unavailable</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    Copilot is currently analyzing other operational streams.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Context Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Assignment Context</h2>
            </div>
            <div className="p-6">
              <AssignmentContextPanel assignments={incident.assignments} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="space-y-6">
          {/* Operational Snapshot */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Operational Snapshot</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {incident.zone?.name || incident.zone_id}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Reported At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(incident.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(incident.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <IncidentActionsPanel incident={incident} users={mappedUsers} />
              </div>
            </div>
          </div>

          {/* Related Telemetry */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Related Telemetry</h2>
            </div>
            <div className="p-5 bg-gray-50/50">
              <RelatedTelemetryPanel zoneTelemetry={zoneTelemetry} poiTelemetry={poiTelemetry} />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Activity Timeline</h2>
            </div>
            <div className="p-5">
              <IncidentTimeline incident={incident} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
