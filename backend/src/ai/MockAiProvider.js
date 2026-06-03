import { AiProvider } from './AiProvider.js';

const TECH_TOPICS = [
  { regex: /\bspring boot\b/gi, name: 'Spring Boot' },
  { regex: /\breact\b/gi, name: 'React' },
  { regex: /\brest api\b/gi, name: 'REST API' },
  { regex: /\bjava\b/gi, name: 'Java' },
  { regex: /\bneo4j\b/gi, name: 'Neo4j' },
];

const TECH_CONCEPTS = [
  { regex: /\bdependency injection\b/gi, name: 'Dependency Injection' },
  { regex: /\bbean lifecycle\b/gi, name: 'Bean Lifecycle' },
  { regex: /\busestate\b/gi, name: 'useState' },
  { regex: /\bhashmap\b/gi, name: 'HashMap' },
  { regex: /\bknowledge graph\b/gi, name: 'Knowledge Graph' },
];

/** Demo fallback when no API key — rule-based extraction */
export class MockAiProvider extends AiProvider {
  async complete(systemPrompt, userPrompt) {
    const text = userPrompt.toLowerCase();
    const sys = systemPrompt.toLowerCase();

    if (sys.includes('knowledge graph extraction') || sys.includes('"topics"')) {
      return this.mockKnowledgeGraph(userPrompt, text);
    }

    return JSON.stringify({
      answer:
        'Based on the knowledge graph context, relationships were extracted from the uploaded document.',
      confidence: 0.75,
      evidence: [],
    });
  }

  mockKnowledgeGraph(userPrompt, text) {
    const topics = [];
    const concepts = [];
    const seen = new Set();

    const add = (list, name, description, kind) => {
      const key = `${kind}:${name}`;
      if (seen.has(key)) return;
      seen.add(key);
      list.push({ name, description });
    };

    for (const t of TECH_TOPICS) {
      if (t.regex.test(userPrompt)) {
        add(topics, t.name, `Topic discussed in document`, 'topic');
      }
    }
    for (const c of TECH_CONCEPTS) {
      if (c.regex.test(userPrompt)) {
        add(concepts, c.name, `Concept referenced in document`, 'concept');
      }
    }

    if (text.includes('microsoft')) add(topics, 'Microsoft', 'Organization topic', 'topic');
    if (text.includes('openai')) add(topics, 'OpenAI', 'Organization topic', 'topic');

    const relationships = [];
    if (text.includes('spring') && text.includes('dependency injection')) {
      relationships.push({
        source: 'Spring Boot',
        target: 'Dependency Injection',
        type: 'CONTAINS',
        description: 'Spring Boot includes dependency injection',
      });
    }
    if (text.includes('react') && text.includes('usestate')) {
      relationships.push({
        source: 'React',
        target: 'useState',
        type: 'CONTAINS',
        description: 'React provides useState hook',
      });
    }
    if (text.includes('microsoft') && text.includes('openai')) {
      relationships.push({
        source: 'Microsoft',
        target: 'OpenAI',
        type: 'ASSOCIATED_WITH',
        description: 'Partnership mentioned in text',
      });
    }

    return JSON.stringify({ topics, concepts, relationships });
  }
}
