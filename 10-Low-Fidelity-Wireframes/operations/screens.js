import { h, link, button, field, select, form, table, badge, panel, notice, money, timeline, empty } from '../shared/ui.js';
import {establishSession,revokeSession} from '../shared/mock-domain.js';

// Every record and policy below belongs to a synthetic browser demonstration.
const TODAY = '2026-10-23';
const common = ['normal', 'loading', 'empty', 'validation', 'network', 'permission', 'session', 'duplicate', 'conflict'];
const product = (s, id) => s.products.find(p => p.id === id) || { id, name: id, class: 'Unknown', price: 0 };
const pLines = s => s.order.items.filter(i => product(s, i.productId).class === 'P');
const currentSite = s => s.location || s.order.site;
const warehouseSite = s => s.inventory.find(i => /warehouse|WH/i.test(i.site))?.site || 'Warehouse Central';
const stockRows = (s, site) => s.inventory.filter(i => !site || i.site === site);
const ops = s => s.ops || {};
const hidden = (name, value) => `<input type="hidden" name="${h(name)}" value="${h(value)}">`;
const check = (label, name, checked = false) => `<label class="check"><input type="checkbox" name="${h(name)}"${checked ? ' checked' : ''}> ${h(label)}</label>`;
const meta = ctx => hidden('revision', ctx.state.order.revision) + hidden('assignmentVersion', ctx.state.order.assignmentVersion || 0);
const actions = html => `<div class="actions">${html}</div>`;
const policy = (text, ids) => notice(text, 'warning')+`<details class="policy-details"><summary>Implementation notes</summary><p>Policy approval pending: ${h(ids)}.</p></details>`;
const rows = s => table(['Item / class', 'Exact quantity', 'Price'], s.order.items.map(i => [`${h(product(s, i.productId).name)} ${badge(product(s, i.productId).class)}`, h(i.qty), money(product(s, i.productId).price)]));
const summary = s => {const o=s.order;const statuses=s.role==='Pharmacist'?[['Review',o.review],['Patient',o.patientId]]:s.role==='Store worker'?[['Preparation',o.pack],['Stock',o.stock]]:s.role==='Warehouse worker'?[['Stock',o.stock],['Transfer',s.transfer?.status||'Not started']]:[['Delivery',o.delivery],['Payment',o.payment]];return panel(`Order ${o.id}`,`<div class="task-summary">${statuses.map(([label,value])=>`<div><span>${label}</span>${badge(value||'Not recorded')}</div>`).join('')}<div><span>Amount</span><strong>${money(o.total)}</strong></div></div><details class="policy-details"><summary>Order checks and history</summary><p>Review ${h(o.review)} · Stock ${h(o.stock)} · Packing ${h(o.pack)} · Delivery ${h(o.delivery)} · Revision ${h(o.revision)} · ${h(o.site)}</p></details>`);};
const lotTable = lots => table(['Product', 'Site', 'Batch', 'Expiry', 'Quantity', 'Eligibility'], lots.map(i => [h(i.productId), h(i.site), h(i.batch), h(i.expiry), h(i.qty), badge(i.eligible && i.expiry > TODAY ? 'Eligible demo lot' : 'Blocked')]));
const has = (ctx, key) => ctx.scenario === key || ctx.hasScenario?.(key);
const screen = (prefix, number, route, title, workspace, module, features, description, extra, render) => ({ id: `SCR-${prefix}-${String(number).padStart(3, '0')}`, route, title, workspace, platform: workspace === 'rider' ? 'rider' : 'staff', module, features, description, scenarios: [...new Set([...common, ...extra])], render: ctx => {
  if (workspace === 'rider' && !['rider/login', 'rider/tasks'].includes(route)) {
    const denied = riderGuard(ctx, !['rider/history','rider/returns'].includes(route));
    if (denied) return empty('Assigned rider access required', denied, link('Rider sign in', 'rider/login') + link('My tasks', 'rider/tasks'));
  }
  return render(ctx);
} });
const eligible = i => i.eligible && i.expiry > TODAY && i.qty > 0;
function gateProblems(s, ctx) {
  const o = s.order;
  const problems = [];
  if (!o.items.length) problems.push('The order has no accepted items.');
  if (o.customerAccepted === false) problems.push('Customer has not accepted the current basket revision.');
  if (o.site !== 'Demo Store 01') problems.push('This site has no approved illustrative dispensing fixture. Operations/Pharmacy must review licensed-site eligibility.');
  if (o.items.some(i => !product(s, i.productId).approved || product(s, i.productId).class === 'Unknown')) problems.push('Unapproved or unclassified items cannot be fulfilled.');
  if (['Cancelled', 'Cancellation requested', 'Delivered'].includes(o.status)) problems.push('Order is cancelled, closing, or already delivered.');
  if (pLines(s).length && (o.review !== 'Approved' || o.customerAccepted === false || (o.reviewRevision != null && Number(o.reviewRevision) !== Number(o.revision)) || (o.reviewPatientId && o.reviewPatientId !== o.patientId))) problems.push('Current patient, prescription and accepted P-line approval must match this revision.');
  if (has(ctx, 'prescription-rejected') || has(ctx, 'prescription-partial') || has(ctx, 'prescription-missing')) problems.push('Prescription evidence is unresolved in this scenario.');
  if (o.method !== 'cod' && o.payment !== 'Paid') problems.push('Verified payment is required. Pending or failed payment cannot be packed.');
  if (o.method === 'cod' && (!o.total || o.codEligible !== true)) problems.push('COD requires a nonzero accepted amount and an explicit illustrative eligibility fixture.');
  if (!['Active', 'Committed'].includes(o.stock)) problems.push('A current held stock allocation is required.');
  if (has(ctx, 'stock-expired') || has(ctx, 'out-of-stock') || has(ctx, 'stale-stock')) problems.push('Exact held batch is expired, unavailable or stale; Inventory must resolve it.');
  for (const item of o.items) {
    const picked = o.pickLines?.find(p => p.productId === item.productId);
    const inv = picked ? s.inventory.find(i => i.id === picked.inventoryId) : s.inventory.find(i => i.productId === item.productId && i.site === o.site && eligible(i) && i.qty >= item.qty);
    if (!inv || !inv.eligible || inv.expiry <= TODAY || (!o.inventoryCommitted && inv.qty < item.qty) || (picked && (picked.batch !== inv.batch || picked.qty !== item.qty || inv.site !== o.site))) problems.push(`${product(s, item.productId).name}: exact current eligible batch/quantity unavailable.`);
  }
  return problems;
}
function gates(ctx) {
  const failures = gateProblems(ctx.state, ctx);
  return panel('Release checks', failures.length ? `<ul>${failures.map(x => `<li>${h(x)}</li>`).join('')}</ul>${link('Review order exceptions', 'staff/order-detail')}` : notice('Demo gates pass: accepted contents, review, payment or illustrative COD, held exact stock.'));
}
function taskCard(ctx) {
  const s = ctx.state;
  const next = s.order.delivery === 'Accepted' ? link('Go to pickup', 'rider/pickup', 'button primary') : ['Picked up', 'Out for delivery'].includes(s.order.delivery) ? link('Complete delivery', 'rider/completion', 'button primary') : link('View task details', 'rider/pickup', 'button primary');
  return panel('Your current delivery', `<p><strong>Order ${h(s.order.id)}</strong> · ${badge(s.order.delivery)}</p><p>Only the assigned rider can update this delivery.</p>${actions(next + link('Navigation', 'rider/navigation') + link('Report a problem', 'rider/failure'))}`);
}
function riderBrief(s) {
  const destination = s.customer.addresses.find(a => a.id === s.order.addressId)?.line || 'Demo delivery address';
  const due = s.order.method === 'cod' ? s.order.total : 0;
  return panel('Current delivery', `<p><strong>Order ${h(s.order.id)}</strong> · ${badge(s.order.delivery)}</p><p><strong>Destination</strong><br>${h(destination)}</p><p><strong>Cash to collect</strong><br>${money(due)}${due ? ' · collect only what the recipient pays' : ' · prepaid order'}</p>`);
}
function reviewEvidence(ctx) {
  const s = ctx.state;
  const unavailable = has(ctx, 'prescription-missing') || !s.rx.uploaded;
  return `<div class="grid two">${panel('Synthetic prescription preview', unavailable ? empty('No prescription evidence', 'Ask the customer to upload a synthetic document. P lines remain held.') : `<div class="placeholder" style="min-height:180px;font-size:${ops(s).zoom ? '1.3em' : '1em'}"><strong>DEMO DOCUMENT — NOT A PRESCRIPTION</strong><p>Patient reference: ${h(s.rx.patientId || s.order.patientId)}</p><p>Document: ${h(s.rx.fileName || 'sample-rx.pdf')}</p><p>${has(ctx, 'unreadable') ? 'Image intentionally blurred / unreadable. Request clearer evidence.' : 'Synthetic evidence for exact product and quantity comparison. No medical advice or automatic approval.'}</p></div>${button(ops(s).zoom ? 'Reset zoom' : 'Zoom synthetic evidence', 'pharmacy.zoom')}`)}${panel('Current accepted order', `<p>Patient ${h(s.order.patientId)} · Revision ${h(s.order.revision)}</p>${rows(s)}<p>M/O lines do not receive clinical decisions. Approval only concerns exact P lines.</p>`)}</div>`;
}

export const screens = [
  screen('PHM', 1, 'pharmacy/queue', 'Prescription review queue', 'pharmacy', 'Pharmacist_Review', ['PHM-01'], 'Scoped oldest-first review queue with waiting state and correction route.', ['prescription-missing', 'unreadable'], ctx => {
    const s = ctx.state;
    return panel('Oldest waiting first', form('pharmacy.filter', select('Review status', 'filter', [['all', 'All'], ['Pending', 'Pending'], ['Partial', 'Partial'], ['Rejected', 'Rejected'], ['Approved', 'Approved']], ops(s).reviewFilter || 'all'), 'Apply filter') + ((has(ctx, 'empty') || (ops(s).reviewFilter && ops(s).reviewFilter !== 'all' && ops(s).reviewFilter !== s.order.review)) ? empty('No matching review tasks', 'Change the filter or refresh the queue.') : table(['Order', 'Patient reference', 'Waiting', 'Review', 'Action'], [[h(s.order.id), h(s.order.patientId), '12 min (synthetic)', badge(s.order.review), link('Open review', 'pharmacy/review')]]))) + policy('Clinical decisions are demonstrated by an authorized reviewer persona.', 'D-006 / D-013');
  }),
  screen('PHM', 2, 'pharmacy/review', 'Compare prescription and order', 'pharmacy', 'Pharmacist_Review', ['PHM-02', 'PHM-04'], 'Side-by-side synthetic evidence, patient, exact P lines and alternative-review limitation.', ['prescription-missing', 'unreadable', 'prescription-rejected'], ctx => summary(ctx.state) + reviewEvidence(ctx) + panel('Request corrected evidence', form('pharmacy.correction', meta(ctx) + field('Correction needed (synthetic details only)', 'reason', has(ctx, 'unreadable') ? 'Please replace the unreadable synthetic prescription.' : has(ctx, 'prescription-missing') ? 'Please upload evidence for the selected patient.' : ''), 'Request customer correction')) + policy('Substitution is blocked until an exact alternative and its approved policy are available. A similar name or composition is insufficient.', 'D-006 / D-010') + actions(link('Record line decisions', 'pharmacy/decision') + link('Decision history', 'pharmacy/history'))),
  screen('PHM', 3, 'pharmacy/decision', 'Record pharmacist decisions', 'pharmacy', 'Pharmacist_Review', ['PHM-03', 'PHM-04', 'PHM-05'], 'Explicit exact-line approval/rejection with reviewer identity, version and customer acceptance gate.', ['prescription-missing', 'unreadable', 'prescription-rejected', 'prescription-partial'], ctx => {
    const s = ctx.state;
    return reviewEvidence(ctx) + panel('Decision form', pLines(s).length ? form('pharmacy.decide', meta(ctx) + field('Reviewer display name (demo)', 'reviewer', 'A. Reviewer') + field('Registration reference (synthetic)', 'registration', 'DEMO-REG-001') + pLines(s).map(i => `<fieldset><legend>${h(product(s, i.productId).name)} · ${h(i.qty)} units</legend>${select('Line outcome', `decision_${i.productId}`, [['Approved', 'Approve exact line'], ['Rejected', 'Reject / request correction']], has(ctx, 'prescription-rejected') ? 'Rejected' : 'Approved')}${field('Reason / correction required', `reason_${i.productId}`, has(ctx, 'prescription-rejected') ? 'Patient evidence does not match this line.' : '')}</fieldset>`).join('') + check('I checked the exact patient, current evidence, SKU, strength, form and quantity.', 'checked'), 'Save review decision') : empty('No P lines require clinical review', 'M/O-only orders bypass this review gate.')) + policy('This form records a synthetic reviewer choice; it does not validate a real prescription.', 'D-006 / D-010 / D-013');
  }),
  screen('PHM', 4, 'pharmacy/history', 'Pharmacist decision history', 'pharmacy', 'Pharmacist_Review', ['PHM-05'], 'Decision identity, registration, timestamp, line outcomes and revision binding.', [], ctx => {
    const s = ctx.state;
    return summary(s) + panel('Recorded decisions', (ops(s).reviewHistory || []).length ? table(['Time', 'Reviewer / registration', 'Revision', 'Decision', 'Exact lines / reason'], ops(s).reviewHistory.map(r => [h(r.time), `${h(r.reviewer)} / ${h(r.registration)}`, h(r.revision), badge(r.outcome), h(r.lines.map(l => `${l.productId} × ${l.qty}: ${l.decision}; ${l.reason || 'Exact line reviewed'}`).join(' | '))])) : empty('No saved reviewer decisions', 'Open the decision form to record a synthetic review.', link('Review order', 'pharmacy/decision'))) + actions(link('Review queue', 'pharmacy/queue') + link('Customer review outcome', 'customer/prescription-status'));
  }),
  screen('STO', 1, 'store/queue', 'My store incoming orders', 'store', 'Store_Operations', ['STO-01', 'STO-02'], 'Location-scoped incoming orders, alert fallback and explicit acceptance.', ['out-of-stock', 'stale-stock'], ctx => {
    const s = ctx.state;
    return summary(s) + panel(`Queue for ${currentSite(s)}`, has(ctx, 'empty') ? empty('No incoming orders', 'Refresh when an order is allocated to this store.') : table(['Order', 'Preparation', 'Alert', 'Work'], [[h(s.order.id), badge(s.order.pack), has(ctx, 'network') ? 'Alert unavailable; queue remains authoritative' : 'New order alert (visual demo)', actions(button('Accept order', 'store.accept') + link('Open pick list', 'store/pick'))]])) + actions(button('Test visual alert', 'store.alert') + link('Stock and replenishment', 'store/replenishment')) + policy('No browser sound or dispensing authorization is inferred from an alert.', 'D-006 / D-009 / STO-01 device decision');
  }),
  screen('STO', 2, 'store/pick', 'Exact batch pick list', 'store', 'Store_Operations', ['STO-02'], 'Pick exact product, eligible batch and quantity; shortages block packing.', ['stock-expired', 'out-of-stock', 'stale-stock', 'prescription-rejected'], ctx => {
    const s = ctx.state;
    return summary(s) + gates(ctx) + panel('Scan synthetic batch references', form('store.pick', meta(ctx) + s.order.items.map(i => {
      const lots = s.inventory.filter(l => l.productId === i.productId && l.site === s.order.site);
      return `<fieldset><legend>${h(product(s, i.productId).name)} · Required ${h(i.qty)}</legend>${select('Exact batch', `lot_${i.productId}`, [['', 'Select batch'], ...lots.map(l => [l.id, `${l.batch} · exp ${l.expiry} · available ${l.qty}${eligible(l) ? '' : ' · BLOCKED'}`])], s.order.pickLines?.find(p => p.productId === i.productId)?.inventoryId || '')}${field('Quantity physically picked', `qty_${i.productId}`, i.qty, 'number', 'min="0" step="1"')}</fieldset>`;
    }).join(''), 'Confirm exact pick')) + actions(link('Pack checklist', 'store/pack') + link('Report stock issue', 'staff/order-detail'));
  }),
  screen('STO', 3, 'store/pack', 'Packing and custody handoff', 'store', 'Store_Operations', ['STO-02'], 'Recheck all fulfillment gates, record package evidence and transfer to assigned rider.', ['stock-expired', 'stale-stock', 'prescription-rejected', 'prescription-partial', 'rider-unavailable'], ctx => summary(ctx.state) + gates(ctx) + panel('Pack checklist', form('store.pack', meta(ctx) + field('Synthetic package reference', 'packageRef', ctx.state.order.packageRef || 'PKG-DEMO-001') + check('Picked quantities match the current accepted basket.', 'contents') + check('Seal and storage requirements checked using demo SOP.', 'sealed'), 'Mark packed')) + panel('Handoff to assigned rider', `<p>Current rider: ${h(ctx.state.order.riderId || 'None assigned')} · Delivery ${badge(ctx.state.order.delivery)}</p>${form('store.handoff', meta(ctx) + check('Assigned rider and exact sealed parcel verified.', 'verified'), 'Confirm custody handoff')}`) + actions(link('Assign a rider', 'delivery/assignment') + link('Store queue', 'store/queue'))),
  screen('STO', 4, 'store/replenishment', 'Store stock and replenishment', 'store', 'Store_Operations', ['STO-03', 'STO-05'], 'Batch stock, low-quantity visibility and idempotent normal/urgent replenishment request.', ['stock-expired', 'out-of-stock', 'stale-stock'], ctx => {
    const s = ctx.state;
    return panel('My site stock', lotTable(stockRows(s, currentSite(s)))) + notice('Near-expiry/low-stock numeric thresholds await Operations approval. Dates and quantities are visible without inventing an alert threshold.', 'info') + panel('Request replenishment', form('store.request', select('Product', 'productId', s.products.filter(p => p.approved).map(p => [p.id, p.name]), s.warehouse.requestProductId || 'PRD-1') + field('Packs requested', 'qty', s.warehouse.requestedQty || 10, 'number', 'min="1" step="1"') + select('Priority', 'priority', [['Normal', 'Normal'], ['Urgent', 'Urgent — capacity approval required']]) + field('Request reference (reuse for retries)', 'intent', 'REQ-DEMO-001') + field('Reason', 'reason', 'Replenish store shelf'), 'Submit replenishment request')) + actions(link('Receive transfer', 'store/receipt') + link('Warehouse request queue', 'warehouse/replenishment'));
  }),
  screen('STO', 5, 'store/receipt', 'Receive warehouse transfer', 'store', 'Store_Operations', ['STO-04'], 'Count actual accepted stock, preserve shortage evidence and credit once.', ['short-receipt', 'stock-expired'], ctx => {
    const w = ctx.state.warehouse;
    return panel('Transfer note', `<p>Status ${badge(w.transferStatus)} · Dispatched ${h(w.dispatchedQty || 0)} · Accepted ${h(w.receivedTransferQty || 0)} · Shortage ${h(w.shortage || 0)}</p><p>Batch ${h(w.transferBatch || 'Not dispatched')} · In-transit stock is not saleable store stock.</p>`) + panel('Actual receipt', form('store.receive', field('Transfer reference', 'transferRef', w.transferKey || 'TRF-DEMO-001') + field('Actual accepted packs', 'qty', has(ctx, 'short-receipt') ? Math.max(0, (w.dispatchedQty || 10) - 2) : w.dispatchedQty || 0, 'number', 'min="0" step="1"') + field('Shortage / damage reason', 'reason', has(ctx, 'short-receipt') ? 'Two packs missing in transit; investigate.' : '') + check('Exact batch, expiry and condition checked.', 'quality'), 'Confirm receipt once')) + actions(link('Store stock', 'store/replenishment') + link('Warehouse dispatch note', 'warehouse/dispatch'));
  }),
  screen('WH', 1, 'warehouse/receiving', 'Supplier receiving', 'warehouse', 'Warehouse', ['WH-01'], 'Capture supplier invoice, batch dates, accepted quantity and quality evidence with replay protection.', ['short-receipt', 'stock-expired'], ctx => {
    const s = ctx.state,activePo=(s.procurement?.purchaseOrders||[]).find(p=>p.id===s.warehouse.activePurchaseOrder&&p.status==='Approved — local simulation');
    return panel('Supplier receipt', form('warehouse.receive', select('Approved purchase order (optional standalone receipt allowed)', 'purchaseOrderRef', [['', 'Standalone documented receipt'], ...(activePo?[[activePo.id,`${activePo.id} · ${activePo.supplierId} · ${activePo.quantity} packs`]]:[])], activePo?.id||'') + field('Receipt reference (reuse for retry)', 'receiptRef', activePo?`GRN-${activePo.id}`:'GRN-DEMO-001') + field('Supplier invoice reference', 'invoice', 'INV-SUP-DEMO-001') + select('Product', 'productId', s.products.filter(p => p.approved).map(p => [p.id, p.name]), activePo?.productId||'PRD-1') + field('Exact batch', 'batch', 'BATCH-SUP-DEMO') + field('Manufactured date', 'manufactured', '2026-06-01', 'date') + field('Expiry date', 'expiry', has(ctx, 'stock-expired') ? '2026-09-01' : '2028-06-01', 'date') + field('Invoiced packs', 'expected', activePo?.quantity||20, 'number', 'min="1" step="1"') + field('Actual accepted packs', 'qty', has(ctx, 'short-receipt') ? Math.max(0,(activePo?.quantity||20)-2) : activePo?.quantity||20, 'number', 'min="0" step="1"') + field('Discrepancy note', 'reason', has(ctx, 'short-receipt') ? 'Two damaged packs segregated.' : '') + check('Quality, dates and invoice checked; only usable goods accepted.', 'quality'), 'Record supplier receipt')) + panel('Last receipt result', `<p>${badge(s.warehouse.receiptStatus)} · Accepted ${h(s.warehouse.receivedQty || 0)}</p>${activePo?`<p>Linked purchase order: ${h(activePo.id)} · ${activePo.quantity} expected packs · approval ${h(activePo.approvedBy)}</p>`:''}`) + policy('Accepted synthetic stock uses one local receipt movement. Real quality/expiry eligibility and procurement approval authority need owner validation.', 'D-002 / D-009');
  }),
  screen('WH', 2, 'warehouse/replenishment', 'Replenishment and urgent-run queue', 'warehouse', 'Warehouse', ['WH-02', 'WH-03'], 'Review store request and capacity exception without inventing approved run limits.', [], ctx => {
    const s = ctx.state, w = s.warehouse;
    return panel('Store replenishment request', w.requestedQty ? table(['Request', 'Product', 'Quantity', 'Priority', 'State'], [[h(w.requestKey || 'Demo request'), h(product(s, w.requestProductId || 'PRD-1').name), h(w.requestedQty), h(w.priority || 'Normal'), badge(w.transferStatus)]]) : empty('No replenishment request', 'A store first submits its actual requested quantity.', link('Store request form', 'store/replenishment'))) + actions(button('Approve request', 'warehouse.approve') + link('Dispatch exact batch', 'warehouse/dispatch')) + panel('Urgent-run capacity exception', form('warehouse.urgent', field('Proposed run / capacity reason', 'reason', '') + field('Requested additional run number', 'run', 1, 'number', 'min="1" step="1"'), 'Request Operations approval')) + policy('The inherited two-extra-runs wording is draft. This prototype submits a scheduling exception and does not approve capacity automatically.', 'D-002');
  }),
  screen('WH', 3, 'warehouse/dispatch', 'Warehouse transfer dispatch', 'warehouse', 'Warehouse', ['WH-02', 'WH-03'], 'Pick an eligible source batch, deduct source once and preserve in-transit destination stock.', ['stock-expired', 'out-of-stock'], ctx => {
    const s = ctx.state, w = s.warehouse;
    const lots = stockRows(s, warehouseSite(s)).filter(i => i.productId === (w.requestProductId || 'PRD-1'));
    return panel('Source lots', lotTable(lots)) + panel('Dispatch note', form('warehouse.dispatch', field('Transfer reference (reuse for retries)', 'transferRef', w.transferKey || 'TRF-DEMO-001') + select('Source batch', 'inventoryId', [['', 'Select eligible source batch'], ...lots.map(i => [i.id, `${i.batch} · available ${i.qty}`])]) + field('Actual packs dispatched', 'qty', w.requestedQty || 10, 'number', 'min="1" step="1"') + field('Dispatch note', 'note', 'Sealed replenishment transfer') + field('Destination site', 'destination', w.destination || s.order.site), 'Dispatch as in transit')) + panel('Transfer progress', `<p>${badge(w.transferStatus)} · Dispatched ${h(w.dispatchedQty || 0)} · Received ${h(w.receivedTransferQty || 0)}</p>`) + link('Destination receipt', 'store/receipt');
  }),
  screen('WH', 4, 'warehouse/audit', 'Warehouse counts and fallback orders', 'warehouse', 'Warehouse', ['WH-04', 'WH-05'], 'Count evidence without overwriting inventory and explicitly block unapproved fallback dispensing.', ['stock-expired', 'stale-stock'], ctx => {
    const s = ctx.state;
    return panel('Warehouse lot ledger', lotTable(stockRows(s, warehouseSite(s)))) + panel('Count discrepancy evidence', form('warehouse.count', select('Batch counted', 'inventoryId', stockRows(s, warehouseSite(s)).map(i => [i.id, `${i.batch} · ledger ${i.qty}`])) + field('Physical count', 'qty', 0, 'number', 'min="0" step="1"') + field('Count reason / evidence reference', 'reason', ''), 'Submit count for Inventory review')) + panel('Recorded count requests', timeline((Array.isArray(s.warehouse.audit) ? s.warehouse.audit : []).map(x => typeof x === 'string' ? x : `${x.batch}: counted ${x.qty}; ledger ${x.ledger}; ${x.reason}`))) + panel('Fallback online order', summary(s) + policy('Stock alone does not authorize warehouse dispensing. Fallback is blocked until the licensed site and fulfillment scope are approved.', 'D-002 / D-006 / D-010') + button('Request fallback eligibility review', 'warehouse.fallback'));
  }),
  screen('DLV', 1, 'delivery/dashboard', 'Delivery dispatch dashboard', 'delivery', 'Delivery_Operations', ['DLV-01', 'DLV-04'], 'Ready parcels, synthetic rider positions, offline telemetry and separate COD handover view.', ['offline', 'rider-unavailable', 'cod-shortage'], ctx => {
    const s = ctx.state;
    return panel('Synthetic dispatch map', '<div class="placeholder" style="min-height:180px"><strong>LOCAL MAP PLACEHOLDER</strong><p>Store A ─── route corridor ─── demo delivery zone</p><p>No real map, GPS, addresses or provider connection.</p></div>') + panel('Rider availability', table(['Rider', 'Site', 'Shift / availability', 'Location update'], s.riders.map(r => [h(r.name), h(r.site), badge(has(ctx, 'rider-unavailable') ? 'Unavailable scenario' : r.status), has(ctx, 'offline') ? 'Offline; last synthetic update 10 min ago' : 'Synthetic last-known position; never delivery proof']))) + summary(s) + actions(link('Assign ready parcel', 'delivery/assignment') + link('Failed deliveries', 'delivery/failures') + link('Manage riders / COD', 'delivery/riders'));
  }),
  screen('DLV', 2, 'delivery/assignment', 'Confirm rider assignment', 'delivery', 'Delivery_Operations', ['DLV-02', 'DLV-05'], 'Suggested eligible rider with explicit confirmation and assignment-version guard.', ['rider-unavailable'], ctx => {
    const s = ctx.state;
    return summary(s) + gates(ctx) + panel('Assignment confirmation', form('delivery.assign', meta(ctx) + select('Rider (distance is illustrative, not a live recommendation)', 'riderId', [['', 'Choose eligible rider'], ...s.riders.map((r, i) => [r.id, `${r.name} · ${r.status} · ${r.site}${i === 0 ? ' · demo suggestion' : ''}`])], s.order.riderId || '') + field('Assignment / reassignment reason', 'reason', 'Ready parcel assignment'), 'Confirm current assignment')) + notice('Assignment does not mark pickup. Current rider must accept and store must verify custody. Competing/stale assignments require refresh.') + link('Rider task view', 'rider/tasks');
  }),
  screen('DLV', 3, 'delivery/failures', 'Failed delivery resolution', 'delivery', 'Delivery_Operations', ['DLV-03'], 'Reasoned reattempt, reschedule or return while preserving custody and cash facts.', ['delivery-failed'], ctx => {
    const s = ctx.state;
    return summary(s) + panel('Failed attempt', `<p>Reason: ${h(s.order.failureReason || (has(ctx, 'delivery-failed') ? 'Customer unavailable (scenario)' : 'No recorded failure'))}</p><p>Custody remains with rider ${h(s.order.riderId || 'not assigned')} until an evidenced handover.</p>` + form('delivery.resolve', meta(ctx) + select('Resolution', 'resolution', [['reattempt', 'Reattempt with current eligible rider'], ['reschedule', 'Reschedule — customer/support coordination'], ['return', 'Return sealed parcel to store']]) + field('Planned date/time (required for reschedule)', 'when', '', 'datetime-local') + field('Dispatch reason', 'reason', ''), 'Record resolution')) + notice('Return-to-store does not credit saleable stock or clear COD. Inventory and Finance review independently.', 'warning') + link('Rider failure record', 'rider/failure');
  }),
  screen('DLV', 4, 'delivery/riders', 'Rider management and COD handover', 'delivery', 'Delivery_Operations', ['DLV-04', 'DLV-05'], 'Location-bound onboarding/shift edits and unresolved collected-vs-deposited cash differences.', ['rider-unavailable', 'cod-shortage'], ctx => {
    const s = ctx.state;
    return panel('Rider roster', table(['Rider', 'Site', 'Status'], s.riders.map(r => [h(r.name), h(r.site), badge(r.status)]))) + panel('Update approved demo shift', form('delivery.rider', select('Rider', 'riderId', s.riders.map(r => [r.id, r.name])) + field('Assigned site', 'site', s.order.site) + select('Availability', 'status', [['Available', 'On duty / available'], ['Break', 'Break'], ['Off duty', 'Off duty'], ['Inactive', 'Deactivate access']]), 'Save rider availability')) + panel('Synthetic rider onboarding', form('delivery.onboard', field('Rider display name', 'name', '') + field('Assigned site', 'site', s.order.site) + check('Operations has reviewed this synthetic onboarding record.', 'approved'), 'Add demo rider')) + panel('COD handover evidence', `<p>Collected ${money(s.order.codCollected || 0)} · Deposited ${money(s.finance.deposit || 0)} · Difference ${money(Math.max(0, (s.order.codCollected || 0) - (s.finance.deposit || 0)))}</p>${form('delivery.deposit', field('Actual cash handed over', 'amount', has(ctx, 'cod-shortage') ? Math.max(0, (s.order.codCollected || 0) - 10) : s.order.codCollected || 0, 'number', 'min="0" step="0.01"') + field('Handover reference', 'reference', 'COD-DEMO-001') + field('Difference explanation', 'reason', has(ctx, 'cod-shortage') ? 'Short cash under investigation.' : ''), 'Record handover evidence')}`) + policy('Recording a cash fact does not invent settlement or incentive rules.', 'D-007');
  }),
  screen('RID', 1, 'rider/login', 'Rider OTP sign in', 'rider', 'Rider_App', ['RID-01'], 'Synthetic OTP login with rider identity and revoked-access gate.', ['otp-wrong'], ctx => panel('Rider sign in', notice('Synthetic OTP is 246810. No SMS is sent.') + form('rider.login', select('Synthetic rider identity', 'riderId', ctx.state.riders.map(r => [r.id, `${r.name} · ${r.status}`]), ctx.state.riderId || '') + field('Demo OTP', 'otp', '', 'text', 'inputmode="numeric" autocomplete="off"'), 'Verify rider login')) + link('Duty and assigned tasks', 'rider/tasks')),
  screen('RID', 2, 'rider/tasks', 'Duty and assigned tasks', 'rider', 'Rider_App', ['RID-01', 'RID-02'], 'Explicit availability and only current-rider tasks with accept/reject action.', ['rider-unavailable'], ctx => {
    const s = ctx.state;
    const mine = s.riderSession && s.order.riderId === s.riderId;
    const returnMine=(s.returnCases||[]).some(c=>c.pickup?.riderId===s.riderId&&['Assigned','Picked up'].includes(c.pickup.status));return panel('My duty', `<p>Session ${badge(s.riderSession ? 'Signed in' : 'Sign in required')} · Duty ${badge(s.duty || 'Off duty')} · Rider ${h(s.riderId || 'None')}</p>${form('rider.duty', select('Duty status', 'duty', [['On duty', 'On duty'], ['Break', 'Break'], ['Off duty', 'Off duty']], s.duty || 'Off duty'), 'Update duty')}`) + (mine ? taskCard(ctx) + (s.order.delivery==='Assigned'?actions(button('Accept assigned task', 'rider.accept') + button('Decline before pickup', 'rider.decline')):'') : empty('No customer deliveries for this rider', 'Dispatch must assign this rider. Other riders’ delivery details stay hidden.', link('Sign in', 'rider/login'))) + (returnMine?link('Open reverse pickup','rider/returns'): '') + actions(link('My history and earnings', 'rider/history')+button('Sign out','rider.signout'));
  }),
  screen('RID', 3, 'rider/pickup', 'Rider pickup checklist', 'rider', 'Rider_App', ['RID-02'], 'Current assignment, ready package and store handoff must precede rider custody.', ['stock-expired', 'stale-stock'], ctx => riderBrief(ctx.state) + panel('Pickup verification', form('rider.pickup', meta(ctx) + field('Sealed package reference', 'packageRef', ctx.state.order.packageRef || '') + check('Store has handed over this exact parcel to me.', 'verified'), 'Confirm picked up')) + notice('Marking pickup is allowed only after assigned-task acceptance and store custody handoff.') + link('Open synthetic navigation', 'rider/navigation')),
  screen('RID', 4, 'rider/navigation', 'Navigation and last-known location', 'rider', 'Rider_App', ['RID-02', 'RID-03'], 'Privacy-aware synthetic navigation, explicit offline freshness and no live tracking claim.', ['offline'], ctx => panel('Delivery navigation', '<div class="placeholder" style="min-height:220px"><strong>DEMO ROUTE</strong><p>Pickup point → demo road → customer delivery zone</p><p>No real GPS permission or external map connection.</p></div>' + notice(has(ctx, 'offline') ? 'Offline: location and completion acknowledgments are pending. Last synthetic point is stale.' : 'Synthetic last-known location. This is not a live position.') + form('rider.location', check('I consent to synthetic task-only location demonstration.', 'consent'), 'Record synthetic location update')) + policy('Actual background collection, retention and cadence are blocked pending Privacy and Operations approval.', 'D-011 / D-021') + actions(link('Doorstep completion', 'rider/completion') + link('Record failed attempt', 'rider/failure'))),
  screen('RID', 5, 'rider/completion', 'Doorstep proof and completion', 'rider', 'Rider_App', ['RID-04', 'RID-05'], 'Validate current assignment, synthetic OTP/proof and actual COD; offline state stays unconfirmed.', ['otp-wrong', 'offline', 'cod-shortage'], ctx => {
    const s = ctx.state;
    return riderBrief(s) + panel('Confirm delivery', notice('Demo OTP: 135790. Proof is simulated; no photo is captured.') + form('rider.complete', meta(ctx) + field('Customer delivery code', 'otp', has(ctx, 'otp-wrong') ? '000000' : '', 'text', 'inputmode="numeric" autocomplete="off"') + select('Delivery proof', 'proof', [['', 'Select synthetic proof'], ['DEMO-PHOTO-001', 'Parcel handed to recipient']]) + field('Cash received', 'cod', s.order.method === 'cod' ? (has(ctx, 'cod-shortage') ? Math.max(0, s.order.total - 10) : s.order.total) : 0, 'number', 'min="0" step="0.01"') + check('I handed the sealed parcel to the verified recipient.', 'recipient'), has(ctx, 'offline') ? 'Save until connection returns' : 'Verify and complete delivery')) + (ops(s).offlinePending ? panel('Waiting for connection', `<p>The delivery is not marked complete yet. Reconnection checks the current rider, code and proof.</p>${button('Reconnect and validate', 'rider.replay')}`) : '') + policy('Prescription doorstep checks cannot replace pharmacist review. Clinical checking at the door is blocked until the approved SOP exists.', 'D-006 / D-011 / RID-05');
  }),
  screen('RID', 6, 'rider/failure', 'Failed attempt and rider history', 'rider', 'Rider_App', ['RID-06', 'RID-07'], 'Approved illustrative reason selection, accountable custody and a clear blocked incentive calculation.', ['delivery-failed'], ctx => (ctx.state.order.delivery==='Failed'?panel('We couldn’t complete this delivery',`<p>${h(ctx.state.order.failureReason)}</p><p>The parcel remains with the rider. Dispatch will arrange the next permitted step; no delivery or cash completion has been recorded.</p>`):'') + panel('Record actual failed attempt', form('rider.fail', meta(ctx) + select('Fixed demo reason list', 'reason', [['', 'Choose reason'], ['Customer unavailable', 'Customer unavailable'], ['Customer refused', 'Customer refused'], ['Address not found', 'Address not found'], ['Unable to verify recipient', 'Unable to verify recipient']]) + field('Dispatch note (avoid sensitive personal details)', 'note', ''), 'Record failed attempt')) + panel('My delivery history', timeline((ops(ctx.state).riderHistory || []).filter(x => x.riderId === ctx.state.riderId).map(x => `${x.time}: ${x.orderId} — ${x.outcome}`))) + notice('Earnings unavailable: Product/Finance must approve the incentive formula and version. No amount is invented.', 'warning') + actions(link('Dispatch resolution', 'delivery/failures') + link('Daily history', 'rider/history'))),
  screen('RID', 7, 'rider/history', 'Daily deliveries and earnings status', 'rider', 'Rider_App', ['RID-07', 'RID-04'], 'Scoped daily completed/failed history; incentive calculation visibly awaits policy.', [], ctx => {
    const mine = (ops(ctx.state).riderHistory || []).filter(x => x.riderId === ctx.state.riderId);
    return panel('My daily delivery outcomes', mine.length ? table(['Time', 'Order', 'Outcome'], mine.map(x => [h(x.time), h(x.orderId), badge(x.outcome)])) : empty('No recorded outcomes today', 'Only outcomes for the signed-in synthetic rider appear here.')) + panel('Incentive and cash', `<p>Completed deliveries today: ${h(mine.filter(x => x.outcome === 'Delivered').length)}</p><p>Incentive: ${badge('Calculation blocked — formula pending')}</p><p>COD collection is cash custody, not earnings. View the Finance-approved settlement separately.</p>`) + link('My duty and tasks', 'rider/tasks');
  })
];

function reject(ctx, message) { ctx.notice(message, 'error'); return true; }
function save(ctx, message, kind = 'success') { ctx.record(message); ctx.save(message, kind); return true; }
function isStaffRole(ctx, workspace) {
  const role = String(ctx.state.role || '').toLowerCase();
  return (role.includes('admin') && workspace !== 'pharmacy') || role.includes(workspace) || (workspace === 'pharmacy' && (role.includes('pharmacist') || role === 'staff_pharmacist')) || (workspace === 'delivery' && (role.includes('dispatch') || role.includes('operations')));
}
function staffGuard(ctx, workspace) {
  if (!isStaffRole(ctx, workspace)) return 'This action requires the scoped ' + workspace + ' staff role. Switch the reviewer role and retry.';
  if (['store', 'pharmacy', 'delivery'].includes(workspace) && currentSite(ctx.state) !== ctx.state.order.site) return 'Location denied: this order belongs to a different site.';
  if (workspace === 'warehouse' && currentSite(ctx.state) !== warehouseSite(ctx.state)) return 'Location denied: this action requires the assigned warehouse site.';
  return '';
}
function riderGuard(ctx, requireTask = true) {
  const s = ctx.state;
  const r = s.riders.find(x => x.id === s.riderId);
  if (!String(s.role || '').toLowerCase().includes('rider')) return 'Switch to the Rider demo role for rider actions.';
  if (!s.riderSession || !r || r.status === 'Inactive') return 'Rider session missing or revoked. Sign in again.';
  if (requireTask && s.order.riderId !== s.riderId) return 'This parcel is not assigned to the signed-in rider. Refresh or contact Dispatch.';
  if (requireTask && r.site !== s.order.site) return 'Rider location no longer matches the current assignment. Contact Dispatch.';
  return '';
}
function versionGuard(data, ctx, assignment = false) {
  if (data.revision != null && Number(data.revision) !== Number(ctx.state.order.revision)) return 'This order has changed. Refresh the page to see the latest details before trying again.';
  if (assignment && data.assignmentVersion != null && Number(data.assignmentVersion) !== Number(ctx.state.order.assignmentVersion || 0)) return 'This delivery assignment has changed. Refresh the page for the latest details or contact Dispatch.';
  return '';
}
function outcome(ctx, text) { ctx.state.order.history ||= []; ctx.state.order.history.push(text); }
function refreshIndicativeStock(s, productId) {
  const p = s.products.find(x => x.id === productId);
  if (p) p.stock = s.inventory.filter(i => i.productId === productId && i.site === 'Demo Store 01' && i.eligible && i.expiry > TODAY).reduce((sum, i) => sum + Number(i.qty), 0);
}
function movement(s, id, lot, qty, reason) {
  s.inventoryMovements ||= [];
  if (!s.inventoryMovements.some(m => m.id === id)) s.inventoryMovements.push({ id, batch: lot.batch, qty, reason });
}
function complete(data, ctx, replay = false) {
  const s = ctx.state, o = s.order;
  let problem = riderGuard(ctx) || versionGuard(data, ctx, true);
  if (problem) return reject(ctx, problem);
  if (o.delivery === 'Delivered') return reject(ctx, 'This delivery is already completed. Duplicate proof cannot collect COD twice.');
  if (!['Picked up', 'Out for delivery'].includes(o.delivery)) return reject(ctx, 'Confirm current parcel pickup before delivery completion.');
  if (String(data.otp) !== String(s.demoDeliveryOtp || '135790') || (!replay && has(ctx, 'otp-wrong'))) return reject(ctx, 'Incorrect or expired demo OTP. Delivery stays incomplete; retry valid proof or contact Dispatch.');
  if (data.proof !== 'DEMO-PHOTO-001' || !data.recipient) return reject(ctx, 'Select the synthetic proof and confirm recipient handover. No real photo is needed.');
  const cod = Number(data.cod);
  if (!Number.isFinite(cod) || cod < 0) return reject(ctx, 'Enter a valid nonnegative actual COD amount.');
  if (o.method === 'cod' && cod !== Number(o.total)) return reject(ctx, 'COD shortage or overage remains unresolved. Delivery stays incomplete; contact Dispatch/Finance.');
  if (o.method !== 'cod' && cod !== 0) return reject(ctx, 'This order is prepaid. Record zero COD; do not invent a collection.');
  if (!replay && has(ctx, 'offline')) {
    s.ops.offlinePending = { ...data, riderId: s.riderId, orderId: o.id, queuedAt: new Date().toISOString(), assignmentVersion: o.assignmentVersion || 0, revision: o.revision };
    return save(ctx, 'Offline proof queued locally; delivery and COD remain unconfirmed.', 'warning');
  }
  o.delivery = 'Delivered'; o.status = 'Delivered'; o.codCollected = o.method === 'cod' ? cod : 0;
  // Store only synthetic proof metadata. Never retain an OTP in history/audit.
  o.deliveryProof = { proof: data.proof, riderId: s.riderId, time: new Date().toISOString(), assignmentVersion: o.assignmentVersion || 0 };
  s.ops.offlinePending = null;
  s.ops.riderHistory ||= []; s.ops.riderHistory.push({ time: new Date().toISOString(), orderId: o.id, riderId: s.riderId, outcome: 'Delivered' });
  const r = s.riders.find(x => x.id === s.riderId); if (r) r.status = 'Available';
  outcome(ctx, 'Delivery proof verified for current assignment; delivery completed. COD remains a separate cash fact.');
  return save(ctx, 'Delivery completed once with synthetic proof. Cash settlement remains separate.');
}

export function handle(action, data, ctx) {
  if (!/^(pharmacy|store|warehouse|delivery|rider)\./.test(action)) return false;
  const s = ctx.state, o = s.order, w = s.warehouse;
  s.ops ||= {};
  if (!Array.isArray(w.audit)) w.audit = [];
  if (action === 'pharmacy.zoom') { s.ops.zoom = !s.ops.zoom; ctx.save('Synthetic evidence zoom changed.'); return true; }
  if (action === 'pharmacy.filter') { s.ops.reviewFilter = data.filter; ctx.save('Queue filter applied.'); return true; }
  if (action === 'store.alert') { ctx.notice('Visual alert: a committed incoming order remains in the queue even if sound fails.'); return true; }
  const workspace = action.split('.')[0];
  if (['session', 'permission', 'network', 'loading'].includes(ctx.scenario)) return reject(ctx, ({ session: 'Session expired. Re-select an authorized demo role before retrying.', permission: 'Permission denied for this scenario; no state changed.', network: 'Network unavailable. Outcome is not confirmed; refresh and retry the same intent.', loading: 'Please wait for loading to finish before submitting.' })[ctx.scenario]);
  if (has(ctx, 'validation') && !['rider.replay'].includes(action)) return reject(ctx, 'Validation scenario: check the highlighted form fields; no change was saved. Select Normal to submit valid data.');
  if (has(ctx, 'conflict')) return reject(ctx, 'Another actor changed this task. Stale command rejected; refresh current evidence before retrying.');
  if (workspace !== 'rider') { const denied = staffGuard(ctx, workspace); if (denied) return reject(ctx, denied); }
  if (workspace === 'rider' && action !== 'rider.login') { const denied = riderGuard(ctx, !['rider.duty','rider.signout'].includes(action)); if (denied) return reject(ctx, denied); }
  if (has(ctx, 'duplicate') && !['store.receive', 'warehouse.receive', 'warehouse.dispatch', 'store.request', 'rider.complete', 'delivery.deposit'].includes(action)) return reject(ctx, 'Duplicate command ignored; existing task outcome is retained.');
  switch (action) {
    case 'pharmacy.correction': {
      const stale = versionGuard(data, ctx); if (stale) return reject(ctx, stale);
      if (!pLines(s).length || !data.reason?.trim()) return reject(ctx, 'Give a correction reason for the current P-line evidence.');
      if (o.payment === 'Paid' || ['Packed', 'Handed over'].includes(o.pack) || o.delivery === 'Delivered') return reject(ctx, 'This order has progressed. Operations/Pharmacy must review the current fulfillment/payment exception before changing evidence.');
      s.rx.status = 'Correction requested'; o.review = 'Pending'; o.customerAccepted = false; o.status = 'Awaiting corrected evidence';
      if (o.stock === 'Active') { o.stock = 'Released'; o.hold = 'Released'; }
      s.ops.correctionReason = data.reason.trim();
      outcome(ctx, 'Pharmacy requested corrected synthetic evidence; P-line approval remains blocked.');
      return save(ctx, 'Correction request recorded. Customer can replace evidence; no clinical approval was created.', 'warning');
    }
    case 'pharmacy.decide': {
      const stale = versionGuard(data, ctx); if (stale) return reject(ctx, stale);
      if (!pLines(s).length) return reject(ctx, 'No P lines require a decision.');
      if (!s.rx.uploaded || has(ctx, 'prescription-missing')) return reject(ctx, 'Prescription missing. Request evidence before deciding.');
      if (has(ctx, 'unreadable')) return reject(ctx, 'Evidence is unreadable. Request a clearer synthetic document; approval is blocked.');
      if (s.rx.patientId && s.rx.patientId !== o.patientId) return reject(ctx, 'Patient mismatch. Customer must correct the patient/evidence selection.');
      if (!data.reviewer?.trim() || !data.registration?.trim() || !data.checked) return reject(ctx, 'Enter reviewer and registration references and confirm exact-line checks.');
      const lines = pLines(s).map(i => ({ ...i, decision: data[`decision_${i.productId}`], reason: String(data[`reason_${i.productId}`] || '').trim() }));
      if (lines.some(l => !['Approved', 'Rejected'].includes(l.decision) || (l.decision === 'Rejected' && !l.reason))) return reject(ctx, 'Choose a valid outcome for every P line and give a reason for each rejection.');
      if (has(ctx, 'prescription-rejected') && lines.every(l => l.decision === 'Approved')) return reject(ctx, 'Rejected-evidence scenario cannot be approved; record a correction reason.');
      if (has(ctx, 'prescription-partial') && !lines.some(l => l.decision === 'Rejected')) return reject(ctx, 'Partial scenario: reject an affected P line with a reason; eligible other lines remain available for a revised basket.');
      const approved = lines.filter(l => l.decision === 'Approved').length;
      const eligibleNonP = o.items.some(i => product(s, i.productId).class !== 'P');
      o.review = approved === lines.length ? 'Approved' : approved || eligibleNonP ? 'Partial' : 'Rejected';
      o.reviewLines = lines; o.reviewRevision = o.revision; o.reviewPatientId = o.patientId; o.approvedProductIds = lines.filter(l => l.decision === 'Approved').map(l => l.productId);
      o.customerAccepted = o.review === 'Approved'; s.rx.status = o.review;
      s.ops.reviewHistory ||= []; s.ops.reviewHistory.push({ time: new Date().toISOString(), reviewer: data.reviewer.trim(), registration: data.registration.trim(), revision: o.revision, outcome: o.review, lines });
      outcome(ctx, `Pharmacist recorded ${o.review} for current exact P lines. ${o.review === 'Partial' ? 'Customer revised-basket acceptance required.' : ''}`);
      return save(ctx, o.review === 'Partial' ? 'Partial decision recorded. Customer must accept an eligible revised basket before payment/packing.' : `Synthetic review ${o.review.toLowerCase()} recorded.`);
    }
    case 'store.accept':
      if (o.pack !== 'Not started') return reject(ctx, 'Order already accepted or processed; existing task retained.');
      if (['Cancelled', 'Delivered'].includes(o.status)) return reject(ctx, 'This order is closed.');
      o.pack = 'Accepted'; outcome(ctx, 'Store accepted order preparation.'); return save(ctx, 'Order accepted. Scan exact batches next.');
    case 'store.pick': {
      const stale = versionGuard(data, ctx); if (stale) return reject(ctx, stale);
      const problems = gateProblems(s, ctx); if (problems.length) return reject(ctx, problems.join(' '));
      if (!['Accepted', 'Picking', 'Picked'].includes(o.pack)) return reject(ctx, 'Accept this order before picking.');
      const picks = [];
      for (const item of o.items) {
        const lot = s.inventory.find(i => i.id === data[`lot_${item.productId}`]);
        if (!lot || lot.productId !== item.productId || lot.site !== o.site || !eligible(lot) || lot.qty < item.qty || Number(data[`qty_${item.productId}`]) !== Number(item.qty)) return reject(ctx, 'Wrong, expired, insufficient or mismatched batch/quantity. Packing blocked; Inventory must resolve the discrepancy.');
        picks.push({ productId: item.productId, inventoryId: lot.id, batch: lot.batch, qty: item.qty });
      }
      o.pickLines = picks; o.pack = 'Picked'; outcome(ctx, 'Exact eligible batches and actual quantities picked.'); return save(ctx, 'Exact pick saved. Complete the pack checklist.');
    }
    case 'store.pack': {
      const stale = versionGuard(data, ctx); if (stale) return reject(ctx, stale);
      const problems = gateProblems(s, ctx); if (problems.length) return reject(ctx, problems.join(' '));
      if (o.pack === 'Packed' || o.inventoryCommitted) return reject(ctx, 'Package already committed. Duplicate command cannot deduct stock twice.');
      if (o.pack !== 'Picked' || !o.pickLines?.length || !data.contents || !data.sealed || !data.packageRef?.trim()) return reject(ctx, 'Complete exact picking, package reference and both packing checks.');
      // Revalidate all rows before changing any quantity.
      for (const pick of o.pickLines) { const lot = s.inventory.find(i => i.id === pick.inventoryId); if (!lot || !eligible(lot) || lot.qty < pick.qty || lot.batch !== pick.batch) return reject(ctx, 'An exact picked lot changed. Stock remains uncommitted.'); }
      for (const pick of o.pickLines) {
        const lot = s.inventory.find(i => i.id === pick.inventoryId);
        lot.qty -= pick.qty;
        movement(s, `PACK-${o.id}-${o.revision}-${lot.id}`, lot, -pick.qty, 'Exact accepted parcel stock committed at packing');
        refreshIndicativeStock(s, pick.productId);
      }
      o.pack = 'Packed'; o.stock = 'Committed'; o.hold = 'Committed'; o.inventoryCommitted = true; o.packageRef = data.packageRef.trim(); o.status = 'Packed';
      outcome(ctx, 'Sealed parcel packed; exact held demo stock committed once.'); return save(ctx, 'Packed. Dispatch can confirm an eligible rider.');
    }
    case 'store.handoff': {
      const stale = versionGuard(data, ctx, true); if (stale) return reject(ctx, stale);
      const problems = gateProblems(s, ctx); if (problems.length) return reject(ctx, problems.join(' '));
      const rider = s.riders.find(r => r.id === o.riderId);
      if (has(ctx, 'rider-unavailable') || !rider || ['Inactive', 'Off duty', 'Break', 'Offline'].includes(rider.status) || rider.site !== o.site || o.delivery !== 'Accepted') return reject(ctx, 'Current eligible assigned rider must accept this parcel before handoff.');
      if (o.pack !== 'Packed' || !data.verified) return reject(ctx, 'Verify the sealed package and assigned rider before handoff.');
      o.pack = 'Handed over'; outcome(ctx, 'Store recorded custody handoff to current accepted rider.'); return save(ctx, 'Handoff recorded; rider can confirm pickup.');
    }
    case 'store.request': {
      const qty = Number(data.qty), p = product(s, data.productId);
      if (!data.intent?.trim() || !data.reason?.trim() || !Number.isInteger(qty) || qty <= 0 || !p.approved || !['Normal', 'Urgent'].includes(data.priority)) return reject(ctx, 'Choose an approved product, positive whole packs, priority, reason and request reference.');
      s.ops.requests ||= {};
      const intent = data.intent.trim();
      if (s.ops.requests[intent]) return reject(ctx, 'This request intent was already recorded. No duplicate replenishment demand created; use a new reference for new work.');
      if (w.requestKey === data.intent.trim()) {
        if (w.requestedQty !== qty || w.requestProductId !== p.id) return reject(ctx, 'Request reference reused with different contents. Use a new intent for new work.');
        return reject(ctx, 'Existing replenishment request returned. No duplicate demand created.');
      }
      if (['Requested', 'Approved', 'In transit'].includes(w.transferStatus)) return reject(ctx, 'An open transfer already exists. Finish or resolve it before a new request.');
      s.ops.requests[intent] = { productId: p.id, qty, priority: data.priority, site: currentSite(s) };
      Object.assign(w, { requestKey: intent, requestProductId: p.id, requestedQty: qty, priority: data.priority, destination: currentSite(s), transferStatus: 'Requested', transferKey: '', dispatchedQty: 0, receivedTransferQty: 0, shortage: 0 });
      return save(ctx, 'One replenishment request recorded for Warehouse review.');
    }
    case 'store.receive': {
      if (w.transferStatus === 'Received' || w.transferStatus === 'Received with shortage') return reject(ctx, 'Receipt already saved. No duplicate destination stock credit.');
      if (w.transferStatus !== 'In transit' || data.transferRef !== w.transferKey || w.destination !== currentSite(s)) return reject(ctx, 'Only the current in-transit transfer for your destination can be received.');
      const qty = Number(data.qty);
      if (!Number.isInteger(qty) || qty < 0 || qty > w.dispatchedQty || !data.quality || (qty < w.dispatchedQty && !data.reason?.trim())) return reject(ctx, 'Enter actual whole accepted packs, quality confirmation and a reason for any shortage.');
      if (has(ctx, 'stock-expired') || w.transferExpiry <= TODAY) return reject(ctx, 'Expired transfer cannot be credited as saleable stock. Inventory/Pharmacy must review it.');
      let lot = s.inventory.find(i => i.site === w.destination && i.batch === w.transferBatch && i.productId === w.requestProductId);
      if (!lot) { lot = { id: `INV-${w.transferKey}`, site: w.destination, productId: w.requestProductId, batch: w.transferBatch, expiry: w.transferExpiry, qty: 0, eligible: true }; s.inventory.push(lot); }
      lot.qty += qty; movement(s, `RECEIVE-${w.transferKey}`, lot, qty, 'Actual accepted destination transfer receipt'); refreshIndicativeStock(s, w.requestProductId); w.receivedTransferQty = qty; w.shortage = w.dispatchedQty - qty; w.transferStatus = w.shortage ? 'Received with shortage' : 'Received';
      w.shortageReason = String(data.reason || '');
      if (s.ops.transfers?.[w.transferKey]) Object.assign(s.ops.transfers[w.transferKey], { receivedQty: qty, shortage: w.shortage, status: w.transferStatus });
      return save(ctx, `Receipt saved once: ${qty} packs credited; shortage ${w.shortage} retained for investigation.`, w.shortage ? 'warning' : 'success');
    }
    case 'warehouse.receive': {
      const qty = Number(data.qty), expected = Number(data.expected);
      const receiptKey = String(data.receiptRef || '').trim();
      s.ops.receipts ||= {};
      if (s.ops.receipts[receiptKey]) return reject(ctx, 'Receipt reference already recorded; no stock credited again. Review the saved receipt before new work.');
      const linkedPo=data.purchaseOrderRef?(s.procurement?.purchaseOrders||[]).find(p=>p.id===data.purchaseOrderRef):null;
      if(data.purchaseOrderRef&&(!linkedPo||linkedPo.status!=='Approved — local simulation'||linkedPo.productId!==data.productId||expected!==linkedPo.quantity))return reject(ctx,'Choose a currently approved purchase order and match its product and expected quantity.');
      if (!receiptKey || !data.invoice?.trim() || !data.batch?.trim() || !s.products.some(p => p.id === data.productId && p.approved) || !Number.isInteger(qty) || qty < 0 || !Number.isInteger(expected) || expected <= 0 || qty > expected || !data.manufactured || !data.expiry || data.manufactured > TODAY || data.manufactured >= data.expiry || data.expiry <= TODAY || !data.quality || has(ctx, 'stock-expired') || (qty < expected && !data.reason?.trim())) return reject(ctx, 'Check invoice, exact batch, valid manufacture/expiry dates, approved product, actual quantity, quality and shortage evidence. No stock credited.');
      const entry = { reference: receiptKey, invoice: data.invoice.trim(), batch: data.batch.trim(), qty, expected, reason: String(data.reason || ''), expiry: data.expiry, manufactured: data.manufactured };
      s.ops.receipts[receiptKey] = entry;
      let lot = s.inventory.find(i => i.site === warehouseSite(s) && i.productId === data.productId && i.batch === entry.batch);
      if (lot && lot.expiry !== data.expiry) { delete s.ops.receipts[receiptKey]; return reject(ctx, 'Batch expiry conflicts with the existing lot. Resolve evidence before receiving.'); }
      if (!lot) { lot = { id: `INV-${receiptKey}`, site: warehouseSite(s), productId: data.productId, batch: entry.batch, qty: 0, expiry: data.expiry, eligible: true }; s.inventory.push(lot); }
      lot.qty += qty; movement(s, `SUPPLIER-${receiptKey}`, lot, qty, 'Usable accepted supplier receipt'); w.receiptStatus = qty < expected ? 'Accepted with discrepancy' : 'Accepted'; w.receivedQty = qty; w.receiptKey = receiptKey;
      if(linkedPo){linkedPo.status=qty<expected?'Received with discrepancy':'Received';linkedPo.receiptRef=receiptKey;linkedPo.receivedQty=qty;linkedPo.receivedAt=new Date().toISOString();linkedPo.history.unshift({time:linkedPo.receivedAt,message:`Receipt ${receiptKey}: ${qty}/${expected} packs accepted.`});w.activePurchaseOrder='';}
      return save(ctx, `Supplier receipt recorded once: ${qty} usable packs. ${expected - qty} packs remain a documented discrepancy.`);
    }
    case 'warehouse.approve':
      if (w.transferStatus !== 'Requested' || !w.requestedQty) return reject(ctx, 'Only a current submitted replenishment request can be approved.');
      w.transferStatus = 'Approved'; return save(ctx, 'Replenishment approved for exact batch selection; destination has no stock credit yet.');
    case 'warehouse.urgent':
      if (!data.reason?.trim() || !Number.isInteger(Number(data.run)) || Number(data.run) < 1) return reject(ctx, 'Give a reason and valid proposed additional run number.');
      w.audit ||= []; w.audit.push(`Capacity exception requested for proposed run ${Number(data.run)}: ${data.reason.trim()}. Operations approval pending.`);
      return save(ctx, 'Urgent-run request recorded; capacity approval remains pending under D-002.', 'warning');
    case 'warehouse.dispatch': {
      if (w.transferStatus === 'In transit' || w.transferStatus.startsWith?.('Received')) return reject(ctx, 'Transfer already dispatched. Repeated dispatch does not deduct source or credit destination again.');
      s.ops.transfers ||= {};
      if (s.ops.transfers[String(data.transferRef || '').trim()]) return reject(ctx, 'This transfer reference belongs to a saved dispatch. Do not reuse it for another transfer.');
      const qty = Number(data.qty), lot = s.inventory.find(i => i.id === data.inventoryId);
      if (w.transferStatus !== 'Approved' || !data.transferRef?.trim() || !data.note?.trim() || !lot || lot.site !== warehouseSite(s) || lot.productId !== w.requestProductId || !eligible(lot) || !Number.isInteger(qty) || qty <= 0 || qty > w.requestedQty || qty > lot.qty || data.destination !== w.destination || has(ctx, 'stock-expired') || has(ctx, 'out-of-stock')) return reject(ctx, 'Approve the current request and select its exact eligible source batch, quantity, destination and dispatch note.');
      lot.qty -= qty; movement(s, `DISPATCH-${data.transferRef.trim()}`, lot, -qty, 'Warehouse transfer dispatched as in-transit stock'); Object.assign(w, { transferKey: data.transferRef.trim(), transferStatus: 'In transit', dispatchedQty: qty, transferBatch: lot.batch, transferExpiry: lot.expiry, transferInventoryId: lot.id, dispatchNote: data.note.trim() });
      s.ops.transfers[w.transferKey] = { dispatchedQty: qty, batch: lot.batch, destination: w.destination, status: 'In transit', requestKey: w.requestKey };
      return save(ctx, 'Transfer dispatched once. Destination stock remains unchanged until actual receipt.');
    }
    case 'warehouse.count': {
      const lot = s.inventory.find(i => i.id === data.inventoryId), qty = Number(data.qty);
      if (!lot || lot.site !== warehouseSite(s) || !Number.isInteger(qty) || qty < 0 || !data.reason?.trim()) return reject(ctx, 'Choose a warehouse batch, whole physical count and evidence/reason.');
      w.audit ||= []; w.audit.push({ batch: lot.batch, qty, ledger: lot.qty, reason: data.reason.trim() });
      return save(ctx, 'Count evidence submitted to Inventory. No stock quantity overwritten.', 'warning');
    }
    case 'warehouse.fallback': return save(ctx, 'Fallback eligibility review requested. Dispensing remains blocked pending licensed-site and scope approval.', 'warning');
    case 'delivery.assign': {
      const stale = versionGuard(data, ctx, true); if (stale) return reject(ctx, stale);
      const problems = gateProblems(s, ctx); if (problems.length) return reject(ctx, problems.join(' '));
      if (o.pack !== 'Packed') return reject(ctx, 'Assign only a packed parcel before custody handoff. Reassignment after pickup requires an approved custody exception.');
      const r = s.riders.find(x => x.id === data.riderId);
      if (!r || !['Available', 'On duty'].includes(r.status) || r.site !== o.site || has(ctx, 'rider-unavailable') || !data.reason?.trim()) return reject(ctx, 'Select an active available rider at this site and give an assignment reason.');
      if (o.riderId === r.id && ['Assigned', 'Accepted'].includes(o.delivery)) return reject(ctx, 'This rider already has the current assignment. No duplicate task created.');
      const old = s.riders.find(x => x.id === o.riderId); if (old && old.status === 'Assigned') old.status = 'Available';
      o.assignmentVersion = (o.assignmentVersion || 0) + 1; o.riderId = r.id; o.delivery = 'Assigned'; r.status = 'Assigned';
      outcome(ctx, 'Dispatch confirmed one current rider assignment.'); return save(ctx, 'Assignment confirmed. Rider must accept before store handoff.');
    }
    case 'delivery.resolve': {
      const stale = versionGuard(data, ctx, true); if (stale) return reject(ctx, stale);
      if (o.delivery !== 'Failed' || !data.reason?.trim()) return reject(ctx, 'Record a failed attempt first, then give the dispatch resolution reason.');
      if (data.resolution === 'reattempt') { const r = s.riders.find(x => x.id === o.riderId); if (!r || ['Inactive', 'Off duty', 'Break'].includes(r.status)) return reject(ctx, 'Current rider is not eligible for reattempt. Resolve custody and availability first.'); o.delivery = 'Out for delivery'; }
      else if (data.resolution === 'reschedule') { if (!data.when) return reject(ctx, 'Choose the planned date/time and coordinate with Support/customer.'); o.delivery = 'Failed'; o.rescheduledAt = data.when; }
      else if (data.resolution === 'return') { o.delivery = 'Return to store'; o.returnStatus = 'Requested'; }
      else return reject(ctx, 'Select a supported resolution.');
      o.failureResolution = data.resolution; o.assignmentVersion = (o.assignmentVersion || 0) + 1;
      outcome(ctx, `Dispatch resolution: ${data.resolution}; custody, stock and cash remain separately tracked.`);
      return save(ctx, 'Resolution recorded. No automatic refund, stock credit or cash clearance.');
    }
    case 'delivery.rider': {
      const r = s.riders.find(x => x.id === data.riderId);
      if (!r || !data.site?.trim() || !['Available', 'Break', 'Off duty', 'Inactive'].includes(data.status)) return reject(ctx, 'Select a rider, permitted demo site and availability.');
      if (o.riderId === r.id && !['Delivered', 'Unassigned'].includes(o.delivery)) return reject(ctx, 'This rider has an open assignment/custody. Resolve the task before changing shift or site.');
      r.site = data.site.trim(); r.status = data.status; return save(ctx, 'Demo rider site and availability updated.');
    }
    case 'delivery.onboard':
      if (!data.name?.trim() || !data.site?.trim() || !data.approved) return reject(ctx, 'Enter a synthetic rider name/site and confirm Operations review.');
      s.riders.push({ id: `RID-DEMO-${s.riders.length + 1}`, name: data.name.trim(), site: data.site.trim(), status: 'Off duty' });
      return save(ctx, 'Synthetic rider added off duty. Real onboarding/access approval is outside this prototype.');
    case 'delivery.deposit': {
      const amount = Number(data.amount), collected = Number(o.codCollected || 0);
      if (!Number.isFinite(amount) || amount < 0 || amount > collected || !data.reference?.trim() || (amount !== collected && !data.reason?.trim())) return reject(ctx, 'Enter actual cash no greater than recorded collection, handover reference and reason for a difference.');
      s.ops.deposits ||= {};
      if (s.ops.deposits[data.reference]) return reject(ctx, 'Handover reference already recorded. No duplicate cash fact.');
      if (s.finance.deposit > 0) return reject(ctx, 'A handover is already recorded for this synthetic order; Finance must reconcile amendments.');
      s.ops.deposits[data.reference] = { amount, collected, reason: String(data.reason || '') }; s.finance.deposit = amount;
      s.finance.reconciliation = amount === collected ? 'Matched demo evidence' : 'Cash difference unresolved';
      return save(ctx, amount === collected ? 'Cash handover evidence recorded.' : 'Short cash recorded; unresolved difference remains with Finance.', amount === collected ? 'success' : 'warning');
    }
    case 'rider.login': {
      if (!String(s.role || '').toLowerCase().includes('rider')) return reject(ctx, 'Switch to the Rider demo role first.');
      const r = s.riders.find(x => x.id === data.riderId);
      if (!r || r.status === 'Inactive' || String(data.otp) !== String(s.demoOtp || '246810') || has(ctx, 'otp-wrong')) return reject(ctx, 'Invalid demo OTP or revoked rider. No session created.');
      s.riderSession = true; s.riderId = r.id; s.duty ||= 'Off duty'; establishSession(s,{identityId:`USR-DEMO-RIDER-${r.id}`,role:'Rider',method:'OTP',workspace:'rider',riderId:r.id}); return save(ctx, 'Synthetic rider signed in through the shared identity session. Set duty and accept only your assigned tasks.');
    }
    case 'rider.signout': {
      const hasCustody=(s.order.riderId===s.riderId&&!['Delivered','Failed','Unassigned'].includes(s.order.delivery))||(s.returnCases||[]).some(c=>c.pickup?.riderId===s.riderId&&['Assigned','Picked up'].includes(c.pickup.status));
      if(hasCustody)return reject(ctx,'Resolve or hand over current delivery/return custody before signing out.');s.riderSession=false;s.duty='Off duty';revokeSession(s,'Rider signed out from the demo application');ctx.record('Rider identity session revoked');return save(ctx,'Rider session ended.');
    }
    case 'rider.duty': {
      if (!['On duty', 'Break', 'Off duty'].includes(data.duty)) return reject(ctx, 'Choose a valid duty status.');
      if (o.riderId === s.riderId && !['Unassigned', 'Delivered'].includes(o.delivery) && data.duty !== 'On duty') return reject(ctx, 'An open assignment/custody must be resolved before break or off duty.');
      s.duty = data.duty;
      const r = s.riders.find(x => x.id === s.riderId); if (r && !['Assigned', 'On delivery'].includes(r.status)) r.status = data.duty === 'On duty' ? 'Available' : data.duty;
      return save(ctx, 'Rider duty updated.');
    }
    case 'rider.accept':
      if (s.duty !== 'On duty' || has(ctx, 'rider-unavailable')) return reject(ctx, 'Start an authorized on-duty shift before accepting.');
      if (o.delivery !== 'Assigned') return reject(ctx, 'Only a current assigned task can be accepted once.');
      o.delivery = 'Accepted'; outcome(ctx, 'Assigned rider accepted task.'); return save(ctx, 'Task accepted. Ask Store to confirm parcel handoff.');
    case 'rider.decline':
      if (o.delivery !== 'Assigned') return reject(ctx, 'Only a not-yet-accepted assignment can be declined. Dispatch must resolve later custody.');
      s.riders.find(x => x.id === s.riderId).status = 'Available'; o.riderId = null; o.delivery = 'Unassigned'; o.assignmentVersion = (o.assignmentVersion || 0) + 1;
      return save(ctx, 'Assignment declined before pickup; returned to Dispatch.');
    case 'rider.pickup': {
      const stale = versionGuard(data, ctx, true); if (stale) return reject(ctx, stale);
      const problems = gateProblems(s, ctx); if (problems.length) return reject(ctx, problems.join(' '));
      if (s.duty !== 'On duty' || o.pack !== 'Handed over' || o.delivery !== 'Accepted' || data.packageRef !== o.packageRef || !data.verified) return reject(ctx, 'Confirm current accepted task, store handoff and exact package reference before pickup.');
      o.delivery = 'Picked up'; o.status = 'Out for delivery'; s.riders.find(x => x.id === s.riderId).status = 'On delivery';
      outcome(ctx, 'Current rider confirmed exact sealed parcel pickup.'); return save(ctx, 'Pickup confirmed; synthetic navigation is available.');
    }
    case 'rider.location':
      if (!['Picked up', 'Out for delivery'].includes(o.delivery) || !data.consent) return reject(ctx, 'Synthetic task-location update needs current pickup and explicit demo consent.');
      if (has(ctx, 'offline')) return reject(ctx, 'Offline sample is not live. Last-known synthetic update remains stale; no current position claimed.');
      s.ops.locationTime = new Date().toISOString(); return save(ctx, 'Synthetic current-task location timestamp recorded. No real GPS was accessed.');
    case 'rider.complete': return complete(data, ctx);
    case 'rider.replay': {
      const pending = s.ops.offlinePending;
      if (!pending) return reject(ctx, 'No unconfirmed offline completion exists.');
      if (pending.orderId !== o.id || pending.riderId !== s.riderId || pending.riderId !== o.riderId || Number(pending.assignmentVersion) !== Number(o.assignmentVersion || 0) || Number(pending.revision) !== Number(o.revision) || !['Picked up', 'Out for delivery'].includes(o.delivery)) {
        s.ops.offlinePending = null; ctx.record('Stale offline completion denied; no delivery or COD effect.'); ctx.save('Stale offline replay rejected. Current assignment/custody changed; contact Dispatch.', 'error'); return true;
      }
      return complete(pending, ctx, true);
    }
    case 'rider.fail': {
      const stale = versionGuard(data, ctx, true); if (stale) return reject(ctx, stale);
      if (!['Picked up', 'Out for delivery'].includes(o.delivery)) return reject(ctx, 'Record failure only for a current picked-up delivery.');
      if (!['Customer unavailable', 'Customer refused', 'Address not found', 'Unable to verify recipient'].includes(data.reason)) return reject(ctx, 'Choose an allowed fixed demo failure reason.');
      o.delivery = 'Failed'; o.failureReason = data.reason; o.note = String(data.note || '');
      s.ops.riderHistory ||= []; s.ops.riderHistory.push({ time: new Date().toISOString(), orderId: o.id, riderId: s.riderId, outcome: `Failed: ${data.reason}` });
      outcome(ctx, 'Assigned rider recorded a failed attempt; parcel custody and cash facts retained.'); return save(ctx, 'Failed attempt recorded. Dispatch must choose reattempt, reschedule or return.', 'warning');
    }
    default: return false;
  }
}
