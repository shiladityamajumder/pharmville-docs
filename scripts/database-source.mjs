import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

export const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

export function databaseSource(root) {
  return process.env.PHARMVILLE_DATABASE_SOURCE
    ? path.resolve(process.env.PHARMVILLE_DATABASE_SOURCE)
    : path.join(root, 'healthcare_db');
}

// A supplied source folder may sit inside the docs Git repo without its own Git history.
export function sourceGitHead(source) {
  return fs.existsSync(path.join(source, '.git'))
    ? execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim()
    : null;
}

export function verifyDatabaseSource(source, evidence) {
  const migrationDir = path.join(source, 'postgresql/migrations');
  if (!fs.existsSync(migrationDir)) throw new Error('Database source unavailable. Supply healthcare_db/ or set PHARMVILLE_DATABASE_SOURCE.');
  const errors = [];
  const sourceHead = sourceGitHead(source);
  if (evidence.git_head && sourceHead !== evidence.git_head) errors.push('Database source Git revision differs from recorded evidence.');
  const migrations = fs.readdirSync(migrationDir).filter(file => /^V\d+.*\.sql$/.test(file)).sort();
  if (JSON.stringify(migrations) !== JSON.stringify(evidence.migration_files.map(item => item.file).sort())) errors.push('Versioned migration filenames differ from evidence.');
  for (const item of evidence.migration_files) {
    const file = path.join(migrationDir, item.file);
    if (!fs.existsSync(file) || sha256(file) !== item.sha256) errors.push(`Migration checksum differs/missing: ${item.file}`);
  }
  const sqlFiles = [];
  function collect(directory) {
    for (const item of fs.readdirSync(directory, {withFileTypes: true})) {
      const file = path.join(directory, item.name);
      if (item.isDirectory()) collect(file);
      else if (item.name.endsWith('.sql')) sqlFiles.push(path.relative(migrationDir, file).replaceAll('\\', '/'));
    }
  }
  collect(migrationDir);
  if (!evidence.sql_files?.length) errors.push('Recorded SQL file manifest is missing.');
  else {
    if (JSON.stringify(sqlFiles.sort()) !== JSON.stringify(evidence.sql_files.map(item => item.file).sort())) errors.push('SQL migration/fragment file set differs from evidence.');
    for (const item of evidence.sql_files) {
      const file = path.join(migrationDir, item.file);
      if (!fs.existsSync(file) || sha256(file) !== item.sha256) errors.push(`SQL checksum differs/missing: ${item.file}`);
    }
  }
  const sourceFiles = [{file: evidence.register_file, sha256: evidence.register_sha256}, ...(evidence.supporting_files || [])];
  for (const item of sourceFiles) {
    const file = path.join(source, item.file);
    if (!fs.existsSync(file) || sha256(file) !== item.sha256) errors.push(`Source checksum differs/missing: ${item.file}`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return {sourceHead, migrationFiles: migrations.length, sqlFiles: sqlFiles.length};
}
