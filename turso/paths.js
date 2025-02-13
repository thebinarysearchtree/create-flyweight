import { join } from 'path';

const path = (subPath) => join(import.meta.dirname, subPath);

const paths = {
  sql: path('sql'),
  tables: path('sql/tables.sql'),
  views: path('views'),
  types: path('db.d.ts'),
  json: path('types.json'),
  migrations: path('migrations'),
  files: path('files.js')
};

export default paths;
