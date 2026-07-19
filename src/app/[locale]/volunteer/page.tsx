import { requireVolunteer } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock } from "lucide-react";
import { KnowledgeSearchPanel } from "@/features/knowledge/components/knowledge-search-panel";
import { VolunteerCopilotPanel } from "@/features/ai/components/volunteer-copilot-panel";

export default async function VolunteerDashboardPage() {
  const session = await requireVolunteer();

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Welcome, {session.email}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">Coming Soon</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">Placeholder</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div id="volunteer-copilot">
            <VolunteerCopilotPanel />
          </div>
          <div id="knowledge-search">
            <KnowledgeSearchPanel />
          </div>
        </div>
      </div>
    </Container>
  );
}
