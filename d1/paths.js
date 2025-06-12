import { join } from 'path';
import { migrationsPath } from './config.js';

const path = (subPath) => join(import.meta.dirname, subPath);

const paths = {
  sql: path('sql'),
  tables: path('sql/tables.sql'),
  views: path('views'),
  types: path('db.d.ts'),
  json: path('types.json'),
  migrations: path('migrations'),
  wranglerMigrations: migrationsPath,
  files: path('files.js'),
  computed: path('computed.json')
};

export default paths;
