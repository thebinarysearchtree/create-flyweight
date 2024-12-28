import { TursoDatabase } from 'flyweightjs';
import { createClient } from '@libsql/client';
import files from './files.js';

const create = (options) => {
  const client = createClient({
    url: 'test',
    authToken: 'test',
    ...options
  });
  const database = new TursoDatabase({
    db: client,
    files
  });
  if (options && options.internal) {
    return database;
  }
  return database.getClient();
}

export default create;
