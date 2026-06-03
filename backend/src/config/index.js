import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  neo4j: {
    uri: (process.env.NEO4J_URI || 'bolt://localhost:7687').trim(),
    user: (process.env.NEO4J_USER || 'neo4j').trim(),
    password: (process.env.NEO4J_PASSWORD || 'omnigraph123').trim(),
  },
  ai: {
    provider: (process.env.AI_PROVIDER || 'openai').toLowerCase(),
    openai: {
      apiKey: (process.env.OPENAI_API_KEY || '').trim(),
      model: (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim(),
    },
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama3.2',
    },
    groq: {
      apiKey: (process.env.GROQ_API_KEY || '').trim(),
      model: (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile').trim(),
    },
  },
  upload: {
    dir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
    maxSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  },
};
