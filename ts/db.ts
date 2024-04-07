import { Database } from 'flyweightjs';
import { TypedDb } from './types';
import { join } from 'path';

const path = (subPath: string) => join(import.meta.dirname, subPath);

const database = new Database();

const sqlPath = path('sql');

const result = await database.initialize<TypedDb>({
  db: path('app.db'),
  sql: sqlPath,
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
  runMigration,
  sqlPath
}
