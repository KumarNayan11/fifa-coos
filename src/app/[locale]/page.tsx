/**
 * FIFACoOS — Home Page
 *
 * Premium product homepage for the FIFA Copilot Operating System.
 * Presents FIFACoOS as an AI-powered Stadium Operations Platform
 * and guides users into the three core experiences.
 *
 * Server Component — no client-side JavaScript required.
 *
 * @see PRD.md — Product overview
 * @see ARCHITECTURE.md — System architecture
 */

import {
  MessageCircle,
  LayoutDashboard,
  HeartHandshake,
  ArrowRight,
  BrainCircuit,
  Activity,
  Globe,
  Accessibility,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Users,
  Shield,
  Zap,
  Target,
  Radio,
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { APP_CONFIG, ROUTES } from "@/config";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Data — Platform Modules
// ---------------------------------------------------------------------------

const PLATFORM_MODULES = [
  {
    id: "fan-copilot",
    title: "Fan Copilot",
    description:
      "AI-powered stadium assistant that helps fans navigate the venue, check wait times, and get instant answers — all through natural conversation.",
    capabilities: [
      "Natural language stadium navigation",
      "Real-time wait time information",
      "Accessibility-aware routing",
      "Multilingual AI responses",
    ],
    icon: MessageCircle,
    href: ROUTES.fan.root,
    color: "from-violet-500/10 to-indigo-500/10",
    iconColor: "text-violet-600",
    borderColor: "hover:border-violet-300",
    requiresAuth: false,
    available: true,
  },
  {
    id: "ops-command",
    title: "Operations Command Center",
    description:
      "Real-time operational dashboard with AI decision support for incident management, crowd monitoring, and resource coordination.",
    capabilities: [
      "Live incident tracking & lifecycle management",
      "AI-powered situational awareness",
      "Simulated crowd telemetry & zone heatmaps",
      "Automated decision recommendations",
    ],
    icon: LayoutDashboard,
    href: ROUTES.ops.root,
    color: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
    borderColor: "hover:border-blue-300",
    requiresAuth: false,
    available: true,
  },
  {
    id: "volunteer-assistant",
    title: "Volunteer Assistant",
    description:
      "Knowledge-grounded AI copilot that helps volunteers access policies, SOPs, and operational guidance instantly.",
    capabilities: [
      "Instant policy & SOP retrieval",
      "AI-powered Q&A with source citations",
      "Role-based knowledge scoping",
      "Context-aware operational guidance",
    ],
    icon: HeartHandshake,
    href: ROUTES.volunteer.root,
    color: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600",
    borderColor: "hover:border-emerald-300",
    requiresAuth: true,
    available: true,
  },
] as const;

// ---------------------------------------------------------------------------
// Data — Platform Capabilities
// ---------------------------------------------------------------------------

const CAPABILITIES = [
  {
    title: "AI Decision Support",
    description:
      "Three specialized AI copilots powered by Google Gemini deliver contextual, real-time intelligence across every persona.",
    icon: BrainCircuit,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Real-Time Telemetry",
    description:
      "Simulated crowd density, gate throughput, and queue metrics provide live operational awareness for command staff.",
    icon: Activity,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Multilingual Experience",
    description:
      "Full internationalization with AI responses adapted to the user's language, supporting a global audience.",
    icon: Globe,
    iconColor: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    title: "Accessibility First",
    description:
      "WCAG-compliant interfaces with skip navigation, keyboard support, screen reader optimization, and accessibility-aware routing.",
    icon: Accessibility,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Secure Role-Based Access",
    description:
      "Supabase authentication with Prisma-verified roles ensures each persona sees only what they're authorized to access.",
    icon: ShieldCheck,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "Intelligent Knowledge Retrieval",
    description:
      "Deterministic knowledge retrieval feeds curated stadium data into every AI response — no hallucinations, only grounded facts.",
    icon: BookOpen,
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50",
  },
] as const;

// ---------------------------------------------------------------------------
// Data — Why FIFACoOS highlights
// ---------------------------------------------------------------------------

const WHY_HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "Unified Intelligence Engine",
    description:
      "A single AI architecture powers three specialized copilots — each with its own knowledge scope, prompt engineering, and safety guardrails.",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop AI",
    description:
      "Every AI recommendation is advisory. Operations staff maintain full decision authority with AI-augmented situational awareness.",
  },
  {
    icon: Shield,
    title: "Safe AI by Design",
    description:
      "Built-in prompt injection detection, PII removal, confidence scoring, and deterministic fallbacks ensure reliable AI behavior.",
  },
  {
    icon: Target,
    title: "Three Specialized Copilots",
    description:
      "Fan navigation, operational decision support, and volunteer policy retrieval — each copilot is purpose-built for its audience.",
  },
  {
    icon: Zap,
    title: "Real-Time Operational Awareness",
    description:
      "Live telemetry simulation, auto-refreshing dashboards, and AI-driven incident analysis keep operations teams ahead of events.",
  },
  {
    icon: Radio,
    title: "Built for Scale",
    description:
      "Designed for large-scale sporting events with zone-based management, multi-persona workflows, and resilient error handling.",
  },
] as const;

// ---------------------------------------------------------------------------
// Data — Tech Stack (curated, product-facing)
// ---------------------------------------------------------------------------

const TECH_BADGES = [
  "Next.js",
  "TypeScript",
  "Google Gemini",
  "Vercel AI SDK",
  "Supabase",
  "Prisma",
  "Tailwind CSS",
  "shadcn/ui",
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HomePage() {
  const session = await getSession();
  const isVolunteerOrAdmin = session?.role === "volunteer" || session?.role === "admin";

  return (
    <main className="flex min-h-screen flex-col">
      {/* ================================================================= */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-slate-50 via-white to-white">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-100/60 to-violet-100/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-blue-100/50 to-cyan-100/30 blur-3xl" />
        </div>

        <Container size="lg" className="relative">
          <div className="flex flex-col items-center py-20 text-center sm:py-28 lg:py-32">
            {/* Event context badge */}
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-4 py-1.5 text-sm font-medium shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              FIFA World Cup 2026™
            </Badge>

            {/* Brand name */}
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              FIFA
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                CoOS
              </span>
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-lg font-medium text-muted-foreground sm:text-xl">
              {APP_CONFIG.fullName}
            </p>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              An AI-powered Stadium Operations Platform delivering intelligent decision support for
              fans, operations teams, and volunteers — designed for the world&apos;s largest
              sporting event.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href={ROUTES.fan.copilot}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-white shadow-lg shadow-indigo-200/50 transition-all hover:shadow-xl hover:shadow-indigo-200/60 hover:from-indigo-700 hover:to-violet-700",
                )}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Launch Fan Copilot
              </Link>
              <Link
                href={ROUTES.ops.root}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 px-8 shadow-sm transition-all hover:shadow-md",
                )}
              >
                <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                Operations Dashboard
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* PLATFORM MODULES                                                   */}
      {/* ================================================================= */}
      <section className="border-b py-20 sm:py-24" aria-labelledby="modules-heading">
        <Container size="lg">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Platform Experiences
            </Badge>
            <h2 id="modules-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three Intelligent Copilots,
              <br className="hidden sm:block" />
              One Unified Platform
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Purpose-built AI assistants for every role in stadium operations — from spectators to
              command staff to volunteers.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:gap-8 lg:grid-cols-3">
            {PLATFORM_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isAccessible = mod.requiresAuth ? isVolunteerOrAdmin : mod.available;

              const cardContent = (
                <Card
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden transition-all duration-300",
                    isAccessible ? `shadow-sm hover:shadow-lg ${mod.borderColor}` : "opacity-70",
                  )}
                >
                  {/* Gradient top accent */}
                  <div
                    className={cn(
                      "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                      mod.color.replace("/10", "").replace("from-", "from-").replace("to-", "to-"),
                    )}
                    style={{
                      background: `linear-gradient(to right, ${mod.iconColor.replace("text-", "").replace("-600", "")}50, ${mod.iconColor.replace("text-", "").replace("-600", "")}30)`,
                    }}
                    aria-hidden="true"
                  />

                  <CardHeader className="pb-4">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-105",
                          mod.color,
                        )}
                      >
                        <Icon className={cn("h-6 w-6", mod.iconColor)} aria-hidden="true" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{mod.title}</CardTitle>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {mod.description}
                    </p>
                  </CardHeader>

                  <CardContent className="flex-1 pt-0">
                    <ul className="space-y-2.5" aria-label={`${mod.title} capabilities`}>
                      {mod.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <div
                            className={cn(
                              "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                              mod.iconColor.replace("text-", "bg-"),
                            )}
                            aria-hidden="true"
                          />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  {isAccessible && (
                    <div className="mt-auto p-6 pt-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group-hover:gap-2.5",
                          mod.iconColor,
                        )}
                      >
                        Launch {mod.title.split(" ")[0]}
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  )}
                </Card>
              );

              return (
                <div key={mod.id}>
                  {isAccessible ? (
                    <Link href={mod.href} className="block h-full">
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* PLATFORM CAPABILITIES                                              */}
      {/* ================================================================= */}
      <section
        className="border-b bg-slate-50/50 py-20 sm:py-24"
        aria-labelledby="capabilities-heading"
      >
        <Container size="lg">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Built-In Capabilities
            </Badge>
            <h2 id="capabilities-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Enterprise-Grade Intelligence
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Every feature is architecturally implemented and production-ready — from AI safety
              guardrails to accessibility compliance.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="group rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300"
                >
                  <div
                    className={cn(
                      "mb-4 flex h-11 w-11 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105",
                      cap.bgColor,
                    )}
                  >
                    <Icon className={cn("h-5 w-5", cap.iconColor)} aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* WHY FIFACoOS                                                       */}
      {/* ================================================================= */}
      <section className="border-b py-20 sm:py-24" aria-labelledby="why-heading">
        <Container size="lg">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">
              Why FIFACoOS
            </Badge>
            <h2 id="why-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI That Serves Every Stakeholder
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              A unified architecture where deterministic knowledge retrieval meets large language
              models — delivering reliable, safe, and contextual intelligence at stadium scale.
            </p>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50">
                    <Icon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* TECHNOLOGY SECTION                                                 */}
      {/* ================================================================= */}
      <section className="border-b bg-slate-50/50 py-16 sm:py-20" aria-labelledby="tech-heading">
        <Container size="lg">
          <div className="flex flex-col items-center text-center">
            <h2
              id="tech-heading"
              className="text-lg font-semibold tracking-tight text-muted-foreground"
            >
              Built with modern, production-grade technology
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              {TECH_BADGES.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-3.5 py-1.5 text-sm font-medium shadow-sm transition-shadow hover:shadow-md"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* FINAL CTA                                                          */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-24" aria-labelledby="cta-heading">
        <Container size="md">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 px-8 py-16 text-center shadow-2xl sm:px-16">
            {/* Decorative glow */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden="true"
            >
              <div className="absolute -top-10 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
            </div>

            <div className="relative">
              <h2
                id="cta-heading"
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Experience the Future of
                <br className="hidden sm:block" />
                Stadium Operations
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-indigo-200">
                Step into a world where AI copilots, real-time telemetry, and intelligent knowledge
                retrieval come together to power the world&apos;s greatest sporting event.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href={ROUTES.fan.copilot}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 bg-white px-8 text-slate-900 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl",
                  )}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Open Fan Copilot
                </Link>
                <Link
                  href={ROUTES.ops.root}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "gap-2 border-indigo-400/30 px-8 text-indigo-200 transition-all hover:bg-indigo-900/50 hover:text-white hover:border-indigo-400/50",
                  )}
                >
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  Operations Login
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* FOOTER                                                             */}
      {/* ================================================================= */}
      <footer className="mt-auto border-t py-8">
        <Container size="lg">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{APP_CONFIG.name}</span> —{" "}
              {APP_CONFIG.description}
            </p>
            <a
              href={APP_CONFIG.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub Repository
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </Container>
      </footer>
    </main>
  );
}
