export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { requireOps } from "@/lib/auth";
import { IncidentService } from "@/features/incident/services/incident.service";
import { ReportIncidentButton } from "@/features/incident/components/ReportIncidentButton";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { IncidentDataTable } from "@/features/incident/components/IncidentDataTable";

// 1. Data Fetcher Component
async function IncidentsData() {
  let incidents;
  try {
    // We use IncidentService because it returns the zone relations needed for the table
    incidents = await IncidentService.listIncidents();
  } catch {
    return (
      <div className="mt-8 p-12 text-center bg-red-50 text-red-700 border border-red-200 rounded-lg">
        <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-red-500" />
        <h2 className="text-lg font-semibold">Service Unavailable</h2>
        <p className="mt-2">
          Unable to connect to the database to retrieve incidents. Please try again later.
        </p>
      </div>
    );
  }

  // Global empty state (database is completely empty)
  if (incidents.length === 0) {
    return (
      <div className="mt-8 p-12 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <ShieldAlert className="h-10 w-10 mx-auto mb-4 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">No Incidents Found</h2>
        <p className="mt-2">There are currently no incidents recorded in the system.</p>
      </div>
    );
  }

  // Cast the Prisma return type to the expected interface format for the client component
  const formattedIncidents = incidents.map((inc) => ({
    id: inc.id,
    title: inc.title,
    status: inc.status,
    severity: inc.severity,
    created_at: inc.created_at,
    updated_at: inc.updated_at,
    zone: inc.zone ? { name: inc.zone.name } : null,
    assignments: inc.assignments.map((a) => ({ user: { full_name: a.user.full_name } })),
  }));

  return (
    <div className="mt-8">
      <IncidentDataTable incidents={formattedIncidents} />
    </div>
  );
}

// 2. Loading Skeleton
function TableSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <div className="h-14 w-full bg-gray-100 animate-pulse rounded-lg border border-gray-200"></div>
      <div className="h-96 w-full bg-gray-50 animate-pulse rounded-lg border border-gray-200"></div>
    </div>
  );
}

// 3. Main Page Shell
export default async function OpsIncidentsPage() {
  await requireOps();

  return (
    <Container className="space-y-6 pb-12">
      <div className="space-y-4 pt-4">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/ops" }, { label: "Incidents" }]} />
      </div>

      <PageHeader
        title="Incident Management"
        description="Search, filter, and manage all stadium incidents."
        actions={<ReportIncidentButton />}
      />

      <Suspense fallback={<TableSkeleton />}>
        <IncidentsData />
      </Suspense>
    </Container>
  );
}
