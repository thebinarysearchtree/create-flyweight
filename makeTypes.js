import { makeTypes, database } from './db.js';

try {
  await makeTypes();
  console.log('Types updated');
}
catch (e) {
  console.log(e.message);
}
finally {
  await database.close();
}
