"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3 } from "lucide-react";

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
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={<BarChart3 className="h-12 w-12" aria-hidden="true" />}
            title="No incidents found"
            description="There is no incident data for analytics."
          />
        </CardContent>
      </Card>
    );
  }

  const renderSeverityStackedBar = () => {
    const total = severityData.reduce((sum, item) => sum + item.count, 0);
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          By Severity
        </h3>
        {total === 0 ? (
          <p className="text-xs text-gray-400 italic">No data</p>
        ) : (
          <div className="space-y-4">
            <div className="w-full h-4 bg-gray-100 rounded-full flex overflow-hidden shadow-inner">
              {severityData.map((item) => {
                const pct = total > 0 ? (item.count / total) * 100 : 0;
                if (pct === 0) return null;
                return (
                  <div
                    key={item.label}
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                    title={`${item.label}: ${item.count} (${Math.round(pct)}%)`}
                    role="img"
                    aria-label={`${item.label} incidents: ${item.count}`}
                  />
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {severityData.map((item) => {
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                return (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-gray-400 ml-auto font-mono font-semibold">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStatusVerticalBarChart = () => {
    const maxVal = Math.max(...statusData.map((d) => d.count), 1);
    const total = statusData.reduce((sum, item) => sum + item.count, 0);
    return (
      <div className="flex flex-col space-y-4 h-full">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">By Status</h3>
        {total === 0 ? (
          <p className="text-xs text-gray-400 italic">No data</p>
        ) : (
          <div className="flex flex-col justify-between flex-1 min-h-[140px]">
            <div className="flex items-end justify-between h-24 gap-2 px-2 mt-2">
              {statusData.map((item) => {
                const heightPct = (item.count / maxVal) * 80 + 10;
                return (
                  <div
                    key={item.label}
                    className="flex flex-col items-center flex-1 group relative h-full justify-end"
                  >
                    <div className="absolute -top-6 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-mono">
                      {item.count}
                    </div>
                    <div
                      className={`w-full rounded-t-md ${item.color} transition-all duration-500 ease-out origin-bottom`}
                      style={{ height: `${item.count === 0 ? 0 : heightPct}%` }}
                      role="img"
                      aria-label={`${item.label} status count: ${item.count}`}
                    />
                    <span className="text-[10px] font-medium text-gray-500 uppercase mt-2 truncate w-full text-center">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] text-gray-400 text-center font-mono mt-2 select-none">
              Total active incidents: {total}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderZonesHorizontalProgress = () => {
    const total = zoneData.reduce((sum, item) => sum + item.count, 0);
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Top Zones</h3>
        {zoneData.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No data</p>
        ) : (
          <div className="space-y-3">
            {zoneData.map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span className="truncate">{item.label}</span>
                    <span className="font-mono">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.count === 0 ? 0 : Math.max(item.width, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {renderSeverityStackedBar()}
          {renderStatusVerticalBarChart()}
          {renderZonesHorizontalProgress()}
        </div>
      </CardContent>
    </Card>
  );
}
