"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Matching the shape returned by IncidentService.listIncidents() (and IncidentDataTable)
export interface IncidentDataAnalytics {
  id: string;
  title: string;
  status: string;
  severity: string;
  created_at: Date;
  updated_at: Date;
  zone: { name: string } | null;
  assignments: { user: { full_name: string | null } }[];
}

interface IncidentAnalyticsPanelProps {
  incidents: IncidentDataAnalytics[];
}

export function IncidentAnalyticsPanel({ incidents }: IncidentAnalyticsPanelProps) {
  const { severityData, statusData, zoneData } = useMemo(() => {
    const sevMap: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    const statMap: Record<string, number> = {
      reported: 0,
      verified: 0,
      assigned: 0,
      resolved: 0,
      closed: 0,
    };
    const zMap: Record<string, number> = {};

    incidents.forEach((inc) => {
      if (sevMap[inc.severity] !== undefined) sevMap[inc.severity]++;
      if (statMap[inc.status] !== undefined) statMap[inc.status]++;

      const zName = inc.zone?.name || "Unknown";
      zMap[zName] = (zMap[zName] || 0) + 1;
    });

    const maxSev = Math.max(...Object.values(sevMap), 1);
    const maxStat = Math.max(...Object.values(statMap), 1);

    // Convert maps to arrays for rendering
    const sData = [
      {
        label: "Critical",
        count: sevMap.critical,
        color: "bg-red-500",
        width: (sevMap.critical / maxSev) * 100,
      },
      {
        label: "High",
        count: sevMap.high,
        color: "bg-orange-500",
        width: (sevMap.high / maxSev) * 100,
      },
      {
        label: "Medium",
        count: sevMap.medium,
        color: "bg-amber-400",
        width: (sevMap.medium / maxSev) * 100,
      },
      {
        label: "Low",
        count: sevMap.low,
        color: "bg-green-500",
        width: (sevMap.low / maxSev) * 100,
      },
    ];

    const stData = [
      {
        label: "Reported",
        count: statMap.reported,
        color: "bg-gray-400",
        width: (statMap.reported / maxStat) * 100,
      },
      {
        label: "Verified",
        count: statMap.verified,
        color: "bg-blue-400",
        width: (statMap.verified / maxStat) * 100,
      },
      {
        label: "Assigned",
        count: statMap.assigned,
        color: "bg-indigo-500",
        width: (statMap.assigned / maxStat) * 100,
      },
      {
        label: "Resolved",
        count: statMap.resolved,
        color: "bg-emerald-500",
        width: (statMap.resolved / maxStat) * 100,
      },
      {
        label: "Closed",
        count: statMap.closed,
        color: "bg-teal-600",
        width: (statMap.closed / maxStat) * 100,
      },
    ];

    const sortedZones = Object.entries(zMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 zones

    const maxZ = Math.max(...sortedZones.map((z) => z[1]), 1);
    const zData = sortedZones.map(([name, count]) => ({
      label: name,
      count,
      color: "bg-indigo-400",
      width: (count / maxZ) * 100,
    }));

    return { severityData: sData, statusData: stData, zoneData: zData };
  }, [incidents]);

  if (incidents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
        <p>No incidents available for analytics.</p>
      </div>
    );
  }

  const renderBarChart = (
    title: string,
    data: { label: string; count: number; color: string; width: number }[],
  ) => (
    <Card className="shadow-none border-none">
      <CardHeader className="px-0 pt-0 pb-3">
        <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0 space-y-3">
        {data.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-gray-700">
              <span>{item.label}</span>
              <span>{item.count}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${item.count === 0 ? 0 : Math.max(item.width, 2)}%` }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-xs text-gray-400 italic">No data</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h2 className="text-base font-bold text-gray-900 mb-5">Incident Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {renderBarChart("By Severity", severityData)}
        {renderBarChart("By Status", statusData)}
        {renderBarChart("Top Zones", zoneData)}
      </div>
    </div>
  );
}
