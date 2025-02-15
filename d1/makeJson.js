import { makeTypes } from 'flyweight-client';
import paths from './paths.js';
import create from './db.js';
import sqlite3 from 'better-sqlite3';
import { localPath } from './config.js';

const db = new sqlite3(localPath);

const getSample = async (table, column) => {
  const sql = `select json(${column}) as ${column} from ${table} order by rowid desc limit 100`;
  return db.prepare(sql).all().map(r => JSON.parse(r[column]));
}

const database = create({}, true, getSample);
await makeTypes(database, paths, true);
