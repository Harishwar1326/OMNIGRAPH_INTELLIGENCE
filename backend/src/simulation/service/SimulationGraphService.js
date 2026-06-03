import { GraphRepository } from '../../graph/GraphRepository.js';

export class SimulationGraphService {
  constructor() {
    this.repo = new GraphRepository();
  }

  async getBaseline() {
    // Fetches the entire current graph from Neo4j (or memory fallback)
    return await this.repo.getFullGraph();
  }

  cloneAndApply(baseline, type, source, target, options) {
    // Deep clone nodes and edges
    const nodes = JSON.parse(JSON.stringify(baseline.nodes));
    const edges = JSON.parse(JSON.stringify(baseline.edges));

    const changes = [];

    switch (type) {
      case 'ADD_RELATION':
        // Find or create nodes? For demo, we assume they exist
        const newEdge = {
          id: `sim-edge-${Date.now()}`,
          source: source, // Note: these are labels, layout converter handles mapping
          target: target,
          label: options.type || 'INTERACTS_WITH',
          status: 'ADDED'
        };
        edges.push(newEdge);
        changes.push(`Created linkage between ${source} and ${target}`);
        break;

      case 'REMOVE_NODE':
        nodes.forEach(node => {
          if (node.label === source) node.status = 'REMOVED';
        });
        // Also mark connected edges as removed
        edges.forEach(edge => {
          if (edge.source === source || edge.target === source) edge.status = 'REMOVED';
        });
        changes.push(`Purged ${source} from the network`);
        break;

      case 'MERGE_NODES':
        nodes.forEach(node => {
          if (node.label === source || node.label === target) {
            node.status = 'MODIFIED';
            node.label = `${source} & ${target}`;
          }
        });
        changes.push(`Consolidated ${source} and ${target} into a unified entity`);
        break;

      case 'MODIFY_PROPERTY':
      case 'TEAM_RESTRUCTURE':
      default:
        nodes.forEach(node => {
          if (node.label === source) {
            node.status = 'MODIFIED';
            node.description = options.intent || 'Modified properties';
          }
        });
        changes.push(`Adjusted parameters for ${source}`);
        break;
    }

    return { nodes, edges, changes };
  }
}
