import createClient from './db.js';
import { prompt, makeTypes } from 'flyweight-client';
import paths from './paths.js';

const db = createClient(null, true);

const result = await prompt(db, paths, true, 'turso');
if (result) {
  await makeTypes(db, paths);
}
