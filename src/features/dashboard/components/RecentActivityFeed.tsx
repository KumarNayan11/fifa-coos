"use client";

import { useMemo } from "react";
import { IncidentDataAnalytics } from "./IncidentAnalyticsPanel";
import { AlertCircle, CheckCircle, Clock, ShieldAlert, UserPlus, Info } from "lucide-react";

interface RecentActivityFeedProps {
  incidents: IncidentDataAnalytics[];
}

export function RecentActivityFeed({ incidents }: RecentActivityFeedProps) {
  const feedItems = useMemo(() => {
    // We want to generate an activity feed. The simplest deterministic way
    // is to look at the most recently updated incidents and describe their current state.

    // Sort by updated_at descending
    const sorted = [...incidents].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

    // Take top 8
    const recent = sorted.slice(0, 8);

    return recent.map((inc) => {
      let icon = <Info className="h-4 w-4 text-blue-500" />;
      let title = `Incident ${inc.status}`;
      let description = inc.title;

      switch (inc.status) {
        case "reported":
          icon = <AlertCircle className="h-4 w-4 text-gray-500" />;
          title = "New Incident Reported";
          break;
        case "verified":
          icon = <ShieldAlert className="h-4 w-4 text-amber-500" />;
          title = "Incident Verified";
          break;
        case "assigned":
          icon = <UserPlus className="h-4 w-4 text-indigo-500" />;
          const assignees = inc.assignments
            .map((a) => a.user.full_name)
            .filter(Boolean)
            .join(", ");
          title = "Personnel Assigned";
          if (assignees) {
            description = `${inc.title} assigned to ${assignees}`;
          }
          break;
        case "resolved":
          icon = <CheckCircle className="h-4 w-4 text-emerald-500" />;
          title = "Incident Resolved";
          break;
        case "closed":
          icon = <CheckCircle className="h-4 w-4 text-teal-600" />;
          title = "Incident Closed";
          break;
      }

      // If severity is critical and it's new/verified, make it pop more
      if (inc.severity === "critical" && ["reported", "verified"].includes(inc.status)) {
        icon = <ShieldAlert className="h-4 w-4 text-red-500" />;
      }

      return {
        id: `${inc.id}-${inc.status}`,
        incidentId: inc.id,
        timestamp: new Date(inc.updated_at),
        icon,
        title,
        description,
      };
    });
  }, [incidents]);

  if (feedItems.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Recent Activity
        </h2>
      </div>
      <div className="p-0">
        <ul className="divide-y divide-gray-100">
          {feedItems.map((item) => (
            <li key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 truncate" title={item.description}>
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    <span className="font-mono">{item.incidentId.slice(0, 8)}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
