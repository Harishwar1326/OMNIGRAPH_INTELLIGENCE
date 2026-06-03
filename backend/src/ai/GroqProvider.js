import Groq from 'groq-sdk';
import { config } from '../config/index.js';
import { AiProvider } from './AiProvider.js';

export class GroqProvider extends AiProvider {
  constructor() {
    super();
    this.client = new Groq({ apiKey: config.ai.groq.apiKey });
    this.model = config.ai.groq.model || 'llama-3.3-70b-versatile';
  }

  async complete(system, user) {
    try {
      const resp = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.1,
      });
      return resp.choices[0].message.content;
    } catch (err) {
      throw new Error(`Groq failed: ${err.message}`);
    }
  }
}
