import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {sha256,verifyDatabaseSource} from './database-source.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'pharmville-manifest-test-')),source=path.join(root,'pharmville-database');
try{
 fs.mkdirSync(source);fs.writeFileSync(path.join(source,'pharmville_schema.sql'),'CREATE SCHEMA example;\n');
 for(const file of ['catalog.json','register.json','references.json'])fs.writeFileSync(path.join(root,file),'{}\n');
 const evidence={schema_file:'pharmville_schema.sql',schema_sha256:sha256(path.join(source,'pharmville_schema.sql')),catalog_file:'catalog.json',catalog_sha256:sha256(path.join(root,'catalog.json')),register_file:'register.json',register_sha256:sha256(path.join(root,'register.json')),logical_reference_file:'references.json',logical_reference_sha256:sha256(path.join(root,'references.json')),git_head:'historical-source'};
 assert.equal(verifyDatabaseSource(source,evidence).sqlFiles,1);
 fs.appendFileSync(path.join(source,'pharmville_schema.sql'),'-- drift\n');
 assert.throws(()=>verifyDatabaseSource(source,evidence),/checksum differs/);
 evidence.schema_sha256=sha256(path.join(source,'pharmville_schema.sql'));
 fs.writeFileSync(path.join(source,'unexpected.py'),'');
 assert.throws(()=>verifyDatabaseSource(source,evidence),/must contain only/);
 fs.unlinkSync(path.join(source,'unexpected.py'));
 fs.writeFileSync(path.join(root,'catalog.json'),'{"drift":true}');
 assert.throws(()=>verifyDatabaseSource(source,evidence),/catalog.json/);
 assert.throws(()=>verifyDatabaseSource(path.join(root,'absent'),evidence),/unavailable/);
 console.log('PASS: manifest accepts intact standalone sources and rejects SQL/catalog drift, unexpected files and missing sources.');
}finally{fs.rmSync(root,{recursive:true,force:true});}
