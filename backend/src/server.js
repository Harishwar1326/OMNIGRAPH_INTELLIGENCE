import app from './app.js';
import { config } from './config/index.js';
import { verifyConnectivity, initSchema, closeDriver } from './config/neo4j.js';

async function start() {
  try {
    const serverInfo = await verifyConnectivity();
    await initSchema();
    console.log('[OMNIGRAPH] Neo4j connected', serverInfo?.address || '');
  } catch (err) {
    console.warn('[OMNIGRAPH] Neo4j not available:', err.message);
    console.warn('[OMNIGRAPH] Using in-memory graph store for demo');
    console.warn('[OMNIGRAPH] For persistence: docker compose up -d');
  }

  const server = app.listen(config.port, () => {
    console.log(`[OMNIGRAPH] API running at http://localhost:${config.port}`);
    if (config.ai.provider === 'openai') {
      console.log('[OMNIGRAPH] AI: Automatic Fallback Active (OpenAI -> Groq -> Mock)');
    } else {
      console.log(`[OMNIGRAPH] AI: Explicit Provider (${config.ai.provider})`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `[OMNIGRAPH] Port ${config.port} is in use. Stop the other process or change PORT in backend/.env`
      );
      process.exit(1);
    }
    throw err;
  });

  process.on('SIGINT', async () => {
    server.close();
    await closeDriver();
    process.exit(0);
  });
}

start();
