import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';

// Determine database path based on environment
// In production, use userData directory. In dev, use project root.
const isDev = process.env.NODE_ENV !== 'production';

// Use a fixed path for dev to avoid "database not found" across reloads
// For production, this logic needs to be robust (ipcRenderer getting path from main process)
// But since this is a Server Component/Backend logic, it runs in Node.
// Wait, in Next.js App Router, this runs on the server side (Node), which is correct.

const dbPath = isDev
    ? path.join(process.cwd(), 'local-db.sqlite')
    : path.join(process.resourcesPath, 'local-db.sqlite');

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);
