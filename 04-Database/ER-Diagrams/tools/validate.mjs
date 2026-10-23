import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const erdRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.resolve(erdRoot,'../..');
const errors=[];
const check=(condition,message)=>{if(!condition)errors.push(message);};
const inventoryPath=path.join(erdRoot,'ERD-Inventory.json');
const inventory=JSON.parse(fs.readFileSync(inventoryPath,'utf8'));
const expectedSchemas=Object.keys(inventory.schemas).sort();
const relationshipIds=inventory.relationships.map(item=>item.id);
const expectedIds=new Set(relationshipIds);
const diagramIds=new Map();
const counts={schemas:0,diagrams:0,diagramRelationshipIds:0,catalogRows:0};

check(inventory.counts.schemas===24,'Inventory must cover 24 schemas.');
check(inventory.counts.tables===266&&inventory.tables.length===266,'Inventory must contain all 266 source tables.');
check(inventory.counts.columns===4438,'Inventory must report 4,438 source columns.');
check(inventory.counts.foreign_keys===1461&&relationshipIds.length===1461,'Inventory must contain all 1,461 declared FKs.');
check(inventory.counts.cross_schema_foreign_keys===894,'Inventory cross-schema FK count differs from the verified snapshot.');
check(inventory.counts.orm_relationship_declarations===0,'ORM relationship scan result differs from the recorded source review.');
check(new Set(relationshipIds).size===relationshipIds.length,'Relationship IDs are not unique.');
check(inventory.tables.filter(item=>item.foreign_key_count===0).map(item=>item.name).join(',')===inventory.tables_without_foreign_keys.join(','),'No-FK table index disagrees with the table inventory.');

const diagramOccurrences=[];
for(const schema of expectedSchemas){
 const schemaFile=Object.keys(inventory.schemas).sort().indexOf(schema)+1;
 const page=path.join(erdRoot,`${String(schemaFile).padStart(2,'0')}-${schema}.md`);
 check(fs.existsSync(page),`Missing schema ERD page: ${schema}.`);
 if(!fs.existsSync(page))continue;
 counts.schemas++;
 const text=fs.readFileSync(page,'utf8');
 const aliases=new Set([...text.matchAll(/^\s*([a-z][a-z0-9_]+)\s*\{/gm)].map(match=>match[1]));
 const explicitAliases=[...text.matchAll(/^\| `([a-z][a-z0-9_]+)` \| \[`([a-z_]+\.[a-z_]+)`\]\([^\n]+\) \|$/gm)];
 check(explicitAliases.length>=inventory.schemas[schema].tables,`${schema}: missing Mermaid alias-to-table mappings.`);
 for(const [,alias,qualified]of explicitAliases){check(aliases.has(alias),`${schema}: alias ${alias} has no Mermaid entity.`);check(qualified.startsWith(`${schema}.`)||inventory.tables.find(item=>item.name===qualified)?.diagram,`${schema}: invalid entity mapping ${qualified}.`);}
 const localDiagramMatches=[...text.matchAll(/<a id="(diagram-\d{2})"><\/a>/g)];
 counts.diagrams+=localDiagramMatches.length;
 for(const [,id]of localDiagramMatches){const key=`${schema}#${id}`;check(!diagramIds.has(key),`Duplicate diagram anchor ${key}.`);diagramIds.set(key,schema);}
 const mermaidBlocks=[...text.matchAll(/```mermaid\s*\nerDiagram\s*\n([\s\S]*?)\n```/g)];
 check(mermaidBlocks.length===localDiagramMatches.length,`${schema}: Mermaid ERD blocks and diagram anchors differ.`);
 for(const [,body]of mermaidBlocks){
  for(const [,label]of body.matchAll(/:\s*"([^"]+)"\s*$/gm)){
   const ids=label.match(/FK-\d{4}/g)||[];
   check(ids.length>0,`${schema}: ER edge has no relationship ID.`);
   for(const id of ids)diagramOccurrences.push(id);
  }
 }
 const catalog=path.join(erdRoot,'Relationship-Catalog',`${schema}.md`);
 check(fs.existsSync(catalog),`Missing FK catalog page: ${schema}.`);
 if(fs.existsSync(catalog)){
  const catalogText=fs.readFileSync(catalog,'utf8');
  const ids=[...catalogText.matchAll(/^\| (FK-\d{4}) \|/gm)].map(match=>match[1]);
  counts.catalogRows+=ids.length;
  for(const id of ids)check(expectedIds.has(id),`${schema}: catalog has unknown relationship ${id}.`);
 }
}
counts.diagramRelationshipIds=diagramOccurrences.length;
counts.diagrams=diagramIds.size;
const diagramCounts=new Map();
for(const id of diagramOccurrences)diagramCounts.set(id,(diagramCounts.get(id)||0)+1);
for(const id of expectedIds)check(diagramCounts.get(id)===1,`${id}: expected one ER diagram edge, found ${diagramCounts.get(id)||0}.`);
for(const id of diagramCounts.keys())check(expectedIds.has(id),`ER diagram contains unknown FK ${id}.`);
check(counts.catalogRows===relationshipIds.length,`Catalog has ${counts.catalogRows} rows; expected ${relationshipIds.length}.`);

for(const item of inventory.relationships){
 const [schema,table]=item.child.split('.');
 check(item.diagram.startsWith(`${schemaPageName(schema,expectedSchemas)}#diagram-`),`${item.id}: invalid owning diagram path.`);
 check(item.child_columns.length===item.parent_columns.length,`${item.id}: FK column arity mismatch.`);
 check(inventory.tables.some(tableItem=>tableItem.name===item.child),`${item.id}: child table missing from inventory.`);
 check(inventory.tables.some(tableItem=>tableItem.name===item.parent),`${item.id}: parent table missing from inventory.`);
}

for(const [file,marker]of [
 [path.join(root,'README.md'),'ERD-INDEX-LINK'],
 [path.join(root,'04-Database/README.md'),'ERD-INDEX-LINK'],
 [path.join(root,'04-Database/Schema-Overview.md'),'ERD-INDEX-LINK'],
 [path.join(root,'04-Database/Relationships.md'),'ERD-INDEX-LINK'],
 [path.join(root,'04-Database/Module-Mapping.md'),'ERD-MODULE-MAP-START']
])check(fs.readFileSync(file,'utf8').includes(marker),`Missing ERD navigation marker in ${path.relative(root,file)}.`);

function schemaPageName(schema,schemas){return `${String(schemas.indexOf(schema)+1).padStart(2,'0')}-${schema}.md`;}

if(errors.length){console.error(`ERD validation failed with ${errors.length} error(s):\n- ${errors.join('\n- ')}`);process.exitCode=1;}
else console.log(`ERD validation passed: ${counts.schemas} schemas, ${counts.diagrams} diagrams, ${counts.diagramRelationshipIds} diagram FK labels, ${counts.catalogRows} catalog rows.`);
