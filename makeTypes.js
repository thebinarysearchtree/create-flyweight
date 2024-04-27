import { database } from './db.js';

try {
  await database.makeTypes();
  console.log('Types updated');
}
catch (e) {
  console.log(e.message);
}
finally {
  await database.close();
}
