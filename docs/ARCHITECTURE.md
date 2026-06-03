# OMNIGRAPH – Architecture

## System Overview

```text
                    ┌─────────────────────────────────────┐
                    │           User (Browser)            │
                    └──────────────────┬──────────────────┘
                                       │
                                       v
                    ┌─────────────────────────────────────┐
                    │     React + TypeScript + Tailwind   │
                    │  Dashboard | Upload | Graph | Chat  │
                    │              React Flow             │
                    └──────────────────┬──────────────────┘
                                       │ REST (Axios)
                                       v
                    ┌─────────────────────────────────────┐
                    │      Node.js / Express API          │
                    │  Controllers → Services → Repos     │
                    └───────┬─────────────┬───────────────┘
                            │             │
              ┌─────────────┘             └─────────────┐
              v                                       v
    ┌──────────────────┐                    ┌──────────────────┐
    │  Document Layer  │                    │    AI Layer      │
    │  PDF → Text      │                    │  LLM Abstraction │
    │  (pdf-parse)     │                    │  OpenAI / Ollama │
    └────────┬─────────┘                    └────────┬─────────┘
             │                                       │
             v                                       v
    ┌────────────────────────────────────────────────────────┐
    │              Knowledge Graph Service                   │
    │     Entity Extraction → Relationship Extraction        │
    └────────────────────────┬───────────────────────────────┘
                             │
                             v
                    ┌─────────────────┐
                    │     Neo4j       │
                    │  Nodes + Edges  │
                    └─────────────────┘
                             │
              ┌──────────────┼──────────────┐
              v              v              v
        Graph RAG      Discovery      Explainable
        (Cypher+LLM)   (Rule-based)   (paths+scores)
```

## Request Flow

### Upload & Extract Pipeline

```text
PDF Upload → Store temp → Extract text → LLM entities → LLM relationships
    → MERGE nodes in Neo4j → MERGE edges → Return summary
```

### Graph RAG Chat

```text
User question → Cypher keyword search → Subgraph context → LLM answer
    → Return answer + evidence paths + confidence
```

### Hidden Relationship Discovery

```text
Neo4j pattern match (shared org/project/tech) → Score → Suggestions list
```

## Component Responsibilities

| Layer | Responsibility |
|-------|----------------|
| Frontend | UI, React Flow graph, chat, discovery panel |
| API | REST endpoints, validation, orchestration |
| Document Service | PDF upload, text extraction |
| Extraction Service | Entity + relationship LLM calls |
| Graph Repository | Neo4j CRUD, Cypher queries |
| AI Provider | Pluggable OpenAI / Ollama |
| Discovery Service | Rule-based hidden link detection |
| Chat Service | Graph RAG context building |

## Design Principles (Hackathon)

- **Monolith**: Single Express app, no microservices
- **Sync pipeline**: Upload → extract in one request for demo simplicity
- **Idempotent graph writes**: MERGE by entity name + type
- **Configurable AI**: Switch provider via `.env` without code changes
