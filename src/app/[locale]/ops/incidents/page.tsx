export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { requireOps } from "@/lib/auth";
import { DashboardService } from "@/features/dashboard/services/dashboard.service";
import { IncidentOverviewPanel } from "@/features/dashboard/components/IncidentOverviewPanel";
import { ReportIncidentButton } from "@/features/incident/components/ReportIncidentButton";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export default async function OpsIncidentsPage() {
  await requireOps();

  let incidents;
  try {
    incidents = await DashboardService.getRecentIncidents(50); // Fetch a larger batch for the list page
  } catch {
    return (
      <Container className="space-y-6">
        <div className="space-y-4 pt-4">
          <Breadcrumbs items={[{ label: "Dashboard", href: "/ops" }, { label: "Incidents" }]} />
        </div>
        <PageHeader
          title="Incident Management"
          description="View and manage all stadium incidents."
        />
        <div className="mt-8 p-12 text-center bg-red-50 text-red-700 border border-red-200 rounded-lg">
          <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-red-500" />
          <h2 className="text-lg font-semibold">Service Unavailable</h2>
          <p className="mt-2">
            Unable to connect to the database to retrieve incidents. Please try again later.
          </p>
        </div>
      </Container>
    );
  }

  if (incidents.length === 0) {
    return (
      <Container className="space-y-6">
        <div className="space-y-4 pt-4">
          <Breadcrumbs items={[{ label: "Dashboard", href: "/ops" }, { label: "Incidents" }]} />
        </div>
        <PageHeader
          title="Incident Management"
          description="View and manage all stadium incidents."
          actions={<ReportIncidentButton />}
        />
        <div className="mt-8 p-12 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <ShieldAlert className="h-10 w-10 mx-auto mb-4 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">No Incidents Found</h2>
          <p className="mt-2">There are currently no incidents recorded in the system.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="space-y-6">
      <div className="space-y-4 pt-4">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/ops" }, { label: "Incidents" }]} />
      </div>
      <PageHeader
        title="Incident Management"
        description="View and manage all stadium incidents."
        actions={<ReportIncidentButton />}
      />

      <div className="mt-8">
        <IncidentOverviewPanel incidents={incidents} />
      </div>
    </Container>
  );
}
