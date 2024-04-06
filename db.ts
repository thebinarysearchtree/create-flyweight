import { Database } from 'flyweightjs';
import { TypedDb } from './types.ts';

const path = (subPath: string) => {
  const url = new URL(subPath, import.meta.url);
  return url.pathname;
}

const database = new Database();

const result = await database.initialize<TypedDb>({
  db: path('app.db'),
  sql: path('sql'),
  tables: path('sql/tables.sql'),
  views: path('views'),
  types: path('types.ts'),
  migrations: path('migrations')
});

const {
  db,
  makeTypes,
  getTables,
  createMigration,
  runMigration
} = result;


export {
  database,
  db,
  makeTypes,
  getTables,
  createMigration,
  runMigration
}
