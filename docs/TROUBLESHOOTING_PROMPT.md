# OMNIGRAPH — Error & Fix Prompts

Copy one of the prompts below into Cursor (or any AI assistant) when you hit these issues.

---

## Prompt 1: Describe the errors (paste when asking for help)

```text
I'm running OMNIGRAPH INTELLIGENCE (Node.js Express backend + React/Vite frontend).

ERRORS I SEE:

1) Browser console — Network / Axios:
   - GET http://localhost:5173/api/graph → net::ERR_CONNECTION_REFUSED
   - GET http://localhost:5173/api/stats → net::ERR_CONNECTION_REFUSED
   - GET http://localhost:5173/api/discover → net::ERR_CONNECTION_REFUSED
   - Uncaught AxiosError: Network Error

2) Backend terminal — when I run `npm run start` or `npm run dev`:
   - Error: listen EADDRINUSE: address already in use :::8081 (or :::8082)
   - [OMNIGRAPH] Port 8081 is in use. Stop the other process or change PORT in backend/.env

3) Backend terminal — AI:
   - [OMNIGRAPH] No OPENAI_API_KEY — using MockAiProvider for demo
   - (even though I pasted the key in backend/.env)

4) Backend terminal — Neo4j (optional):
   - Neo4j not available: Failed to connect to server
   - Using in-memory graph store for demo

MY SETUP:
- backend/.env has PORT=8082 (or 8081)
- OPENAI_API_KEY is set in backend/.env
- Frontend: npm run dev on http://localhost:5173
- Backend: npm run start in backend/

Please diagnose root cause and give exact PowerShell steps to fix on Windows.
```

---

## Prompt 2: Fix the errors (paste to auto-fix in this repo)

```text
Fix OMNIGRAPH connection and startup errors in this repo. Do not skip steps.

GOALS:
1. Backend must start without EADDRINUSE
2. OpenAI API key must load from backend/.env (not MockAiProvider)
3. Frontend Vite proxy port must match backend PORT in backend/.env
4. /api/* from localhost:5173 must reach the backend (no ERR_CONNECTION_REFUSED)

KNOWN CAUSES:
- Old node process still bound to 8081/8082
- backend/.env not saved (OPENAI_API_KEY empty on disk)
- Shell env vars overriding .env (need dotenv override: true)
- frontend/.env.development VITE_API_PORT mismatch with backend PORT
- Spaces in .env values (e.g. NEO4J_PASSWORD= value)

TASKS:
1. Read backend/.env — confirm PORT and that OPENAI_API_KEY line has a value (trim spaces, no space after =)
2. Ensure backend/src/config/index.js loads backend/.env with override: true and trims OPENAI_API_KEY
3. Set frontend/.env.development VITE_API_PORT to the same port as backend PORT
4. Ensure frontend/vite.config.ts proxies /api and /health to http://localhost:${VITE_API_PORT}
5. Fix backend/scripts/kill-port.ps1 if needed (avoid $pid variable — reserved in PowerShell)
6. Add or verify npm run stop in backend/package.json to free the port before start
7. Document for user: run `npm run stop` then `npm run start` in backend, restart frontend `npm run dev`, hard refresh browser

After changes, verify:
- curl/Invoke-RestMethod http://localhost:<PORT>/health returns ok
- Backend log shows "OpenAI API key loaded"
- No EADDRINUSE on start

Do not commit or print API keys. Neo4j offline is OK — in-memory fallback is fine for demo.
```

---

## Quick manual fix (no AI)

```powershell
# 1) Stop old backend on port 8082 (change if your .env PORT differs)
cd backend
npm run stop

# 2) Save backend/.env (Ctrl+S) — OPENAI_API_KEY must not be empty

# 3) Start backend
npm run start
# Expect: API running at http://localhost:8082 + OpenAI API key loaded

# 4) Restart frontend (new terminal)
cd ..\frontend
npm run dev

# 5) Browser: http://localhost:5173 — hard refresh Ctrl+Shift+R
```

---

## One-line “fix everything” prompt

```text
OMNIGRAPH: Fix ERR_CONNECTION_REFUSED on /api from Vite (5173), EADDRINUSE on backend port, and OPENAI_API_KEY not loading from backend/.env — align VITE_API_PORT with PORT, kill stale node on 8081/8082, ensure dotenv override, give Windows PowerShell steps.
```
