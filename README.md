# FIFACoOS (FIFA Copilot Operating System)

An AI-powered Smart Stadium & Tournament Operations Platform built for the FIFA World Cup 2026.

FIFACoOS leverages Generative AI to provide intelligent decision support for fans, operations managers, volunteers, venue staff, and emergency responders. Rather than functioning as a simple conversational chatbot, the platform acts as an operational copilot by synthesizing real-time stadium context, predicting operational challenges, and delivering actionable, validated recommendations across crowd management, navigation, accessibility, multilingual assistance, and incident response.

---

## Features

### Fan Copilot

A mobile-optimized, anonymous assistant designed to guide fans through their stadium journey.

- **Smart Navigation & Wayfinding**: Provides step-by-step routing between stadium locations (gates, concessions, medical tents, restrooms) based on accessibility preferences (e.g., wheelchair-friendly paths).
- **Live Concession Wait Times**: Fetches live queue wait times for points of interest securely without exposing underlying operational telemetry.
- **Instant Answers**: Provides multilingual answers to common stadium FAQs and standard policies.
- _[Screenshot Placeholder: Fan Copilot Chat Interface]_

### Operations Command Center

A desktop-optimized dashboard for venue managers and security coordinators to visualize real-time operations.

- **Live Telemetry & Heatmaps**: Monitors simulated crowd densities, queue wait times, and active stadium metrics per zone.
- **Incident Lifecycle Management**: Displays a prioritized list of active incidents, allowing managers to inspect, assign, resolve, and close incidents.
- **AI Decision Support**: Recommends actionable mitigations and staff deployments for active incidents based on standard operating procedures (SOPs).
- _[Screenshot Placeholder: Operations Dashboard & AI Recommendations]_

### Volunteer Assistant

A tailored mobile workspace for authenticated volunteers assisting fans on the ground.

- **Policy Knowledge Base**: Provides rapid AI-assisted lookups of stadium policies, volunteer manuals, and standard procedures.
- **Incident Reporting & Log**: Allows volunteers to view, report, and assign incidents, coordinating directly with the Operations Command Center.
- _[Screenshot Placeholder: Volunteer Policy Lookup]_

---

## Architecture

FIFACoOS is built as a server-first, modular monolith designed for type-safety, reliability, and security.

- **Next.js App Router**: Utilizes the Next.js App Router to structure page routing, layouts, and data fetch lifecycle boundaries.
- **React Server Components (RSC)**: Performs data fetching and authorization checks on the server, minimizing client bundles and optimizing render performance.
- **Server Actions**: Implements secure RPC-style endpoints for client mutations with server-side validation.
- **Prisma ORM**: Defines the type-safe domain model and query abstraction layer.
- **Supabase**: Powers PostgreSQL storage, user authentication, and Row-Level Security (RLS).
- **Google Gemini**: Powers natural language understanding, report summarization, and contextual recommendation synthesis.
- **Vercel AI SDK**: Serves as a provider-agnostic gateway (`AIGateway`) to manage timeouts, retries, and streaming.
- **Deterministic Retrieval**: Injects verified database records (SOPs, POIs, telemetry) into the AI prompt before execution, preventing hallucinations of critical information.
- **Role-Based Access Control (RBAC)**: Segregates interfaces and API operations strictly based on user roles (`ops`, `volunteer`, `fan`).
- **i18n (next-intl)**: Provides localized UI text and instructs the AI to respond in the user's selected language (supports EN, ES, FR, HI).
- **Accessibility (WCAG 2.1 AA)**: Headless UI primitives (Radix UI) ensure keyboard navigability, focus management, and screen-reader compatibility.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI primitives)
- **Database & Auth**: Supabase (PostgreSQL & GoTrue)
- **ORM**: Prisma ORM
- **AI Integration**: Vercel AI SDK & `@ai-sdk/google` (Google Gemini)
- **Validation**: Zod
- **Testing**: Vitest (Unit/Integration) & Playwright (E2E)

---

## AI Capabilities

- **Fan Assistant**: Parses natural language requests (including slang/typos), determines user intents (e.g. wayfinding, policy lookup), and maps them to deterministic services.
- **Operations Copilot**: Synthesizes conflicting incident reports into a single cohesive summary and drafts staff deployment strategies.
- **Volunteer Assistant**: Queries volunteer manuals and guides to answer policy questions in real-time.
- **Unified Intelligence Engine (UIE)**: A centralized, stateless module that orchestrates all LLM prompts, structured outputs, and fallback triggers.
- **Deterministic Knowledge Retrieval**: Integrates standard operating procedures and stadium spatial coordinates deterministically from Postgres into AI prompts, guaranteeing accurate facts.
- **Safe AI Architecture**: Implements a strict input/output verification lifecycle:
  1. Sanitizes input and strips PII.
  2. Restricts database access (UIE operates on pre-fetched contexts only).
  3. Validates AI JSON outputs against Zod schemas; triggers a polite deterministic fallback if validation fails.
  4. Requires human approval before executing any AI-recommended actions.

---

## Security

- **Supabase Auth**: Manages secure sessions and custom user claims for roles.
- **RBAC Enforcement**: Middleware and layout boundaries check authenticated roles before loading operational screens or processing requests.
- **Prisma Schema Constraints**: Enforces data integrity at the database model level.
- **Zod Validation**: Validates all incoming payloads at API and Server Action boundaries.
- **Server Actions Security**: Actions enforce strict role check helpers (`requireOps()`, `requireVolunteer()`) before executing writes.
- **RLS Strategy**: Supabase PostgreSQL Row-Level Security (RLS) acts as a defense-in-depth barrier, segregating user-specific data and completely denying anonymous fan access to operational telemetry or incidents.

---

## Running Locally

### 1. Clone & Install

```bash
git clone https://github.com/KumarNayan11/fifa-coos.git
cd fifa-coos
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory based on `.env.example`:

```env
# Database Connections (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-id]:[password]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# AI Key & Model
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"
```

### 3. Database Setup & Seeding

Run Prisma migrations and seed the database with spatial metadata, standard operating procedures, mock incidents, and demo authentication accounts:

```bash
npx prisma db push
pnpm db:seed
```

### 4. Run the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Demo Accounts

The database seeding process creates three demo accounts linked to Supabase Auth:

- **Operations Manager**:
  - Email: `ops@example.com`
  - Password: `password123`
- **Volunteer**:
  - Email: `volunteer@example.com`
  - Password: `password123`
- **Anonymous Fan**:
  - No login required. Navigate directly to `/fan` or `/fan/copilot`.

---

## Testing

Run the full automated unit and integration test suite:

```bash
pnpm test
```

- **Current Test Count**: **127 passed tests** across 34 test suites.
- E2E tests can be executed via Playwright:

```bash
pnpm test:e2e
```

---

## Deployment

FIFACoOS is optimized for deployment on the Vercel Platform.

1. Connect your repository to Vercel.
2. Add all env variables from `.env` in the Project Settings.
3. Configure the build command as `next build` and install command as `pnpm install`.
4. Ensure the database migrations are executed in your production database via `npx prisma db push`.

---

## Repository Structure

```
.
├── docs/                   # System and architecture design documentation
│   ├── architecture/       # ARCHITECTURE, AI_ARCHITECTURE, SYSTEM_DESIGN, SECURITY, etc.
│   ├── development/        # DEVELOPER_GUIDE, PHASE_CHECKLISTS
│   ├── planning/           # IMPLEMENTATION_PLAN, TECHNOLOGY_DECISIONS
│   └── product/            # PRD, FEATURE_SPEC
├── prisma/                 # Database schema and seed scripts
├── public/                 # Static assets (icons, maps, images)
├── src/
│   ├── app/                # Next.js pages, layouts, and internationalized routing
│   ├── components/         # Global reusable UI (components/ui, components/shared)
│   ├── config/             # App configs, navigation, and constants
│   ├── features/           # Domain-driven features (ai, fan, incident, telemetry, etc.)
│   ├── hooks/              # Global React hooks
│   ├── lib/                # Shared helper libraries (auth, prisma client, etc.)
│   ├── services/           # Shared database and telemetry services
│   └── types/              # Global TypeScript models
└── vitest.config.ts        # Unit test configuration
```

---

## Roadmap

| Phase       | Description                                | Status       |
| :---------- | :----------------------------------------- | :----------- |
| **Phase 0** | Repository Initialization & CI Scaffolding | ✅ Completed |
| **Phase 1** | Platform Foundation & DB Scaffolding       | ✅ Completed |
| **Phase 2** | Fan Copilot Wayfinding & FAQ Slice         | ✅ Completed |
| **Phase 3** | Operations Command Center & Dashboards     | ✅ Completed |
| **Phase 4** | Volunteer Assistant Workspace              | ✅ Completed |
| **Phase 5** | Accessibility Audit & i18n Localization    | ✅ Completed |
| **Phase 6** | Quality Hardening & Red-Teaming            | ✅ Completed |
| **Phase 7** | Submission Prep & Polish                   | ✅ Completed |
