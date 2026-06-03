import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');

let portFromEnv = 8082;
if (existsSync(envPath)) {
  const match = readFileSync(envPath, 'utf8').match(/^\s*PORT\s*=\s*(\d+)/m);
  if (match) portFromEnv = parseInt(match[1], 10);
}

const ports = [...new Set([8081, 8082, portFromEnv])];

function killPortWindows(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    const pids = new Set();
    for (const line of out.split('\n')) {
      if (!line.includes('LISTENING')) continue;
      const pid = line.trim().split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`[stop] Freed port ${port} (PID ${pid})`);
      } catch {
        /* already gone */
      }
    }
    if (pids.size === 0) console.log(`[stop] Port ${port} is free.`);
  } catch {
    console.log(`[stop] Port ${port} is free.`);
  }
}

function killPortUnix(port) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, { stdio: 'ignore', shell: true });
    console.log(`[stop] Freed port ${port}`);
  } catch {
    console.log(`[stop] Port ${port} is free.`);
  }
}

for (const port of ports) {
  if (process.platform === 'win32') killPortWindows(port);
  else killPortUnix(port);
}
