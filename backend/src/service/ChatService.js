import { getAiProvider } from '../ai/AiFactory.js';
import { GraphRepository } from '../graph/GraphRepository.js';
import { parseJsonSafe } from '../util/jsonUtil.js';

const CHAT_SYSTEM = `You are OMNIGRAPH, an enterprise knowledge graph assistant.
Answer using ONLY the provided graph context. If insufficient data, say so.
Return JSON: {"answer":"string","confidence":0.0-1.0,"evidence":["short path descriptions"]}`;

export class ChatService {
  constructor() {
    this.ai = getAiProvider();
    this.graphRepo = new GraphRepository();
  }

  extractKeywords(question) {
    const stop = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'what', 'who', 'which',
      'how', 'when', 'where', 'with', 'to', 'from', 'and', 'or', 'in', 'on',
      'about', 'do', 'does', 'did', 'of', 'for', 'by', 'at',
    ]);
    return question
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stop.has(w));
  }

  buildContextString(context) {
    if (!context.length) return 'No matching graph data found.';
    return context
      .map((c) => {
        const links = (c.connections || [])
          .slice(0, 5)
          .map((x) => `${c.entity} -[${x.rel}]-> ${x.other} (${x.otherType})`)
          .join('; ');
        return `${c.entity} (${c.type}): ${links || 'no direct links'}`;
      })
      .join('\n');
  }

  async ask(question) {
    const keywords = this.extractKeywords(question);
    const searchTerms = keywords.length ? keywords : question.split(/\s+/).slice(0, 3);
    const context = await this.graphRepo.searchContext(searchTerms);
    const contextStr = this.buildContextString(context);

    const raw = await this.ai.complete(
      CHAT_SYSTEM,
      `Question: ${question}\n\nGraph context:\n${contextStr}`
    );
    const parsed = parseJsonSafe(raw, {
      answer: 'I could not find enough information in the knowledge graph to answer that question.',
      confidence: 0.3,
      evidence: [],
    });

    return {
      answer: parsed.answer,
      confidence: parsed.confidence ?? 0.5,
      evidence: (parsed.evidence || []).map((path) => ({ path, source: 'knowledge graph' })),
      contextUsed: context.length,
    };
  }
}
