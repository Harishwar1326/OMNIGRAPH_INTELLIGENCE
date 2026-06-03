/**
 * Test Neo4j connection using credentials from backend/.env
 * Run: npm run test:neo4j
 */
import neo4j from 'neo4j-driver';
import { config } from '../src/config/index.js';

const URI = config.neo4j.uri;
const USER = config.neo4j.user;
const PASSWORD = config.neo4j.password;

if (!URI || URI.includes('<database-uri>')) {
  console.error('Set NEO4J_URI in backend/.env (e.g. neo4j+s://xxxx.databases.neo4j.io)');
  process.exit(1);
}

if (!USER || !PASSWORD) {
  console.error('Set NEO4J_USER and NEO4J_PASSWORD in backend/.env');
  process.exit(1);
}

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

try {
  const serverInfo = await driver.getServerInfo();
  console.log('Connection established');
  console.log(serverInfo);
} catch (err) {
  console.error('Connection failed:', err.message);
  if (URI.startsWith('bolt://localhost')) {
    console.error(
      'Hint: For Neo4j Aura, use NEO4J_URI=neo4j+s://<id>.databases.neo4j.io from the Aura console.'
    );
  }
  process.exit(1);
} finally {
  await driver.close();
}
