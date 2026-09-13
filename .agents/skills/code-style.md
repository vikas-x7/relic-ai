# Code Style Guidelines

## TypeScript

- Strict mode; no `any` in application code (use `unknown` plus narrowing)
- Prefer `interface` for object shapes, `type` for unions and intersections
- Named exports for utilities and hooks; default exports for React components
- Type imports use `import type { ... }`
- Avoid non-null assertions; narrow instead

## React Components

- `'use client'` at the top of any component that uses hooks, effects, or browser APIs
- One component per file; props interface declared in the same file
- Components are `PascalCase.tsx` with default exports (`ChatNode.tsx`, `MessageActions.tsx`)
- Hooks are `camelCase.ts` with a `use` prefix — `useChatStream.ts`, not `use-chat-stream.ts`
- Functional components only
- Derive state instead of duplicating it in `useState`; use `useCallback` for handlers passed to memoized children

## Module Structure

Every feature module follows this shape:

```
src/modules/<feature>/
├── components/   # PascalCase.tsx components
├── hooks/        # useXxx.ts hooks
├── api/          # API client functions (chat.ts, conversations.ts)
├── utils/        # Pure helpers
└── types.ts      # Module-local types
```

## Imports

- Use the `@/` alias for cross-directory imports
- Order: external libraries, then internal modules, then types
- No barrel-file imports across modules — import from the specific file

## State Management

- Server state lives in TanStack Query, never in a bare `useEffect` fetch
- Mutations invalidate the relevant query keys; don't manually sync caches
- Reuse `useRefState` and `useTextSelection` instead of re-implementing them

## Styling

- Tailwind CSS only — no CSS modules, no CSS-in-JS, no inline style objects beyond what React Flow requires
- Reuse the existing palette and spacing scale; do not introduce new arbitrary hex values
- Match the landing page's light theme and `font-cabin` treatment
- Keep the responsive type scale consistent (`text-[9px]` → `md:text-[16px]`)

## Backend

- ESM TypeScript; controllers stay thin, services hold business logic
- Validate request input with Zod in `schemas/` before it reaches a service
- Throw `AppError` subclasses for expected failures — never build ad-hoc response objects
- Log via `lib/logger.ts`; never `console.log`; never log tokens, secrets, or message content
- `process.env` is read in exactly one place: `config/env.ts`

## Agent

- One graph node per file in `nodes/*.node.ts`, returning a partial `ChatState`
- Prompt text lives in `prompts/*.prompt.ts` as an exported template string
- Put anything that touches an external service behind a provider interface in `search/` or `models/`
- Model output is untrusted — validate it before rendering or persisting

## Database

- Access goes through the `db` package's Prisma client; no raw SQL outside migrations
- Schema changes require a generated migration committed alongside `schema.prisma`
- Never edit an already-applied migration

## Git Commits

- Format: `type: description`, optional scope — `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`, `test:`
- Match the scope to the app you touched: `feat(landing):`, `fix(server):`, `fix(web):`
- Keep commits atomic and focused on one change
- Husky pre-commit runs `lint-staged` (Prettier + ESLint) — fix the files instead of using `--no-verify`
