import { SQLiteDatabase } from 'flyweightjs';
import { join } from 'path';
import sqlite3 from 'better-sqlite3';
import { readFile, writeFile, readdir } from 'fs/promises';
import { paths, config } from './config.js';

const readSql = async (path) => {
  let sql = '';
  if (path.endsWith('.sql')) {
    sql = await readFile(path, 'utf8');
  }
  else {
    const names = await readdir(path);
    for (const name of names) {
      if (name.endsWith('.sql')) {
        let text = await readFile(join(path, name), 'utf8');
        text = text.trim();
        if (!text.endsWith(';')) {
          text += ';';
        }
        text += '\n\n';
        sql += text;
      }
    }
  }
  return sql.trim() + '\n';
}

const adaptor = {
  sqlite3,
  readFile,
  writeFile,
  readdir,
  join,
  readSql
};

const database = new SQLiteDatabase({
  adaptor,
  paths,
  config
});

const db = database.getClient();

export {
  database,
  db
}
