# AI Story Weaver

## Project structure
```
ai-story-weaver/
  backend/   – Node.js + Express + MongoDB
  frontend/  – React + Vite
```

## Quick start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- An OpenAI API key (or swap the provider in `llmService.js`)

### Backend
```bash
cd backend
cp .env.example .env          # fill in your secrets
npm install
npm run dev                   # listens on :3001
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                   # served on :5173
```

## Environment variables (backend)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret for JWT signing |
| `LLM_PROVIDER` | `openai` \| `anthropic` \| `stub` |
| `OPENAI_API_KEY` | OpenAI key — **never commit this** |
| `OPENAI_MODEL` | Model name, e.g. `gpt-4o` |
| `FRONTEND_ORIGIN` | Exact frontend URL for CORS |

## Security highlights
- All user input validated server-side via `express-validator`
- Generate/steer endpoints rate-limited via `express-rate-limit`
- JWT auth: all story endpoints require a valid token
- AI output DOMPurify-sanitized before React renders it
- `helmet` sets secure HTTP headers
- CORS locked to `FRONTEND_ORIGIN` only
- No raw query string concatenation; all DB access via Mongoose typed schemas

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Obtain JWT |
| `POST` | `/api/story/generate` | JWT | Generate new story |
| `GET` | `/api/story/:storyId` | JWT | Fetch full story tree |
| `POST` | `/api/story/:storyId/segment/:segmentId/steer` | JWT | Steer a segment → new branch |
