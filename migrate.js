import { database, createMigration, runMigration, makeTypes } from './db.js';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const now = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

let name;
if (process.argv.length > 2) {
  name = `${now()}_${process.argv[2]}`;
}
else {
  name = now();
}

let migration;
try {
  migration = await createMigration(name);
}
catch (e) {
  console.log('Error creating migration:\n');
  await database.close();
  process.exit();
}
if (!migration.sql) {
  console.log('No changes detected.');
  process.exit();
}
console.log(`\n${migration.sql}\n`);
console.log('Edit the migration file if necessary.');
const rl = readline.createInterface({ input, output });
const response = await rl.question('Run migration? (y)/n:\n');
rl.close();
if (response === 'n') {
  try {
    await migration.undo();
  }
  finally {
    await database.close();
  }
}
else {
  try {
    await runMigration(name);
    await makeTypes();
    console.log('Migration ran successfully.');
  }
  catch (e) {
    await migration.undo();
    console.log('\nMigration rolled back due to:\n');
    throw e;
  }
  finally {
    await database.close();
  }
}
