import { CheckCircle2, Clock, AlertCircle, UserPlus } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "reported" | "assigned" | "updated" | "resolved" | "closed";
  title: string;
  description?: string;
  timestamp: Date;
}

interface IncidentTimelineProps {
  incident: {
    id: string;
    created_at: Date;
    updated_at: Date;
    closed_at?: Date | null;
    status: string;
    assignments: {
      id: string;
      user: { full_name: string | null };
      assigned_at: Date;
    }[];
  };
}

export function IncidentTimeline({ incident }: IncidentTimelineProps) {
  // 1. Generate events
  const events: TimelineEvent[] = [];

  // Reported event
  events.push({
    id: `reported-${incident.id}`,
    type: "reported",
    title: "Incident Reported",
    timestamp: incident.created_at,
  });

  // Assignment events
  incident.assignments.forEach((assignment) => {
    events.push({
      id: `assigned-${assignment.id}`,
      type: "assigned",
      title: "Personnel Assigned",
      description: assignment.user.full_name
        ? `Assigned to ${assignment.user.full_name}`
        : "Assigned to unknown user",
      timestamp: assignment.assigned_at,
    });
  });

  // Generic Update event (only if updated_at is meaningfully different from created_at and there are no other events overriding it)
  // For simplicity, if updated_at > created_at by at least 1 minute, and we're not closed yet
  const diffMs = incident.updated_at.getTime() - incident.created_at.getTime();
  if (diffMs > 60000 && incident.status !== "resolved" && incident.status !== "closed") {
    // Check if we already have an assignment event around this time to avoid redundancy
    const hasRecentAssignment = incident.assignments.some(
      (a) => Math.abs(a.assigned_at.getTime() - incident.updated_at.getTime()) < 60000,
    );
    if (!hasRecentAssignment) {
      events.push({
        id: `updated-${incident.id}`,
        type: "updated",
        title: "Status Updated",
        timestamp: incident.updated_at,
      });
    }
  }

  // Resolved / Closed
  if (incident.status === "resolved") {
    events.push({
      id: `resolved-${incident.id}`,
      type: "resolved",
      title: "Incident Resolved",
      timestamp: incident.updated_at,
    });
  }

  if (incident.closed_at || incident.status === "closed") {
    const closedDate = incident.closed_at || incident.updated_at;
    events.push({
      id: `closed-${incident.id}`,
      type: "closed",
      title: "Incident Closed",
      timestamp: closedDate,
    });
  }

  // 2. Sort events chronologically (oldest first)
  events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed text-sm">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;

          let icon;
          let iconBg = "bg-blue-500";

          switch (event.type) {
            case "reported":
              icon = <AlertCircle className="h-3 w-3 text-white" />;
              iconBg = "bg-indigo-500";
              break;
            case "assigned":
              icon = <UserPlus className="h-3 w-3 text-white" />;
              iconBg = "bg-blue-500";
              break;
            case "updated":
              icon = <Clock className="h-3 w-3 text-white" />;
              iconBg = "bg-gray-400";
              break;
            case "resolved":
            case "closed":
              icon = <CheckCircle2 className="h-3 w-3 text-white" />;
              iconBg = "bg-green-500";
              break;
          }

          return (
            <div
              key={event.id}
              className={`relative ${!isLast && incident.status === "closed" ? "opacity-60" : ""}`}
            >
              <div
                className={`absolute -left-[21px] mt-1 h-5 w-5 rounded-full ring-4 ring-white flex items-center justify-center ${iconBg}`}
              >
                {icon}
              </div>
              <div className="ml-6">
                <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {event.timestamp.toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
