import { database } from './db.js';
import { prompt, makeTypes } from 'flyweight-client';
import { paths } from './config.js';

const result = await prompt(database, paths, true);
if (result) {
  await makeTypes({
    db: database,
    paths
  });
}
