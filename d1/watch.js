import { D1Database } from 'flyweightjs';
import { watch } from 'flyweight-client';
import paths from './paths.js';
import files from './files.js';

const database = new D1Database({
  db: {},
  files
});

watch(database, paths);
