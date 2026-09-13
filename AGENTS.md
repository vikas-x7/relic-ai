# AGENTS.md

Guide for AI coding agents working in this repository. Read this before making changes, then read the skills in [`.agents/skills/`](.agents/skills/) for deeper context.

## Project Overview

Relic AI is a spatial canvas for AI conversations. Every idea is a node on an infinite canvas rather than a line in a chat log — users branch mid-thought, and the agent answers with web-grounded, citation-validated responses backed by persistent per-user memory.

Turborepo + pnpm monorepo. Next.js 16 frontend, Hono 4 API, PostgreSQL via Prisma 7, LangGraph for agent orchestration.

## Repository Structure

```
relic-ai/
├── apps/
│   ├── web/           # Next.js 16 frontend (App Router), React 19, Tailwind 4, React Flow
│   └── server/        # Hono 4 API on the Vercel adapter + LangGraph agent
├── packages/
│   ├── db/            # Prisma 7 schema, migrations, pg pool (package name: "db")
│   ├── eslint-config/ # @repo/eslint-config
│   └── typescript-config/ # @repo/typescript-config
├── .agents/skills/    # Agent-facing project + style context
├── .github/           # Contribution, security, and issue templates
└── turbo.json         # Turborepo config
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, `@xyflow/react` (canvas), TanStack Query, Axios
- **Backend**: Hono 4 (ESM) mounted on `hono/vercel`, Zod, Pino
- **Agent**: LangGraph `StateGraph`, `@langchain/openai` against an OpenAI-compatible endpoint, Tavily web search
- **Database**: PostgreSQL, Prisma 7 with `@prisma/adapter-pg`
- **Auth**: `hono/jwt` (HS256) + hand-rolled Google/GitHub OAuth 2.0 with PKCE, httpOnly cookies
- **Tooling**: Turborepo, pnpm workspaces, ESLint 9 (flat config), Prettier 3, lint-staged, Husky, Jest 30 + ts-jest
- **Language**: TypeScript 5 throughout

## Key Conventions

### File Naming

- React components: `PascalCase.tsx` (e.g., `ChatNode.tsx`, `CanvasToolbar.tsx`)
- Hooks: `useXxx.ts` in camelCase (e.g., `useChatStream.ts`, `useNodeOperations.ts`) — note: **not** `use-xxx.ts` in this repo
- Backend: `kebab-case.ts` with role suffixes (e.g., `chat.service.ts`, `auth.controller.ts`, `analyze-sources.node.ts`)
- Types: `*.types.ts` colocated with the module

### Frontend Module Pattern

Each feature lives in `apps/web/src/modules/<feature>/`:

```
modules/
├── auth/      # Auth.tsx, api/, hooks/useAuth.ts, guards/AuthGuard.tsx, schemas/
├── chat/      # Chat.tsx, api/, components/, hooks/, utils/, types.ts, constants.ts
└── landing/   # LandingPage.tsx, components/
```

Files in `app/` are thin wrappers that render a module component (`app/chat/page.tsx` → `<Chat />`).

### Frontend Rules

- `'use client'` for client components; keep server components server-side
- Tailwind only, no CSS modules
- Server state via TanStack Query; never fetch in a bare `useEffect`
- The axios client already handles 401 → single-flight refresh → replay. Don't add ad-hoc auth logic
- Assistant output is untrusted text — rendering it must stay XSS-safe

### Backend Rules

- Modules in `apps/server/modules/<feature>/` with `routes/`, `controllers/`, `services/`, and Zod `schemas/`
- Services hold business logic; controllers are thin
- Validate all input with Zod
- Throw `AppError` subclasses; the global handler in `errors/` maps them to responses
- Log through `lib/logger.ts`, never `console.log`; never log tokens or message content
- `config/env.ts` is the only place that reads `process.env`

### Agent Graph

`agent/orchestration/chat.graph.ts` (compiled once, memoized):

```
START → understand-query
  ├─ needsWebSearch → search → analyze-sources → generate-answer
  └─ otherwise ────────────────────────────────→ generate-answer
generate-answer
  ├─ webUsed && sources → validate-citations → END
  └─ otherwise → END
```

- Nodes: `agent/nodes/*.node.ts`, each returning a partial `ChatState`
- Prompts: `agent/prompts/*.prompt.ts` as exported template strings
- State: `agent/state/chat.state.ts`
- External services behind provider interfaces in `agent/search/` and `agent/models/`

### Git Conventions

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`, `test:`
- Optional scope, matching the app you touched: `feat(landing):`, `fix(server):`
- Atomic, focused commits with a clear subject
- Husky pre-commit runs `lint-staged` (Prettier + ESLint on staged files)

## Common Tasks

### Adding a page

1. Create or extend a module in `apps/web/src/modules/<name>/`
2. Add the component, hooks, and API functions as needed
3. Add a thin `page.tsx` in `apps/web/app/<name>/`

### Adding an API endpoint

1. Add a Zod schema in `modules/<feature>/schemas/`
2. Add the service method in `modules/<feature>/services/`
3. Add the controller and register the route in `modules/<feature>/routes/`
4. If it needs new data, change the Prisma schema and run `pnpm --filter db db:migrate`

### Adding an agent capability

1. Write the prompt in `agent/prompts/`
2. Add or modify a node in `agent/nodes/`
3. Wire the new edge in `agent/orchestration/chat.graph.ts`
4. Extend `ChatState` if new state is threaded through

### Adding an environment variable

1. Add it to `apps/server/config/env.ts` with a validation helper
2. Document it in `apps/server/example.env`
3. Add it to `turbo.json` `globalEnv` so Turborepo tracks it in the cache key

## Commands

```bash
pnpm dev                          # Start all apps
pnpm build                        # Build all
pnpm lint                         # Lint all
pnpm check-types                  # Type-check all
pnpm format                       # Format with Prettier
pnpm --filter web dev             # Frontend only (port 3000)
pnpm --filter server dev          # API only (port 3001)
pnpm --filter server test         # Server tests (Jest)
pnpm --filter db db:generate      # Regenerate the Prisma client
pnpm --filter db db:migrate       # Create and apply a migration
```

## Environment Variables

- **Server** (`apps/server/.env`, template at `apps/server/example.env`): `NODE_ENV`, `LOG_LEVEL`, `SERVER_URL`, `WEB_URL`, `CORS_ORIGINS`, `COOKIE_DOMAIN`, `JWT_SECRET`_, `REFRESH_TOKEN_SECRET`_, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `OAUTH_STATE_EXPIRES_IN`, `DATABASE_URL`_, `GOOGLE_CLIENT_ID`/`_SECRET`, `GITHUB_CLIENT_ID`/`_SECRET`, `NVIDIA_API_KEY`_, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_TEMPERATURE`, `LLM_TOP_P`, `LLM_MAX_TOKENS`, `TAVILY_API_KEY`, `TAVILY_MAX_RESULTS` (* = required)
- **Database** (`packages/db/.env`, template at `packages/db/.env.example`): `DATABASE_URL`*, `DATABASE_POOL_MAX`, `DATABASE_POOL_IDLE_TIMEOUT_MS`, `DATABASE_POOL_CONNECTION_TIMEOUT_MS`, `DATABASE_LOGGING`, `DATABASE_DEBUG`
- **Web** (`apps/web/.env.local`, template at `apps/web/.env.example`): `NEXT_PUBLIC_API_URL` (must include the `/api` prefix)

## Important Notes

- Never commit `.env` files. Commit only the `example.env` / `.env.example` templates.
- The web app and the API run on different ports in development (3000 and 3001)
- `apps/web/.env.local` is read by Next.js — it must be `.env.local`, not `.env`
- The API returns a full JSON response for a message; the streaming effect in the UI is a client-side reveal, not a server stream
- `packages/db/generated/` is gitignored — run `pnpm --filter db db:generate` after a fresh clone or a schema change
- All conversation routes enforce per-user ownership server-side
- Model output is rendered in the browser; treat it as untrusted input
