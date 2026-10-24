#!/usr/bin/env python3
"""Verify standalone-schema documentation, optionally restoring a private fresh cluster.

Never reads environment credentials or accepts an existing database connection.
"""
from pathlib import Path
import argparse,hashlib,json,re,shutil,subprocess,tempfile,os,sys
from database_catalog import snapshot,differences,table_register
ROOT=Path(__file__).resolve().parents[1]
def run(cmd,**kw):return subprocess.run([str(x) for x in cmd],check=True,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,**kw).stdout

def main():
 p=argparse.ArgumentParser();p.add_argument('--fresh',action='store_true');p.add_argument('--pg-bin',type=Path,default=Path('/usr/lib/postgresql/18/bin'));a=p.parse_args()
 e=json.loads((ROOT/'09-References/Database-Evidence.json').read_text());cat=json.loads((ROOT/e['catalog_file']).read_text());reg=table_register(cat);errors=[]
 def check(ok,why):
  if not ok:errors.append(why)
 source=ROOT/'pharmville-database'
 check(sorted(x.name for x in source.iterdir())==['pharmville_schema.sql'],'SQL-only directory differs')
 for file,hashkey in [(source/e['schema_file'],'schema_sha256'),(ROOT/e['catalog_file'],'catalog_sha256'),(ROOT/e['register_file'],'register_sha256'),(ROOT/e['logical_reference_file'],'logical_reference_sha256')]:check(hashlib.sha256(file.read_bytes()).hexdigest()==e[hashkey],f'Checksum differs: {file.relative_to(ROOT)}')
 expectedpages={ROOT/'04-Database/Tables'/t.split('.')[0]/(t.split('.')[1]+'.md') for t in reg}
 check({p for p in (ROOT/'04-Database/Tables').glob('*/*.md') if p.name!='README.md'}==expectedpages,'Bidirectional table-page set differs')
 total=0
 for t,d in reg.items():
  page=ROOT/'04-Database/Tables'/t.split('.')[0]/(t.split('.')[1]+'.md');text=page.read_text();fields={}
  for line in text.splitlines():
   parts=[x.strip() for x in re.split(r'(?<!\\)\|',line)[1:-1]]
   if len(parts)==7 and re.fullmatch('`[a-z_0-9]+`',parts[0]) and parts[2] in ['Yes','No']:fields[parts[0].strip('`')]=parts
  check(set(fields)==set(d['columns']),f'{t}: column set differs');total+=len(d['columns'])
  for c,encoded in d['columns'].items():
   if c not in fields:continue
   x=json.loads(encoded);f=fields[c];check(f[1]==f"`{x['type']}`" and (f[2]=='No')==x['not_null'] and f[3]==('—' if x['default'] is None else '`'+x['default'].replace('|','\\|').replace('\n',' ')+'`'),f'{t}.{c}: type/nullability/default differs')
  for section in ['constraints','indexes','triggers']:
   for k,v in d.get(section,{}).items():
    value=json.loads(v);definition=value[1] if section=='constraints' else value[0]
    check(f'`{k}`'in text and definition.replace('|','\\|').replace('\n',' ')in text,f'{t}.{k}: {section} definition missing')
  for k,v in cat['not_null_constraints'].items():
   if k.startswith(t+'.'):check(f"`{k[len(t)+1:]}`"in text,f'{k}: NOT NULL constraint missing')
 check(json.loads((ROOT/e['register_file']).read_text())==reg,'Derived table register differs')
 objects=(ROOT/'04-Database/Database-Objects.md').read_text()
 for name,encoded in cat['functions'].items():check(json.loads(encoded)[0].rstrip()in objects,f'{name}: supporting function documentation differs')
 for category in ['extensions','runtime_roles','grants','default_privileges','policies','sequences']:
  for name,encoded in cat[category].items():
   needle=(' | '.join([*name.rsplit(':',2),'Yes'if json.loads(encoded)[0]else'No']))if category=='grants'else name
   check(needle in objects,f'{category} {name}: supporting reference missing')
 if errors:raise RuntimeError('\n'.join(errors))
 print(f'PASS: SQL/catalog hashes, SQL-only delivery, all {len(reg)} table pages/{total} columns, exact constraints/indexes/triggers and NOT NULL constraints.')
 if not a.fresh:return
 base=Path(tempfile.mkdtemp(prefix='pharmville-schema-validation-'));base.chmod(0o700);data=base/'data';sock=base/'socket';sock.mkdir(mode=0o700);pg=a.pg_bin;started=False
 try:
  run([pg/'initdb','-D',data,'-U','pharmville_blueprint_owner','--auth-local=trust','--auth-host=reject','--no-locale','--encoding=UTF8'])
  with (data/'postgresql.conf').open('a') as f:f.write(f"\nlisten_addresses=''\nunix_socket_directories='{sock}'\nport=55439\nmax_connections=20\nshared_buffers='32MB'\nmax_locks_per_transaction=2048\n")
  run([pg/'pg_ctl','-D',data,'-l',base/'server.log','-w','start']);started=True
  conn=['-h',str(sock),'-p','55439','-U','pharmville_blueprint_owner'];db='pharmville_schema_rehearsal'
  run([pg/'createdb',*conn,'--template=template0',db]);run([pg/'psql','-X','--no-password',*conn,'-d',db,'-v','ON_ERROR_STOP=1','-f',source/e['schema_file']])
  fresh=snapshot(str(pg/'psql'),conn,db);delta=differences(cat,fresh)
  (base/'differences.json').write_text(json.dumps(delta,indent=2)+'\n')
  if delta:raise RuntimeError(f'{len(delta)} structural differences: {base}/differences.json')
  counts=run([pg/'psql','-X','-At',*conn,'-d',db,'-c',"SELECT format('SELECT %L AS table_name, count(*) FROM %I.%I;',schemaname||'.'||tablename,schemaname,tablename) FROM pg_tables WHERE schemaname=ANY(ARRAY["+','.join("'"+s+"'" for s in cat['schemas'])+"]) ORDER BY 1"])
  rows=run([pg/'psql','-X','-At',*conn,'-d',db],input=counts)
  populated=[line for line in rows.splitlines() if not line.endswith('|0')]
  if populated:raise RuntimeError('Schema-only restore unexpectedly contains rows: '+str(populated))
  result={'status':'passed','catalog_dimensions':len(cat),'structural_differences':0,'tables_verified_empty':len(reg),'postgresql':run([pg/'postgres','--version']).strip(),'private_evidence':str(base)}
  (base/'result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
 finally:
  if started:run([pg/'pg_ctl','-D',data,'-w','stop','-m','fast'])
  print('Private validation files retained:',base)
if __name__=='__main__':
 try:main()
 except (RuntimeError,subprocess.CalledProcessError) as exc:
  print(str(exc),file=sys.stderr)
  if isinstance(exc,subprocess.CalledProcessError):print(exc.stderr,file=sys.stderr)
  sys.exit(1)
