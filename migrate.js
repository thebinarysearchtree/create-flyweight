import { database, createMigration, runMigration } from './db.js';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const name = process.argv[2];

if (!name) {
  console.log('Please supply a name for the migration');
  process.exit();
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
const response = await rl.question('Run migration? (yes)/no:\n');
rl.close();
if (response === 'no') {
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
    console.log('Migration ran successfully.');
  }
  catch (e) {
    console.log('\nMigration rolled back due to:\n');
    throw e;
  }
  finally {
    await database.close();
  }
}
