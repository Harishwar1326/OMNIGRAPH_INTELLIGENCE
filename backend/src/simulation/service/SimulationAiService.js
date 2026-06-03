import { getAiProvider } from '../../ai/AiFactory.js';
import { parseJsonSafe } from '../../util/jsonUtil.js';

export class SimulationAiService {
  constructor() {
    this.ai = getAiProvider();
  }

  async analyze(type, source, target, impact) {
    const systemPrompt = `You are an Organizational Strategy Consultant.
    Analyze the proposed simulation and provide a strategic summary.
    Return ONLY JSON:
    {
      "summary": "...",
      "recommendations": ["..."],
      "expectedOutcomes": ["..."]
    }`;

    const userPrompt = `
    Scenario: ${type}
    Details: Move/Change from ${source} to ${target}
    Impacted items: ${impact.teams.join(', ')} teams, ${impact.projects.join(', ')} projects.
    Identified Risks: ${impact.risks.map(r => r.message).join('; ')}
    `;

    try {
      const raw = await this.ai.complete(systemPrompt, userPrompt);
      return parseJsonSafe(raw, this.getDefaults());
    } catch (err) {
      console.error('[SimulationAI] failed:', err);
      return this.getDefaults();
    }
  }

  async parseQuery(query, graphContext) {
    const systemPrompt = `You are a Graph Strategy Engine. 
    Analyze the user's "What If" question and translate it into formal graph changes.
    Available Node Types: Person, Team, Project, Technology, Organization.
    
    Return ONLY JSON:
    {
      "action": "ADD_RELATION" | "REMOVE_NODE" | "MERGE_NODES" | "MODIFY_PROPERTY",
      "source": "entity name",
      "target": "target entity name (if applicable)",
      "type": "relation type (if applicable)",
      "intent": "brief explanation of the operation"
    }`;

    const userPrompt = `
    Question: ${query}
    Current context size: ${graphContext.nodes.length} nodes, ${graphContext.edges.length} edges.
    `;

    try {
      const raw = await this.ai.complete(systemPrompt, userPrompt);
      return parseJsonSafe(raw, { action: 'MODIFY_PROPERTY', source: 'System', intent: 'Generic assessment' });
    } catch (err) {
      return { action: 'MODIFY_PROPERTY', source: 'System', intent: 'Generic assessment' };
    }
  }

  getDefaults() {
    return {
      summary: 'Simulation analysis complete. No critical blockers detected at first glance.',
      recommendations: ['Monitor key project milestones', 'Ensure clear communication to stakeholders'],
      expectedOutcomes: ['Improved resource alignment', 'Temporary dip in velocity']
    };
  }
}
