import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";

export default function OpsDashboardPage() {
  return (
    <Container>
      <PageHeader
        title="Operations Dashboard"
        description="Welcome to the Command Center. Incident management and telemetry will be implemented in subsequent phases."
      />
      <div className="mt-8 p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
        <p>Operations Command Center Content</p>
      </div>
    </Container>
  );
}
