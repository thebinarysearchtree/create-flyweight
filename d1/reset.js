import { prompt, makeTypes } from 'flyweight-client';
import paths from './paths.js';
import create from './db.js';

const database = create({}, true);

const result = await prompt(database, paths, true);
if (result) {
  await makeTypes({
    db: database,
    paths
  });
}
