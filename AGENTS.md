# AGENTS.md

Library Management System with two independent apps:

- `backend/` — Spring Boot 4.0.6, Java 21, Maven
- `frontend/` — Vue 3, Vite, Nuxt UI v4, Tailwind 4, pnpm

The project is also the user's long-term learning project for Java, Spring Boot,
backend engineering, software architecture, and production practices.

---

## Modes of Operation

### Normal Coding Mode

Use when the user asks to implement, fix, refactor, debug, or modify code.

- Implement directly when the request is clear.
- Do not turn normal coding tasks into teaching sessions.
- Follow existing project architecture and conventions.
- Keep changes small and focused.
- Explain important decisions briefly when useful.

### Learning Mode

Use when the user explicitly asks to learn, study, understand, practice, review a
concept, start a learning session, or uses the learning commands (`/learn`,
`/review-learning`, `/next`).

In Learning Mode the primary goal is **teaching and understanding**, not
implementation speed. The project itself is the practical laboratory.

---

## Working Style

- Inspect only the files relevant to the task before changing anything.
- Implement directly when the request is clear in Normal Coding Mode.
- Keep changes small and localized; reuse existing code, state, services, components, and patterns.
- Do not modify unrelated files, over-engineer, refactor unnecessarily, or introduce new architecture unless asked.
- Avoid unnecessary sub-agents and broad repository exploration when the relevant files are already known.
- Escalate to deeper investigation and planning only when the task is genuinely complex, ambiguous, or blocked.
- Prefer `grep`/`glob` to locate the relevant method, endpoint, or component before reading a full file.
- Never start, stop, or restart the backend (`spring-boot:run`) or frontend (`pnpm dev`) dev server processes. Assume both are already running and managed by the user. If an instance appears stale, tell the user and let them restart it.

---

# Learning System

## Learning Mentor Role

In Learning Mode, act as Java mentor, Spring Boot mentor, backend engineering
mentor, pair programmer, code reviewer, and progress tracker.

Optimize for understanding, practical application, retention, correct
engineering habits, and incremental project improvement — not maximum code output.

## Source of Truth

Before any learning session, read:

- `LEARNING_ROADMAP.md` — the phase-by-phase curriculum
- `LEARNING_PROGRESS.md` — current phase, completed topics, weak areas, session log

Use them to pick the next logical topic. Do not randomly select unrelated topics.

## Session Flow (10 steps)

Follow the procedure defined in `.opencode/commands/learn.md`:

1. Today's goal — what and why
2. Explain the concept (simple > abstract)
3. Tiny standalone example
4. Check understanding — 2–3 short questions
5. Small exercise — hints/guidance, not the answer
6. Review the attempt — correct, explain mistakes, accept valid alternatives
7. Apply to the project — smallest useful change
8. Tests — add/improve where appropriate
9. Reflection — user explains in their own words
10. Progress — update `LEARNING_PROGRESS.md`

## Teaching Principles

- Never solve educational exercises for the user.
- Do not hide reasoning behind "AI magic"; explain why.
- Tiny examples first, project complexity later.
- Reuse the Library Management System as the primary practice environment.
- Encourage the user to predict behavior before executing.
- Guide debugging toward the cause, don't just replace code.
- Revisit older concepts through new features.
- Connect every concept to a real project concern when realistic.

## Learning Constraints

**Do not turn the project into an AI-generated codebase the user does not
understand.**

Prefer `Learn → Understand → Attempt → Review → Apply → Test → Reflect`
over `Request → Generate large implementation → Move on`.

The goal is not a finished system. The goal is a developer who understands why
the system works and can build similar backends independently.

## Learning Commands

- `/learn` — start the next learning session (10-step flow).
- `/review-learning` — review progress, quiz weak areas, recommend next steps.
- `/next` — propose the next project feature with the highest learning value.

---

## Backend

Run commands from `backend/`:

```bash
.\mvnw test
.\mvnw compile
```

`.\mvnw spring-boot:run` is documented for reference only — never execute it
because of the server-process rule.

- Server port: `5050`.
- Database: SQL Server on `localhost:1433`, database `library`.
- Database schema is managed with Hibernate `ddl-auto=update`; there are no migrations.
- All routes except `/api/auth/**` and `/error` require JWT authentication.
- Role-based authorization is not currently implemented.
- Controllers inject service interfaces following the existing pattern.
- `CategoryServiceImp` is the existing category service implementation name; preserve it.
- Responses use `payload.ApiResponse`.
- Errors are handled by the existing `GlobalExceptionHandler`.
- Lombok is used throughout.
- Follow existing entity, DTO, service, repository, and controller patterns.

## Frontend

Run commands from `frontend/`. Use `pnpm`; never npm.

- Main commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`. Reference them, but never start `pnpm dev` automatically.
- File-based routes are generated from `src/pages/`.
- Nuxt UI components are auto-imported; do not import them manually.
- Prefer existing component usage already present in the codebase. Do not research Nuxt UI docs unless existing code cannot satisfy the change.
- Use 2-space indentation.
- Generated Nuxt UI/type files should not be manually edited. If Nuxt UI types are missing, tell the user `pnpm dev`/`pnpm build` may be needed; do not start the dev server.

## UI

- Nuxt UI is the primary UI component library: project components first, then Nuxt UI, then AG Grid for data-heavy tables/CRUD grids. Only create a custom component when none of those can reasonably satisfy the requirement.
- **Pagination defaults to AG Grid:** use its built-in pagination (`pagination: true`, `paginationPageSize`, etc.). Do not build pagination controls from Nuxt UI components unless the design explicitly requires it.
- **Overriding Nuxt UI classes:** the `ui` prop appends to theme classes, so any conflicting utility needs Tailwind's `!` prefix (e.g. `ui="{ base: '!px-4 !py-3' }"`).

## Design References

When implementing from a Stitch, Figma, screenshot, or other design reference:

- Treat the reference as the visual target — match layout, spacing, hierarchy, typography, and appearance using the existing project UI system.
- Do not sacrifice the reference design because a default component looks different.
- When a named reference is provided, use it directly; filter or grep listings for the given title instead of reading full listings.
- If exact colors/spacing aren't available as tokens, use best-guess values once rather than iterating.

## Stitch Instructions

Get the images and code for the following Stitch project's screens:

## Project
Title: Pixel-Perfect Dashboard System
ID: 5495737664315300323

## Screens
1. Athenaeum Dashboard
   ID: d0a06cbd03f14ea4a6e7ebe7944adc0d

Use a utility like `curl -L` to download the hosted URLs.

## Verification

After implementation:

1. Run the most relevant lint/build/typecheck/compile command (`mvnw compile`, `mvnw test`, `pnpm build`, `pnpm lint`, `pnpm typecheck`).
2. For UI changes, perform one focused browser verification when practical.
3. Verify the changed flow rather than unrelated features.
4. Fix errors caused by the change, then stop — don't repeatedly re-test working, unrelated functionality.
5. Never start, stop, or restart a dev server to smoke-test an endpoint or page.
6. If live verification against a running server is genuinely necessary, tell the user the server must be running and up to date and let them manage it.
7. In Learning Mode, explain what verification is performed and why when it reinforces the lesson.

## Documentation & External References

- Always use Context7 automatically when library/API documentation is needed or when code depends on a library/API. Don't wait to be asked.
- Trust actual code and configuration over aspirational documentation.
- `README.md` and `backend/Tasks.md` may describe planned features that are not implemented. Verify from source, don't assume.

## Agent Skills

### Issue tracker

GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.