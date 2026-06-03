# Folder Structure

```text
OMNIGRAPH_INTELLIGENCE/
├── docker-compose.yml          # Neo4j
├── README.md                   # Run instructions
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   ├── DATABASE_MODEL.md
│   └── FOLDER_STRUCTURE.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/
│       │   ├── index.js
│       │   └── neo4j.js
│       ├── ai/
│       │   ├── AiProvider.js
│       │   ├── AiFactory.js
│       │   ├── OpenAiProvider.js
│       │   ├── OllamaProvider.js
│       │   └── MockAiProvider.js
│       ├── graph/
│       │   └── GraphRepository.js
│       ├── controller/
│       ├── service/
│       ├── routes/
│       └── util/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── pages/
        ├── components/
        ├── services/
        ├── types/
        └── utils/
```
