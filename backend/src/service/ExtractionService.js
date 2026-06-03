import { getAiProvider } from '../ai/AiFactory.js';
import {
  KNOWLEDGE_GRAPH_SYSTEM,
  buildKnowledgeGraphUserPrompt,
} from '../ai/prompts/knowledgeGraphExtraction.js';
import { parseJsonSafe } from '../util/jsonUtil.js';
import {
  chunkText,
  mapKnowledgeGraphToEntities,
  mapKnowledgeGraphToRelationships,
  mergeExtractionResults,
} from '../util/knowledgeGraphMapper.js';

export class ExtractionService {
  constructor() {
    this.ai = getAiProvider();
  }

  async extractFromChunk(chunkText) {
    const raw = await this.ai.complete(
      KNOWLEDGE_GRAPH_SYSTEM,
      buildKnowledgeGraphUserPrompt(chunkText)
    );
    const parsed = parseJsonSafe(raw, { topics: [], concepts: [], relationships: [] });
    const entities = mapKnowledgeGraphToEntities(parsed);
    const relationships = mapKnowledgeGraphToRelationships(parsed, entities);
    return { entities, relationships, raw: parsed };
  }

  async extractAll(text) {
    const chunks = chunkText(text.slice(0, 48000));
    const chunkResults = [];

    for (const chunk of chunks) {
      const result = await this.extractFromChunk(chunk);
      chunkResults.push(result);
    }

    const merged = mergeExtractionResults(chunkResults);
    return {
      entities: merged.entities,
      relationships: merged.relationships,
      topics: merged.topics,
      concepts: merged.concepts,
    };
  }
}
