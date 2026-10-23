import fs from 'node:fs';
import path from 'node:path';
import {screens as customer} from '../customer/screens.js';
import {screens as staff} from '../staff/screens.js';
import {screens as operations} from '../operations/screens.js';
import {screens as access} from '../shared/access-screens.js';
import {initialState} from '../assets/js/mock-data.js';
import {scenarios} from '../assets/js/scenarios.js';
import {featureCatalog} from '../assets/js/feature-catalog.js';
const root=path.resolve(import.meta.dirname,'..');
const screens=[...customer,...staff,...operations,...access];
const errors=[],actions=new Set(),links=new Set();
const sourceFiles=['customer/screens.js','staff/screens.js','operations/screens.js','shared/access-screens.js','assets/js/app.js'];
const source=sourceFiles.map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
const known=new Set(screens.map(s=>s.route));
for(const s of screens){for(const key of new Set(['normal',...s.scenarios])){
 if(!scenarios[key])errors.push(s.route+': unknown scenario '+key);
 try{const html=s.render({state:initialState(),screen:s,scenario:key,hasScenario:k=>key===k});
  for(const m of html.matchAll(/data-(?:action|form)="([^"]+)"/g))actions.add(m[1]);
  for(const m of html.matchAll(/href="#\/([^"]*)"/g))links.add(m[1].split('?')[0]);
 }catch(e){errors.push(s.route+'/'+key+': '+e.message);}
}}
for(const action of actions)if(!source.includes("'"+action+"'")&&!source.includes('"'+action+'"'))errors.push('Control has no registered handler: '+action);
for(const route of links)if(route&&!known.has(route))errors.push('Unknown rendered route: '+route);
const authoritative=fs.readFileSync(path.resolve(root,'../01-Project/Features-and-Modules.md'),'utf8');
const sourceIds=[...authoritative.matchAll(/^\| `([A-Z]+-\d{2})` \|/gm)].map(m=>m[1]);
if(JSON.stringify(sourceIds)!==JSON.stringify(featureCatalog.map(f=>f.id)))errors.push('Generated feature catalog differs from authoritative source');
for(const id of sourceIds)if(!screens.some(s=>s.features.includes(id)))errors.push('Missing screen/state mapping: '+id);
const ids=new Set(sourceIds);for(const s of screens)for(const id of s.features)if(!ids.has(id))errors.push('Unknown feature '+id+' on '+s.route);
for(const file of ['index.html','assets/css/base.css','assets/css/components.css','assets/css/responsive.css','assets/js/app.js','documentation/Screen-Inventory.md','documentation/Feature-Coverage.md','documentation/User-Flows.md','documentation/Edge-Case-Coverage.md','documentation/Design-Decisions.md','documentation/Prototype-Test-Plan.md','documentation/How-to-Run.md'])if(!fs.existsSync(path.join(root,file)))errors.push('Missing required artifact '+file);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g))if(!m[1].startsWith('#')&&!m[1].startsWith('data:')&&!fs.existsSync(path.join(root,m[1])))errors.push('Broken HTML asset '+m[1]);
const report={screens:screens.length,features:sourceIds.length,scenarioDefinitions:Object.keys(scenarios).length,screenScenarioCombinations:screens.reduce((n,s)=>n+new Set(['normal',...s.scenarios]).size,0),interactiveActionNames:actions.size,errors};
fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});fs.writeFileSync(path.join(root,'artifacts/static-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));process.exitCode=errors.length?1:0;
