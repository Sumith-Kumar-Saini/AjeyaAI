# 🧠 Ajeya_AI

> **Full-loop AI co-pilot for product decisions**  
> React + TypeScript + Vite / Node.js + Express / MongoDB + Redis / Gemini AI

---

## Overview

Ajeya_AI is a web-based platform where product managers and founders upload customer feedback and ask natural language questions like *"What should we build next?"*. Gemini AI analyzes project data and returns structured, evidence-backed feature recommendations. The system includes a **feedback loop**: PMs accept/reject AI suggestions, improving future outputs.

This monorepo contains:

```

packages/
├── client/    # React frontend
├── server/    # Node.js + Express backend
└── shared/    # Shared TypeScript types
docs/         # Documentation
.github/      # PR and Issue templates
docker/       # Docker configuration

```

---

## MVP Scope (Hackathon)

✅ Must ship:

- User authentication (signup/login/logout, JWT)
- Project workspace CRUD
- Document upload (.txt/.csv, paste, max 1MB)
- Single-turn AI Q&A with structured JSON output
- AI output with confidence scores + feedback loop
- Results history
- Responsive UI
- Admin panel (user list, usage stats, AI health)
- Rate limiting (10 AI queries/day)
- JSON validation with fallback
- Basic audit logging

❌ Post-MVP features (deferred):

- Redis caching, multi-turn AI memory
- PDF/DOCX uploads, audio/video transcription
- Slack/Intercom integration
- Stripe/Razorpay billing
- Export to Jira/Linear
- Automated AI retraining

---

## Tech Stack

### Frontend

- React + TypeScript + Vite
- Redux Toolkit, React Query, TanStack Router
- Tailwind CSS + shadcn/ui, Lucide React icons
- Framer Motion, React Hot Toast

### Backend

- Node.js + Express + TypeScript
- JWT auth, Zod validation, Multer file uploads
- Mongoose ODM, MongoDB Atlas
- Logging: Pino + Morgan
- Security: Helmet.js, express-mongo-sanitize

### AI

- Google Gemini 1.5 Flash via `@google/generative-ai`
- Prompt construction: `promptBuilder.ts`
- JSON validation: `jsonValidator.ts`
- Fallback parsing: `jsonFallback.ts`

---

## Setup Instructions

### Prerequisites

- Node.js 20+
- NPM 9+
- Docker (optional, for local dev)
- MongoDB Atlas account (free M0)
- Gemini AI API key

### Install Dependencies

```bash
# At repo root
npm install
# Or per package
cd packages/client && npm install
cd packages/server && npm install
cd packages/shared && npm install
```

### Environment Variables

Copy `.env.example` in each package:

```bash
cp packages/server/.env.example packages/server/.env
cp packages/client/.env.example packages/client/.env
```

Edit variables as needed:

* `GEMINI_API_KEY`: Your Gemini API key
* `MONGODB_URI`: MongoDB connection string
* `VITE_API_BASE_URL`: Backend URL
* Other config: `JWT_SECRET`, `FREE_TIER_DAILY_LIMIT`, `PORT`, `CORS_ORIGIN`, etc.

### Running Locally

```bash
# Backend
cd packages/server
npm run dev

# Frontend
cd packages/client
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to access the app.

### Docker (Optional)

```bash
docker-compose up --build
```

This starts frontend, backend, and MongoDB services locally.

---

## References

* Governance & coding standards: [GOVERNANCE.md](GOVERNANCE.md)
* Product requirements: [PRD.md](PRD.md)
* AI prompt guidelines: [docs/AI_PROMPTING_GUIDE.md](docs/AI_PROMPTING_GUIDE.md)
* API reference: [docs/API_REFERENCE.md](docs/API_REFERENCE.md) (need to create)
