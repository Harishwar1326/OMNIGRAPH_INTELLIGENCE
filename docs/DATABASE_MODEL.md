# Neo4j Database Model

## Node Labels

| Label | Properties | Description |
|-------|------------|-------------|
| `Entity` | `name`, `type`, `sourceDoc`, `createdAt` | All extracted entities |
| `Document` | `id`, `filename`, `uploadedAt` | Source PDF metadata |

## Entity Types (property `type`)

- `Person`
- `Organization`
- `Technology`
- `Event`
- `Project`

## Relationship Types

| Type | Pattern | Properties |
|------|---------|------------|
| `PARTNERED_WITH` | (Entity)-[:PARTNERED_WITH]->(Entity) | `confidence`, `sourceDoc` |
| `WORKS_AT` | (Entity)-[:WORKS_AT]->(Entity) | `confidence`, `sourceDoc` |
| `USES` | (Entity)-[:USES]->(Entity) | `confidence`, `sourceDoc` |
| `PART_OF` | (Entity)-[:PART_OF]->(Entity) | `confidence`, `sourceDoc` |
| `RELATED_TO` | (Entity)-[:RELATED_TO]->(Entity) | `confidence`, `sourceDoc` |
| `MENTIONED_IN` | (Entity)-[:MENTIONED_IN]->(Document) | `createdAt` |

Custom relationship types from LLM extraction are normalized to uppercase with underscores.

## Indexes & Constraints

```cypher
CREATE CONSTRAINT entity_name_type IF NOT EXISTS
FOR (e:Entity) REQUIRE (e.name, e.type) IS NODE KEY;

CREATE INDEX entity_name IF NOT EXISTS FOR (e:Entity) ON (e.name);
CREATE INDEX entity_type IF NOT EXISTS FOR (e:Entity) ON (e.type);
```

## Example Graph

```text
(Microsoft:Entity {type:"Organization"})
    -[:PARTNERED_WITH {confidence:0.92}]->
(OpenAI:Entity {type:"Organization"})

(Build 2024:Entity {type:"Event"})
    -[:RELATED_TO]->
(Microsoft:Entity)
```

## Discovery Queries (Hidden Relationships)

Detect entities that share a neighbor (e.g., two people on same project):

```cypher
MATCH (a:Entity)-[r1]->(shared:Entity)<-[r2]-(b:Entity)
WHERE id(a) < id(b)
RETURN a, shared, b, type(r1), type(r2)
```
