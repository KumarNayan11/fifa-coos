"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { assignIncident, resolveIncident, closeIncident } from "../actions";

export function IncidentActionsPanel({
  incident,
  users,
}: {
  incident: { id: string; status: string };
  users: { id: string; name: string; role: string }[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [selectedUserId, setSelectedUserId] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  async function handleAssign() {
    if (!selectedUserId) return setError("Please select a user to assign");
    setIsSubmitting(true);
    setError("");
    const res = await assignIncident({ incident_id: incident.id, user_id: selectedUserId });
    setIsSubmitting(false);
    if (res.success) router.refresh();
    else setError(res.error || "Failed to assign");
  }

  async function handleResolve() {
    setIsSubmitting(true);
    setError("");
    const res = await resolveIncident({
      incident_id: incident.id,
      resolution_notes: resolutionNotes,
    });
    setIsSubmitting(false);
    if (res.success) router.refresh();
    else setError(res.error || "Failed to resolve");
  }

  async function handleClose() {
    setIsSubmitting(true);
    setError("");
    const res = await closeIncident(incident.id);
    setIsSubmitting(false);
    if (res.success) router.refresh();
    else setError(res.error || "Failed to close");
  }

  const status = incident.status;
  const canAssign = status !== "closed" && status !== "resolved";
  const canResolve = status === "assigned";
  const canClose = status === "resolved";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">{error}</div>}

      <div className="space-y-6">
        {canAssign && (
          <div className="space-y-2 border-b pb-4">
            <label className="block text-sm font-medium">Assign Personnel</label>
            <div className="flex gap-2">
              <select
                className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Select User...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <Button onClick={handleAssign} disabled={isSubmitting || !selectedUserId}>
                Assign
              </Button>
            </div>
          </div>
        )}

        {canResolve && (
          <div className="space-y-2 border-b pb-4">
            <label className="block text-sm font-medium">Resolve Incident</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Resolution notes (optional)"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
            />
            <Button
              onClick={handleResolve}
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Mark as Resolved
            </Button>
          </div>
        )}

        {canClose && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">
              Incident has been resolved and is ready to be closed.
            </p>
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              Close Incident
            </Button>
          </div>
        )}

        {status === "closed" && (
          <div className="p-3 bg-gray-50 text-center rounded-md">
            <span className="text-sm text-gray-500 font-medium">Incident Closed</span>
          </div>
        )}
      </div>
    </div>
  );
}
