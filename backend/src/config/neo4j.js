import neo4j from 'neo4j-driver';
import { config } from './index.js';

let driver = null;
export let neo4jAvailable = false;

export function getDriver() {
  if (!driver) {
    const { uri, user, password } = config.neo4j;
    if (!uri || !user || !password) {
      throw new Error('Neo4j credentials missing in .env (NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)');
    }
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return driver;
}

export async function verifyConnectivity() {
  const d = getDriver();
  const serverInfo = await d.getServerInfo();
  neo4jAvailable = true;
  return serverInfo;
}

export async function initSchema() {
  const session = getDriver().session();
  try {
    await session.run(`
      CREATE CONSTRAINT entity_name_type IF NOT EXISTS
      FOR (e:Entity) REQUIRE (e.name, e.type) IS UNIQUE
    `);
    await session.run(`CREATE INDEX entity_name IF NOT EXISTS FOR (e:Entity) ON (e.name)`);
    await session.run(`CREATE INDEX entity_type IF NOT EXISTS FOR (e:Entity) ON (e.type)`);
  } finally {
    await session.close();
  }
}

export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
