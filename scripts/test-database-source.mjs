import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {databaseSource, sourceGitHead, sha256, verifyDatabaseSource} from './database-source.mjs';

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'pharmville-source-'));
const source = path.join(temporary, 'healthcare_db');
const migrations = path.join(source, 'postgresql/migrations');
const migration = path.join(migrations, 'V0001__example.sql');
const fragment = path.join(migrations, 'initial_schema/tables.sql');
const catalog = path.join(source, 'catalog.json');
const supporting = path.join(source, 'references.json');
const previousSource = process.env.PHARMVILLE_DATABASE_SOURCE;
let checks = 0;
const rejects = (action, pattern) => { assert.throws(action, pattern); checks++; };
try {
  fs.mkdirSync(path.dirname(fragment), {recursive: true});
  fs.mkdirSync(path.join(temporary, '.git')); // Parent metadata must never identify this source folder.
  fs.writeFileSync(migration, '-- preserved migration\n');
  fs.writeFileSync(fragment, '-- included schema fragment\n');
  fs.writeFileSync(catalog, '{}\n');
  fs.writeFileSync(supporting, '[]\n');
  const evidence = {git_head: null, migration_files: [{file: path.basename(migration), sha256: sha256(migration)}], sql_files: [{file: path.basename(migration), sha256: sha256(migration)}, {file: 'initial_schema/tables.sql', sha256: sha256(fragment)}], register_file: 'catalog.json', register_sha256: sha256(catalog), supporting_files: [{file: 'references.json', sha256: sha256(supporting)}]};
  delete process.env.PHARMVILLE_DATABASE_SOURCE;
  assert.equal(databaseSource(temporary), source); checks++;
  process.env.PHARMVILLE_DATABASE_SOURCE = path.join(temporary, 'explicit-source');
  assert.equal(databaseSource(temporary), process.env.PHARMVILLE_DATABASE_SOURCE); checks++;
  assert.equal(sourceGitHead(source), null); checks++;
  assert.deepEqual(verifyDatabaseSource(source, evidence), {sourceHead: null, migrationFiles: 1, sqlFiles: 2}); checks++;
  fs.appendFileSync(migration, '-- altered\n');
  rejects(() => verifyDatabaseSource(source, evidence), /Migration checksum differs/);
  fs.writeFileSync(migration, '-- preserved migration\n');
  fs.appendFileSync(fragment, '-- altered\n');
  rejects(() => verifyDatabaseSource(source, evidence), /SQL checksum differs/);
  fs.writeFileSync(fragment, '-- included schema fragment\n');
  fs.writeFileSync(path.join(migrations, 'V0002__unexpected.sql'), '-- unexpected\n');
  rejects(() => verifyDatabaseSource(source, evidence), /Versioned migration filenames differ/);
  fs.unlinkSync(path.join(migrations, 'V0002__unexpected.sql'));
  fs.unlinkSync(fragment);
  rejects(() => verifyDatabaseSource(source, evidence), /SQL migration\/fragment file set differs/);
  fs.writeFileSync(fragment, '-- included schema fragment\n');
  fs.writeFileSync(catalog, '{"altered":true}\n');
  rejects(() => verifyDatabaseSource(source, evidence), /Source checksum differs\/missing: catalog.json/);
  fs.writeFileSync(catalog, '{}\n');
  fs.appendFileSync(supporting, 'altered');
  rejects(() => verifyDatabaseSource(source, evidence), /Source checksum differs\/missing: references.json/);
  fs.writeFileSync(supporting, '[]\n');
  rejects(() => verifyDatabaseSource(source, {...evidence, git_head: 'unavailable-source-revision'}), /Git revision differs/);
  rejects(() => verifyDatabaseSource(path.join(temporary, 'missing'), evidence), /Database source unavailable/);
  rejects(() => verifyDatabaseSource(source, {...evidence, sql_files: []}), /SQL file manifest is missing/);
  console.log(`PASS: ${checks} source selection, snapshot identity and tamper/missing-file checks. No SQL executed.`);
} finally {
  if (previousSource === undefined) delete process.env.PHARMVILLE_DATABASE_SOURCE;
  else process.env.PHARMVILLE_DATABASE_SOURCE = previousSource;
  if (path.dirname(temporary) === path.resolve(os.tmpdir()) && path.basename(temporary).startsWith('pharmville-source-')) fs.rmSync(temporary, {recursive: true, force: true});
}
