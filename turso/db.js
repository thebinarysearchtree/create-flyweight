import { TursoDatabase } from 'flyweightjs';
import { createClient } from '@libsql/client';
import files from './files.js';

const create = (options, internal, needsConnection) => {
  if (internal && !needsConnection) {
    return new TursoDatabase({
      db: null,
      files
    });
  }
  const client = createClient({
    url: null,
    authToken: null,
    ...options
  });
  const database = new TursoDatabase({
    db: client,
    files
  });
  if (internal) {
    return database;
  }
  return database.getClient();
}

export default create;
