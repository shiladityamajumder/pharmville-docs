import fs from 'node:fs';
import path from 'node:path';
import {databaseSource, verifyDatabaseSource, sha256} from './database-source.mjs';

const root = path.resolve(import.meta.dirname, '..');
const db = databaseSource(root);
const evidence = JSON.parse(fs.readFileSync(path.join(root, '09-References/Database-Evidence.json'), 'utf8'));
const errors = [];
if (!fs.existsSync(path.join(db, 'postgresql/migrations'))) {
  console.error('UNAVAILABLE: supply healthcare_db/ or set PHARMVILLE_DATABASE_SOURCE; no database validation passed.');
  process.exit(2);
}
let verified;
try { verified = verifyDatabaseSource(db, evidence); }
catch (error) { console.error(error.message); process.exit(1); }
const catalogPath = path.join(db, evidence.register_file);
if (!fs.existsSync(catalogPath)) errors.push('Recorded final table catalog is missing');
else {
  if (sha256(catalogPath) !== evidence.register_sha256) errors.push('Catalog checksum differs from evidence');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8').replace(/^\uFEFF/, ''));
  let columns = 0;
  for (const [table, def] of Object.entries(catalog)) {
    const [schema, name] = table.split('.');
    const file = path.join(root, '04-Database/Tables', schema, name + '.md');
    if (!fs.existsSync(file)) { errors.push(`Missing table page: ${table}`); continue; }
    const source = fs.readFileSync(file, 'utf8');
    const fieldSection = source.split('## Record lifecycle')[0];
    const fields = [...fieldSection.matchAll(/^\| `([a-z_][a-z_0-9]*)` \| `[^`]+` \| (?:Yes|No) \|/gm)].map(m => m[1]).sort();
    const expected = Object.keys(def.columns).sort();
    columns += expected.length;
    if (JSON.stringify(fields) !== JSON.stringify(expected)) errors.push(`Column inventory differs: ${table}`);
  }
  console.log(`Compared ${Object.keys(catalog).length} table pages and ${columns} columns with the recorded catalog.`);
}
console.log(`Verified ${verified.migrationFiles} versioned migrations and all ${verified.sqlFiles} SQL files including fragments; no SQL or application code executed.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('PASS: database source matches the recorded V0001-V0030 documentation baseline. Live deployment was not inspected.');
