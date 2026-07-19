import { prisma } from "@/lib/prisma";
import {
  DashboardMetricsDTO,
  RecentIncidentDTO,
  DashboardSeverity,
  DashboardIncidentStatus,
} from "../types";
import { Severity, IncidentStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";

export class DashboardService {
  static async getDashboardMetrics(): Promise<DashboardMetricsDTO> {
    const fetchMetrics = unstable_cache(
      async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
          totalIncidents,
          openIncidents,
          resolvedIncidents,
          incidentsCreatedToday,
          unresolvedCriticalIncidents,
          severityGroups,
        ] = await Promise.all([
          prisma.incident.count(),
          prisma.incident.count({
            where: { status: { notIn: [IncidentStatus.resolved, IncidentStatus.closed] } },
          }),
          prisma.incident.count({
            where: { status: IncidentStatus.resolved },
          }),
          prisma.incident.count({
            where: { created_at: { gte: today } },
          }),
          prisma.incident.count({
            where: {
              severity: Severity.critical,
              status: { notIn: [IncidentStatus.resolved, IncidentStatus.closed] },
            },
          }),
          prisma.incident.groupBy({
            by: ["severity"],
            _count: { id: true },
          }),
        ]);

        // Ensure all severities are represented even if count is 0
        const severityMap = new Map(severityGroups.map((g) => [g.severity, g._count.id]));
        const incidentsBySeverity = [
          Severity.low,
          Severity.medium,
          Severity.high,
          Severity.critical,
        ].map((severity) => ({
          severity: severity as DashboardSeverity,
          count: severityMap.get(severity) || 0,
        }));

        return {
          totalIncidents,
          openIncidents,
          resolvedIncidents,
          incidentsCreatedToday,
          unresolvedCriticalIncidents,
          incidentsBySeverity,
        };
      },
      ["dashboard-metrics"],
      { revalidate: 15, tags: ["dashboard-metrics"] },
    );

    return fetchMetrics();
  }

  static async getRecentIncidents(limit = 10): Promise<RecentIncidentDTO[]> {
    const incidents = await prisma.incident.findMany({
      orderBy: { created_at: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        status: true,
        severity: true,
        created_at: true,
        updated_at: true,
        assignments: {
          select: {
            user: {
              select: {
                id: true,
                full_name: true,
              },
            },
          },
        },
      },
    });

    return incidents.map((inc) => ({
      id: inc.id,
      title: inc.title,
      status: inc.status as DashboardIncidentStatus,
      severity: inc.severity as DashboardSeverity,
      createdAt: inc.created_at.toISOString(),
      updatedAt: inc.updated_at.toISOString(),
      assignedPersonnel: inc.assignments
        .filter((a) => a.user !== null)
        .map((a) => ({
          id: a.user!.id,
          name: a.user!.full_name || "Unknown User",
        })),
    }));
  }
}
