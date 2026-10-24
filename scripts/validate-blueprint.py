#!/usr/bin/env python3
"""Read-only repository architecture/inventory/protected-byte consistency checks."""
from pathlib import Path
import json,re,hashlib,stat,sys,collections
import yaml
ROOT=Path(__file__).resolve().parents[1]
def main():
 errors=[]
 def check(ok,msg):
  if not ok:errors.append(msg)
 registry=json.loads((ROOT/'03-Modules/Module-Registry.json').read_text());check(len(registry)==18,'Canonical module count differs')
 ids=[m['id']for m in registry];check(len(set(ids))==len(ids),'Duplicate stable module ID')
 features={m[1]:m[2]for m in re.finditer(r'^\| `([A-Z]+-\d{2})` \| (\w+) \|',(ROOT/'01-Project/Features-and-Modules.md').read_text(),re.M)}
 check(len(features)==110,'Feature count differs');listed=[f for m in registry for f in m['feature_ids']];check(collections.Counter(listed)==collections.Counter(list(features)),'Module feature membership differs')
 for m in registry:
  for f in m['feature_ids']:check(features.get(f)==m['id'],f'{f}: stable module changed')
  for name in ['README.md','Business-Flow.md','HLD.md','LLD.md','APIs.md','Database.md','Operations.md','Edge-Cases.md','Dependencies.md']:check((ROOT/'03-Modules'/m['directory']/name).is_file(),f"{m['id']}: missing {name}")
 spec=yaml.safe_load((ROOT/'05-APIs/openapi.yaml').read_text());ops=[(p,v,o)for p,x in spec['paths'].items()for v,o in x.items()if v in ['get','post','put','patch','delete']]
 before=json.loads((ROOT/'09-References/Architecture-Rework-API-Baseline.json').read_text());identity=lambda x:(x['method'],x['path'],x['operationId'],x['id'])
 actual=[{'method':v,'path':p,'operationId':o['operationId'],'id':o['x-api-id']}for p,v,o in ops];check({identity(x)for x in actual}=={identity(x)for x in before},'Existing API inventory changed')
 owned=json.loads((ROOT/'04-Database/Ownership-and-Scope.json').read_text());tables=json.loads((ROOT/'04-Database/Table-Register.json').read_text());check(set(owned)==set(tables),'Table ownership is incomplete')
 masters={t for t,d in owned.items()if d['classification']=='Master / Reference'};check(len(masters)==44,'Master inventory count changed without reconciliation')
 coverage=collections.Counter()
 for path,method,o in ops:
  aid=o['x-api-id'];coverage[o['x-documentation-status']]+=1;check(o['x-approval-status']=='unapproved'and o['x-implementation-status']=='not-implemented',aid+': unevidenced approval/implementation')
  cp=(ROOT/'05-APIs'/o['x-contract-document']).resolve();check(cp.is_file(),aid+': canonical contract missing');text=cp.read_text();check(re.search(r'^## '+re.escape(aid)+r' — '+method.upper()+' `'+re.escape(path)+'`',text,re.M)is not None,aid+': Markdown route differs')
  check(set(o['x-feature-ids'])<=set(features),aid+': unknown feature')
  for direction in ['x-database-reads','x-database-writes']:
   for t,columns in o[direction].items():
    check(t in tables,aid+': unknown table '+t)
    if t in tables:check(set(columns)<=set(tables[t]['columns']),aid+': unknown mapped columns '+t)
  for t in o['x-master-dependencies']:check(t in masters,aid+': wrong master classification '+t)
  check((bool(o['security']) and o['x-authentication-required']) or (not o['security'] and (not o['x-authentication-required'] or o['x-authentication-mechanism'] in ['Provider Signature','Session (refresh credential in body)'])),aid+': security/authentication mismatch')
 check(coverage['complete-proposed']>=97,'Detailed proposed-contract coverage regressed')
 for t in masters:
  page=ROOT/'04-Database/Tables'/t.split('.')[0]/(t.split('.')[1]+'.md');check('## Master-data planning'in page.read_text(),t+': master lifecycle/records missing')
 baseline=json.loads((ROOT/'09-References/Wireframe-Preservation-Baseline.json').read_text());now={}
 for p in sorted((ROOT/'10-Low-Fidelity-Wireframes').rglob('*')):
  key=p.relative_to(ROOT).as_posix();entry={'mode':stat.S_IMODE(p.lstat().st_mode)}
  if p.is_symlink():entry.update(kind='symlink',target=str(p.readlink()))
  elif p.is_dir():entry.update(kind='directory')
  elif p.is_file():entry.update(kind='file',size=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
  now[key]=entry
 check(now==baseline,'PROTECTED WIREFRAMES CHANGED: path/mode/type/hash comparison differs')
 refs=set()
 for p in (ROOT/'10-Low-Fidelity-Wireframes').rglob('*.js'):
  for value in re.findall(r"['\"]((?:00-Business-Guide|01-Project|02-Architecture|03-Modules|04-Database|05-APIs|06-Workflows|07-Engineering|08-Development-Plan|09-References)/[^'\"]+\.md(?:#[^'\"]+)?)['\"]",p.read_text()):refs.add(value)
 for ref in refs:check((ROOT/ref.split('#')[0]).is_file(),'Protected wireframe source link missing: '+ref)
 moves=json.loads((ROOT/'09-References/Module-Relocations.json').read_text())
 for old,new in moves.items():check((ROOT/old).is_file()and(ROOT/new).is_file(),'Move lost compatibility/canonical file: '+old)
 result={'status':'FAIL'if errors else'PASS','modules':len(registry),'features':len(features),'api_operations':len(ops),'complete_proposed':coverage['complete-proposed'],'planning_percent':round(coverage['complete-proposed']/len(ops)*100,2),'approved':0,'tables_with_owner':len(owned),'masters':len(masters),'protected_files':sum(v['kind']=='file'for v in now.values()),'wireframe_source_targets':len(refs),'compatibility_targets':len(moves),'errors':errors}
 print(json.dumps(result,indent=2));return bool(errors)
if __name__=='__main__':sys.exit(main())
