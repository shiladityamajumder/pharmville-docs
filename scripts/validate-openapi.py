#!/usr/bin/env python3
"""Independent OpenAPI 3.1 and JSON Schema example/Markdown synchronization audit.

Requires validation-environment PyYAML, openapi-spec-validator and jsonschema;
these are not application dependencies or database deployment prerequisites.
"""
from pathlib import Path
import argparse,collections,json,re,sys,warnings
warnings.filterwarnings('ignore',category=DeprecationWarning)
import yaml
from openapi_spec_validator import OpenAPIV31SpecValidator
from jsonschema import Draft202012Validator,FormatChecker,RefResolver
ROOT=Path(__file__).resolve().parents[1]
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--report',type=Path);args=parser.parse_args()
 spec=yaml.safe_load((ROOT/'05-APIs/openapi.yaml').read_text());reg=json.loads((ROOT/'04-Database/Table-Register.json').read_text());owned=json.loads((ROOT/'04-Database/Ownership-and-Scope.json').read_text());errors=[];counts=collections.Counter();resolver=RefResolver.from_schema(spec)
 def validate(schema,value,where):
  counts['schema_validated_examples']+=1
  for error in Draft202012Validator(schema,resolver=resolver,format_checker=FormatChecker()).iter_errors(value):errors.append(where+': '+error.message)
 for error in OpenAPIV31SpecValidator(spec).iter_errors():errors.append('OpenAPI 3.1 meta-schema: '+str(error))
 counts['openapi_meta_schema_errors']=len(errors)
 before=json.loads((ROOT/'09-References/Architecture-Rework-API-Baseline.json').read_text());expected={(x['method'],x['path'],x['id'],x['operationId'])for x in before};actual=set();expected|={(x['method'],x['path'],x['id'],x['operationId'])for x in json.loads((ROOT/'09-References/Unified-Authentication-API-Proposals.json').read_text())}
 for path,methods in spec['paths'].items():
  for method,o in methods.items():
   if method not in ['get','post','put','patch','delete']:continue
   aid=o['x-api-id'];actual.add((method,path,aid,o['operationId']));counts['operations']+=1;counts[o['x-documentation-status']]+=1
   for direction in ['x-database-reads','x-database-writes']:
    for t,columns in o[direction].items():
     for c in columns:
      counts['validated_operation_column_uses']+=1
      if t not in reg or c not in reg[t]['columns']:errors.append(aid+' invalid table/column '+t+'.'+c)
   for t in o['x-master-dependencies']:
    if owned.get(t,{}).get('classification')!='Master / Reference':errors.append(aid+' invalid master dependency '+t)
   for parameter in o.get('parameters',[]):
    for key in ['example','default']:
     if key in parameter['schema']:validate(parameter['schema'],parameter['schema'][key],aid+' parameter '+parameter['name']+' '+key)
   for where,content in [('request',o.get('requestBody',{}).get('content',{})),*[(str(code),v.get('content',{}))for code,v in o['responses'].items()]]:
    if where in ['204','304'] and content:errors.append(aid+' body on forbidden response '+where)
    for media,body in content.items():
     for label,ex in body.get('examples',{}).items():validate(body['schema'],ex['value'],aid+' '+where+' '+label)
   cp=(ROOT/'05-APIs'/o['x-contract-document']).resolve();text=cp.read_text();match=re.search(r'^## '+re.escape(aid)+r' — .*?(?=^## |\Z)',text,re.M|re.S)
   if not match:errors.append(aid+' missing own Markdown contract');continue
   section=match[0]
   for title in ['Authentication and authorization','Request headers','Path parameters','Query parameters','Request body and uploads','Success response','Endpoint errors and recovery','Database mapping and ownership','Operational rules','Designed contract tests']:
    if '### '+title not in section:errors.append(aid+' missing required contract section '+title)
   status=str(o['x-proposed-success-status'])
   for block in re.findall(r'```json\s*\n(.*?)\n```',section,re.S):
    try:value=json.loads(block)
    except json.JSONDecodeError as e:errors.append(aid+' invalid JSON '+str(e));continue
    if isinstance(value,dict) and 'success'in value:
     if value['success']:
      response=o['responses'][status]['content']['application/json'];validate(response['schema'],value,aid+' Markdown success')
      if value!=response['examples']['proposed']['value']:errors.append(aid+' Markdown/OpenAPI success differs')
     else:validate({'$ref':'#/components/schemas/ErrorEnvelope'},value,aid+' Markdown error')
    elif o.get('requestBody'):
     request=o['requestBody']['content']['application/json'];validate(request['schema'],value,aid+' Markdown request')
     if value!=request['examples']['proposed']['value']:errors.append(aid+' Markdown/OpenAPI request differs')
   for column in re.findall(r'\| (?:request|data)\.[^|]+\| ([a-z_]+\.[a-z_]+\.[a-z_]+) \|',section):
    t,c=column.rsplit('.',1)
    if t not in reg or c not in reg[t]['columns']:errors.append(aid+' invalid Markdown mapping '+column)
 if actual!=expected:errors.append('Preserved operation IDs/methods/paths differ')
 def walk(value):
  if isinstance(value,dict):
   if 'x-db-column'in value:
    counts['schema_column_mappings']+=1;t,c=value['x-db-column'].rsplit('.',1)
    if t not in reg or c not in reg[t]['columns']:errors.append('Invalid schema column '+t+'.'+c)
    elif c=='id'and json.loads(reg[t]['columns'][c])['type']=='bigint':errors.append('Internal BIGINT exposed '+t)
   for x in value.values():walk(x)
  elif isinstance(value,list):
   for x in value:walk(x)
 walk(spec['components']);counts['tables_classified']=len(owned)
 report={'result':'FAIL'if errors else'PASS','counts':dict(counts),'errors':errors,'limitations':['No application/provider/production tests executed.','SQL parity independently validated; runtime/business approvals remain open.','Eight conceptual contract gaps remain excluded despite structurally valid schemas.']}
 if args.report:args.report.write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps(report,indent=2));return bool(errors)
if __name__=='__main__':sys.exit(main())
