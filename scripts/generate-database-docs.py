#!/usr/bin/env python3
"""Generate structural table/reference documentation from the validated SQL catalog.

Business interpretation and master-data proposals are preserved; this generator
does not execute SQL or invent approved seed records or module grants.
"""
from pathlib import Path
import json,re,sys,hashlib,collections
from database_catalog import table_register

ROOT=Path(__file__).resolve().parents[1]
CAT=json.loads((ROOT/'04-Database/Schema-Catalog.json').read_text())
REG=table_register(CAT)
def cell(v):return str(v).replace('|','\\|').replace('\n',' ')
def table(headers,rows):return '| '+' | '.join(headers)+' |\n| '+' | '.join('---' for _ in headers)+' |\n'+''.join('| '+' | '.join(cell(v) for v in r)+' |\n' for r in rows)+'\n'
def link(t,prefix='../../Tables/'):
 s,n=t.split('.');return f'[`{t}`]({prefix}{s}/{n}.md)'
def owner(t):
 s,n=t.split('.')
 if s=='commerce':return 'Cart_Checkout' if n in ['carts','cart_items','checkouts'] else 'Order_Operations'
 if s=='clinical':
  if n in ['order_reviews','order_review_items','review_reason_codes','practitioner_profiles']:return 'Pharmacist_Review'
  if n in ['patient_profiles','prescriptions','prescription_items','prescription_documents','prescription_access_logs']:return 'Prescription_Upload'
  return 'Future clinical-care owner — Requires Decision D-027'
 if s=='warehouse':return 'Inventory' if n in ['stock_balances','stock_ledger','stock_reservations','stock_holds','inventory_lots','inventory_adjustments','inventory_adjustment_items','cycle_counts','cycle_count_items','stock_movement_reason_codes'] else 'Warehouse'
 if s=='platform':
  if n.startswith('file_'):return 'Shared platform file service — engineering owner; no clinical write grant'
  if n in ['report_runs','report_definitions']:return 'Reporting'
  if n=='audit_logs':return 'Audit'
  if n in ['idempotency_keys','outbox_events','inbox_messages','scheduled_jobs','webhook_endpoints','webhook_deliveries']:return 'Shared platform runtime — engineering owner'
  return 'Admin_CMS'
 if s=='compliance':return 'Customer_Accounts via Privacy/Legal owner' if n in ['privacy_requests','legal_holds','evidence'] else 'Pharmacist_Review via Compliance owner'
 if s=='pricing':return 'Finance_Payments' if n=='tax_rules' else 'Product_Catalog'
 return {'identity':'Authentication_Access','customer':'Customer_Accounts','catalog':'Product_Catalog','organization':'Admin_CMS','procurement':'Warehouse','fulfillment':'Store_Operations','logistics':'Delivery_Operations','payment':'Finance_Payments','finance':'Finance_Payments','notification':'Notifications','search':'Product_Catalog'}.get(s,'Future '+s+' owner — Requires Decision D-027')

inventory=(ROOT/'04-Database/Master-Data-Inventory.md').read_text()
classes={m[1]:m[2] for m in re.finditer(r'^\| \[`([^`]+)`\]\(Tables/[^)]+\) \| (Master / Reference|Configuration|Mapping / Junction|Audit / History|Derived / Operational|Transactional) \|',inventory,re.M)}
assert len(classes)==266
inbound=collections.defaultdict(list);fks={}
for t,d in REG.items():
 for name,encoded in d['constraints'].items():
  kind,sql,*_=json.loads(encoded)
  if kind=='f':
   m=re.match(r'FOREIGN KEY \(([^)]+)\) REFERENCES ([a-z_]+\.[a-z_]+)\(([^)]+)\)(.*)',sql)
   assert m,(t,name,sql)
   fks[(t,name)]=dict(columns=m[1],target=m[2],remote=m[3],sql=sql)
   inbound[m[2]].append((t,name,m[1],m[3]))

delta=[];ownership={};totals=collections.Counter()
previous_ownership=json.loads((ROOT/'04-Database/Ownership-and-Scope.json').read_text()) if (ROOT/'04-Database/Ownership-and-Scope.json').exists() else {}
for t,d in sorted(REG.items()):
 s,n=t.split('.');p=ROOT/'04-Database/Tables'/s/(n+'.md');old=p.read_text() if p.exists() else ''
 masters=old.split('\n## Master-data planning\n',1)[1] if '\n## Master-data planning\n' in old else None
 old_fields={}
 for line in old.splitlines():
  parts=[x.strip() for x in re.split(r'(?<!\\)\|',line)[1:-1]]
  if len(parts)==7 and re.fullmatch(r'`[a-z_0-9]+`',parts[0]) and parts[2] in ['Yes','No']:
   old_fields[parts[0].strip('`')]=parts
 new_fields={c:json.loads(v) for c,v in d['columns'].items()}
 for c in sorted(set(new_fields)|set(old_fields)):
  if c not in new_fields:delta.append(dict(table=t,column=c,category='outdated documentation',change='Documented column absent from effective catalog'))
  elif c not in old_fields:delta.append(dict(table=t,column=c,category='authoritative database object',change='Missing documented column'))
  else:
   x=new_fields[c];before=old_fields[c];actual=(x['type'],not x['not_null'],x['default']);previous=(before[1].strip('`'),before[2]=='Yes',None if before[3]=='—' else before[3].strip('`'))
   if actual!=previous:delta.append(dict(table=t,column=c,category='outdated documentation',before=previous,after=actual))
 pk=[x['column'] for x in d['pk']];o=owner(t);ownership[t]=dict(owner=o,classification=classes[t],owner_status='Proposed; requires D-024/D-027 review; SQL grants remain independent',consuming_modules=previous_ownership.get(t,{}).get('consuming_modules',[]))
 purpose=re.search(r'^\*\*Business purpose(?: \([^)]*\))?:\*\* (.+)$',old,re.M)
 purpose=purpose[1] if purpose else f'{classes[t]} records in the {s} domain; business owner validation required.'
 fkrows=[(name,x) for (target,name),x in fks.items() if target==t]
 nn=[(k.rsplit('.',1)[1],json.loads(v)) for k,v in CAT['not_null_constraints'].items() if k.rsplit('.',1)[0]==t]
 content=f'# `{t}`\n\n**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.\n\n'
 content+=f'**Business purpose (Inferred):** {purpose}\n\n'
 content+=table(['Attribute','Contract'],[['Identity',t],['Classification',classes[t]],['Proposed business write owner',o],['SQL ownership','Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved.'],['Primary key',', '.join(pk)],['Structural counts',f'{len(new_fields)} columns; {len(d["constraints"])} PK/FK/UQ/CHECK/exclusion constraints; {len(nn)} named PostgreSQL 18 NOT NULL constraints; {len(d["indexes"])} indexes; {len(d["triggers"])} user triggers'],['Source / approval','Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed.']])
 content+='## Fields\n\n'
 rows=[]
 for c,x in sorted(new_fields.items()):
  prev=old_fields.get(c)
  meaning=prev[4] if prev else c.replace('_',' ').capitalize()
  why=prev[5] if prev else 'Supports the documented owner workflow or referential invariant.'
  rules=[]
  for name,f in fkrows:
   if c in [v.strip() for v in f['columns'].split(',')]:rules.append(f'FK → `{f["target"]}` via `{name}`')
  if x['identity']:rules.append('GENERATED '+('ALWAYS' if x['identity']=='a' else 'BY DEFAULT')+' AS IDENTITY; see sequence catalog')
  if x['generated']:rules.append('Generated expression kind '+x['generated'])
  if x['collation']:rules.append('Collation: '+x['collation'])
  if c in pk:rules.append('Primary key')
  if c=='row_version':rules.append('Checked positive; optimistic precondition and maintenance trigger')
  rows.append(['`'+c+'`','`'+x['type']+'`','No' if x['not_null'] else 'Yes','—' if x['default'] is None else '`'+x['default']+'`',meaning,why,'; '.join(rules) or 'Exact constraints below'])
 content+=table(['Column','Type','Nullable','Default','Meaning','Why needed','Relationship / rule'],rows)
 content+='## Record lifecycle and users\n\n'
 old_lifecycle=re.search(r'^## Record lifecycle and users\n(.*?)(?=^## |\Z)',old,re.M|re.S)
 content+=(old_lifecycle[1].split('The declared business owner above supersedes',1)[0].strip()+'\n\n') if old_lifecycle else 'Creation and mutation must use the proposed owning domain command with actual SQL permissions; consumer access is not write ownership.\n\n'
 content+='The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.\n\n'
 content+='## Actual relationships\n\n'+table(['Constraint','Local columns','References','Exact rule'],[(name,'`'+f['columns']+'`',link(f['target']),'`'+f['sql']+'`') for name,f in fkrows]) if fkrows else '## Actual relationships\n\nNo outbound FK is present in the validated catalog.\n\n'
 content+='### Dependent tables\n\n'
 if inbound[t]:content+=table(['Referencing table','Constraint','Local columns','Referenced columns'],[(link(a),b,'`'+c+'`','`'+e+'`') for a,b,c,e in sorted(inbound[t])])
 else:content+='No inbound FK is present in the validated catalog.\n\n'
 content+=f'## `{t}` — exact structural contracts\n\n### Existing foreign-key dependencies\n\n'
 content+=table(['Local columns','References','Constraint'],[('`'+f['columns']+'`','`'+f['target']+'`','`'+name+'`') for name,f in fkrows]) if fkrows else 'Not Applicable.\n\n'
 kinds={'p':'PRIMARY KEY','f':'FOREIGN KEY','u':'UNIQUE','c':'CHECK','x':'EXCLUSION','t':'CONSTRAINT TRIGGER'}
 content+='### Existing constraints\n\n'+table(['Exact name','Kind','Recorded expression'],[('`'+name+'`',kinds.get(json.loads(v)[0],json.loads(v)[0]),'`'+json.loads(v)[1]+'`') for name,v in sorted(d['constraints'].items())]+[('`'+name+'`','NOT NULL','`'+v[0]+'`') for name,v in sorted(nn)])
 indexrows=[]
 for name,v in sorted(d['indexes'].items()):
  definition,valid,ready,unique,*_=json.loads(v)
  method=re.search(r' USING ([a-z_]+) ',definition);method=method[1] if method else 'recorded default'
  expression=definition.split(' USING '+method+' ',1)[-1];pred=expression.split(' WHERE ',1)[1] if ' WHERE ' in expression else 'None';expr=expression.split(' WHERE ',1)[0]
  purpose=('Enforces primary/unique identity or a scoped uniqueness invariant; ' if unique else 'Read/join/filter access path; ')+('partial predicate limits indexed rows. ' if pred!='None' else '')+'Performance effectiveness requires measured query plans.'
  indexrows.append(['`'+name+'`',method,'`'+expr+'`',pred,purpose,'`'+definition+'`'])
 content+='### Existing indexes\n\n'+table(['Exact name','Method','Columns / expression','Predicate','Purpose','Recorded definition'],indexrows)
 content+='### Existing triggers\n\n'+table(['Exact name','Recorded definition','Enabled'],[('`'+name+'`','`'+json.loads(v)[0]+'`',json.loads(v)[1]) for name,v in sorted(d['triggers'].items())])
 content+='## Engineering interpretation\n\nPublic UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.\n'
 if masters:content+='\n## Master-data planning\n'+masters
 p.write_text(content.rstrip()+'\n');totals.update(tables=1,columns=len(new_fields),constraints=len(d['constraints']),not_null_constraints=len(nn),indexes=len(d['indexes']),triggers=len(d['triggers']))

(ROOT/'04-Database/Ownership-and-Scope.json').write_text(json.dumps(ownership,indent=2)+'\n')
if not (ROOT/'04-Database/Documentation-Reconciliation.json').exists(): (ROOT/'04-Database/Documentation-Reconciliation.json').write_text(json.dumps(dict(status='resolved against validated effective catalog',before_field_differences=delta,structural_counts=dict(totals),source='pharmville-database/pharmville_schema.sql',catalog='04-Database/Schema-Catalog.json',remaining_proposals='Business ownership/initial datasets and future scope remain separately unapproved.'),indent=2)+'\n')
print('Generated canonical table pages:',dict(totals),'prior field differences:',len(delta))

# Supporting objects share the same catalog authority as table pages.
counts={k:len(v) for k,v in CAT.items()}
objects='# Validated database objects\n\nGenerated from [Schema-Catalog.json](Schema-Catalog.json) after fresh installation of the [standalone SQL](../pharmville-database/pharmville_schema.sql). SQL is authoritative. These are effective objects, not historical migration fragments. SQL capability grants are separate from proposed module write ownership; no login identity or role membership is provisioned.\n\n## Complete catalog inventory\n\n'
objects+=table(['Category','Effective objects'],list(counts.items()))
objects+='PostgreSQL 18 records 2,929 NOT NULL constraints separately from the 3,198 PK/FK/UNIQUE/CHECK constraints. Table/composite types and extension-owned routines/types are implicit supporting objects, not extra application-defined types. Sequence current values and records are excluded. Source namespace inspection found only the 24 application namespaces plus public (no application tables in public). The 1,461 FKs create 5,844 internal triggers in addition to 879 user triggers.\n\n'
objects+='## Extensions\n\n'+table(['Extension','Version','Namespace'],[(f'`{k}`',*json.loads(v)) for k,v in sorted(CAT['extensions'].items())])
objects+='## Runtime capability roles\n\nThese groups are all NOLOGIN/NOINHERIT. Runtime login provisioning and memberships remain an external deployment decision. Installation refuses existing unsafe capability groups instead of weakening them.\n\n'+table(['Role','Superuser','Bypass RLS','Login','Inherit','Create DB','Create role','Replication'],[(f'`{k}`',*['Yes' if x else 'No' for x in json.loads(v)])for k,v in sorted(CAT['runtime_roles'].items())])
objects+='## Non-owner grants\n\nPUBLIC routine execution is revoked where recorded; owner access remains implicit. Only the grants below are installed. These do not grant all-table domain access.\n\n'+table(['Object kind and identity','Grantee','Privilege','Grant option'],[(*k.rsplit(':',2),'Yes'if json.loads(v)[0] else'No')for k,v in sorted(CAT['grants'].items())])
objects+='## Default privileges\n\nThe recorded installer name identifies the disposable source owner. SQL uses CURRENT_USER so equivalent owner-relative default privileges bind to the real installation identity. An absent PUBLIC EXECUTE grant means default-denied future routine execution. Per-schema revocations that add no distinct catalog row remain represented by effective default privileges and the SQL.\n\n'+table(['Namespace / object kind','Exact grantee, privilege, grant-option tuples'],[(f'`{k}`',f'`{v}`')for k,v in sorted(CAT['default_privileges'].items())])
objects+='## Row-level security policies\n\nPolicies protect only the tables where RLS is enabled; they are additional to application object authorization. Table RLS/force settings are preserved in the full catalog.\n\n'+table(['Table / policy','Mode','Roles','Command','USING','WITH CHECK'],[(f'`{k}`',x[0],', '.join(x[1]),x[2],x[3]or'None',x[4]or'None')for k,v in sorted(CAT['policies'].items())for x in [json.loads(v)]])
objects+='## Identity sequences\n\nAll 265 sequences preserve type, bounds, increment, start, cache, cycle and column dependency. The default/identity columns are documented on the owning table pages. No sequence current value is exported.\n\n'+table(['Sequence','Type','Exact generation parameters','Owning table / column','Dependency'],[(f'`{k}`',x[0],f'start={x[1]}; increment={x[2]}; max={x[3]}; min={x[4]}; cache={x[5]}; cycle={str(x[6]).lower()}',f'`{x[7]}.{x[8]}.{x[9]}`',x[10])for k,v in sorted(CAT['sequences'].items())for x in [json.loads(v)]])
objects+='## Functions\n\nAll 56 definitions retain volatility, SECURITY DEFINER, search_path and execution behavior. The [table references](README.md#table-reference) document each installed user trigger: O = origin enabled, D = disabled, R = replica, A = always. Helper existence grants no service authorization; function ACLs are recorded above.\n\n'
for name,encoded in sorted(CAT['functions'].items()):
 definition=json.loads(encoded)[0]
 objects+='### `'+name+'`\n\n```sql\n'+definition.rstrip()+'\n```\n\n'
(ROOT/'04-Database/Database-Objects.md').write_text(objects.rstrip()+'\n')
