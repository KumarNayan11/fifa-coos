# FIFACoOS - Technology Decisions

## 1. Document Information
- **Version:** 1.1
- **Status:** Approved
- **Author:** Principal Architecture Review Board
- **Last Updated:** Technology Refinement Phase
- **Depends On:** `ARCHITECTURE.md`, `SYSTEM_DESIGN.md`, `AI_ARCHITECTURE.md`

## 2. Purpose
This document serves as the authoritative record of all major technology choices for the FIFACoOS project. It bridges the abstract, frozen architecture with the concrete implementation roadmap. Future Architecture Decision Records (ADRs) will derive their context and baseline from this document.

## 3. Relationship to Architecture
Every decision explicitly references and supports the frozen architecture. The stack reflects the server-first, modular monolith pattern, the deterministic handling of AI reasoning, strict security boundaries via Row-Level Security, and the constraints of a single-developer MVP built for the PromptWars competition.

## 4. Decision-Making Principles
- **Developer Productivity (Solo Dev):** High leverage, unified ecosystems, and minimal boilerplate to guarantee MVP delivery.
- **Architecture Before Convenience:** Selections must enforce the deterministic boundaries and layered architecture defined in `ARCHITECTURE.md`.
- **Security by Default:** Technologies must natively support robust authentication, data masking, and authorization down to the database row level.
- **AI-First, Provider Agnostic:** AI abstractions must prevent vendor lock-in while enforcing strict input/output validation.
- **Performance & Accessibility:** UI frameworks must prioritize Web Content Accessibility Guidelines (WCAG) compliance and fast time-to-interactive.

---

## 5. Technology Decisions

### 5.1 Frontend & Backend Framework
- **Decision:** Next.js (App Router)
- **Status:** Approved
- **Problem Statement:** The architecture requires a server-first, modular monolith supporting both highly dynamic conversational UIs (CSR) and deterministic, SEO-friendly static rendering (SSR) while keeping the API layer closely coupled but logically separated.
- **Alternatives Considered:** React SPA + Express.js backend; SvelteKit; Remix.
- **Chosen Solution:** Latest stable version of Next.js utilizing the App Router.
- **Why It Was Chosen:** Next.js perfectly aligns with the "Server-first, modular monolith" constraint in `ARCHITECTURE.md`. Server Components (RSC) enforce deterministic, secure data fetching, while Client Components manage the conversational UI state. It provides the highest productivity for a solo developer.
- **Advantages:** Unified routing, zero-API data fetching via Server Actions, robust ecosystem.
- **Trade-offs:** Steeper learning curve for RSC caching boundaries; some features integrate most seamlessly with the Vercel ecosystem.
- **Future Reconsideration Criteria:** If the domain logic requires decoupling into independent microservices, the backend logic will be migrated out of Next.js API routes.
- **Architecture References:** `SYSTEM_DESIGN.md` (Modular Monolith), `ARCHITECTURE.md` (Server-First).
- **Implementation Notes:** All Fan UI will default to Server Components unless interactivity strictly requires `"use client"`.

### 5.2 Programming Language
- **Decision:** TypeScript
- **Status:** Approved
- **Problem Statement:** The system requires strict domain modeling and validation, specifically ensuring AI outputs match expected schemas.
- **Alternatives Considered:** JavaScript, Python, Go.
- **Chosen Solution:** Latest stable version of TypeScript used end-to-end.
- **Why It Was Chosen:** Shares the same language across frontend and backend in Next.js. Integrates flawlessly with Zod for AI validation.
- **Advantages:** End-to-end type safety, massive ecosystem, catches errors at compile time.
- **Trade-offs:** Build step required, type gymnastics can sometimes slow down rapid prototyping.
- **Future Reconsideration Criteria:** None. TypeScript is a permanent choice for this stack.
- **Architecture References:** `API_DESIGN.md` (Contracts), `AI_ARCHITECTURE.md` (Schema Validation).
- **Implementation Notes:** Enforce strict mode in configuration.

### 5.3 UI Component Strategy & Styling System
- **Decision:** Tailwind CSS + shadcn/ui
- **Status:** Approved (Revised)
- **Problem Statement:** The UI must be highly accessible (WCAG compliant) by design while supporting a custom, premium FIFA-tier design aesthetic within the tight timeline of PromptWars.
- **Alternatives Considered:** Radix UI Primitives + CSS Modules, Material UI, Chakra UI.
- **Chosen Solution:** Tailwind CSS combined with shadcn/ui (which wraps Radix UI).
- **Why It Was Chosen:** For a solo developer under a tight timeline, Tailwind CSS + shadcn/ui offers vastly superior developer velocity compared to writing custom Vanilla CSS Modules. It retains the pristine accessibility of Radix UI (keyboard navigation, ARIA, focus management) but eliminates the boilerplate of styling component states. Furthermore, AI coding assistants excel at generating and modifying Tailwind classes, significantly boosting productivity.
- **Advantages:** Extreme developer velocity, out-of-the-box accessibility, effortless dark mode, highly AI-compatible, completely customizable (shadcn/ui provides raw source code, not an opaque npm package).
- **Trade-offs:** Utility class clutter in JSX; requires adopting the Tailwind design token mindset.
- **Future Reconsideration Criteria:** None. This stack perfectly balances speed, design flexibility, and accessibility.
- **Architecture References:** `ARCHITECTURE.md` (Accessibility Considerations, UI Layer).
- **Implementation Notes:** Components will be housed in `components/ui/` and fully customized to match the FIFA aesthetic.

### 5.4 Authentication Platform & Database Platform
- **Decision:** Supabase (Auth + PostgreSQL)
- **Status:** Approved
- **Problem Statement:** The application requires strict RBAC (Fans, Volunteers, Ops) and Row-Level Security to segregate sensitive telemetry data from anonymous fans.
- **Alternatives Considered:** NextAuth + PlanetScale, Firebase.
- **Chosen Solution:** Supabase (combining GoTrue Auth and managed PostgreSQL).
- **Why It Was Chosen:** Supabase maps authentication directly to the Postgres database. This enables Row-Level Security (RLS), perfectly satisfying the `SECURITY.md` requirement that anonymous sessions cannot query operational data, enforced at the lowest possible database level.
- **Advantages:** Unbeatable security via RLS, relational integrity, unified platform.
- **Trade-offs:** Tightly couples Auth to the Database layer.
- **Future Reconsideration Criteria:** If migrating off Postgres, Auth would need to be rewritten to a provider like Clerk or Auth0.
- **Architecture References:** `DATABASE_SCHEMA.md`, `SECURITY.md` (RBAC, Data Segregation).
- **Implementation Notes:** RLS policies must be written and tested as the primary security barrier.

### 5.5 ORM / Query Layer
- **Decision:** Prisma ORM
- **Status:** Approved
- **Problem Statement:** The application needs a productive way to interact with PostgreSQL while maintaining TypeScript type safety and supporting complex JSON fields for AI metadata.
- **Alternatives Considered:** Drizzle ORM, TypeORM, raw SQL.
- **Chosen Solution:** Prisma ORM.
- **Why It Was Chosen:** Prisma's schema definition provides an excellent single source of truth that maps perfectly to `DATABASE_SCHEMA.md`. Its developer experience is unmatched for a solo developer optimizing for speed to MVP.
- **Advantages:** Auto-generated types, excellent migrations, highly readable schema file.
- **Trade-offs:** Heavier runtime bundle; relies on a query engine rather than raw SQL generation.
- **Layered Security Clarification:** Prisma serves strictly as the schema management and query abstraction layer. **Database security is not enforced by Prisma.** Security continues to be enforced fundamentally by Supabase Row-Level Security (RLS). Prisma simply passes the authenticated context to the database, where RLS intercepts and filters queries. This reinforces our layered security philosophy.
- **Future Reconsideration Criteria:** If serverless cold starts become a critical bottleneck, Drizzle ORM will be evaluated.
- **Architecture References:** `DATABASE_SCHEMA.md`, `SECURITY.md`.
- **Implementation Notes:** Prisma schema will be the physical manifestation of the Domain Model.

### 5.6 AI Provider & Orchestration
- **Decision:** Google Gemini via Vercel AI SDK
- **Status:** Approved
- **Problem Statement:** The AI reasoning pipeline must process natural language, summarize unstructured reports, and return strictly typed JSON while avoiding hard vendor lock-in to a single LLM API.
- **Alternatives Considered:** OpenAI API directly, LangChain.
- **Chosen Solution:** Vercel AI SDK acting as the `AIGateway`, utilizing Google Gemini as the primary model.
- **Why It Was Chosen:** Vercel AI SDK provides the `AIGateway` abstraction required by `ARCHITECTURE.md`, allowing models to be swapped with a single line of code. Gemini is chosen as the underlying engine for its large context window and strong JSON generation capabilities.
- **Advantages:** Provider agnostic, built-in streaming hooks for React, native Zod integration for structured output.
- **Trade-offs:** Abstractions can sometimes hide underlying provider features.
- **Future Reconsideration Criteria:** Model swaps will be evaluated based on latency and validation failure rates.
- **Architecture References:** `AI_ARCHITECTURE.md` (Provider Agnostic, Streaming).
- **Implementation Notes:** Use `streamObject` for UI generation and `generateObject` for backend decision support.

### 5.7 Validation Strategy
- **Decision:** Zod
- **Status:** Approved
- **Problem Statement:** The system must deterministically validate all user inputs and, critically, validate all LLM outputs before they reach the UI or database.
- **Alternatives Considered:** Yup, Joi, JSON Schema.
- **Chosen Solution:** Latest stable version of Zod.
- **Why It Was Chosen:** It is the industry standard for TypeScript schema validation and integrates natively with the Vercel AI SDK for structured LLM outputs.
- **Advantages:** Prevents LLM hallucinations from breaking the UI; provides type inference (`z.infer`).
- **Trade-offs:** Slight runtime parsing overhead.
- **Future Reconsideration Criteria:** None.
- **Architecture References:** `AI_ARCHITECTURE.md` (Response Validation), `API_DESIGN.md`.
- **Implementation Notes:** AI fallback triggers automatically if Zod parsing fails on LLM output.

### 5.8 Knowledge Retrieval Strategy
- **Decision:** Deterministic Exact-Match / Pre-computed DB Queries
- **Status:** Approved
- **Problem Statement:** The AI must have access to stadium policies and wayfinding rules without hallucinating. The MVP constraints explicitly limit complex event-driven architectures.
- **Alternatives Considered:** Full RAG pipeline with vector databases.
- **Chosen Solution:** Deterministic retrieval from standard PostgreSQL tables based on user role and context, injected directly into the prompt.
- **Why It Was Chosen:** For the MVP, a complex RAG pipeline introduces unnecessary latency and failure points. Fetching predefined FAQs and routing rules deterministically based on the user's location and role is safer and perfectly aligns with the "Deterministic First" principle.
- **Advantages:** 100% deterministic, zero hallucination risk on context retrieval, fast.
- **Trade-offs:** Lacks semantic search capabilities for highly obscure questions.
- **Future Reconsideration Criteria:** Post-MVP, migrate to pgvector for semantic RAG if deterministic rules become too large for the context window.
- **Architecture References:** `AI_ARCHITECTURE.md` (Context Gathering).
- **Implementation Notes:** Knowledge context is fetched in Server Actions before invoking the LLM.

### 5.9 Telemetry Simulation Strategy
- **Decision:** Dedicated Scheduled Application Service
- **Status:** Approved
- **Problem Statement:** The Ops dashboard needs realistic crowd density and incident data, but connecting to real IoT sensors is out of scope for the MVP.
- **Alternatives Considered:** Custom external Node.js interval scripts, external mocking services.
- **Chosen Solution:** A dedicated telemetry simulation service implemented within the application, with scheduled execution handled by the deployment platform where appropriate.
- **Why It Was Chosen:** Keeps the simulation logic co-located in the monolith but isolated in execution. The exact scheduling mechanism remains an implementation detail managed by the deployment platform, preventing tight coupling to a single vendor's specific task scheduler.
- **Advantages:** Architecture remains provider-agnostic, zero infrastructure overhead.
- **Trade-offs:** Minimum resolution constraints on serverless scheduled jobs may necessitate polling rather than true websockets for MVP.
- **Future Reconsideration Criteria:** Replace with real Webhook ingestion endpoints when hardware is available.
- **Architecture References:** `ARCHITECTURE.md` (Simulated Telemetry Engine).

### 5.10 State Management & API Communication
- **Decision:** React Server Components + Zustand + Server Actions
- **Status:** Approved
- **Chosen Solution:** 
  - **Data Fetching:** React Server Components (RSC) for initial loads.
  - **Mutations:** Next.js Server Actions (RPC style).
  - **Client State:** Zustand for complex client-side state.
- **Why It Was Chosen:** Eliminates the need for a separate Redux store and traditional REST `fetch` boilerplate. Server Actions provide secure, typed mutations.
- **Architecture References:** `SYSTEM_DESIGN.md` (Application Layer).

### 5.11 Tooling & Operations
- **Maps Provider:** Mapbox GL JS (Accessible, visually customizable).
- **Internationalization:** `next-intl` (App Router compatible).
- **Package Manager:** pnpm (Speed and strict dependency resolution).
- **Code Formatting / Linting:** Prettier + ESLint.
- **Environment Configuration:** `t3-env` (Enforces Zod validation on `.env` variables at build time).
- **Deployment Platform:** The project favors technologies that integrate well with edge networks (like Vercel) for rapid MVP development while maintaining portability wherever practical through open standards such as PostgreSQL, Prisma, and provider-agnostic AI abstractions.
- **CI/CD Platform:** GitHub Actions.
- **Observability & Logging:** Sentry for error tracking; Pino for structured JSON server logging.
- **Secrets Management:** Managed by the deployment provider's environment variables.
- **Documentation Generation:** TypeDoc + standard Markdown for living documentation.

---

## 6. Repository Conventions
To ensure maintainability and predictability across the monolith, the following conventions are adopted:
- **Feature-Based Organization:** Code is grouped by domain features (e.g., `features/wayfinding`, `features/incidents`) rather than solely by technical type (e.g., not just `components/` and `hooks/`), except for truly shared primitives.
- **Absolute Imports & Path Aliases:** Use strict path aliases (e.g., `@/components`, `@/features`, `@/lib`) instead of relative paths (`../../`) for cleaner refactoring.
- **Shared Modules:** Generic UI components belong in `@/components/ui`. Shared business logic resides in `@/lib`.
- **Environment Variable Naming Conventions:** Prefix client-accessible variables explicitly (e.g., `NEXT_PUBLIC_`) and securely manage server-only variables without prefixes.
- **Configuration File Organization:** All configs (Tailwind, ESLint, Prettier, TypeScript) must reside at the repository root.
- **Public Asset Organization:** Static assets (images, icons) live in the `/public` directory, categorized by type (e.g., `/public/icons`, `/public/mockups`).
- **Test File Organization:** Tests must be co-located with the files they test (e.g., `button.tsx` and `button.test.tsx`), with E2E tests grouped in a top-level `/e2e` directory.
- **Naming Consistency:** Use `camelCase` for variables and functions, `PascalCase` for React components and classes, and `kebab-case` for file and directory names.

---

## 7. Coding Standards
- **Strict TypeScript:** Enable `strict: true` in `tsconfig.json`.
- **Avoid use of `any`:** Implicit and explicit `any` types are strictly prohibited. Use `unknown` with type guards if necessary.
- **Server-First Development:** Default all React components to Server Components. Opt-in to Client Components only when browser APIs or interactivity (state, effects) are absolutely required.
- **Functional React Components:** Use functional components with hooks. Class components are deprecated.
- **Validation at Application Boundaries:** All incoming data (API requests, forms) and outgoing external data (LLM responses) must be validated via Zod.
- **Business Logic Isolated from UI:** Complex domain rules must reside in pure TypeScript functions (e.g., in `/features/domain`), completely decoupled from React components.
- **Reusable Domain Services:** Encapsulate database interactions and LLM orchestration within service abstractions rather than directly within Server Actions or route handlers.
- **Composition over Inheritance:** Build complex UIs by composing smaller, single-responsibility components.
- **Prefer Deterministic Code:** Reserve AI exclusively for natural language generation and summarization. Routing, math, and core application state must remain completely deterministic.
- **Readable over Clever:** Write code optimized for reading.
- **Consistent Naming & Small Focused Modules:** Keep files short. If a file exceeds 300 lines, it likely violates the Single Responsibility Principle.

---

## 8. Accessibility Section

### 8.1 Accessibility Philosophy
- **Accessibility by Default:** Inclusivity is not an afterthought; it is integrated into the foundation.
- **WCAG Alignment:** The application targets WCAG 2.1 AA compliance.
- **Keyboard Navigation:** All interactive elements (menus, modals, Copilot interface) must be fully traversable and operable via keyboard alone.
- **Screen Reader Compatibility:** Complex ARIA attributes must be managed automatically by the underlying UI primitives. Dynamic AI responses must gracefully handle focus and announce updates to screen readers.
- **Manual Accessibility Reviews:** Critical paths (e.g., navigating to safety during an incident) must be manually verified with screen readers.
- **Automated Accessibility Validation:** Accessibility audits are baked into the CI pipeline to prevent regressions.

### 8.2 Accessibility Tooling
- `eslint-plugin-jsx-a11y` for static analysis during development.
- `@axe-core/react` for runtime warnings in the browser.
- UI components built on top of robust headless primitives (Radix UI) to guarantee baseline compliance.

---

## 9. Testing Technology Decisions

### 9.1 Testing Philosophy
- **Continuous Verification:** Every commit must be validated by automated tests before merging.
- **Test Pyramid Focus:** Heavily rely on fast unit tests for domain logic, complemented by integration tests at the application boundaries, and critical path end-to-end tests.
- **Accessibility Testing:** Automated accessibility checks are considered part of the integration testing suite.
- **AI Validation Testing:** The AI subsystem requires specialized evaluation testing—validating that generated prompts format correctly and that the deterministic fallbacks trigger properly when given malformed simulated responses.

### 9.2 Testing Tool Recommendations
- **Unit & Integration Testing Framework:** Vitest (Fast, ESM-native, API-compatible with Jest).
- **End-to-End Testing Framework:** Playwright (Excellent cross-browser support and native accessibility testing plugins).

---

## 10. Special AI Section
The AI architecture relies entirely on the **Vercel AI SDK** to provide the `AIGateway`. 
- **LLM Selection:** Google Gemini is utilized for its strong JSON adherence.
- **Structured Outputs:** Every AI invocation uses the `generateObject` or `streamObject` methods paired with a Zod schema. If the model hallucinates an invalid structure, Zod throws an error, which the backend catches, triggering a safe deterministic fallback message to the UI.
- **Guardrails:** PII stripping and prompt injection sanitization occur in the backend *before* the SDK is invoked.
- **Future RAG Evolution:** Currently, context is retrieved deterministically (e.g., `SELECT * FROM policies WHERE role = 'volunteer'`). Post-MVP, this will evolve to semantic search.

## 11. Database Section
- **Why Relational:** Strict ACID compliance is mandatory for incident management and assignments.
- **Why Row-Level Security (RLS):** RLS ensures that even if an API endpoint has a vulnerability, the database itself will reject queries for operational data originating from an anonymous fan session.
- **Why Structured Schema:** Prisma enforces the Domain Model at compile time, eliminating a massive class of runtime errors.
- **Telemetry Storage:** Telemetry is stored as append-only records utilizing Postgres `JSONB` columns to allow flexible sensor payloads without constant schema migrations.

## 12. Security Section
- **Least Privilege:** Supabase RLS enforces least privilege at the disk level.
- **RBAC:** Managed via Auth custom claims, mapped to the `user_role` enum.
- **Data Privacy:** Backend layers intercept fan queries and strip potential PII using heuristics before constructing the LLM prompt.

---

## 13. Trade-Off Matrix

| Decision | Chosen | Alternative | Reason | Trade-offs |
| :--- | :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | React SPA + Express | Unified routing and data fetching. | RSC learning curve. |
| **Database** | Supabase (Postgres) | MongoDB / Firebase | Relational integrity + native RLS for security. | Schema migrations require more planning. |
| **Styling/UI** | Tailwind + shadcn/ui | Vanilla CSS Modules | Extreme velocity, great AI-assistance, built-in accessibility. | Utility class clutter in markup. |
| **AI Integration** | Vercel AI SDK | Direct API calls | Provider agnostic; native React streaming. | Abstraction hides some provider-specific tools. |
| **Knowledge Retrieval** | Deterministic DB Query | Vector DB (RAG) | Ensures zero hallucination for MVP phase. | Cannot answer highly obscure semantic queries. |

---

## 14. Implementation Order

To ensure a smooth vertical slice rollout, technologies must be configured in this strict sequence:

1. **Language & Environment:** TypeScript + pnpm + ESLint/Prettier. (Foundation)
2. **Framework:** Next.js scaffolding. (Provides the shell)
3. **Database & ORM:** Supabase + Prisma schema migration. (Defines the reality)
4. **Authentication:** Supabase Auth + RLS policies. (Secures the reality)
5. **UI & Styling:** Tailwind + shadcn/ui. (Visualizes the reality)
6. **AI Provider:** Vercel AI SDK integration. (Adds intelligence)
7. **Deployment & Observability:** Deployment platform + Sentry. (Prepares for production)

*Reasoning:* You cannot build the UI without knowing the data shape (Prisma). You cannot secure the API without Auth. You cannot build the AI without the secured data context.

---

## 15. Future ADR Mapping

As the implementation progresses, architectural deviations or deeper technical implementations of these choices will be documented in the following structure:

- **ADR-001** -> Next.js App Router Architecture & Caching Strategy
- **ADR-002** -> Supabase Row-Level Security Policy Design
- **ADR-003** -> UI Component Architecture (Tailwind + shadcn/ui)
- **ADR-004** -> Deterministic AI Context Retrieval Implementation
- **ADR-005** -> Telemetry Simulation Implementation

---

## 16. Diagrams

### Technology Stack Overview
```mermaid
graph TD
    Client[Client UI: Next.js Client Components + shadcn/ui]
    API[Backend: Next.js Server Actions + API Routes]
    Auth[Auth: Supabase GoTrue]
    DB[(Database: Supabase PostgreSQL)]
    ORM[Data Layer: Prisma]
    AI[AI Engine: Vercel AI SDK + Gemini]
    
    Client -- Server Actions --> API
    API -- Auth Check --> Auth
    API -- Read/Write --> ORM
    ORM -- SQL --> DB
    API -- Prompt --> AI
```

---

## 17. Executive Summary
**Technology Philosophy:** The technology stack for FIFACoOS prioritizes developer velocity, strict typing, and built-in security, leveraging a modern ecosystem to allow a single developer to build a robust, FIFA-scale architecture.

**Major Decisions:** Next.js (App Router) serves as the unified application framework. Supabase provides the crucial Row-Level Security and relational data integrity. The Vercel AI SDK acts as a vendor-agnostic gateway to Google Gemini, strictly enforcing structured outputs via Zod. Tailwind CSS and shadcn/ui guarantee rapid, accessible UI development.

**Migration Flexibility:** The architecture is highly defensive. By using Prisma, the database provider can be swapped. By using Vercel AI SDK, the LLM can be swapped. By utilizing deployment-agnostic scheduling, the infrastructure remains portable.

**Readiness:** The technology stack is finalized, fully supports the frozen architecture, adheres strictly to all security and AI constraints, and is ready for Phase 0 implementation.
