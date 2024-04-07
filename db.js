import { Database } from 'flyweightjs';

const path = (subPath) => {
  const url = new URL(subPath, import.meta.url);
  return url.pathname;
}

const database = new Database();

const sqlPath = path('sql');

const result = await database.initialize({
  db: path('app.db'),
  sql: sqlPath,
  tables: path('sql/tables.sql'),
  views: path('views'),
  types: path('db.d.ts'),
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
