#!/usr/bin/env node
import { execSync } from 'child_process';
import { cp, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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
  exec('npm install better-sqlite3');
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
  if (dbType !== 'sqlite' && ['config.js', 'system.js'].includes(from)) {
    paths.push(dbType);
  }
  paths.push(from);
  const src = join(...paths);
  const dest = join(root, to);
  await cp(src, dest, options);
};

const options = { recursive: true };

await copy('sql', options);
await copy('config.js');
await mkdir(join(root, 'views'));
await copy('app.db');
await copy('migrations', options);
await copy(`internal.js`);
await copy(`db.js`);
await copy('migrate.js');
await copy('reset.js');
await copy('makeTypes.js');
await copy('makeJson.js');
await copy('watch.js');

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
config.scripts.sample = `node ${join(root, 'makeJson.js')}`;
config.scripts.migrate = `node ${join(root, 'migrate.js')}`;
config.scripts.reset = `node ${join(root, 'reset.js')}`;
config.scripts.watch = `node ${join(root, 'watch.js')}`;
await writeFile('package.json', JSON.stringify(config, null, 2));
exec('npm run types');
