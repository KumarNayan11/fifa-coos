"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createIncident, getZones } from "../actions";

interface Zone {
  id: string;
  name: string;
}

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateIncidentModal({ isOpen, onClose }: CreateIncidentModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    if (isOpen && zones.length === 0) {
      getZones().then((res) => {
        if (res.success && res.data) {
          setZones(res.data);
        }
      });
    }
  }, [isOpen, zones.length]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      severity: formData.get("severity"),
      zone_id: formData.get("zone_id"),
    };

    const res = await createIncident(data);

    setIsSubmitting(false);

    if (res.success) {
      router.refresh();
      onClose();
    } else {
      setError(res.error || "Failed to create incident");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Report Incident</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">{error}</div>
          )}

          <form id="create-incident-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                name="title"
                required
                minLength={3}
                maxLength={100}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Medical Emergency at Gate 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                required
                minLength={10}
                maxLength={5000}
                rows={3}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                name="severity"
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <select
                name="zone_id"
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select a zone...</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="create-incident-form" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Report Incident"}
          </Button>
        </div>
      </div>
    </div>
  );
}
