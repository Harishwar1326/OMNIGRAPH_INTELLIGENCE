/** In-memory graph fallback when Neo4j is unavailable (hackathon demo) */
const store = {
  nodes: new Map(),
  edges: [],
  documents: new Map(),
  nodeId: 1,
  edgeId: 1,
};

export function resetStore() {
  store.nodes.clear();
  store.edges = [];
  store.documents.clear();
  store.nodeId = 1;
  store.edgeId = 1;
}

export function getInMemoryStore() {
  return store;
}
