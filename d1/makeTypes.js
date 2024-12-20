import { D1Database } from 'flyweightjs';
import { makeTypes } from 'flyweight-client';
import paths from './paths.js';
import files from './files.js';

const database = new D1Database({
  db: {},
  files
});

await makeTypes(database, paths, 'd1');
