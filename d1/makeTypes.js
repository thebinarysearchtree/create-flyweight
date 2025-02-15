import { makeTypes } from 'flyweight-client';
import paths from './paths.js';
import create from './db.js';

const database = create({}, true);
await makeTypes(database, paths);
