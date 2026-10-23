import fs from 'node:fs';
import path from 'node:path';
import {screens as customers} from '../customer/screens.js';
import {screens as staff} from '../staff/screens.js';
import {screens as operations} from '../operations/screens.js';
import {screens as access} from '../shared/access-screens.js';
import {scenarios} from '../assets/js/scenarios.js';
import {workspaceRoles} from '../assets/js/navigation.js';
const root=path.resolve(import.meta.dirname,'..');
const source=fs.readFileSync(path.resolve(root,'../01-Project/Features-and-Modules.md'),'utf8');
const features=[...source.matchAll(/^\| `([A-Z]+-\d{2})` \| (\w+) \| (.*?) \| (.*?) \|$/gm)].map(m=>({id:m[1],module:m[2],priority:m[3],description:m[4]}));
const screens=[...customers,...staff,...operations,...access];
const blocked={
'RX-02':'D-004/D-006: post-order deferred upload conflicts with review-before-payment. Control explains the block; no timer is invented.',
'ORD-09':'D-010/D-024: post-order edits need accepted-revision, stock, clinical and price contracts. Existing order is preserved.',
'ADM-03':'D-003/D-022: signed role/location grants remain unapproved. The matrix and denied states illustrate access; role changes are review requests.',
'ADM-09':'D-004/D-012: offer controls validate a proposal only; no unapproved discount activates.',
'OMS-07':'D-001/D-024: assisted ordering is a request/validation concept; customer consent and command contracts remain undecided.',
'INV-07':'D-005/D-016: local fresh/stale/replayed observation fixtures do not implement an authoritative Techsmith adapter.',
'WH-03':'D-002: urgent-run requests retain capacity approval pending; the inherited two-extra-runs figure is not enforced as approved.',
'WH-04':'D-002/D-006/D-010: fallback review can be requested, but warehouse dispensing needs licensed-site and scope approval.',
'RID-03':'D-011/D-021: schematic locations demonstrate freshness only; real background cadence, tracking and retention are disabled.',
'RID-05':'D-006/D-011: doorstep clinical checks cannot replace pharmacist review; approved SOP is missing.',
'RID-07':'D-007/D-008: scoped delivery counts exist, but earnings/formula/payout stay unavailable rather than inventing amounts.',
'FIN-02':'D-008/D-012: only a sample order document is downloadable; GSTIN, tax splits and legal invoice issuance are not approved.',
'FIN-04':'D-004/D-007: verified COD destination is an explicit synthetic fixture; the real proof/transfer contract is unresolved.',
'FIN-07':'D-008/D-012: credit-note proposal retains invoice/refund links without issuing a tax credit or posting a journal.',
'REP-02':'D-012: draft GST report is labelled not filing-ready; approved tax definitions are unavailable.',
'NOT-05':'Optional draft scope: browser push choices are local consent simulations; no actual push subscription is created.'};
const interaction=new Set(['ACC-01','ACC-05','ACC-06','CHK-03','CHK-04','CHK-06','CHK-07','CHK-08','RX-03','RX-04','RX-05','ORD-01','ORD-02','ORD-06','INV-02','INV-03','PHM-04','PHM-05','FIN-01','NOT-01','NOT-02','NOT-03','NOT-04']);
const evidence={
'ACC-01':'Request/verify/resend and fallback use one synthetic code, with incorrect/expired/rate-limited states.',
'ACC-02':'Profile form validates name/email; replacement existing email/mobile waits for proof while preserving verified contacts.',
'ACC-03':'Address/map-pin form checks synthetic serviceability and saves/selects owned destinations.',
'ACC-04':'Dependent form requires authorization; checkout binds one patient.',
'ACC-05':'Explicit versioned acknowledgement and optional channel choices are saved.',
'ACC-06':'Deletion becomes a privacy review request; no clinical or financial evidence is erased.',
'ACC-07':'Wishlist adds/removes duplicate-safe product references.',
'CAT-03':'Query filters name/brand/composition; no-match suggestions can replace query.',
'CAT-05':'Exact synthetic composition/strength/form candidates require explicit choice and fresh P review.',
'CHK-07':'Repeated Pay returns the same payment attempt; paid/pending attempts cannot create another charge.',
'CHK-08':'Current eligible site stock is held; expiry scenario releases unused hold and recovery does not fabricate supply.',
'RX-01':'Comma-separated fictional JPG/PNG/PDF filenames simulate multiple evidence files; no file is read or uploaded.',
'RX-03':'Saved evidence is matched to the patient and sent for fresh review; no old approval is inherited.',
'ORD-04':'Before-packed cancellation uses a confirmation dialog and rechecks the latest milestone.',
'ORD-05':'Delivered item/quantity/reason creates an eligibility-review request without stock or refund credit.',
'ORD-07':'Schematic tracking and masked-call simulation use the current assignment; no real route/call occurs.',
'INV-02':'Append-only demo movements connect packing, receipt, transfer and reasoned adjustment to balances.',
'INV-04':'Reasoned adjustment requires illustrative manager approval; cross-location or duplicate commands are denied.',
'PHM-03':'Each P line receives a synthetic reviewer choice and rejection reason; partial outcome waits for customer acceptance.',
'FIN-03':'Pending intents reserve refundable amount, approvals remain separate, and replay cannot duplicate payout.',
'FIN-05':'Provider reference/amount/currency comparison preserves a mismatch as an exception.',
'FIN-06':'Actual collection and deposit retain an unresolved shortage; delivery is not rewritten.',
'REP-07':'Filters produce a scoped run; prepare/download rechecks access and creates an Excel-readable TSV, not native XLSX.',
'ADM-07':'Paste CSV tabular fixture; row validation, preview and duplicate-safe apply simulate spreadsheet import. Native XLSX parsing is not implemented.',
'AUTH-01':'Staff password step creates a pre-session challenge; correct demo authenticator is required for sign-in.',
'AUTH-02':'Revoke hides protected forms until the demo MFA flow completes again.',
'AUTH-03':'Explicit OTP rate-limit and expiry fixtures show the denial/recovery, without guessed production durations.',
'AUTH-04':'Server-side authorization is backend-only; role/scenario/session denial demonstrates the visible effect. There is no security backend.'};
const escape=s=>String(s).replaceAll('|','\\|').replaceAll('\n',' ');
const routeLink=s=>`[${s.id}](../index.html#/${s.route})`;
for(const feature of features)if(!screens.some(s=>s.features.includes(feature.id)))throw new Error('Unmapped source feature '+feature.id);
const used=Array.from(new Set(screens.flatMap(s=>['normal',...s.scenarios])));for(const key of used)if(!scenarios[key])throw new Error('Unknown scenario '+key);
fs.mkdirSync(path.join(root,'documentation'),{recursive:true});
let inventory='# Screen inventory\n\nGenerated from the actual screen registry by `node 10-Low-Fidelity-Wireframes/tools/generate-documentation.mjs`. Stable screen IDs describe reusable views, not one HTML file per feature. The source still contains '+features.length+' draft features across '+new Set(features.map(f=>f.module)).size+' modules. The three experiences are customer, shared protected staff and rider; staff domain views are not separate applications.\n\n| Screen ID | Screen | Experience / workspace | Illustrative role | Feature IDs | Available states | Prototype link |\n| --- | --- | --- | --- | --- | --- | --- |\n';
for(const s of screens)inventory+=`| ${s.id} | ${escape(s.title)} | ${s.platform} / ${s.workspace} | ${escape(workspaceRoles[s.workspace]||'Admin')} | ${s.features.map(f=>'`'+f+'`').join(', ')} | ${Array.from(new Set(s.scenarios)).join(', ')} | [Open](../index.html#/${s.route}) |\n`;
inventory+='\n'+screens.length+' actual screens. See [Feature Coverage](Feature-Coverage.md) for what is demonstrated, backend-only or blocked. The role dropdown is a reviewer fixture; signed production permissions remain undecided.\n';
fs.writeFileSync(path.join(root,'documentation/Screen-Inventory.md'),inventory);
let coverage='# Feature coverage\n\nEvery source feature is mapped below from the authoritative [feature inventory](../../01-Project/Features-and-Modules.md). All 110 remain inherited drafts. “Covered” means a real local view/control/state demonstrates the UX, not that business policy or production implementation is approved. A blocked feature has a meaningful explanation/proposal surface, not claimed completed functionality.\n\n| Feature | UX classification | Implemented screen/state evidence | Screen links |\n| --- | --- | --- | --- |\n';
const counts={};for(const f of features){const related=screens.filter(s=>s.features.includes(f.id));const status=blocked[f.id]?'Blocked by an open decision':f.id==='AUTH-04'?'Backend-only, with no direct screen':interaction.has(f.id)?'Covered by interaction/state':'Covered by screen';counts[status]=(counts[status]||0)+1;const note=blocked[f.id]||evidence[f.id]||related.map(s=>s.description).slice(0,2).join(' ');coverage+=`| \`${f.id}\` | ${status} | ${escape(note)} | ${related.map(routeLink).join(', ')} |\n`;}
coverage+='\n## Coverage boundaries\n\n'+Object.entries(counts).map(([s,n])=>'- '+s+': '+n).join('\n')+'\n\nNo feature is assigned a future phase merely from its database table. Warehouse/rider/optional launch questions remain the original owner decisions. CSV import and TSV export are explicit prototype format approximations; native Excel file parsing/creation is not claimed. Local code simulates idempotency and safety gates for review; it does not implement production authentication, medical eligibility or payment processing.\n';
fs.writeFileSync(path.join(root,'documentation/Feature-Coverage.md'),coverage);
let edge='# Edge-case coverage\n\nScenario IDs are stable across related views. Select a scenario in the reviewer panel; its start, trigger, visible result and recovery are shown on-screen. Generic loading/empty/network/session/permission states replace the action surface, preserving committed business facts. Specialized scenarios alter the relevant domain view and/or its submitted outcome. Choosing a scenario does not silently supply an approval.\n\nThe [screen inventory](Screen-Inventory.md) lists every exact screen/state association. Links below open a representative supported screen per workspace, keeping the scenario view compact.\n\n| Scenario ID / name | Start and trigger | Visible result and recovery | Supported workspace examples | Requirement |\n| --- | --- | --- | --- | --- |\n';
for(const key of used){const s=scenarios[key];const supported=screens.filter(x=>x.scenarios.includes(key)||key==='normal');const examples=Array.from(new Set(supported.map(x=>x.workspace))).map(w=>supported.find(x=>x.workspace===w));edge+=`| ${s.id} / ${s.label} | ${escape(s.start)}. Trigger: ${escape(s.trigger)} | ${escape(s.result)}. Next: ${escape(s.recovery)} | ${examples.map(x=>`[${x.workspace}](../index.html#/${x.route}${key==='normal'?'':'?scenario='+key})`).join(', ')} (${supported.length} screens) | [Source](../../${s.source}) |\n`;}
edge+='\n'+used.length+' distinct scenario definitions across '+screens.reduce((n,s)=>n+new Set(['normal',...s.scenarios]).size,0)+' screen/scenario combinations. This is UX simulation coverage, not application test coverage. The original [module edge cases](../../03-Modules/README.md) and [decisions](../../09-References/Sources-and-Decisions.md) remain authoritative for policy.\n';
fs.writeFileSync(path.join(root,'documentation/Edge-Case-Coverage.md'),edge);
const summary={screens:screens.length,features:features.length,modules:new Set(features.map(f=>f.module)).size,scenarioDefinitions:used.length,screenScenarioCombinations:screens.reduce((n,s)=>n+new Set(['normal',...s.scenarios]).size,0),coverage:counts};
fs.writeFileSync(path.join(root,'assets/js/feature-catalog.js'),'// Generated from the authoritative documentation inventory.\nexport const featureCatalog='+JSON.stringify(features,null,2)+';\n');
fs.writeFileSync(path.join(root,'documentation/coverage-summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));
