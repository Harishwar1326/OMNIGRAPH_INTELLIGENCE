import { GraphRepository } from '../graph/GraphRepository.js';

export class DiscoveryService {
  constructor() {
    this.graphRepo = new GraphRepository();
  }

  async discover() {
    const suggestions = await this.graphRepo.discoverHiddenRelationships();
    const unique = new Map();
    for (const s of suggestions) {
      const key = [s.entityA, s.entityB, s.sharedNode].sort().join('|');
      if (!unique.has(key) || unique.get(key).confidence < s.confidence) {
        unique.set(key, s);
      }
    }
    return {
      suggestions: [...unique.values()]
        .sort((a, b) => b.confidence - a.confidence)
        .map((s) => ({
          ...s,
          message: 'Potential hidden relationship detected.',
          confidence: Math.round(s.confidence * 100) / 100,
        })),
    };
  }
}
