# FIFACoOS

FIFA Copilot Operating System

An AI-powered Smart Stadium & Tournament Operations Platform built for PromptWars Challenge 4.

FIFACoOS leverages Generative AI to provide intelligent decision support for fans, organizers, volunteers, venue staff, and emergency responders during the FIFA World Cup 2026. Rather than functioning as a simple chatbot, the platform acts as an operational copilot by synthesizing real-time stadium context, predicting operational challenges, and delivering actionable recommendations across crowd management, navigation, accessibility, transportation, multilingual assistance, sustainability, and incident response.

## Project Status

| Phase                        | Status         |
| :--------------------------- | :------------- |
| Phase 0: Repository Init     | ✅ Complete    |
| Phase 1: Platform Foundation | 🟡 In Progress |
| Phase 2: Fan Copilot         | ⬜ Not Started |
| Phase 3: Ops Command Center  | ⬜ Not Started |
| Phase 4: Volunteer Assistant | ⬜ Not Started |
| Phase 5: Polish              | ⬜ Not Started |
| Phase 6: Hardening           | ⬜ Not Started |
| Phase 7: PromptWars Submit   | ⬜ Not Started |

## Architecture

- **Architecture Version:** 1.0 (Frozen)
- **Current Phase:** Phase 1 — Platform Foundation
- **Application Version:** 0.2.0

## Technology Stack

| Technology      | Purpose          |
| :-------------- | :--------------- |
| Next.js 16      | Framework        |
| TypeScript      | Language         |
| Tailwind CSS v4 | Styling          |
| shadcn/ui       | Components       |
| Supabase        | Database & Auth  |
| Prisma          | ORM              |
| Vercel AI SDK   | AI Gateway       |
| Google Gemini   | LLM Provider     |
| Zod             | Validation       |
| Zustand         | State Management |
| Mapbox GL JS    | Maps             |
| Vitest          | Unit Testing     |
| Playwright      | E2E Testing      |

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

### Documentation

- [Architecture](docs/architecture/ARCHITECTURE.md)
- [System Design](docs/architecture/SYSTEM_DESIGN.md)
- [AI Architecture](docs/architecture/AI_ARCHITECTURE.md)
- [Developer Guide](docs/development/DEVELOPER_GUIDE.md)
- [Implementation Plan](docs/planning/IMPLEMENTATION_PLAN.md)
- [Technology Decisions](docs/planning/TECHNOLOGY_DECISIONS.md)
- [Phase Checklists](docs/development/PHASE_CHECKLISTS.md)
- [Changelog](docs/CHANGELOG.md)
