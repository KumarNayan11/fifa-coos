import { User, Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignmentContextPanelProps {
  assignments: {
    id: string;
    assigned_at: Date;
    user: {
      id: string;
      full_name: string | null;
      role: string;
    };
  }[];
}

export function AssignmentContextPanel({ assignments }: AssignmentContextPanelProps) {
  if (assignments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed flex flex-col items-center">
        <ShieldAlert className="h-6 w-6 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-900">No personnel assigned</p>
        <p className="text-xs mt-1">This incident is currently awaiting assignment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start gap-3 hover:border-gray-300 transition-colors"
        >
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 border",
              assignment.user.role === "medical" && "bg-red-50 border-red-100 text-red-600",
              assignment.user.role === "security" && "bg-amber-50 border-amber-100 text-amber-600",
              assignment.user.role === "ops_manager" &&
                "bg-indigo-50 border-indigo-100 text-indigo-600",
              assignment.user.role === "volunteer" && "bg-blue-50 border-blue-100 text-blue-600",
              !["medical", "security", "ops_manager", "volunteer"].includes(assignment.user.role) &&
                "bg-gray-50 border-gray-100 text-gray-600",
            )}
          >
            <User className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              {assignment.user.full_name || "Unknown User"}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
                  assignment.user.role === "medical" && "bg-red-50 text-red-700 ring-red-600/10",
                  assignment.user.role === "security" &&
                    "bg-amber-50 text-amber-700 ring-amber-600/10",
                  assignment.user.role === "ops_manager" &&
                    "bg-indigo-50 text-indigo-700 ring-indigo-600/10",
                  assignment.user.role === "volunteer" &&
                    "bg-blue-50 text-blue-700 ring-blue-600/10",
                  !["medical", "security", "ops_manager", "volunteer"].includes(
                    assignment.user.role,
                  ) && "bg-gray-50 text-gray-700 ring-gray-600/10",
                )}
              >
                {assignment.user.role.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span>
                Assigned{" "}
                {assignment.assigned_at.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
