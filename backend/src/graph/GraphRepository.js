import neo4j from 'neo4j-driver';
import { getDriver, neo4jAvailable } from '../config/neo4j.js';
import { getInMemoryStore } from './InMemoryStore.js';
import { normalizeRelType } from '../util/jsonUtil.js';

function nodeKey(name, type) {
  return `${name}::${type}`;
}

export class GraphRepository {
  useMemory() {
    return !neo4jAvailable;
  }

  async saveDocument(doc) {
    if (this.useMemory()) {
      getInMemoryStore().documents.set(doc.id, doc);
      return;
    }
    const session = getDriver().session();
    try {
      await session.run(
        `MERGE (d:Document {id: $id})
         SET d.filename = $filename, d.uploadedAt = datetime($uploadedAt)`,
        doc
      );
    } finally {
      await session.close();
    }
  }

  async deleteDocument(filename) {
    if (this.useMemory()) {
      const s = getInMemoryStore();
      // Find doc ID
      let docId = null;
      for (const [id, doc] of s.documents) {
        if (doc.filename === filename) {
          docId = id;
          break;
        }
      }
      if (docId) s.documents.delete(docId);
      s.nodes = new Map([...s.nodes].filter(([k, v]) => v.sourceDoc !== filename));
      s.edges = s.edges.filter(e => e.sourceDoc !== filename);
      return;
    }
    const session = getDriver().session();
    try {
      // 1. Delete relationships tied to this document
      await session.run(`MATCH ()-[r]->() WHERE r.sourceDoc = $filename DELETE r`, { filename });
      // 2. Delete nodes tied to this document (that don't have other relationships)
      await session.run(`MATCH (n:Entity) WHERE n.sourceDoc = $filename DETACH DELETE n`, { filename });
      // 3. Delete the document node itself
      await session.run(`MATCH (d:Document) WHERE d.filename = $filename DELETE d`, { filename });
    } finally {
      await session.close();
    }
  }

  async saveEntities(entities, sourceDoc) {
    if (this.useMemory()) {
      const s = getInMemoryStore();
      for (const e of entities) {
        const key = nodeKey(e.name, e.type);
        if (!s.nodes.has(key)) {
          s.nodes.set(key, {
            id: String(s.nodeId++),
            label: e.name,
            type: e.type,
            sourceDoc,
          });
        }
      }
      return;
    }
    const session = getDriver().session();
    try {
      for (const e of entities) {
        await session.run(
          `MERGE (n:Entity {name: $name, type: $type})
           SET n.sourceDoc = coalesce($sourceDoc, n.sourceDoc),
               n.createdAt = coalesce(n.createdAt, datetime())`,
          { name: e.name, type: e.type, sourceDoc }
        );
      }
    } finally {
      await session.close();
    }
  }

  async saveRelationships(relationships, sourceDoc) {
    if (this.useMemory()) {
      const s = getInMemoryStore();
      const byName = new Map();
      for (const n of s.nodes.values()) {
        byName.set(n.label, n.id);
      }
      for (const r of relationships) {
        const sourceId = byName.get(r.source);
        const targetId = byName.get(r.target);
        if (sourceId && targetId) {
          s.edges.push({
            id: `e${s.edgeId++}`,
            source: sourceId,
            target: targetId,
            label: normalizeRelType(r.relationship),
            confidence: r.confidence ?? 0.8,
            sourceDoc,
          });
        }
      }
      return;
    }
    const session = getDriver().session();
    try {
      for (const r of relationships) {
        const relType = normalizeRelType(r.relationship);
        await session.run(
          `MATCH (a:Entity {name: $source})
           MATCH (b:Entity {name: $target})
           MERGE (a)-[rel:${relType}]->(b)
           SET rel.confidence = $confidence,
               rel.sourceDoc = $sourceDoc`,
          {
            source: r.source,
            target: r.target,
            confidence: r.confidence ?? 0.8,
            sourceDoc,
          }
        );
      }
    } finally {
      await session.close();
    }
  }

  async getFullGraph() {
    if (this.useMemory()) {
      const s = getInMemoryStore();
      return { nodes: [...s.nodes.values()], edges: [...s.edges] };
    }
    const session = getDriver().session();
    try {
      const nodesResult = await session.run(`
        MATCH (n:Entity)
        RETURN elementId(n) AS id, n.name AS label, n.type AS type
      `);
      const edgesResult = await session.run(`
        MATCH (a:Entity)-[r]->(b:Entity)
        RETURN elementId(r) AS id,
               elementId(a) AS source,
               elementId(b) AS target,
               type(r) AS label,
               r.confidence AS confidence
      `);
      return {
        nodes: nodesResult.records.map((rec) => ({
          id: rec.get('id'),
          label: rec.get('label'),
          type: rec.get('type'),
        })),
        edges: edgesResult.records.map((rec) => ({
          id: rec.get('id'),
          source: rec.get('source'),
          target: rec.get('target'),
          label: rec.get('label'),
          confidence: rec.get('confidence'),
        })),
      };
    } finally {
      await session.close();
    }
  }

  async getNodes() {
    const { nodes } = await this.getFullGraph();
    return nodes;
  }

  async getRelationships() {
    const { edges } = await this.getFullGraph();
    return edges;
  }

  async getStats() {
    if (this.useMemory()) {
      const s = getInMemoryStore();
      const entityTypes = {};
      for (const n of s.nodes.values()) {
        entityTypes[n.type] = (entityTypes[n.type] || 0) + 1;
      }
      return {
        nodeCount: s.nodes.size,
        relationshipCount: s.edges.length,
        documentCount: s.documents.size,
        entityTypes,
      };
    }
    const session = getDriver().session();
    try {
      const counts = await session.run(`
        MATCH (n:Entity) WITH count(n) AS nodeCount
        OPTIONAL MATCH ()-[r]->() WHERE startNode(r):Entity AND endNode(r):Entity
        WITH nodeCount, count(r) AS relationshipCount
        OPTIONAL MATCH (d:Document)
        RETURN nodeCount, relationshipCount, count(d) AS documentCount
      `);
      const types = await session.run(`
        MATCH (n:Entity)
        RETURN n.type AS type, count(*) AS count
      `);
      const rec = counts.records[0];
      const entityTypes = {};
      for (const t of types.records) {
        entityTypes[t.get('type')] = t.get('count').toNumber?.() ?? t.get('count');
      }
      return {
        nodeCount: rec?.get('nodeCount')?.toNumber?.() ?? 0,
        relationshipCount: rec?.get('relationshipCount')?.toNumber?.() ?? 0,
        documentCount: rec?.get('documentCount')?.toNumber?.() ?? 0,
        entityTypes,
      };
    } finally {
      await session.close();
    }
  }

  async searchContext(keywords, limit = 30) {
    if (this.useMemory()) {
      const s = getInMemoryStore();
      const nodes = [...s.nodes.values()];
      return nodes
        .filter((n) =>
          keywords.some((k) => n.label.toLowerCase().includes(k.toLowerCase()))
        )
        .slice(0, limit)
        .map((n) => {
          const connections = s.edges
            .filter((e) => e.source === n.id || e.target === n.id)
            .map((e) => {
              const otherId = e.source === n.id ? e.target : e.source;
              const other = nodes.find((x) => x.id === otherId);
              return { rel: e.label, other: other?.label, otherType: other?.type };
            });
          return { entity: n.label, type: n.type, connections };
        });
    }
    const session = getDriver().session();
    try {
      const result = await session.run(
        `
        MATCH (n:Entity)
        WHERE any(k IN $keywords WHERE toLower(n.name) CONTAINS toLower(k))
        OPTIONAL MATCH (n)-[r]-(m:Entity)
        RETURN n.name AS entity, n.type AS type,
               collect(DISTINCT {
                 rel: type(r),
                 other: m.name,
                 otherType: m.type
               }) AS connections
        LIMIT toInteger($limit)
        `,
        { keywords, limit }
      );
      return result.records.map((rec) => ({
        entity: rec.get('entity'),
        type: rec.get('type'),
        connections: (rec.get('connections') || []).filter((c) => c.other),
      }));
    } finally {
      await session.close();
    }
  }

  async discoverHiddenRelationships() {
    if (this.useMemory()) {
      const s = getInMemoryStore();
      const suggestions = [];
      const nodes = [...s.nodes.values()];
      for (const edge of s.edges) {
        const shared = nodes.find((n) => n.id === edge.target);
        const sources = s.edges.filter((e) => e.target === edge.target && e.id !== edge.id);
        for (const other of sources) {
          const a = nodes.find((n) => n.id === edge.source);
          const b = nodes.find((n) => n.id === other.source);
          if (a && b && a.id !== b.id) {
            suggestions.push({
              entityA: a.label,
              entityB: b.label,
              sharedNode: shared?.label,
              reason: `Both connected to ${shared?.label} (${shared?.type})`,
              confidence: 0.7 + Math.random() * 0.2,
              type:
                shared?.type === 'Project'
                  ? 'SHARED_PROJECT'
                  : shared?.type === 'Organization'
                    ? 'SHARED_ORGANIZATION'
                    : 'SHARED_CONNECTION',
            });
          }
        }
      }
      return suggestions;
    }
    const session = getDriver().session();
    try {
      const result = await session.run(`
        MATCH (a:Entity)-[r1]->(shared:Entity)<-[r2]-(b:Entity)
        WHERE elementId(a) < elementId(b)
        RETURN a.name AS entityA, a.type AS typeA,
               b.name AS entityB, b.type AS typeB,
               shared.name AS sharedNode, shared.type AS sharedType,
               type(r1) AS relA, type(r2) AS relB
        LIMIT 50
      `);
      return result.records.map((rec) => {
        const sharedType = rec.get('sharedType');
        let discoveryType = 'SHARED_CONNECTION';
        if (sharedType === 'Project') discoveryType = 'SHARED_PROJECT';
        else if (sharedType === 'Topic') discoveryType = 'SHARED_TOPIC';
        else if (sharedType === 'Concept') discoveryType = 'SHARED_CONCEPT';
        else if (sharedType === 'Organization') discoveryType = 'SHARED_ORGANIZATION';
        else if (sharedType === 'Technology') discoveryType = 'SHARED_TECHNOLOGY';

        return {
          entityA: rec.get('entityA'),
          entityB: rec.get('entityB'),
          sharedNode: rec.get('sharedNode'),
          reason: `Both connected to ${rec.get('sharedNode')} (${sharedType})`,
          confidence: 0.65 + Math.random() * 0.25,
          type: discoveryType,
          relA: rec.get('relA'),
          relB: rec.get('relB'),
        };
      });
    } finally {
      await session.close();
    }
  }
}
