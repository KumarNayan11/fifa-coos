# FIFACoOS Manual Testing Guide

This guide explains how to set up, seed, and manually verify the application locally.

## Prerequisites

- Node.js 20+
- pnpm
- Supabase project credentials

## Environment Variables

Ensure you have a .env file in the root with the following:
`

# Database Connection

DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[project-id]:[password]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# Auth

OPS_USERNAME="admin"
OPS_PASSWORD="password123"
`

## Startup Commands

1. **Install Dependencies:** pnpm install
2. **Seed the Database:** pnpm db:seed
3. **Start the Dev Server:** pnpm dev

## Demo Credentials

After running the seed command, three demo accounts are generated directly in Supabase Auth and linked to the application roles.

- **Operations Manager:** `ops@example.com` / `password123`
- **Security Officer:** `security@example.com` / `password123`
- **Volunteer:** `volunteer@example.com` / `password123`

## Routes & Expected Results

| Route        | Purpose              | Expected Result                                                                              |
| ------------ | -------------------- | -------------------------------------------------------------------------------------------- |
| /            | Landing Page         | Displays product marketing, calls to action, and links to /fan and /ops.                     |
| /fan         | Fan Portal           | Dashboard with "Navigation", "Wait Times", and "Instant Answers" (some are UI placeholders). |
| /fan/copilot | AI Copilot           | Chat interface connecting to the AI agent to ask questions about the venue.                  |
| /ops         | Operations Dashboard | Requires login (prompts /login). Displays incident metrics and status.                       |
| /ops/login   | Staff Login          | Accepts valid Supabase credentials (e.g. `ops@example.com` / `password123`).                 |

## Verification Checklist

- [ ] Ensure `.env` is configured correctly.
- [ ] Run `pnpm db:seed` successfully without database connection errors.
- [ ] Navigate to `http://localhost:3000` and verify the UI loads.
  - [ ] Verify the landing page reflects implemented functionality (Operations link is active).
- [ ] Click through `/fan` and open `/fan/copilot` and type a message.
- [ ] Verify unauthorized users cannot access `/ops` (redirects to `/ops/login`).
- [ ] Login with `ops@example.com` / `password123` and verify successful redirect to `/ops`.
- [ ] Create a new incident via "Report Incident".
  - [ ] Verify unauthorized users cannot invoke protected Server Actions.
  - [ ] Verify database errors are not leaked (e.g. Server errors should only return generic fallback messages).
  - [ ] Verify dashboard metrics increment correctly.
- [ ] Test AI Security Guardrails:
  - [ ] Submit a prompt injection attempt (e.g. "ignore previous instructions").
  - [ ] Verify the AI copilot rejects the attempt and falls back to a deterministic response.
  - [ ] Submit PII (e.g., an email address).
  - [ ] Verify the AI does not expose or return the PII, and handles it securely.
- [ ] Open the Incident Details page by clicking "Inspect" on the new incident.
- [ ] Confirm AI recommendation renders with:
  - [ ] confidence
  - [ ] reasoning
  - [ ] recommended action
- [ ] Assign the incident to a seeded demo user.
- [ ] Resolve the incident with notes.
- [ ] Close the incident.
- [ ] Confirm timeline updates after every transition.
- [ ] Verify browser refresh preserves expected state.

## Architecture Notes & Decisions

- **Supabase Auth:** The MVP uses `@supabase/ssr` for session management and authentication.
- **Authoritative Roles:** The application uses Prisma's `users` table as the authoritative source for roles, checking it on each authenticated session.
- **RLS Integration:** Database RLS is enabled, but user-scoped RLS enforcement through Prisma is intentionally bypassed for the MVP, relying entirely on application-level enforcement (`requireOps()`).
- **Prisma Seeding:** The seed process automatically creates users in Supabase `auth.users` and maps their IDs to Prisma.
