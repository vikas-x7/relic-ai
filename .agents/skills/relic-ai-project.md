# Relic AI Project Context

## Overview

Relic AI is a spatial canvas for AI conversations, built as a Turborepo + pnpm monorepo. Every idea is a node on an infinite canvas instead of a line in a chat log: users branch a thread mid-sentence, drag nodes around, and the agent answers with web-grounded, citation-validated responses backed by persistent per-user memory.

## Architecture

- Monorepo: Turborepo + pnpm workspaces, TypeScript throughout
- Frontend: Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + React Flow in `apps/web`
- Backend: Hono 4 (ESM) on the `hono/vercel` adapter, mounted in a single catch-all Next.js route at `app/api/[[...route]]/route.ts`
- Database: PostgreSQL with Prisma 7 (`@prisma/adapter-pg`) in `packages/db`
- Agent: LangGraph `StateGraph` compiled and memoized in `apps/server/agent/orchestration/chat.graph.ts`

## Key Patterns

### Frontend Module Structure

Every feature follows this structure:

```
src/modules/<feature>/
├── components/    # PascalCase.tsx UI components
├── hooks/         # camelCase useXxx.ts hooks
├── api/           # API client functions
├── utils/         # Pure helpers
└── guards/        # Route guards (auth only)
```

Page files in `app/` are thin wrappers around these modules.

### Frontend Libraries

- Server state: `@tanstack/react-query` (`useConversations`, `useChatWorkspace`, `useAuth`)
- Canvas: `@xyflow/react` — `ChatCanvas`, `ChatNode`, `useCanvasState`, `useCanvasConnections`
- HTTP: `axios` with a `withCredentials` interceptor that does 401 → single-flight refresh → replay
- Icons: `react-icons`
- Fonts/images: local assets under `apps/web/public` and `next/font`

### Agent Pipeline

```
START → understand-query
  ├─ needsWebSearch → search → analyze-sources → generate-answer
  └─ otherwise →─────────────────────────────→ generate-answer
generate-answer
  ├─ webUsed && sources → validate-citations → END
  └─ otherwise → END
```

- `nodes/*.node.ts` — one file per graph node, each returns a partial `ChatState`
- `prompts/*.prompt.ts` — exported template strings, no logic
- `state/chat.state.ts` — `Annotation.Root` state shared across nodes
- `search/`, `models/`, `citations/`, `memory/` — provider interfaces with swappable implementations

### Styling Rules

- Tailwind CSS only, no CSS modules or CSS-in-JS
- Landing page uses `font-cabin`; the design is light-themed with near-black text on white
- Small responsive type scale: `text-[9px]` on mobile up to `md:text-[54px]` on desktop for headings
- Buttons: `bg-[#000000] text-white rounded-[3px]` with a `react-icons` arrow
- Reuse the existing palette instead of introducing new hex values

### Backend Patterns

- Modular structure under `apps/server/modules/<feature>/`: `routes/`, `controllers/`, `services/`, `schemas/`
- Service layer for business logic; controllers stay thin
- Zod validation for env config (`config/env.ts`) and every request body
- Errors: throw `AppError` subclasses, let `errors/error-handler.ts` map them to the `{ success, error: { code, message, requestId } }` envelope
- Logging: `lib/logger.ts` (Pino) with redaction — never `console.log`, never log message content
- ESM TypeScript (`type: module`), `@/` alias to the app root

### Auth

- Google + GitHub OAuth 2.0, hand-rolled in `modules/auth/oauth/oauth.ts`
- PKCE (S256) for Google; signed state JWT plus a double-submit cookie
- `hono/jwt` HS256 access token (15m) and refresh token (15d), rotated on every refresh, revocable via `revokedAt`
- Cookies: `httpOnly`, `secure` in production, `sameSite: 'None'` in production for cross-subdomain, `domain` from `COOKIE_DOMAIN`

## Commands

```bash
pnpm dev                       # Start all apps in dev mode
pnpm build                     # Build all apps and packages
pnpm lint                      # Lint all apps and packages
pnpm check-types               # Type-check all apps and packages
pnpm format                    # Format code with Prettier
pnpm --filter web dev          # Frontend only (port 3000)
pnpm --filter server dev       # API only (port 3001)
pnpm --filter server test      # Server tests (Jest)
pnpm --filter db db:generate   # Regenerate Prisma client
pnpm --filter db db:migrate    # Create and apply a migration
```

## Shared Config

- `apps/server/.env`: `NODE_ENV`, `LOG_LEVEL`, `SERVER_URL`, `WEB_URL`, `CORS_ORIGINS`, `COOKIE_DOMAIN`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `OAUTH_STATE_EXPIRES_IN`, `DATABASE_URL`, `GOOGLE_*`, `GITHUB_*`, `NVIDIA_API_KEY`, `LLM_*`, `TAVILY_API_KEY`
- `packages/db/.env`: `DATABASE_URL` plus the `DATABASE_POOL_*` / `DATABASE_LOGGING` / `DATABASE_DEBUG` knobs
- `apps/web/.env.local`: `NEXT_PUBLIC_API_URL` (includes the `/api` suffix)

## Gotchas

- `packages/db/generated/` is gitignored — run `db:generate` after a fresh clone or any schema change
- There is no `test` task in `turbo.json`, so `turbo test` is a no-op; run `pnpm --filter server test`
- `turbo.json` `globalEnv` does not list every variable in `config/env.ts` — add new ones there too, or build caching will not see them
- Sending a message is synchronous: the API returns the full assistant message, and `useChatStream` / `revealStream.ts` do a client-side reveal to fake streaming
- `@/` in `apps/server` resolves to the app root; in `apps/web` it resolves to `apps/web`
- Tests map the `db` import to `tests/mocks/db.ts`, so any new service that touches Prisma needs a mock in the test setup
- Commit messages must stay conventional: `type: description` with an optional scope
