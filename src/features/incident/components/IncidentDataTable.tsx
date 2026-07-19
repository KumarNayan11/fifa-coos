"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Copy, Check, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

// We use any here because importing Prisma types into a client component
// can sometimes cause issues if not done purely as a type.
// A better way is to define an interface that matches the expected data.
export interface IncidentData {
  id: string;
  title: string;
  status: string;
  severity: string;
  created_at: Date;
  updated_at: Date;
  zone: { name: string } | null;
  assignments: { user: { full_name: string | null } }[];
}

interface IncidentDataTableProps {
  incidents: IncidentData[];
}

export function IncidentDataTable({ incidents }: IncidentDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Clear copied state after 2 seconds
  useEffect(() => {
    if (!copiedId) return;
    const timeout = setTimeout(() => setCopiedId(null), 2000);
    return () => clearTimeout(timeout);
  }, [copiedId]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
  };

  // Dynamically extract unique zones for the filter
  const uniqueZones = useMemo(() => {
    const zones = new Set<string>();
    incidents.forEach((inc) => {
      if (inc.zone?.name) zones.add(inc.zone.name);
    });
    return Array.from(zones).sort();
  }, [incidents]);

  // Derived state: Filtered and Sorted Incidents
  const filteredAndSortedIncidents = useMemo(() => {
    let result = [...incidents];

    // 1. Search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (inc) =>
          inc.title.toLowerCase().includes(lowerQuery) ||
          inc.id.toLowerCase().includes(lowerQuery) ||
          inc.zone?.name?.toLowerCase().includes(lowerQuery),
      );
    }

    // 2. Filters
    if (statusFilter !== "all") {
      result = result.filter((inc) => inc.status === statusFilter);
    }
    if (severityFilter !== "all") {
      result = result.filter((inc) => inc.severity === severityFilter);
    }
    if (zoneFilter !== "all") {
      result = result.filter((inc) => inc.zone?.name === zoneFilter);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "recently_updated":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case "highest_severity": {
          const sevMap: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
          return (sevMap[b.severity] || 0) - (sevMap[a.severity] || 0);
        }
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [incidents, searchQuery, statusFilter, severityFilter, zoneFilter, sortBy]);

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"; // Solid red
      case "high":
        return "destructive"; // Solid red (shadcn default only has destructive)
      case "medium":
        return "warning"; // Amber
      case "low":
      default:
        return "default";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "reported":
        return "secondary";
      case "verified":
      case "assigned":
        return "info";
      case "resolved":
      case "closed":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search by ID, title, or zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            aria-label="Search incidents"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400 hidden sm:block" aria-hidden="true" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by Status"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="verified">Verified</option>
              <option value="assigned">Assigned</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by Severity"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by Zone"
          >
            <option value="all">All Zones</option>
            {uniqueZones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm font-medium bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Sort Incidents"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_severity">Highest Severity</option>
            <option value="recently_updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Incident ID
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Zone
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Severity
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Assigned
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Created / Updated
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-semibold sticky right-0 bg-gray-50 text-right shadow-[-4px_0_10px_rgba(0,0,0,0.02)]"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedIncidents.length > 0 ? (
                filteredAndSortedIncidents.map((incident) => (
                  <tr key={incident.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {incident.id.slice(0, 8)}
                    </td>
                    <td
                      className="px-6 py-4 font-medium text-gray-900 truncate max-w-[250px]"
                      title={incident.title}
                    >
                      {incident.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{incident.zone?.name || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getSeverityVariant(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(incident.status)} className="capitalize">
                        {incident.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[150px]">
                      {incident.assignments.length > 0 ? (
                        incident.assignments
                          .map((a) => a.user.full_name)
                          .filter(Boolean)
                          .join(", ")
                      ) : (
                        <span className="italic text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex flex-col">
                        <span>
                          {new Date(incident.created_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs text-gray-400">
                          Upd:{" "}
                          {new Date(incident.updated_at).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-gray-50 shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyId(incident.id)}
                          className="h-8 px-2 text-gray-500 hover:text-indigo-600"
                          title="Copy Full ID"
                        >
                          {copiedId === incident.id ? (
                            <Check className="h-4 w-4 text-green-500" aria-label="Copied" />
                          ) : (
                            <Copy className="h-4 w-4" aria-label="Copy ID" />
                          )}
                        </Button>
                        <Link
                          href={`/ops/incidents/${incident.id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
                        >
                          Inspect
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6">
                    <EmptyState
                      icon={<Search className="h-12 w-12" aria-hidden="true" />}
                      title="No results found"
                      description="Try adjusting your search query or removing filters."
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setSeverityFilter("all");
                            setZoneFilter("all");
                          }}
                        >
                          Clear all filters
                        </Button>
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
