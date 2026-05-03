# 🧠 Ajeya AI — Project Governance & Architecture

> Version 1.0 | Hackathon MVP → scalable post-MVP

---

## Folder Structure

```

packages/
├── client/      # Frontend
├── server/      # Backend
├── shared/      # Shared types
docs/
.github/
docker/

```

Key files:

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `docs/ARCHITECTURE.md`, `API_REFERENCE.md`, `AI_PROMPTING_GUIDE.md`

---

## Naming Conventions

| Concern | Convention | Example |
|---------|------------|---------|
| Folders | kebab-case | `feature-ideas/` |
| React components | PascalCase.tsx | `FeatureIdeaCard.tsx` |
| Other TS files | camelCase.ts | `promptBuilder.ts` |
| Backend modules | module.role.ts | `ai.service.ts` |
| Test files | *.test.ts | `jsonValidator.test.ts` |
| Type files | *.types.ts | `aiResult.types.ts` |
| Constants | SCREAMING_SNAKE_CASE | `CONTEXT_CHAR_LIMIT` |
| Interfaces/Enums | PascalCase | `FeedbackSignal` |

---

## Backend Module Pattern

```

modules/<name>/ <name>.routes.ts <name>.controller.ts <name>.service.ts <name>.model.ts <name>.validator.ts

````

Rules:

- Controller is thin (<10 lines)
- Service handles all business logic
- Validation via Zod middleware only
- Never put `req`/`res` in service

---

## Coding Standards

- TypeScript: strict mode, no `any`, shared types from `packages/shared`
- React: functional components, Redux slices for cross-component state
- Error handling: AppError + asyncHandler
- API response shape:

```ts
// Success
{ success: true, data: T, message?: string }
// Error
{ success: false, error: string, code?: string }
````

---

## Environment Variables

* Server: PORT, NODE_ENV, MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, GEMINI_MODEL, GEMINI_MAX_TOKENS, GEMINI_TIMEOUT_MS, FREE_TIER_DAILY_LIMIT, REDIS_URL (post-MVP), CORS_ORIGIN, LOG_LEVEL
* Client: VITE_API_BASE_URL, VITE_APP_ENV
* Validated via `env.config.ts` using Zod

---

## Git Workflow

* Branches: main, dev, feature/<name>, fix/<name>, chore/<name>
* Conventional commits:

```
<type>(<scope>): <short imperative description>
```

* Hackathon exception: short-lived branches from main allowed

---

## PR & Issue Templates

* PR checklist: enforce module patterns, naming, shared types, MVP scope
* Bug and feature request templates in `.github/ISSUE_TEMPLATE/`

---

## Testing

* Jest for unit
* Supertest for integration
* Focus on AI modules, promptBuilder, and core services

---

## MVP vs Post-MVP

* Strict enforcement of MVP scope
* Post-MVP features deferred: Redis, multi-turn AI, PDF parsing, OAuth, billing
