# OMNIGRAPH Intelligence Platform

AI-powered Graph RAG platform that converts uploaded documents into an interactive knowledge graph.

## Features

- PDF upload & text extraction
- LLM entity & relationship extraction
- Neo4j knowledge graph storage
- React Flow graph visualization
- Graph RAG natural language Q&A
- Hidden relationship discovery (rule-based)

## Prerequisites

- **Node.js** 18+
- **Docker** (for Neo4j)
- **OpenAI API key** (optional — mock AI works for demo)

## Quick Start (6-Hour Hackathon Demo)

### 1. Start Neo4j

```bash
docker compose up -d
```

Neo4j Browser: http://localhost:7474 (user: `neo4j`, password: `omnigraph123`)

### 2. Backend

```powershell
cd backend
copy .env.example .env
# Edit .env — set PORT=8082, OPENAI_API_KEY=... then SAVE (Ctrl+S)
npm install
npm run stop    # frees ports 8081/8082 if stuck
npm run start
```

API: http://localhost:8082/health (must match `PORT` in `.env` and `VITE_API_PORT` in `frontend/.env.development`)

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: http://localhost:5173

## Demo Flow (Judges)

1. Open **Dashboard** — view stats
2. **Upload** → click **Run demo extraction** (works without PDF/API key)
3. **Graph Explorer** — interactive nodes & edges
4. **AI Chat** → ask *"Who partnered with OpenAI?"*
5. **Discovery** — view hidden relationship suggestions

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload` | Upload PDF, extract, store graph |
| POST | `/api/extract` | Extract from raw text |
| GET | `/api/graph` | Full graph for visualization |
| GET | `/api/graph/nodes` | Nodes only |
| GET | `/api/graph/relationships` | Edges only |
| POST | `/api/chat` | Graph RAG Q&A |
| GET | `/api/discover` | Hidden relationships |
| GET | `/api/stats` | Dashboard stats |

## AI Configuration

Edit `backend/.env`:

```env
# OpenAI (recommended for hackathon)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Ollama (local)
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

If `OPENAI_API_KEY` is empty, **MockAiProvider** runs automatically for offline demos.

Without Docker/Neo4j, the API uses an **in-memory graph store** so the full demo still works.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DATABASE_MODEL.md](docs/DATABASE_MODEL.md), [docs/API_SPECIFICATION.md](docs/API_SPECIFICATION.md).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express |
| Frontend | React, TypeScript, Tailwind, React Flow |
| Graph DB | Neo4j 5 |
| AI | OpenAI / Ollama (pluggable) |
| PDF | pdf-parse |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Neo4j connection failed | `docker compose up -d` and wait ~30s |
| Empty graph after upload | Check backend logs; verify Neo4j is running |
| Chat returns generic answer | Upload demo text first to populate graph |
| CORS errors | Use Vite dev server (proxies `/api` to backend) |

## License

MIT — Hackathon MVP
