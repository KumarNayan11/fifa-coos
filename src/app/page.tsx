/**
 * FIFACoOS — Home Page
 *
 * Professional landing page displaying:
 * - Project title and description
 * - Architecture version and implementation phase
 * - Technology stack summary
 * - Development status
 * - Placeholder links for future features
 *
 * No business logic. Server Component (default).
 *
 * @see IMPLEMENTATION_PLAN.md — Phase 1 deliverables
 */

import {
  MessageCircle,
  LayoutDashboard,
  HeartHandshake,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { APP_CONFIG, TECH_STACK, IMPLEMENTATION_PHASES, NAV_ITEMS, ROUTES } from "@/config";
import { getStatusEmoji } from "@/lib/helpers";

// ---------------------------------------------------------------------------
// Icon map for nav items — avoids dynamic imports
// ---------------------------------------------------------------------------

const ICON_MAP = {
  MessageCircle,
  LayoutDashboard,
  HeartHandshake,
} as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();
  const isVolunteerOrAdmin = session?.role === "volunteer" || session?.role === "admin";

  return (
    <main className="flex min-h-screen flex-col">
      {/* ----------------------------------------------------------------- */}
      {/* Hero Section                                                       */}
      {/* ----------------------------------------------------------------- */}
      <section className="flex flex-1 flex-col items-center justify-center py-20 sm:py-28">
        <Container size="lg">
          <div className="flex flex-col items-center text-center">
            {/* Competition badge */}
            <Badge variant="outline" className="mb-6">
              {APP_CONFIG.competition}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {APP_CONFIG.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground sm:text-xl">{APP_CONFIG.fullName}</p>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {APP_CONFIG.description}
            </p>

            {/* Meta info pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Badge variant="secondary">Architecture v{APP_CONFIG.architectureVersion}</Badge>
              <Badge variant="info">
                Phase {APP_CONFIG.phase.current}: {APP_CONFIG.phase.name}
              </Badge>
              <Badge variant="warning">{APP_CONFIG.phase.status}</Badge>
            </div>
          </div>
        </Container>
      </section>

      <Divider />

      {/* ----------------------------------------------------------------- */}
      {/* Feature Placeholders                                              */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16" aria-labelledby="features-heading">
        <Container size="lg">
          <h2
            id="features-heading"
            className="mb-8 text-center text-2xl font-semibold tracking-tight"
          >
            Platform Modules
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];
              const isVolunteerItem = item.href === ROUTES.volunteer.root;
              // If it's the volunteer item, only make it available if the user has the right role.
              // Otherwise fallback to its config status.
              const isAvailable = isVolunteerItem ? isVolunteerOrAdmin : item.available;

              const CardContent = (
                <Card
                  className={`group relative overflow-hidden transition-shadow ${
                    isAvailable ? "hover:shadow-md hover:border-indigo-200" : "opacity-75"
                  }`}
                >
                  <CardHeader>
                    <div className="mb-3 flex items-center gap-3">
                      {Icon && (
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            isAvailable
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        Phase {item.phase}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{item.label}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                        Open Module
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        Coming Soon
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
                    )}
                  </CardFooter>
                </Card>
              );

              return (
                <div key={item.label}>
                  {isAvailable ? (
                    <Link href={item.href} className="block">
                      {CardContent}
                    </Link>
                  ) : (
                    CardContent
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <Divider />

      {/* ----------------------------------------------------------------- */}
      {/* Technology Stack                                                   */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16" aria-labelledby="tech-heading">
        <Container size="lg">
          <h2 id="tech-heading" className="mb-8 text-center text-2xl font-semibold tracking-tight">
            Technology Stack
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Divider />

      {/* ----------------------------------------------------------------- */}
      {/* Implementation Status                                             */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16" aria-labelledby="status-heading">
        <Container size="md">
          <h2
            id="status-heading"
            className="mb-8 text-center text-2xl font-semibold tracking-tight"
          >
            Development Status
          </h2>
          <div className="space-y-2">
            {IMPLEMENTATION_PHASES.map((phase) => (
              <div
                key={phase.phase}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base" aria-hidden="true">
                    {getStatusEmoji(phase.status)}
                  </span>
                  <span className="text-sm font-medium">
                    Phase {phase.phase}: {phase.name}
                  </span>
                </div>
                <Badge
                  variant={
                    phase.status === "complete"
                      ? "success"
                      : phase.status === "in-progress"
                        ? "warning"
                        : "outline"
                  }
                >
                  {phase.status === "complete"
                    ? "Complete"
                    : phase.status === "in-progress"
                      ? "In Progress"
                      : "Not Started"}
                </Badge>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Footer                                                            */}
      {/* ----------------------------------------------------------------- */}
      <footer className="mt-auto border-t py-8">
        <Container size="lg">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              {APP_CONFIG.name} v{APP_CONFIG.version} &mdash; {APP_CONFIG.competition}
            </p>
            <a
              href={APP_CONFIG.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              GitHub Repository
            </a>
          </div>
        </Container>
      </footer>
    </main>
  );
}
