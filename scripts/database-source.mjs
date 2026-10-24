import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export const databaseSource = root => path.join(root, 'pharmville-database');
export function verifyDatabaseSource(source, evidence) {
  if (!fs.existsSync(source)) throw new Error('Standalone database source unavailable.');
  const root=path.dirname(source), errors=[];
  const files=fs.readdirSync(source).sort();
  if(JSON.stringify(files)!==JSON.stringify(['pharmville_schema.sql'])) errors.push('Final database directory must contain only pharmville_schema.sql.');
  for(const [file,expected] of [[path.join(source,evidence.schema_file),evidence.schema_sha256], [path.join(root,evidence.catalog_file),evidence.catalog_sha256], [path.join(root,evidence.register_file),evidence.register_sha256], [path.join(root,evidence.logical_reference_file),evidence.logical_reference_sha256]]) {
    if(!expected||!fs.existsSync(file)||sha256(file)!==expected) errors.push(`Source checksum differs/missing: ${path.relative(root,file)}`);
  }
  if(errors.length)throw new Error(errors.join('\n'));
  return {sourceHead:evidence.git_head,sqlFiles:1};
}
