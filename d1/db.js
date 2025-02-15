import { D1Database } from 'flyweightjs';
import files from './files.js';

const create = (db, internal, getSample) => {
  const database = new D1Database({
    db,
    files,
    getSample
  });
  if (internal) {
    return database;
  }
  return database.getClient();
}

export default create;
