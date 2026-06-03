import { config } from '../config/index.js';
import { OllamaProvider } from './OllamaProvider.js';
import { MockAiProvider } from './MockAiProvider.js';
import { FallbackAiProvider } from './FallbackAiProvider.js';

let instance = null;

export function getAiProvider() {
  if (!instance) {
    if (config.ai.provider === 'ollama') {
      instance = new OllamaProvider();
    } else if (config.ai.provider === 'mock') {
      instance = new MockAiProvider();
    } else {
      // Default: Chain of OpenAI -> Groq -> Mock
      instance = new FallbackAiProvider();
      console.log('[OMNIGRAPH] AI initialized with Fallback Chain');
    }
  }
  return instance;
}
