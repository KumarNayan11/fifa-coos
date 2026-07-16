export type DashboardSeverity = "low" | "medium" | "high" | "critical";
export type DashboardIncidentStatus = "reported" | "verified" | "assigned" | "resolved" | "closed";

export interface DashboardMetricsDTO {
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  incidentsCreatedToday: number;
  unresolvedCriticalIncidents: number;
  incidentsBySeverity: {
    severity: DashboardSeverity;
    count: number;
  }[];
}

export interface RecentIncidentDTO {
  id: string;
  title: string;
  status: DashboardIncidentStatus;
  severity: DashboardSeverity;
  createdAt: string;
  updatedAt: string;
  assignedPersonnel: {
    id: string;
    name: string;
  }[];
}
