import { requireVolunteer } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { KnowledgeSearchPanel } from "@/features/knowledge/components/knowledge-search-panel";
import { VolunteerCopilotWorkspace } from "@/features/ai/components/volunteer-workspace";

export default async function VolunteerDashboardPage() {
  const session = await requireVolunteer();

  return (
    <Container className="h-[calc(100vh-4rem)] pt-6 pb-6 max-h-screen">
      <div className="flex h-full w-full flex-col lg:flex-row gap-6">
        {/* Primary Column - 70% */}
        <div id="volunteer-copilot" className="flex-1 lg:w-[70%] h-[500px] lg:h-full">
          <VolunteerCopilotWorkspace />
        </div>

        {/* Secondary Column - 30% */}
        <div
          id="knowledge-search"
          className="w-full lg:w-[30%] h-[400px] lg:h-full overflow-y-auto"
        >
          <KnowledgeSearchPanel />
        </div>
      </div>
    </Container>
  );
}
