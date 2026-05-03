# AI-Assisted Development Guidelines

> All AI-generated code must adhere to project governance.

---

## Prime Directive

**AI tools assist, humans decide.**  
Reject AI suggestions that violate:

- Backend module pattern
- No `any` type
- Post-MVP features
- Duplicate shared types
- Controllers >10 lines or services using `req/res`

---

## How to Prime Your AI Tool

```

You are helping build Ajeya AI — full-loop AI PM platform.

TECH STACK:
Frontend: React + TS + Vite + Redux + TanStack Router
Backend: Node + Express + TS
DB: MongoDB + Mongoose
AI: Gemini 1.5 Flash via SDK

RULES:

* Feature-first backend modules
* Thin controllers, business logic in service
* Zod validation middleware
* Shared types only
* asyncHandler() wrapping
* AppError for errors
* No console.log
* No post-MVP features

CURRENT TASK: [describe your task]

```

---

## Module-Specific Prompting

- New backend module:

```

Generate <name> module:

* <name>.routes.ts → Express Router + auth + validate(schema)
* <name>.controller.ts → asyncHandler → call service → return res.json
* <name>.service.ts → all business logic
* <name>.model.ts → Mongoose schema
* <name>.validator.ts → Zod schemas
```
