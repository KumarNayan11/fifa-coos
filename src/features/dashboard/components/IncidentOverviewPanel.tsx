import { RecentIncidentDTO } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface IncidentOverviewPanelProps {
  incidents: RecentIncidentDTO[];
}

export function IncidentOverviewPanel({ incidents }: IncidentOverviewPanelProps) {
  if (incidents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
            No recent incidents to display.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Title
                </th>
                <th scope="col" className="px-4 py-3">
                  Severity
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Created
                </th>
                <th scope="col" className="px-4 py-3">
                  Assigned To
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-xs">
                    {incident.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getSeverityVariant(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="capitalize">
                      {incident.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(incident.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {incident.assignedPersonnel.length > 0 ? (
                      incident.assignedPersonnel.map((p) => p.name).join(", ")
                    ) : (
                      <span className="italic text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/ops/incidents/${incident.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function getSeverityVariant(severity: string) {
  switch (severity) {
    case "critical":
      return "destructive";
    case "high":
      return "destructive"; // if we had a warning variant, we'd use it
    case "medium":
      return "secondary";
    default:
      return "default";
  }
}
