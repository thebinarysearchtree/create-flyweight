import { database, paths } from './db.js';
import { prompt, makeTypes } from 'flyweight-client';

const result = await prompt(database, paths, true);
if (result) {
  await makeTypes({
    db: database,
    paths
  });
}
