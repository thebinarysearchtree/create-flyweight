import { join } from 'path';

const path = (subPath) => join(import.meta.dirname, subPath);

const paths = {
  sql: path('sql'),
  tables: path('sql/tables.sql'),
  views: path('views'),
  types: path('system.d.ts'),
  json: path('types.json'),
  migrations: path('migrations')
};

const config = {
  url: `file:${path('app.db')}`,
  authToken: null
};

export {
  paths,
  config
}
