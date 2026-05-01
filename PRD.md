# 🧠 Ajeya_AI — Product Requirements Document (PRD)

> Full-loop AI co-pilot for product decisions

---

## MVP Scope

### ✅ Included

- User authentication (signup/login/logout, JWT)
- Project workspace CRUD
- Document upload (.txt/.csv, paste, max 1MB)
- Single-turn AI Q&A with structured JSON output
- Structured AI output with confidence scores + feedback loop
- Results history
- Responsive UI
- Admin panel (user list, usage stats, AI health)
- Rate limiting (10 queries/day)
- JSON validation with fallback
- Audit log collection

### ❌ Excluded/Post-MVP

- Redis caching
- Multi-turn AI memory
- PDF/DOCX parsing
- Slack/Intercom integration
- Stripe/Razorpay billing
- Export to Jira/Linear
- Automated AI retraining

---

## Core Features

1. Authentication (JWT, bcrypt)
2. Project Workspaces (create, rename, delete)
3. Data Upload (.txt/.csv, paste; context limit 800K chars)
4. AI Q&A Engine (single-turn, JSON output, conflict handling)
5. Structured Output + Feedback Loop (Accept/Reject/Neutral)
6. Results History
7. Admin Panel

---

## System Architecture

- Frontend: React + TypeScript, Redux Toolkit, React Query, Axios, TanStack Router
- Backend: Node.js + Express, JWT, Zod, Multer, Pino/Morgan, rate-limiter
- AI Layer: Gemini 1.5 Flash, promptBuilder, JSON validator, fallback parser
- Database: MongoDB Atlas, Mongoose

---

## Database Design

- Collections: users, projects, documents, aiResults, auditLogs
- aiResults includes `feedbackSignals` array for accept/reject/neutral

---

## API Endpoints

- Auth: `/signup`, `/login`, `/logout`, `/me`
- Projects: CRUD
- Documents: upload, list, delete
- AI: `/analyze`, `/results`, `/results/:id`, `/feedback`
- Admin: users list, status update, stats, audit logs

---

## Functional & Non-Functional Requirements

- Sign up/login with secure passwords
- JWT auth, protected routes
- Max 5 projects/user (free plan)
- Max upload size: 1MB
- AI analysis requires ≥1 document
- Rate limit: 10 queries/day (free tier)