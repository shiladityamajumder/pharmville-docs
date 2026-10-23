import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const db = process.env.PHARMVILLE_DATABASE_SOURCE ? path.resolve(process.env.PHARMVILLE_DATABASE_SOURCE) : path.resolve(root, '../healthcare_db');
const evidence = JSON.parse(fs.readFileSync(path.join(root, '09-References/Database-Evidence.json'), 'utf8'));
const errors = [];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if (!fs.existsSync(path.join(db, 'postgresql/migrations'))) {
  console.error('UNAVAILABLE: database source not found. Set PHARMVILLE_DATABASE_SOURCE to the intended checkout; no database validation passed.');
  process.exit(2);
}
const head = execFileSync('git', ['-C', db, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (head !== evidence.git_head) errors.push(`Source revision differs from recorded evidence: ${head}`);
const current = fs.readdirSync(path.join(db, 'postgresql/migrations')).filter(n => /^V\d+.*\.sql$/.test(n)).sort();
const recorded = evidence.migration_files.map(m => m.file).sort();
if (JSON.stringify(current) !== JSON.stringify(recorded)) errors.push('Versioned migration filenames differ from evidence');
for (const m of evidence.migration_files) {
  const file = path.join(db, 'postgresql/migrations', m.file);
  if (!fs.existsSync(file) || sha(file) !== m.sha256) errors.push(`Migration checksum differs/missing: ${m.file}`);
}
const catalogPath = path.join(db, evidence.register_file);
if (!fs.existsSync(catalogPath)) errors.push('Recorded final table catalog is missing');
else {
  if (sha(catalogPath) !== evidence.register_sha256) errors.push('Catalog checksum differs from evidence');
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
console.log(`Compared ${current.length} versioned SQL migration checksums; no SQL or application code executed.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('PASS: available source matches the recorded snapshot. Intended-release discrepancy and live deployment remain unverified.');
