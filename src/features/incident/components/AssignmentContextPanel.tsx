import { User, Clock, ShieldAlert } from "lucide-react";

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
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start gap-3"
        >
          <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              {assignment.user.full_name || "Unknown User"}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 capitalize uppercase tracking-wider">
                {assignment.user.role.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              Assigned{" "}
              {assignment.assigned_at.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
