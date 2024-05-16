#!/usr/bin/env node
import { execSync } from 'child_process';
import { cp, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import toml from 'toml';

const exec = (command) => execSync(command, { stdio: 'inherit' });

if (process.argv.length < 3) {
  console.log('Please supply a directory.');
  process.exit();
}

let d1;
let root;
if (process.argv.length > 3) {
  d1 = true;
  root = process.argv[3];
}
else {
  d1 = false;
  root = process.argv[2];
}

exec('npm install flyweightjs');
if (!d1) {
  exec('npm install flyweight-sqlite');
}
exec('npm install flyweight-client');

const copy = async (from, to, options) => {
  if (!to) {
    to = from;
  }
  if (typeof to !== 'string') {
    options = to;
    to = from;
  }
  const paths = [import.meta.dirname];
  if (d1) {
    paths.push('d1');
  }
  paths.push(from);
  const src = join(...paths);
  const dest = join(root, to);
  await cp(src, dest, options);
};

const options = { recursive: true };

await copy('sql', options);
await mkdir(join(root, 'views'));
if (!d1) {
  await copy('app.db');
  await copy('migrations', options);
}

await copy('db.d.ts');
await copy(`db.js`);
await copy('migrate.js');
await copy('reset.js');
await copy('makeTypes.js');
await copy('watch.js');

if (d1) {
  await copy('files.js');
  await copy('paths.js');
  await mkdir(join(root, 'migrations'));

  const file = await readFile('wrangler.toml', 'utf8');
  const parsed = toml.parse(file);
  const database = parsed
    .d1_databases
    .filter(d => d.migrations_dir !== undefined)
    .at(0);
  try {
    if (!database) {
      await mkdir('migrations');
    }
    else {
      await mkdir(database.migrations_dir);
    }
  }
  catch {
    console.log(`Migrations folder already exists so it wasn't created.`);
  }
}

const file = await readFile('package.json', 'utf8');
const config = JSON.parse(file);
config.type = 'module';
config.scripts.types = `node ${join(root, 'makeTypes.js')}`;
config.scripts.migrate = `node ${join(root, 'migrate.js')}`;
config.scripts.reset = `node ${join(root, 'reset.js')}`;
config.scripts.watch = `node ${join(root, 'watch.js')}`;
await writeFile('package.json', JSON.stringify(config, null, 2));
