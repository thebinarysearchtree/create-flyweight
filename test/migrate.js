import { database, createMigration, runMigration, makeTypes } from './db.js';
import prompt from '../prompt.js';

await prompt(database, createMigration, runMigration, makeTypes);
