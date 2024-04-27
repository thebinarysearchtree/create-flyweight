import { database } from './db.js';
import { watch } from 'fs';

process.on('exit', async () => await database.close());

console.log('watching for changes');
watch(database.sqlPath, { recursive: true }, async () => {
  try {
    await database.makeTypes();
  }
  catch (e) {
    console.log(e.message);
  }
});
