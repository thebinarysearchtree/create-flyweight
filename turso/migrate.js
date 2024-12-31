import createClient from './db.js';
import { prompt } from 'flyweight-client';
import paths from './paths.js';

const db = createClient(null, true, true);

await prompt(db, paths, false, 'turso');
