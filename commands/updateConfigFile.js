import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './test.db',
  driver: sqlite3.Database,
});

async function updateConfigFile(key, data) {
  await db.run(`INSERT INTO config(${key}) VALUES (${data})`);
}
export default updateConfigFile;
