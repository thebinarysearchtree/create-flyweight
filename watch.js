import { database, makeTypes, sqlPath } from './db.js';
import { watch } from 'fs';

process.on('exit', async () => await database.close());

console.log('watching for changes');
watch(sqlPath, { recursive: true }, async () => {
  try {
    await makeTypes();
  }
  catch (e) {
    console.log(e.message);
  }
});
