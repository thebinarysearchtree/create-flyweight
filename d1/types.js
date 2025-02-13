import { D1Database } from 'flyweightjs';
import { makeTypes } from 'flyweight-client';
import paths from './paths.js';
import files from './files.js';
import { readFile } from 'fs/promises';
import toml from 'toml';
import { Miniflare } from 'miniflare';

const types = async (sampleData) => {
  const file = await readFile('wrangler.toml', 'utf8');
  const parsed = toml.parse(file);
  const config = parsed.d1_databases.at(0);

  if (!config) {
    throw Error('No database configured');
  }

  let db = {};
  if (sampleData) {
    const mf = new Miniflare({
      modules: true,
      script: 'export default { fetch: () => new Response(null, { status:404 })};',
      d1Databases: {
        [config.binding]: config.database_id
      }
    });
    db = await mf.getD1Database(config.binding);
  }

  const database = new D1Database({
    db,
    files
  });
  await makeTypes(database, paths, sampleData);
}

export default types;
