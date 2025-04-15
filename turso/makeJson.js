import createClient from './db.js';
import { makeTypes } from 'flyweight-client';
import paths from './paths.js';

const db = createClient(null, true, true);

await makeTypes({
  db,
  paths,
  sample: true
});
