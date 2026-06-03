import { OpenAiProvider } from './OpenAiProvider.js';
import { GroqProvider } from './GroqProvider.js';
import { MockAiProvider } from './MockAiProvider.js';
import { config } from '../config/index.js';
import { AiProvider } from './AiProvider.js';

export class FallbackAiProvider extends AiProvider {
  constructor() {
    super();
    this.providers = [];
    
    if (config.ai.openai.apiKey) {
      this.providers.push({ name: 'OpenAI', instance: new OpenAiProvider() });
    }
    
    if (config.ai.groq.apiKey) {
      this.providers.push({ name: 'Groq', instance: new GroqProvider() });
    }
    
    this.providers.push({ name: 'Mock', instance: new MockAiProvider() });
  }

  async complete(system, user) {
    let lastError = null;
    
    for (const p of this.providers) {
      try {
        const result = await p.instance.complete(system, user);
        console.log(`[OMNIGRAPH] AI success using ${p.name}`);
        return result;
      } catch (err) {
        console.warn(`[OMNIGRAPH] AI ${p.name} failed: ${err.message}`);
        lastError = err;
      }
    }
    
    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
  }
}
