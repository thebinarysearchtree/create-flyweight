import { D1Database } from 'flyweightjs';
import files from './files.js';

const create = (db) => {
  const database = new D1Database({
    db,
    files 
  });
  return database.getClient();
}

export default create;
