import { normalizeRelType } from './jsonUtil.js';

export function mapKnowledgeGraphToEntities(parsed) {
  const seen = new Map();
  const entities = [];

  const add = (name, type, description = '') => {
    const key = `${name}::${type}`;
    if (!name?.trim() || seen.has(key)) return;
    seen.set(key, true);
    entities.push({
      name: name.trim(),
      type,
      description: description?.trim() || undefined,
    });
  };

  for (const t of parsed.topics || []) {
    add(t.name, 'Topic', t.description);
  }
  for (const c of parsed.concepts || []) {
    add(c.name, 'Concept', c.description);
  }

  // Legacy enterprise schema support
  for (const e of parsed.entities || []) {
    add(e.name, e.type || 'Concept', e.description);
  }

  return entities;
}

export function mapKnowledgeGraphToRelationships(parsed, entities) {
  const nameToType = new Map(entities.map((e) => [e.name, e.type]));
  const relationships = [];

  const ensureEntity = (name) => {
    if (!nameToType.has(name)) {
      nameToType.set(name, 'Concept');
      entities.push({ name, type: 'Concept' });
    }
  };

  for (const r of parsed.relationships || []) {
    const source = r.source?.trim();
    const target = r.target?.trim();
    const relType = normalizeRelType(r.type || r.relationship);
    if (!source || !target) continue;
    ensureEntity(source);
    ensureEntity(target);
    relationships.push({
      source,
      target,
      relationship: relType,
      confidence: r.confidence ?? 0.85,
      description: r.description?.trim(),
    });
  }

  return relationships;
}

export function chunkText(text, maxChunkSize = 10000) {
  if (text.length <= maxChunkSize) return [text];
  const chunks = [];
  const paragraphs = text.split(/\n\n+/);
  let current = '';

  for (const para of paragraphs) {
    if ((current + para).length > maxChunkSize && current) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.length ? chunks : [text.slice(0, maxChunkSize)];
}

export function mergeExtractionResults(results) {
  const entityMap = new Map();
  const relKeys = new Set();
  const relationships = [];

  for (const { entities, relationships: rels } of results) {
    for (const e of entities) {
      const key = `${e.name}::${e.type}`;
      if (!entityMap.has(key)) entityMap.set(key, e);
    }
    for (const r of rels) {
      const key = `${r.source}|${r.relationship}|${r.target}`;
      if (!relKeys.has(key)) {
        relKeys.add(key);
        relationships.push(r);
      }
    }
  }

  return {
    entities: [...entityMap.values()],
    relationships,
    topics: entitiesToTopics([...entityMap.values()]),
    concepts: entitiesToConcepts([...entityMap.values()]),
  };
}

function entitiesToTopics(entities) {
  return entities
    .filter((e) => e.type === 'Topic')
    .map((e) => ({ name: e.name, description: e.description || '' }));
}

function entitiesToConcepts(entities) {
  return entities
    .filter((e) => e.type === 'Concept')
    .map((e) => ({ name: e.name, description: e.description || '' }));
}
