# API Specification

Base URL: `http://localhost:8081/api`

## POST /upload

Upload a PDF and run full extraction pipeline.

**Request:** `multipart/form-data` — field `file` (PDF)

**Response 200:**
```json
{
  "documentId": "uuid",
  "filename": "report.pdf",
  "textLength": 4521,
  "entities": [{ "name": "Microsoft", "type": "Organization" }],
  "relationships": [{
    "source": "Microsoft",
    "relationship": "PARTNERED_WITH",
    "target": "OpenAI",
    "confidence": 0.9
  }],
  "stats": { "entityCount": 12, "relationshipCount": 8 }
}
```

## POST /extract

Re-run extraction on existing document text (body).

**Request:**
```json
{ "text": "Microsoft partnered with OpenAI...", "documentId": "optional-uuid" }
```

**Response 200:** Same shape as upload (without file metadata).

## GET /graph

Full graph for visualization.

**Response 200:**
```json
{
  "nodes": [{ "id": "1", "label": "Microsoft", "type": "Organization" }],
  "edges": [{ "id": "e1", "source": "1", "target": "2", "label": "PARTNERED_WITH" }]
}
```

## GET /graph/nodes

**Response 200:** `{ "nodes": [...] }`

## GET /graph/relationships

**Response 200:** `{ "relationships": [...] }`

## POST /chat

Graph RAG question answering.

**Request:**
```json
{ "question": "Who partnered with OpenAI?" }
```

**Response 200:**
```json
{
  "answer": "Microsoft partnered with OpenAI during Build 2024.",
  "confidence": 0.85,
  "evidence": [
    { "path": "Microsoft -[PARTNERED_WITH]-> OpenAI", "source": "report.pdf" }
  ],
  "contextUsed": 5
}
```

## GET /discover

Hidden relationship suggestions.

**Response 200:**
```json
{
  "suggestions": [{
    "entityA": "Alice",
    "entityB": "Bob",
    "reason": "Both connected to Project Phoenix",
    "sharedNode": "Project Phoenix",
    "confidence": 0.78,
    "type": "SHARED_PROJECT"
  }]
}
```

## GET /stats

Dashboard statistics.

**Response 200:**
```json
{
  "nodeCount": 42,
  "relationshipCount": 67,
  "documentCount": 3,
  "entityTypes": { "Organization": 10, "Person": 8 }
}
```

## Errors

| Code | Body |
|------|------|
| 400 | `{ "error": "message" }` |
| 500 | `{ "error": "message" }` |
