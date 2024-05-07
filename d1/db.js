import { D1Database } from 'flyweightjs';

const create = (options) => {
  const database = new D1Database(options);
  return database.getClient();
}

export default create;
