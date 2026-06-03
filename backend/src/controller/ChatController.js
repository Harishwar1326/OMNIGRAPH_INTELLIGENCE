import { ChatService } from '../service/ChatService.js';

const chatService = new ChatService();

export async function chat(req, res, next) {
  try {
    const { question } = req.body;
    if (!question?.trim()) {
      return res.status(400).json({ error: 'question is required' });
    }
    const result = await chatService.ask(question);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
