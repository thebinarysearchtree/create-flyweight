import { prompt, makeTypes } from 'flyweight-client';
import paths from './paths.js';
import { dbName } from './config.js';
import create from './db.js';

const database = create({}, true);

const result = await prompt(database, paths, false, dbName);
if (result) {
  await makeTypes(database, paths);
}
