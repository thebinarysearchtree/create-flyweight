import { D1Database } from 'flyweightjs';
import { prompt } from 'flyweight-client';
import paths from './paths.js';
import files from './files.js';

const database = new D1Database({
  db: {},
  files
});

await prompt(database, paths, true, 'd1');
