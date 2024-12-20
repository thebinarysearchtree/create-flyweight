import 'dotenv/config';
import { TursoDatabase } from 'flyweightjs';
import { join } from 'path';
import adaptor from 'flyweight-turso';

const path = (subPath) => join(import.meta.dirname, subPath);

const paths = {
  sql: path('sql'),
  tables: path('sql/tables.sql'),
  views: path('views'),
  types: path('db.d.ts'),
  migrations: path('migrations')
};

const url = process.env.TURSO_DATABASE_URL || `file:${path('app.db')}`;
const authToken = process.env.TURSO_AUTH_TOKEN || '...';
const encryptionKey = process.env.TURSO_ENCRYPTION_KEY || undefined;
const syncUrl = process.env.TURSO_SYNC_URL || undefined;
const syncInterval = process.env.TURSO_SYNC_INTERVAL ? parseInt(process.env.TURSO_SYNC_INTERVAL) : undefined;
const tls = process.env.TURSO_TLS !== undefined ? Boolean(process.env.TURSO_TLS ) : undefined;
const intMode = process.env.TURSO_INT_MODE || undefined;
const concurrency = process.env.TURSO_CONCURRENCY !== undefined ? parseInt(process.env.TURSO_CONCURRENCY) : undefined;

const client = adaptor.createClient({
  url,
  authToken,
  encryptionKey,
  syncUrl,
  syncInterval,
  tls,
  intMode,
  concurrency
});

const database = new TursoDatabase({
  db: client,
  adaptor,
  ...paths
});

const db = database.getClient();

export {
  database,
  db,
  paths
}
