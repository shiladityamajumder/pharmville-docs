import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {screens as customer} from '../customer/screens.js';
import {screens as staff} from '../staff/screens.js';
import {screens as operations} from '../operations/screens.js';
import {screens as access} from '../shared/access-screens.js';
import {scenarios} from '../assets/js/scenarios.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const screens=[...customer,...staff,...operations,...access];
const success=new Set([
 'customer/login','customer/otp','customer/profile','customer/search','customer/home','customer/product','customer/cart','customer/checkout-address','customer/checkout-summary','customer/payment','customer/payment-recovery','customer/tracking','customer/cancellation','customer/prescription-upload','customer/prescription-status','customer/refund','customer/return',
 'pharmacy/decision','store/queue','store/pick','store/pack','delivery/assignment','rider/login','rider/tasks','rider/pickup','rider/completion','staff/refunds','warehouse/receiving','warehouse/replenishment','warehouse/dispatch','store/receipt','staff/reports','staff/report-results','access/sessions','access/login','access/mfa'
]);
const recovery=new Set([
 'customer/otp','customer/profile','customer/payment-result','customer/payment-recovery','customer/prescription-status','customer/refund','customer/cancellation','rider/completion','staff/refunds','warehouse/receiving','store/receipt','staff/report-results','access/login','access/mfa'
]);
const screenshots=new Set(['customer/home','customer/checkout-summary','pharmacy/review','rider/completion']);
const classify=keys=>{
 const ids=keys.map(key=>scenarios[key]?.id).filter(Boolean);
 return ids.length?ids.map(id=>`\`${id}\``).join(', '):'N/A';
};
const rows=screens.map(screen=>{
 const keys=Array.from(new Set(['normal',...screen.scenarios]));
 const has=key=>keys.includes(key);
 const errors=keys.filter(key=>!['normal','loading','empty'].includes(key));
 return `| \`${screen.id}\` ${screen.title.replaceAll('|','\\|')}<br>\`${screen.route}\` | ${screen.features.map(id=>`\`${id}\``).join(', ')} | Rendered | ${has('loading')?`Rendered (\`${scenarios.loading.id}\`)`:'N/A'} | ${has('empty')?`Rendered (\`${scenarios.empty.id}\`)`:'N/A'} | ${classify(errors)} | ${success.has(screen.route)?'Interaction asserted':'Not separately asserted'} | ${recovery.has(screen.route)?'Interaction asserted':'Not separately asserted'} | ${screenshots.has(screen.route)?'Screenshot captured':'—'} | ${errors.length?'Other assigned scenarios are render-only':'No error scenario assigned'} |`;
});
const combinations=screens.reduce((sum,screen)=>sum+new Set(['normal',...screen.scenarios]).size,0);
const doc=`# UX state coverage

Generated from the screen registry, feature catalog, scenario registry, and browser-suite evidence. Regenerate with the command node tools/generate-ux-state-coverage.mjs from 10-Low-Fidelity-Wireframes.

The registry currently maps **${screens.length} screens**, **${combinations} screen/scenario combinations**, and the feature IDs shown below. The browser smoke suite opens every normal screen and every listed scenario at its registered route. “Rendered” means that route and scenario were opened in the browser; it does not claim a task interaction was exercised. “Interaction asserted” means a browser assertion checks a success or recovery behavior for that route. “Not separately asserted” is a test gap, not proof that the behavior is absent. “N/A” means the registry does not assign that state to the screen.

| Screen (ID and route) | Feature IDs | Normal | Loading | Empty | Error / exception scenario IDs | Success | Recovery | Screenshot | Open gap |
|---|---|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## Cross-screen interaction evidence

- **Customer:** browser assertions cover invalid and valid sign-in, profile validation and saved values, search, product/cart, checkout, pending/declined/reconciled payment, prescription rejection and pharmacist approval, order tracking, cancellation/refund, returns, and cross-role delivery status.
- **Store, delivery, rider, warehouse and finance:** assertions cover exact-batch picking/packing and replay, rider assignment and pickup, wrong and offline delivery proof plus reconnect, actual supplier/transfer receipt quantities, short receipt, refunds, and COD reconciliation exceptions.
- **Access and reporting:** assertions cover protected access denial, session restoration, report preparation/export, and revoked download access.
- **Viewport review:** the browser suite checks horizontal overflow for every screen at 360×800, 390×844, 430×932, 768×1024, 1280×800, and 1440×900. Focused screenshots cover customer home, checkout summary, pharmacy review, and rider completion at these sizes.

## Task-based heuristic review checklist

- [x] First screen offers a recommended customer task; technical reviewer controls remain outside the default product view.
- [x] Customer, staff, and rider routes expose role-appropriate navigation and next steps.
- [x] Keyboard focus moves to the page heading on navigation and to the visible error notice after a failed submission.
- [x] Error feedback keeps the submitted form values available for correction or retry.
- [x] Network loss keeps the current screen visible, blocks mutations, and provides an explicit retry to simulated normal operation.
- [x] Controls retain the 44 px minimum target; all six requested widths are checked for horizontal overflow.
- [ ] Field-specific inline validation is not consistent across every form; the shared recoverable notice currently handles submission errors.
- [ ] The full matrix has route/scenario render evidence, but scenarios beyond the listed end-to-end flows still need dedicated interaction assertions.

This is a heuristic review of the prototype and automated evidence, not a moderated user study. Remaining checks are ordered by impact: add field-level correction messages on high-risk checkout, pharmacy, refund, and delivery forms; then add interaction assertions for currently unverified route/scenario pairs; finally review any viewport-specific visual findings retained in the generated browser artifacts.
`;
const output=path.join(root,'documentation','UX-State-Coverage.md');
fs.writeFileSync(output,doc);
console.log(JSON.stringify({output,screens:screens.length,combinations,features:[...new Set(screens.flatMap(screen=>screen.features))].length},null,2));
