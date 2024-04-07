#!/usr/bin/env node
import { execSync } from 'child_process';
import { cp, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const exec = (command) => execSync(command, { stdio: 'inherit' });

if (process.argv.length < 3) {
  console.log('Please supply a directory.');
  process.exit();
}

exec('npm install flyweightjs');
const root = process.argv[2];
const ts = process.argv.length > 3;

const copy = async (from, to, options) => {
  if (!to) {
    to = from;
  }
  if (typeof to !== 'string') {
    options = to;
    to = from;
  }
  const src = join(import.meta.dirname, from);
  const dest = join(root, to);
  await cp(src, dest, options);
};

const options = { recursive: true };

await copy('migrations', options);
await copy('sql', options);
await mkdir(join(root, 'views'));
await copy('app.db');

const typesFile = ts ? 'types.ts' : 'db.d.ts';
await copy('db.d.ts', typesFile);

await copy(`db.js`);
await copy('migrate.js');
await copy('makeTypes.js');
await copy('watch.js');

const file = await readFile('package.json', 'utf8');
const config = JSON.parse(file);
config.type = 'module';
config.scripts.types = `node ${join(root, 'makeTypes.js')}`;
config.scripts.migrate = `node ${join(root, 'migrate.js')}`;
config.scripts.watch = `node ${join(root, 'watch.js')}`;
await writeFile('package.json', JSON.stringify(config, null, 2));
