import { TursoDatabase } from 'flyweightjs';
import { createClient } from '@libsql/client';
import files from './files.js';

const create = (options, internal) => {
  const config = {
    url: null,
    authToken: null,
    ...options
  };
  const db = config.url ? createClient(config) : null;
  const database = new TursoDatabase({
    db,
    files
  });
  if (internal) {
    return database;
  }
  return database.getClient();
}

export default create;
