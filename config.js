import { join } from 'path';

const path = (subPath) => join(import.meta.dirname, subPath);

const paths = {
  db: path('app.db'),
  sql: path('sql'),
  tables: path('sql/tables.sql'),
  views: path('views'),
  types: path('system.d.ts'),
  json: path('types.json'),
  migrations: path('migrations')
};

const config = {};

export {
  paths,
  config
}
