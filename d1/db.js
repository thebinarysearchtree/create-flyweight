import { D1Database } from 'flyweightjs';
import { join } from 'path';
import files from './files.js';

const path = (subPath) => join(import.meta.dirname, subPath);

const database = new D1Database({
  db: path('app.db'),
  sql: path('sql'),
  tables: path('sql/tables.sql'),
  views: path('views'),
  types: path('db.d.ts'),
  migrations: path('migrations'),
  files
});

const db = database.getClient();

export {
  database,
  db
}
