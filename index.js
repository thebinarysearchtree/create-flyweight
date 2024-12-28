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

let dbType = 'sqlite';
let root;
if (process.argv.length > 3) {
  dbType = process.argv[2];
  root = process.argv[3];
}
else {
  root = process.argv[2];
}

exec('npm install flyweightjs');
if (dbType === 'sqlite') {
  exec('npm install sqlite3');
}
else if (dbType === 'turso') {
  exec('npm install @libsql/client');
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
  if (dbType !== 'sqlite') {
    paths.push(dbType);
  }
  paths.push(from);
  const src = join(...paths);
  const dest = join(root, to);
  await cp(src, dest, options);
};

const options = { recursive: true };

await copy('sql', options);
await mkdir(join(root, 'views'));
if (dbType === 'sqlite') {
  await copy('app.db');
}
if (dbType === 'sqlite') {
  await copy('migrations', options);
}
else if (dbType !== 'sqlite') {
  await copy('files.js');
  await copy('paths.js');
  await mkdir(join(root, 'migrations'));
}

await copy('db.d.ts');
await copy(`db.js`);
await copy('migrate.js');
await copy('reset.js');
await copy('makeTypes.js');
await copy('watch.js');

if (dbType === 'd1') {
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

let config;
const setConfig = async () => {
  const file = await readFile('package.json', 'utf8');
  config = JSON.parse(file);
}
try {
  await setConfig();
}
catch {
  exec('npm init -y');
  await setConfig();
}
config.type = 'module';
if (!config.scripts) {
  config.scripts = {};
}
config.scripts.types = `node ${join(root, 'makeTypes.js')}`;
config.scripts.migrate = `node ${join(root, 'migrate.js')}`;
config.scripts.reset = `node ${join(root, 'reset.js')}`;
config.scripts.watch = `node ${join(root, 'watch.js')}`;
await writeFile('package.json', JSON.stringify(config, null, 2));
