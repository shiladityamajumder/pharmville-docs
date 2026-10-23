import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const fixture = path.join(root, 'validator-negative-fixture.md');
if (fs.existsSync(fixture)) throw new Error('Refusing to replace an existing fixture path');
try {
  fs.writeFileSync(fixture, '# Fixture\n\n### Skipped level\n\n[missing](missing-quality-target.md)\n\n| A | B |\n| value |\n\n```text\nflowchart TD\n A --> B\n```\n\n```mermaid\nflowchart TD\n A[broken\n```\n\n```text\nunclosed\n');
  const result = spawnSync(process.execPath, ['scripts/validate-docs.mjs'], { cwd: root, encoding: 'utf8', timeout: 120000 });
  if (result.error) throw result.error;
  const report = JSON.parse(result.stdout);
  const messages = report.errors.filter(e => e.startsWith('validator-negative-fixture.md:')).join('\n');
  for (const expected of ['heading skips a level', 'missing link', 'table header has no separator', 'table column count differs', 'diagram is not in a mermaid fence', 'unclosed code fence', 'Mermaid']) {
    if (!messages.includes(expected)) throw new Error('Validator missed regression fixture: ' + expected + '\n' + messages);
  }
  if (result.status !== 1) throw new Error('Malformed documentation did not fail validation');
  console.log('PASS: malformed links, headings, tables, fences and Mermaid are rejected by actual validation.');
} finally { fs.unlinkSync(fixture); }
