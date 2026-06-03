/**
 * Abstract AI provider interface.
 * Implementations: OpenAiProvider, OllamaProvider
 */
export class AiProvider {
  async complete(_systemPrompt, _userPrompt) {
    throw new Error('Not implemented');
  }
}
