import createClient from './db.js';
import { prompt, makeTypes } from 'flyweight-client';
import paths from './paths.js';

const db = createClient(null, true, true);

const result = await prompt(db, paths, false);
if (result) {
  const db = createClient(null, true);
  await makeTypes(db, paths);
}
