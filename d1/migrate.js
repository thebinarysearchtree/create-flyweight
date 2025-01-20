import { D1Database } from 'flyweightjs';
import { prompt, makeTypes } from 'flyweight-client';
import paths from './paths.js';
import files from './files.js';

const database = new D1Database({
  db: {},
  files
});

const result = await prompt(database, paths, false);
if (result) {
  await makeTypes(database, paths);
}
