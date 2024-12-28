import { D1Database } from 'flyweightjs';
import files from './files.js';

const create = (options) => {
  const database = new D1Database({
    ...options,
    files 
  });
  return database.getClient();
}

export default create;
