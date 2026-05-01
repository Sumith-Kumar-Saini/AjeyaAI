# Contributing to Ajeya_AI 🚀

Welcome to **Ajeya_AI**! This guide helps you quickly contribute to our hackathon MVP — code, docs, tests, and AI prompts — while keeping the project clean, structured, and MVP-focused.

---

## 1. Getting Started

### Local Dev Setup

1. **Clone the repo**
```bash
git clone git@github.com:our-org/ajeya_ai.git
cd ajeya_ai
````

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment**

* Copy `.env.example` → `.env` in `packages/server` and `packages/client`.
* Fill in required values (MongoDB URI, JWT secret, Gemini API key, etc.)
* MVP tip: leave post-MVP vars (Redis, OAuth, etc.) empty.

4. **Run locally**

```bash
# Backend
npm run dev --workspace packages/server

# Frontend
npm run dev --workspace packages/client
```

5. Open [http://localhost:5173](http://localhost:5173) and enjoy.

---

## 2. Coding Standards

### Frontend (React + TypeScript)

* Functional components only; one per file, `PascalCase.tsx`.
* Props interface above the component.
* State: `useState` for local, Redux slices for global.
* Use Tailwind utilities — no custom classes in MVP.
* Example component placement:

```
packages/client/src/components/ai/FeatureIdeaCard.tsx
```

### Backend (Node.js + JavaScript)

* Module-first pattern:

```
modules/<name>/
  <name>.routes.js
  <name>.controller.js  # thin (<10 lines)
  <name>.service.js     # all business logic
  <name>.model.js
  <name>.validator.js   # Zod schemas
```

* Controllers: only parse request, call service, send response.
* Services: never touch `req`/`res`; throw `AppError` on failure.
* Shared types: `packages/shared/src/types/`. Do **not** duplicate.

### TypeScript & JS Rules

* `strict: true`; no `any` (use `unknown` + guards)
* Async functions return `Promise<T>` explicitly.
* Logging: use `logger` (Pino), not `console.log`.
* API response shape **must** follow:

```ts
{ success: true, data: T, message?: string }
{ success: false, error: string, code?: string }
```

---

## 3. Writing AI Prompts

* Use **`promptBuilder.ts`** only; never inline prompts.
* Include project context and question.
* Follow **MVP constraints**: single-turn only, no post-MVP features.
* Reject any AI-generated suggestion that:

  * Violates module patterns
  * Adds post-MVP features (Redis, multi-turn Q&A, OAuth)
  * Duplicates shared types
* Quick starter snippet for backend module:

```ts
// ai.service.ts
const result = await gemini.analyze(promptBuilder.build(question, context));
const validated = jsonValidator.validate(result);
```

---

## 4. Testing Guidelines

* **Unit tests**: Jest (`packages/server/tests/unit`)
* **Integration tests**: Supertest (`packages/server/tests/integration`)
* Always mock external AI calls; validate schema before storing.
* Test new features before PR submission.
* Example:

```ts
describe('aiService', () => {
  it('parses Gemini JSON correctly', async () => {
    const result = await aiService.analyze(mockDto, mockUser);
    expect(result.featureIdeas).toBeDefined();
  });
});
```

---

## 5. Git Workflow

### Branches

```
main           # production, protected
dev            # integration
feature/<name> # new features
fix/<name>     # bug fixes
chore/<name>   # setup/config
```

> Hackathon shortcut: short-lived branches can start from `main`, but always PR for review.

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <short description>

[optional body]

[optional footer: BREAKING CHANGE: ... | Closes #123]
```

**Types & Scopes**

* feat(auth, projects, ai): new feature
* fix(...): bug
* chore(...): config/dependencies
* docs(...): documentation
* refactor(...): no behavior change
* test(...): tests
* style(...): formatting

**Examples**

```
feat(ai): add confidence badge to FeatureIdeaCard

fix(auth): prevent JWT leak on CORS preflight

chore(docker): add Redis stub for post-MVP
```

---

## 6. PR Workflow

1. Create PR from your branch → target `dev` (or `main` for hackathon speed)
2. Use this PR template snippet:

```markdown
## What does this PR do?
<!-- 1–3 sentences -->

## Type of change
- [ ] feat
- [ ] fix
- [ ] chore
- [ ] docs

## Linked Issue
Closes #

## Checklist
- [ ] Follows naming & module conventions
- [ ] No `any` types
- [ ] No business logic in controllers
- [ ] New endpoints validated & tested
- [ ] Shared types reused
- [ ] No post-MVP features included
- [ ] Tests pass locally
- [ ] PR title matches Conventional Commit
```

3. Self-review, request 1–2 reviewers.
4. Respond to comments quickly (<30 min).

---

## 7. Feedback Loop Usage

* **Accept/Reject AI suggestions** via UI → PATCH `/api/ai/results/:id/feedback`.
* Signal recorded in `feedbackSignals` array.
* Neutral state is default; only explicit clicks are stored.
* Backend stores the full Gemini response + parsed flag for auditing.

---

## 8. Quick Hackathon Tips

* **MVP first:** Ignore post-MVP features.
* **Small PRs:** < 400 lines — split features if needed.
* **Reuse shared types** — saves time and prevents bugs.
* **AI prompts:** always validate output schema before storing.
* **Focus on single-turn Q&A** — multi-turn is deferred.
* **Use toast messages** for success/failure feedback in UI.
* **Shortcut for branches:** for 2–3 day hackathon, short-lived `feature/*` from `main` is okay.
* **Time-to-first-insight:** aim to have a working AI result visible within 3 minutes of signup.

---

Thanks for contributing! Together we’ll build **Ajeya_AI**, the fastest path from customer feedback → AI insight → actionable roadmap.
