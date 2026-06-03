import { PipelineService } from '../service/PipelineService.js';

const pipeline = new PipelineService();

export async function uploadPdf(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Use field name "file".' });
    }
    const result = await pipeline.processPdf(req.file);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function extractText(req, res, next) {
  try {
    const { text, documentId, filename } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: 'text is required' });
    }
    const result = await pipeline.processText(text, { documentId, filename });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
