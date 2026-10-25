import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {databaseSource,verifyDatabaseSource} from '../../../scripts/database-source.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const erdRoot=path.resolve(here,'..');
const root=path.resolve(erdRoot,'../..');
const evidence=JSON.parse(fs.readFileSync(path.join(root,'09-References/Database-Evidence.json'),'utf8'));
const dbRoot=databaseSource(root);
const registry=JSON.parse(fs.readFileSync(path.join(root,'03-Modules/Module-Registry.json'),'utf8'));
const moduleDirectory=Object.fromEntries(registry.map(m=>[m.id,m.directory]));
const fail=message=>{throw new Error(message);};

const {sourceHead}=verifyDatabaseSource(dbRoot,evidence);
const registerPath=path.join(root,evidence.register_file);
const rawRegister=JSON.parse(fs.readFileSync(registerPath,'utf8'));
const referencePath=path.join(root,evidence.logical_reference_file);
const rawLogicalReferences=JSON.parse(fs.readFileSync(referencePath,'utf8').replace(/^\uFEFF/,''));
const schemaDescriptions={
 appointment:'Appointments and scheduling',catalog:'Products, medicines, and classification',clinical:'Prescriptions and pharmacist decisions',commerce:'Carts, checkout, orders, and returns',compliance:'Regulatory records and retention actions',customer:'Customer profiles and addresses',diagnostics:'Tests and laboratory services',finance:'Invoices, ledgers, and settlements',fulfillment:'Picking, packing, and shipment preparation',identity:'Accounts, sessions, and permissions',insurance:'Policies and claims',logistics:'Riders, shipments, and delivery',marketplace:'Sellers and listings',membership:'Benefits and loyalty',notification:'Templates, messages, and delivery attempts',organization:'Operating companies, sites, and licenses',payment:'Payment attempts, confirmation, and refunds',platform:'Configuration, files, audit, events, and reports',pricing:'Prices, taxes, and promotions',procurement:'Suppliers, purchase orders, and receiving',risk:'Risk rules, cases, and signals',search:'Search indexes and query signals',support:'Customer support cases',warehouse:'Stock balances, lots, and transfers'
};
const moduleSchemas={
 Admin_CMS:['organization','platform'],Audit:['compliance','platform','risk'],Authentication_Access:['identity','organization'],Cart_Checkout:['commerce','pricing','warehouse'],Customer_Accounts:['customer','identity','clinical'],Customer_Orders:['commerce','logistics'],Delivery_Operations:['logistics','organization'],Finance_Payments:['payment','finance','commerce'],Inventory:['warehouse','catalog','procurement'],Notifications:['notification','platform'],Order_Operations:['commerce','fulfillment','organization'],Pharmacist_Review:['clinical','commerce'],Prescription_Upload:['clinical','platform'],Product_Catalog:['catalog','marketplace','pricing','search'],Reporting:['platform','finance'],Rider_App:['identity','logistics','notification'],Store_Operations:['fulfillment','warehouse','procurement'],Warehouse:['warehouse','procurement']
};
const schemaModules=Object.fromEntries(Object.keys(schemaDescriptions).map(schema=>[schema,Object.entries(moduleSchemas).filter(([,schemas])=>schemas.includes(schema)).map(([module])=>module)]));
const workflowSchemas={
 'WF-001':['identity','customer','organization'],'WF-002':['search','catalog','pricing','warehouse'],'WF-003':['commerce','customer','catalog','pricing','warehouse'],'WF-004':['clinical','commerce','platform'],'WF-005':['payment','commerce','finance'],'WF-006':['warehouse','organization','commerce'],'WF-007':['fulfillment','commerce','warehouse'],'WF-008':['logistics','fulfillment','commerce'],'WF-009':['logistics','payment','finance'],'WF-010':['commerce','payment','finance','logistics'],'WF-011':['warehouse','procurement','catalog'],'WF-012':['platform','finance','identity'],'WF-013':['support','commerce','appointment','diagnostics'],'WF-014':['procurement','warehouse','catalog']
};
const currentTables=new Map();
const idKey=name=>name.replaceAll('.','__');
const escRegExp=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const parseColumns=expression=>expression.split(',').map(value=>value.trim().replace(/^"|"$/g,''));
const normalizeType=raw=>{
 const value=raw.toLowerCase();
 if(value==='timestamp with time zone')return 'timestamptz';
 if(value==='timestamp without time zone')return 'timestamp';
 if(value==='character varying'||value.startsWith('character varying('))return 'varchar';
 if(value==='double precision')return 'float8';
 if(value==='boolean')return 'boolean';
 if(value.startsWith('numeric'))return 'numeric';
 if(value.startsWith('time with time zone'))return 'timetz';
 if(value.startsWith('time without time zone'))return 'time';
 return (value.match(/^[a-z_][a-z_0-9]*/) || ['value'])[0].replaceAll('.','_');
};
function keyExpressions(table){
 const pks=[],unique=[];
 for(const [name,encoded]of Object.entries(table.constraints||{})){
  const [kind,definition]=JSON.parse(encoded);
  const match=definition.match(/^(?:PRIMARY KEY|UNIQUE)\s*\(([^)]+)\)/i);
  if(!match)continue;
  const columns=parseColumns(match[1]);
  if(kind==='p')pks.push(columns);
  if(kind==='u')unique.push(columns);
 }
 for(const encoded of Object.values(table.indexes||{})){
  const [definition,, ,isUnique]=JSON.parse(encoded);
  if(!isUnique||/\bWHERE\b/i.test(definition))continue;
  const match=definition.match(/\bON\s+[\w.]+\s+(?:USING\s+\w+\s*)?\(([^)]+)\)/i);
  if(match){const columns=parseColumns(match[1]).map(column=>column.replace(/\s+(ASC|DESC)(\s+NULLS\s+(FIRST|LAST))?$/i,'').trim());if(columns.every(column=>/^[a-z_][a-z_0-9]*$/i.test(column)))unique.push(columns);}
 }
 return {pks,unique};
}
const relationshipPattern=/^FOREIGN KEY\s*\(([^)]+)\)\s+REFERENCES\s+([a-z_][\w$]*)\.([a-z_][\w$]*)\s*\(([^)]+)\)(.*)$/i;
for(const [name,definition]of Object.entries(rawRegister)){
 const [schema,tableName]=name.split('.');
 const columns=Object.fromEntries(Object.entries(definition.columns||{}).map(([column,encoded])=>{const value=JSON.parse(encoded);return [column,{type:normalizeType(value.type),notNull:Boolean(value.not_null),rawType:value.type}];}));
 const keys=keyExpressions(definition);
 const table={name,schema,tableName,columns,primaryKeys:keys.pks,uniqueKeys:keys.unique,foreignKeys:[],description:'',purposeStatus:'Inferred'};
 const page=path.join(root,'04-Database/Tables',schema,`${tableName}.md`);
 if(fs.existsSync(page)){
  const markdown=fs.readFileSync(page,'utf8');
  const purpose=markdown.match(/^\*\*Business purpose(?: \((Confirmed|Inferred)\))?:\*\*\s*(.+)$/m);
  if(purpose){table.description=purpose[2].trim();table.purposeStatus=purpose[1]||'Inferred';}
 }
 currentTables.set(name,table);
}
const relationships=[];
for(const [name,definition]of Object.entries(rawRegister)){
 const child=currentTables.get(name);
 for(const [constraint,encoded]of Object.entries(definition.constraints||{})){
  const [kind,sql]=JSON.parse(encoded);if(kind!=='f')continue;
  const match=sql.match(relationshipPattern);
  if(!match)fail(`Could not parse FK ${name}.${constraint}: ${sql}`);
  const childColumns=parseColumns(match[1]),parent=`${match[2]}.${match[3]}`,parentColumns=parseColumns(match[4]),actions=match[5];
  if(childColumns.length!==parentColumns.length)fail(`Arity mismatch in ${name}.${constraint}`);
  const target=currentTables.get(parent);if(!target)fail(`Missing FK parent table ${parent} for ${name}.${constraint}`);
  for(const column of childColumns)if(!child.columns[column])fail(`Missing child FK column ${name}.${column}`);
  for(const column of parentColumns)if(!target.columns[column])fail(`Missing parent FK column ${parent}.${column}`);
  const targetUnique=[...target.primaryKeys,...target.uniqueKeys].some(columns=>JSON.stringify(columns)===JSON.stringify(parentColumns));
  if(!targetUnique)fail(`Referenced columns are not a recorded unique key: ${parent}(${parentColumns.join(', ')}) via ${constraint}`);
  const required=childColumns.every(column=>child.columns[column].notNull);
  const childUnique=[...child.primaryKeys,...child.uniqueKeys].some(columns=>JSON.stringify(columns)===JSON.stringify(childColumns));
  const deleteRule=(actions.match(/\bON DELETE\s+(NO ACTION|RESTRICT|CASCADE|SET NULL|SET DEFAULT)/i)||[])[1]?.toUpperCase()||'NO ACTION';
  const updateRule=(actions.match(/\bON UPDATE\s+(NO ACTION|RESTRICT|CASCADE|SET NULL|SET DEFAULT)/i)||[])[1]?.toUpperCase()||'NO ACTION';
  const matchType=(actions.match(/\bMATCH\s+(FULL|PARTIAL|SIMPLE)/i)||[])[1]?.toUpperCase()||'SIMPLE';
  const relation={id:'',constraint,child:name,parent,childColumns,parentColumns,required,childUnique,deleteRule,updateRule,matchType,sql,childSchema:child.schema,parentSchema:target.schema,sourceMigration:'',diagram:''};
  relationships.push(relation);child.foreignKeys.push(relation);
 }
}
relationships.sort((a,b)=>a.child.localeCompare(b.child)||a.constraint.localeCompare(b.constraint));
const priorInventory=JSON.parse(fs.readFileSync(path.join(erdRoot,'ERD-Inventory.json'),'utf8'));
const priorIds=new Map(priorInventory.relationships.map(r=>[r.child+'.'+r.constraint,r.id]));
let nextId=Math.max(...priorInventory.relationships.map(r=>Number(r.id.slice(3))));
for(const r of relationships)r.id=priorIds.get(r.child+'.'+r.constraint)||'FK-'+String(++nextId).padStart(4,'0');
const sourceColumns=new Set([...currentTables.values()].flatMap(table=>Object.keys(table.columns)));
const schemas=[...new Set([...currentTables.values()].map(table=>table.schema))].sort();
if(schemas.length!==24||currentTables.size!==evidence.counts.tables||relationships.length!==evidence.counts.f)fail(`Unexpected source inventory: ${schemas.length} schemas, ${currentTables.size} tables, ${relationships.length} FKs.`);
const totalColumns=[...currentTables.values()].reduce((sum,table)=>sum+Object.keys(table.columns).length,0);
if(totalColumns!==evidence.counts.columns)fail(`Unexpected source column count: ${totalColumns}`);
for(const relation of relationships) relation.sourceMigration='Validated standalone SQL / effective V0030 + proposed D-028';
const logicalReferences=Object.entries(rawLogicalReferences).map(([column,item])=>({column,...item}));
const nonForeignReferences=logicalReferences.filter(item=>item.category!=='real domain FK');
const noFkTables=[...currentTables.values()].filter(table=>table.foreignKeys.length===0).map(table=>table.name);
const crossSchemaRelationships=relationships.filter(item=>item.childSchema!==item.parentSchema);
const schemaStats=Object.fromEntries(schemas.map(schema=>[schema,{tables:[...currentTables.values()].filter(table=>table.schema===schema).length,foreignKeys:relationships.filter(item=>item.childSchema===schema).length,crossSchemaForeignKeys:relationships.filter(item=>item.childSchema===schema&&item.parentSchema!==schema).length}]));

// Group source tables into focused ER diagrams. Every child table appears once as a focus table;
// its parents are included as context so its recorded FK constraints remain visible.
const diagrams=[];
const diagramForChild=new Map();
for(const schema of schemas){
 const todo=new Map([...currentTables.values()].filter(table=>table.schema===schema).map(table=>[table.name,table]));
 let serial=0;
 while(todo.size){
  let roots=[],nodes=new Set();
  const degreeSorted=[...todo.values()].sort((a,b)=>b.foreignKeys.length-a.foreignKeys.length||a.name.localeCompare(b.name));
  const seed=degreeSorted.find(table=>new Set([table.name,...table.foreignKeys.map(item=>item.parent)]).size<=18)||degreeSorted[0];
  roots.push(seed);for(const n of [seed.name,...seed.foreignKeys.map(item=>item.parent)])nodes.add(n);todo.delete(seed.name);
  while(roots.length<8){
   const candidates=[...todo.values()].map(table=>{const candidatesNodes=new Set([table.name,...table.foreignKeys.map(item=>item.parent)]);const extra=[...candidatesNodes].filter(item=>!nodes.has(item)).length;const overlap=candidatesNodes.size-extra;return {table,candidatesNodes,extra,overlap};}).filter(item=>nodes.size+item.extra<=18);
   if(!candidates.length)break;
  const score=item=>item.overlap*3-item.extra*2+item.table.foreignKeys.length*.1;
  candidates.sort((a,b)=>score(b)-score(a)||a.table.name.localeCompare(b.table.name));
   const selected=candidates[0];roots.push(selected.table);for(const n of selected.candidatesNodes)nodes.add(n);todo.delete(selected.table.name);
  }
  serial++;const diagram={schema,id:`diagram-${String(serial).padStart(2,'0')}`,roots:roots.map(table=>table.name),nodes:[...nodes].sort(),edges:roots.flatMap(table=>table.foreignKeys)};
  diagrams.push(diagram);for(const table of diagram.roots)diagramForChild.set(table,diagram.id);
 }
}
for(const relation of relationships)relation.diagram=diagramForChild.get(relation.child);
if(diagramForChild.size!==currentTables.size)fail(`ER diagram partition misses ${currentTables.size-diagramForChild.size} source tables.`);

const output=relative=>path.join(erdRoot,relative);
const write=(relative,content)=>{const file=output(relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content.endsWith('\n')?content:content+'\n');};
const markdownLink=(text,file)=>`[${text}](${file})`;
const tableLink=table=>`[\`${table.tableName}\`](../Tables/${table.schema}/${table.tableName}.md)`;
const moduleHldPath=module=>path.join(root,'03-Modules',moduleDirectory[module],'HLD.md');
const moduleLldPath=module=>path.join(root,'03-Modules',moduleDirectory[module],'LLD.md');
const moduleLink=(module,kind='HLD')=>`[${module} ${kind}](../../03-Modules/${moduleDirectory[module]}/${kind}.md)`;
const workflowLink=id=>`[${id}](../../06-Workflows/${id}-*.md)`;
const relationCardinality=relation=>{
 const each=relation.required?'must reference exactly one':'may reference zero or one';
 const children=relation.childUnique?'zero or one':'zero or more';
 return `Each child ${each} parent; each parent may have ${children} child row(s).`;
};
const idFor=relation=>relation.id.replace('-','');
const groupedDiagramEdges=diagram=>{
 const map=new Map();
 for(const relation of diagram.edges){
  const key=[relation.parent,relation.child,relation.required?'required':'optional',relation.childUnique?'unique':'many'].join('|');
  if(!map.has(key))map.set(key,{parent:relation.parent,child:relation.child,required:relation.required,childUnique:relation.childUnique,relationships:[]});
  map.get(key).relationships.push(relation);
 }
 return [...map.values()];
};
const mermaidEntity=(table,visibleColumns)=>{
 const pks=new Set(table.primaryKeys.flat()),unique=new Set(table.uniqueKeys.flat()),fk=new Set(table.foreignKeys.flatMap(item=>item.childColumns));
 for(const relation of relationships.filter(item=>item.parent===table.name))for(const column of relation.parentColumns)visibleColumns.add(column);
 for(const column of table.primaryKeys.flat())visibleColumns.add(column);
 for(const key of table.uniqueKeys)for(const column of key)visibleColumns.add(column);
 for(const column of table.foreignKeys.flatMap(item=>item.childColumns))visibleColumns.add(column);
 const attributes=[...visibleColumns].filter(column=>table.columns[column]).sort().map(column=>{
  const keys=[];if(pks.has(column))keys.push('PK');if(fk.has(column)||relationships.some(item=>item.parent===table.name&&item.parentColumns.includes(column)))keys.push('FK');if(unique.has(column))keys.push('UK');
  return `        ${table.columns[column].type} ${column}${keys.length?' '+keys.join(', '):''}`;
 });
 return `    ${idKey(table.name)} {\n${attributes.join('\n')}\n    }`;
};
const schemaPageNames=Object.fromEntries(schemas.map((schema,index)=>[schema,`${String(index+1).padStart(2,'0')}-${schema}.md`]));
const schemaLink=(schema,display=schema)=>`[${display}](${schemaPageNames[schema]})`;
const exactSourcePhrase='Validated standalone SQL / PostgreSQL 18 effective catalog';

// Machine-readable evidence cache: key columns, exact FK definitions and non-FK references.
const inventory={source:{git_head:sourceHead,migration_baseline:'V0001-V0030 + proposed D-028',catalog_sha256:evidence.register_sha256,checked_on:evidence.checked_on,live_database_inspected:evidence.live_database_inspected,source_directory:evidence.source_directory,source_kind:evidence.source_kind,documentation_baseline:evidence.documentation_baseline},counts:{schemas:schemas.length,tables:currentTables.size,columns:totalColumns,foreign_keys:relationships.length,cross_schema_foreign_keys:crossSchemaRelationships.length,diagrams:diagrams.length,orm_relationship_declarations:0},schemas:schemaStats,tables:[...currentTables.values()].sort((a,b)=>a.name.localeCompare(b.name)).map(table=>({name:table.name,primary_keys:table.primaryKeys,unique_keys:table.uniqueKeys,diagram:diagramForChild.get(table.name),foreign_key_count:table.foreignKeys.length,key_columns:[...new Set([...table.primaryKeys.flat(),...table.uniqueKeys.flat(),...table.foreignKeys.flatMap(item=>item.childColumns)])].sort().map(column=>({name:column,...table.columns[column]}))})),relationships:relationships.map(item=>({id:item.id,constraint:item.constraint,child:item.child,parent:item.parent,child_columns:item.childColumns,parent_columns:item.parentColumns,required:item.required,child_unique:item.childUnique,on_delete:item.deleteRule,on_update:item.updateRule,match:item.matchType,migration:item.sourceMigration,diagram:`${schemaPageNames[item.childSchema]}#${item.diagram}`})),non_foreign_uuid_references:nonForeignReferences.map(item=>({column:item.column,category:item.category,decision:item.decision,reason:item.reason||'',discriminator:item.discriminator||''})),tables_without_foreign_keys:noFkTables};
write('ERD-Inventory.json',JSON.stringify(inventory,null,2));

const workflowMap=new Map();
const workflowNames={'WF-001':'Identity-and-Session','WF-002':'Search-and-Availability','WF-003':'Cart-Quote-and-Reservation','WF-004':'Prescription-Intake-and-Review','WF-005':'Payment-and-Confirmation','WF-006':'Licensed-Site-Allocation','WF-007':'Picking-Packing-and-Handoff','WF-008':'Rider-Assignment-and-POD','WF-009':'COD-Collection','WF-010':'Cancellation-Return-and-Refund','WF-011':'Inventory-Reconciliation','WF-012':'Report-Export-and-Audit','WF-013':'Customer-Support-Triage','WF-014':'Supplier-Receiving'};
for(const [workflow,domains]of Object.entries(workflowSchemas))for(const schema of domains){if(!workflowMap.has(schema))workflowMap.set(schema,[]);workflowMap.get(schema).push(workflow);}
const schemaDomainEdges=new Map();
for(const relation of crossSchemaRelationships){const key=`${relation.childSchema}->${relation.parentSchema}`;if(!schemaDomainEdges.has(key))schemaDomainEdges.set(key,[]);schemaDomainEdges.get(key).push(relation);}
const majorPairs=[
 ['commerce','catalog'],['commerce','customer'],['commerce','clinical'],['commerce','warehouse'],['commerce','marketplace'],['commerce','identity'],['commerce','pricing'],
 ['payment','commerce'],['payment','identity'],['finance','commerce'],['finance','payment'],['finance','marketplace'],['fulfillment','commerce'],['fulfillment','warehouse'],['logistics','commerce'],['logistics','fulfillment'],['logistics','warehouse'],
 ['clinical','commerce'],['clinical','catalog'],['clinical','customer'],['appointment','clinical'],['diagnostics','clinical'],
 ['procurement','catalog'],['procurement','warehouse'],['warehouse','procurement'],['warehouse','catalog'],['pricing','catalog'],['marketplace','organization'],
 ['notification','platform'],['support','commerce'],['support','appointment'],['risk','identity'],['platform','identity'],['customer','identity']
].filter(([child,parent])=>schemaDomainEdges.has(`${child}->${parent}`));
const mainMap=`# System data map

## What this map shows

Pharmville's checked-out database snapshot contains **${schemas.length} schemas, ${currentTables.size} tables, ${totalColumns.toLocaleString('en-US')} columns, and ${relationships.length.toLocaleString('en-US')} declared foreign keys**. The map below shows representative business-domain dependencies backed by one or more declared foreign keys. Arrows point from the schema that owns the referencing (child) column to the schema containing its referenced (parent) key; they do not grant access or establish service write ownership. The [cross-domain reference register](15-Cross-Domain-Relationships.md) lists every observed cross-schema pair.

## Main domain map

\`\`\`mermaid
flowchart LR
  identity["Identity and access"]
  customer["Customer"]
  organization["Organization"]
  catalog["Catalog and products"]
  marketplace["Marketplace"]
  pricing["Pricing"]
  commerce["Cart, checkout and orders"]
  clinical["Clinical and prescriptions"]
  appointment["Appointments"]
  diagnostics["Diagnostics"]
  payment["Payment"]
  finance["Finance"]
  warehouse["Warehouse and inventory"]
  procurement["Procurement"]
  fulfillment["Fulfillment"]
  logistics["Delivery and riders"]
  notification["Notifications"]
  support["Support"]
  compliance["Compliance"]
  platform["Platform, files, audit, reports"]
  search["Search"]
  risk["Risk"]
  insurance["Insurance"]
  membership["Membership"]
${majorPairs.map(([child,parent])=>`  ${child} -->|${schemaDomainEdges.get(`${child}->${parent}`).length} FKs| ${parent}`).join('\n')}
\`\`\`

The diagram focuses on cross-domain connections used to orient readers. Identity references are repeated across many tables; their exact constraints are cataloged in the detailed schema diagrams and relationship index. Appointment, diagnostics, insurance, membership, risk, search, support, notification, compliance, and platform are included because their schemas exist in the checked-out source even where their launch scope is not approved.

## Database domains

| Schema | Tables | Recorded area | Detailed ER diagrams |
|---|---:|---|---|
${schemas.map(schema=>`| \`${schema}\` | ${schemaStats[schema].tables} | ${schemaDescriptions[schema]} | ${schemaLink(schema)} |`).join('\n')}

## Evidence boundary

This documentation is generated from [the canonical standalone SQL](../../pharmville-database/pharmville_schema.sql) and its derived [validated catalog](../Schema-Catalog.json). A private PostgreSQL 18.6 replay through V0030 and a separate empty schema installation produced zero differences across 23 catalog dimensions. [Evidence](../../09-References/Database-Evidence.json) records file checksums and archive provenance. No production database was inspected.
`;
write('00-System-Data-Map.md',mainMap);

const labelify=value=>value.replaceAll('_',' ').replace(/\b\w/g,char=>char.toUpperCase());
const schemaDocs=[];
for(const schema of schemas){
 const tables=[...currentTables.values()].filter(table=>table.schema===schema).sort((a,b)=>a.tableName.localeCompare(b.tableName));
 const localDiagrams=diagrams.filter(diagram=>diagram.schema===schema);
 let diagramSection='';
 for(const diagram of localDiagrams){
  const visible=new Map(diagram.nodes.map(name=>[name,new Set()]));
  const edgeGroups=groupedDiagramEdges(diagram);
  const attrs=diagram.nodes.map(name=>mermaidEntity(currentTables.get(name),visible.get(name))).join('\n');
  const relations=edgeGroups.map(group=>{
   const parent=currentTables.get(group.parent),child=currentTables.get(group.child);
   const left=group.required?'||':'o|',right=group.childUnique?'o|':'o{';
  const label=group.relationships.map(item=>item.id).join(' ');
   return `    ${idKey(parent.name)} ${left}--${right} ${idKey(child.name)} : "${label}"`;
  }).join('\n');
  const aliasRows=diagram.nodes.map(name=>`| \`${idKey(name)}\` | [\`${name}\`](../Tables/${name.split('.')[0]}/${name.split('.')[1]}.md) |`).join('\n');
  const edgeIds=new Set(diagram.edges.map(item=>item.id));
  diagramSection+=`<a id="${diagram.id}"></a>\n\n### ${diagram.id.replace('diagram-','Diagram ')} — ${diagram.roots.map(name=>name.split('.')[1]).join(', ')}\n\nThis focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/${schema}.md) for exact columns and actions.\n\n\`\`\`mermaid\nerDiagram\n${attrs}\n${relations}\n\`\`\`\n\n**Entity name mapping**\n\n| Mermaid name | PostgreSQL table |\n|---|---|\n${aliasRows}\n\nCoverage: ${diagram.roots.length} focus tables, ${diagram.nodes.length} entities, ${diagram.edges.length} FK constraints (${edgeIds.size} unique IDs).\n\n`;
 }
 const purposeRows=tables.map(table=>`| ${tableLink(table)} | ${table.description?`${table.description.replaceAll('|','\\|')} (${table.purposeStatus.toLowerCase()} meaning)`:'Purpose not separately described in the table contract'} | [Table contract](../Tables/${schema}/${table.tableName}.md) |`).join('\n');
 const exampleRelations=relationships.filter(relation=>relation.childSchema===schema).sort((a,b)=>a.id.localeCompare(b.id)).slice(0,Math.min(6,relationships.filter(relation=>relation.childSchema===schema).length));
 const explanation=exampleRelations.length?exampleRelations.map(relation=>`- **${relation.child} → ${relation.parent}:** \`${relation.childColumns.join(', ')}\` references \`${relation.parentColumns.join(', ')}\`; ${relationCardinality(relation)} The database applies \`ON DELETE ${relation.deleteRule}\`. This keeps the child record tied to an existing parent key.`).join('\n'):'- This schema has no declared foreign keys in the catalog snapshot; table documentation should be reviewed before treating the absence as intentional.';
 const modules=(schemaModules[schema]||[]).filter(module=>fs.existsSync(moduleHldPath(module))||fs.existsSync(moduleLldPath(module)));
 const workflowLinks=(workflowMap.get(schema)||[]).filter(id=>fs.existsSync(path.join(root,'06-Workflows',`${id}-${workflowNames[id]}.md`)));
 const related=[markdownLink('Schema overview','../Schema-Overview.md'),markdownLink('Database rules','../Database-Rules.md'),markdownLink('Model and parity notes','../Models-and-Parity.md'),markdownLink('Migration evidence','../Migrations.md'),markdownLink('Full relationship catalog','Relationship-Catalog.md'),markdownLink('Non-FK reference review','Logical-References.md'),markdownLink('Table index',`../Tables/${schema}/README.md`),...modules.flatMap(module=>[moduleLink(module,'HLD'),moduleLink(module,'LLD')].filter((_,index)=>index===0?fs.existsSync(moduleHldPath(module)):fs.existsSync(moduleLldPath(module)))),...workflowLinks.map(id=>markdownLink(id,`../../06-Workflows/${id}-${workflowNames[id]}.md`))];
 const doc=`# ${labelify(schema)} ER diagrams

## What this part of the database stores

The \`${schema}\` schema stores ${schemaDescriptions[schema].toLowerCase()}. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
${purposeRows}

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. \`PK\`, \`FK\`, and \`UK\` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

${diagramSection}## How the tables connect

${explanation}

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; \`identity.users\` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

${workflowLinks.length?`See ${workflowLinks.map(id=>markdownLink(id,`../../06-Workflows/${id}-${workflowNames[id]}.md`)).join(', ')} for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.`:'No dedicated workflow from the 14 documented workflows is mapped to this schema. It is still represented because it exists in the checked-out database catalog.'}

## Related documents

${related.join(' · ')}
`;
 write(schemaPageNames[schema],doc);
 schemaDocs.push({schema,file:schemaPageNames[schema],tables:tables.length,foreignKeys:schemaStats[schema].foreignKeys,diagrams:localDiagrams.length});
}

const catalogPathBySchema=Object.fromEntries(schemas.map(schema=>[schema,`${schema}.md`]));
for(const schema of schemas){
 const rows=relationships.filter(item=>item.childSchema===schema).map(item=>{
  const diagram=diagrams.find(value=>value.id===item.diagram&&value.schema===schema);
  const required=item.required?'required':'optional';
  const parentMultiplicity=item.childUnique?'0..1':'0..N';
  const parentKey=item.parentColumns.join(', '),childKey=item.childColumns.join(', ');
  return `| ${item.id} | [\`${item.parent}\`](../../Tables/${item.parentSchema}/${item.parent.split('.')[1]}.md) | [\`${item.child}\`](../../Tables/${item.childSchema}/${item.child.split('.')[1]}.md) | \`${childKey}\` → \`${parentKey}\` | Child FK is ${required}; parent has ${parentMultiplicity} child row(s) | ON DELETE ${item.deleteRule}; ON UPDATE ${item.updateRule} | ${item.sourceMigration}; final V0030 catalog snapshot | [${schemaPageNames[schema]}#${item.diagram}](../${schemaPageNames[schema]}#${item.diagram}) |`;
 }).join('\n');
 const page=`# ${labelify(schema)} foreign-key relationships

This register lists every recorded foreign-key constraint owned by child tables in the \`${schema}\` schema. A row is one physical PostgreSQL FK; paired UUID/BIGINT scope constraints are not collapsed here. Cardinality is derived from child-column nullability and uniqueness, not inferred from the workflow. See the linked diagram for an at-a-glance view and each table contract for full constraints.

| Relationship ID | Parent | Child | FK columns → referenced columns | Cardinality and optionality | Delete/update rule | Evidence | Diagram |
|---|---|---|---|---|---|---|---|
${rows}
`;
 write(path.join('Relationship-Catalog',catalogPathBySchema[schema]),page);
}

const catalogIndex=`# Relationship catalog

## Scope and evidence

The validated standalone SQL catalog contains **${relationships.length} declared foreign-key constraints**. The catalog keeps every physical constraint as its own row, including the paired public UUID and internal BIGINT relationships. It records source columns, referenced columns, nullability, uniqueness-based cardinality, delete/update actions, and the owning schema diagram.

The records are derived from the validated standalone-schema catalog, checked against [Database-Evidence.json](../../09-References/Database-Evidence.json). The [installation and provenance reference](../Migrations.md) distinguishes executed isolated parity from production deployment.

## Browse by child schema

| Child schema | Tables | FK rows | Catalog |
|---|---:|---:|---|
${schemas.map(schema=>`| \`${schema}\` | ${schemaStats[schema].tables} | ${schemaStats[schema].foreignKeys} | [${schema} foreign keys](Relationship-Catalog/${schema}.md) |`).join('\n')}

The [cross-domain register](15-Cross-Domain-Relationships.md) summarizes all cross-schema FK pairs. The [ERD inventory](ERD-Inventory.json) is a machine-readable snapshot used by the validator. Logical UUIDs and polymorphic references that are not enforced as foreign keys are separately listed in [Logical References](Logical-References.md).
`;
write('Relationship-Catalog.md',catalogIndex);

const crossRows=[...schemaDomainEdges.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([key,items])=>{
 const [child,parent]=key.split('->');
 const example=items.slice(0,3).map(item=>`\`${item.childColumns.join(', ')}\` → \`${item.parentColumns.join(', ')}\` (${item.constraint})`).join('<br>');
 return `| \`${child}\` → \`${parent}\` | ${items.length} | ${example} | The ${schemaDescriptions[child].toLowerCase()} records reference ${schemaDescriptions[parent].toLowerCase()} keys to preserve the recorded domain links. | [${child} FK catalog](Relationship-Catalog/${child}.md) |`;
}).join('\n');
const crossDoc=`# Cross-domain relationships

## What this view shows

This page summarizes foreign keys whose child and parent tables belong to different schemas. It does not draw workflow-only connections as database FKs. The catalog snapshot contains **${crossSchemaRelationships.length} cross-schema FKs across ${schemaDomainEdges.size} ordered schema pairs**; every exact constraint is in the [relationship catalog](Relationship-Catalog.md).

## Business-level cross-domain map

\`\`\`mermaid
flowchart LR
${schemas.map(schema=>`  ${schema}["${schemaDescriptions[schema]}"]`).join('\n')}
${majorPairs.map(([child,parent])=>`  ${child} -->|FK reference| ${parent}`).join('\n')}
\`\`\`

The arrows point from a child schema to its referenced parent schema. They show only representative connections to keep the map readable. Each label points to the corresponding schema-level catalog; all **${schemaDomainEdges.size}** cross-schema pairs, not just the representative map arrows, are listed below.

## Complete schema-pair index

| Child schema → parent schema | FK count | Example FK columns and constraints | Business reason | Full details |
|---|---:|---|---|---|
${crossRows}

## Common business paths

- **Checkout and orders:** \`commerce\` has declared references to \`catalog\`, \`customer\`, \`clinical\`, \`warehouse\`, \`marketplace\`, \`identity\`, and \`pricing\`. The exact parent tables and keys are listed under the \`commerce\` catalog; the order workflow may cross other domains through intermediate records rather than a direct FK.
- **Money:** \`payment\` and \`finance\` reference commerce records; \`finance\` also has recorded references to payment and marketplace. A payment attempt, invoice, settlement, and delivered parcel remain separate facts.
- **Physical fulfillment:** \`fulfillment\` references commerce and warehouse records; \`logistics\` references fulfillment, commerce, warehouse, identity, and platform records. Do not infer that a shipment is a direct child of an order unless the exact FK row states it.
- **Supply:** \`procurement\` references catalog and warehouse records; warehouse records also refer back to procurement where declared. Actual joins use the recorded source/target columns in the catalog.
- **Clinical review:** \`clinical\` has FKs to commerce, catalog, customer, organization, platform, and identity. Patient ownership and access rules remain separate from these referential constraints.

For sensitive domains, a foreign key guarantees referential integrity only. It does not authorize staff, customers, riders, or reporting services to read the referenced data.
`;
write('15-Cross-Domain-Relationships.md',crossDoc);

const logicalRows=nonForeignReferences.map(item=>`| \`${item.column}\` | ${item.category} | ${item.discriminator?`\`${item.discriminator}\``:'—'} | ${item.decision} ${item.reason||''} |`).join('\n');
const logicalDoc=`# Logical and polymorphic references that are not foreign keys

## Why this list is separate

These UUID columns are classified by the database project's final reference register but do not have a declared PostgreSQL FK. They are intentionally excluded from ERD relationship lines and the physical FK count. Their use may be a provider/correlation identifier or a discriminator-based reference; do not treat the UUID as proof that a target row exists.

The source classification contains ${logicalReferences.length} formerly unbound UUID references. Six are classified as real domain relationships and are now present as physical FK pairs in the relationship catalog. The remaining **${nonForeignReferences.length}** are listed below (${nonForeignReferences.filter(item=>item.category==='provider/correlation ID').length} provider/correlation references and ${nonForeignReferences.filter(item=>item.category==='polymorphic subject').length} polymorphic references).

| Column | Classification | Discriminator | Recorded handling and limit |
|---|---|---|---|
${logicalRows}

## Historical ORM relationships

Legacy models are privately archived and are not a second schema authority. The earlier source scan found no SQLAlchemy navigation declarations. ERDs derive physical relationships exclusively from the validated standalone SQL catalog.

## Tables with no declared foreign keys

${noFkTables.map(name=>`- [\`${name}\`](../Tables/${name.split('.')[0]}/${name.split('.')[1]}.md) — no FK constraint appears in the verified catalog snapshot. This is a review observation, not a claim that the design is wrong.`).join('\n')}

The schema catalog does not establish whether every logical association is approved for enforcement. Review the database source's reference classification and service ownership before proposing new constraints. Do not draw these relationships as verified FKs.
`;
write('Logical-References.md',logicalDoc);

const maxDiagramEntities=Math.max(...diagrams.map(diagram=>diagram.nodes.length));
const coverage=`# ERD coverage report

## Measured coverage

| Measure | Result | Evidence status |
|---|---:|---|
| PostgreSQL schemas | ${schemas.length} | Confirmed in checked-out catalog snapshot |
| Tables | ${currentTables.size} | Confirmed in checked-out catalog snapshot |
| Columns | ${totalColumns.toLocaleString('en-US')} | Confirmed in checked-out catalog snapshot |
| Declared foreign keys | ${relationships.length.toLocaleString('en-US')} | Parsed from catalog constraint definitions |
| Cross-schema foreign keys | ${crossSchemaRelationships.length.toLocaleString('en-US')} | Computed from FK child/parent schemas |
| Cross-schema schema pairs | ${schemaDomainEdges.size} | Computed from FK inventory |
| Focused domain ER diagrams | ${diagrams.length} | Generated; ${maxDiagramEntities} max entities per diagram |
| Tables represented as focus entities | ${diagramForChild.size} / ${currentTables.size} | Every table appears as a focus table once |
| Foreign keys represented by diagram IDs and catalog rows | ${relationships.length} / ${relationships.length} | Complete in snapshot scope |
| Tables with no declared FK | ${noFkTables.length} | See [logical-reference review](Logical-References.md) |
| SQLAlchemy ORM \`relationship()\` declarations | 0 | Historical scan only; archived models are not schema authority |
| Non-FK UUID references | ${nonForeignReferences.length} | Classified separately; see [Logical References](Logical-References.md) |

## Schema coverage

| Schema | Tables | FK rows | Cross-schema FK rows | ER diagrams |
|---|---:|---:|---:|---:|
${schemaDocs.map(item=>`| \`${item.schema}\` | ${item.tables} | ${item.foreignKeys} | ${schemaStats[item.schema].crossSchemaForeignKeys} | ${item.diagrams} ([details](${item.file})) |`).join('\n')}

## Relationship and diagram rules

- Each catalog row is one physical PostgreSQL FK constraint. Composite source and target columns stay in their declared order.
- Cardinality is derived from FK nullability and exact unique keys/indexes. A child FK is optional if any source column permits null; a child is unique per parent only when the complete FK column set is unique.
- Diagram labels use stable \`FK-####\` identifiers. Constraints between the same entity pair may share a labeled Mermaid edge only when their cardinality matches; each ID still resolves to a separate catalog row with exact columns and delete/update actions.
- Entities use safe Mermaid aliases \`schema__table\`. Every diagram has an alias-to-qualified-table mapping.
- The overall map is intentionally conceptual and includes only verified domains and representative declared schema links; [the cross-domain register](15-Cross-Domain-Relationships.md) and child-schema catalog pages provide complete FK detail.

## Evidence and limitations

The generator verifies the standalone SQL, derived catalog/table register and logical-reference decision checksums against [Database-Evidence.json](../../09-References/Database-Evidence.json). All ${currentTables.size} table pages and ${totalColumns.toLocaleString('en-US')} columns are validated against the effective catalog. Private PostgreSQL fresh-install parity is recorded separately; no production connection is used.

These ERDs cover every physical foreign key in the validated effective V0030 schema. SQL installation and zero catalog differences were verified in isolated disposable databases. Future proposals, business ownership approval and production deployment are separate states. The archived migration sources and nested Git history remain intact.

Potential review items are not declared defects: \`platform.report_definitions\` has no FK in the snapshot; polymorphic and opaque UUID references are explicitly classified and kept outside FK diagrams; and the 24 schema ownership boundaries remain candidate service ownership rather than access grants.
`;
write('ERD-Coverage-Report.md',coverage);

const domainLinks=schemas.map(schema=>`- ${schemaLink(schema,`${schema} — ${schemaDescriptions[schema]}`)} (${schemaStats[schema].tables} tables, ${schemaStats[schema].foreignKeys} FK constraints)`);
const readme=`# Pharmville ER diagram documentation

## Start here

- [System data map](00-System-Data-Map.md) for the major stored-data areas and representative links.
- [ERD coverage report](ERD-Coverage-Report.md) for measured scope, evidence status, gaps, and validation limits.
- [Cross-domain relationships](15-Cross-Domain-Relationships.md) for all ${schemaDomainEdges.size} observed schema-to-schema FK pairs.
- [Relationship catalog](Relationship-Catalog.md) for all ${relationships.length} physical FK constraints, split by child schema.
- [Logical references](Logical-References.md) for UUID/polymorphic references that are not declared foreign keys.
- [Machine-readable ERD inventory](ERD-Inventory.json) for reproducible table keys and relationship data.

## Browse all database schemas

${domainLinks.join('\n')}

## Evidence boundary

These diagrams use the [validated standalone schema](../../pharmville-database/pharmville_schema.sql), with the derived register and all source checksums recorded in [evidence](../../09-References/Database-Evidence.json). No production database or shared endpoint was queried.

## Regenerate and validate

From the repository root, run \`npm run generate:erd\`, then \`npm run validate:erd\` and \`npm run validate\`. Sources are the canonical SQL and derived catalog/table register; missing or changed checksums fail verification. No legacy checkout, application models or migration runner is needed. Mermaid parsing is handled by the documentation validator.
`;
write('README.md',readme);

// Add one ERD navigation block to module HLD/LLD pages; replace the marked block on regeneration.
const marker=/<!-- ERD-NAV-START -->[\s\S]*?<!-- ERD-NAV-END -->/;
const moduleTouched=[];
for(const [module,moduleDomainSchemas]of Object.entries(moduleSchemas)){
 const links=moduleDomainSchemas.map(schema=>`[\`${schema}\` ERD](${path.relative(path.join(root,'03-Modules',moduleDirectory[module]),output(schemaPageNames[schema])).replaceAll('\\','/')})`).join(' · ');
 const block=`<!-- ERD-NAV-START -->\n\n## Database relationships\n\n${links} · [FK catalog](${path.relative(path.join(root,'03-Modules',moduleDirectory[module]),output('Relationship-Catalog.md')).replaceAll('\\','/')})\n\nThese diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](${path.relative(path.join(root,'03-Modules',moduleDirectory[module]),path.join(root,'04-Database/Migrations.md')).replaceAll('\\','/')}) for the supplied source and deployment verification limits.\n\n<!-- ERD-NAV-END -->`;
 for(const file of [moduleHldPath(module),moduleLldPath(module)]){
  if(!fs.existsSync(file))continue;
  const original=fs.readFileSync(file,'utf8');
  let updated;
  if(marker.test(original))updated=original.replace(marker,block);
  else{const h1End=original.indexOf('\n');updated=h1End<0?`${original}\n\n${block}\n`:`${original.slice(0,h1End+1)}\n${block}\n${original.slice(h1End+1)}`;}
  if(updated!==original){fs.writeFileSync(file,updated);moduleTouched.push(path.relative(root,file).replaceAll('\\','/'));}
 }
}

// Put a compact, idempotent ERD crosswalk at the top of Module Mapping.
const mappingPath=path.join(root,'04-Database/Module-Mapping.md');
const mappingOriginal=fs.readFileSync(mappingPath,'utf8');
const mappingBlock=`<!-- ERD-MODULE-MAP-START -->\n\n## ER diagram navigation\n\nThis table links a feature module to the actual database schemas it may read or write; it does not assign exclusive ownership. The candidate modules are inherited from the existing module-to-database map.\n\n| Module | Database ER diagrams |\n|---|---|\n${Object.entries(moduleSchemas).map(([module,moduleDomainSchemas])=>`| [${module}](../03-Modules/${moduleDirectory[module]}/README.md) | ${moduleDomainSchemas.map(schema=>`[\`${schema}\`](ER-Diagrams/${schemaPageNames[schema]})`).join(', ')} |`).join('\n')}\n\n<!-- ERD-MODULE-MAP-END -->`;
const mappingMarker=/<!-- ERD-MODULE-MAP-START -->[\s\S]*?<!-- ERD-MODULE-MAP-END -->/;
let mappingUpdated;
if(mappingMarker.test(mappingOriginal))mappingUpdated=mappingOriginal.replace(mappingMarker,mappingBlock);
else{const h1End=mappingOriginal.indexOf('\n');mappingUpdated=`${mappingOriginal.slice(0,h1End+1)}\n${mappingBlock}\n${mappingOriginal.slice(h1End+1)}`;}
fs.writeFileSync(mappingPath,mappingUpdated);

// Database/root navigation stays small and points to the index.
const linkMarkers=[
 {file:path.join(root,'04-Database/README.md'),marker:'<!-- ERD-INDEX-LINK -->',line:'\n- [Entity relationship diagrams](ER-Diagrams/README.md) — verified domain diagrams, FK catalog, and evidence limits.'},
 {file:path.join(root,'04-Database/Schema-Overview.md'),marker:'<!-- ERD-INDEX-LINK -->',line:'\nSee the [ER diagram index](ER-Diagrams/README.md) for domain views and the complete foreign-key catalog.'},
 {file:path.join(root,'04-Database/Relationships.md'),marker:'<!-- ERD-INDEX-LINK -->',line:'\nFor every FK column pair, cardinality, optionality, delete/update action, and schema diagram, use the [ER relationship catalog](ER-Diagrams/Relationship-Catalog.md). Logical non-FK identifiers are listed separately in [ER diagrams](ER-Diagrams/Logical-References.md).'},
 {file:path.join(root,'README.md'),marker:'<!-- ERD-INDEX-LINK -->',line:'\n**Database ER diagrams:** [browse the verified domain maps and complete FK catalog](04-Database/ER-Diagrams/README.md). The diagrams use the validated standalone SQL catalog; see database evidence for parity and provenance.'}
];
for(const item of linkMarkers){let text=fs.readFileSync(item.file,'utf8');if(!text.includes(item.marker)){const insertion=`${item.marker}${item.line}\n`;if(item.file===path.join(root,'README.md')){const anchor='| 🗄️ Database | Inspect available schema and migration evidence | [Database reference](04-Database/README.md) |';const section='\n## Product flow';if(!text.includes(anchor)||!text.includes(section))fail('Root README database navigation row or Product flow section not found.');text=text.replace(section,`\n\n${insertion}${section}`);}else if(item.file.endsWith('Relationships.md')){const anchor='## Database relationships by business flow';text=text.replace(anchor,`${insertion}\n${anchor}`);}else{const firstH1=text.indexOf('\n');text=`${text.slice(0,firstH1+1)}\n${insertion}\n${text.slice(firstH1+1)}`;}fs.writeFileSync(item.file,text);}}

const summary={sourceHead,schemas:schemas.length,tables:currentTables.size,columns:totalColumns,foreignKeys:relationships.length,crossSchemaForeignKeys:crossSchemaRelationships.length,crossSchemaPairs:schemaDomainEdges.size,diagrams:diagrams.length,largestDiagramEntities:maxDiagramEntities,nonForeignReferences:nonForeignReferences.length,noFkTables,moduleDocumentsUpdated:moduleTouched.length,output:erdRoot};
write('generation-results.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
