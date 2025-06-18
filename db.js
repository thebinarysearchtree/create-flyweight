import { db, database } from './system.js';

db.users.compute({
  displayName: (c, f) => f.concat(c.id, ' - ', c.name)
});

export {
  db,
  database
}
