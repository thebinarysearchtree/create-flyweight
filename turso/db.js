import { TursoDatabase } from 'flyweightjs';
import { createClient } from '@libsql/client';
import files from './files.js';

const create = (options, internal) => {
  if (internal) {
    const database = new TursoDatabase({
      db: null,
      files
    });
    return database;
  }
  const client = createClient({
    url: 'test',
    authToken: 'test',
    ...options
  });
  const database = new TursoDatabase({
    db: client,
    files
  });
  return database.getClient();
}

export default create;
