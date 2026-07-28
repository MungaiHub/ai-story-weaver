# AI Story Weaver

> An AI-powered interactive story generation platform where users craft stories segment by segment and steer any scene into a new branch — all powered by a large language model.

---

## Problem Statement

Creative writing is a deeply personal process, but getting started — or getting unstuck — is hard. Writers often have a rough idea (a theme, a genre, a few plot beats) but struggle to turn that into a full narrative. Existing AI writing tools generate a single flat output with no way to explore alternative directions.

**AI Story Weaver** solves this by giving writers an interactive branching canvas: the AI generates a story in discrete scenes, and the writer can "steer" any individual scene with a plain-English instruction to produce an alternate branch — without affecting the rest of the story. Every version is saved so the writer can compare and switch between them.

---

## Solution Description

AI Story Weaver is a full-stack web application with:

- **Story generation** — the user provides a theme, genre, and a set of plot beats; the AI writes the story split into numbered scenes (segments).
- **Segment steering** — any scene can be rewritten with a steering instruction (e.g. *"make the protagonist more vulnerable"*, *"add a twist ending"*). The result is saved as a new **branch** of that scene while neighbouring scenes remain untouched.
- **Branch navigation** — every version of every scene is preserved. Users can toggle between the original and any steered variants side by side.
- **User accounts** — JWT-authenticated registration and login; each user sees only their own stories.

### User Flow

```
Register / Login
      │
      ▼
Dashboard  ──►  New Story  ──►  Set theme + genre + plot beats
                                        │
                                        ▼
                              AI generates N scenes
                                        │
                                        ▼
                              Story Page (scene cards)
                                        │
                             ┌──────────┴──────────┐
                             │   Steer a scene      │
                             │  (type instruction)  │
                             │          │           │
                             │          ▼           │
                             │   AI regenerates     │
                             │   that scene only    │
                             │   → new branch       │
                             └──────────────────────┘
```

---

## AI Approach and Architecture

### LLM Integration

All AI calls are routed through a single abstraction layer — [`backend/src/services/llmService.js`](backend/src/services/llmService.js). The provider is swappable via the `LLM_PROVIDER` environment variable with no code changes:

| `LLM_PROVIDER` | Provider |
|---|---|
| `gemini` | Google Gemini (`@google/genai`) — **default in this project** |
| `openai` | OpenAI Chat Completions |
| `stub` | Offline deterministic stub for development |

The project uses **Google Gemini** (`gemini-1.5-flash` by default) as the AI backend — the model is invoked with a structured system instruction and a user prompt that specifies the story parameters.

### Prompt Strategy

Two prompt templates are used, both enforcing **JSON-only** output so the server can parse the result reliably:

**1. Story generation** ([`storyService.js`](backend/src/services/storyService.js))
```
System: You are a creative fiction writer. Return valid JSON:
        { "title": "...", "segments": [{ "index": N, "title": "...", "content": "..." }] }

User:   Write a <genre> story with the theme "<theme>".
        Plot beats: 1. ... 2. ... 3. ...
        Write exactly <N> segments.
```

**2. Segment steering** ([`storyService.js`](backend/src/services/storyService.js))
```
System: You are a fiction editor. Rewrite one segment. Return JSON:
        { "title": "...", "content": "..." }

User:   PRECEDING SEGMENT: <context>
        CURRENT SEGMENT: <original>
        FOLLOWING SEGMENT: <context>
        STEERING INSTRUCTION: <user instruction>
```

Neighbouring segments are always passed as context so the AI keeps the rewritten scene narratively consistent with its surroundings.

### Branching Data Model

```
Story
 ├── activeBranches: { "1": "main", "2": "abc123", "3": "main", ... }
 └── Segments (MongoDB collection)
      ├── { index: 1, branchId: "main",   content: "..." }
      ├── { index: 2, branchId: "main",   content: "..." }
      ├── { index: 2, branchId: "abc123", content: "...", parentBranchId: "main", steerInstruction: "..." }
      └── { index: 3, branchId: "main",   content: "..." }
```

Each `steer` call creates a new `Segment` document with a UUID `branchId` and updates the story's `activeBranches` map. The original is never overwritten.

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                         │
│  React + Vite  ──  AuthContext / JWT in localStorage│
│  Pages: Auth · Dashboard · Generate · Story         │
│  Components: SegmentCard (branch tabs + steer panel)│
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS  (JWT in Authorization header)
┌──────────────────▼──────────────────────────────────┐
│               Express API  (Node.js)                │
│  /api/auth   register · login                       │
│  /api/story  generate · getTree · steer             │
│  Middleware: helmet · cors · rate-limit · validate  │
└──────────────────┬──────────────────────────────────┘
         ┌─────────┴─────────┐
         │                   │
┌────────▼───────┐  ┌────────▼────────────────────────┐
│   MongoDB      │  │      Google Gemini API           │
│   Atlas        │  │  (LLM_PROVIDER=gemini)           │
│  Users·Stories │  │  gemini-1.5-flash (default)      │
│  Segments      │  └─────────────────────────────────-┘
└────────────────┘
```

---

## Selected Challenge Theme

**Creative AI Tools** — AI Story Weaver empowers writers with an intelligent co-author that doesn't just generate text, but lets the human stay in control: providing the premise, directing the plot beats, and surgically steering individual scenes without losing the full narrative context.

---

## How IBM Bob Was Used

IBM Bob (the AI software engineer assistant) was used throughout the entire development lifecycle of this project:

### 1. Debugging & Crash Diagnosis
Bob diagnosed two back-to-back backend crashes:
- `Cannot find module 'uuid'` — identified that `npm install` had never been run on the project, ran it, and confirmed resolution.
- `FRONTEND_ORIGIN must be set in environment variables` — identified that the `.env` file was missing required variables and provided the exact values to add.

### 2. Gemini API Integration
The original codebase was scaffolded for OpenAI only. Bob:
- Added `callGemini()` to [`llmService.js`](backend/src/services/llmService.js) using the `@google/genai` SDK.
- Implemented correct message format translation (OpenAI-style `system`/`user` messages → Gemini `systemInstruction` + chat history).
- Added model fallback logic so the app retries alternate Gemini models if the preferred one returns a 404.
- Installed the SDK and registered it in the provider dispatch table.
- Updated [`.env.example`](backend/.env.example) with all new Gemini environment variables.

### 3. Code Review & Architecture
Bob read and explained the full branching architecture (`Story` → `Segment` → `branchId` model), the LLM prompt strategy, and the security middleware stack — providing grounded answers based on actual code rather than speculation.

### 4. README Authoring
This README was written by Bob based on a thorough reading of the entire codebase — backend services, frontend pages, data models, middleware, and environment configuration.

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local) or a [MongoDB Atlas](https://cloud.mongodb.com) cluster
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)

### Backend
```bash
cd backend
cp .env.example .env      # then fill in your secrets (see below)
npm install
npm run dev               # listens on :3001 by default
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # served on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Long random string (≥ 32 chars) for JWT signing |
| `JWT_EXPIRES_IN` | — | Token lifetime, e.g. `7d` (default: `7d`) |
| `FRONTEND_ORIGIN` | ✅ | Exact frontend URL for CORS, e.g. `http://localhost:5173` |
| `LLM_PROVIDER` | — | `gemini` \| `openai` \| `stub` (default: `openai`) |
| `GEMINI_API_KEY` | ✅ (if gemini) | API key from [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `GEMINI_MODEL` | — | Model name, e.g. `gemini-1.5-flash` (default) |
| `OPENAI_API_KEY` | ✅ (if openai) | OpenAI secret key |
| `OPENAI_MODEL` | — | Model name, e.g. `gpt-4o` (default) |
| `PORT` | — | Server port (default: `3001`) |

---

## API Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Obtain JWT |
| `POST` | `/api/story/generate` | JWT | Generate a new story |
| `GET` | `/api/story/:storyId` | JWT | Fetch story + full segment tree |
| `POST` | `/api/story/:storyId/segment/:segmentId/steer` | JWT | Steer a segment → new branch |
| `GET` | `/health` | — | Health check |

---

## Security

- All user input validated server-side with `express-validator`
- Story/steer endpoints rate-limited via `express-rate-limit`
- JWT required on all story endpoints; users can only access their own stories
- AI output sanitized with DOMPurify before React renders it
- `helmet` sets secure HTTP response headers
- CORS locked to `FRONTEND_ORIGIN` only — no wildcard
- All DB access via Mongoose typed schemas (no raw query string concatenation)
