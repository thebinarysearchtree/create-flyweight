import { database } from './db.js';
import { makeTypes } from 'flyweight-client';
import { paths } from './config.js';

await makeTypes({
  db: database,
  paths
});
