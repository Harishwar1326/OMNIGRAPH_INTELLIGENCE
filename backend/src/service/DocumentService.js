import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import { config } from '../config/index.js';

export class DocumentService {
  async ensureUploadDir() {
    await fs.mkdir(config.upload.dir, { recursive: true });
  }

  async extractTextFromFile(file) {
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      return data.text || '';
    }
    // TXT or CSV or generic text
    return file.buffer.toString('utf-8');
  }

  async extractTextFromPdf(buffer) {
    const data = await pdfParse(buffer);
    return data.text || '';
  }

  async saveFile(file) {
    await this.ensureUploadDir();
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(config.upload.dir, filename);
    await fs.writeFile(filepath, file.buffer);
    return { filename, filepath };
  }
}
