import { database, makeTypes, sqlPath } from './db.js';
import { watch } from 'fs';

process.on('exit', async () => await database.close());

watch(sqlPath, { recursive: true }, async () => await makeTypes());
