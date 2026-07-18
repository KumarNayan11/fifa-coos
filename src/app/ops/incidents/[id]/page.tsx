import { notFound } from "next/navigation";
import { requireOps } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { IncidentService } from "@/features/incident/services/incident.service";
import { getUsers } from "@/features/incident/actions";
import { OperationsAiService } from "@/features/ai/services/operations-ai.service";
import { IncidentActionsPanel } from "@/features/incident/components/IncidentActionsPanel";
import { Brain } from "lucide-react";

export default async function IncidentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOps();
  const unwrappedParams = await params;

  let incident;
  try {
    incident = await IncidentService.getIncident(unwrappedParams.id);
  } catch {
    notFound();
  }

  const usersRes = await getUsers();
  const users = usersRes.success && usersRes.data ? usersRes.data : [];

  const formattedIncident = {
    id: incident.id,
    title: incident.title,
    severity: incident.severity as "low" | "medium" | "high" | "critical",
    status: incident.status as "reported" | "assigned" | "resolved" | "closed",
    zoneId: incident.zone_id,
    zoneName: incident.zone?.name || "Unknown",
    createdAt: incident.created_at,
    updatedAt: incident.updated_at || incident.created_at,
    assignedPersonnel: incident.assignments.map(
      (a: { user: { id: string; name: string; role: string } }) => ({
        id: a.user.id,
        name: a.user.name,
        role: a.user.role,
      }),
    ),
  };

  const aiSupport = await OperationsAiService.getDecisionSupport([formattedIncident], null);

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

  return (
    <Container>
      <PageHeader title={`Incident: ${incident.title}`} description={`ID: ${incident.id}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Details</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{incident.description}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge variant={getSeverityVariant(incident.severity)} className="text-sm">
                  {incident.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="capitalize text-sm">
                  {incident.status.replace("_", " ")}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
              <div>
                <span className="font-medium block text-gray-900">Location</span>
                {incident.zone?.name || incident.zone_id}
              </div>
              <div>
                <span className="font-medium block text-gray-900">Reported At</span>
                {new Date(incident.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
              <div className="relative">
                <div className="absolute -left-3.5 mt-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                <div className="ml-6">
                  <h4 className="text-sm font-semibold text-gray-900">Reported</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(incident.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className={`relative ${incident.status === "reported" ? "opacity-40" : ""}`}>
                <div
                  className={`absolute -left-3.5 mt-1.5 h-3 w-3 rounded-full ring-4 ring-white ${incident.status !== "reported" ? "bg-blue-500" : "bg-gray-300"}`}
                ></div>
                <div className="ml-6">
                  <h4 className="text-sm font-semibold text-gray-900">Assigned</h4>
                  {incident.status !== "reported" && incident.assignments.length > 0 ? (
                    <p className="text-sm text-gray-500">
                      Assigned to{" "}
                      {incident.assignments
                        .map((a: { user: { name: string } }) => a.user.name)
                        .join(", ")}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Awaiting assignment</p>
                  )}
                </div>
              </div>

              <div
                className={`relative ${incident.status !== "resolved" && incident.status !== "closed" ? "opacity-40" : ""}`}
              >
                <div
                  className={`absolute -left-3.5 mt-1.5 h-3 w-3 rounded-full ring-4 ring-white ${incident.status === "resolved" || incident.status === "closed" ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                <div className="ml-6">
                  <h4 className="text-sm font-semibold text-gray-900">Resolved</h4>
                  {incident.status === "resolved" || incident.status === "closed" ? (
                    <p className="text-sm text-gray-500">Incident marked as resolved.</p>
                  ) : (
                    <p className="text-sm text-gray-500">Awaiting resolution</p>
                  )}
                </div>
              </div>

              <div className={`relative ${incident.status !== "closed" ? "opacity-40" : ""}`}>
                <div
                  className={`absolute -left-3.5 mt-1.5 h-3 w-3 rounded-full ring-4 ring-white ${incident.status === "closed" ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                <div className="ml-6">
                  <h4 className="text-sm font-semibold text-gray-900">Closed</h4>
                  {incident.closed_at ? (
                    <p className="text-sm text-gray-500">
                      {new Date(incident.closed_at).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Awaiting final closure</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <IncidentActionsPanel incident={incident} users={users} />

          <div className="bg-indigo-50 rounded-lg shadow-sm border border-indigo-100 p-5">
            <div className="flex items-center gap-2 mb-4 text-indigo-900">
              <Brain className="h-5 w-5" />
              <h3 className="text-lg font-semibold">AI Copilot Review</h3>
            </div>

            {aiSupport ? (
              <div className="space-y-4">
                <p className="text-sm text-indigo-900 bg-white p-3 rounded border border-indigo-50">
                  {aiSupport.summary}
                </p>

                {aiSupport.recommendedActions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
                      Top Recommendation
                    </h4>

                    <div className="bg-white p-3 rounded border border-indigo-100 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-gray-900">
                          {aiSupport.recommendedActions[0].action}
                        </span>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                          {Math.round(aiSupport.recommendedActions[0].confidence * 100)}% Conf
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Reasoning:</span>{" "}
                        {aiSupport.recommendedActions[0].reasoning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-indigo-700 bg-white p-4 rounded text-center border border-indigo-100">
                AI analysis is currently unavailable.
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
