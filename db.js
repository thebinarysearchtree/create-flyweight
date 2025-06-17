import { db, database } from './system.js';

db.users.compute({
  displayName: (f, c) => f.concat(c.id, ' - ', 'c.name')
});

export {
  db,
  database
}
