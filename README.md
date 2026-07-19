# FIFACoOS

FIFA Copilot Operating System

An AI-powered Smart Stadium & Tournament Operations Platform built for PromptWars Challenge 4.

FIFACoOS leverages Generative AI to provide intelligent decision support for fans, organizers, volunteers, venue staff, and emergency responders during the FIFA World Cup 2026. Rather than functioning as a simple chatbot, the platform acts as an operational copilot by synthesizing real-time stadium context, predicting operational challenges, and delivering actionable recommendations across crowd management, navigation, accessibility, transportation, multilingual assistance, sustainability, and incident response.

## Project Status

| Phase                        | Status         |
| :--------------------------- | :------------- |
| **0:** Repository Init       | ✅ Completed   |
| **1:** Platform Foundation   | ✅ Completed   |
| **2:** Fan Copilot           | ✅ Completed   |
| **3:** Ops Command Center    | ✅ Completed   |
| Phase 4: Volunteer Assistant | 🏗️ In Progress |
| Phase 5: Polish              | ✅ Completed   |
| Phase 6: Hardening           | ✅ Completed   |
| Phase 7: PromptWars Submit   | 🏗️ In Progress |

## Architecture

- **Architecture Version:** 1.0 (Frozen)
- **Current Phase:** Phase 6 — Hardening
- **Application Version:** 0.3.0

### Security Philosophy

- **AI is advisory only**: AI cannot execute operational commands.
- **Input Sanitization**: AI input is sanitized before prompt construction to prevent prompt injection and remove PII.
- **Strict Boundaries**: Unauthorized requests fail before business logic.
- **Graceful Failures**: Internal errors are never exposed to clients (e.g., stack traces, SQL errors).

### Performance Philosophy

- **Resilient AI**: All network-bound AI calls enforce strict timeouts (10-15s) with deterministic fallbacks to ensure dashboards never hang.
- **Optimized Data Retrieval**: Dashboard metrics are grouped and cached to prevent N+1 queries and excessive database load during auto-refresh intervals.
- **Deterministic Caching**: Cache invalidation is driven by business logic mutations rather than arbitrary time-to-live expirations.

## Technology Stack

| Technology      | Purpose         |
| :-------------- | :-------------- |
| Next.js 16      | Framework       |
| TypeScript      | Language        |
| Tailwind CSS v4 | Styling         |
| shadcn/ui       | Components      |
| Supabase        | Database & Auth |
| Prisma          | ORM             |
| Vercel AI SDK   | AI Gateway      |
| Google Gemini   | LLM Provider    |
| Zod             | Validation      |
| Vitest          | Unit Testing    |
| Playwright      | E2E Testing     |

## Development

### Prerequisites

- **Node.js** ≥ 24 (see `.nvmrc`)
- **pnpm** ≥ 11

### Getting Started

```bash
# Clone the repository
git clone https://github.com/KumarNayan11/fifa-coos.git
cd fifa-coos

# Install dependencies
pnpm install

# Setup Database & Seed Auth Users
# This creates Supabase accounts and maps them to Prisma:
# - ops@example.com / password123
# - security@example.com / password123
# - volunteer@example.com / password123
pnpm db:seed

# Start the development server
pnpm dev
```

### Available Commands

| Command             | Description                      |
| :------------------ | :------------------------------- |
| `pnpm dev`          | Start Next.js development server |
| `pnpm build`        | Create production build          |
| `pnpm start`        | Start production server          |
| `pnpm lint`         | Run ESLint                       |
| `pnpm typecheck`    | Run TypeScript type checking     |
| `pnpm format`       | Format all files with Prettier   |
| `pnpm format:check` | Check formatting without writing |
| `pnpm test`         | Run unit tests (Vitest)          |
| `pnpm test:watch`   | Run tests in watch mode          |
| `pnpm test:ui`      | Open Vitest UI                   |
| `pnpm test:e2e`     | Run E2E tests (Playwright)       |

### Project Structure

```
src/
├── app/                    # Next.js App Router (pages, layouts, error handling)
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Card, Badge, etc.)
│   └── shared/             # Complex shared components
├── config/                 # App config, navigation, constants, feature flags
├── features/               # Domain-organized feature modules
├── hooks/                  # Global React hooks
├── lib/                    # Shared utilities (cn, helpers, metadata)
├── services/               # Shared business logic
├── styles/                 # Design tokens
└── types/                  # Global TypeScript definitions
```

### Environment Variables

Copy `.env.example` to `.env` and configure the required variables. See the `.env` file for documentation on each variable.

**AI Configuration:**

- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Gemini API Key (required).
- `GEMINI_MODEL`: (Optional) The specific Gemini model ID to use across all copilots (defaults to `gemini-flash-latest`).

### Documentation

- [Architecture](docs/architecture/ARCHITECTURE.md)
- [System Design](docs/architecture/SYSTEM_DESIGN.md)
- [AI Architecture](docs/architecture/AI_ARCHITECTURE.md)
- [Developer Guide](docs/development/DEVELOPER_GUIDE.md)
- [Implementation Plan](docs/planning/IMPLEMENTATION_PLAN.md)
- [Technology Decisions](docs/planning/TECHNOLOGY_DECISIONS.md)
- [Phase Checklists](docs/development/PHASE_CHECKLISTS.md)
- [Changelog](docs/CHANGELOG.md)
