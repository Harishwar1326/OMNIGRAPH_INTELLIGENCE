import OpenAI from 'openai';
import { AiProvider } from './AiProvider.js';
import { config } from '../config/index.js';

export class OpenAiProvider extends AiProvider {
  constructor() {
    super();
    this.client = new OpenAI({ apiKey: config.ai.openai.apiKey });
    this.model = config.ai.openai.model;
  }

  async complete(systemPrompt, userPrompt) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });
    return response.choices[0]?.message?.content || '{}';
  }
}
