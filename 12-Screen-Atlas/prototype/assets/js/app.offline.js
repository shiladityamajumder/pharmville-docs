/* Pharmville offline wireframes — generated from the original vanilla JavaScript modules. */
/* All modules are bundled for direct file:// use. No server, libraries or network required. */
(function () {
"use strict";
const __modules = Object.create(null);

/* --- shared/ui.js --- */
__modules["shared/ui.js"] = (function() {
"use strict";
const h = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (label, route, cls='button') => `<a class="${h(cls)}" href="#/${h(route.replace(/^#?\/?/, ''))}">${h(label)}</a>`;
const button = (label, action, extra='') => `<button type="button" data-action="${h(action)}" ${extra}>${h(label)}</button>`;
let fieldIndex=0;
const field = (label,name,value='',type='text',extra='') => {const id=`f-${h(name)}-${++fieldIndex}`;return `<div class="field"><label for="${id}">${h(label)}</label><input id="${id}" name="${h(name)}" type="${h(type)}" value="${h(value)}" ${extra}></div>`;};
const select = (label,name,options,value='') => {const id=`f-${h(name)}-${++fieldIndex}`;return `<div class="field"><label for="${id}">${h(label)}</label><select id="${id}" name="${h(name)}">${options.map(o => `<option value="${h(Array.isArray(o)?o[0]:o)}" ${String(Array.isArray(o)?o[0]:o)===String(value)?'selected':''}>${h(Array.isArray(o)?o[1]:o)}</option>`).join('')}</select></div>`;};
const form = (action,body,submit='Save') => `<form data-form="${h(action)}" novalidate>${body}<div class="actions"><button class="primary" type="submit">${h(submit)}</button></div></form>`;
const table = (headers,rows) => `<div class="table-wrap"><table><thead><tr>${headers.map(x=>`<th scope="col">${h(x)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${row.map((cell,i)=>`<td data-label="${h(headers[i]||'Detail')}">${cell??'—'}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}">No matching records.</td></tr>`}</tbody></table></div>`;
const badge = value => `<span class="badge">${h(value)}</span>`;
const panel = (title,body) => `<section class="panel"><h2>${h(title)}</h2>${body}</section>`;
const notice = (message,kind='info') => `<div class="notice ${h(kind)}" role="${kind==='error'?'alert':'status'}">${h(message)}</div>`;
const money = value => `₹${Number(value||0).toFixed(2)}`;
const timeline = items => `<ol class="timeline">${items.map(item=>`<li>${h(typeof item==='object'?item.label||item.action: item)}</li>`).join('')}</ol>`;
const empty = (title,body,actionHTML='') => `<section class="empty-state"><div class="placeholder-symbol" aria-hidden="true">□</div><h2>${h(title)}</h2><p>${h(body)}</p>${actionHTML}</section>`;


return {h, link, button, field, select, form, table, badge, panel, notice, money, timeline, empty};
})();

/* --- shared/mock-domain.js --- */
__modules["shared/mock-domain.js"] = (function() {
"use strict";
// Shared, browser-only domain helpers. These fixtures are not a security or backend implementation.
const time = () => new Date().toISOString();

const workspaceGrants = {
  Customer: ['customer'],
  Admin: ['admin', 'orders', 'store', 'warehouse', 'inventory', 'delivery', 'reporting', 'notifications', 'support', 'procurement', 'returns'],
  'Super Admin': ['admin', 'orders', 'store', 'warehouse', 'inventory', 'delivery', 'reporting', 'notifications', 'support', 'procurement', 'returns'],
  'Central Admin': ['admin', 'orders', 'store', 'warehouse', 'inventory', 'delivery', 'reporting', 'notifications', 'support', 'procurement', 'returns'],
  'Order operator': ['orders', 'returns', 'support'],
  Pharmacist: ['pharmacy'],
  'Licensed Pharmacist': ['pharmacy'],
  'Store worker': ['store', 'inventory'],
  'Store Staff': ['store', 'inventory'],
  'Store Manager': ['store', 'inventory'],
  'Warehouse worker': ['warehouse'],
  'Warehouse Staff': ['warehouse'],
  'Warehouse Manager': ['warehouse', 'procurement'],
  Dispatcher: ['delivery'],
  'Delivery/Ops Manager': ['delivery'],
  Rider: ['rider'],
  'Delivery Rider': ['rider'],
  Finance: ['finance', 'reporting'],
  'Finance Manager': ['finance', 'reporting'],
  'Finance Executive': ['finance'],
  'Finance approver': ['finance', 'reporting'],
  'Report viewer': ['reporting'],
  Auditor: ['audit'],
  Support: ['support'],
  Procurement: ['procurement'],
  'Catalog Manager': ['admin'],
  'CMS Manager': ['admin']
};

const demoIdentities = {
  'admin@example.test': { id: 'USR-DEMO-ADMIN', role: 'Admin' },
  'super.admin@example.test': { id: 'USR-DEMO-SUPER-ADMIN', role: 'Super Admin' },
  'central.admin@example.test': { id: 'USR-DEMO-CENTRAL-ADMIN', role: 'Central Admin' },
  'demo.admin@example.test': { id: 'USR-DEMO-ADMIN', role: 'Admin' },
  'order.operator@example.test': { id: 'USR-DEMO-ORDER-OPS', role: 'Order operator' },
  'pharmacist@example.test': { id: 'USR-DEMO-PHARMACIST', role: 'Pharmacist' },
  'licensed.pharmacist@example.test': { id: 'USR-DEMO-LICENSED-PHARMACIST', role: 'Licensed Pharmacist' },
  'store@example.test': { id: 'USR-DEMO-STORE', role: 'Store worker' },
  'store.manager@example.test': { id: 'USR-DEMO-STORE-MANAGER', role: 'Store Manager' },
  'store.staff@example.test': { id: 'USR-DEMO-STORE-STAFF', role: 'Store Staff' },
  'warehouse@example.test': { id: 'USR-DEMO-WAREHOUSE', role: 'Warehouse worker' },
  'warehouse.manager@example.test': { id: 'USR-DEMO-WAREHOUSE-MANAGER', role: 'Warehouse Manager' },
  'inventory@example.test': { id: 'USR-DEMO-INVENTORY', role: 'Inventory Operator' },
  'dispatcher@example.test': { id: 'USR-DEMO-DISPATCH', role: 'Dispatcher' },
  'delivery.ops@example.test': { id: 'USR-DEMO-DELIVERY-OPS', role: 'Delivery/Ops Manager' },
  'finance@example.test': { id: 'USR-DEMO-FINANCE', role: 'Finance' },
  'finance.manager@example.test': { id: 'USR-DEMO-FINANCE-MANAGER', role: 'Finance Manager' },
  'finance.executive@example.test': { id: 'USR-DEMO-FINANCE-EXEC', role: 'Finance Executive' },
  'finance.approver@example.test': { id: 'USR-DEMO-FINANCE-APPROVER', role: 'Finance approver' },
  'support@example.test': { id: 'USR-DEMO-SUPPORT', role: 'Support' },
  'auditor@example.test': { id: 'USR-DEMO-AUDITOR', role: 'Auditor' },
  'reports@example.test': { id: 'USR-DEMO-REPORTS', role: 'Report viewer' },
  'catalog@example.test': { id: 'USR-DEMO-CATALOG', role: 'Catalog Manager' },
  'cms@example.test': { id: 'USR-DEMO-CMS', role: 'CMS Manager' },
  'procurement@example.test': { id: 'USR-DEMO-PROCUREMENT', role: 'Procurement' }
};

function establishSession(state, { identityId, role, method, workspace, mfaVerified = false, riderId = null }) {
  const permitted = workspaceGrants[role] || [];
  state.role = role;
  state.identitySession = {
    id: `SES-DEMO-${Date.now()}`,
    identityId,
    role,
    method,
    mfaVerified,
    riderId,
    permittedWorkspaces: [...permitted],
    activeWorkspace: workspace,
    stepUpVerifiedFor: [],
    location: state.location,
    createdAt: time(),
    status: 'Active (local simulation)'
  };
  return state.identitySession;
}

function revokeSession(state, reason = 'Signed out') {
  if (state.identitySession) {
    state.identitySession.status = 'Revoked (local simulation)';
    state.identitySession.revokedAt = time();
    state.identitySession.revocationReason = reason;
  }
  state.identitySession = null;
}

function recordEvent(state, { type, reference, summary, recipient = 'Customer', channel = 'In-app' }) {
  state.domainEvents ||= [];
  const id = `EVT-DEMO-${String(state.domainEvents.length + 1).padStart(4, '0')}`;
  const event = { id, type, reference, summary, recipient, channel, status: 'Queued (simulation)', attempts: 0, createdAt: time() };
  state.domainEvents.unshift(event);
  state.domainEvents = state.domainEvents.slice(0, 100);
  state.notification = { ...(state.notification || {}), eventId: id, status: event.status, attempts: event.attempts, channel };
  return event;
}

function appendHistory(record, message) {
  record.history ||= [];
  record.history.unshift({ time: time(), message });
}


return {workspaceGrants, demoIdentities, establishSession, revokeSession, recordEvent, appendHistory};
})();

/* --- customer/screens.js --- */
__modules["customer/screens.js"] = (function() {
"use strict";
const {h, link, button, field, select, form, table, badge, panel, notice, money, timeline, empty} = __modules["shared/ui.js"];
const {establishSession, revokeSession} = __modules["shared/mock-domain.js"];


// This module uses synthetic fixtures only. No file contents or payment credentials are collected.
const basic = ['normal', 'loading', 'validation', 'network', 'session'];
const shopping = ['normal', 'loading', 'empty', 'network', 'out-of-stock'];
const actions = (...items) => `<div class="actions">${items.join('')}</div>`;
const check = (label, name, checked = false) => `<label class="check"><input type="checkbox" name="${h(name)}"${checked ? ' checked' : ''}> ${h(label)}</label>`;
const area = (label, name, value = '') => `<div class="field"><label for="f-${h(name)}">${h(label)}</label><textarea id="f-${h(name)}" name="${h(name)}" rows="3">${h(value)}</textarea></div>`;
const getProduct = (s, id) => s.products.find(p => p.id === id);
const chosen = s => getProduct(s, s.selectedProduct) || s.products[0];
const items = s => s.order.items?.length ? s.order.items : s.cart;
const hasP = (s, lines = s.cart) => lines.some(i => getProduct(s, i.productId)?.class === 'P');
const subtotal = (s, lines = s.cart) => lines.reduce((sum, i) => sum + (getProduct(s, i.productId)?.price || 0) * i.qty, 0);
const total = (s, lines = s.cart) => subtotal(s, lines) + Number(s.settings.deliveryFee || 0);
const address = s => s.customer.addresses.find(a => a.id === s.order.addressId);
const patientOptions = s => [['self', `${s.customer.name || 'Self'} (self)`], ...s.customer.family.map(p => [p.id, `${p.name} (${p.relation})`])];
const ownsPatient = (s, id) => id === 'self' || s.customer.family.some(p => p.id === id);
const quoteKey = s => JSON.stringify({items: s.cart.map(i => [i.productId, i.qty, getProduct(s, i.productId)?.price]), address: s.order.addressId, patient: s.order.patientId, fee: s.settings.deliveryFee, version: s.settings.version});
const clinicalKey = (s, lines, patientId) => JSON.stringify({lines: lines.filter(i => getProduct(s, i.productId)?.class === 'P').map(i => [i.productId, i.qty]), patientId});
const submitted = o => o.customerSubmitted === true;
function pricePreview(ctx) {
  const s = ctx.state;
  if (ctx.scenario !== 'price-change' || s.order.priceChangeApplied || !s.cart.length) return s;
  return {...s, products: s.products.map(p => p.id === s.cart[0].productId ? {...p, price: p.price + 10} : p)};
}
function applyPriceChange(ctx) {
  if (ctx.scenario === 'price-change' && !ctx.state.order.priceChangeApplied && ctx.state.cart.length) {
    const p = getProduct(ctx.state, ctx.state.cart[0].productId);
    if (p) p.price += 10;
    ctx.state.order.priceChangeApplied = true;
  }
}
function proposedLines(s) {
  return items(s).flatMap(i => {
    if (s.order.partialProposal?.status === 'Awaiting customer acceptance' && s.order.partialProposal.productId === i.productId) return [];
    if (s.order.review !== 'Partial' || getProduct(s, i.productId)?.class !== 'P') return [{...i}];
    const decision = (s.order.reviewLines || []).find(r => r.productId === i.productId);
    return decision?.decision === 'Approved' ? [{...i, qty: Math.min(i.qty, Number(decision.qty || i.qty))}] : [];
  });
}
const labelClass = p => p.class === 'P' ? 'Prescription required' : p.class === 'M' ? 'Medicine' : p.class === 'O' ? 'Other product' : 'Availability being checked';
const stockAvailable = (p, ctx) => p && p.stock > 0 && p.approved !== false && ['P', 'M', 'O'].includes(p.class) && ctx.scenario !== 'out-of-stock';
const productActions = (p,ctx) => `<div class="product-card-actions">${button(stockAvailable(p,ctx)?'Add to cart':'Unavailable', 'customer.add-cart', `class="primary" data-product-id="${h(p.id)}" ${stockAvailable(p,ctx)?'':'disabled aria-label="This product is unavailable"'}`)}${button('Details', 'customer.view-product', `class="secondary" data-product-id="${h(p.id)}"`)}${button('Save', 'customer.wishlist-add', `class="quiet" aria-label="Save ${h(p.name)} for later" data-product-id="${h(p.id)}"`)}</div>`;
function productCards(ctx, products) {
  if (ctx.scenario === 'empty' || !products.length) return empty('No matching products', 'Try a different name, brand or composition, or browse categories.', link('Browse categories', 'customer/categories'));
  return `<div class="cards">${products.map(p => `<article class="panel product-card"><h2>${h(p.name)}</h2><div class="product-card-main"><div class="image-placeholder" role="img" aria-label="Product image placeholder">Product</div><div class="product-card-info"><p>${badge(labelClass(p))}</p><p>${h(p.composition)} · ${h(p.strength)} · ${h(p.form)} · ${h(p.pack)}</p><p><strong>${money(p.price)}</strong> · ${stockAvailable(p, ctx) ? 'Available' : 'Unavailable'}</p></div></div>${productActions(p,ctx)}</article>`).join('')}</div>`;
}
function linesTable(s, lines = s.cart, editable = false) {
  return table(['Product', 'Prescription', 'Qty', 'Price', 'Total', ...(editable ? ['Actions'] : [])], lines.map(i => {
    const p = getProduct(s, i.productId);
    return [h(`${p?.name || 'Unavailable item'} · ${p?.pack || ''}`), badge(p ? labelClass(p) : 'Unavailable'), h(i.qty), money(p?.price || 0), money((p?.price || 0) * i.qty), ...(editable ? [actions(button('−', 'customer.cart-qty', `aria-label="Decrease ${h(p?.name)} quantity" data-product-id="${h(i.productId)}" data-delta="-1"`), button('+', 'customer.cart-qty', `aria-label="Increase ${h(p?.name)} quantity" data-product-id="${h(i.productId)}" data-delta="1"`), button('Remove', 'customer.remove-cart', `data-product-id="${h(i.productId)}"`))] : [])];
  }));
}
function summary(s, lines = s.cart) {
  return `<div class="commerce-layout"><section class="cart-lines">${linesTable(s, lines)}</section><aside class="price-summary"><h2>Order summary</h2><dl><dt>Items</dt><dd>${money(subtotal(s, lines))}</dd><dt>Delivery</dt><dd>${money(s.settings.deliveryFee)}</dd><dt>Total</dt><dd><strong>${money(total(s, lines))}</strong></dd></dl></aside></div>`;
}
function reviewStatus(ctx) {
  if (ctx.scenario === 'prescription-rejected') return 'Rejected';
  if (ctx.scenario === 'prescription-partial') return 'Partial';
  if (['prescription-missing', 'unreadable'].includes(ctx.scenario)) return 'Pending';
  return ctx.state.order.review;
}
function paymentStatus(ctx) {
  if (ctx.scenario === 'payment-declined') return 'Failed';
  if (['payment-pending', 'confirmation-lost', 'stock-expired'].includes(ctx.scenario)) return 'Pending';
  return ctx.state.order.payment;
}
function customerStatus(s) {
  const o=s.order;
  if(o.delivery==='Failed')return ['Delivery needs attention',`The delivery could not be completed: ${o.failureReason||'the delivery team is reviewing the attempt'}. The delivery team will arrange the next permitted step.`];
  if(o.delivery==='Delivered')return ['Delivered','Your order has been delivered.'];
  if(o.delivery==='Out for delivery')return ['Out for delivery','The rider is on the way.'];
  if(o.delivery==='Picked up'||o.delivery==='Accepted'||o.delivery==='Assigned')return ['With the delivery team','Your parcel is moving through delivery.'];
  if(o.pack==='Packed'||o.pack==='Handed over')return ['Being prepared','The store is preparing your order.'];
  if(o.review==='Pending'&&o.items?.some(i=>getProduct(s,i.productId)?.class==='P'))return ['Waiting for pharmacist review','A pharmacist needs to review the prescription before payment.'];
  if(o.review==='Rejected')return ['Prescription needs attention','Read the pharmacist’s reason and correct the prescription before continuing. Payment is unavailable.'];
  if(o.review==='Partial')return ['Review the proposed changes','Some medicines were not accepted. Review the permitted revised basket before payment.'];
  if(o.status==='Awaiting prescription')return ['Prescription needed','Add prescription details to continue.'];
  if(o.payment==='Pending'||o.status==='Checking payment')return ['Checking your payment','Please do not pay again while we check this payment.'];
  if(o.payment==='Paid')return ['Payment received','Your order is confirmed.'];
  if(o.status==='Confirmed')return ['Order confirmed','Your order is confirmed.'];
  if(o.status==='Cancelled')return ['Cancelled','Your cancellation request was recorded.'];
  if(o.status==='Awaiting payment')return ['Ready for payment','Complete payment to confirm your order.'];
  return ['Order received','We’ll show updates here as your order progresses.'];
}
function orderFacts(s) {
  const [status,next]=customerStatus(s);
  return `<section class="order-summary"><div><span>Order</span><strong>${h(s.order.id)}</strong></div><div><span>Status</span>${badge(status)}</div><p>${h(next)}</p></section>`;
}
function deliveryTimeline(s) {
  const o=s.order;const hasPrescription=o.items?.some(i=>getProduct(s,i.productId)?.class==='P');
  const paymentDone=o.payment==='Paid'||(o.method==='cod'&&o.status==='Confirmed');
  const prepDone=['Picked','Packed','Handed over'].includes(o.pack);
  const pickupDone=['Picked up','Out for delivery','Delivered'].includes(o.delivery);
  const delivered=o.delivery==='Delivered';
  const rows=[['Order received',Boolean(o.customerSubmitted)],['Prescription reviewed',!hasPrescription||o.review==='Approved'],['Payment confirmed',paymentDone],['Prepared by the store',prepDone],['Picked up by the rider',pickupDone],['Delivered',delivered]];
  return `<ol class="order-timeline">${rows.map(([label,done])=>`<li class="${done?'complete':''}">${h(label)}${done?'<span>Complete</span>':''}</li>`).join('')}</ol>`;
}
function sc(id, route, title, module, features, description, scenarios, render) {
  return {id: `SCR-CUS-${String(id).padStart(3, '0')}`, route: `customer/${route}`, title, platform: 'customer', workspace: 'customer', module, features, description, scenarios, render: ctx => render(ctx)};
}

const screens = [
  sc(1, 'login', 'Sign in with your mobile', 'Customer_Accounts', ['ACC-01', 'ACC-05', 'AUTH-03'], 'Mobile sign-in, current privacy notice and explicit acknowledgement.', [...basic, 'otp-delivery', 'otp-fallback', 'rate-limit'], ctx => `<p>Sign in to save your cart and manage your orders.</p>${ctx.scenario === 'rate-limit' ? notice('Too many requests. A new code cannot be requested until the configured security window allows it.', 'error') : ''}${ctx.scenario === 'otp-delivery' ? notice('WhatsApp delivery is unavailable. Request status stays pending; configured fallback can be checked on the next screen.', 'warning') : ''}${ctx.scenario === 'otp-fallback' ? notice('Demo fallback: WhatsApp fails and the same challenge is sent through SMS once.') : ''}${form('customer.request-otp', field('Mobile number', 'phone', ctx.state.customer.phone, 'tel', 'autocomplete="tel" inputmode="tel" required') + '<p>Your details are used to manage your account and orders. Read the privacy notice before continuing.</p>' + check('I have read privacy notice DEMO-v1', 'consent'), 'Request code')}${link('Browse without signing in', 'customer/home')}`),
  sc(2, 'otp', 'Verify your code', 'Customer_Accounts', ['ACC-01', 'AUTH-03'], 'Wrong, expired, delayed and fallback verification paths preserve one session.', [...basic, 'otp-wrong', 'otp-expired', 'otp-delivery', 'otp-fallback', 'rate-limit', 'duplicate'], ctx => `${panel('Delivery status', `<p>Number ending ${h(String(ctx.state.customer.phone || '').slice(-4))} · ${h(ctx.state.customer.otpDelivery || 'No code requested')}</p><p>Demo code: <strong>246810</strong>. Use this code for the fictional walkthrough.</p>`)}${ctx.scenario === 'otp-wrong' ? notice('Incorrect-code scenario: verification will fail without signing you in.', 'error') : ''}${ctx.scenario === 'otp-expired' ? notice('This code has expired. Request a new challenge.', 'warning') : ''}${ctx.scenario === 'otp-delivery' ? notice('Delivery is pending. Check configured SMS fallback; identity proof cannot be bypassed.', 'warning') : ''}${ctx.scenario === 'otp-fallback' ? notice('SMS fallback is configured for this demo challenge; use the same code.') : ''}${form('customer.verify-otp', field('Six-digit code', 'otp', '', 'text', 'autocomplete="one-time-code" inputmode="numeric" maxlength="6" required'), 'Verify and continue')}${actions(button('Resend code', 'customer.resend-otp'), button('Check SMS fallback', 'customer.otp-fallback'), link('Change mobile', 'customer/login'))}`),
  sc(3, 'profile', 'My profile', 'Customer_Accounts', ['ACC-02'], 'Complete signup and safely request a verified contact change.', [...basic, 'conflict', 'permission'], ctx => `${!ctx.state.customer.profileComplete ? notice('Complete your name before checkout. A verified phone alone does not complete signup.', 'warning') : ''}${form('customer.save-profile', field('Full name', 'name', ctx.state.customer.name, 'text', 'autocomplete="name" maxlength="100" required') + field('Email (optional)', 'email', ctx.state.customer.email, 'email', 'autocomplete="email"') + field('Mobile', 'phone', ctx.state.customer.phone, 'tel', 'autocomplete="tel"') + '<p>Changing a verified contact requires another verification step. Your current contact remains active until then.</p>', 'Save profile')}${ctx.state.customer.contactPending ? notice(`Replacement contact ${ctx.state.customer.contactPending} awaits approved verification. Existing mobile preserved.`) : ''}${ctx.state.customer.emailPending ? notice(`Email change to ${ctx.state.customer.emailPending} awaits approved proof; existing email preserved.`) : ''}${actions(link('Saved addresses', 'customer/addresses'), link('Family profiles', 'customer/family'), link('Privacy and consent', 'customer/privacy'), link('Account deletion', 'customer/deletion'), link('Wishlist', 'customer/wishlist'), link('Help and support', 'customer/help'), button('Sign out', 'customer.signout'))}`),
  sc(4, 'addresses', 'Saved delivery addresses', 'Customer_Accounts', ['ACC-03'], 'Address creation with synthetic map pin and independent serviceability.', [...basic, 'empty', 'invalid-address', 'permission'], ctx => `${ctx.scenario === 'empty' || !ctx.state.customer.addresses.length ? empty('No saved addresses', 'Add a destination before checkout.') : table(['Label', 'Address', 'PIN', 'Map pin', 'Coverage', 'Action'], ctx.state.customer.addresses.map(a => [h(a.label), h(a.line), h(a.pin), h(a.mapPin || 'Synthetic pin not set'), badge(a.serviceable === true ? 'Serviceable demo area' : a.serviceable === false ? 'Outside demo area' : 'Check required'), button('Use this address', 'customer.select-address', `data-address-id="${h(a.id)}"`)]))}${form('customer.save-address', field('Address label', 'label', 'Home', 'text', 'required') + area('Flat, building and street', 'line') + field('PIN code', 'pin', '000000', 'text', 'inputmode="numeric" maxlength="6" required') + select('Map pin (schematic only)', 'mapPin', [['Block A', 'Block A · near demo store'], ['Block B', 'Block B · alternate entrance'], ['Outside demo area', 'Outside demo service area']], 'Block A') + '<p>000000 is the synthetic serviceable fixture. Other valid PINs are saved as outside the demo area. No map provider is contacted.</p>', 'Save and check coverage')}${actions(button('Retry coverage check', 'customer.recheck-address'), link('Continue to checkout', 'customer/checkout-address'))}`),
  sc(5, 'family', 'Family and patient profiles', 'Customer_Accounts', ['ACC-04', 'RX-04'], 'Manage owned dependents and select one patient per prescription order.', [...basic, 'empty', 'permission'], ctx => `${panel('Self', `<p>${h(ctx.state.customer.name || 'Complete your name in My profile')}</p>`)}${ctx.scenario === 'empty' || !ctx.state.customer.family.length ? empty('No family profiles', 'You can still select self at checkout.') : table(['Name', 'Age', 'Relation', 'Action'], ctx.state.customer.family.map(p => [h(p.name), h(p.age ?? 'Not recorded'), h(p.relation), button('Select patient', 'customer.select-patient', `data-patient-id="${h(p.id)}"`)]))}${form('customer.add-family', field('Patient name', 'name', '', 'text', 'maxlength="100" required') + field('Age in years', 'age', '', 'number', 'min="0" max="130" required') + select('Relation', 'relation', [['', 'Select relation'], ['Child', 'Child'], ['Parent', 'Parent'], ['Spouse', 'Spouse'], ['Other dependent', 'Other dependent']]) + check('I am authorized to manage this patient profile', 'authorized'), 'Add family member')}${link('Choose patient at checkout', 'customer/checkout-patient')}`),
  sc(6, 'privacy', 'Privacy notice and consent', 'Customer_Accounts', ['ACC-05'], 'Show notice version and record explicit consent choices.', [...basic, 'conflict'], ctx => `${panel('Privacy notice DEMO-v1', '<p>This prototype stores synthetic details in browser storage. No real prescription, patient record, payment credential, GPS location or provider message is needed. Production purposes, notice wording and retention are pending D-013 approval.</p>')}<p>Recorded acknowledgement: ${badge(ctx.state.customer.consent ? 'Acknowledged DEMO-v1' : 'Not acknowledged')}</p>${form('customer.save-consent', check('I acknowledge privacy notice DEMO-v1', 'consent', ctx.state.customer.consent) + check('Optional demonstration marketing messages', 'marketing', ctx.state.customer.marketing), 'Record my choices')}${link('Request account deletion', 'customer/deletion')}`),
  sc(7, 'deletion', 'Request account deletion', 'Customer_Accounts', ['ACC-06'], 'Submit a privacy request without erasing held clinical or financial evidence.', [...basic, 'duplicate'], ctx => `${notice('Deletion is reviewed by Privacy. Required clinical and financial records may be retained under approved rules. No fixed retention deadline is assumed.')}<p>Request status: ${badge(ctx.state.customer.deletion || 'Not requested')}</p>${form('customer.request-deletion', area('Reason (optional)', 'reason') + check('I understand this submits a review request', 'acknowledged'), 'Submit deletion request')}${link('Return to profile', 'customer/profile')}`),
  sc(8, 'wishlist', 'My wishlist', 'Customer_Accounts', ['ACC-07'], 'Saved products retain explicit availability and duplicate-safe additions.', [...shopping, 'duplicate', 'session'], ctx => `${productCards(ctx, ctx.state.products.filter(p => ctx.state.customer.wishlist.includes(p.id)))}${table(['Saved product', 'Action'], ctx.state.customer.wishlist.map(id => [h(getProduct(ctx.state, id)?.name || id), button('Remove from wishlist', 'customer.wishlist-remove', `data-product-id="${h(id)}"`)]))}${link('Discover products', 'customer/home')}`),
  sc(9, 'home', 'Pharmville shop', 'Product_Catalog', ['CAT-01', 'CAT-04', 'CAT-06'], 'Browse categories, check destination and discover exact synthetic products.', shopping, ctx => `${ctx.state.cms.status === 'Published' ? panel(ctx.state.cms.title, `<p>${h(ctx.state.cms.body)}</p>`) : ''}${form('customer.search', field('Search medicines and health products', 'query', ctx.state.search || '', 'search', 'placeholder="Search by product name"'), 'Search')}${actions(link('Browse categories', 'customer/categories'), link('Saved products', 'customer/wishlist'))}<h2>Popular products</h2>${productCards(ctx, ctx.state.products.slice(0, 3))}<details class="home-delivery-check"><summary>Check delivery availability</summary>${form('customer.check-pin', field('Delivery PIN code', 'pin', ctx.state.locationPin || '000000', 'text', 'inputmode="numeric" maxlength="6"'), 'Check area')}<p>${h(ctx.state.locationMessage || 'We’ll confirm delivery coverage at checkout.')}</p></details>`),
  sc(10, 'categories', 'Categories and subcategories', 'Product_Catalog', ['CAT-01'], 'Filter published catalog categories and clearly handle empty results.', shopping, ctx => `${form('customer.category', select('Category', 'category', [['', 'All categories'], ...[...new Set(ctx.state.products.map(p => p.category))].map(c => [c, c])], ctx.state.category === 'All' ? '' : ctx.state.category || '') + select('Subcategory / product class', 'productClass', [['', 'All published classes'], ['O', 'Other products'], ['M', 'Medicines'], ['P', 'Prescription medicines']], ctx.state.productClass || ''), 'Show products')}${productCards(ctx, ctx.state.products.filter(p => (!ctx.state.category || ctx.state.category === 'All' || p.category === ctx.state.category) && (!ctx.state.productClass || p.class === ctx.state.productClass)))}`),
  sc(11, 'search', 'Search results and suggestions', 'Product_Catalog', ['CAT-03'], 'Search exact product data with a visible spelling-suggestion recovery.', shopping, ctx => {
    const q = String(ctx.state.search || '').toLowerCase();
    let found = ctx.state.products.filter(p => `${p.name} ${p.brand || ''} ${p.composition}`.toLowerCase().includes(q) && (!ctx.state.searchClass || p.class===ctx.state.searchClass));if(ctx.state.searchSort==='low')found.sort((a,b)=>a.price-b.price);if(ctx.state.searchSort==='high')found.sort((a,b)=>b.price-a.price);
    return `<div class="catalog-layout"><aside class="catalog-filters">${form('customer.search', field('Name, brand or composition', 'query', ctx.state.search || '', 'search')+select('Product type','searchClass',[['','All products'],['O','Health essentials'],['M','Medicines'],['P','Prescription medicines']],ctx.state.searchClass||'')+select('Sort by','searchSort',[['relevant','Relevance'],['low','Price: low to high'],['high','Price: high to low']],ctx.state.searchSort||'relevant'), 'Show products')}</aside><section><p class="result-count">${found.length} products</p>${!found.length && q ? panel('Try a catalog suggestion', ctx.state.products.slice(0, 3).map(p => button(p.name, 'customer.search-suggestion', `data-query="${h(p.name)}"`)).join(' ')) : ''}${productCards(ctx, found)}</section></div>`;
  }),
  sc(12, 'product', 'Product details', 'Product_Catalog', ['CAT-02', 'CAT-04', 'CAT-06', 'ACC-07'], 'Exact product, pack and classification with a safe image placeholder.', [...shopping, 'permission'], ctx => {
    const p = chosen(ctx.state);
    if (!p) return empty('Product unavailable', 'Browse the current catalog.', link('Shop', 'customer/home'));
    return `${panel(p.name, `<div class="image-placeholder" role="img" aria-label="Product image placeholder">[ Product image placeholder ]</div><p>${badge(labelClass(p))}</p>${table(['Product detail', 'Information'], [['Brand', h(p.brand || 'Demo brand')], ['Manufacturer', h(p.manufacturer || 'Demo manufacturer')], ['Composition', h(p.composition)], ['Strength and form', h(`${p.strength} / ${p.form}`)], ['Pack size', h(p.pack)], ['List price', money(p.mrp || p.price)], ['Your price', money(p.price)], ['Availability', stockAvailable(p, ctx) ? 'Available to add' : 'Currently unavailable']])}${productActions(p, ctx)}`)}${form('customer.check-pin', field('Delivery PIN', 'pin', ctx.state.locationPin || '000000', 'text', 'inputmode="numeric"'), 'Check availability')}<p>${h(ctx.state.locationMessage || 'We’ll check coverage and stock again at checkout.')}</p>${link('Compare alternatives', 'customer/alternatives')}`;
  }),
  sc(13, 'alternatives', 'Compare exact alternatives', 'Product_Catalog', ['CAT-05'], 'Compare composition, strength and dosage form without automatic substitution.', [...shopping, 'prescription-rejected'], ctx => {
    const p = chosen(ctx.state);
    if (!p) return empty('Select a product first', '', link('Shop', 'customer/home'));
    const candidates = ctx.state.products.filter(a => a.id !== p.id && a.composition === p.composition && a.strength === p.strength && a.form === p.form && a.approved !== false);
    return `${notice('An alternative is your explicit choice. A P medicine needs a current pharmacist decision; no automatic clinical interchangeability or approved ranking is assumed.')}<p>Comparing with ${h(p.name)} · ${h(p.composition)} · ${h(p.strength)} · ${h(p.form)}</p>${candidates.length ? table(['Candidate', 'Composition', 'Strength / form', 'Pack', 'Price', 'Action'], candidates.map(a => [h(a.name), h(a.composition), h(`${a.strength} / ${a.form}`), h(a.pack), money(a.price), button('Choose this candidate', 'customer.choose-alternative', `data-product-id="${h(a.id)}"`)])) : empty('No exact candidates', 'Products with a different strength or form are excluded; ask Pharmacy through support.')}${link('Back to product', 'customer/product')}`;
  }),
  sc(14, 'cart', 'Your cart', 'Cart_Checkout', ['CHK-01', 'CHK-05', 'CHK-06'], 'Quantity changes, persistent browser basket and explicit stock/price warnings.', [...shopping, 'conflict', 'price-change', 'session'], ctx => `${ctx.scenario === 'price-change' ? notice('Prices changed. Review the updated total before continuing.', 'warning') : ''}${ctx.scenario === 'out-of-stock' ? notice('An item is no longer available. Remove it or choose another product.', 'error') : ''}${!ctx.state.cart.length || ctx.scenario === 'empty' ? empty('Your cart is empty', 'Browse products to add something to your order.', link('Browse products', 'customer/home')) : `${summary(ctx.state).replace(linesTable(ctx.state), linesTable(ctx.state, ctx.state.cart, true))}${ctx.scenario === 'out-of-stock' ? actions(link('Choose another product', 'customer/home'), link('Edit cart', 'customer/cart')) : actions(link('Continue shopping', 'customer/home'), link('Checkout', 'customer/checkout-address'))}`}`),
  sc(15, 'checkout-address', 'Checkout · delivery address', 'Cart_Checkout', ['CHK-02', 'ACC-03'], 'Only an owned, serviceable address can advance checkout.', [...basic, 'empty', 'invalid-address', 'permission'], ctx => `${notice('Step 1 of 3 · choose the destination. A saved address does not guarantee current delivery coverage.')}<p>Selected: ${h(address(ctx.state)?.line || 'No address selected')}</p>${ctx.state.customer.addresses.length ? form('customer.checkout-address', select('Deliver to', 'addressId', [['', 'Select a saved address'], ...ctx.state.customer.addresses.map(a => [a.id, `${a.label} · ${a.line} · ${a.pin} · ${a.serviceable === true ? 'demo serviceable' : 'coverage not confirmed'}`])], ctx.state.order.addressId || ''), 'Use address and continue') : empty('Add a delivery address', 'Checkout requires a valid destination.', link('Add address', 'customer/addresses'))}${link('Manage addresses and map pin', 'customer/addresses')}`),
  sc(16, 'checkout-patient', 'Checkout · choose patient', 'Cart_Checkout', ['CHK-02', 'RX-04', 'ACC-04'], 'Select self or an authorized owned dependent for one-patient review.', [...basic, 'permission'], ctx => `${notice(hasP(ctx.state) ? 'Prescription medicines are in your basket. Select one authorized patient for this order.' : 'M/O-only basket: prescription upload and pharmacist review are skipped.')}<p>Step 2 of 3 · patient selection</p>${form('customer.checkout-patient', select('Patient', 'patientId', [['', 'Select patient'], ...patientOptions(ctx.state)], ctx.state.order.patientId || '') + check('I confirm the selected patient is correct', 'confirmed'), 'Review summary')}${link('Manage family profiles', 'customer/family')}`),
  sc(17, 'checkout-summary', 'Checkout · accept current summary', 'Cart_Checkout', ['CHK-02', 'CHK-05', 'CHK-06', 'CHK-07', 'CHK-08'], 'Accept destination, patient and total before review/stock/payment gates.', [...basic, 'price-change', 'out-of-stock', 'duplicate', 'stock-expired', 'invalid-address', 'conflict'], ctx => !ctx.state.cart.length ? empty('Add an item before checkout','Your order summary will appear after you add a product.',link('Browse products','customer/home')) : ctx.scenario === 'out-of-stock' ? `${notice('An item is no longer available. Nothing has been submitted. Update your cart before continuing.', 'error')}${summary(ctx.state)}${actions(link('Edit cart', 'customer/cart'), link('Choose another product', 'customer/home'))}` : `${notice('Review your items, delivery address and total before placing the order.')}<p>Deliver to: ${h(address(ctx.state)?.line || 'Choose an address')}<br>Patient: ${h(patientOptions(ctx.state).find(p => p[0] === ctx.state.order.patientId)?.[1] || 'Not selected')}</p>${ctx.scenario === 'price-change' ? notice('The price has changed. Review and accept the updated total before continuing.', 'warning') : ''}${ctx.scenario === 'stock-expired' ? notice('Your stock hold expired. Check availability again before paying.', 'warning') : ''}${summary(pricePreview(ctx))}${form('customer.accept-summary', check('I accept these items, patient, address and total', 'accepted'), 'Place order')}${actions(link('Edit cart', 'customer/cart'), link('Change address', 'customer/checkout-address'))}`),
  sc(18, 'prescription-upload', 'Prescription upload', 'Prescription_Upload', ['RX-01', 'RX-02', 'RX-03', 'RX-04'], 'Metadata-only synthetic uploads with patient linkage; deferred upload stays blocked.', [...basic, 'prescription-missing', 'unreadable', 'permission'], ctx => `${notice('Use only a synthetic filename. This prototype never reads or transmits a file. Production supports JPG, PNG and PDF; scanning and clinical validity are represented.')}<p>Linked patient: ${h(patientOptions(ctx.state).find(p => p[0] === ctx.state.order.patientId)?.[1] || 'Not selected')} · current file: ${h(ctx.state.rx.fileName || 'None')}</p>${ctx.scenario === 'unreadable' ? notice('The uploaded image is unreadable. Replace the evidence; P lines cannot proceed to payment.', 'error') : ''}${form('customer.upload-rx', select('Patient', 'patientId', [['', 'Select patient'], ...patientOptions(ctx.state)], ctx.state.order.patientId || '') + field('Synthetic filename(s), comma-separated', 'fileName', 'demo-prescription.pdf', 'text', 'required') + check('I confirm this evidence belongs to the selected patient', 'confirmed'), 'Submit for pharmacist review')}${actions(button('Reuse saved demo prescription', 'customer.reuse-rx'), link('Review status', 'customer/prescription-status'), button('Upload after ordering (policy pending)', 'customer.deferred-rx'))}<p>Deferred upload / automatic cancellation is blocked pending D-004 and RX-02 approval. No 24-hour countdown is implemented.</p>`),
  sc(19, 'prescription-status', 'Pharmacist review status', 'Prescription_Upload', ['RX-05', 'RX-04'], 'Customer decision projection with rejection/reupload and partial-revision paths.', [...basic, 'prescription-rejected', 'prescription-partial', 'prescription-missing', 'unreadable'], ctx => {
    const status = reviewStatus(ctx);
    const reason = ctx.scenario === 'unreadable' ? 'Image unreadable; upload clearer evidence.' : ctx.scenario === 'prescription-missing' ? 'No usable prescription is linked to this patient.' : status === 'Rejected' ? ctx.state.order.reviewLines?.filter(line=>line.decision==='Rejected').map(line=>line.reason).join('; ') || ctx.state.order.note || 'Evidence needs correction for the prescription line.' : status === 'Partial' ? 'Some lines are not approved. Review the permitted revision and current total.' : status === 'Approved' ? 'Current evidence approved for the reviewed lines.' : 'Waiting for an authorized pharmacist. Payment remains unavailable for P lines.';
    const rejected=status==='Rejected'||ctx.scenario==='prescription-rejected';
    const title=rejected?'Your prescription needs attention':status==='Partial'?'Review the pharmacist’s decision':status==='Approved'?'Prescription review complete':'Prescription review status';
    const explanation=rejected?`The pharmacist couldn’t approve one or more medicines. ${reason} Review the reason and choose an available next step.`:reason;
    const nextActions=rejected?link('Replace / upload evidence','customer/prescription-upload')+button('Refresh review status','customer.refresh-review'):status==='Pending'?button('Refresh review status','customer.refresh-review'):status==='Partial'?link('Review revised order','customer/revised-order')+button('Continue after review','customer.review-continue'):status==='Approved'?button('Continue after review','customer.review-continue'):link('Add prescription details','customer/prescription-upload');
    return `${panel(title, `<p>${badge(status)}</p><p>${h(explanation)}</p><p>File: ${h(ctx.state.rx.fileName || 'Not uploaded')} · patient: ${h(ctx.state.rx.patientId || 'Not linked')}</p><p>Reviewer evidence: ${h(ctx.state.ops?.reviewHistory?.length ? [ctx.state.ops.reviewHistory.at(-1).reviewer, ctx.state.ops.reviewHistory.at(-1).registration, ctx.state.ops.reviewHistory.at(-1).time].join(' · ') : 'Not recorded until a pharmacist decision')}</p>`)}${orderFacts(ctx.state)}${actions(nextActions)}<p>The customer cannot approve clinical evidence. Only an authorized pharmacist can record a decision.</p>`;
  }),
  sc(20, 'revised-order', 'Accept a revised order', 'Prescription_Upload', ['RX-05', 'CHK-06'], 'Explicitly accept a pharmacist/stock revision without approving rejected lines.', [...basic, 'prescription-partial', 'price-change', 'conflict'], ctx => `${notice('A permitted revision must be reviewed before payment. Rejected prescription lines stay excluded. Replacement evidence requires a fresh pharmacist decision.')}<p>Revision ${h(ctx.state.order.revision)} · review ${badge(reviewStatus(ctx))}</p>${ctx.state.order.partialProposal?.status === 'Awaiting customer acceptance' ? notice(`Operations proposes removing ${getProduct(ctx.state, ctx.state.order.partialProposal.productId)?.name || 'an affected line'}: ${ctx.state.order.partialProposal.reason}`) : ''}${summary(pricePreview(ctx), proposedLines(ctx.state))}${ctx.state.order.review === 'Partial' || ctx.scenario === 'prescription-partial' ? notice('Demonstration revision removes rejected P lines and keeps eligible approved or M/O lines. The production partial-fulfillment policy awaits D-010.', 'warning') : ''}${form('customer.accept-revision', check('I accept the eligible revised lines and displayed total', 'accepted'), 'Accept permitted revision')}${actions(link('Replace evidence instead', 'customer/prescription-upload'), link('Return to review status', 'customer/prescription-status'))}`),
  sc(21, 'payment', 'Choose a payment method', 'Cart_Checkout', ['CHK-03', 'CHK-04', 'CHK-07', 'CHK-08'], 'One payment attempt follows current clinical, quote and stock gates.', [...basic, 'payment-declined', 'payment-pending', 'confirmation-lost', 'duplicate', 'stock-expired', 'out-of-stock'], ctx => `${panel('Order total', `<p>${h(ctx.state.order.id)}</p><strong>${money(ctx.state.order.total || total(ctx.state, items(ctx.state)))}</strong>`)}${['Pending', 'Paid'].includes(ctx.state.order.payment) ? panel(ctx.state.order.payment==='Pending'?'We’re checking your payment':'Payment received',`<p>${ctx.state.order.payment==='Pending'?'The result has not been confirmed yet. Please don’t pay again.':'Your payment is confirmed for this order.'}</p>${link('Check payment status','customer/payment-recovery','button primary')}`) : `${form('customer.pay', select('Payment method', 'method', [['upi', 'UPI'], ['card', 'Card'], ['netbanking', 'Net banking'], ['cod', 'Cash on delivery']], ctx.state.order.method === 'cod' ? 'cod' : 'upi') + check('Cash on delivery is available for this order', 'codEligible') + '<p>This walkthrough simulates payment. Do not enter real payment details.</p>', 'Continue')}${actions(link('Back to order summary', 'customer/checkout-summary'))}`}`),
  sc(22, 'payment-result', 'Payment and order result', 'Cart_Checkout', ['CHK-03', 'CHK-07', 'ORD-01'], 'Distinguish decline, pending money, COD acceptance and verified success.', ['normal', 'loading', 'network', 'payment-declined', 'payment-pending', 'confirmation-lost', 'duplicate'], ctx => {
    if(ctx.scenario==='normal'&&ctx.state.order.payment==='Not started'&&ctx.state.order.status!=='Confirmed')return empty('No payment started','Return to checkout to review your order before paying.',link('Review checkout','customer/checkout-summary'));
    const status=paymentStatus(ctx);const pending=status==='Pending';const failed=status==='Failed';const cod=ctx.state.order.method==='cod'&&ctx.state.order.status==='Confirmed';
    const title=pending?'We’re checking your payment':failed?'Payment wasn’t completed':cod?'Order confirmed':'Payment received';
    const guidance=pending?'The result has not been confirmed yet. Please don’t pay again. Check this payment again using the same reference.':failed?'We couldn’t confirm your payment. Your order hasn’t been marked as paid. Check the result before trying another method.':cod?'Your order is confirmed. The amount is due when your delivery arrives.':'Your order is confirmed. You can follow its progress in My orders.';
    return `${panel(title,`<p>Order ${h(ctx.state.order.id)} · ${money(ctx.state.order.total)}</p><p>${guidance}</p>`)}${pending?'':orderFacts(ctx.state)}${actions(pending?link('Check payment status','customer/payment-recovery','button primary'):failed?link('Try payment again','customer/payment','button primary'):link('Track your order','customer/tracking','button primary'),link('My orders','customer/orders'))}`;
  }),
  sc(23, 'payment-recovery', 'Recover existing payment', 'Cart_Checkout', ['CHK-07', 'CHK-08', 'FIN-01'], 'Reconcile a captured/lost response without a new order or charge.', ['normal', 'loading', 'network', 'payment-pending', 'confirmation-lost', 'stock-expired', 'duplicate'], ctx => `${panel('Check your payment',`<p>Order ${h(ctx.state.order.id)} · payment reference ${h(ctx.state.order.paymentAttempt||'Not started')}</p><p>${paymentStatus(ctx)==='Pending'?'We haven’t confirmed the result yet. Please don’t pay again. We’ll check the same payment reference.':'This check uses the existing payment reference. It cannot start another payment.'}</p>${ctx.scenario==='stock-expired'?'<p>Your stock reservation expired while payment was being checked. The order needs a fresh stock check before it can continue.</p>':''}${ctx.scenario==='confirmation-lost'?'<p>Your payment may have completed, but the confirmation did not reach the order. Check the same payment reference below.</p>':''}${button('Check payment status','customer.reconcile-payment','class="primary"')}`)}${actions(link('Back to order', 'customer/order-detail'), link('Payment result', 'customer/payment-result'))}`),
  sc(24, 'orders', 'My orders', 'Customer_Orders', ['ORD-01', 'ORD-02', 'ORD-03'], 'Owned order history with independent state projections.', [...shopping, 'session', 'permission'], ctx => ctx.scenario === 'empty' || !ctx.state.order.items?.length ? empty('No orders yet', 'Your orders will appear here after checkout.', link('Shop','customer/home')) : `${orderFacts(ctx.state)}<p>Total ${money(ctx.state.order.total)}</p>${link('View order details','customer/order-detail','button primary')}`),
  sc(25, 'order-detail', 'Order details and confirmation', 'Customer_Orders', ['ORD-01', 'ORD-02', 'ORD-03', 'ORD-04', 'ORD-05', 'ORD-06', 'ORD-09'], 'Read current accepted order, timeline and eligible aftercare actions.', [...basic, 'permission', 'confirmation-lost', 'conflict'], ctx => `${orderFacts(ctx.state)}<p>Total ${money(ctx.state.order.total)} · destination ${h(address(ctx.state)?.line || 'Not selected')} · patient ${h(patientOptions(ctx.state).find(p => p[0] === ctx.state.order.patientId)?.[1] || 'Not selected')}</p>${linesTable(ctx.state, items(ctx.state))}${panel('Order history', timeline(ctx.state.order.history || ['Order draft created']))}${panel('Confirmation messages', `<p>Delivery status: ${h(ctx.state.notification.status)}. Message delivery never creates a second order.</p>`)}${actions(link('Delivery tracking and OTP', 'customer/tracking'), link('Cancel request', 'customer/cancellation'), link('Return / quality complaint', 'customer/return'), link('Refund status', 'customer/refund'), link('Invoice', 'customer/invoice'), link('Help and support', 'customer/help'), button('Change items / address (policy pending)', 'customer.edit-placed-order'), link('Check payment', 'customer/payment-recovery'))}<p>Post-order edits await ORD-09 / D-010 approval and cannot silently change accepted terms.</p>`),
  sc(26, 'tracking', 'Delivery tracking and handover code', 'Customer_Orders', ['ORD-02', 'ORD-07', 'ORD-08'], 'Schematic private map, current delivery state and scoped handover code.', ['normal', 'loading', 'network', 'permission', 'session'], ctx => `${orderFacts(ctx.state)}${panel('Order progress', deliveryTimeline(ctx.state))}${panel('Delivery route', `<div class="map-placeholder" role="img" aria-label="Illustrative route from store to delivery address">[ Store ] ─ ─ [ Rider ] ─ ─ [ Delivery address ]</div><p>${ctx.state.order.riderId ? 'A rider has been assigned to your order.' : 'A rider will be assigned after the store prepares your order.'}</p>${ctx.scenario==='network'?notice('Updates are delayed while the connection is unavailable. The last confirmed order status is shown.','warning'):''}`)}${panel('Delivery confirmation code', `<p>${ctx.scenario === 'permission' || ctx.scenario === 'session' || !ctx.state.customer.loggedIn ? 'Sign in to view your delivery code.' : ['Assigned', 'Accepted', 'Picked up', 'Out for delivery'].includes(ctx.state.order.delivery) ? `<strong class="otp">${h(ctx.state.demoDeliveryOtp)}</strong>` : 'Your code will appear when the rider is on the way.'}</p><p>Share this code with the rider when your order arrives.</p>`)}${actions(button('Refresh order status', 'customer.refresh-tracking'), link('Back to order', 'customer/order-detail'))}`),
  sc(27, 'cancellation', 'Request cancellation', 'Customer_Orders', ['ORD-04', 'ORD-06'], 'Current pre-packed cancellation gate with explicit confirmation and race handling.', [...basic, 'conflict', 'duplicate'], ctx => `${orderFacts(ctx.state)}${notice(['Packed', 'Handed over'].includes(ctx.state.order.pack) ? 'This order has reached packing. Customer cancellation is no longer available; support must review other options.' : 'Draft cancellation is allowed before packed. The current milestone is checked again when the request is submitted.', 'warning')}${form('customer.cancel-order', select('Reason', 'reason', [['', 'Select a reason'], ['No longer needed', 'No longer needed'], ['Incorrect selection', 'Incorrect selection'], ['Delivery concern', 'Delivery concern']]) + check('I understand refund processing is separate from cancellation', 'acknowledged'), 'Review cancellation')}${link('Keep order', 'customer/order-detail')}`),
  sc(28, 'return', 'Return or quality complaint', 'Customer_Orders', ['ORD-05', 'ORD-06'], 'Item and quantity-specific return request stays pending eligibility and inspection.', [...basic, 'validation', 'duplicate'], ctx => `${notice('Return window, eligible items and refund timing require approval. This submits a request for review; it does not authorize resale or a refund.')}<p>Delivery: ${badge(ctx.state.order.delivery)} · request: ${badge(ctx.state.order.returnStatus || 'Not requested')}</p>${form('customer.request-return', select('Item', 'productId', [['', 'Select an ordered item'], ...items(ctx.state).map(i => [i.productId, getProduct(ctx.state, i.productId)?.name || i.productId])]) + field('Quantity', 'qty', '1', 'number', 'min="1" required') + select('Reason', 'reason', [['', 'Select reason'], ['Wrong item', 'Wrong item'], ['Damaged or quality issue', 'Damaged or quality issue'], ['Other', 'Other']]) + area('Explain the problem (synthetic details)', 'detail') + check('I understand eligibility and inspection are pending', 'acknowledged'), 'Submit request for review')}${link('Refund status', 'customer/refund')}`),
  sc(29, 'refund', 'Refund progress', 'Customer_Orders', ['ORD-06'], 'Separate requested/pending/completed money evidence and stable reference.', ['normal', 'loading', 'network', 'refund-delayed', 'session'], ctx => `${panel('Refund status', `<p>Order ${h(ctx.state.order.id)} · ${badge(ctx.scenario === 'refund-delayed' ? 'Pending' : ctx.state.order.refund)}</p><p>Refund reference: ${h(ctx.state.order.refundReference || 'Awaiting Finance instruction')}</p><p>${ctx.scenario === 'refund-delayed' || ctx.state.order.refund === 'Pending' ? 'Provider outcome is pending. Finance checks this same reference. No new refund or fixed arrival promise is created by refresh.' : ctx.state.order.refund === 'Completed' ? 'Finance has recorded the synthetic trusted completion result. Settlement and credit-note review remain separate.' : 'A cancellation or return request does not prove completed payout. Finance must verify paid amount, authority and destination.'}</p><p>${ctx.state.order.method === 'cod' ? 'COD destination: awaiting an approved verified destination contract; do not supply real bank details here.' : 'Destination: original eligible payment route, subject to approved provider rules.'}</p>`)}${actions(button('Refresh refund progress', 'customer.refresh-refund'), link('Order details', 'customer/order-detail'))}`),
  sc(30, 'invoice', 'Invoice and billing evidence', 'Customer_Orders', ['ORD-03', 'FIN-02'], 'Download a clearly marked synthetic issued invoice only after current billing gates.', ['normal', 'loading', 'network', 'permission', 'session'], ctx => `${panel('Invoice', `<p>Order ${h(ctx.state.order.id)} · ${ctx.state.order.payment === 'Paid' || ctx.state.order.delivery === 'Delivered' ? 'Demo invoice available' : 'Invoice pending billing evidence'}</p><p>Seller: synthetic licensed store · customer: ${h(ctx.state.customer.name || 'Incomplete profile')} · accepted total ${money(ctx.state.order.total)}</p><p>GSTIN, tax splits, numbering and final invoice format require Finance approval. The downloaded artifact is marked SAMPLE / NOT A TAX INVOICE.</p>`)}${linesTable(ctx.state, items(ctx.state))}${actions(button('Download sample invoice', 'customer.download-invoice'), link('Order history', 'customer/orders'))}`),
];

const publicActions = new Set(['customer.request-otp', 'customer.resend-otp', 'customer.verify-otp', 'customer.otp-fallback', 'customer.search', 'customer.search-suggestion', 'customer.category', 'customer.view-product', 'customer.check-pin', 'customer.add-cart', 'customer.cart-qty', 'customer.remove-cart', 'customer.choose-alternative']);
const mutationActions = new Set(['customer.request-otp', 'customer.resend-otp', 'customer.verify-otp', 'customer.save-profile', 'customer.save-address', 'customer.add-family', 'customer.save-consent', 'customer.request-deletion', 'customer.wishlist-add', 'customer.wishlist-remove', 'customer.add-cart', 'customer.cart-qty', 'customer.remove-cart', 'customer.checkout-address', 'customer.checkout-patient', 'customer.accept-summary', 'customer.upload-rx', 'customer.reuse-rx', 'customer.accept-revision', 'customer.pay', 'customer.cancel-order', 'customer.request-return']);
function changedCart(ctx) {
  ctx.state.order.quoteAccepted = false;
  ctx.state.order.customerAccepted = false;
  ctx.state.cartVersion = (ctx.state.cartVersion || 0) + 1;
}
function holdStock(ctx) {
  const s = ctx.state, o = s.order;
  if (ctx.scenario === 'out-of-stock' || ctx.scenario === 'stock-expired') { ctx.notice('Eligible stock is unavailable or expired. No new hold was created.', 'error'); return false; }
  const eligible = (s.inventory || []).filter(lot => lot.eligible && lot.qty > 0 && lot.expiry >= new Date().toISOString().slice(0, 10));
  const sites = ['Demo Store 01']; // Only this seeded dispensing site is explicitly eligible; warehouse fallback awaits approval.
  const site = sites.find(site => o.items.every(i => eligible.filter(lot => lot.site === site && lot.productId === i.productId).reduce((sum, lot) => sum + Number(lot.qty), 0) >= i.qty));
  if (!site) { ctx.notice('No single eligible demo location can supply every accepted line. Operations must resolve the shortage; no silent split or stock hold was created.', 'error'); return false; }
  o.site = site; o.stock = 'Active'; o.hold = 'Active'; return true;
}
function logged(ctx) {
  if (!ctx.state.customer.loggedIn) { ctx.notice('Sign in to continue with your own account.', 'error'); ctx.go('customer/login'); return false; }
  if (!ctx.state.customer.profileComplete) { ctx.notice('Complete your profile name before checkout.', 'warning'); ctx.go('customer/profile'); return false; }
  return true;
}
function validCart(ctx) {
  const s = ctx.state;
  if (!s.cart.length) { ctx.notice('Your cart is empty. Add a product before checkout.', 'error'); return false; }
  if (ctx.scenario === 'out-of-stock' || s.cart.some(i => !stockAvailable(getProduct(s, i.productId), ctx) || !Number.isInteger(i.qty) || i.qty < 1 || i.qty > getProduct(s, i.productId).stock)) { ctx.notice('An item, classification or quantity is unavailable. Update the cart before continuing.', 'error'); return false; }
  if (subtotal(s) < Number(s.settings.minimum || 0)) { ctx.notice(`Items must total at least ${money(s.settings.minimum)} under the illustrative configuration. Update the cart.`, 'error'); return false; }
  return true;
}
function addHistory(ctx, message) {
  ctx.state.order.history ||= [];
  ctx.state.order.history.push(message);
  ctx.record(message);
}
function acceptPayment(ctx) {
  const o = ctx.state.order;
  o.payment = 'Paid';
  o.providerCaptured = true;
  if (o.stock !== 'Active' && o.stock !== 'Committed') {
    o.status = 'Payment received · stock recovery';
    addHistory(ctx, 'Trusted payment received after hold release; Operations/Finance recovery required');
  } else {
    o.stock = 'Committed'; o.hold = 'Committed'; o.status = 'Confirmed';
    addHistory(ctx, 'Synthetic trusted provider evidence verified; order confirmed');
  }
}

function handle(action, data, ctx) {
  if (!action.startsWith('customer.')) return false;
  const s = ctx.state, c = s.customer, o = s.order;
  const fail = (message, kind = 'error') => { ctx.notice(message, kind); return true; };
  const save = message => { ctx.save(message); return true; };
  const go = route => { ctx.go(route); return true; };
  if (ctx.scenario === 'loading') return fail('This action is still loading. Return to Normal or retry after the response is available.', 'info');
  if (ctx.scenario === 'session' && !publicActions.has(action)) return fail('Your session expired. Sign in again; existing order and payment references are preserved.');
  if (ctx.scenario === 'permission' && !publicActions.has(action)) return fail('This action is not available for this account or patient. No unrelated record is disclosed.');
  if (ctx.scenario === 'network' && !['customer.save-address', 'customer.signout'].includes(action)) return fail('Connection unavailable. Nothing new was submitted. Reopen the current reference when connected.');
  if (ctx.scenario === 'validation' && mutationActions.has(action)) return fail('Required information is invalid in this demonstration scenario. Correct the form and return to Normal to submit.');
  if (ctx.scenario === 'conflict' && mutationActions.has(action)) return fail('The record changed in another session. Reload the accepted version before resubmitting; no accepted change was overwritten.');
  if (!publicActions.has(action) && action !== 'customer.signout' && !c.loggedIn) { ctx.go('customer/login'); return fail('Sign in to access your account.'); }
  switch (action) {
    case 'customer.request-otp': {
      const phone = String(data.phone || '').replace(/\s/g, '');
      if (!/^\d{10}$/.test(phone)) return fail('Enter a valid 10-digit synthetic mobile number.');
      if (!data.consent) return fail('Read and acknowledge privacy notice DEMO-v1 before requesting a code.');
      if (ctx.scenario === 'rate-limit') return fail('Code request rate limit reached. Retry only when the configured window allows it.');
      c.phone = phone; c.consent = true; c.consentVersion = 'DEMO-v1'; c.otpRequested = true; c.otpConsumed = false;
      c.otpDelivery = ctx.scenario === 'otp-delivery' ? 'WhatsApp pending' : ctx.scenario === 'otp-fallback' ? 'SMS fallback delivered (demo)' : 'WhatsApp delivered (demo)';
      ctx.record('Customer requested one synthetic OTP challenge'); ctx.save('Demo code request recorded.'); return go('customer/otp');
    }
    case 'customer.resend-otp':
      if (ctx.scenario === 'rate-limit') return fail('Request is rate limited; no additional challenge was created.');
      if (!c.phone) return go('customer/login');
      c.otpRequested = true; c.otpConsumed = false; c.otpFresh = true; c.otpDelivery = ctx.scenario === 'otp-delivery' ? 'WhatsApp pending' : 'Replacement challenge delivered (demo)';
      return save('Replacement demo challenge requested; the previous challenge is superseded.');
    case 'customer.otp-fallback':
      if (!c.otpRequested) return fail('Request a code first.');
      if (ctx.scenario === 'rate-limit') return fail('Fallback retry is rate limited.');
      c.otpDelivery = 'SMS fallback delivered (demo)'; return save('Same demo challenge delivered through configured SMS fallback once.');
    case 'customer.verify-otp':
      if (c.loggedIn && c.otpConsumed) return go(c.profileComplete ? 'customer/home' : 'customer/profile');
      if (!c.otpRequested) return fail('Request a code before verification.');
      if (ctx.scenario === 'rate-limit') return fail('Too many verification attempts. No session created.');
      if (ctx.scenario === 'otp-expired' && !c.otpFresh) return fail('Code expired or superseded. Request another code.');
      if (ctx.scenario === 'otp-wrong' || String(data.otp || '') !== String(s.demoOtp)) return fail('Code could not be verified. Check the six digits or request a new code.');
      if (ctx.scenario === 'otp-delivery' && c.otpDelivery !== 'SMS fallback delivered (demo)') return fail('Delivery is still pending. Check the configured fallback or request a replacement.');
      c.loggedIn = true; c.otpConsumed = true; establishSession(s,{identityId:'USR-DEMO-CUSTOMER',role:'Customer',method:'OTP',workspace:'customer'}); ctx.record('Unified identity service established a customer OTP session'); ctx.save('Signed in to the customer workspace.'); return go(c.profileComplete ? 'customer/home' : 'customer/profile');
    case 'customer.save-profile': {
      const name = String(data.name || '').trim(), email = String(data.email || '').trim(), phone = String(data.phone || '').replace(/\s/g, '');
      if (!name || name.length > 100) return fail('Enter a full name between 1 and 100 characters.');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Enter a valid email or leave the optional email blank.');
      if (!/^\d{10}$/.test(phone)) return fail('Enter a valid 10-digit synthetic mobile number.');
      const hadProfile = c.profileComplete;
      c.name = name; c.profileComplete = true;
      if (hadProfile && email !== c.email) c.emailPending = email || '(requested removal)';
      else if (!hadProfile) c.email = email;
      if (phone !== c.phone) { c.contactPending = phone; return save('Profile saved. Replacement mobile is pending approved proof; verified mobile preserved.'); }
      return save(c.emailPending ? 'Profile saved. Changed email awaits approved verification; existing contact preserved.' : 'Profile saved. You can continue to checkout.');
    }
    case 'customer.signout': c.loggedIn = false; revokeSession(s); ctx.save('Signed out; local synthetic history retained.'); return go('customer/login');
    case 'customer.save-address': {
      const pin = String(data.pin || '').trim(), line = String(data.line || '').trim(), label = String(data.label || '').trim();
      if (!label || line.length < 5 || !/^\d{6}$/.test(pin)) return fail('Enter an address label, street address (at least five characters) and a six-digit PIN.');
      const serviceable = ctx.scenario === 'network' ? null : ctx.scenario === 'invalid-address' || data.mapPin === 'Outside demo area' ? false : pin === '000000';
      const a = {id: `ADDR-${Date.now()}`, label, line, pin, mapPin: String(data.mapPin || 'Block A'), serviceable};
      c.addresses.push(a);
      return save(serviceable === true ? 'Address saved; demo coverage available. Checkout rechecks it.' : serviceable === null ? 'Address saved. Coverage is unknown while the provider is unavailable; checkout remains blocked.' : 'Address saved outside the synthetic service area. Choose a covered destination to checkout.');
    }
    case 'customer.select-address':
    case 'customer.checkout-address': {
      if (!logged(ctx)) return true;
      const a = c.addresses.find(a => a.id === data.addressId);
      if (!a) return fail('Select an address owned by this customer.');
      if (a.serviceable !== true || ctx.scenario === 'invalid-address') return fail('Coverage is unavailable or not confirmed. Select a serviceable address.');
      o.addressId = a.id; o.quoteAccepted = false; ctx.save('Delivery address selected.'); return go('customer/checkout-patient');
    }
    case 'customer.recheck-address':
      c.addresses.forEach(a => { a.serviceable = ctx.scenario !== 'invalid-address' && a.pin === '000000' && a.mapPin !== 'Outside demo area'; });
      return save('Coverage checked against synthetic fixtures. No stock has been reserved.');
    case 'customer.add-family': {
      const name = String(data.name || '').trim(), age = Number(data.age);
      if (!name || name.length > 100 || data.age === '' || !Number.isInteger(age) || age < 0 || age > 130 || !['Child', 'Parent', 'Spouse', 'Other dependent'].includes(data.relation) || !data.authorized) return fail('Enter a patient name, age from 0 to 130, relation and explicit authorization.');
      c.family.push({id: `PAT-${Date.now()}`, name, age, relation: data.relation}); return save('Owned family profile added. Select it explicitly for the prescription order.');
    }
    case 'customer.select-patient':
      if (!ownsPatient(s, data.patientId)) return fail('Select an owned patient.');
      o.patientId = data.patientId; o.quoteAccepted = false; return save('Patient selected. Prescription evidence must match this patient.');
    case 'customer.checkout-patient':
      if (!logged(ctx)) return true;
      if (!ownsPatient(s, data.patientId) || !data.confirmed) return fail('Select self or an owned family member and confirm the patient.');
      if (o.patientId !== data.patientId && s.rx.uploaded) { s.rx.status = 'Pending'; o.review = 'Pending'; s.rx.uploaded = false; }
      o.patientId = data.patientId; o.quoteAccepted = false; ctx.save('Patient confirmed.'); return go('customer/checkout-summary');
    case 'customer.save-consent':
      c.consent = Boolean(data.consent); c.marketing = Boolean(data.marketing); c.consentVersion = 'DEMO-v1'; ctx.record('Customer explicit DEMO-v1 consent choices recorded'); return save('Current notice choices recorded. Optional marketing remains separate.');
    case 'customer.request-deletion':
      if (!data.acknowledged) return fail('Acknowledge the privacy review process before submitting.');
      if (c.deletion && c.deletion !== 'Not requested') return save('Existing deletion review request reopened; no duplicate request created.');
      ctx.confirm('Submit account deletion request?', 'This sends a synthetic privacy review request. Held records stay retained pending authorized review.', () => { c.deletion = 'Pending privacy and retention review'; ctx.record('Customer privacy deletion request recorded'); ctx.save('Deletion request acknowledged; review pending.'); }); return true;
    case 'customer.wishlist-add':
      if (!getProduct(s, data.productId)) return fail('This product is unavailable.');
      if (!c.wishlist.includes(data.productId)) c.wishlist.push(data.productId);
      return save('Product saved once to your wishlist.');
    case 'customer.wishlist-remove': c.wishlist = c.wishlist.filter(id => id !== data.productId); return save('Removed from wishlist.');
    case 'customer.view-product':
      if (!getProduct(s, data.productId)) return fail('Product is unavailable.');
      s.selectedProduct = data.productId; return go('customer/product');
    case 'customer.search': s.search = String(data.query || '').trim();s.searchClass=String(data.searchClass||'');s.searchSort=String(data.searchSort||'relevant'); return go('customer/search');
    case 'customer.search-suggestion': s.search = String(data.query || ''); return go('customer/search');
    case 'customer.category': s.category = String(data.category || ''); s.productClass = String(data.productClass || ''); return go('customer/categories');
    case 'customer.check-pin':
      if (!/^\d{6}$/.test(String(data.pin || ''))) return fail('Enter a six-digit PIN.');
      s.locationPin = data.pin; s.locationMessage = data.pin === '000000' && ctx.scenario !== 'invalid-address' ? 'Demo delivery coverage available. Product and batch stock will be rechecked at checkout.' : 'Outside the synthetic delivery area. Ordering is blocked for this destination.'; return save('Demo location checked.');
    case 'customer.choose-alternative': {
      const original = chosen(s), candidate = getProduct(s, data.productId);
      if (!original || !candidate || candidate.composition !== original.composition || candidate.strength !== original.strength || candidate.form !== original.form) return fail('Candidate does not match the exact composition, strength and form.');
      s.selectedProduct = candidate.id; s.alternativeChosen = true; ctx.save('Candidate selected explicitly; P medicines still need current pharmacist review.'); return go('customer/product');
    }
    case 'customer.add-cart': {
      const p = getProduct(s, data.productId);
      if (!stockAvailable(p, ctx)) return fail('This product is unavailable or its classification is unapproved. No item added.');
      if (submitted(o) && !['Draft', 'Cancelled'].includes(o.status)) return fail('The current demo order is already submitted. Reopen its status; reset the demo to start a new purchase.');
      const existing = s.cart.find(i => i.productId === p.id);
      if ((existing?.qty || 0) + 1 > p.stock) return fail('Quantity exceeds indicative stock.');
      if (existing) existing.qty++; else s.cart.push({productId: p.id, qty: 1});
      changedCart(ctx); return save('Added to cart. Exact price, stock and prescription requirements are rechecked at checkout.');
    }
    case 'customer.cart-qty': {
      if (submitted(o) && !['Draft', 'Cancelled'].includes(o.status)) return fail('Submitted order cannot be edited without an approved revision.');
      const line = s.cart.find(i => i.productId === data.productId), p = getProduct(s, data.productId), delta = Number(data.delta);
      if (!line || !p || ![-1, 1].includes(delta)) return fail('Select a valid cart line and quantity change.');
      if (line.qty + delta < 1 || line.qty + delta > p.stock) return fail('Quantity must be at least one and within current indicative stock. Use Remove to delete a line.');
      line.qty += delta; changedCart(ctx); return save('Quantity updated. Previous quote acceptance cleared.');
    }
    case 'customer.remove-cart':
      if (submitted(o) && !['Draft', 'Cancelled'].includes(o.status)) return fail('Submitted order cannot be edited without an approved revision.');
      s.cart = s.cart.filter(i => i.productId !== data.productId); changedCart(ctx); return save('Cart line removed. Minimum and total will be rechecked.');
    case 'customer.accept-summary': {
      if (!logged(ctx)) return true;
      if (submitted(o) && !['Draft', 'Cancelled'].includes(o.status) && o.quoteAccepted && o.quoteFingerprint === quoteKey(s) && !(ctx.scenario === 'price-change' && !o.priceChangeApplied)) {
        if (['Pending', 'Paid'].includes(o.payment)) return go('customer/payment-result');
        if (hasP(s) && o.review !== 'Approved') return go('customer/prescription-status');
        if (o.stock !== 'Active' && !holdStock(ctx)) return true;
        o.status = 'Awaiting payment'; return go('customer/payment');
      }
      if (!data.accepted) return fail('Explicitly accept the displayed items, patient, destination and total.');
      if (!validCart(ctx)) return true;
      if (!address(s) || address(s).serviceable !== true || ctx.scenario === 'invalid-address') return fail('Choose an owned, serviceable address before accepting checkout.');
      if (!ownsPatient(s, o.patientId)) return fail('Select the correct authorized patient.');
      if (['Pending', 'Paid'].includes(o.payment)) return go('customer/payment-recovery');
      const sameClinical = clinicalKey(s, o.items || [], o.patientId) === clinicalKey(s, s.cart, o.patientId);
      const currentReview = o.review === 'Approved' && (o.reviewRevision == null || Number(o.reviewRevision) === Number(o.revision)) && (!o.reviewPatientId || o.reviewPatientId === o.patientId);
      applyPriceChange(ctx);
      o.items = s.cart.map(i => ({...i})); o.total = total(s); o.quoteFingerprint = quoteKey(s); o.quoteAccepted = true; o.customerAccepted = true; o.customerSubmitted = true; o.revision = Number(o.revision || 0) + 1;
      if (!sameClinical) { o.review = 'Pending'; s.rx.uploaded = false; s.rx.status = 'Pending'; o.reviewLines = []; }
      else if (currentReview) { o.reviewRevision = o.revision; o.reviewPatientId = o.patientId; }
      if (hasP(s)) {
        if (!s.rx.uploaded || s.rx.patientId !== o.patientId) { o.review = 'Pending'; o.status = 'Awaiting prescription'; o.stock = 'Not held'; ctx.save('Summary accepted; prescription evidence required before payment.'); return go('customer/prescription-upload'); }
        if (o.review !== 'Approved') { o.status = 'Awaiting pharmacist review'; ctx.save('Summary accepted; waiting for current pharmacist decision.'); return go('customer/prescription-status'); }
      } else { o.review = 'Approved'; o.reviewRevision = o.revision; o.reviewPatientId = o.patientId; }
      if (!holdStock(ctx)) { ctx.save('Summary accepted; waiting for eligible stock.', 'info'); return true; }
      o.status = 'Awaiting payment'; addHistory(ctx, 'Customer accepted current checkout revision; synthetic stock hold active'); ctx.save('Summary accepted and demo stock held.'); return go('customer/payment');
    }
    case 'customer.upload-rx': {
      if (!ownsPatient(s, data.patientId) || data.patientId !== o.patientId || !data.confirmed) return fail('Select the current order patient and confirm ownership. Correct patient selection at checkout if needed.');
      const names = String(data.fileName || '').split(',').map(n => n.trim());
      if (!names.length || names.some(n => !n || !/\.(jpe?g|png|pdf)$/i.test(n))) return fail('Enter synthetic JPG, PNG or PDF filenames, separated by commas. No file contents are read.');
      if (['unreadable', 'prescription-missing'].includes(ctx.scenario)) return fail('This evidence is missing or unreadable. Replace the synthetic filename and retry in Normal; approval remains blocked.');
      if (['Pending', 'Paid'].includes(o.payment)) return fail('Payment already started. A changed prescription needs an approved order-recovery review.');
      s.rx = {...s.rx, uploaded: true, patientId: data.patientId, status: 'Pending', fileName: names.join(', ')};
      o.review = 'Pending'; o.status = 'Awaiting pharmacist review'; o.customerAccepted = true; o.stock = 'Not held'; o.hold = 'Not held';
      addHistory(ctx, 'Synthetic prescription metadata submitted; current pharmacist review required'); ctx.save('Prescription metadata submitted for review.'); return go('customer/prescription-status');
    }
    case 'customer.reuse-rx':
      if (!ownsPatient(s, o.patientId)) return fail('Choose a patient before reusing a saved prescription.');
      if (!s.rx.uploaded || s.rx.patientId !== o.patientId || s.rx.status === 'Rejected') return fail('No valid saved evidence for this patient. Upload synthetic evidence; no prior approval is inherited.');
      s.rx.status = 'Pending'; o.review = 'Pending'; o.status = 'Awaiting pharmacist review'; ctx.save('Saved evidence queued for fresh patient and validity review.'); return go('customer/prescription-status');
    case 'customer.deferred-rx': return fail('Deferred upload / automatic cancellation is blocked pending RX-02 and D-004 approval. Upload before review and payment.');
    case 'customer.refresh-review': return save('Current review reloaded. Only an authorized pharmacist can record clinical approval.');
    case 'customer.review-continue':
      if (reviewStatus(ctx) === 'Partial') return go('customer/revised-order');
      if (reviewStatus(ctx) !== 'Approved') return fail('Current prescription approval is required before payment. Correct evidence or await the pharmacist.');
      if (!s.cart.length && o.items?.length) s.cart = o.items.map(i => ({...i}));
      if (!o.quoteAccepted || o.quoteFingerprint !== quoteKey(s)) return go('customer/checkout-summary');
      if (!validCart(ctx)) return true;
      if (['Pending', 'Paid'].includes(o.payment)) return go('customer/payment-result');
      if (!holdStock(ctx)) return true;
      o.status = 'Awaiting payment'; ctx.save('Current approved order passed the synthetic stock check.'); return go('customer/payment');
    case 'customer.accept-revision': {
      if (!data.accepted) return fail('Review and explicitly accept the eligible revised order.');
      if (ctx.scenario === 'prescription-partial' && o.review !== 'Partial') return fail('This scenario previews a partial decision. A pharmacist must record the permitted line decision in the Pharmacy workspace first.');
      if (!['Approved', 'Partial'].includes(o.review)) return fail('There is no permitted clinical revision available to accept.');
      if (o.reviewRevision != null && Number(o.reviewRevision) !== Number(o.revision)) return fail('The pharmacist decision belongs to an older revision. Request current review before accepting changed clinical lines.');
      if (['Pending', 'Paid'].includes(o.payment)) return fail('Payment has already started. Recover the current order before changing its terms.');
      const eligible = proposedLines(s).filter(i => getProduct(s, i.productId)?.approved !== false);
      if (!eligible.length) return fail('No approved eligible items remain. Replace prescription evidence or return to the cart.');
      const oldCart = s.cart;
      s.cart = eligible.map(i => ({...i}));
      if (!validCart(ctx)) { s.cart = oldCart; return true; }
      applyPriceChange(ctx);
      o.items = eligible.map(i => ({...i})); o.customerAccepted = true; o.quoteAccepted = true; o.total = total(s); o.revision = Number(o.revision || 0) + 1; o.quoteFingerprint = quoteKey(s);
      o.review = 'Approved'; o.reviewRevision = o.revision; o.reviewPatientId = o.patientId; o.customerSubmitted = true;
      if (o.partialProposal) o.partialProposal.status = 'Accepted';
      if (!holdStock(ctx)) { ctx.save('Revision accepted; eligible stock check remains blocked.', 'info'); return true; }
      o.status = 'Awaiting payment'; addHistory(ctx, 'Customer explicitly accepted eligible revised order; rejected lines excluded'); ctx.save('Eligible revised basket accepted.'); return go('customer/payment');
    }
    case 'customer.pay': {
      if (!logged(ctx)) return true;
      if (o.payment === 'Paid' || o.payment === 'Pending' || (o.method === 'cod' && o.status === 'Confirmed')) return go('customer/payment-result');
      if (!o.quoteAccepted || !o.customerAccepted || o.quoteFingerprint !== quoteKey(s)) return fail('Your accepted quote is missing or stale. Reopen checkout summary before payment.');
      if (ctx.scenario === 'stock-expired') { o.stock = 'Released'; o.hold = 'Released'; ctx.save('Unused demo hold released once.'); return fail('The stock hold expired. Recheck current stock at the accepted summary; do not retry uncertain money.'); }
      if (!validCart(ctx)) return true;
      if (hasP(s, o.items) && (o.review !== 'Approved' || !s.rx.uploaded || s.rx.patientId !== o.patientId || Number(o.reviewRevision) !== Number(o.revision) || o.reviewPatientId !== o.patientId)) return fail('Current matching prescription approval and revision are required for P lines.');
      if (o.stock !== 'Active') return fail('A valid stock hold is required before starting payment. Reopen checkout summary.');
      if (!['upi', 'card', 'netbanking', 'cod'].includes(data.method)) return fail('Choose a supported payment method.');
      if (data.method === 'cod' && !data.codEligible) return fail('COD has no approved production cap/refusal policy. Explicitly enable the synthetic eligibility fixture or choose online payment.');
      o.method = data.method === 'cod' ? 'cod' : 'online'; o.paymentInstrument = data.method;
      if (!o.paymentAttempt || o.payment === 'Failed') { o.paymentAttemptSeq = Number(o.paymentAttemptSeq || 0) + 1; o.paymentAttempt = `PAY-${o.id}-${o.paymentAttemptSeq}`; }
      if (data.method === 'cod') {
        o.status = 'Confirmed'; o.payment = 'Not started'; o.stock = 'Committed'; o.hold = 'Committed'; o.codCollected = 0; o.codEligible = true; addHistory(ctx, 'Demo-eligible COD order confirmed; cash remains due at delivery');
      } else if (ctx.scenario === 'payment-declined') {
        o.payment = 'Failed'; o.status = 'Payment failed'; addHistory(ctx, 'Synthetic provider returned final payment decline');
      } else if (['payment-pending', 'confirmation-lost'].includes(ctx.scenario)) {
        o.payment = 'Pending'; o.providerCaptured = ctx.scenario === 'confirmation-lost'; o.status = 'Checking payment'; addHistory(ctx, 'Payment result pending on original reference; new charge blocked');
      } else acceptPayment(ctx);
      ctx.save('Synthetic payment attempt recorded once.'); return go('customer/payment-result');
    }
    case 'customer.retry-payment':
      if (o.payment !== 'Failed') return fail('Retry is allowed only after a final decline. Pending or paid attempts must use the existing reference.');
      return go('customer/payment');
    case 'customer.reconcile-payment':
      if (o.payment === 'Paid') return save('Trusted success already recorded. Repeated checks do not charge again.');
      if (ctx.scenario === 'stock-expired') {
        o.stock = 'Released'; o.hold = 'Released'; o.payment = 'Pending'; o.status = 'Payment/stock recovery'; return save('Expired hold remains released. Finance and Operations must reconcile the existing attempt; no automatic stock recreation.');
      }
      if (ctx.scenario === 'payment-pending') { o.payment = 'Pending'; return save('Provider still reports pending on the same reference. No new payment was created.'); }
      if (o.providerCaptured || (ctx.scenario === 'confirmation-lost' && o.paymentAttempt)) { acceptPayment(ctx); return save('Original captured payment verified against synthetic provider evidence. No second charge.'); }
      if (!o.paymentAttempt) return fail('No payment attempt exists for this order. Complete checkout gates before starting one.');
      return save('Original attempt checked. No trusted capture evidence available; its current status is preserved for Finance review.');
    case 'customer.refresh-tracking': return save('Latest recorded delivery milestone shown. Location is schematic; no provider call made.');
    case 'customer.masked-call':
      if (!o.riderId || !['Assigned', 'Accepted', 'Picked up', 'Out for delivery'].includes(o.delivery)) return fail('Masked contact is available only for the currently assigned active delivery.');
      return fail('Synthetic masked contact session opened for the assigned rider. No real phone number is exposed or called.', 'info');
    case 'customer.cancel-order':
      if (!data.reason || !data.acknowledged) return fail('Choose a cancellation reason and acknowledge separate refund processing.');
      if (o.status === 'Cancelled') return save('Existing cancellation reopened. No duplicate release or refund request.');
      if (o.payment === 'Pending') return fail('Payment is uncertain. Recover the existing payment result before cancellation or financial compensation.');
      if (['Packed', 'Handed over'].includes(o.pack) || ['Picked up', 'Out for delivery', 'Delivered'].includes(o.delivery)) return fail('The latest packing/delivery milestone blocks customer cancellation. Support can review available options.');
      if (!o.items?.length) return fail('No submitted order exists to cancel.');
      ctx.confirm('Cancel this order?', 'Current pre-packed eligibility will be rechecked. Paid money follows separate Finance refund review.', () => {
        if (['Packed', 'Handed over'].includes(o.pack) || ['Picked up', 'Out for delivery', 'Delivered'].includes(o.delivery)) { ctx.notice('Packing changed before confirmation. Cancellation was not accepted.', 'error'); return; }
        o.status = 'Cancelled'; o.note = String(data.reason); if (o.stock === 'Active') { o.stock = 'Released'; o.hold = 'Released'; }
        if (o.stock === 'Committed') o.note += ' · committed stock compensation pending Operations';
        if (o.payment === 'Paid') o.refund = 'Requested';
        addHistory(ctx, 'Customer pre-packed cancellation accepted; refund/stock compensation reviewed separately'); ctx.save('Order cancelled. Applicable refund review remains separate.'); ctx.go('customer/order-detail');
      }); return true;
    case 'customer.request-return': {
      const line = items(s).find(i => i.productId === data.productId), qty = Number(data.qty);
      if (o.delivery !== 'Delivered') return fail('Return requests require a delivered order. Use cancellation or support for an undelivered order.');
      if (!line || !Number.isInteger(qty) || qty < 1 || qty > line.qty || !data.reason || !data.acknowledged) return fail('Select an ordered item, valid received quantity, reason and eligibility-review acknowledgement.');
      if (o.returnStatus && o.returnStatus !== 'Not requested') return save('Existing return request reopened; no duplicate receipt or refund created.');
      s.returnCases ||= [];const returnId=`RTN-${o.id}-${String(s.returnCases.length+1).padStart(2,'0')}`;const returnCase={id:returnId,orderId:o.id,customerId:'USR-DEMO-CUSTOMER',productId:data.productId,qty,reason:String(data.reason),detail:String(data.detail||''),status:'Awaiting eligibility review',eligibility:'Pending owner policy review',refundStatus:'Not reviewed',history:[{time:new Date().toISOString(),message:'Customer return request submitted; owner policy review pending.'}]};s.returnCases.unshift(returnCase);o.returnStatus='Requested';o.returnCaseId=returnId;o.returnRequest = {productId: data.productId, qty, reason: String(data.reason), detail: String(data.detail || '')}; addHistory(ctx, `Return request ${returnId} submitted; eligibility and inspection pending`);ctx.publish?.('Return request',returnId,`Return request ${returnId} is waiting for owner eligibility review`,'Support');return save('Return request recorded for eligibility review. No refund or saleable stock was created.');
    }
    case 'customer.refresh-refund': return save('Current recorded refund state shown. Refresh does not submit another refund instruction.');
    case 'customer.edit-placed-order': return fail('Post-order item and address edits are blocked pending ORD-09 / D-010 approval. Existing accepted terms remain unchanged.');
    case 'customer.download-invoice':
      if (o.payment !== 'Paid' && o.delivery !== 'Delivered') return fail('Invoice is pending billing evidence. You will not be charged again to issue a document.');
      ctx.download(`SAMPLE-${o.id}-invoice.txt`, `SAMPLE / NOT A TAX INVOICE\nSynthetic Pharmville wireframe\nOrder: ${o.id}\nCustomer: ${c.name}\nTotal: ${o.total}\nTax details and final format awaiting Finance approval.\n` + items(s).map(i => `${getProduct(s, i.productId)?.name || i.productId}: ${i.qty}`).join('\n'), 'text/plain');
      ctx.record('Customer downloaded synthetic sample invoice'); return true;
    default: return false;
  }
}



return {screens, handle};
})();

/* --- operations/screens.js --- */
__modules["operations/screens.js"] = (function() {
"use strict";
const {h, link, button, field, select, form, table, badge, panel, notice, money, timeline, empty} = __modules["shared/ui.js"];
const {establishSession, revokeSession} = __modules["shared/mock-domain.js"];


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

const screens = [
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

function handle(action, data, ctx) {
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


return {screens, handle};
})();

/* --- staff/screens.js --- */
__modules["staff/screens.js"] = (function() {
"use strict";
const {h, link, button, field, select, form, table, badge, panel, notice, money, timeline, empty} = __modules["shared/ui.js"];

// Synthetic records only. These interactions illustrate reviewed UI gates, not production policy.
const common = ['normal','loading','empty','network','permission','session'];
const options = values => values.map(value => [value,value]);
const roles = ['Super Admin','Central Admin','CMS Manager','Catalog Manager','Ops Manager','Store Manager','Store Staff','Warehouse Manager','Warehouse Staff','Inventory Controller','Licensed Pharmacist','Delivery/Ops Manager','Delivery Rider','Finance Manager','Finance Executive','Auditor'];
const names = {admin:'Admin_CMS',orders:'Order_Operations',inventory:'Inventory',finance:'Finance_Payments',reporting:'Reporting',audit:'Audit',notifications:'Notifications',support:'Notifications'};
function local(state) {
  const opening = () => state.inventory.map(b=>({id:`OPEN-FIXTURE-${b.id}`,inventoryId:b.id,site:b.site,batch:b.batch,qty:Number(b.qty)-(state.inventoryMovements||[]).filter(m=>m.inventoryId?m.inventoryId===b.id:m.batch===b.batch&&(!m.site||m.site===b.site)).reduce((n,m)=>n+Number(m.qty),0),reason:'Synthetic starting balance fixture'})).filter(m=>m.qty!==0);
  state.staffUi ||= {staffSearch:'',orderSearch:'',orderFilter:'All',auditSearch:'',locationSearch:'',ledger:opening(),importRows:[],importKind:'catalog',importId:'',importApplied:[],refunds:[],refundAmount:'',refundReason:'',refundDestination:'',refundVerified:false,invoice:'',invoiceStatus:'Pending tax approval',creditReason:'',creditAmount:0,reportFrom:'2026-10-01',reportTo:'2026-10-23',reportSite:'Current location',catalogDraft:null,settingsDraft:null,locations:[],cases:[],alertRead:false,adjustment:null};
  return state.staffUi;
}
function val(data,key) { return String(data[key] ?? '').trim(); }
function checked(value) { return value === true || value === 'on' || value === 'true'; }
function blocked(ctx) {
  const messages = {permission:'Permission denied. This command requires an authorized role and assigned location.',session:'Session expired. Restore the demo session before changing records.','access-revoked':'Access was revoked. Protected records and downloads are unavailable.',network:'Network unavailable. No command was accepted. Retry against the same record.',loading:'Evidence is still loading. Wait for the record before acting.',conflict:'This record has a newer version. Reload and compare changes before retrying.'};
  if (messages[ctx.scenario]) {ctx.notice(messages[ctx.scenario],'error');return true;}
  return false;
}
function generic(ctx) {
  const text = {loading:'Loading the current scoped record. Actions wait for authoritative evidence.',empty:'No matching records for this demonstration filter. Clear filters or return to Normal.',network:'The service is unavailable. Current local evidence is retained; reconnect and retry.',permission:'Access denied for this role/location. No protected command will change records.',session:'Your demo session has expired. Restore access to continue.','access-revoked':'Your export access was revoked. Download is denied even if the job was previously authorized.',validation:'Validation example: submit a blank or malformed field to see a specific correction.',duplicate:'Repeated command simulation: the existing intent/reference is reused without a second effect.',conflict:'A different editor accepted a newer version. Reload before submitting changes.','stale-stock':'Stock evidence is stale. Refresh evidence before reserving any batch.','stock-expired':'The earliest lot is expired/blocked. It must not contribute to available stock.','out-of-stock':'There is no eligible stock at this location. Do not create a hold.','payment-pending':'Payment is uncertain. Keep the existing reference and ask Finance to check; do not charge again.','confirmation-lost':'Payment acknowledgment was lost. Recover the existing payment reference; never create a second charge.','refund-delayed':'The refund instruction is pending with the simulated provider. Query the same intent instead of creating another payout.','cod-shortage':'The collected and deposited cash differ. Keep the shortage open while preserving delivery history.','report-failed':'Report generation failed. No downloadable result was created; correct/retry the same scope.','provider-error':'The external adapter failed. Business records remain unchanged; review and retry the same event.','short-receipt':'The destination receipt is short. Report dispatched and received quantities separately.'};
  const message=text[ctx.scenario];
  return message ? notice(message, ['duplicate','validation'].includes(ctx.scenario)?'info':'warning') + button('Return to normal / reload evidence','staff.recover') : '';
}
function view(ctx, body) {
  if (['permission','session','access-revoked','loading'].includes(ctx.scenario)) return generic(ctx) + panel('Recovery', '<p>No protected information is displayed in this state.</p>' + link('Staff dashboard','staff/dashboard'));
  if (ctx.scenario === 'empty') return generic(ctx) + empty('No matching work','Clear the filters to see work available to your team.',button('Clear filters','staff.clear-filters'));
  return generic(ctx)+body();
}
function definition(id,route,title,workspace,features,description,render,extras=[]) {
  return {id,route:`staff/${route}`,title,platform:'staff',workspace,module:names[workspace],features,description,scenarios:[...new Set([...common,...extras])],render:ctx=>view(ctx,()=>render(ctx))};
}
function orderCard(state) {
  const o=state.order;
  return table(['Order','Site','Status','Rx review','Payment','Stock','Packing','Delivery'],[[h(o.id),h(o.site||'Unallocated'),badge(o.status),badge(o.review),badge(o.payment),badge(o.stock),badge(o.pack),badge(o.delivery)]]) + '<p>'+link('Open order','staff/order-detail')+' '+link('Customer view',o.partialProposal?'customer/revised-order':'customer/order-detail')+'</p>';
}
function productName(state,id) { return state.products.find(p=>p.id===id)?.name || id; }
function orderLines(state) { return table(['Product','Quantity','Class','Price'],state.order.items.map(i=>{const p=state.products.find(p=>p.id===i.productId);return [h(p?.name||i.productId),h(i.qty),h(p?.class||'Unknown'),money(p?.price||0)];})); }
function scopedSites(state) {return [...new Set([state.location || 'Demo Store A',state.order.site || 'Demo Store A','Demo Warehouse'])];}
function inLocation(state,site) { return state.role==='Admin'||site===state.location; }
function ledgerRows(state) {return [...local(state).ledger,...(state.inventoryMovements||[])].filter(row=>inLocation(state,row.site||state.inventory.find(b=>b.id===row.inventoryId||b.batch===row.batch)?.site));}
function exportTSV(ctx,name,rows) {ctx.download(name,rows.map(row=>row.map(cell=>{const s=String(cell??'').replace(/[\t\r\n]/g,' '); return /^[=+@-]/.test(s)?"'"+s:s;}).join('\t')).join('\n'),'text/tab-separated-values;charset=utf-8');}
function staffList(ctx) {
  const s=ctx.state,u=local(s),people=s.staff.filter(p=>`${p.name} ${p.role} ${p.site}`.toLowerCase().includes(u.staffSearch.toLowerCase()));
  return form('staff.search-staff',field('Find name, role or site','query',u.staffSearch),'Search')+table(['Staff','Role','Location','Access','Action'],people.map(p=>[h(p.name),h(p.role)+(p.proposedRole?`<br>Requested: ${h(p.proposedRole)}`:''),h(p.site),badge(p.invitation|| (p.active?'Active':'Inactive')),button(p.active?'Deactivate + revoke sessions':'Reactivate','staff.toggle-staff',`data-id="${h(p.id)}"`)]))+panel('Invite fictional staff',form('staff.invite',field('Display name','name','','text','required')+field('Fictional email','email','','email','placeholder="person@example.test" required')+select('Role','role',options(roles),'Store Manager')+select('Assigned site','site',options(scopedSites(s))), 'Send local invitation'));
}

const screens = [
  definition('SCR-ADM-001','dashboard','Role and location dashboard','admin',['ADM-01'],'Role-scoped operational overview and actionable alerts.',ctx=>{
    const s=ctx.state;return panel('My location',`<p>Role: <strong>${h(s.role)}</strong> · Location: <strong>${h(s.location)}</strong>. Totals below describe the one shared synthetic order.</p>`)+orderCard(s)+panel('Work requiring attention',`<ul><li>Prescription: ${h(s.order.review)} — ${link('Review queue','pharmacy/queue')}</li><li>Payment: ${h(s.order.payment)} — ${link('Finance evidence','staff/payments')}</li><li>Delivery: ${h(s.order.delivery)} — ${link('Order attention queue','staff/orders')}</li></ul>`)+panel('Administration',link('Staff invitations','staff/staff')+' '+link('Roles and permissions','staff/permissions')+' '+link('Catalog and import','staff/catalog')+' '+link('Location masters','staff/locations')+' '+link('CMS editor','staff/cms')+' '+link('Settings and offers','staff/settings'))+panel('Operations',link('Order queue','staff/orders')+' '+link('Inventory','staff/inventory')+' '+link('Reports','staff/reports')+' '+link('Audit','staff/audit')+' '+link('Notifications','staff/notifications')+' '+link('Support triage','staff/support'));
  }),
  definition('SCR-ADM-002','staff','Staff invitations and session revocation','admin',['ADM-02'],'Invite, assign and deactivate scoped staff; revocation remains a demo.',staffList,['validation','duplicate']),
  definition('SCR-ADM-003','permissions','Roles and permissions','admin',['ADM-03'],'Review sixteen role labels and propose a scoped grant without self-escalation.',ctx=>panel('Access boundaries',notice('Role names are draft. A location grant never conveys clinical, tax or refund authority.')+table(['Role','Illustrative scope'],roles.map(r=>[h(r),h(['Auditor','Reporting analyst'].includes(r)?'Read/export within assigned scope':'Assigned module and location; privileged actions require separate approval')]))+form('staff.grant-role',select('Staff member','id',ctx.state.staff.map(p=>[p.id,p.name]))+select('Proposed role','role',options(roles))+field('Approval reference / reason','reason','','text','required')+'<p>Granting privileged authority to the current demo actor is blocked. Security must approve real permission definitions.</p>','Record scoped grant request')),['validation']),
  definition('SCR-ADM-004','cms','CMS draft and publication','admin',['ADM-04'],'Edit a draft, preview its version and publish with conflict handling.',ctx=>{
    const c=ctx.state.cms;return panel(`Content version ${Number(c.version)||1}`,badge(c.status)+form('staff.cms-save',select('Content type','type',options(['Home banner','FAQ','Policy page']),c.type||'FAQ')+field('Page title','title',c.title,'text','required')+`<label>Page body<textarea name="body" required>${h(c.body)}</textarea></label>`,'Save draft')+button('Publish saved draft','staff.cms-publish')+panel('Current preview',`<h3>${h(c.title)}</h3><p>${h(c.body)}</p>`));
  },['validation','conflict','duplicate']),
  definition('SCR-ADM-005','settings','System settings and offer proposals','admin',['ADM-05','ADM-09'],'Propose future-basket settings and an offer; activation awaits owner approvals.',ctx=>{
    const s=ctx.state.settings,u=local(ctx.state);return notice('Illustrative numbers only. Product/Finance/Pharmacy approval is unresolved. Accepted orders retain their total; proposal controls cannot activate a discount.')+panel('Settings proposal',form('staff.settings',field('Illustrative minimum basket (INR)','minimum',s.minimum,'number','min="0"')+field('Illustrative delivery fee (INR)','deliveryFee',s.deliveryFee,'number','min="0"')+field('Change reason','reason','','text','required'),'Save proposal'))+panel('Offer proposal',form('staff.offer',field('Offer name','name',s.offer||'DEMO-OFFER','text','required')+field('Starts','start','2026-11-01','date')+field('Ends','end','2026-11-30','date')+field('Maximum discount (illustrative INR)','cap',50,'number','min="0"')+'<label><input type="checkbox" name="firstOrder"> First-order proposal</label>','Validate and record proposal'))+(u.settingsDraft?panel('Awaiting Product/Finance approval',`<pre>${h(JSON.stringify(u.settingsDraft,null,2))}</pre>`):'');
  },['validation','conflict']),
  definition('SCR-ADM-006','catalog','Product masters and bulk import','admin',['ADM-06','ADM-07'],'Inspect products, save unapproved master drafts, validate CSV rows and review errors.',ctx=>{
    const s=ctx.state,u=local(s);return table(['SKU','Product','Category / class','Price','Publication'],s.products.map(p=>[h(p.id),h(p.name),h(`${p.category} / ${p.class}`),money(p.price),badge(p.approved?'Approved fixture':'Blocked / unapproved')]))+panel('Edit master draft',form('staff.catalog-draft',select('Product','id',s.products.map(p=>[p.id,p.name]))+field('Display name','name','','text','required')+field('Category','category','','text','required')+field('Brand','brand','Demo brand')+field('Composition / salt reference','composition','Synthetic master reference')+field('Proposed price (INR)','price',100,'number','min="0"')+field('HSN reference','hsn','','text','placeholder="Awaiting Finance-approved master"')+field('GST reference','gst','','text','placeholder="Awaiting Finance-approved master"')+select('Clinical class','class',options(['O','M','P','Unknown'])),'Save unapproved draft'))+notice('Tax, clinical classification and catalog publication remain blocked pending approved masters. Drafts never change order prices.')+(u.catalogDraft?panel('Draft awaiting Catalog/Finance/Pharmacy',`<pre>${h(JSON.stringify(u.catalogDraft,null,2))}</pre>`):'')+importPanel(ctx,'catalog');
  },['validation','duplicate','conflict']),
  definition('SCR-ADM-007','locations','Store and warehouse masters','admin',['ADM-08'],'Record fictional address, service area and opening-hour proposals; license gates remain explicit.',ctx=>{
    const u=local(ctx.state);return table(['Site','Type','Eligibility'],scopedSites(ctx.state).map(site=>[h(site),site.includes('Warehouse')?'Warehouse':'Store','Demo fixture only; real license approval unresolved']))+form('staff.location',field('Location name','name','','text','required')+select('Type','type',options(['Store','Warehouse']))+field('Fictional address','address','','text','required')+field('Serviceable PIN codes (comma separated)','pins','700001')+field('Opening hours','hours','09:00–18:00')+field('GSTIN approval reference','gstin')+select('License evidence','license',options(['Unverified','Expired','Approved fixture'])),'Save location proposal')+notice('An Open flag cannot make an expired or unverified licensed location eligible for fulfillment.')+table(['Proposed site','Address','Hours','License status'],u.locations.map(l=>[h(l.name),h(l.address),h(l.hours),badge(l.license)]));
  },['validation']),
  definition('SCR-OMS-001','orders','Order and attention queue','orders',['OMS-01','OMS-06'],'Search the shared order and filter current exceptions.',ctx=>{
    const s=ctx.state,u=local(s),o=s.order,exception=o.payment==='Pending'||o.delivery==='Failed'||o.status==='Cancelled';
    const show=(u.orderFilter!=='Attention'||exception)&&`${o.id} ${s.customer.phone||''}`.toLowerCase().includes(u.orderSearch.toLowerCase())&&(u.orderFilter!=='Paid'||o.payment==='Paid')&&(!u.orderFrom||u.orderFrom<='2026-10-23')&&(!u.orderTo||u.orderTo>='2026-10-23')&&(!u.orderStatus||u.orderStatus==='All'||u.orderStatus===o.status)&&(!u.orderPayment||u.orderPayment==='All'||u.orderPayment===o.payment)&&(!u.orderReview||u.orderReview==='All'||u.orderReview===o.review);
    return form('staff.order-search',field('Order number or fictional phone','query',u.orderSearch)+select('Queue','filter',options(['All','Attention','Paid']),u.orderFilter)+select('Status','status',options(['All',o.status,'Cancelled']),u.orderStatus||'All')+select('Payment','payment',options(['All','Not started','Pending','Paid','Failed']),u.orderPayment||'All')+select('Rx review','review',options(['All','Pending','Approved','Rejected','Partial']),u.orderReview||'All')+select('Location','site',options(['Current location']))+field('From date','from',u.orderFrom||'2026-10-01','date')+field('To date','to',u.orderTo||'2026-10-23','date'),'Apply filters')+notice('The shared synthetic order is dated 23 October 2026. Date and status filters apply to this one record.')+(show?orderCard(s):empty('No orders match','Clear the search or choose All.'))+panel('Attention ownership',`<p>Payment uncertainty → Finance. Stock/licensed allocation → Operations. Clinical review → Pharmacy. Failed delivery → Delivery Operations.</p>`+link('Assisted-order limits','staff/assisted-order'));
  },['payment-pending','confirmation-lost']),
  definition('SCR-OMS-002','order-detail','Order detail, revision and recovery','orders',['OMS-02','OMS-05'],'Read current shared facts, add notes and request accepted revisions, cancellation or return.',ctx=>{
    const s=ctx.state,o=s.order;return orderCard(s)+orderLines(s)+panel('Evidence',`<p>Patient: ${h(o.patientId||'Not selected')} · Rx: ${h(s.rx.status)} · Hold: ${h(o.hold)} · Revision: ${h(o.revision)}</p>`+link('Prescription review','pharmacy/queue')+' '+link('Eligible batches','staff/inventory')+' '+link('Payment / invoice','staff/payments')+' '+link('Allocation and reassignment','staff/allocation'))+panel('Internal note',form('staff.note',`<label>Operational note<textarea name="note" required>${h(o.note||'')}</textarea></label>`,'Add note'))+panel('Controlled order change',form('staff.order-change',select('Requested change','change',options(['Cancel order','Request partial fulfillment','Raise return']))+field('Reason','reason','','text','required')+select('Line affected (partial request)','productId',o.items.map(i=>[i.productId,productName(s,i.productId)])),'Review change'))+notice('Partial fulfillment creates a proposal. No line is silently removed; customer acceptance, Pharmacy review and financial compensation remain separate gates.')+panel('History',timeline(o.history||[]));
  },['validation','conflict','duplicate','payment-pending']),
  definition('SCR-OMS-003','allocation','Licensed allocation and reassignment','orders',['OMS-03','OMS-04'],'Inspect eligible stock before a single-site assignment; reassignment requires a reason.',ctx=>{
    const s=ctx.state;return orderCard(s)+table(['Candidate','Eligibility','Reason'],scopedSites(s).map((site,i)=>[h(site),badge(i===0?'Demo candidate':'Alternative candidate'),i===0?'Nearest illustrative site; inspect batch evidence':'Fallback only after approved eligibility checks']))+form('staff.allocate',select('Target location','site',options(scopedSites(s)))+field('Allocation / reassignment reason','reason','','text','required'),'Check and assign')+notice('Illustrative candidates are not real geolocation or license decisions. A single accepted revision owns one active location; expired, unknown or stale lots never authorize holds.')+link('Inspect stock evidence','staff/inventory');
  },['validation','conflict','duplicate','stale-stock','stock-expired','out-of-stock']),
  definition('SCR-OMS-004','assisted-order','Assisted phone-order intake — blocked contract','orders',['OMS-07'],'Capture a minimal local inquiry and route it for authorized completion.',ctx=>notice('Could-have scope. Product/Security has not approved assisted consent, identity, patient selection or payment contracts. This form records an inquiry only; it cannot create an order, Rx approval or paid state.')+form('staff.assisted',field('Existing demo order / inquiry reference','reference',ctx.state.order.id,'text','required')+field('Fictional callback label','callback','Demo customer')+select('Issue','issue',options(['Needs shopping assistance','Patient/consent verification','Payment uncertainty']))+field('Summary without clinical detail','summary','','text','required'),'Record local inquiry')+link('Route through support','staff/support'),['validation']),
  definition('SCR-INV-001','inventory','Batch stock and FEFO eligibility','inventory',['INV-01','INV-03','INV-05'],'Inspect eligible, blocked, expired and stale lots with actionable inventory alerts.',ctx=>{
    const s=ctx.state;return table(['Product','Site','Batch','Quantity','Manufactured','Expiry','Eligibility'],s.inventory.filter(b=>inLocation(s,b.site)).map((b,i)=>[h(productName(s,b.productId)),h(b.site),h(b.batch),h(b.qty),h(b.manufactured||'Not recorded — verify evidence'),h(b.expiry),badge(ctx.scenario==='stale-stock'?'Stale — no hold':ctx.scenario==='stock-expired'&&i===0?'Expired / blocked':ctx.scenario==='out-of-stock'?'Unavailable':b.eligible?'Eligible fixture':'Blocked / unapproved')]))+panel('Inventory alerts',`<p>${s.inventory.filter(b=>inLocation(s,b.site)&&Number(b.qty)<5).length} fixture batches below illustrative low-stock quantity 5. Exact low-stock and shelf-life thresholds require owner approval.</p>`+button('Refresh eligible stock evidence','staff.stock-refresh')+' '+link('Movement ledger','staff/ledger')+' '+link('Reasoned adjustment','staff/adjustment')+' '+link('Opening stock / sync','staff/inventory-integration'))+notice('FEFO applies only after eligibility. A short shelf-life or unknown-class lot is skipped regardless of age. Displayed quantities alone are not a reservation.');
  },['stale-stock','stock-expired','out-of-stock']),
  definition('SCR-INV-002','ledger','Read-only stock movement ledger','inventory',['INV-02'],'Trace local adjustments and imports by unique movement reference.',ctx=>{
    const rows=ledgerRows(ctx.state);return notice('Ledger is append-only in this prototype. Opening fixture balances and recorded movements explain physical batch quantity; eligible stock is a separate gate. Corrections use a new reasoned movement.')+table(['Reference','Site','Batch','Delta','Reason'],rows.map(l=>[h(l.id),h(l.site||ctx.state.inventory.find(b=>b.id===l.inventoryId||b.batch===l.batch)?.site),h(l.batch),h(l.qty),h(l.reason)]))+link('Create adjustment','staff/adjustment')+' '+button('Export current ledger','staff.ledger-export');
  },['duplicate']),
  definition('SCR-INV-003','adjustment','Stock adjustment and manager review','inventory',['INV-04'],'Validate a reasoned adjustment and demonstrate approval threshold handling.',ctx=>{
    const s=ctx.state,u=local(s);return notice('Illustrative demo threshold: absolute movement over 10 units requires a separate manager review. This is not an approved operational policy.')+form('staff.adjust-stock',select('Batch','id',s.inventory.filter(b=>inLocation(s,b.site)).map(b=>[b.id,`${b.batch} · ${b.site} · ${b.qty} units`]))+field('Signed quantity (+ receipt, − reduction)','qty','','number','step="1" required')+field('Unique movement reference','reference','ADJ-DEMO-001','text','required')+field('Evidence / reason','reason','','text','required'),'Submit adjustment')+(u.adjustment?panel('Pending manager review',`<p>${h(u.adjustment.reference)} · ${h(u.adjustment.qty)} units · ${h(u.adjustment.reason)}</p>`+button('Approve illustrative movement','staff.adjust-approve')+' '+button('Reject proposal','staff.adjust-reject')):'')+link('Inspect ledger','staff/ledger');
  },['validation','duplicate','conflict']),
  definition('SCR-INV-004','inventory-integration','Opening stock import and Techsmith sync','inventory',['INV-06','INV-07'],'Validate local CSV and simulate ordered stock observations without a real adapter.',ctx=>importPanel(ctx,'stock')+panel('Techsmith adapter simulation',notice('No real Techsmith endpoint or credentials are used. Provider contract, ordering and stock authority remain unresolved.')+`<p>Sync state: ${h(local(ctx.state).syncStatus||'Not started')}</p>`+button('Fetch simulated observation','staff.sync')+' '+button('Replay same observation','staff.sync-replay')+' '+button('Test older observation','staff.sync-old')),['validation','duplicate','stale-stock','provider-error']),
  definition('SCR-FIN-001','payments','Payment records and uncertain outcome recovery','finance',['FIN-01'],'Read trusted fixture outcomes for the existing reference without creating another charge.',ctx=>{
    const s=ctx.state,o=s.order;return orderCard(s)+table(['Reference','Method','Amount due','Trusted result'],[[`PAY-${h(o.id)}`,h(o.method),money(o.total),badge(['payment-pending','confirmation-lost'].includes(ctx.scenario)?'Pending evidence':o.payment)]])+notice('A screenshot or browser return is not trusted payment proof. The button below queries a local fixture; it does not contact Cashfree or request money.')+button('Query existing payment reference','staff.payment-query')+' '+link('Invoice','staff/invoice')+' '+link('Refund review','staff/refunds')+' '+link('Reconciliation / cash','staff/reconciliation');
  },['payment-pending','confirmation-lost','duplicate','provider-error']),
  definition('SCR-FIN-002','invoice','Invoice evidence and blocked tax setup','finance',['FIN-02'],'Show invoice generation status without inventing tax or charging the customer again.',ctx=>{
    const o=ctx.state.order,u=local(ctx.state);return panel('Invoice record',`<p>Order ${h(o.id)} · Existing payment ${h(o.payment)} · Total ${money(o.total)}</p><p>Invoice status: ${badge(u.invoiceStatus)}</p><p>GSTIN, HSN, place-of-supply and approved tax calculation are unresolved. A paid order may have a pending invoice; generating an invoice never repeats payment.</p>`+button('Check invoice prerequisites','staff.invoice-check')+' '+button('Download non-tax order summary','staff.invoice-download'))+orderLines(ctx.state)+link('Credit note / original invoice','staff/credit-note');
  },['provider-error','duplicate']),
  definition('SCR-FIN-003','refunds','Refund request, approval and tracking','finance',['FIN-03','FIN-04'],'Create one capped refund intent, demonstrate approval and verify COD destination evidence.',ctx=>{
    const s=ctx.state,o=s.order,u=local(s),paid=o.method==='cod'?Number(o.codCollected||0):(o.payment==='Paid'?Number(o.total):0),reserved=u.refunds.filter(r=>r.status!=='Rejected').reduce((n,r)=>n+r.amount,0),inspected=(s.returnCases||[]).filter(c=>c.status==='Inspection complete — quarantined');
    return panel('Refundable evidence',`<p>Order ${h(o.id)} · Payment ${h(o.payment)} · Collected/paid ${money(paid)} · Existing refund intents ${money(reserved)} · Remaining ${money(Math.max(0,paid-reserved))}</p>`+notice('Demo approval threshold: INR 100. Exact approval thresholds and automatic refund rules need Finance approval. Pending intents reserve the refundable amount to prevent concurrent overpayment.'))+panel('Inspected returns — independent Finance decision',table(['Return','Eligibility reference','Inspection','Finance outcome'],inspected.map(c=>[h(c.id),h(c.policyRef||'Not recorded'),badge(c.inspection.disposition),badge(c.refundStatus)]))+(inspected.length?form('staff.return-finance-decision',select('Inspected return','returnId',inspected.filter(c=>!c.financeDecision).map(c=>[c.id,`${c.id} · ${c.orderId} · ${c.productId} × ${c.qty}`]))+select('Decision','decision',options(['Approved for refund review','Not approved']))+field('Approval reference','approvalRef','','text','required')+field('Finance reason','reason','','text','required'),'Record Finance decision'):notice('No inspected return awaits Finance review.')))+form('staff.refund-request',field('Refund intent reference','reference','RF-DEMO-001','text','required')+select('Return case (optional)','returnCaseId',[['','Not linked to a return'],...inspected.filter(c=>c.refundStatus==='Approved for separate refund instruction').map(c=>[c.id,c.id+' · approved for separate instruction'])]) +field('Requested INR','amount',u.refundAmount,'number','min="0.01" step="0.01" required')+field('Reason','reason',u.refundReason,'text','required')+select('Destination','destination',options(['Original payment method','Verified COD UPI fixture','Verified COD bank fixture']))+'<label><input type="checkbox" name="verified"> COD destination independently verified (simulation only; no account data)</label>','Validate refund intent')+table(['Intent','Amount','Return','Status','Action'],u.refunds.map(r=>[h(r.id),money(r.amount),h(r.returnCaseId||'—'),badge(r.status),r.status==='Awaiting approval'?button('Approve simulated intent','staff.refund-approve',`data-id="${h(r.id)}"`):r.status==='Pending'?button('Query same refund','staff.refund-query',`data-id="${h(r.id)}"`):'No further payout']))+link('Reconciliation','staff/reconciliation');
  },['validation','duplicate','refund-delayed','provider-error']),
  definition('SCR-FIN-004','reconciliation','Settlement and COD reconciliation','finance',['FIN-05','FIN-06'],'Compare provider evidence and physical deposits while preserving unresolved shortages.',ctx=>{
    const s=ctx.state,o=s.order,f=s.finance,expected=Number(o.codCollected||0),deposited=Number(f.deposit||0),short=Math.max(0,expected-deposited);
    return panel('Settlement check',`<p>Run: SET-DEMO-001 · ${h(f.settlement||'Unreconciled')} · Reconciliation: ${h(f.reconciliation||'Not checked')}</p>`+notice('Compare the settlement reference, amount and currency. A mismatch stays open for investigation.')+form('staff.reconcile-provider',field('Settlement reference','reference','SET-DEMO-001')+field('Observed gross INR','amount',o.total,'number','min="0" step="0.01"')+select('Currency','currency',options(['INR','USD'])),'Compare existing reference'))+panel('Rider cash',table(['Order','Delivery','Collected','Deposited','Open difference'],[[h(o.id),h(o.delivery),money(expected),money(deposited),money(short)]])+(['cod-shortage','short-receipt'].includes(ctx.scenario)?notice('Shortage scenario example: INR 200 collected, INR 180 received, INR 20 under investigation. The current shared order facts remain visible above.'):'')+form('staff.cash-deposit',field('Actual received cash this receipt (INR)','amount',0,'number','min="0" step="0.01"')+field('Receipt reference','reference','DEP-DEMO-001','text','required'),'Record actual receipt')+button('Reconcile COD amounts','staff.reconcile-cod'))+notice('A short receipt remains an open finance exception. Delivery is a separate fact and never rewritten to force cash totals to match.');
  },['validation','duplicate','cod-shortage','provider-error','short-receipt']),
  definition('SCR-FIN-005','credit-note','Credit-note proposal and original invoice','finance',['FIN-07'],'Record one reasoned credit intent while approved accounting/tax issuance is blocked.',ctx=>{
    const u=local(ctx.state);return notice('Real credit-note issuance and tax/journal posting are blocked pending Finance/CA policy. Original invoice evidence is retained. This form stores a single local proposal only.')+form('staff.credit-note',field('Unique credit intent','reference','CN-DEMO-001','text','required')+field('Related refund reference','refund',u.refunds[0]?.id||'RF-DEMO-001','text','required')+field('Reason','reason','','text','required'),'Record credit proposal')+panel('Current proposal',`<p>${h(ctx.state.finance.creditNote||'None')}</p>`)+link('Original invoice evidence','staff/invoice');
  },['validation','duplicate']),
  definition('SCR-REP-001','reports','Report selection and filters','reporting',['REP-01','REP-02','REP-03','REP-04','REP-05','REP-06'],'Choose a scoped operational report and generate a synthetic result.',ctx=>{
    const r=ctx.state.reports,u=local(ctx.state);return form('staff.report-run',select('Report','type',options(['Sales and orders','GST draft — not filing ready','Stock and expiry','COD and rider deliveries','Refunds and failed deliveries','Replenishment transfers']),r.type)+field('From','from',u.reportFrom,'date','required')+field('To','to',u.reportTo,'date','required')+select('Location','site',options(['Current location']),u.reportSite)+select('Product','productId',[['All','All demo products'],...ctx.state.products.map(p=>[p.id,p.name])]),'Generate scoped report')+notice('GST output is a draft with unapproved tax mappings. Stock reports are snapshots, not reservation authority. Patient details are excluded from reports.');
  },['validation','report-failed','stale-stock']),
  definition('SCR-REP-002','report-results','Report results and export job','reporting',['REP-01','REP-02','REP-03','REP-04','REP-05','REP-06','REP-07'],'Review scoped result rows, failed generation and revoked download states.',ctx=>{
    const r=ctx.state.reports,u=local(ctx.state);return panel(r.type||'No report selected',`<p>Job: ${h(r.status)} · Export: ${h(r.exportStatus)} · Scope: ${h(u.reportLocation||u.reportSite)} · ${h(u.reportFrom)} to ${h(u.reportTo)}</p>`)+(ctx.scenario==='report-failed'||r.status==='Failed'?empty('Report failed','Retry from filters. No export artifact was produced.',link('Edit filters and retry','staff/reports')):r.status!=='Ready'?empty('Generate a report first','No report rows are ready.',link('Choose filters','staff/reports')):reportTable(ctx))+link('Change report filters','staff/reports')+' '+button('Prepare spreadsheet-compatible export','staff.report-export')+' '+button('Download prepared export','staff.report-download')+notice('The local export is an Excel-readable TSV, not a native XLSX workbook. Access is checked again at download.');
  },['report-failed','access-revoked','cod-shortage','short-receipt','stale-stock']),
  definition('SCR-AUD-001','audit','Read-only audit search and export','audit',['AUD-01','AUD-02'],'Filter immutable local evidence without edit/delete controls.',ctx=>{
    const u=local(ctx.state),rows=ctx.state.audit.filter(a=>`${a.action} ${a.role} ${a.time}`.toLowerCase().includes(u.auditSearch.toLowerCase()));return notice('Read-only for every role. Synthetic entries contain action, actor role and time; no raw prescription or payment secrets.')+form('staff.audit-search',field('Action, role or time','query',u.auditSearch),'Filter audit')+table(['Time','Role','Action'],rows.map(a=>[h(a.time),h(a.role),h(a.action)]))+button('Export filtered audit evidence','staff.audit-export');
  },['validation','access-revoked']),
  definition('SCR-NOT-001','notifications','Notification attempts and staff alerts','notifications',['NOT-01','NOT-02','NOT-04'],'Inspect minimal event content, retry delivery and acknowledge scoped staff alerts.',ctx=>{
    const n=ctx.state.notification,u=local(ctx.state),events=ctx.state.domainEvents||[];return table(['Event','Type / reference','Recipient','Channel','Delivery','Attempts'],events.length?events.map(e=>[h(e.id),h(`${e.type} · ${e.reference}`),h(e.recipient),h(e.channel),badge(e.status),h(e.attempts)]):[[`EVT-${h(ctx.state.order.id)}`,`Order update · ${h(ctx.state.order.id)}`,'Customer',h(n.channel),badge(n.status),h(n.attempts)]])+panel('Minimal message preview',`<p>Your demo order has an update. Open the protected order view for details.</p>`+link('Current order facts','staff/order-detail'))+notice('Domain events create local notification attempts. Delivery state is separate from order, payment, stock, and refund outcomes. Retry addresses the same event and never repeats its business command.')+button('Retry current event','staff.notification-retry')+panel('My location alert',`<p>${u.alertRead?'Acknowledged':'Unacknowledged'} · Order ${h(ctx.state.order.id)} requires status review.</p>`+button('Acknowledge alert','staff.alert-read')+' '+link('Review attention queue','staff/orders'))+link('Channels and push simulation','staff/notification-preferences');
  },['duplicate','provider-error','confirmation-lost']),
  definition('SCR-NOT-002','notification-preferences','Channel preferences and optional push simulation','notifications',['NOT-01','NOT-03','NOT-05'],'Choose local channel preferences and simulate allowed/denied endpoints.',ctx=>{
    const n=ctx.state.notification,u=local(ctx.state);return notice('Browser push is draft optional scope. No real permission request, device token, WhatsApp, SMS, email or push service is used.')+form('staff.notification-settings',select('Primary channel','channel',options(['WhatsApp','SMS','Email']),n.channel)+select('Fallback policy proposal','fallback',options(['SMS after approved retry policy','Email after approved retry policy','No fallback'])),'Save local preferences')+panel('Push endpoint simulation',`<p>Rider push: ${h(u.riderPush||'Not registered')} · Customer browser push: ${h(u.customerPush||'Not requested')}</p>`+button('Register current demo rider endpoint','staff.rider-push')+' '+button('Simulate browser push allowed','staff.push-allow')+' '+button('Simulate browser push refused','staff.push-refuse'))+notice('An endpoint from an earlier rider session is rejected in the access-revoked scenario. Refused browser push leaves order status available in the app.');
  },['access-revoked','provider-error']),
  definition('SCR-SUP-001','support','Identity-aware support triage','support',['NOT-04'],'Record a minimal local inquiry and route uncertainty to the responsible owner.',ctx=>{
    const s=ctx.state,cases=s.supportCases||[];return notice('Support case contracts and response commitments remain blocked by D-020. Local tickets are order-scoped, record minimal summaries, and do not create an external ticket or infer payment success from a screenshot.')+form('staff.support-case',field('Existing order reference','reference',s.order.id,'text','required')+'<label><input type="checkbox" name="identity"> Demo identity and access verified</label>'+select('Issue / responsible team','team',options(['Finance — payment or refund','Operations — stock or allocation','Pharmacy — prescription question','Delivery — failed delivery','Security — privacy/access']))+field('Minimal non-clinical summary','summary','','text','required'),'Record and route inquiry')+table(['Case','Order','Owner','Status','Latest update'],cases.map(c=>[h(c.id),h(c.reference),h(c.team),badge(c.status),h(c.history?.[0]?.message||'Received')]))+(cases.length?panel('Assign and update case',form('staff.support-update',select('Case','caseId',cases.map(c=>[c.id,`${c.id} · ${c.status}`]))+select('Responsible team','team',options(['Finance — payment or refund','Operations — stock or allocation','Pharmacy — prescription question','Delivery — failed delivery','Security — privacy/access']))+select('Next status','status',options(['Assigned','Waiting on team','Resolved','Closed']))+field('Internal update (no clinical or payment secret)','comment','','text','required'),'Save case update')):'')+link('Current order facts','staff/order-detail')+' '+link('Existing payment reference','staff/payments');
  },['validation','payment-pending','confirmation-lost'])
];

function importPanel(ctx,kind) {
  const u=local(ctx.state),isStock=kind==='stock';
  return panel(isStock?'Opening stock CSV validation':'Bulk product CSV validation',notice('Paste fictional CSV text only. No files are uploaded. All rows must validate before a demo import is accepted; real import atomicity remains an owner decision.')+form('staff.import-validate',`<input type="hidden" name="kind" value="${kind}">`+field('Unique import reference','reference',isStock?'OPEN-DEMO-001':'CAT-DEMO-001','text','required')+`<label>CSV rows (${isStock?'batch,quantity':'sku,price'})<textarea name="csv" rows="5" required>${isStock?'DEMO-NEW-LOT,5':'DEMO-SKU-7,120\nDEMO-SKU-7,wrong-price'}</textarea></label>`,'Validate rows')+(u.importKind===kind&&u.importRows.length?table(['Row','Identifier','Value','Validation'],u.importRows.map(r=>[h(r.row),h(r.id),h(r.value),badge(r.error||'Valid')]))+button(isStock?'Apply validated opening stock fixture':'Record valid catalog import proposal','staff.import-apply')+' '+button('Download row validation report','staff.import-errors'):'')+(isStock?notice('Opening imports remain separate demo lots with eligible=false until stock authority, expiry and clinical eligibility are approved. They cannot make stock orderable.') : ''));
}
function reportRows(ctx) {
  const s=ctx.state,r=s.reports,o=s.order,u=local(s),type=r.type||'';
  if((u.reportFrom&&u.reportFrom>'2026-10-23')||(u.reportTo&&u.reportTo<'2026-10-23')) return [];
  if(type.startsWith('Stock')) return s.inventory.filter(b=>(!u.reportProduct||u.reportProduct==='All'||b.productId===u.reportProduct)&&b.site===(u.reportLocation||s.location)).map(b=>[b.batch,b.site,b.qty,b.expiry,b.eligible?'Eligible fixture':'Blocked']);
  if(u.reportProduct&&u.reportProduct!=='All'&&!o.items.some(i=>i.productId===u.reportProduct)) return [];
  if(type.startsWith('COD')) return [[o.id,o.riderId||'Unassigned',o.delivery,`Collected ${o.codCollected||0}`,`Deposited ${s.finance.deposit||0}`]];
  if(type.startsWith('Refunds')) return u.refunds.length?u.refunds.map(f=>[f.id,o.id,f.amount,f.status,o.delivery]):[[o.id,'No refund intents',0,o.refund,o.delivery]];
  if(type.startsWith('Replenishment')) return [['TR-DEMO-001',s.warehouse.transferStatus,s.warehouse.dispatchedQty,s.warehouse.receivedTransferQty,ctx.scenario==='short-receipt'?'Short — investigate':s.warehouse.shortage||'No recorded shortage']];
  if(type.startsWith('GST')) return [[o.id,'Unapproved GSTIN','Unapproved tax mapping','Draft only','Not filing ready']];
  const amount=u.reportProduct&&u.reportProduct!=='All'?o.items.filter(i=>i.productId===u.reportProduct).reduce((n,i)=>n+i.qty*Number(s.products.find(p=>p.id===i.productId)?.price||0),0):o.total;
  return [[o.id,o.site,o.status,o.payment,amount]];
}
function sortedReportRows(ctx) {
  const sort=local(ctx.state).reportSort||'Reference ascending',rows=reportRows(ctx),type=ctx.state.reports.type||'';
  const valueIndex=type.startsWith('Stock')||type.startsWith('Refunds')?2:type.startsWith('Replenishment')?3:4;
  return rows.sort((a,b)=>{const index=sort.startsWith('Value')?valueIndex:0;const comparison=sort.startsWith('Value')&&Number.isFinite(Number(a[index]))&&Number.isFinite(Number(b[index]))?Number(a[index])-Number(b[index]):String(a[index]).localeCompare(String(b[index]));return sort.endsWith('descending')?-comparison:comparison;});
}
function reportTable(ctx) {
  const type=ctx.state.reports.type||'';
  const headers=type.startsWith('Stock')?['Batch','Site','Quantity','Expiry','Eligibility']:type.startsWith('COD')?['Order','Rider','Delivery','Collection','Deposit']:type.startsWith('Refunds')?['Reference','Order / note','Amount','Refund state','Delivery']:type.startsWith('Replenishment')?['Transfer','State','Dispatched','Received','Exception']:type.startsWith('GST')?['Order','GSTIN','Tax mapping','Classification','Readiness']:['Order','Site','Status','Payment','Total'];
  return form('staff.report-sort',select('Sort results','sort',options(['Reference ascending','Reference descending','Value ascending','Value descending']),local(ctx.state).reportSort||'Reference ascending'),'Apply sort')+table(headers,sortedReportRows(ctx).map(row=>row.map(h)));
}

function commit(ctx,message) {ctx.record(message);ctx.save(message);}
function appendHistory(ctx,message) {ctx.state.order.history ||= [];ctx.state.order.history.push(message);}
function applyMovement(ctx,m) {
  const u=local(ctx.state),batch=ctx.state.inventory.find(b=>b.id===m.id);
  if(u.ledger.some(l=>l.id===m.reference)){ctx.notice('Movement already exists. Reused its reference; no second stock effect.');return;}
  if(!batch||!inLocation(ctx.state,batch.site)||!Number.isInteger(m.qty)||Number(batch.qty)+m.qty<0){ctx.notice('Adjustment would create negative stock or reference an unknown batch.','error');return;}
  batch.qty=Number(batch.qty)+m.qty;const product=ctx.state.products.find(p=>p.id===batch.productId);if(product)product.stock=ctx.state.inventory.filter(b=>b.productId===batch.productId&&b.site==='Demo Store 01'&&b.eligible&&b.expiry>'2026-10-23').reduce((n,b)=>n+Number(b.qty),0);u.ledger.push({id:m.reference,inventoryId:batch.id,site:batch.site,batch:batch.batch,qty:m.qty,reason:m.reason});u.adjustment=null;commit(ctx,`Recorded stock movement ${m.reference}`);
}
function handle(action,data,ctx) {
  if(!action.startsWith('staff.')) return false;
  if(action==='staff.recover') {ctx.go(ctx.screen.route);return true;}
  if(blocked(ctx)) return true;
  const s=ctx.state,u=local(s),o=s.order;
  if(action==='staff.clear-filters'){u.staffSearch='';u.orderSearch='';u.orderFilter='All';u.orderStatus='All';u.orderPayment='All';u.orderReview='All';u.orderFrom='';u.orderTo='';u.auditSearch='';ctx.go(ctx.screen.route);return true;}
  switch(action) {
    case 'staff.search-staff': u.staffSearch=val(data,'query');ctx.save('Staff search updated.');break;
    case 'staff.invite': {
      const name=val(data,'name'),email=val(data,'email');
      if(!name||!email.endsWith('@example.test')||!roles.includes(data.role)){ctx.notice('Enter a name, a fictional @example.test email and a listed role.','error');break;}
      if(ctx.scenario==='duplicate'||s.staff.some(p=>p.email===email)){ctx.notice('This invitation already exists. No duplicate staff identity was created.');break;}
      s.staff.push({id:`STF-${s.staff.length+1}`,name,email,role:data.role,site:data.site,active:false,invitation:'Pending approval'});commit(ctx,'Created local invitation request pending access approval. No email was sent or authority granted.');break;
    }
    case 'staff.toggle-staff': {
      const p=s.staff.find(p=>p.id===data.id);if(!p){ctx.notice('Staff record not found.','error');break;}if(p.invitation==='Pending approval'){ctx.notice('Invitation access approval is unresolved. This record cannot grant privileged authority.','error');break;}
      ctx.confirm(p.active?'Deactivate staff?':'Reactivate staff?',p.active?'Revoke this fictional user’s demo access and active sessions.':'Real access restoration requires approved permissions.',()=>{p.active=!p.active;p.sessionRevoked=!p.active;commit(ctx,`${p.active?'Reactivated':'Deactivated and revoked sessions for'} ${p.name}`);});break;
    }
    case 'staff.grant-role': {
      const p=s.staff.find(p=>p.id===data.id);if(!p||!val(data,'reason')){ctx.notice('Choose a staff member and supply an approval reason.','error');break;}
      if(!roles.includes(data.role)){ctx.notice('Choose a listed source role.','error');break;}
      if(p.role===s.role||p.id==='STF-SELF'||['Super Admin','Central Admin','Finance Manager','Licensed Pharmacist'].includes(data.role)){ctx.notice('Privileged or self-authorized escalation blocked. Security must approve the exact grant.','error');break;}
      p.proposedRole=data.role;commit(ctx,`Recorded scoped role request for ${p.name}; access unchanged pending approval.`);break;
    }
    case 'staff.cms-save': if(!val(data,'title')||!val(data,'body'))ctx.notice('Title and body are required.','error');else{s.cms.type=['Home banner','FAQ','Policy page'].includes(data.type)?data.type:'FAQ';s.cms.title=val(data,'title');s.cms.body=val(data,'body');s.cms.status='Draft';s.cms.version=Number(s.cms.version||0)+1;commit(ctx,'Saved a new CMS draft version.');}break;
    case 'staff.cms-publish': if(ctx.scenario==='duplicate'||s.cms.status==='Published'){ctx.notice('This CMS version is already published.');break;}ctx.confirm('Publish this version?','Only the saved draft will be shown in the demo customer home.',()=>{s.cms.status='Published';commit(ctx,'Published saved CMS fixture version.');});break;
    case 'staff.settings': {
      const minimum=Number(data.minimum),deliveryFee=Number(data.deliveryFee);if(!Number.isFinite(minimum)||!Number.isFinite(deliveryFee)||minimum<0||deliveryFee<0||!val(data,'reason')){ctx.notice('Use nonnegative amounts and give a reason.','error');break;}
      u.settingsDraft={minimum,deliveryFee,reason:val(data,'reason'),status:'Awaiting owner approval'};commit(ctx,'Saved settings proposal; accepted order total unchanged.');break;
    }
    case 'staff.offer': if(!val(data,'name')||!data.start||!data.end||data.start>data.end||!Number.isFinite(Number(data.cap))||Number(data.cap)<0){ctx.notice('Enter an offer name, valid date range and nonnegative cap.','error');}else{u.settingsDraft={...u.settingsDraft,offer:val(data,'name'),start:data.start,end:data.end,cap:Number(data.cap),firstOrder:checked(data.firstOrder),status:'Blocked pending Product/Finance approval'};commit(ctx,'Validated offer proposal; activation remains blocked.');}break;
    case 'staff.catalog-draft': if(!val(data,'name')||!val(data,'category')||!Number.isFinite(Number(data.price))||Number(data.price)<0){ctx.notice('Product name, category and nonnegative price are required.','error');}else{u.catalogDraft={...data,name:val(data,'name'),status:'Unapproved — publication blocked'};commit(ctx,'Saved unapproved catalog master proposal.');}break;
    case 'staff.location': if(!val(data,'name')||!val(data,'address')||!val(data,'hours')||!String(data.pins||'').split(',').every(p=>/^\d{6}$/.test(p.trim()))){ctx.notice('Provide a site name, address, hours and six-digit PIN codes.','error');}else{u.locations.push({...data,operationalEligibility:'Blocked pending license/tax/service-area approval'});commit(ctx,'Saved location proposal; eligibility remains blocked.');}break;
    case 'staff.order-search': if(data.from&&data.to&&data.from>data.to){ctx.notice('From date must not follow To date.','error');}else{u.orderSearch=val(data,'query');u.orderFilter=data.filter||'All';u.orderFrom=data.from;u.orderTo=data.to;u.orderStatus=data.status||'All';u.orderPayment=data.payment||'All';u.orderReview=data.review||'All';ctx.save('Order filters applied within current location.');}break;
    case 'staff.note': if(!val(data,'note'))ctx.notice('Enter an internal operational note.','error');else{o.note=val(data,'note');appendHistory(ctx,'Internal note added.');commit(ctx,'Saved internal note.');}break;
    case 'staff.order-change': {
      if(!val(data,'reason')){ctx.notice('A reason is required.','error');break;}
      if(ctx.scenario==='duplicate'){ctx.notice('Existing change request reused; order revision unchanged.');break;}
      if(data.change==='Request partial fulfillment'){o.partialProposal={productId:data.productId,reason:val(data,'reason'),status:'Awaiting customer acceptance'};o.customerAccepted=false;appendHistory(ctx,'Partial fulfillment proposal awaiting customer acceptance; current lines retained.');commit(ctx,'Partial proposal recorded; no silent item removal.');break;}
      if(data.change==='Raise return'){if(o.delivery!=='Delivered'){ctx.notice('Return intake requires a delivered order. Use cancellation or failed-delivery recovery first.','error');break;}o.returnStatus='Requested';appendHistory(ctx,'Return requested; eligibility/inspection pending.');commit(ctx,'Return request recorded for responsible review.');break;}
      if(o.delivery==='Delivered'||o.pack==='Handed over'){ctx.notice('Cancellation is blocked after handover. Use the approved return / delivery recovery process.','error');break;}
      if(o.payment==='Pending'){ctx.notice('Payment is uncertain. Resolve the existing reference before financial cancellation; no second charge.','error');break;}
      ctx.confirm('Cancel the demo order?','Release its active demo hold. A paid order moves to refund review; money is not automatically paid out.',()=>{o.status='Cancelled';if(o.hold==='Active'){o.hold='Released';o.stock='Released';}if(o.payment==='Paid')o.refund='Requested';appendHistory(ctx,'Order cancelled with reason: '+val(data,'reason'));commit(ctx,'Cancelled demo order; separate refund review retained.');});break;
    }
    case 'staff.allocate': {
      if(!val(data,'reason')){ctx.notice('An allocation or reassignment reason is required.','error');break;}
      if(['stale-stock','stock-expired','out-of-stock'].includes(ctx.scenario)){ctx.notice('Cannot allocate: current stock evidence is stale, expired or unavailable. No hold was created.','error');break;}
      if(o.status==='Cancelled'||['Picking','Picked','Packed','Handed over'].includes(o.pack)){ctx.notice('Order is cancelled or fulfillment has begun. Reconcile handoff before reassignment.','error');break;}
      if(o.items.some(i=>{const p=s.products.find(p=>p.id===i.productId);return !p||!p.approved||p.class==='Unknown';})){ctx.notice('Unknown or unapproved product blocks allocation. Catalog/Pharmacy must review.','error');break;}
      const eligible=o.items.every(i=>s.inventory.filter(b=>b.productId===i.productId&&b.site===data.site&&b.eligible&&Number(b.qty)>0&&/^\d{4}-\d{2}-\d{2}$/.test(b.expiry)&&b.expiry>'2026-10-23').reduce((n,b)=>n+Number(b.qty),0)>=Number(i.qty));
      if(!eligible){ctx.notice('Target lacks eligible stock for every line. No split or duplicate hold was created.','error');break;}
      if((o.site===data.site&&o.hold==='Active')||ctx.scenario==='duplicate'){ctx.notice('Existing active assignment reused; no second hold.');break;}
      o.site=data.site;o.revision=Number(o.revision||0)+1;o.hold='Active';o.stock='Active';appendHistory(ctx,'Assigned single location '+data.site+' with reason: '+val(data,'reason'));commit(ctx,'Assigned eligible fixture location; one active order hold.');break;
    }
    case 'staff.assisted': if(!val(data,'reference')||!val(data,'summary'))ctx.notice('A reference and a non-clinical summary are required.','error');else{const c={id:`CASE-DEMO-${String((s.supportCases||[]).length+1).padStart(3,'0')}`,customerId:'USR-DEMO-CUSTOMER',reference:val(data,'reference'),team:'Product/Security — assisted-order contract',summary:val(data,'summary'),status:'Open',history:[{time:new Date().toISOString(),message:'Assisted inquiry recorded; order creation remains blocked.'}]};s.supportCases||=[];s.supportCases.unshift(c);commit(ctx,'Recorded assisted inquiry only; no order or consent was fabricated.');}break;
    case 'staff.stock-refresh': ctx.go(ctx.screen.route);ctx.notice('Returned to current stock fixture. Only eligible known-class lots may support a hold.');break;
    case 'staff.ledger-export': exportTSV(ctx,'demo-stock-ledger.tsv',[['Reference','Site','Batch','Delta','Reason'],...ledgerRows(s).map(l=>[l.id,l.site||s.inventory.find(b=>b.id===l.inventoryId||b.batch===l.batch)?.site,l.batch,l.qty,l.reason])]);break;
    case 'staff.adjust-stock': {
      const qty=Number(data.qty),reference=val(data,'reference'),reason=val(data,'reason');if(!Number.isInteger(qty)||qty===0||!reference||!reason){ctx.notice('Enter a nonzero whole-unit quantity, unique reference and reason.','error');break;}
      if(ctx.scenario==='duplicate'||u.ledger.some(l=>l.id===reference)){ctx.notice('Movement reference already accepted. No second ledger entry.');break;}
      const target=s.inventory.find(b=>b.id===data.id);if(!target||!inLocation(s,target.site)){ctx.notice('Batch is outside the assigned location.','error');break;}const m={id:data.id,qty,reference,reason};if(Math.abs(qty)>10){u.adjustment=m;commit(ctx,'Large adjustment awaits separate manager approval; balance unchanged.');}else applyMovement(ctx,m);break;
    }
    case 'staff.adjust-approve': if(!u.adjustment){ctx.notice('No pending adjustment.');break;}if(!/manager|admin/i.test(s.role)){ctx.notice('A separate authorized manager must approve this illustrative movement.','error');break;}applyMovement(ctx,u.adjustment);break;
    case 'staff.adjust-reject': u.adjustment=null;commit(ctx,'Rejected pending stock adjustment; balance unchanged.');break;
    case 'staff.import-validate': {
      const lines=val(data,'csv').split(/\r?\n/).filter(Boolean),seen=new Set();u.importKind=data.kind;u.importId=val(data,'reference');
      if(!lines.length||!u.importId){ctx.notice('Provide CSV rows and a unique import reference.','error');break;}
      u.importRows=lines.map((line,i)=>{const parts=line.split(','),id=String(parts[0]||'').trim(),value=Number(parts[1]),duplicate=seen.has(id);seen.add(id);return {row:i+1,id,value:parts[1]||'',error:!id?'Missing identifier':duplicate?'Duplicate identifier':parts.length!==2?'Expected exactly two columns':!String(parts[1]||'').trim()||!Number.isFinite(value)||value<0?'Invalid nonnegative numeric value':data.kind==='stock'&&!Number.isInteger(value)?'Stock quantity must be whole units':''};});ctx.save('CSV validated. Review every row before applying.');break;
    }
    case 'staff.import-apply': {
      if(!u.importRows.length||u.importRows.some(r=>r.error)){ctx.notice('Correct all row errors and validate again; no rows were applied.','error');break;}
      if(u.importApplied.includes(u.importId)||ctx.scenario==='duplicate'){ctx.notice('Import identity already exists. No duplicate opening balance or catalog record.');break;}
      if(u.importKind==='stock'){u.importRows.forEach((r,i)=>{const id=`IMP-${u.importId}-${i}`;s.inventory.push({id,productId:s.products[0].id,site:s.location,batch:r.id,qty:Number(r.value),expiry:'Unknown — review required',eligible:false});u.ledger.push({id:`${u.importId}-${i}`,inventoryId:id,site:s.location,batch:r.id,qty:Number(r.value),reason:'Unapproved opening stock fixture'});});}
      u.importApplied.push(u.importId);commit(ctx,u.importKind==='stock'?'Imported non-orderable demo opening lots; eligibility remains blocked.':'Recorded validated catalog import proposal; publication awaits master approvals.');break;
    }
    case 'staff.import-errors': exportTSV(ctx,'demo-import-validation.tsv',[['Row','Identifier','Value','Error'],...u.importRows.map(r=>[r.row,r.id,r.value,r.error||'Valid'])]);break;
    case 'staff.sync': if(ctx.scenario==='provider-error'){u.syncStatus='Adapter failed — observation not applied';ctx.save('Simulated provider error; balances unchanged.','error');}else if(ctx.scenario==='stale-stock'){u.syncStatus='Stale observation rejected';ctx.save('Older evidence cannot replace current stock.','warning');}else{u.syncStatus='OBS-DEMO-002 inspected; authoritative write blocked pending adapter contract';commit(ctx,'Inspected simulated stock observation; balances unchanged.');}break;
    case 'staff.sync-replay': u.syncStatus='OBS-DEMO-002 replay ignored — no duplicate movement';ctx.save('Reused current observation; balances unchanged.');break;
    case 'staff.sync-old': u.syncStatus='OBS-DEMO-001 rejected as older evidence';ctx.save('Stale observation rejected; balances unchanged.','warning');break;
    case 'staff.payment-query': if(ctx.scenario==='provider-error'){ctx.notice('Provider unavailable. Existing payment reference remains unresolved.','error');}else if(['payment-pending','confirmation-lost'].includes(ctx.scenario)){ctx.notice('Existing reference remains Pending evidence. Do not pay again; Finance owns recovery.','warning');}else{ctx.notice(`Current trusted fixture is ${o.payment}. Existing reference reused; no new charge.`);}break;
    case 'staff.invoice-check': u.invoiceStatus='Blocked — approved GSTIN/HSN/tax setup required';ctx.save('Invoice remains pending. No payment was created or repeated.','warning');break;
    case 'staff.invoice-download': ctx.download(`demo-${o.id}-order-summary.txt`,`SYNTHETIC ORDER SUMMARY — NOT A TAX INVOICE\nOrder ${o.id}\nPayment ${o.payment}\nTotal INR ${o.total}\nTax/GST setup pending approval. No payment action performed.`,'text/plain');break;
    case 'staff.refund-request': {
      const amount=Number(data.amount),id=val(data,'reference'),reason=val(data,'reason'),existing=u.refunds.find(r=>r.id===id),paid=o.method==='cod'?Number(o.codCollected||0):(o.payment==='Paid'?Number(o.total):0),reserved=u.refunds.filter(r=>r.status!=='Rejected').reduce((n,r)=>n+r.amount,0);
      if(existing||ctx.scenario==='duplicate'){ctx.notice('Existing refund intent reused. No second refund instruction.');break;}
      if(!id||!reason||!Number.isFinite(amount)||amount<=0||amount>paid-reserved){ctx.notice('Enter a reason and a positive amount within the remaining trusted paid/collected total.','error');break;}
      const returnCase=data.returnCaseId?(s.returnCases||[]).find(c=>c.id===data.returnCaseId):null;if(data.returnCaseId&&(!returnCase||returnCase.status!=='Inspection complete — quarantined'||returnCase.refundStatus!=='Approved for separate refund instruction')){ctx.notice('A return-linked refund requires a quarantined inspected item and separate recorded Finance approval.','error');break;}
      if(o.method==='cod'&&(!checked(data.verified)||!String(data.destination).startsWith('Verified COD'))){ctx.notice('COD refund needs independently verified destination evidence. No payout was created.','error');break;}
      const status=amount>100?'Awaiting approval':'Pending';u.refunds.push({id,amount,reason,destination:data.destination,status,returnCaseId:data.returnCaseId||null});o.refundReference=id;o.refund=status==='Awaiting approval'?'Requested':'Pending';if(returnCase)returnCase.refundStatus=status==='Awaiting approval'?'Refund intent awaiting approval':'Refund pending';ctx.publish?.('Refund intent',id,`Finance recorded refund intent ${id}; provider status ${status}`,'Customer');commit(ctx,'Recorded one capped simulated refund intent; no real payment sent.');break;
    }
    case 'staff.refund-approve': {
      const r=u.refunds.find(r=>r.id===data.id);if(!r||r.status!=='Awaiting approval'){ctx.notice('No new approval needed. Existing intent retained.');break;}
      if(!/finance approver|administrator/i.test(s.role)){ctx.notice('Switch to an authorized Finance approver. General staff cannot approve payouts.','error');break;}r.status='Pending';o.refund='Pending';const linked=(s.returnCases||[]).find(c=>c.id===r.returnCaseId);if(linked)linked.refundStatus='Refund pending';commit(ctx,'Approved illustrative refund intent; provider result remains pending.');break;
    }
    case 'staff.refund-query': {
      const r=u.refunds.find(r=>r.id===data.id);if(!r){ctx.notice('Refund intent not found.','error');break;}
      if(['refund-delayed','provider-error'].includes(ctx.scenario)){ctx.notice('Refund is still Pending. Keep the same reference; do not create another payout.','warning');break;}
      if(r.status==='Completed'){ctx.notice('Refund already completed; no duplicate payout.');break;}if(r.status!=='Pending'){ctx.notice('This intent still requires approval.','error');break;}
      r.status='Completed';o.refund=u.refunds.some(f=>f.status==='Awaiting approval')?'Requested':u.refunds.some(f=>f.status==='Pending')?'Pending':'Completed';const linked=(s.returnCases||[]).find(c=>c.id===r.returnCaseId);if(linked)linked.refundStatus='Completed';ctx.publish?.('Refund completed',r.id,`Refund ${r.id} is recorded complete in the synthetic provider response`,'Customer');commit(ctx,'Existing simulated refund completed once.');break;
    }
    case 'staff.reconcile-provider': {
      const amount=Number(data.amount);if(!val(data,'reference')||!Number.isFinite(amount)||amount<0){ctx.notice('Provide a settlement reference and valid amount.','error');break;}
      if(ctx.scenario==='provider-error'){s.finance.reconciliation='Exception — provider evidence unavailable';ctx.save('Settlement remains unresolved.','warning');break;}
      const matches=data.currency==='INR'&&Math.abs(amount-Number(o.total))<0.005&&o.payment==='Paid';s.finance.reconciliation=matches?'Matched synthetic payment evidence':'Exception — amount, currency or payment proof mismatch';s.finance.settlement=matches?'SET-DEMO-001 compared; accounting posting blocked pending policy':'Unsettled exception';commit(ctx,'Compared existing settlement evidence; no payment state overwritten.');break;
    }
    case 'staff.cash-deposit': {
      const amount=Number(data.amount);if(!val(data,'reference')||!Number.isFinite(amount)||amount<0){ctx.notice('Enter an actual nonnegative amount and receipt reference.','error');break;}
      u.depositRefs ||= [];if(u.depositRefs.includes(data.reference)||ctx.scenario==='duplicate'){ctx.notice('Receipt reference already recorded. No second deposit.');break;}u.depositRefs.push(data.reference);s.finance.deposit=Number(s.finance.deposit||0)+amount;commit(ctx,'Recorded actual demo cash receipt; delivery history unchanged.');break;
    }
    case 'staff.reconcile-cod': {
      const collected=Number(o.codCollected||0),deposit=Number(s.finance.deposit||0);s.finance.reconciliation=ctx.scenario==='cod-shortage'||ctx.scenario==='short-receipt'||deposit!==collected?'Open COD cash exception — investigate':'Collected and deposited match (demo)';commit(ctx,'COD comparison saved; shortage is not automatically cleared.');break;
    }
    case 'staff.credit-note': if(!val(data,'reference')||!val(data,'reason'))ctx.notice('Unique credit intent and reason are required.','error');else if(s.finance.creditNote&&!['Not started','None','Not issued'].includes(s.finance.creditNote)){ctx.notice('Existing credit intent retained; duplicate posting blocked.');}else if(!u.refunds.some(r=>r.id===data.refund)){ctx.notice('Reference an existing refund intent before proposing a credit note.','error');}else{s.finance.creditNote=`${val(data,'reference')} — proposal blocked pending Finance/CA approval`;commit(ctx,'Recorded credit proposal; original invoice retained and no journal posted.');}break;
    case 'staff.report-run': {
      if(!data.from||!data.to||data.from>data.to){ctx.notice('Provide a valid date range with From on or before To.','error');break;}
      s.reports.type=data.type;s.reports.filter=data.site;u.reportFrom=data.from;u.reportTo=data.to;u.reportSite=data.site;u.reportLocation=s.location;u.reportProduct=data.productId;s.reports.status=ctx.scenario==='report-failed'?'Failed':'Ready';s.reports.exportStatus='Not prepared';ctx.record('Generated scoped synthetic report.');ctx.go('staff/report-results');break;
    }
    case 'staff.report-sort': if(!['Reference ascending','Reference descending','Value ascending','Value descending'].includes(data.sort)){ctx.notice('Choose a listed sort order.','error');}else{u.reportSort=data.sort;ctx.save('Report results sorted.');}break;
    case 'staff.report-export': if(ctx.scenario==='report-failed'||s.reports.status!=='Ready'){ctx.notice('A successful scoped report is required before export.','error');}else{s.reports.exportStatus='Ready — access rechecked at download';commit(ctx,'Prepared local report export.');}break;
    case 'staff.report-download': if(s.reports.status!=='Ready'||!s.reports.exportStatus.startsWith('Ready')){ctx.notice('Generate the report and prepare its export first.','error');}else{exportTSV(ctx,'pharmville-demo-report.tsv',[['SYNTHETIC DATA',s.reports.type,u.reportSite,u.reportFrom,u.reportTo],...sortedReportRows(ctx)]);ctx.record('Downloaded scoped synthetic report.');}break;
    case 'staff.audit-search': u.auditSearch=val(data,'query');ctx.save('Read-only audit filter updated.');break;
    case 'staff.audit-export': exportTSV(ctx,'pharmville-demo-audit.tsv',[['Time','Role','Action'],...s.audit.filter(a=>`${a.action} ${a.role} ${a.time}`.toLowerCase().includes(u.auditSearch.toLowerCase())).map(a=>[a.time,a.role,a.action])]);break;
    case 'staff.notification-retry': {
      if(ctx.scenario==='duplicate'){ctx.notice('Same event attempt reused. Order, stock and payment unchanged.');break;}
      s.notification.attempts=Number(s.notification.attempts||0)+1;s.notification.status=ctx.scenario==='provider-error'?'Failed — provider unavailable':ctx.scenario==='confirmation-lost'?'Unknown delivery acknowledgment':'Delivered (simulation)';const event=(s.domainEvents||[]).find(e=>e.id===s.notification.eventId);if(event){event.attempts=s.notification.attempts;event.status=s.notification.status;event.lastAttemptAt=new Date().toISOString();}commit(ctx,'Retried the same notification event only; no business command repeated.');break;
    }
    case 'staff.alert-read': u.alertRead=true;commit(ctx,'Acknowledged my location staff alert.');break;
    case 'staff.notification-settings': s.notification.channel=data.channel;u.fallback=data.fallback;commit(ctx,'Saved local notification preferences; no real messages sent.');break;
    case 'staff.rider-push': u.riderPush=ctx.scenario==='provider-error'?'Registration failed — task remains in app':'Current demo rider endpoint registered';commit(ctx,'Simulated current-session rider endpoint registration.');break;
    case 'staff.push-allow': u.customerPush='Allowed (local simulation only)';commit(ctx,'Simulated optional browser push consent.');break;
    case 'staff.push-refuse': u.customerPush='Refused — use in-app order status';commit(ctx,'Push refused; order state unchanged.');break;
    case 'staff.support-case': if(!checked(data.identity)||val(data,'reference')!==o.id||!val(data,'summary'))ctx.notice('Verify demo identity, use the existing order reference and enter a minimal summary.','error');else{const c={id:`CASE-DEMO-${String((s.supportCases||[]).length+1).padStart(3,'0')}`,customerId:'USR-DEMO-CUSTOMER',reference:o.id,team:val(data,'team'),summary:val(data,'summary'),status:'Open',history:[{time:new Date().toISOString(),message:'Support triage accepted case.'}]};s.supportCases||=[];s.supportCases.unshift(c);ctx.publish?.('Support case opened',c.id,`Support case ${c.id} awaits assignment`,'Support');commit(ctx,'Routed local inquiry to responsible owner; no business outcome overwritten.');}break;
    case 'staff.support-update': {
      const c=(s.supportCases||[]).find(item=>item.id===data.caseId),status=val(data,'status'),comment=val(data,'comment');if(!c||!comment||!['Assigned','Waiting on team','Resolved','Closed'].includes(status)){ctx.notice('Choose a case, supported next status and internal update.','error');break;}
      const allowed={Open:['Assigned'],Assigned:['Waiting on team','Resolved'], 'Waiting on team':['Assigned','Resolved'],Resolved:['Assigned','Closed'],Closed:[]};if(!allowed[c.status]?.includes(status)){ctx.notice(`Invalid case transition ${c.status} → ${status}. Reopen a resolved case by assigning it; closed cases stay closed.`,'error');break;}
      c.team=val(data,'team')||c.team;c.status=status;c.history.unshift({time:new Date().toISOString(),message:comment,actor:s.role});ctx.publish?.('Support case updated',c.id,`Support case ${c.id} is ${status}`,'Customer');commit(ctx,`Support case ${c.id} updated to ${status}.`);break;
    }
    default: return false;
  }
  return true;
}


return {screens, handle};
})();

/* --- shared/access-screens.js --- */
__modules["shared/access-screens.js"] = (function() {
"use strict";
const {h, field, form, panel, link, table, badge, button, notice} = __modules["shared/ui.js"];
const {demoIdentities, establishSession, revokeSession} = __modules["shared/mock-domain.js"];


const base={platform:'staff',workspace:'access',module:'Authentication_Access',scenarios:['normal','validation','permission','session','conflict']};
const destinations={admin:['staff/dashboard','Administration',true],orders:['staff/orders','Order operations',false],returns:['staff/returns','Returns review',false],pharmacy:['pharmacy/queue','Pharmacist workbench',true],store:['store/queue','Store operations',false],warehouse:['warehouse/receiving','Warehouse operations',false],procurement:['procurement/orders','Procurement',false],inventory:['staff/inventory','Inventory',false],delivery:['delivery/dashboard','Delivery dispatch',false],rider:['rider/tasks','Rider app',false],finance:['staff/refunds','Finance',true],reporting:['staff/reports','Reporting',false],audit:['staff/audit','Audit',false],notifications:['staff/notifications','Notifications',false],support:['staff/support','Support',false]};
const screens=[
 {...base,id:'SCR-ACC-001',route:'access/login',title:'Unified staff identity sign-in',features:['AUTH-01','AUTH-03'],description:'Shared staff identity entry; server-side fixture resolves the role and authentication policy before creating any session.',render:ctx=>panel('1. Verify your staff identity',notice('Fictional accounts only. A valid identifier receives the same generic next-step response. Password and authenticator steps are simulated locally; customer and rider OTP adapters use the same session service.')+form('access.password',field('Fictional staff email','identifier','demo.admin@example.test','email','autocomplete="off" required')+field('Demo password — do not enter a real password','password','','password','autocomplete="off" required'),'Continue to verification')+link('Customer sign-in','customer/login')+' '+link('Rider sign-in','rider/login'))},
 {...base,id:'SCR-ACC-002',route:'access/mfa',title:'Privileged authenticator challenge',features:['AUTH-01','AUTH-02'],description:'Require a second factor before privileged staff session creation; unknown identifiers receive a generic rejection.',scenarios:['normal','validation','otp-wrong','otp-expired','rate-limit'],render:ctx=>panel('2. Complete the required authenticator challenge',notice(`Demo code: ${ctx.state.demoOtp}. Password alone never creates a privileged session. No real credential is collected or verified.`)+form('access.mfa',field('Authenticator demo code','code','','text','inputmode="numeric" autocomplete="off" required maxlength="6"'),'Verify and continue'))},
 {...base,id:'SCR-ACC-003',route:'access/sessions',title:'Identity session and access checks',features:['AUTH-02','AUTH-03','AUTH-04'],description:'Inspect and revoke the shared simulated identity session; active role and workspace grants are backend-derived fixtures.',render:ctx=>{const id=ctx.state.identitySession;return panel('Current unified identity session',table(['Item','State'],[['Identity',h(id?.identityId||'No active identity')],['Authentication',h(id?.method||'Not signed in')],['MFA',badge(id?.mfaVerified?'Verified':'Not verified / not required')],['Step-up verified for',(id?.stepUpVerifiedFor||[]).join(', ')||'No elevated workspace yet'],['Active role',h(id?.role||ctx.state.role)],['Active workspace',h(id?.activeWorkspace||'None')],['Permitted workspaces',(id?.permittedWorkspaces||[]).join(', ')||'None'],['Session',badge(id?.status||'Not signed in')]])+notice('Lockout thresholds, concurrent-session limits and expiry remain unresolved under D-003. Workspace switching below is permission-derived; the separate reviewer role selector is a demo-only inspection tool.')+button('Revoke shared identity session','access.revoke')+' '+link('Sign in again','access/login')+' '+link('Choose an authorized workspace','access/workspaces'))}},
 {...base,id:'SCR-ACC-004',route:'access/workspaces',title:'Authorized workspace selection',features:['AUTH-04'],description:'List workspaces from the session role assignment; the client cannot request an arbitrary role or location.',render:ctx=>{const session=ctx.state.identitySession;const allowed=session?.permittedWorkspaces||[];return panel('Available workspaces',session?.status?.startsWith('Active')?table(['Workspace','Access basis','Step-up','Action'],allowed.map(key=>{const [route,label,stepUp]=destinations[key]||['','Unknown',false];return [h(label),h(`${session.role} · verified demo assignment · ${session.location||'assigned scope'}`),stepUp?'Fresh authenticator challenge required (proposed default)':'Current session assurance',route?button(`Enter ${label}`,'access.enter-workspace',`data-workspace="${h(key)}"`):'Unavailable'];})):notice('Sign in through the shared identity entry point. No workspace is available without an active session.','warning'))+notice('Workspace visibility is navigation only. Each protected operation still requires its own server-side permission and resource-scope check. Elevated workspace step-up mappings are proposed examples pending security approval.')+link('Session details','access/sessions')}}
];

function handle(action,data,ctx){if(!action.startsWith('access.'))return false;const s=ctx.state;
 if(action==='access.password'){
  if(!/^\S+@\S+\.\S+$/.test(data.identifier||'')||!data.password)return ctx.notice('Enter a fictional email and a nonempty demo password.','error'),true;
  const identity=demoIdentities[String(data.identifier).trim().toLowerCase()]||null;s.stepUpWorkspace=null;s.staffChallenge=true;s.staffIdentityChallenge=identity?{...identity,identifier:String(data.identifier).trim().toLowerCase()}:null;s.staffSession=false;
  ctx.save('If the account and password are eligible, complete the required verification step.');ctx.go('access/mfa');return true;
 }
 if(action==='access.mfa'){
  if(s.stepUpWorkspace){
   const key=s.stepUpWorkspace,session=s.identitySession,target=destinations[key];
   if(['otp-wrong','otp-expired','rate-limit'].includes(ctx.scenario)||data.code!==s.demoOtp||!session||!session.status.startsWith('Active')||!session.permittedWorkspaces.includes(key)||!target){s.stepUpWorkspace=null;s.staffChallenge=false;ctx.record('Workspace step-up challenge rejected');return ctx.notice('Verification could not be completed. The current session remains in its existing workspace.','error'),true;}
   session.stepUpVerifiedFor=[...new Set([...(session.stepUpVerifiedFor||[]),key])];session.activeWorkspace=key;session.location=key==='warehouse'?'Demo Warehouse':key==='admin'||key==='finance'||key==='reporting'||key==='audit'?'Central':'Demo Store 01';s.location=session.location;s.staffChallenge=false;s.stepUpWorkspace=null;ctx.record(`Authenticator step-up verified for ${key} workspace`);ctx.save(`Additional authenticator check accepted. Opened ${target[1]}.`);ctx.go(target[0]);return true;
  }
  if(!s.staffChallenge)return ctx.notice('Start from the shared identity entry point before verification.','error'),true;
  if(['otp-wrong','otp-expired','rate-limit'].includes(ctx.scenario)||data.code!==s.demoOtp||!s.staffIdentityChallenge){s.staffChallenge=false;s.staffIdentityChallenge=null;ctx.record('Staff authentication challenge rejected');return ctx.notice('Verification could not be completed. Check the details or start a new sign-in.','error'),true;}
  const identity=s.staffIdentityChallenge;s.staffChallenge=false;s.staffIdentityChallenge=null;s.staffSession=true;establishSession(s,{identityId:identity.id,role:identity.role,method:'Password + authenticator MFA',workspace:'access',mfaVerified:true});ctx.record('Unified identity service established privileged staff session with MFA');ctx.save('Second factor accepted. Choose from the workspaces assigned to this identity.');ctx.go('access/workspaces');return true;
 }
 if(action==='access.enter-workspace'){
  const session=s.identitySession,key=String(data.workspace||''),target=destinations[key];if(!session||!session.status.startsWith('Active')||!session.permittedWorkspaces.includes(key)||!target)return ctx.notice('This identity is not assigned to that workspace. No context was created.','error'),true;
  if(target[2]&&!(session.stepUpVerifiedFor||[]).includes(key)){s.stepUpWorkspace=key;s.staffChallenge=true;ctx.record(`Step-up required before entering ${key} workspace`);ctx.save(`Verify your authenticator before entering ${target[1]}.`);ctx.go('access/mfa');return true;}
  session.activeWorkspace=key;session.location=key==='warehouse'?'Demo Warehouse':key==='admin'||key==='finance'||key==='reporting'||key==='audit'?'Central':'Demo Store 01';s.location=session.location;ctx.record(`Entered authorized ${key} workspace`);ctx.save(`Opened ${target[1]} using the existing identity session.`);ctx.go(target[0]);return true;
 }
 if(action==='access.revoke'){s.staffSession=false;s.staffChallenge=false;s.stepUpWorkspace=null;s.staffIdentityChallenge=null;revokeSession(s,'Administrator or user revoked the local demo session');ctx.record('Unified identity session revoked');ctx.save('Shared identity session revoked. Protected workspaces require a new sign-in.');return true;}
 return true;
}


return {screens, handle};
})();

/* --- operations/extended-screens.js --- */
__modules["operations/extended-screens.js"] = (function() {
"use strict";
const {h, link, button, field, select, form, table, badge, panel, notice, empty} = __modules["shared/ui.js"];

const common=['normal','loading','empty','network','permission','session','duplicate','conflict'];
const opts=values=>values.map(value=>[value,value]);
const eventLine=items=>(items||[]).map(item=>`${item.time||''} ${item.message||item.action||''}`.trim());
const returnRows=cases=>table(['Return','Order','Item / qty','Eligibility','Pickup','Inspection','Finance'],cases.map(c=>[h(c.id),h(c.orderId),`${h(c.productId)} × ${h(c.qty)}`,badge(c.eligibility||'Pending'),badge(c.pickup?.status||'Not assigned'),badge(c.inspection?.status||'Not received'),badge(c.refundStatus||'Not reviewed')]));

const screens=[
 {id:'SCR-PRO-001',route:'procurement/suppliers',title:'Supplier directory and proposals',platform:'staff',workspace:'procurement',module:'Warehouse',features:['WH-01'],description:'Review fictional supplier references and submit unverified supplier proposals.',scenarios:common,render:ctx=>{const s=ctx.state;s.suppliers||=[];return notice('Procurement is a proposed workspace mapped to existing Warehouse receiving and replenishment requirements. Supplier records below are fictional, unverified fixtures.')+table(['Supplier','Status','Approval'],s.suppliers.map(x=>[h(x.id+' · '+x.name),badge(x.status),h(x.approval)]))+panel('Propose supplier reference',form('supply.supplier-propose',field('Supplier name','name','','text','required maxlength="100"')+field('Fictional reference','reference','','text','required')+field('Contact label (synthetic only)','contact','Demo contact')+'<p>No bank, tax, license, or real contact data belongs in this prototype.</p>','Save unverified proposal'))+link('Purchase orders','procurement/orders');}},
 {id:'SCR-PRO-002',route:'procurement/orders',title:'Replenishment demand and purchase orders',platform:'staff',workspace:'procurement',module:'Warehouse',features:['WH-02','WH-01'],description:'Convert a store replenishment request into a draft purchase order, record an explicit approval, and hand it to Warehouse receiving.',scenarios:common,render:ctx=>{const s=ctx.state,w=s.warehouse;s.procurement||={purchaseOrders:[]};const po=s.procurement.purchaseOrders;return notice('Purchase orders are a prototype proposal because the source plan defines replenishment and supplier receiving but not procurement approval or commercial terms. No price or payment terms are assumed.')+panel('Current replenishment demand',w.requestKey?table(['Request','Product','Quantity','Destination','State'],[[h(w.requestKey),h(s.products.find(p=>p.id===w.requestProductId)?.name||w.requestProductId),h(w.requestedQty),h(w.destination),badge(w.transferStatus)]]):empty('No open replenishment request','Create a store request before drafting a purchase order.',link('Store replenishment','store/replenishment')))+panel('Draft purchase order',form('supply.po-create',field('Purchase order reference','reference','PO-DEMO-001','text','required')+select('Supplier reference','supplierId',(s.suppliers||[]).map(x=>[x.id,`${x.id} · ${x.name} (${x.status})`]))+field('Order note (no commercial terms)','note','Replenishment linked to current store request','text','required')+'<p>Quantity and product are inherited from the current replenishment request; this draft cannot change demand.</p>','Create draft purchase order'))+table(['Purchase order','Supplier','Request','Quantity','Status','Action'],po.map(p=>[h(p.id),h(p.supplierId),h(p.requestKey),h(p.quantity),badge(p.status),p.status==='Draft'?button('Record approval','supply.po-approve',`data-id="${h(p.id)}"`):h(p.receiptRef||'—')]))+link('Supplier directory','procurement/suppliers')+' '+link('Warehouse receiving','warehouse/receiving');}},
 {id:'SCR-RET-001',route:'staff/returns',title:'Return eligibility and owner review queue',platform:'staff',workspace:'returns',module:'Customer_Orders',features:['ORD-05','ORD-06'],description:'Record an explicit owner policy decision for an item-specific return request; eligibility rules remain unconfigured.',scenarios:common,render:ctx=>{const cases=ctx.state.returnCases||[];return notice('Return windows, medicine eligibility, inspection criteria, and refund timing remain owner decisions. This view records an external policy decision reference; it does not define eligibility.')+(cases.length?returnRows(cases):empty('No return requests','A delivered customer order can submit an item-specific request.',link('Open customer return view','customer/return')))+panel('Record owner eligibility outcome',form('returns.review',select('Return case','returnId',cases.map(c=>[c.id,`${c.id} · ${c.orderId} · ${c.productId} × ${c.qty}`]))+select('Decision','decision',[['Pending','Keep pending owner policy review'],['Eligible','Eligible for pickup under approved policy'],['Not eligible','Not eligible under approved policy']])+field('Policy / approval reference','policyRef','','text','required')+field('Reviewer note (no clinical detail)','reason','','text','required'),'Save recorded policy outcome'))+link('Reverse pickup dispatch','delivery/returns');}},
 {id:'SCR-RET-002',route:'delivery/returns',title:'Reverse pickup dispatch',platform:'staff',workspace:'delivery',module:'Delivery_Operations',features:['DLV-03','DLV-05'],description:'Assign a rider only after an explicit eligible outcome; parcel custody is tracked separately from the original delivery.',scenarios:common,render:ctx=>{const cases=(ctx.state.returnCases||[]).filter(c=>c.eligibility==='Eligible');return notice('A pickup does not decide refund entitlement or inventory disposition. Assignment is available only after an owner eligibility outcome is recorded.')+(cases.length?returnRows(cases):empty('No eligible pickup requests','Eligibility remains with the owner review queue.',link('Review return requests','staff/returns')))+panel('Assign reverse pickup',form('returns.assign-pickup',select('Eligible return case','returnId',cases.map(c=>[c.id,c.id+' · '+c.orderId]))+select('Available rider','riderId',ctx.state.riders.filter(r=>!['Inactive','Off duty','Break','On delivery','Assigned'].includes(r.status)).map(r=>[r.id,`${r.name} · ${r.site} · ${r.status}`]))+field('Pickup reference','pickupRef','RPU-DEMO-001','text','required')+field('Dispatch note','note','Synthetic return parcel collection','text','required'),'Assign reverse pickup'))+link('Rider return tasks','rider/returns');}},
 {id:'SCR-RET-003',route:'rider/returns',title:'Rider return pickup task',platform:'rider',workspace:'rider',module:'Rider_App',features:['RID-02','RID-06'],description:'Show the signed-in rider their current reverse pickup and confirm physical custody with a synthetic reference.',scenarios:common,render:ctx=>{const task=(ctx.state.returnCases||[]).find(c=>c.pickup?.riderId===ctx.state.riderId&&['Assigned','Picked up'].includes(c.pickup.status));if(!ctx.state.riderSession||!task)return empty('No return pickup assigned','Dispatch assigns eligible reverse pickups to the current rider only.',link('My tasks','rider/tasks'));return panel(`Return ${task.id}`,`<p>Order ${h(task.orderId)} · ${h(task.productId)} × ${h(task.qty)} · Pickup ${badge(task.pickup.status)}</p><p>Eligibility ${badge(task.eligibility)} · Destination: assigned warehouse inspection queue.</p>`)+(task.pickup.status==='Assigned'?form('returns.rider-pickup',field('Pickup reference','pickupRef',task.pickup.reference,'text','required')+'<label class="check"><input type="checkbox" name="verified"> I have confirmed the return package reference and custody</label>','Confirm collected parcel'):notice('Custody recorded. Warehouse must inspect and quarantine the item; this prototype never returns it to saleable stock.'))+link('Warehouse return inspection','warehouse/returns');}},
 {id:'SCR-RET-004',route:'warehouse/returns',title:'Returned item receipt and inspection',platform:'staff',workspace:'warehouse',module:'Warehouse',features:['WH-05'],description:'Receive the assigned return parcel and keep disposition quarantined pending an approved inventory policy.',scenarios:common,render:ctx=>{const cases=(ctx.state.returnCases||[]).filter(c=>c.pickup?.status==='Picked up'||c.inspection);return notice('A customer return is never added back to saleable inventory automatically. Disposition choices are deliberately limited to quarantine pending approved policy.')+(cases.length?returnRows(cases):empty('No reverse parcels in transit','Rider pickup must be confirmed before warehouse inspection.',link('Reverse pickup dispatch','delivery/returns')))+panel('Receive and quarantine',form('returns.inspect',select('Picked-up return','returnId',cases.filter(c=>c.pickup?.status==='Picked up').map(c=>[c.id,`${c.id} · ${c.productId} × ${c.qty}`]))+select('Inspection disposition','disposition',[['Quarantine','Quarantine pending owner policy'],['Damaged quarantine','Damaged / segregated quarantine']])+field('Inspection note','note','','text','required')+'<label class="check"><input type="checkbox" name="received"> I confirm warehouse physical receipt</label>','Record receipt and inspection'))+link('Finance return review','staff/refunds');}},
 {id:'SCR-CUS-HELP-001',route:'customer/help',title:'Customer help and case history',platform:'customer',workspace:'customer',module:'Customer_Orders',features:['ORD-05'],description:'Submit an order-linked support request and follow the shared support case history; D-020 contract details remain pending.',scenarios:common,render:ctx=>{const cases=(ctx.state.supportCases||[]).filter(c=>c.customerId==='USR-DEMO-CUSTOMER');return notice('Support case workflow is a prototype proposal pending D-020. Share only a minimal summary; do not enter prescription, payment credentials, or other sensitive details.')+form('customer.support-case',field('Order reference','reference',ctx.state.order.id,'text','required')+select('Issue owner','issue',[['Order status','Order status'],['Delivery issue','Delivery issue'],['Return / refund question','Return / refund question'],['Prescription process','Prescription process'],['Account access','Account access']])+'<label class="field"><span>How can we help?</span><textarea name="summary" required maxlength="500"></textarea></label>','Send support request')+panel('My support cases',cases.length?table(['Case','Order','Team','Status','Latest update'],cases.map(c=>[h(c.id),h(c.reference),h(c.team),badge(c.status),h(c.history?.[0]?.message||'Received')])):empty('No support cases yet','Your order-linked support requests will appear here.'));}}
];

function handle(action,data,ctx){
 if(!action.startsWith('supply.')&&!action.startsWith('returns.')&&!action.startsWith('customer.support-case')&&action!=='staff.return-finance-decision')return false;
 const s=ctx.state; s.returnCases||=[]; s.supportCases||=[]; s.suppliers||=[]; s.procurement||={purchaseOrders:[]}; s.procurement.purchaseOrders||=[];
 const fail=message=>(ctx.notice(message,'error'),true), save=message=>(ctx.save(message),true), findReturn=id=>s.returnCases.find(c=>c.id===id);
 if(action==='supply.supplier-propose'){
  if(!['Procurement','Warehouse Manager','Admin','Super Admin','Central Admin'].includes(s.role))return fail('Supplier maintenance requires an assigned Procurement or approved administration role.');
  const name=String(data.name||'').trim(),id=String(data.reference||'').trim();if(!name||!id)return fail('Supplier name and a unique fictional reference are required.');if(s.suppliers.some(x=>x.id===id))return fail('Supplier reference already exists. No duplicate supplier proposal was created.');s.suppliers.push({id,name,status:'Proposed — unverified',approval:'Pending owner review',contact:String(data.contact||'Demo contact').trim()});ctx.record(`Supplier proposal ${id} recorded`);ctx.publish?.('Supplier proposal',id,`${name} awaits owner verification`,'Procurement');return save('Saved a fictional unverified supplier proposal.');
 }
 if(action==='supply.po-create'){
  if(!['Procurement','Warehouse Manager','Admin','Super Admin','Central Admin'].includes(s.role))return fail('Purchase-order drafting requires an assigned Procurement role.');
  const id=String(data.reference||'').trim(),w=s.warehouse, supplier=s.suppliers.find(x=>x.id===data.supplierId);if(!id||!supplier||!String(data.note||'').trim())return fail('Choose a supplier reference, purchase order reference and note.');if(s.procurement.purchaseOrders.some(p=>p.id===id))return fail('Purchase order reference already exists; retry returns the existing record without a second order.');if(!w.requestKey||!Number.isInteger(Number(w.requestedQty))||Number(w.requestedQty)<=0||!['Requested','Approved'].includes(w.transferStatus))return fail('An open store replenishment request is required before drafting a purchase order.');const po={id,supplierId:supplier.id,requestKey:w.requestKey,productId:w.requestProductId,quantity:Number(w.requestedQty),destination:w.destination,status:'Draft',note:String(data.note).trim(),history:[{time:new Date().toISOString(),message:'Drafted from current store replenishment request.'}]};s.procurement.purchaseOrders.push(po);ctx.record(`Draft purchase order ${id} created`);ctx.publish?.('Purchase order draft',id,`Replenishment purchase order ${id} awaits explicit approval`,'Procurement');return save('Draft purchase order created from the current request. No supplier order was sent.');
 }
 if(action==='supply.po-approve'){
  const po=s.procurement.purchaseOrders.find(p=>p.id===data.id);if(!po||po.status!=='Draft')return fail('Only a draft purchase order can receive an approval record.');if(s.role!=='Procurement'&&s.role!=='Admin')return fail('Procurement approval role required in this demo.');const w=s.warehouse;if(w.requestKey!==po.requestKey||w.transferStatus!=='Requested'||w.requestedQty!==po.quantity)return fail('The linked replenishment request changed. Reconcile the order before approval.');po.status='Approved — local simulation';po.approvedBy=s.role;po.approvedAt=new Date().toISOString();po.history.unshift({time:po.approvedAt,message:`Approval recorded by ${s.role}; supplier transmission is not implemented.`});w.activePurchaseOrder=po.id;w.transferStatus='Approved';ctx.record(`Purchase order ${po.id} approved in demo`);ctx.publish?.('Purchase order approved',po.id,`Approved purchase order ${po.id} is ready for synthetic receiving`,'Warehouse');return save('Approval recorded locally. The supplier is not contacted; warehouse can record the linked receipt.');
 }
 if(action==='customer.support-case'){
  if(!s.customer.loggedIn)return fail('Sign in before creating an order-linked support case.');const ref=String(data.reference||'').trim(),summary=String(data.summary||'').trim();if(ref!==s.order.id||summary.length<4)return fail('Use the current order reference and provide a brief non-sensitive summary.');const id=`CASE-DEMO-${String(s.supportCases.length+1).padStart(3,'0')}`;const c={id,customerId:'USR-DEMO-CUSTOMER',reference:ref,team:'Support triage',issue:String(data.issue||'Order question'),summary,status:'Open',history:[{time:new Date().toISOString(),message:'Customer request received.'}]};s.supportCases.unshift(c);ctx.record(`Customer support case ${id} opened`);ctx.publish?.('Support case opened',id,`Support case ${id} is ready for triage`,'Support');return save('Support case opened. A local notification event was queued.');
 }
 if(action==='returns.review'){
  if(!['Order operator','Support','Admin','Super Admin','Central Admin'].includes(s.role))return fail('Return intake review requires an assigned Order Operations role.');
  const c=findReturn(data.returnId),decision=String(data.decision||''),ref=String(data.policyRef||'').trim(),reason=String(data.reason||'').trim();if(!c||!['Pending','Eligible','Not eligible'].includes(decision)||!ref||!reason)return fail('Choose a return case, supported recorded outcome, policy reference and reviewer note.');if(c.pickup?.status==='Picked up'||c.inspection)return fail('Eligibility cannot be changed after pickup custody was recorded.');c.eligibility=decision==='Pending'?'Pending owner policy review':decision==='Eligible'?'Eligible':'Not eligible';c.policyRef=ref;c.reviewReason=reason;c.reviewedAt=new Date().toISOString();c.history||=[];c.history.unshift({time:c.reviewedAt,message:`Owner outcome recorded: ${c.eligibility} (${ref}).`});s.order.returnStatus=c.eligibility==='Eligible'?'Eligible for pickup':c.eligibility==='Not eligible'?'Not eligible':'Eligibility review pending';ctx.record(`Return ${c.id} eligibility recorded as ${c.eligibility}`);ctx.publish?.('Return eligibility reviewed',c.id,`Return ${c.id}: ${c.eligibility}`,'Customer');return save('Recorded the supplied owner policy outcome. No eligibility criteria were inferred.');
 }
 if(action==='returns.assign-pickup'){
  if(!['Dispatcher','Delivery/Ops Manager','Admin','Super Admin','Central Admin'].includes(s.role))return fail('Reverse pickup assignment requires scoped Delivery Operations access.');
  const c=findReturn(data.returnId),r=s.riders.find(x=>x.id===data.riderId),ref=String(data.pickupRef||'').trim();if(!c||c.eligibility!=='Eligible'||!r||!ref||!String(data.note||'').trim())return fail('Select an owner-approved return and available rider, then provide a unique pickup reference and dispatch note.');if(c.pickup)return fail('A reverse pickup task already exists. Reassignment requires resolving its current custody.');if(s.returnCases.some(x=>x.pickup?.reference===ref))return fail('Pickup reference already exists. No second task created.');if(!['Available','On duty'].includes(r.status)||r.site!==s.order.site)return fail('Rider must be available at the assigned location.');c.pickup={reference:ref,riderId:r.id,status:'Assigned',assignedAt:new Date().toISOString(),note:String(data.note).trim(),site:r.site};c.history.unshift({time:c.pickup.assignedAt,message:`Reverse pickup ${ref} assigned to ${r.name}.`});ctx.record(`Reverse pickup ${ref} assigned`);ctx.publish?.('Reverse pickup assigned',c.id,`Rider assigned to return ${c.id}`,'Rider');return save('Reverse pickup assigned. The original order and refund state are unchanged.');
 }
 if(action==='returns.rider-pickup'){
  if(!s.riderSession||!String(s.role).toLowerCase().includes('rider'))return fail('An authenticated rider session is required for pickup custody.');
  const c=s.returnCases.find(x=>x.pickup?.riderId===s.riderId&&x.pickup.status==='Assigned');if(!s.riderSession||!c||String(data.pickupRef||'')!==c.pickup.reference||!(data.verified===true||data.verified==='on'))return fail('Current rider session, assigned pickup reference and custody confirmation are required.');c.pickup.status='Picked up';c.pickup.pickedUpAt=new Date().toISOString();c.status='In reverse transit';c.history.unshift({time:c.pickup.pickedUpAt,message:'Rider confirmed synthetic pickup custody.'});ctx.record(`Rider picked up return ${c.id}`);ctx.publish?.('Return picked up',c.id,`Return ${c.id} is moving to warehouse inspection`,'Warehouse');return save('Pickup custody recorded. Warehouse inspection is next.');
 }
 if(action==='returns.inspect'){
  const c=findReturn(data.returnId),note=String(data.note||'').trim();if(!['Warehouse worker','Warehouse Staff','Warehouse Manager','Admin','Super Admin','Central Admin'].includes(s.role)||s.location!=='Demo Warehouse')return fail('Inspection requires a warehouse role and the assigned warehouse location.');if(!c||c.pickup?.status!=='Picked up'||!note||!['Quarantine','Damaged quarantine'].includes(data.disposition)||!(data.received===true||data.received==='on'))return fail('Confirm the current picked-up return, allowed quarantine disposition, physical receipt and inspection note.');if(c.inspection)return fail('Inspection is already recorded. No duplicate disposition or inventory credit.');c.inspection={status:'Inspected — quarantined',disposition:data.disposition==='Damaged quarantine'?'Damaged / segregated quarantine':'Quarantine pending approved disposition policy',note,receivedAt:new Date().toISOString(),receivedBy:s.role};c.status='Inspection complete — quarantined';c.history.unshift({time:c.inspection.receivedAt,message:'Warehouse received and quarantined return; no saleable stock credit.'});ctx.record(`Return ${c.id} received and quarantined`);ctx.publish?.('Return inspected',c.id,`Return ${c.id} awaits independent Finance and inventory policy review`,'Finance');return save('Inspection recorded and item quarantined. No inventory balance or refund was changed.');
 }
 if(action==='staff.return-finance-decision'){
  const c=findReturn(data.returnId),decision=String(data.decision||''),ref=String(data.approvalRef||'').trim(),reason=String(data.reason||'').trim();if(!['Finance','Finance approver','Finance Manager','Admin','Super Admin','Central Admin'].includes(s.role))return fail('An assigned Finance role must record this independent decision.');if(!c||c.status!=='Inspection complete — quarantined'||!['Approved for refund review','Not approved'].includes(decision)||!ref||!reason)return fail('A quarantined inspected return, explicit Finance decision, approval reference and reason are required.');c.financeDecision=decision;c.financeApprovalRef=ref;c.financeReason=reason;c.refundStatus=decision==='Approved for refund review'?'Approved for separate refund instruction':'Not approved';c.history.unshift({time:new Date().toISOString(),message:`Finance outcome: ${decision} (${ref}).`});ctx.record(`Finance decision recorded for return ${c.id}: ${decision}`);ctx.publish?.('Return finance decision',c.id,`Return ${c.id}: ${c.refundStatus}`,'Customer');return save('Finance decision recorded. Any payout remains a separate refund intent and provider result.');
 }
 return false;
}


return {screens, handle};
})();

/* --- assets/js/mock-data.js --- */
__modules["assets/js/mock-data.js"] = (function() {
"use strict";
const STORAGE_KEY='pharmville-wireframe-demo-v1';
function initialState(){return {
 schema:1,role:'Customer',location:'Demo Store 01',demoOtp:'246810',demoDeliveryOtp:'135790',duty:'Off duty',search:'',category:'All',identitySession:null,domainEvents:[],supportCases:[],returnCases:[],suppliers:[{id:'SUP-DEMO-01',name:'Fictional supplier A',status:'Demo reference only',approval:'Not verified'}],procurement:{purchaseOrders:[]},demoFixture:{id:'customer',label:'Fresh shopping demo',description:'No order, payment, prescription approval or stock movement has been completed.',prepared:false},
 customer:{loggedIn:false,otpRequested:false,profileComplete:false,name:'Demo Customer',email:'customer@example.test',phone:'0000000000',consent:false,addresses:[{id:'ADDR-1',label:'Home (fictional)',line:'10 Fictional Lane, Demo Block',pin:'000000',serviceable:true}],family:[{id:'PAT-1',name:'Self (demo)',relation:'Self'}],wishlist:[],deletion:'Not requested',contactPending:''},
 products:[
 {id:'PRD-1',name:'Demo wellness pack',class:'O',category:'Wellness',composition:'Fictional non-medicine product',strength:'Not applicable',form:'Pack',pack:'1 demo pack',price:80,stock:12,image:false,approved:true},
 {id:'PRD-2',name:'Demo ordinary medicine',class:'M',category:'Other medicines',composition:'Illustrative composition M',strength:'Demo strength',form:'Tablet',pack:'10 demo tablets',price:60,stock:8,image:false,approved:true},
 {id:'PRD-3',name:'Demo prescription item A',class:'P',category:'Prescription medicines',composition:'Illustrative composition P',strength:'Demo strength A',form:'Tablet',pack:'10 demo tablets',price:120,stock:6,image:false,approved:true},
 {id:'PRD-4',name:'Demo prescription item B',class:'P',category:'Prescription medicines',composition:'Illustrative composition P',strength:'Demo strength A',form:'Tablet',pack:'10 demo tablets',price:110,stock:4,image:false,approved:true},
 {id:'PRD-5',name:'Demo unavailable item',class:'M',category:'Other medicines',composition:'Illustrative composition M2',strength:'Demo strength',form:'Pack',pack:'1 demo pack',price:40,stock:0,image:false,approved:true},
 {id:'PRD-6',name:'Demo item pending classification',class:'Unknown',category:'Under review',composition:'Unapproved demo data',strength:'Unconfirmed',form:'Unconfirmed',pack:'Demo pack',price:70,stock:3,image:false,approved:false}],
 cart:[],
 order:{id:'PV-DEMO-NEW-001',items:[],addressId:'ADDR-1',patientId:'PAT-1',status:'Draft',review:'Not required',payment:'Not started',method:'online',stock:'Not held',site:'Demo Store 01',revision:0,total:0,history:['A new fictional demo order is ready.'],pack:'Not started',delivery:'Unassigned',riderId:null,codCollected:0,refund:'Not requested',returnStatus:'Not requested',note:'',hold:'Not held',customerAccepted:false,customerSubmitted:false,quoteAccepted:false,codEligible:false,inventoryCommitted:false,pickLines:[],packageRef:'',refundReference:''},
 rx:{uploaded:false,patientId:'',status:'Not provided',fileName:''},
 riders:[{id:'RID-1',name:'Demo Rider A',status:'Available',site:'Demo Store 01'},{id:'RID-2',name:'Demo Rider B',status:'On delivery',site:'Demo Store 02'},{id:'RID-3',name:'Demo Rider C',status:'Offline',site:'Demo Store 01'}],
 inventory:[{id:'LOT-1',productId:'PRD-1',site:'Demo Store 01',batch:'DEMO-O-01',qty:12,expiry:'2099-12-31',eligible:true},{id:'LOT-2',productId:'PRD-3',site:'Demo Store 01',batch:'DEMO-P-01',qty:6,expiry:'2099-06-30',eligible:true},{id:'LOT-3',productId:'PRD-2',site:'Demo Warehouse',batch:'DEMO-M-01',qty:20,expiry:'2099-10-31',eligible:true},{id:'LOT-5',productId:'PRD-2',site:'Demo Store 01',batch:'DEMO-M-STORE',qty:8,expiry:'2099-10-31',eligible:true},{id:'LOT-6',productId:'PRD-4',site:'Demo Store 01',batch:'DEMO-P-ALT',qty:4,expiry:'2099-10-31',eligible:true},{id:'LOT-4',productId:'PRD-3',site:'Demo Store 01',batch:'DEMO-BLOCKED',qty:2,expiry:'2000-01-01',eligible:false}],
 warehouse:{requestProductId:'PRD-2',requestKey:'REQ-DEMO-SEED',destination:'Demo Store 01',priority:'Normal',receiptStatus:'Not received',receivedQty:0,transferStatus:'Requested',requestedQty:5,dispatchedQty:0,receivedTransferQty:0,shortage:0,audit:'Not started'},
 staff:[{id:'STF-1',name:'Demo Pharmacist',role:'Pharmacist',site:'Demo Store 01',active:true},{id:'STF-2',name:'Demo Picker',role:'Store worker',site:'Demo Store 01',active:true},{id:'STF-3',name:'Demo Finance Reviewer',role:'Finance',site:'Central',active:true}],
 settings:{minimum:0,deliveryFee:0,offer:'Not approved',version:1},cms:{title:'Demo delivery FAQ',body:'This is fictional content for layout review.',status:'Draft',version:1},finance:{deposit:0,settlement:'Pending',reconciliation:'Not started',creditNote:'Not issued'},notification:{status:'Queued',attempts:0,channel:'WhatsApp'},reports:{type:'Sales and orders',status:'Not generated',filter:'All permitted locations',exportStatus:'Not requested'},audit:[]
};}
function readState(){try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY));if(s?.schema===1)return s;}catch{}return initialState();}
function writeState(state){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}


return {STORAGE_KEY, initialState, readState, writeState};
})();

/* --- assets/js/navigation.js --- */
__modules["assets/js/navigation.js"] = (function() {
"use strict";
function readRoute(){const raw=location.hash.replace(/^#\/?/,'');const [path,query='']=raw.split('?');const params=new URLSearchParams(query);const parts=decodeURIComponent(path||'').split('/');const experience=['mobile','website'].includes(parts[0])&&parts.length>1?parts.shift():'';return {route:parts.join('/'),experience,scenario:params.get('scenario')||'normal',journey:params.get('journey')||''};}
function navigate(route,scenario='normal',journey=null,experience=null){const current=readRoute();const params=new URLSearchParams();if(scenario!=='normal')params.set('scenario',scenario);const activeJourney=journey===null?current.journey:journey;if(activeJourney)params.set('journey',activeJourney);const selected=experience===null?current.experience:experience;const page=['','choose','mobile','website','journeys','directory'].includes(route);const query=params.toString();const target='#/'+(!page&&selected?selected+'/':'')+route+(query?'?'+query:'');if(location.hash===target)window.dispatchEvent(new HashChangeEvent('hashchange'));else location.hash=target;}
const roles=['Customer','Admin','Super Admin','Central Admin','Order operator','Pharmacist','Licensed Pharmacist','Store worker','Store Staff','Store Manager','Warehouse worker','Warehouse Staff','Warehouse Manager','Inventory Operator','Dispatcher','Delivery/Ops Manager','Rider','Delivery Rider','Finance','Finance approver','Finance Manager','Finance Executive','Report viewer','Auditor','Support','Catalog Manager','CMS Manager','Procurement'];
const workspaceRoles={customer:'Customer',admin:'Admin',orders:'Order operator',returns:'Order operator',pharmacy:'Pharmacist',store:'Store worker',inventory:'Store worker',warehouse:'Warehouse worker',procurement:'Procurement',delivery:'Dispatcher',rider:'Rider',finance:'Finance',reporting:'Report viewer',audit:'Auditor',notifications:'Admin',support:'Support',access:'Admin'};
const roleAliases={
 customer:['Customer'],admin:['Admin','Super Admin','Central Admin','Catalog Manager','CMS Manager'],orders:['Order operator','Admin','Super Admin','Central Admin'],returns:['Order operator','Support','Admin','Super Admin','Central Admin'],pharmacy:['Pharmacist','Licensed Pharmacist'],store:['Store worker','Store Staff','Store Manager','Admin','Super Admin','Central Admin'],inventory:['Store worker','Inventory Operator','Inventory Controller','Store Manager','Admin','Super Admin','Central Admin'],warehouse:['Warehouse worker','Warehouse Staff','Warehouse Manager','Admin','Super Admin','Central Admin'],procurement:['Procurement','Warehouse Manager','Admin','Super Admin','Central Admin'],delivery:['Dispatcher','Delivery/Ops Manager','Admin','Super Admin','Central Admin'],rider:['Rider','Delivery Rider'],finance:['Finance','Finance approver','Finance Manager','Finance Executive'],reporting:['Report viewer','Finance','Finance Manager','Auditor','Admin','Super Admin','Central Admin'],audit:['Auditor'],notifications:['Admin','Super Admin','Central Admin','Support'],support:['Support','Order operator','Admin','Super Admin','Central Admin'],access:roles
};
function allowedRole(screen,role){if(screen.platform==='customer')return role==='Customer';if(screen.platform==='rider')return ['Rider','Delivery Rider'].includes(role);if(screen.workspace==='access')return roles.includes(role);const expected=workspaceRoles[screen.workspace];return (roleAliases[screen.workspace]||[expected]).includes(role)||screen.workspace==='finance'&&role==='Finance approver';}


return {readRoute, navigate, roles, workspaceRoles, allowedRole};
})();

/* --- assets/js/scenarios.js --- */
__modules["assets/js/scenarios.js"] = (function() {
"use strict";
const row=(id,label,start,trigger,result,recovery,source)=>({id,label,start,trigger,result,recovery,source});
const scenarios={
normal:row('SCN-BASE-001','Normal','Current demo information','Use the screen’s normal action','Show the recorded next step','Continue the role handoff','07-Engineering/Testing.html'),
loading:row('SCN-SYS-001','Loading','Current data is not yet available','Open or refresh this view','Show a loading state without claiming completion','Finish simulated loading to return to current data','07-Engineering/State-and-Recovery-Contracts.html'),
empty:row('SCN-SYS-002','Empty result','This scoped view has no matching records','Open the view or apply filters','Explain the absence of records and a useful next action','Return to normal or clear the filter','07-Engineering/Testing.html'),
validation:row('SCN-INPUT-001','Invalid or missing information','A form is incomplete or has invalid values','Submit the form','Show a specific correction without a partial business change','Correct fields and submit again','05-APIs/README.html'),
network:row('SCN-SYS-003','Network unavailable','The requested view or command cannot reach its simulated service','Load or submit','No invented success; committed facts remain intact','Retry the view after simulated recovery','07-Engineering/State-and-Recovery-Contracts.html'),
permission:row('SCN-SEC-001','Permission denied','Current actor lacks action or location permission','Open the protected action','Deny access and preserve the business record','Select the permitted illustrative role or return to normal','07-Engineering/Security.html'),
session:row('SCN-SEC-002','Session expired','A demo credential is no longer valid','Use a protected screen','No protected action is accepted','Return to the appropriate demo sign-in','03-Modules/Authentication_Access/Edge-Cases.html'),
duplicate:row('SCN-RACE-001','Repeated action','A matching operation was already submitted','Submit the same intent again','Reuse its recorded reference; no second stock, charge or refund effect','Inspect the existing result','07-Engineering/State-and-Recovery-Contracts.html'),
'otp-wrong':row('SCN-OTP-001','Incorrect OTP','A challenge exists','Enter an incorrect code','Do not create a session or complete delivery','Retry the permitted demo proof','03-Modules/Customer_Accounts/Edge-Cases.html'),
'otp-expired':row('SCN-OTP-002','Expired OTP','The demo challenge is expired','Verify the displayed demo code','Reject expired proof without a session','Request a new challenge','03-Modules/Customer_Accounts/Edge-Cases.html'),
'otp-delivery':row('SCN-OTP-003','OTP delivery failure','A challenge was requested','The delivery adapter fails','Delivery remains failed; no message is actually sent','Retry or select the illustrative fallback scenario','03-Modules/Customer_Accounts/Edge-Cases.html'),
'otp-fallback':row('SCN-OTP-004','WhatsApp to SMS fallback','The primary delivery channel failed','Request a code under the demo fallback','Show one challenge and SMS delivery simulation','Verify the demo code; thresholds remain undecided','03-Modules/Customer_Accounts/Edge-Cases.html'),
'rate-limit':row('SCN-OTP-005','Rate limited','The configured illustrative abuse limit is reached','Request or verify code','Show a rate-limited state without revealing account existence','Return to normal after illustrative recovery; no production timer implied','03-Modules/Authentication_Access/Edge-Cases.html'),
'out-of-stock':row('SCN-STK-001','Stock unavailable','Displayed stock cannot cover the accepted basket','Check or hold stock','No oversell or false supply promise','Revise basket or ask Operations for eligible supply','03-Modules/Inventory/Edge-Cases.html'),
'price-change':row('SCN-CHK-001','Price changed','The accepted summary differs from a fresh quote','Review checkout','Show the revised total for explicit acceptance','Accept current terms or leave checkout','03-Modules/Cart_Checkout/Edge-Cases.html'),
'invalid-address':row('SCN-ADDR-001','Address not serviceable','The selected destination is unsupported or incomplete','Check delivery availability','Block checkout for that destination','Choose a valid synthetic address','03-Modules/Customer_Accounts/Edge-Cases.html'),
'payment-declined':row('SCN-PAY-001','Payment declined','A valid held order enters demo payment','Simulate provider attempt','Show failed payment without fulfillment authorization','Retry a new allowed attempt after outcome is known','03-Modules/Cart_Checkout/Edge-Cases.html'),
'payment-pending':row('SCN-PAY-002','Payment pending','The provider result is uncertain','Submit or check payment','Keep the existing attempt pending; no immediate second charge','Check the trusted demo record','03-Modules/Finance_Payments/Edge-Cases.html'),
'confirmation-lost':row('SCN-PAY-003','Paid, confirmation lost','The provider captured the demo amount but the response was lost','Return to the order or recovery screen','Show checking payment with the same reference','Reconcile provider evidence; recheck stock before progression','03-Modules/Cart_Checkout/LLD.html'),
'prescription-rejected':row('SCN-RX-001','Prescription rejected','P lines require current permitted review','Record an illustrative rejection with reason','Affected P lines cannot progress or silently disappear','Re-upload or accept a permitted revised basket','03-Modules/Pharmacist_Review/Edge-Cases.html'),
'prescription-partial':row('SCN-RX-002','Partly approved prescription','A mixed basket has eligible and rejected lines','Record per-line demo outcomes','Offer an explicit revision, preserving eligible M/O','Customer accepts changed basket before payment','03-Modules/Pharmacist_Review/Edge-Cases.html'),
'prescription-missing':row('SCN-RX-003','Missing prescription','A P basket lacks usable evidence','Open review or submit checkout','Keep P lines waiting; no medical auto-approval','Customer supplies private demo evidence','03-Modules/Prescription_Upload/Edge-Cases.html'),
unreadable:row('SCN-RX-004','Unreadable upload','A file cannot supply usable evidence','Confirm upload or review','Request correction; keep evidence unusable','Select a fictional replacement; no real file is uploaded','03-Modules/Prescription_Upload/Edge-Cases.html'),
conflict:row('SCN-RACE-002','Concurrent change','Another role changed the record version','Submit the old screen','Do not overwrite the accepted result','Reload and review the current version','07-Engineering/State-and-Recovery-Contracts.html'),
'stock-expired':row('SCN-STK-002','Expired or blocked batch','Held/picked batch is no longer eligible','Reserve, pick or pack','Stop unsafe progression; preserve money evidence','Inventory/Pharmacy resolve eligible supply','03-Modules/Inventory/Edge-Cases.html'),
'stale-stock':row('SCN-STK-003','Stock feed stale','We can’t confirm the available stock right now','Attempt a reservation or inspect feed','Block new holds until approved evidence is current','Refresh the stock information before trying again','03-Modules/Inventory/Edge-Cases.html'),
'rider-unavailable':row('SCN-DLV-001','No eligible rider','Ready parcel has no available assigned rider','Open assignment suggestions','Parcel remains ready and unassigned','Dispatcher waits or chooses an eligible rider','03-Modules/Delivery_Operations/Edge-Cases.html'),
'delivery-failed':row('SCN-DLV-002','Failed delivery','A rider cannot complete the doorstep attempt','Record the approved failure reason','Keep parcel custody and actual COD accountable','Reattempt, reschedule or return under the illustrative path','03-Modules/Delivery_Operations/Edge-Cases.html'),
offline:row('SCN-RID-001','Rider offline','Current device has no connection','Submit pickup or delivery evidence','Label the action unconfirmed; no false completion','Reconnect and validate current assignment/version/proof','03-Modules/Rider_App/Edge-Cases.html'),
'cod-shortage':row('SCN-FIN-001','COD handover shortage','Actual rider collection exceeds deposit','Compare collected and deposited cash','Keep both actual amounts and an open cash exception','Finance investigates; do not force-clear the difference','03-Modules/Finance_Payments/Edge-Cases.html'),
'short-receipt':row('SCN-WH-001','Short receipt','A transfer or supplier delivery is incomplete','Record actual received quantity','Credit accepted quantity only and retain shortage','Receiving/Inventory investigate the missing stock','03-Modules/Warehouse/Edge-Cases.html'),
'refund-delayed':row('SCN-FIN-002','Refund result delayed','A permitted refund instruction has no trusted completion','Submit or inspect refund','Keep pending with its reference; no duplicate payout','Finance reconciles the same provider instruction','03-Modules/Finance_Payments/Edge-Cases.html'),
'report-failed':row('SCN-REP-001','Report generation failed','A report job cannot produce complete data','Generate report','Show failure, not incomplete totals presented as final','Retry the same scoped run after recovery','03-Modules/Reporting/Edge-Cases.html'),
'access-revoked':row('SCN-REP-002','Access revoked before download','A report exists but role/location access changed','Download the export','Deny protected download and keep it private','Security reviews current access','03-Modules/Reporting/Edge-Cases.html'),
'provider-error':row('SCN-EXT-001','External adapter unavailable','The required provider evidence cannot be obtained','Send or reconcile the local demonstration','Leave the operation pending/failed as appropriate','Review the existing reference after adapter recovery','07-Engineering/State-and-Recovery-Contracts.html')
};
const genericBlocks=new Set(['loading','empty','permission','session']);


return {scenarios, genericBlocks};
})();

/* --- assets/js/feature-catalog.js --- */
__modules["assets/js/feature-catalog.js"] = (function() {
"use strict";
// Generated from the authoritative documentation inventory.
const featureCatalog=[
  {
    "id": "ACC-01",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Sign up and log in with mobile OTP (WhatsApp first, SMS fallback)"
  },
  {
    "id": "ACC-02",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Profile: name, email, phone"
  },
  {
    "id": "ACC-03",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Saved addresses with map pin; serviceability checked when the address is entered"
  },
  {
    "id": "ACC-04",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Family profiles for dependents (name, age, relation)"
  },
  {
    "id": "ACC-05",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Privacy notice and consent at signup"
  },
  {
    "id": "ACC-06",
    "module": "Customer_Accounts",
    "priority": "Should (draft)",
    "description": "Account deletion request"
  },
  {
    "id": "ACC-07",
    "module": "Customer_Accounts",
    "priority": "Should (draft)",
    "description": "Wishlist"
  },
  {
    "id": "CAT-01",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Browse by category and sub-category"
  },
  {
    "id": "CAT-02",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Product page: brand, manufacturer, composition, pack size, MRP, price, images, \"Prescription required\" label"
  },
  {
    "id": "CAT-03",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Search by name, brand and composition, with typo tolerance and autosuggest"
  },
  {
    "id": "CAT-04",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Availability for the customer's pin code (in stock / out of stock)"
  },
  {
    "id": "CAT-05",
    "module": "Product_Catalog",
    "priority": "Should (draft)",
    "description": "Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule"
  },
  {
    "id": "CAT-06",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Placeholder image when a product has none"
  },
  {
    "id": "CHK-01",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Cart saved across devices for logged-in customers"
  },
  {
    "id": "CHK-02",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying"
  },
  {
    "id": "CHK-03",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Online payment via Cashfree: UPI, cards, net banking"
  },
  {
    "id": "CHK-04",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Cash on delivery, with a maximum order value and a block after repeated refusals"
  },
  {
    "id": "CHK-05",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Minimum order value and delivery fee applied from settings"
  },
  {
    "id": "CHK-06",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Price or stock change detected before payment; customer confirms"
  },
  {
    "id": "CHK-07",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "No duplicate orders or charges (double tap, refresh, closed browser after payment)"
  },
  {
    "id": "CHK-08",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Stock reserved during checkout, released automatically if payment does not finish"
  },
  {
    "id": "RX-01",
    "module": "Prescription_Upload",
    "priority": "Must (draft)",
    "description": "Upload one or more prescriptions (JPG, PNG, PDF) at checkout"
  },
  {
    "id": "RX-02",
    "module": "Prescription_Upload",
    "priority": "Should (draft)",
    "description": "Upload within 24 hours after ordering; auto-cancel after that"
  },
  {
    "id": "RX-03",
    "module": "Prescription_Upload",
    "priority": "Should (draft)",
    "description": "Reuse a saved, still-valid prescription"
  },
  {
    "id": "RX-04",
    "module": "Prescription_Upload",
    "priority": "Must (draft)",
    "description": "Link each prescription to the patient (self or family member)"
  },
  {
    "id": "RX-05",
    "module": "Prescription_Upload",
    "priority": "Must (draft)",
    "description": "See the pharmacist's decision and reason; re-upload after rejection"
  },
  {
    "id": "ORD-01",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Order confirmation on screen, WhatsApp and email"
  },
  {
    "id": "ORD-02",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Status timeline (placed → packed → out for delivery → delivered)"
  },
  {
    "id": "ORD-03",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Order history with GST invoice download"
  },
  {
    "id": "ORD-04",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Cancel before the order is packed"
  },
  {
    "id": "ORD-05",
    "module": "Customer_Orders",
    "priority": "Should (draft)",
    "description": "Return request within the return window"
  },
  {
    "id": "ORD-06",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Refund status for cancelled and returned orders"
  },
  {
    "id": "ORD-07",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Live rider location on a map, estimated arrival, masked call button"
  },
  {
    "id": "ORD-08",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Delivery OTP shown to the customer"
  },
  {
    "id": "ORD-09",
    "module": "Customer_Orders",
    "priority": "Could (draft)",
    "description": "Change items or address after placing an order"
  },
  {
    "id": "ADM-01",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress"
  },
  {
    "id": "ADM-02",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Staff users: invite, assign role and location, deactivate, log out sessions"
  },
  {
    "id": "ADM-03",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Roles and permissions for 16 roles, limited to own store or warehouse"
  },
  {
    "id": "ADM-04",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "CMS: home banners, FAQs, policy pages, with draft and publish"
  },
  {
    "id": "ADM-05",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "System settings (PRD section 8)"
  },
  {
    "id": "ADM-06",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Catalogue admin: products, categories, brands, salt master, prices, GST and HSN"
  },
  {
    "id": "ADM-07",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Bulk product import from Excel, with error report"
  },
  {
    "id": "ADM-08",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Store and warehouse master: address, hours, GSTIN, service areas"
  },
  {
    "id": "ADM-09",
    "module": "Admin_CMS",
    "priority": "Should (draft)",
    "description": "Offer settings: start and end dates, maximum discount, first-order offer"
  },
  {
    "id": "OMS-01",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Order list with filters (status, location, date, payment, Rx) and search by order number or phone"
  },
  {
    "id": "OMS-02",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Order detail: items, batches, prescription, payment, delivery, full history"
  },
  {
    "id": "OMS-03",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Automatic routing to the nearest open store with every item; warehouse as fallback"
  },
  {
    "id": "OMS-04",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Reassign an order to another location, with a reason"
  },
  {
    "id": "OMS-05",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Cancel, partly fulfil, raise return, add internal note"
  },
  {
    "id": "OMS-06",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Attention queue: payment pending, stuck orders, failed deliveries"
  },
  {
    "id": "OMS-07",
    "module": "Order_Operations",
    "priority": "Could (draft)",
    "description": "Assisted order entry for phone orders"
  },
  {
    "id": "STO-01",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "Incoming order queue for my store, with sound alert"
  },
  {
    "id": "STO-02",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "Accept order, pick list, mark packed, hand over to rider"
  },
  {
    "id": "STO-03",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "Raise replenishment request (normal or urgent)"
  },
  {
    "id": "STO-04",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "Confirm receipt of a transfer; record shortages"
  },
  {
    "id": "STO-05",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "My store's stock, with low-stock and near-expiry alerts"
  },
  {
    "id": "INV-01",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Stock per location and batch, with manufacturing and expiry dates"
  },
  {
    "id": "INV-02",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Stock ledger: every movement recorded; stock is the sum of the ledger"
  },
  {
    "id": "INV-03",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Allocate nearest-expiry batch first; block batches below minimum shelf life"
  },
  {
    "id": "INV-04",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Stock adjustments with reason; manager approval above a threshold"
  },
  {
    "id": "INV-05",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Low-stock and near-expiry alerts"
  },
  {
    "id": "INV-06",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Opening stock import per location"
  },
  {
    "id": "INV-07",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Stock sync with Techsmith"
  },
  {
    "id": "WH-01",
    "module": "Warehouse",
    "priority": "Must (draft)",
    "description": "Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice"
  },
  {
    "id": "WH-02",
    "module": "Warehouse",
    "priority": "Must (draft)",
    "description": "Replenishment queue: approve, dispatch with note, stock \"in transit\""
  },
  {
    "id": "WH-03",
    "module": "Warehouse",
    "priority": "Must (draft)",
    "description": "Urgent runs, up to two extra a day"
  },
  {
    "id": "WH-04",
    "module": "Warehouse",
    "priority": "Must (draft)",
    "description": "Pick, pack and dispatch fallback online orders"
  },
  {
    "id": "WH-05",
    "module": "Warehouse",
    "priority": "Could (draft)",
    "description": "Basic stock audit"
  },
  {
    "id": "PHM-01",
    "module": "Pharmacist_Review",
    "priority": "Must (draft)",
    "description": "Review queue, oldest first, with waiting time"
  },
  {
    "id": "PHM-02",
    "module": "Pharmacist_Review",
    "priority": "Must (draft)",
    "description": "Side-by-side view: zoomable prescription and order items"
  },
  {
    "id": "PHM-03",
    "module": "Pharmacist_Review",
    "priority": "Must (draft)",
    "description": "Approve all, approve some, or reject with a reason"
  },
  {
    "id": "PHM-04",
    "module": "Pharmacist_Review",
    "priority": "Should (draft)",
    "description": "Confirm a chosen alternative matches the prescription"
  },
  {
    "id": "PHM-05",
    "module": "Pharmacist_Review",
    "priority": "Must (draft)",
    "description": "Pharmacist name, registration number and time on every decision"
  },
  {
    "id": "DLV-01",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "Live map of riders (available, on delivery, offline) and orders ready for pickup"
  },
  {
    "id": "DLV-02",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "Suggest the nearest available rider; staff confirm or choose another"
  },
  {
    "id": "DLV-03",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "Failed-delivery queue: reattempt, reschedule or return to store"
  },
  {
    "id": "DLV-04",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "COD handover: cash collected vs deposited per rider per day"
  },
  {
    "id": "DLV-05",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "Rider management: onboard, assign location, shifts"
  },
  {
    "id": "RID-01",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "OTP login; on duty, off duty and break"
  },
  {
    "id": "RID-02",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "Task list; accept; open Google Maps to navigate; mark picked up"
  },
  {
    "id": "RID-03",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "Background location: every 5–10 s on delivery, 15–30 s idle"
  },
  {
    "id": "RID-04",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "Complete delivery with customer OTP and photo; record COD collected"
  },
  {
    "id": "RID-05",
    "module": "Rider_App",
    "priority": "Should (draft)",
    "description": "Door checks for prescription medicines"
  },
  {
    "id": "RID-06",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "Failed attempt with a reason from a fixed list"
  },
  {
    "id": "RID-07",
    "module": "Rider_App",
    "priority": "Should (draft)",
    "description": "Daily deliveries and incentive earned"
  },
  {
    "id": "FIN-01",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "Payment records from Cashfree webhooks and COD collections"
  },
  {
    "id": "FIN-02",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "GST invoice per order, from the right GSTIN"
  },
  {
    "id": "FIN-03",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "Automatic refunds; manual refunds need approval above a set amount"
  },
  {
    "id": "FIN-04",
    "module": "Finance_Payments",
    "priority": "Should (draft)",
    "description": "COD refunds by bank transfer or UPI"
  },
  {
    "id": "FIN-05",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "Daily reconciliation: Cashfree settlements vs orders"
  },
  {
    "id": "FIN-06",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "COD reconciliation: collected vs deposited"
  },
  {
    "id": "FIN-07",
    "module": "Finance_Payments",
    "priority": "Should (draft)",
    "description": "Credit notes for refunds and returns"
  },
  {
    "id": "REP-01",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "Sales and orders, by date, store and product"
  },
  {
    "id": "REP-02",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "GST report for filing"
  },
  {
    "id": "REP-03",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "Stock, low stock and near-expiry"
  },
  {
    "id": "REP-04",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "COD, rider collections and deliveries per rider"
  },
  {
    "id": "REP-05",
    "module": "Reporting",
    "priority": "Should (draft)",
    "description": "Refunds, cancellations and failed deliveries"
  },
  {
    "id": "REP-06",
    "module": "Reporting",
    "priority": "Should (draft)",
    "description": "Replenishment transfers"
  },
  {
    "id": "REP-07",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "Excel export for every report"
  },
  {
    "id": "AUD-01",
    "module": "Audit",
    "priority": "Must (draft)",
    "description": "Log logins, changes, stock movements and prescription views"
  },
  {
    "id": "AUD-02",
    "module": "Audit",
    "priority": "Must (draft)",
    "description": "Search and export the audit log; read-only for everyone"
  },
  {
    "id": "AUTH-01",
    "module": "Authentication_Access",
    "priority": "Must (draft)",
    "description": "Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager"
  },
  {
    "id": "AUTH-02",
    "module": "Authentication_Access",
    "priority": "Must (draft)",
    "description": "Lockout rules, session limits, one session per staff account"
  },
  {
    "id": "AUTH-03",
    "module": "Authentication_Access",
    "priority": "Must (draft)",
    "description": "OTP rate limits per number and IP"
  },
  {
    "id": "AUTH-04",
    "module": "Authentication_Access",
    "priority": "Must (draft)",
    "description": "Permissions checked on the server for every request"
  },
  {
    "id": "NOT-01",
    "module": "Notifications",
    "priority": "Must (draft)",
    "description": "One notification service: templates, WhatsApp first, SMS fallback, email"
  },
  {
    "id": "NOT-02",
    "module": "Notifications",
    "priority": "Must (draft)",
    "description": "Delivery log with retries"
  },
  {
    "id": "NOT-03",
    "module": "Notifications",
    "priority": "Must (draft)",
    "description": "Rider push notifications (FCM)"
  },
  {
    "id": "NOT-04",
    "module": "Notifications",
    "priority": "Must (draft)",
    "description": "Staff alerts in the admin panel"
  },
  {
    "id": "NOT-05",
    "module": "Notifications",
    "priority": "Could (draft)",
    "description": "Customer browser push notifications"
  }
];


return {featureCatalog};
})();

/* --- assets/js/journeys.js --- */
__modules["assets/js/journeys.js"] = (function() {
"use strict";
const userEntries = [
  {label:'Customer', detail:'Shop, manage an account, track orders and contact support.', route:'customer/home'},
  {label:'Pharmacist', detail:'Review assigned prescriptions and record exact-line decisions.', route:'pharmacy/queue'},
  {label:'Store staff', detail:'Prepare eligible orders and request replenishment for an assigned store.', route:'store/queue'},
  {label:'Warehouse staff', detail:'Receive supplier stock, dispatch transfers and inspect quarantined returns.', route:'warehouse/receiving'},
  {label:'Procurement', detail:'Review supplier proposals and purchase orders linked to stock demand.', route:'procurement/orders'},
  {label:'Order operations', detail:'Monitor orders, return intake and operational exceptions.', route:'staff/orders'},
  {label:'Delivery manager', detail:'Assign customer deliveries and reverse pickups.', route:'delivery/assignment'},
  {label:'Delivery rider', detail:'Accept tasks and record delivery or return custody on a phone.', route:'rider/tasks'},
  {label:'Finance team', detail:'Review payments, return decisions, refunds and cash differences.', route:'staff/refunds'},
  {label:'Customer support', detail:'Route and update customer cases across responsible teams.', route:'staff/support'},
  {label:'Admin', detail:'Manage proposed access, approved catalog content and locations.', route:'staff/dashboard'},
  {label:'Auditor', detail:'Review read-only activity history within the selected demo scope.', route:'staff/audit'},
  {label:'Reports', detail:'Prepare scoped synthetic operational reports.', route:'staff/reports'}
];

const step = (route, title, help, role='') => ({route,title,help,role});

const journeys = {
  signup: {title:'Create an account', goal:'See how a customer verifies a mobile number and completes a profile.', steps:[
    step('customer/login','Enter a mobile number','Use the fictional number shown on the sign-in screen.'),
    step('customer/otp','Verify the code','The demo code is displayed on this screen.'),
    step('customer/profile','Complete your profile','Save a name before starting checkout.')
  ]},
  order: {title:'Find and order a product', goal:'Follow product discovery, checkout checks, payment and order tracking.', steps:[
    step('customer/home','Find a product','Search or browse, then add an item to your cart.'),
    step('customer/cart','Review your cart','Check the items and quantities before checkout.'),
    step('customer/checkout-address','Choose a delivery address','Only a confirmed serviceable address can continue.'),
    step('customer/checkout-summary','Review your order','Accept the current items, address and total.'),
    step('customer/payment','Choose how to pay','Payment is available only after the order checks pass.'),
    step('customer/payment-result','Check the payment result','A pending result stays on the same payment reference.'),
    step('customer/tracking','Follow your order','The timeline reflects the shared order record.')
  ]},
  prescription: {title:'Order a prescription medicine', goal:'See customer submission, pharmacist review and the customer’s next step.', steps:[
    step('customer/home','Choose a medicine','Add a prescription medicine to the cart.'),
    step('customer/cart','Review your cart','Keep the prescription item in the basket.'),
    step('customer/checkout-address','Choose a delivery address','Confirm the destination before review.'),
    step('customer/checkout-patient','Choose the patient','One authorized patient is used for this order.'),
    step('customer/checkout-summary','Accept the order details','This sends the current order into the documented review flow.'),
    step('customer/prescription-upload','Provide prescription details','Enter a fictional filename; no file contents are uploaded.'),
    step('pharmacy/queue','Pharmacist receives the request','The order waits for an authorized pharmacist.', 'Pharmacist'),
    step('pharmacy/review','Review the submitted evidence','Compare the patient, prescription and exact P lines.', 'Pharmacist'),
    step('pharmacy/decision','Record a decision','The pharmacist must make the applicable line decision.', 'Pharmacist'),
    step('customer/prescription-status','Customer reviews the result','Eligible lines still require the customer’s acceptance.', 'Customer'),
    step('customer/payment','Complete the payment step','Payment remains blocked until the current review and stock checks pass.'),
    step('customer/payment-result','Check the payment result','The order is updated only after payment is verified.'),
    step('customer/tracking','Follow the order','See the next fulfillment milestone.')
  ]},
  payment: {title:'Pay for an order', goal:'Follow a valid order through payment and safe recovery on the same reference.', steps:[
    step('customer/home','Choose products','Add eligible products to your cart.'),
    step('customer/cart','Review your cart','Check items and quantities before checkout.'),
    step('customer/checkout-address','Choose a delivery address','Confirm a serviceable delivery address.'),
    step('customer/checkout-summary','Review the accepted order','Confirm the current quote and eligible stock.'),
    step('customer/payment','Choose a payment method','Start only when the order is eligible.'),
    step('customer/payment-result','Check the result','A pending result must not create another charge.'),
    step('customer/payment-recovery','Recover the existing payment','Check the same payment attempt and reference.')
  ]},
  prepare: {title:'Prepare an order at a store', goal:'Follow order acceptance, exact item picking, packing and custody checks.', steps:[
    step('store/queue','Open incoming orders','Accept only a current eligible order.', 'Store staff'),
    step('store/pick','Pick the listed items','Record the exact eligible batch and quantity.', 'Store staff'),
    step('store/pack','Pack and hand off the order','Confirm the contents, seal the parcel and verify the assigned rider.', 'Store staff')
  ]},
  deliver: {title:'Deliver an order', goal:'Follow assignment, rider pickup, delivery proof and customer tracking.', steps:[
    step('delivery/assignment','Assign a ready parcel','A dispatcher confirms an available rider.', 'Delivery manager'),
    step('rider/login','Sign in as the rider','Use the fictional rider identity and demo code.', 'Delivery rider'),
    step('rider/tasks','Accept the delivery task','The assigned rider confirms the task.', 'Delivery rider'),
    step('store/pack','Verify parcel handoff','Store staff verify the assigned rider and exact sealed parcel.', 'Store staff'),
    step('rider/pickup','Confirm pickup','The rider confirms custody after store handoff.', 'Delivery rider'),
    step('rider/completion','Confirm delivery','Use the correct proof and record cash only when collected.', 'Delivery rider'),
    step('customer/tracking','Check the customer timeline','The customer sees the shared delivery status.')
  ]},
  return: {title:'Request a return', goal:'See a delivered order, a customer return request and separate refund review.', steps:[
    step('customer/orders','Find the order','Open the order before requesting a change.'),
    step('customer/return','Request a return','Eligibility and inspection remain review steps.'),
    step('customer/refund','Check refund progress','Only Finance’s verified result completes the payment record.')
  ]},
  refund: {title:'Process a refund', goal:'Follow the finance instruction and show the same reference to the customer.', steps:[
    step('staff/refunds','Review refund work','Check authority, paid value and destination.', 'Finance team'),
    step('customer/refund','Check the customer status','The same finance instruction reference is shown to the customer.')
  ]},
  receiving: {title:'Receive stock at a warehouse', goal:'Record accepted quantity, investigate discrepancies and prepare a store transfer.', steps:[
    step('warehouse/receiving','Record the delivery','Enter the actual accepted quantity and batch details.', 'Warehouse staff'),
    step('warehouse/replenishment','Review the store request','Check the request and available capacity.', 'Warehouse staff'),
    step('warehouse/dispatch','Dispatch a transfer','Deduct the exact source quantity once.', 'Warehouse staff'),
    step('store/receipt','Confirm what arrived','Record actual received quantity; preserve any shortage.', 'Store staff')
  ]},
  procurement: {title:'Replenish stock through procurement', goal:'Connect a store request to a proposed purchase order and receiving record using the same synthetic supplier and stock state.', steps:[
    step('warehouse/replenishment','Review stock demand','Open the current store replenishment request.', 'Warehouse staff'),
    step('procurement/orders','Create and approve a purchase order','Record a local approval; no supplier is contacted.', 'Procurement'),
    step('warehouse/receiving','Receive approved goods','Use the linked purchase order and record actual quantity.', 'Warehouse staff'),
    step('warehouse/dispatch','Dispatch to the requesting store','Pick the exact newly received warehouse batch.', 'Warehouse staff'),
    step('store/receipt','Confirm store receipt','Record actual quantity received at the store.', 'Store staff'),
    step('staff/inventory','Review warehouse stock','Verify the accepted batch in the shared inventory state.', 'Store worker')
  ]},
  replenishment: {title:'Recover from an unavailable product', goal:'Review an unavailable item, request stock, link a purchase order and update shared warehouse inventory.', steps:[
    step('staff/inventory','Review current availability','Inspect batches and blocked lots.', 'Store worker'),
    step('store/replenishment','Submit store demand','Use a unique request reference and quantity.', 'Store staff'),
    step('procurement/orders','Create and approve replenishment PO','Link procurement approval to this store request.', 'Procurement'),
    step('warehouse/receiving','Receive supplier stock','Record actual usable batch quantity.', 'Warehouse staff'),
    step('warehouse/dispatch','Dispatch stock to the store','Use the exact supplier-received batch.', 'Warehouse staff'),
    step('store/receipt','Confirm accepted store quantity','Only received packs update store availability.', 'Store staff'),
    step('customer/search','Confirm catalog availability','Review the indicative stock change in the customer catalog.')
  ]},
  reverse: {title:'Return and reverse logistics', goal:'Carry a delivered order through owner eligibility, pickup, quarantine inspection and separate Finance review.', steps:[
    step('customer/return','Submit an item-specific request','Eligibility and inspection await an owner outcome.'),
    step('staff/returns','Record owner eligibility outcome','Enter an approved policy reference; no criteria are inferred.', 'Order operator'),
    step('delivery/returns','Assign a reverse pickup','Assign a rider only after an Eligible outcome.', 'Delivery manager'),
    step('rider/login','Sign in as the assigned rider','Use the fictional identity and demo code.', 'Delivery rider'),
    step('rider/returns','Confirm pickup custody','Record the assigned pickup reference.', 'Delivery rider'),
    step('warehouse/returns','Receive and quarantine','Record physical receipt; inventory is not restocked.', 'Warehouse staff'),
    step('staff/refunds','Record Finance review','A separate Finance decision is required before any refund intent.', 'Finance team'),
    step('customer/refund','Follow refund status','The customer sees the same refund reference and status.')
  ]},
  support: {title:'Resolve a customer support case', goal:'Create an order-linked case, route it, record operational history and show the updated status to the customer.', steps:[
    step('customer/login','Start a customer session','Use the fictional OTP flow.'),
    step('customer/otp','Verify the demo code','The customer identity is established after OTP verification.'),
    step('customer/help','Contact support','Sign in and provide a minimal non-sensitive summary.'),
    step('staff/support','Assign and update the case','Route to the responsible team and record an update.', 'Support'),
    step('customer/help','Check case history','Review the latest status and response.')
  ]}
};

function stepsForJourney(id, state) {
  const selected=journeys[id];
  if(!selected)return [];
  if(id==='reverse'&&state.returnCases?.[0]?.eligibility==='Not eligible')return selected.steps.slice(0,2);
  if(id==='order' && state.cart.some(item=>state.products.find(p=>p.id===item.productId)?.class==='P')) {
    return [step('customer/home','Find a product','Search or browse, then add a prescription medicine.'),step('customer/cart','Review your cart','Check the items and quantities.'),step('customer/checkout-address','Choose a delivery address','Only a confirmed serviceable address can continue.'),step('customer/checkout-patient','Choose the patient','One authorized patient is used for this order.'),step('customer/checkout-summary','Review your order','Accept the current items, address and total.'),step('customer/prescription-upload','Provide prescription details','Enter a fictional filename; no file contents are uploaded.'),step('pharmacy/queue','Pharmacist receives the request','The order waits for an authorized pharmacist.','Pharmacist'),step('pharmacy/review','Review the submitted evidence','Compare the patient, prescription and exact P lines.','Pharmacist'),step('pharmacy/decision','Record a decision','The pharmacist must make the applicable line decision.','Pharmacist'),step('customer/prescription-status','Customer reviews the result','Eligible lines still require customer acceptance.','Customer'),step('customer/payment','Complete the payment step','Payment remains blocked until review and stock checks pass.'),step('customer/payment-result','Check the payment result','The order is updated only after payment is verified.'),step('customer/tracking','Follow the order','See the next fulfillment milestone.')];
  }
  return selected.steps;
}

function journeyGate(id, route, state) {
  const o=state.order;
  if(id==='signup')return route==='customer/login'?state.customer.otpRequested:route==='customer/otp'?state.customer.loggedIn:route==='customer/profile'?state.customer.profileComplete:true;
  if(id==='order'||id==='prescription'){
    if(route==='customer/home')return state.cart.length>0;
    if(route==='customer/cart')return state.cart.length>0;
    if(route==='customer/checkout-address')return Boolean(state.cart.length&&state.customer.addresses.some(a=>a.id===o.addressId&&a.serviceable===true));
    if(route==='customer/checkout-patient')return Boolean(o.patientId);
    if(route==='customer/checkout-summary')return Boolean(o.quoteAccepted&&o.customerSubmitted);
    if(route==='customer/prescription-upload')return Boolean(state.rx.uploaded);
    if(route==='pharmacy/queue'||route==='pharmacy/review')return Boolean(state.rx.uploaded);
    if(route==='pharmacy/decision')return o.review==='Approved'||o.review==='Partial'||o.review==='Rejected';
    if(route==='customer/prescription-status')return (o.review==='Approved'||o.review==='Partial')&&o.stock==='Active';
    if(route==='customer/payment')return ['Paid','Pending','Failed'].includes(o.payment)||(o.method==='cod'&&o.status==='Confirmed');
    if(route==='customer/payment-result')return o.payment!=='Not started'||o.method==='cod';
    if(route==='customer/tracking')return o.status==='Confirmed'||o.payment==='Paid'||o.delivery==='Delivered';
  }
  if(id==='payment'){
    if(route==='customer/payment')return o.quoteAccepted&&o.stock==='Active';
    if(route==='customer/payment-result')return o.payment!=='Not started';
    if(route==='customer/payment-recovery')return o.payment==='Paid';
  }
  if(id==='prepare'){
    if(route==='store/queue')return o.pack==='Accepted';
    if(route==='store/pick')return o.pack==='Picked';
    if(route==='store/pack')return o.pack==='Handed over';
  }
  if(id==='deliver'){
    if(route==='delivery/assignment')return o.delivery==='Assigned';
    if(route==='rider/login')return state.riderSession===true;
    if(route==='rider/tasks')return state.riderSession===true&&o.delivery==='Accepted';
    if(route==='store/pack')return o.pack==='Handed over'&&o.delivery==='Accepted';
    if(route==='rider/pickup')return o.delivery==='Picked up'||o.delivery==='Out for delivery';
    if(route==='rider/completion')return o.delivery==='Delivered';
    if(route==='customer/tracking')return o.delivery==='Delivered';
  }
  if(id==='return'){
    if(route==='customer/cancellation')return Boolean(o.items?.length);
    if(route==='customer/return')return o.delivery==='Delivered';
  }
  if(id==='reverse'){
    const c=state.returnCases?.[0];
    if(route==='customer/return')return Boolean(o.delivery==='Delivered'&&c);
    if(route==='staff/returns')return Boolean(c&&c.eligibility!=='Pending owner policy review');
    if(route==='delivery/returns')return Boolean(c?.pickup?.status==='Assigned');
    if(route==='rider/login')return state.riderSession===true;
    if(route==='rider/returns')return Boolean(c?.pickup?.status==='Picked up');
    if(route==='warehouse/returns')return Boolean(c?.inspection);
    if(route==='staff/refunds')return Boolean(c?.financeDecision);
  }
  if(id==='procurement'||id==='replenishment'){
    const po=state.procurement?.purchaseOrders?.[0];
    if(route==='store/replenishment')return state.warehouse.transferStatus==='Requested';
    if(route==='procurement/orders')return Boolean(po&&['Approved — local simulation','Received','Received with discrepancy'].includes(po.status));
    if(route==='warehouse/receiving')return Boolean(state.warehouse.receiptKey&&['Received','Received with discrepancy'].includes(po?.status));
    if(route==='warehouse/dispatch')return state.warehouse.transferStatus==='In transit';
    if(route==='store/receipt')return ['Received','Received with shortage'].includes(state.warehouse.transferStatus);
    if(route==='staff/inventory')return ['Received','Received with shortage'].includes(state.warehouse.transferStatus);
    if(route==='customer/search')return ['Received','Received with shortage'].includes(state.warehouse.transferStatus);
  }
  if(id==='support'){
    if(route==='customer/login')return Boolean(state.customer.otpRequested);
    if(route==='customer/otp')return Boolean(state.customer.loggedIn);
    if(route==='customer/help')return Boolean(state.supportCases?.length);
    if(route==='staff/support')return Boolean(state.supportCases?.[0]?.history?.length>1);
  }
  if(id==='receiving'&&route==='store/receipt')return state.warehouse.transferStatus==='In transit'||state.warehouse.transferStatus==='Received';
  return true;
}


return {userEntries, journeys, stepsForJourney, journeyGate};
})();

/* --- shared/presentation.js --- */
__modules["shared/presentation.js"] = (function() {
"use strict";
// Layout-only composition. Business decisions remain in the existing screen handlers.
function composeScreen(root,screen,state){
 const content=root.querySelector('.screen-content');if(!content)return;
 content.dataset.screen=screen.route;
 if(screen.route==='customer/product'){
  const product=content.querySelector('.panel');
  content.querySelector('[data-action="customer.view-product"]')?.remove();
  if(product){product.classList.add('product-detail');const image=product.querySelector('.image-placeholder');if(image)product.prepend(image);}
  const table=product?.querySelector('.table-wrap');
  if(table){
   const specs=document.createElement('dl');specs.className='product-specs';
   const price=document.createElement('p');price.className='purchase-price';
   for(const row of table.querySelectorAll('tbody tr')){const cells=row.querySelectorAll('td');if(cells.length!==2)continue;const label=cells[0].textContent,value=cells[1].textContent;if(label==='Your price'){price.textContent=value;continue;}const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;specs.append(dt,dd);}
   const actions=product.querySelector('.product-card-actions'),heading=product.querySelector('h2');
   heading.after(price);if(actions)price.after(actions);
   const details=document.createElement('details');details.className='product-information';details.open=true;const title=document.createElement('summary');title.textContent='Product information';details.append(title,specs);table.replaceWith(details);
  }
 }
 if(screen.route==='customer/checkout-summary'){
  const aside=content.querySelector('.price-summary'),form=content.querySelector('form');if(aside&&form)aside.append(form);
 }
 if(screen.route==='customer/cart'){
  const aside=content.querySelector('.price-summary'),checkout=content.querySelector('a[href="#/customer/checkout-address"]');
  if(aside&&checkout){checkout.classList.add('primary');aside.append(checkout);}
 }
 if(screen.route==='customer/profile'){
  const form=content.querySelector('form'),actions=content.querySelector('.actions');
  const links=[...content.querySelectorAll(':scope > .actions')];
  if(form&&links.length){const layout=document.createElement('div');layout.className='account-layout';form.before(layout);layout.append(form,...links);}
 }
 if(screen.route.startsWith('customer/checkout-')){
  const steps=document.createElement('nav');steps.className='checkout-steps';steps.setAttribute('aria-label','Checkout progress');
  const labels=['Delivery address','Patient, if needed','Review order'];const routes=['customer/checkout-address','customer/checkout-patient','customer/checkout-summary'];
  // Progress is informational: required business steps cannot be skipped here.
  labels.forEach((label,i)=>{const item=document.createElement('span');item.textContent=`${i+1}. ${label}`;if(routes[i]===screen.route)item.setAttribute('aria-current','step');steps.append(item);});content.prepend(steps);
 }
 if(screen.route==='rider/tasks'&&state.riderSession){const task=[...content.querySelectorAll(':scope > .panel')].find(panel=>panel.querySelector('h2')?.textContent==='Your current delivery');const duty=content.querySelector(':scope > .panel');if(task&&duty&&task!==duty){content.prepend(task);const details=document.createElement('details');details.className='policy-details';const title=document.createElement('summary');title.textContent=`Duty: ${state.duty}`;duty.before(details);details.append(title,duty);}}
 if(screen.platform==='staff'){
  // Technical source contracts stay available, behind task information.
  content.querySelectorAll('.notice').forEach(note=>{if(/Production approval pending:|D-\d{3}/.test(note.textContent)){const details=document.createElement('details');details.className='policy-details';const title=document.createElement('summary');title.textContent='Policy limits for this task';note.before(details);details.append(title,note);}});
 }
}

function validateFields(form){
 form.querySelectorAll('.field-error').forEach(error=>error.remove());form.querySelectorAll('[aria-invalid]').forEach(input=>{input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');});
 const invalid=[...form.elements].filter(input=>input.willValidate&&!input.validity.valid);
 for(const [index,input]of invalid.entries()){
  const message=document.createElement('p');message.className='field-error';message.id=`validation-${index}`;message.textContent=input.validity.valueMissing?'Complete this field to continue.':input.validity.typeMismatch?'Enter a valid value for this field.':input.validationMessage;
  input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',message.id);input.after(message);
 }
 if(invalid.length){invalid[0].focus();return false;}return true;
}


return {composeScreen, validateFields};
})();

/* --- assets/js/experience-pages.js --- */
__modules["assets/js/experience-pages.js"] = (function() {
"use strict";
const {h, button, field} = __modules["shared/ui.js"];

const icons={mobile:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',website:'<rect x="2" y="3" width="20" height="14" rx="1"/><path d="M8 22h8M12 17v5"/>',journeys:'<circle cx="4" cy="5" r="2"/><circle cx="20" cy="19" r="2"/><path d="M6 5h8a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h9"/>'};
const icon=key=>`<svg class="choice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${icons[key]}</svg>`;
function chooser(){return `<main id="main" class="explorer experience-chooser" tabindex="-1"><section class="welcome"><h1>Choose how to explore Pharmville</h1><p class="lead">Choose the mobile app, website, or a complete journey to see how Pharmville works.</p><div class="entry-cards">${[['mobile','Mobile App','Explore the customer shopping app and other mobile-first experiences.','Choose Mobile App'],['website','Website','Explore the customer website and desktop workspaces used by Pharmville staff.','Choose Website'],['journeys','Complete Business Journeys','Follow a task from beginning to end and see what happens when something goes wrong.','Explore Journeys']].map(([key,title,description,label])=>`<article class="entry-card">${icon(key)}<h2>${title}</h2><p>${description}</p><a class="button primary" href="#/${key}">${label}</a></article>`).join('')}</div></section><p class="selection-secondary"><a href="#/directory">Explore by user / Browse all screens</a></p></main>`;}
const labels={customer:'Customer',rider:'Rider Mobile App',pharmacy:'Pharmacist',store:'Store operations',warehouse:'Warehouse',inventory:'Inventory',orders:'Order operations',delivery:'Delivery management',finance:'Finance',reporting:'Reporting',audit:'Audit',support:'Support',admin:'Administration',notifications:'Notifications',access:'Staff access'};
const short={'customer/home':'Home and shopping','customer/login':'Login and account','customer/search':'Search medicines','customer/product':'Product details','customer/cart':'Cart','customer/checkout-summary':'Checkout','customer/payment':'Payment','customer/orders':'Orders','customer/tracking':'Order tracking','customer/prescription-upload':'Prescription upload','customer/profile':'Profile','customer/addresses':'Addresses','rider/tasks':'Assigned deliveries','rider/completion':'Delivery task'};
function selector(experience,screens){
 const relevant=screens.filter(s=>experience==='mobile'?['customer','rider'].includes(s.platform):s.platform!=='rider');
 const groups=[...new Set(relevant.map(s=>s.workspace))];
 const main=['customer/home','customer/login','customer/search','customer/product','customer/cart','customer/checkout-summary','customer/orders','customer/tracking'];
 const card=s=>`<a class="selection-screen" data-selection-card data-search="${h((s.title+' '+labels[s.workspace]).toLowerCase())}" href="#/${experience}/${s.route}" data-action="shell.workspace" data-route="${s.route}" data-experience="${experience}"><strong>${h(short[s.route]||s.title)}</strong><span>${h(s.platform==='rider'?'Rider app':labels[s.workspace])} · ${h(s.title)}</span></a>`;
 return `<main id="main" class="explorer screen-selector" tabindex="-1"><a href="#/choose">← Choose experience</a><h1>Explore the Pharmville ${experience==='mobile'?'Mobile App':'Website'}</h1><p class="lead">${experience==='mobile'?'Choose what you want to see in the app.':'Choose the customer website or a staff workspace.'}</p>${field('Search screens','selection-search','','search','placeholder="Try checkout, prescription or delivery"')}<p data-selection-count role="status">Choose a task below.</p><section><h2>${experience==='mobile'?'Customer Mobile App':'Customer Website'}</h2><div class="selection-grid">${relevant.filter(s=>main.includes(s.route)).map(card).join('')}</div></section><details class="selector-group"><summary>More customer screens</summary><div class="selection-grid">${relevant.filter(s=>s.workspace==='customer'&&!main.includes(s.route)).map(card).join('')}</div></details>${groups.filter(w=>w!=='customer').map(w=>`<details class="selector-group" ${w==='rider'?'open':''}><summary>${labels[w]||w}</summary><div class="selection-grid">${relevant.filter(s=>s.workspace===w).map(card).join('')}</div></details>`).join('')}</main>`;
}
function journeyChooser(journeys){return `<main id="main" class="explorer" tabindex="-1"><a href="#/choose">← Choose experience</a><h1>Complete business journeys</h1><p>Follow the task, take each required action, and try relevant failures along the way.</p><section class="recommended-start"><div><strong>Start with a customer order</strong><span>Find a product, review checkout and follow the result.</span></div>${button('Start with a customer order','shell.flow','data-flow="order" class="primary"')}</section><div class="journey-cards">${Object.entries(journeys).map(([key,item])=>`<article class="journey-card"><h2>${h(item.title)}</h2><p>${h(item.goal)}</p>${button('Start this journey','shell.flow',`data-flow="${key}"`)}</article>`).join('')}</div></main>`;}
function qualifyLinks(root,experience,known){if(!experience)return;for(const a of root.querySelectorAll('a[href^="#/"]')){const raw=a.getAttribute('href').slice(2);if(known.has(raw.split('?')[0]))a.setAttribute('href',`#/${experience}/${raw}`);}}


return {chooser, selector, journeyChooser, qualifyLinks};
})();

/* --- assets/js/situation-copy.js --- */
__modules["assets/js/situation-copy.js"] = (function() {
"use strict";
// Plain-language walkthrough copy. Scenario IDs and domain rules stay in scenarios.js.
const copy={
 empty:['There are no matching results in this view.','Nothing has been submitted or removed.','Clear your filters, refresh, or start the task shown on the screen.'],
 network:['The connection was lost while you were working.','Your saved records remain available. An unsuccessful action is not treated as completed.','Try again after the simulated connection returns. Check any payment already started before paying again.'],
 permission:['The current person does not have access to this task.','Protected information and actions stay restricted.','Return to your workspace. Reviewers can explicitly choose another demonstration role in Review tools.'],
 session:['The demonstration sign-in has expired.','You must sign in again before completing protected actions.','Open the sign-in page for this experience. Your existing order is retained.'],
 'otp-wrong':['The code entered does not match the requested code.','You are not signed in and the delivery is not completed.','Correct the code and try again, or request a new sign-in code.'],
 'otp-expired':['The code is no longer valid.','Even the previously correct code cannot complete sign-in.','Request a new code, then enter that code.'],
 'otp-delivery':['The requested code could not be delivered.','No real message is sent by this prototype. Sign-in remains incomplete.','Retry the demonstration or try the alternate delivery option.'],
 'otp-fallback':['The first way of sending the code failed.','The demonstration shows the same sign-in request using the alternate message channel.','Enter the demonstration code. No real message is sent.'],
 'rate-limit':['Too many code requests or attempts were made.','Further attempts are paused rather than accepted.','Return to the normal demonstration to explore a fresh permitted request.'],
 'invalid-address':['Delivery cannot be confirmed for the selected address.','The order cannot advance using an address that is not yours or is outside the delivery area.','Select one of your serviceable addresses or correct the saved address.'],
 'out-of-stock':['An item is no longer available in the required quantity.','Checkout or preparation is blocked. No unavailable stock is promised.','Update the cart or choose another item. Operations must resolve an order already being prepared.'],
 'price-change':['An item price changed after you viewed it.','The changed total needs your agreement before payment.','Review the updated order summary and explicitly accept it.'],
 'payment-declined':['The payment was declined.','This attempt has a final unsuccessful result. The order is not paid.','Use the permitted retry action after reviewing the same order.'],
 'payment-pending':['The payment result has not been confirmed.','The existing payment is checked using its original reference. Another charge is blocked while the result is unknown.','Choose Check payment status. An unknown result remains pending.'],
 'confirmation-lost':['The customer paid, but the connection was lost before confirmation arrived.','The existing payment is checked instead of creating another charge.','Choose Check payment status to recover the recorded result.'],
 'prescription-rejected':['The pharmacist could not accept the submitted prescription.','Affected medicines cannot proceed to payment. The reason remains visible with the order.','Correct the patient or prescription details and submit again. Only a permitted revised basket can be accepted.'],
 'prescription-partial':['The pharmacist accepted some medicines and rejected others.','The proposed changes wait for the customer’s agreement. Nothing is silently substituted.','Review the reasons and explicitly accept an available revised basket, or replace the prescription.'],
 'prescription-missing':['A medicine requires a prescription that has not been supplied.','The order waits for usable prescription details and pharmacist review.','Add fictional prescription details for the selected patient.'],
 unreadable:['The prescription cannot be read clearly enough for review.','It is not treated as accepted evidence.','Replace the fictional upload and request review again.'],
 conflict:['Someone else changed this record while it was open.','Your older version cannot overwrite the newer decision.','Reload, review what changed, then take any action still permitted.'],
 'stock-expired':['The selected batch or stock hold is no longer eligible.','Preparation or payment stops until eligible stock is confirmed. Existing payment evidence is retained.','Return to the order summary or ask Inventory to resolve eligible supply.'],
 'stale-stock':['The current stock information cannot be confirmed.','New stock promises are blocked until availability is reliable.','Refresh availability before trying again.'],
 'rider-unavailable':['No eligible rider is currently available.','The parcel remains ready for assignment. It is not shown as out for delivery.','Wait or choose another eligible available rider.'],
 'delivery-failed':['The rider could not complete the delivery.','The parcel remains accounted for. The order is not delivered and cash is not invented.','Record the reason. Dispatch can review a reattempt, reschedule or return to store.'],
 offline:['The rider’s device lost its connection.','Submitted proof remains unconfirmed until it can be checked. Delivery and cash are not marked complete.','Reconnect and submit the existing proof for the current assignment.'],
 'cod-shortage':['The cash deposited is less than the cash recorded as collected.','Both actual amounts stay recorded and the difference remains open.','Finance investigates the difference instead of marking it cleared.'],
 'short-receipt':['Fewer items arrived than were expected.','Only the quantity actually accepted is added to stock. The shortage remains recorded.','Record the discrepancy so Receiving and Inventory can investigate.'],
 'refund-delayed':['The refund has no confirmed completion yet.','It remains pending with its original reference. No second payout is created.','Check the existing refund result or ask Finance to review it.'],
 'report-failed':['The report could not be completed.','Incomplete totals are not presented as a finished report.','Retry the same report and filters after recovery.'],
 'access-revoked':['Access changed after the report was prepared.','The protected download stays unavailable.','Ask an authorized person to review access.'],
 'provider-error':['The external service result is unavailable.','The operation stays pending or failed as shown. Missing confirmation is not treated as success.','Check the existing reference after the service recovers.']
};
function situationCopy(key){const value=copy[key];return value?{happened:value[0],now:value[1],next:value[2]}:{happened:'This task needs attention before it can continue.',now:'No action is treated as completed without its required checks.',next:'Follow the correction or recovery action shown on the screen.'};}


return {situationCopy};
})();

/* --- assets/js/demo-fixtures.js --- */
__modules["assets/js/demo-fixtures.js"] = (function() {
"use strict";
const {initialState} = __modules["assets/js/mock-data.js"];
const {establishSession} = __modules["shared/mock-domain.js"];


const copy = value => structuredClone(value);
const fresh = (id, label, description) => {
  const state=initialState();
  state.demoFixture={id,label,description,prepared:true};
  return state;
};

function preparedOrder(state, id='PV-DEMO-STORE-001') {
  state.order={...state.order,id,items:[{productId:'PRD-1',qty:1}],addressId:'ADDR-1',patientId:'PAT-1',status:'Confirmed',review:'Not required',payment:'Not started',method:'cod',stock:'Active',site:'Demo Store 01',revision:1,total:80,history:['Prepared fictional COD order; no cash collected.'],pack:'Not started',delivery:'Accepted',riderId:'RID-1',codCollected:0,refund:'Not requested',returnStatus:'Not requested',note:'',hold:'Active',customerAccepted:true,customerSubmitted:true,quoteAccepted:true,codEligible:true,packageRef:'',inventoryCommitted:false};
  state.riders[0].status='Assigned';
  state.duty='On duty';
  return state;
}

const fixtureInfo={
  signup:{label:'New customer',description:'A fresh fictional account and an empty order. No prior login or checkout is complete.'},
  order:{label:'Customer shopping',description:'A fresh fictional shopping session. The cart is empty and no order, payment or stock hold is complete.'},
  prescription:{label:'Prescription order',description:'A fresh fictional order. Add a prescription item and submit details for pharmacist review; no approval is preloaded.'},
  payment:{label:'Payment walkthrough',description:'A fresh fictional checkout. Payment can start only after the customer completes each current gate.'},
  prepare:{label:'Store fulfillment',description:'An accepted demo cash-on-delivery order is ready for store picking. No cash is collected and stock is not yet committed.'},
  deliver:{label:'Rider delivery',description:'A prepared fictional parcel is ready for Dispatch. Its stock movement is labelled historical demo data; delivery is not complete.'},
  return:{label:'Return request',description:'A signed-in fictional customer and delivered order are provided as prepared history. No return or refund is already approved.'},
  refund:{label:'Refund review',description:'A fictional paid order has a pending refund request. This prepared history does not create a new payment or payout.'},
  receiving:{label:'Warehouse receiving',description:'A fresh warehouse demo is ready to record actual accepted quantity and any discrepancy.'}
  ,procurement:{label:'Procurement review',description:'A synthetic store replenishment request and unverified supplier fixture are ready for purchase-order planning.'}
  ,replenishment:{label:'Out-of-stock recovery',description:'A fresh demo with no open transfer request; the team must request stock before drafting procurement.'}
  ,reverse:{label:'Reverse logistics',description:'A signed-in customer and historical delivered order are ready for a new return request. Eligibility is not pre-approved.'}
  ,support:{label:'Support case walkthrough',description:'A fresh fictional customer account and empty support queue are prepared; the customer verifies by demo OTP before contacting support.'}
};

function fixtureFor(id) {
  const info=fixtureInfo[id]||fixtureInfo.order;
  const state=fresh(id,info.label,info.description);
  const o=state.order;
  state.cart=[];
  state.order={...o,id:'PV-DEMO-NEW-001',items:[],status:'Draft',review:'Not required',payment:'Not started',method:'online',stock:'Not held',revision:0,total:0,history:['A new fictional demo order is ready.'],pack:'Not started',delivery:'Unassigned',riderId:null,codCollected:0,refund:'Not requested',returnStatus:'Not requested',note:'',hold:'Not held',customerAccepted:false,customerSubmitted:false,quoteAccepted:false,codEligible:false,inventoryCommitted:false,pickLines:[],packageRef:'',refundReference:''};
  state.rx={uploaded:false,patientId:'',status:'Not provided',fileName:''};

  if(id==='prepare') preparedOrder(state);
  if(id==='deliver') {
    preparedOrder(state,'PV-DEMO-DELIVERY-001');
    const lot=state.inventory.find(item=>item.id==='LOT-1');
    lot.qty-=1;
    state.products.find(item=>item.id==='PRD-1').stock=lot.qty;
    state.inventoryMovements=[{id:'PREPARED-DEMO-PACK-001',batch:lot.batch,qty:-1,reason:'Historical movement in the clearly labelled prepared delivery fixture'}];
    Object.assign(state.order,{status:'Packed',pack:'Packed',stock:'Committed',hold:'Committed',inventoryCommitted:true,delivery:'Unassigned',riderId:null,packageRef:'PKG-PREPARED-001',pickLines:[{productId:'PRD-1',inventoryId:'LOT-1',batch:lot.batch,qty:1}]});
    state.riders[0].status='Available';state.duty='Off duty';
  }
  if(id==='return') {
    Object.assign(state.order,{id:'PV-DEMO-RETURN-001',items:[{productId:'PRD-1',qty:1}],status:'Delivered',review:'Not required',payment:'Paid',method:'online',stock:'Committed',site:'Demo Store 01',revision:2,total:80,history:['Prepared historical demo order; delivered before this walkthrough.'],pack:'Handed over',delivery:'Delivered',riderId:'RID-1',codCollected:0,refund:'Not requested',returnStatus:'Not requested',note:'',hold:'Committed',customerAccepted:true,customerSubmitted:true,quoteAccepted:true,codEligible:false,inventoryCommitted:true,packageRef:'PKG-HISTORY-001'});
    state.customer.loggedIn=true;state.customer.profileComplete=true;establishSession(state,{identityId:'USR-DEMO-CUSTOMER',role:'Customer',method:'Prepared synthetic OTP session',workspace:'customer'});
  }
  if(id==='reverse') {
    Object.assign(state.order,{id:'PV-DEMO-RETURN-001',items:[{productId:'PRD-1',qty:1}],status:'Delivered',review:'Not required',payment:'Paid',method:'online',stock:'Committed',site:'Demo Store 01',revision:2,total:80,history:['Prepared historical demo order; delivered before this walkthrough.'],pack:'Handed over',delivery:'Delivered',riderId:'RID-1',codCollected:0,refund:'Not requested',returnStatus:'Not requested',note:'',hold:'Committed',customerAccepted:true,customerSubmitted:true,quoteAccepted:true,codEligible:false,inventoryCommitted:true,packageRef:'PKG-HISTORY-001'});
    state.customer.loggedIn=true;state.customer.profileComplete=true;establishSession(state,{identityId:'USR-DEMO-CUSTOMER',role:'Customer',method:'Prepared synthetic OTP session',workspace:'customer'});
  }
  if(id==='replenishment') Object.assign(state.warehouse,{requestProductId:'PRD-2',requestKey:'',destination:'Demo Store 01',priority:'Normal',transferStatus:'Not started',requestedQty:0,dispatchedQty:0,receivedTransferQty:0,shortage:0});
  if(id==='refund') {
    Object.assign(state.order,{id:'PV-DEMO-REFUND-001',items:[{productId:'PRD-1',qty:1}],status:'Cancelled',review:'Not required',payment:'Paid',method:'online',stock:'Released',site:'Demo Store 01',revision:2,total:80,history:['Prepared historical demo order; payment was previously recorded.','Finance refund instruction is pending review.'],pack:'Not started',delivery:'Unassigned',riderId:null,codCollected:0,refund:'Pending',returnStatus:'Not requested',note:'',hold:'Released',customerAccepted:true,customerSubmitted:true,quoteAccepted:true,codEligible:false,inventoryCommitted:false,refundReference:'RF-PREPARED-001'});
    state.staffUi={staffSearch:'',orderSearch:'',orderFilter:'All',auditSearch:'',locationSearch:'',ledger:[],importRows:[],importKind:'catalog',importId:'',importApplied:[],refunds:[{id:'RF-PREPARED-001',amount:40,reason:'Prepared fictional refund request',destination:'Original payment method',status:'Pending'}],refundAmount:'40',refundReason:'Prepared fictional refund request',refundDestination:'Original payment method',refundVerified:false,invoice:'',invoiceStatus:'Pending tax approval',creditReason:'',creditAmount:0,reportFrom:'2026-10-01',reportTo:'2026-10-23',reportSite:'Current location',catalogDraft:null,settingsDraft:null,locations:[],cases:[],alertRead:false,adjustment:null};
  }
  return state;
}


return {fixtureInfo, fixtureFor};
})();

/* --- assets/js/app.js --- */
__modules["assets/js/app.js"] = (function() {
"use strict";
const {screens: customerScreens, handle: customerHandle} = __modules["customer/screens.js"];
const {screens: operationsScreens, handle: operationsHandle} = __modules["operations/screens.js"];
const {screens: staffScreens, handle: staffHandle} = __modules["staff/screens.js"];
const {screens: accessScreens, handle: accessHandle} = __modules["shared/access-screens.js"];
const {screens: extendedScreens, handle: extendedHandle} = __modules["operations/extended-screens.js"];
const {recordEvent} = __modules["shared/mock-domain.js"];
const {h, link, button, field, select, notice, empty} = __modules["shared/ui.js"];
const {initialState, readState, writeState, STORAGE_KEY} = __modules["assets/js/mock-data.js"];
const {readRoute, navigate, roles, workspaceRoles, allowedRole} = __modules["assets/js/navigation.js"];
const {scenarios, genericBlocks} = __modules["assets/js/scenarios.js"];
const {featureCatalog} = __modules["assets/js/feature-catalog.js"];
const {userEntries, journeys, stepsForJourney, journeyGate} = __modules["assets/js/journeys.js"];
const {composeScreen, validateFields} = __modules["shared/presentation.js"];
const {chooser, selector, journeyChooser, qualifyLinks} = __modules["assets/js/experience-pages.js"];
const {situationCopy} = __modules["assets/js/situation-copy.js"];
const {fixtureInfo, fixtureFor} = __modules["assets/js/demo-fixtures.js"];
















const screens=[...customerScreens,...staffScreens,...operationsScreens,...accessScreens,...extendedScreens];
let state=readState(),current=null,activeScenario='normal',activeJourney='',lastWorkspace='',message=null,confirmCallback=null,reviewOpen=false,viewMode='responsive',pendingJourney='',retryableForm=null,restoreFormOnNextRender=false;
let previewOverride=null;
const app=document.querySelector('#app');
const workspaceInfo={customer:['Customer','Shop and manage orders.'],admin:['Admin','Manage approved product and staff information.'],orders:['Order operations','Review orders that need attention.'],returns:['Returns review','Record owner policy outcomes and inspect reverse logistics.'],pharmacy:['Pharmacist','Review prescriptions and record decisions.'],store:['Store staff','Prepare orders for delivery.'],warehouse:['Warehouse staff','Receive and move stock.'],procurement:['Procurement','Review supplier proposals and replenishment purchase orders.'],inventory:['Inventory team','Review batches and stock movements.'],delivery:['Delivery manager','Assign riders and resolve delivery issues.'],rider:['Delivery rider','Pick up and complete deliveries.'],finance:['Finance team','Review payment, refund and cash work.'],reporting:['Reports','Prepare and review reports.'],audit:['Audit','Review read-only activity history.'],notifications:['Notifications','Review message status.'],support:['Support','Route a question to the right team.'],access:['Staff access','Sign in and manage access.']};
const docGuide={Customer_Accounts:'Accounts-and-Login',Authentication_Access:'Accounts-and-Login',Product_Catalog:'Catalog-and-Product-Discovery',Cart_Checkout:'Cart-and-Checkout',Prescription_Upload:'Prescription-and-Pharmacy',Pharmacist_Review:'Prescription-and-Pharmacy',Customer_Orders:'Orders-and-Fulfillment',Order_Operations:'Orders-and-Fulfillment',Admin_CMS:'Admin-and-Operations',Store_Operations:'Store-and-Warehouse',Warehouse:'Store-and-Warehouse',Inventory:'Inventory-and-Stock',Delivery_Operations:'Delivery-and-Rider-App',Rider_App:'Delivery-and-Rider-App',Finance_Payments:'Finance-and-Reconciliation',Reporting:'Reporting-and-Audit',Audit:'Reporting-and-Audit',Notifications:'Notifications-and-Support'};
const features=s=>`<div class="feature-list">${s.features.map(f=>`<span>${h(f)}</span>`).join('')}</div>`;
const routeFor=(workspace,word='')=>screens.find(s=>s.workspace===workspace&&(!word||s.route.includes(word)))?.route||screens.find(s=>s.workspace===workspace)?.route||'';
function announce(text){document.querySelector('#announcements').textContent='';requestAnimationFrame(()=>{document.querySelector('#announcements').textContent=text;});}
function showMessage(text,kind='info'){message={text,kind};render(false);announce(text);if(kind==='error'){const toast=document.querySelector('.toast');toast?.focus({preventScroll:true});toast?.scrollIntoView({block:'nearest'});}}
function persist(){const fixture=state.demoFixture;if(fixture?.id==='customer'&&((state.cart||[]).length||state.order?.status!=='Draft')){fixture.prepared=false;if(state.order?.status==='Draft'){fixture.label='Shopping in progress';fixture.description='Items are in your cart. No order, payment, prescription approval or stock movement has been completed.';}else if(['Delivered','Cancelled'].includes(state.order?.status)){fixture.label='Order history';fixture.description='This order was created during the current demo session. Its current history and status appear below.';}else{fixture.label='Order in progress';fixture.description='This order was created during the current demo session. Its current status appears below.';}}if(!writeState(state))message={text:'Browser storage unavailable. This tab still works in memory; refresh will reset the demo.',kind:'info'};}
function record(text){state.audit.unshift({time:new Date().toLocaleTimeString('en-IN',{hour12:false}),action:text,role:state.role});state.audit=state.audit.slice(0,100);}
function confirm(title,text,callback){confirmCallback=callback;const d=document.querySelector('#confirm-dialog');document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-message').textContent=text;d.showModal();}
function hasDemoProgress(){return Boolean((state.cart||[]).length||(state.order?.items||[]).length||state.order?.status!=='Draft'||state.customer?.loggedIn||state.staffSession||state.riderSession||(state.audit||[]).length||(state.inventoryMovements||[]).length||state.demoFixture?.id&&state.demoFixture.id!=='customer');}
function openJourneyStart(id){if(!journeys[id])return;pendingJourney=id;const info=fixtureInfo[id]||fixtureInfo.order;document.querySelector('#journey-start-title').textContent=journeys[id].title;document.querySelector('#journey-start-description').textContent=`${info.description} You can keep your current data or load this clearly labelled prepared example.`;document.querySelector('#journey-start-dialog').showModal();}
function switchWorkspace(route){const screen=screens.find(s=>s.route===route);if(!screen)return;state.role=workspaceRoles[screen.workspace]||'Admin';state.location=screen.workspace==='warehouse'?'Demo Warehouse':'Demo Store 01';persist();}
function startJourney(id){if(!journeys[id])return;switchWorkspace(journeys[id].steps[0].route);pendingJourney='';document.querySelector('#journey-start-dialog').close();message=null;navigate(journeys[id].steps[0].route,'normal',id,readRoute().experience||'website');}
function loadJourneyFixture(id){if(!journeys[id])return;const info=fixtureInfo[id]||fixtureInfo.order;const replace=()=>{state=fixtureFor(id);lastWorkspace='';persist();message={text:`Prepared demo data loaded: ${info.label}. ${info.description}`,kind:'info'};startJourney(id);};if(hasDemoProgress())confirm('Replace current demo data?',`This will replace the shared fictional customer, order, inventory, rider and finance records in this browser with: ${info.label}. ${info.description}`,replace);else replace();}
function download(name,text,type='text/plain'){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);}
function context(){return {state,screen:current,scenario:activeScenario,go:(route)=>{persist();navigate(route);},save:(text,kind='success')=>{persist();showMessage(text||'Demo state saved.',kind);},notice:showMessage,confirm,hasScenario:key=>activeScenario===key,record,publish:(type,reference,summary,recipient)=>recordEvent(state,{type,reference,summary,recipient}),download};}
function explorer(){
 const directory=screens.map(s=>`<article class="screen-card" data-screen-card data-platform="${h(s.platform)}" data-module="${h(s.module)}" data-search="${h([s.id,s.title,s.description,...s.features,s.workspace].join(' ').toLowerCase())}"><span class="review-metadata">${h(s.id)} · ${h(s.module)}</span><h3>${h(s.title)}</h3><p>${h(s.description)}</p>${features(s)}<div class="actions">${link('Open screen',s.route,'button small')}<a class="compact" href="03-Modules/${h(s.module)}/README.html">Requirements</a></div></article>`).join('');
 return `<main id="main" class="explorer" tabindex="-1"><section class="welcome"><p class="eyebrow">A guided look at the service</p><h1>Explore Pharmville</h1><p class="lead">See how Pharmville works for customers, pharmacists, stores, warehouses, delivery teams, and administrators.</p><div class="entry-cards" role="group" aria-label="Choose an experience"><button type="button" class="entry-card" data-action="shell.explore.mobile"><strong>Explore Mobile App</strong><span>Open the customer experience in a phone-sized preview.</span></button><button type="button" class="entry-card" data-action="shell.explore.website"><strong>Explore Website</strong><span>Open the customer experience in a wide desktop layout.</span></button><button type="button" class="entry-card" data-action="shell.explorer.section" data-target="explore-journeys"><strong>Explore Complete Journeys</strong><span>Follow a task across customers and operational roles.</span></button></div><div class="recommended-start"><div><strong>Start with a customer order</strong><span>Shop, check out and follow one order.</span></div>${button('Start with a customer order','shell.flow','data-flow="order" class="primary"')}</div><div class="secondary-explore"><button type="button" data-action="shell.explorer.section" data-target="explore-users">Explore by user</button><button type="button" data-action="shell.explorer.section" data-target="explore-screens">Browse all screens</button></div></section>
 ${message?`<div class="toast">${notice(message.text,message.kind)}</div>`:''}
 <details class="explore-section" id="explore-users"><summary><span><strong>Explore by user</strong><small>Start in a role’s everyday workspace.</small></span><span aria-hidden="true">＋</span></summary><div class="role-cards">${userEntries.map(entry=>`<a class="role-card" href="#/${h(entry.route)}" data-action="shell.workspace" data-route="${h(entry.route)}"><strong>${h(entry.label)}</strong><span>${h(entry.detail)}</span></a>`).join('')}</div></details>
 <details class="explore-section" id="explore-journeys"><summary><span><strong>Explore a complete journey</strong><small>Follow the same fictional records across roles.</small></span><span aria-hidden="true">＋</span></summary><div class="journey-cards">${Object.entries(journeys).map(([id,item])=>`<article class="journey-card"><h3>${h(item.title)}</h3><p>${h(item.goal)}</p>${button('Start this journey','shell.flow',`data-flow="${h(id)}"`)}</article>`).join('')}</div></details>
 <details class="explore-section" id="explore-screens"><summary><span><strong>Browse all screens</strong><small>Search by screen name, feature ID, user or requirement.</small></span><span aria-hidden="true">＋</span></summary><div class="directory-tools"><div class="explorer-filters">${field('Search screens or feature IDs','screen-search','','search','placeholder="Try refund, prescription or ACC-01" data-filter="search"')}${select('User experience','platform',[['','All users'],['customer','Customer'],['staff','Staff'],['rider','Rider']])}${select('Requirement area','module',[['','All areas'],...Array.from(new Set(screens.map(s=>s.module))).sort().map(m=>[m,m.replaceAll('_',' ')])])}</div><p id="search-count" class="hint" aria-live="polite">${screens.length} screens</p><div class="screen-catalog">${directory}</div></div></details>
 <footer class="screen-footer"><a href="documentation/Screen-Inventory.html">Screen inventory</a><a href="documentation/Complete-Screen-Matrix.html">Complete screen matrix</a><a href="documentation/Feature-Coverage.html">Feature coverage</a><a href="documentation/Edge-Case-Coverage.html">Scenario coverage</a><a href="documentation/UX-State-Coverage.html">UX state coverage</a><a href="documentation/User-Flows.html">Journey guide</a><a href="documentation/Final-UX-Review.html">Final UX review</a></footer></main>`;
}
function whatIfPanel(screen){
 const keys=[...new Set(screen.scenarios.filter(key=>!['normal','loading','validation','duplicate'].includes(key)))];if(screen.route.startsWith('customer/checkout-'))keys.push('payment-pending','payment-declined');
 const story=situationCopy(activeScenario);const label=key=>({'otp-wrong':'The code is incorrect','otp-expired':'The code expired','out-of-stock':'An item goes out of stock','payment-pending':'Payment is still pending','payment-declined':'Payment fails','confirmation-lost':'Payment completed but confirmation was lost','prescription-rejected':'The prescription is rejected','conflict':'Someone updates the record first','delivery-failed':'Delivery cannot be completed','refund-delayed':'The refund is still pending'})[key]||readableScenario(key);
 return `<aside class="what-if"><details ${activeScenario!=='normal'?'open':''}><summary>What if something goes wrong?</summary><p class="hint">Interactive demonstration · only situations relevant to this task.</p><div class="what-if-options">${[...new Set(keys)].map(key=>button(label(key),'shell.whatif',`data-key="${key}" class="secondary"`)).join('')}</div>${activeScenario!=='normal'?`<section class="situation-explanation"><h2>${h(label(activeScenario))}</h2><p><strong>What happened?</strong> ${h(story.happened)}</p><p><strong>What happens now?</strong> ${h(story.now)}</p><p><strong>What can I do?</strong> ${h(story.next)}</p><p>Choosing a situation previews its rule. Completing an action still requires the correct information and access. Returning to normal keeps any changes already recorded.</p>${button('Return to normal demonstration','shell.scenario.normal')}</section>`:''}${screen.route.startsWith('customer/checkout')||screen.route.startsWith('customer/payment')?button('Load a valid fictional checkout','shell.checkout.example'):''}</details></aside>`;
}
function viewSelector(){return `<div class="view-selector" role="group" aria-label="Preview size">${[['responsive','Responsive'],['mobile','Mobile'],['tablet','Tablet'],['desktop','Desktop']].map(([key,label])=>`<button type="button" data-action="shell.view" data-view="${key}" aria-pressed="${viewMode===key}">${label}</button>`).join('')}</div>`;}
function readableScenario(key){return ({normal:'Everything works',network:'Internet connection lost','payment-declined':'Payment not completed','payment-pending':'Payment not confirmed','confirmation-lost':'Payment confirmation delayed','out-of-stock':'Product unavailable','prescription-rejected':'Prescription rejected','rider-unavailable':'No rider available','delivery-failed':'Delivery failed',offline:'Rider connection lost',empty:'No matching results',permission:'This role does not have access',session:'Session expired'})[key]||scenarios[key]?.label||key;}
function reviewPanel(screen){
 const keys=Array.from(new Set(['normal',...screen.scenarios])).filter(k=>scenarios[k]);const sc=scenarios[activeScenario]||scenarios.normal;
 return `<section class="review-panel"><p class="review-intro">Reviewer controls change fictional data in this browser. The illustrative role selector is not an authenticated session or permission grant. No real account, medical, payment or delivery action occurs.</p><details class="review-group" open><summary>Screen information</summary><dl class="review-facts"><dt>Screen ID</dt><dd>${h(screen.id)}</dd><dt>Feature IDs</dt><dd>${screen.features.map(h).join(', ')}</dd><dt>Requirement area</dt><dd>${h(screen.module)}</dd><dt>Current role</dt><dd>${h(state.role)} · ${h(state.location)}</dd></dl>${select('Illustrative role','demo-role',roles,state.role)}${button('Use this workspace role','shell.workspace',`data-route="${h(screen.route)}"`)}</details><details class="review-group" open><summary>Test a situation</summary>${select('Choose a situation','scenario',keys.map(k=>[k,readableScenario(k)]),activeScenario)}<div class="scenario-explanation"><h3>${h(readableScenario(activeScenario))}</h3><p>${h(sc.result)}</p><p><strong>What to do next:</strong> ${h(sc.recovery)}</p><small>Scenario reference: ${h(sc.id)} · Start: ${h(sc.start)} · Trigger: ${h(sc.trigger)}</small></div>${activeScenario!=='normal'?button('Return to normal scenario','shell.scenario.normal','class="secondary"'):''}</details><details class="review-group"><summary>Preview device</summary>${viewSelector()}</details><details class="review-group"><summary>Demo data</summary>${state.demoFixture?`<p class="fixture-banner"><strong>${h(state.demoFixture.label)}${state.demoFixture.prepared?' · prepared demo data':''}</strong><br>${h(state.demoFixture.description)}</p>`:''}${button('Reset demo data','shell.reset','class="secondary"')}</details><details class="review-group"><summary>Related documentation</summary><div class="review-links"><a href="${h(sc.source)}">Scenario requirement</a><a href="00-Business-Guide/${h(docGuide[screen.module]||'Pharmville-Complete-Business-Flow')}.html">Business flow</a><a href="03-Modules/${h(screen.module)}/README.html">Requirements</a><a href="03-Modules/${h(screen.module)}/LLD.html">Business rules</a><a href="documentation/Screen-Inventory.html">Screen inventory</a><a href="documentation/Complete-Screen-Matrix.html">Complete screen matrix</a><a href="documentation/Feature-Coverage.html">Feature coverage</a><a href="documentation/UX-State-Coverage.html">UX state coverage</a><a href="documentation/User-Flows.html">User journeys</a><a href="documentation/Role-Workspace-Matrix.html">Role/workspace matrix</a><a href="documentation/Prototype-Completion-Ledger.html">Coverage ledger</a><a href="documentation/Final-UX-Review.html">Final UX review</a><a href="documentation/Design-Decisions.html">Open UX decisions</a></div></details></section>`;
}
function journeyIndex(steps,route){if(activeJourney==='prescription'&&route==='customer/prescription-status'&&state.order.review==='Pending')return -1;if(activeJourney==='support'&&route==='customer/help'&&state.supportCases?.[0]?.history?.length>1)return steps.length-1;return steps.findIndex(item=>item.route===route);}
function journeyGateHint(id,route){
 const o=state.order;
 const hints={
  'customer/home':'Add at least one product to your cart to continue.',
  'customer/cart':'Review your cart, then continue to checkout.',
  'customer/checkout-address':'Choose a saved address marked available for delivery.',
  'customer/checkout-patient':'Choose the patient for this order.',
  'customer/checkout-summary':'Accept the current items, destination and total.',
  'customer/prescription-upload':'Submit the prescription details so a pharmacist can review them.',
  'pharmacy/queue':'The order needs submitted prescription details before it appears in this queue.',
  'pharmacy/review':'Open the submitted request and review its current evidence.',
  'pharmacy/decision':'Record the applicable line decision before continuing.',
  'customer/prescription-status':'A pharmacist must record a current decision before the customer can continue.',
  'customer/payment':'Complete the current checkout, prescription and stock checks before payment.',
  'customer/payment-result':'Finish one payment attempt to see its result.',
  'customer/payment-recovery':'An uncertain payment attempt is required; check the same reference.',
  'store/queue':'Open an eligible incoming order to begin store preparation.',
  'store/pick':'Accept the order and pick each exact eligible batch and quantity.',
  'store/pack':'Finish picking, then confirm the package and custody checks.',
  'delivery/assignment':'A packed parcel is required before Dispatch can assign a rider.',
  'rider/login':'Sign in with the fictional rider identity and demo code.',
  'rider/tasks':'Set duty to On duty and accept the assigned task.',
  'store/receipt':'An in-transit warehouse transfer is required before recording receipt.',
  'warehouse/replenishment':'Record a stock request before reviewing its quantity.',
  'warehouse/dispatch':'Approve the request and verify the source stock before dispatch.'
 };
 if(route==='customer/prescription-status'&&o.review==='Pending')return 'The customer submitted this prescription. A pharmacist must review it next.';
 if(route==='customer/prescription-status'&&['Approved','Partial'].includes(o.review))return 'Review the pharmacist’s decision, then choose “Continue after review” to recheck stock and the current order.';
 if(route==='customer/payment'&&o.payment==='Pending')return 'Check the existing payment reference. Do not start another attempt.';
 return hints[route]||'Complete the main action on this screen to continue.';
}
function journeyPanel(steps){
 if(!activeJourney||!journeys[activeJourney])return '';
 const item=journeys[activeJourney],index=journeyIndex(steps,current.route);
 if(activeJourney==='prescription'&&current.route==='customer/prescription-status'&&state.order.review==='Pending')return `<section class="journey-guide handoff"><div class="journey-progress-head"><div><p class="eyebrow">Guided handoff · ${h(item.title)}</p><h2>Your prescription is waiting for review</h2><p>The customer submitted the prescription. A pharmacist must review it before this order can continue.</p></div><button type="button" class="quiet" data-action="shell.journey.end">Exit journey</button></div>${button('Continue as Pharmacist','shell.journey.handoff','data-route="pharmacy/queue" class="primary"')}</section>`;
 if(index<0)return `<section class="journey-guide"><strong>${h(item.title)}</strong><p>This task can continue with the same demo record.</p>${button('Exit journey','shell.journey.end','class="quiet"')}</section>`;
 const currentStep=steps[index],previous=steps[index-1],next=steps[index+1],canAdvance=journeyGate(activeJourney,currentStep.route,state),destination=screens.find(s=>s.route===next?.route),nextRole=next?.role||workspaceInfo[destination?.workspace]?.[0]||'',needsHandoff=Boolean(next&&destination&&destination.workspace!==current.workspace);
 const nextControl=!next?button('Finish walkthrough','shell.journey.finish',`class="primary" ${canAdvance?'':'disabled'}`):needsHandoff?button(`Continue as ${h(nextRole)}`,'shell.journey.handoff',`data-route="${h(next.route)}" class="primary" ${canAdvance?'':'disabled'}`):button('Continue','shell.journey.next',`data-route="${h(next.route)}" class="primary" ${canAdvance?'':'disabled'}`);
 return `<section class="journey-guide" aria-label="Journey progress"><div class="journey-progress-head"><div><p class="eyebrow">${h(item.title)} · Step ${index+1} of ${steps.length}</p><h2>${h(currentStep.title)}</h2><p>${h(currentStep.help)}</p></div><button type="button" class="quiet journey-exit" data-action="shell.journey.end">Exit journey</button></div><div class="progress-track" role="progressbar" aria-label="Journey progress" aria-valuemin="1" aria-valuemax="${steps.length}" aria-valuenow="${index+1}"><span style="width:${Math.round((index+1)/steps.length*100)}%"></span></div><div class="journey-actions">${previous?button('Back','shell.journey.go',`data-route="${h(previous.route)}" class="secondary"`):'<span></span>'}${nextControl}</div>${!canAdvance?`<p class="journey-hint" id="journey-gate-help">${h(journeyGateHint(activeJourney,current.route))}</p>`:''}</section>`;
}
function blockedBody(key){const sc=scenarios[key];if(key==='loading')return `<section class="loading-state" role="status"><h2>Loading ${h(current.title.toLowerCase())}…</h2><p>No business action has completed.</p><div class="skeleton"></div><div class="skeleton"></div>${button('Finish simulated loading','shell.normal')}</section>`;if(key==='empty'){const copy=({'customer/cart':['Your cart is empty','Add products to start your order.','Browse products','customer/home'],'customer/orders':['No orders yet','Your orders will appear here after checkout.','Start shopping','customer/home'],'customer/search':['No matching products','Try another product name or browse categories.','Browse categories','customer/categories'],'pharmacy/queue':['No prescriptions waiting','You’re up to date. New requests will appear here.','Refresh queue',''],'store/queue':['No orders to prepare','Eligible incoming orders will appear here.','Refresh orders',''],'rider/tasks':['No deliveries assigned','Check your duty status and refresh for new assignments.','Refresh tasks','']})[current.route]||[`No ${current.workspace==='finance'?'payment records':current.workspace==='warehouse'?'stock tasks':'matching results'}`,`No matching work is available in this ${current.workspace} view. Refresh or adjust your filters.`,'Refresh this view',''];return empty(copy[0],copy[1],copy[3]?link(copy[2],copy[3]):button(copy[2],'shell.normal'));};if(key==='network')return empty('This view could not be loaded','Your existing order, stock and money records have not been restarted.',button('Retry after simulated recovery','shell.normal'));if(key==='session')return empty('Your demo session has expired','Sign in again before taking a protected action.',link('Open demo sign-in',current.platform==='customer'?routeFor('customer','login'):current.platform==='rider'?routeFor('rider','login'):'access/login')+button('Resume normal demo','shell.normal'));return empty('Access restricted',`You are viewing as ${state.role}. This workspace requires ${workspaceRoles[current.workspace]||'authorized staff'} access.`,button('Review access / switch demo role','shell.review.open')+link('Return to Explorer',''));}
function syncProductNavigation(){
 const nav=document.querySelector('#product-nav');
 if(!nav)return;
 nav.hidden=current?.platform!=='customer';
 if(current?.platform==='customer')nav.innerHTML=[[routeFor('customer','home'),'Shop'],[routeFor('customer','cart'),'Cart'],[routeFor('customer','orders'),'Orders'],[routeFor('customer','profile'),'Account']].map(([route,label])=>`<a href="#/${h(route)}" ${current.route===route?'aria-current="page"':''}>${label}</a>`).join('');
}
function syncPreview(){document.body.dataset.preview=viewMode;document.body.dataset.experience=readRoute().experience;}
function render(focus=true){
 const r=readRoute();current=screens.find(s=>s.route===r.route)||null;activeScenario=r.scenario;activeJourney=r.journey;
 if(r.experience)viewMode=previewOverride?.experience===r.experience?previewOverride.mode:r.experience==='mobile'?'mobile':'desktop';
 syncPreview();syncProductNavigation();
 const reviewDialog=document.querySelector('#review-dialog');
  if(['','choose','mobile','website','journeys','directory'].includes(r.route)){if(r.route!=='directory')viewMode='responsive';syncPreview();app.innerHTML=r.route==='directory'?explorer():r.route==='mobile'||r.route==='website'?selector(r.route,screens):r.route==='journeys'?journeyChooser(journeys):chooser();if(focus)document.querySelector('#main')?.focus({preventScroll:true});document.title='Explore Pharmville';document.querySelector('#review-panel-content').innerHTML=`<section class="review-panel"><p class="review-intro">Review tools keep prototype controls separate from the product experience.</p><details class="review-group" open><summary>Screen information</summary><dl class="review-facts"><dt>Screens</dt><dd>${screens.length}</dd><dt>Feature IDs</dt><dd>${featureCatalog.length}</dd><dt>Roles</dt><dd>${userEntries.length}</dd></dl></details><details class="review-group"><summary>Preview device</summary>${viewSelector()}</details><details class="review-group"><summary>Demo data</summary><p>${state.demoFixture?`${h(state.demoFixture.label)}. ${h(state.demoFixture.description)}`:'Current shared fictional records.'}</p>${button('Reset demo data','shell.reset','class="secondary"')}</details><details class="review-group"><summary>Related documentation</summary><div class="review-links"><a href="documentation/Screen-Inventory.html">Screen inventory</a><a href="documentation/Feature-Coverage.html">Feature coverage</a><a href="documentation/Edge-Case-Coverage.html">Scenario coverage</a><a href="documentation/UX-State-Coverage.html">UX state coverage</a><a href="documentation/Design-Decisions.html">UX decisions</a></div></details></section>`;if(reviewOpen&&!reviewDialog.open)reviewDialog.showModal();return;}
 if(r.experience==='mobile'&&current?.platform==='staff'||r.experience==='website'&&current?.platform==='rider'){app.innerHTML=`<main id="main" class="explorer"><h1>This workspace uses a different experience</h1><p>${current.platform==='rider'?'Rider tasks are available in the Mobile App.':'Staff workspaces are available on the Website.'} Your current role and records are unchanged.</p><a href="#/mobile">Mobile App screens</a> · <a href="#/website">Website screens</a></main>`;return;}
 if(!current){app.innerHTML=`<main id="main" class="explorer"><h1>Screen not found</h1>${empty('We could not find that page','Return to Explore Pharmville to choose a supported screen.',link('Explore Pharmville',''))}</main>`;return;}

 if(!current.scenarios.includes(activeScenario)&&activeScenario!=='normal')activeScenario='normal';
 const roleOkay=allowedRole(current,state.role);const revoked=current.platform==='staff'&&current.workspace!=='access'&&state.staffSession===false;const isBlocked=genericBlocks.has(activeScenario)||!roleOkay||revoked;const ctx=context();
 const body=isBlocked?blockedBody(revoked?'session':!roleOkay?'permission':activeScenario):current.render(ctx);
 const networkNotice=activeScenario==='network'&&!isBlocked?`<section class="network-notice" role="status"><div><h2>Connection lost</h2><p>Your saved demo records are unchanged. Check the current status before trying again.</p></div>${button('Try again','shell.normal','class="secondary"')}</section>`:'';
 const workspaceScreens=screens.filter(s=>s.workspace===current.workspace).slice(0,7);
 const sidebar=current.platform==='staff'&&current.workspace!=='access'?`<aside class="side-nav" aria-label="${h(workspaceInfo[current.workspace]?.[0]||'Staff')} navigation"><strong>${h(workspaceInfo[current.workspace]?.[0]||'Staff')}</strong>${workspaceScreens.map(s=>`<a class="${s.route===current.route?'active':''}" ${s.route===current.route?'aria-current="page"':''} href="#/${h(s.route)}">${h(s.title.replace(/ · .*/,''))}</a>`).join('')}</aside>`:'';
 const steps=activeJourney?stepsForJourney(activeJourney,state):[];document.body.dataset.route=current.route;
  app.innerHTML=`<div class="product-frame"><div class="prototype-layout ${sidebar?'has-sidebar':''}">${sidebar}<main id="main" class="main-column" tabindex="-1"><div class="screen-heading"><div><p class="eyebrow">${h(workspaceInfo[current.workspace]?.[0]||'Pharmville')}</p><h1>${h(({ 'customer/checkout-summary':'Review your order','customer/checkout-address':'Choose a delivery address','customer/checkout-patient':'Choose the patient','customer/prescription-upload':'Add prescription details','pharmacy/review':'Review the prescription','pharmacy/decision':'Record your review decision','store/pick':'Pick the order items','store/pack':'Pack the order','delivery/assignment':'Assign a delivery rider','rider/completion':'Confirm the delivery','warehouse/receiving':'Receive a stock delivery' })[current.route]||current.title)}</h1></div></div>${state.demoFixture?.prepared?`<aside class="prepared-label">Guided example · ${h(state.demoFixture.label)}</aside>`:''}${r.experience?`<nav class="experience-return"><a href="#/${r.experience}">← ${r.experience==='mobile'?'Mobile App':'Website'} screens</a><a href="#/choose">Choose experience</a></nav>`:''}${networkNotice}${journeyPanel(steps)}${message?`<div class="toast" tabindex="-1">${notice(message.text,message.kind)}</div>`:''}<div class="screen-content ${h(current.platform)}">${body}</div>${whatIfPanel(current)}</main></div>${current.platform==='customer'?`<nav class="mobile-nav" aria-label="Customer navigation">${[[routeFor('customer','home'),'Shop'],[routeFor('customer','cart'),'Cart'],[routeFor('customer','orders'),'Orders'],[routeFor('customer','profile'),'Account']].map(([route,label])=>`<a href="#/${h(route)}" ${current.route===route?'aria-current="page"':''}>${label}</a>`).join('')}</nav>`:''}</div>`;
 const restoreForm=retryableForm?.route===current.route&&(message?.kind==='error'||restoreFormOnNextRender);if(restoreForm){const form=app.querySelector(`form[data-form="${CSS.escape(retryableForm.name)}"]`);if(form){Array.from(form.elements).forEach((element,index)=>{const saved=retryableForm.controls[index];if(!saved||element.type==='file')return;if(element.type==='checkbox'||element.type==='radio')element.checked=saved.checked;else if(element.tagName==='SELECT'&&element.multiple){const selected=new Set(saved.selected||[]);Array.from(element.options).forEach(option=>option.selected=selected.has(option.value));}else if('value'in element)element.value=saved.value;});}}if(restoreFormOnNextRender){restoreFormOnNextRender=false;retryableForm=null;}else if(retryableForm?.route!==current.route||message?.kind!=='error')retryableForm=null;
 composeScreen(app,current,state);qualifyLinks(app,r.experience,new Set(screens.map(s=>s.route)));qualifyLinks(document.querySelector('#product-nav'),r.experience,new Set(screens.map(s=>s.route)));
 document.querySelector('#review-panel-content').innerHTML=reviewPanel(current);
 if(reviewOpen&&!reviewDialog.open)reviewDialog.showModal();
 document.title=`${current.title} · Pharmville`;if(focus){document.querySelector('#main')?.focus({preventScroll:true});window.scrollTo(0,0);}
}
function formData(formElement,submitter){const data=Object.fromEntries(new FormData(formElement));for(const input of formElement.querySelectorAll('input[type=checkbox]'))data[input.name]=input.checked;return {...data,...formElement.dataset,...submitter?.dataset};}
function dispatch(action,data={}){
 if(action==='shell.reset'){confirm('Reset all demonstration data?','This restores fictional records for every role in this browser and clears unsaved demo progress.',()=>{state=initialState();persist();message={text:'Demo data reset for every workspace.',kind:'success'};render();});return;}
 if(action==='shell.normal'){restoreFormOnNextRender=Boolean(retryableForm?.route===current.route);message=null;navigate(current.route);return;}
 if(action==='shell.scenario.normal'){message=null;navigate(current.route,'normal',activeJourney);return;}
 if(action==='shell.review.open'){reviewOpen=true;render(false);document.querySelector('#review-dialog [data-action="shell.review.close"]')?.focus({preventScroll:true});return;}
 if(action==='shell.review.close'){reviewOpen=false;document.querySelector('#review-dialog')?.close();return;}
 if(action==='shell.view'){const exp=readRoute().experience;if(exp&&current&&['mobile','desktop'].includes(data.view)){previewOverride=null;navigate(current.route,activeScenario,activeJourney,data.view==='mobile'?'mobile':'website');return;}viewMode=['responsive','mobile','tablet','desktop'].includes(data.view)?data.view:'responsive';previewOverride=exp?{experience:exp,mode:viewMode}:null;render(false);return;}
 if(action==='shell.explore.mobile'){navigate('mobile');return;}
 if(action==='shell.explore.website'){navigate('website');return;}
 if(action==='shell.explorer.section'){const section=document.getElementById(data.target);if(section){section.open=true;section.scrollIntoView({behavior:'smooth',block:'start'});section.querySelector('summary')?.focus({preventScroll:true});}return;}
  if(action==='shell.flow'){openJourneyStart(data.flow);return;}
  if(action==='shell.journey.start.close'){pendingJourney='';document.querySelector('#journey-start-dialog').close();return;}
  if(action==='shell.journey.start.current'){startJourney(pendingJourney);return;}
  if(action==='shell.journey.start.fixture'){loadJourneyFixture(pendingJourney);return;}
 if(action==='shell.journey.end'){activeJourney='';message=null;navigate(current?.route||'','normal','');return;}
  if(action==='shell.journey.finish'){if(!journeyGate(activeJourney,current.route,state)){showMessage(journeyGateHint(activeJourney,current.route),'warning');return;}activeJourney='';message={text:'Walkthrough complete. Your demo order remains available.',kind:'success'};navigate(current?.route||'','normal','');return;}
 if(action==='shell.journey.go'||action==='shell.journey.next'||action==='shell.journey.handoff'){
  const destination=data.route||'';
  if(action==='shell.journey.next'&&!journeyGate(activeJourney,current.route,state)){showMessage('Complete the required step before continuing. No order, payment or delivery state was changed.','warning');return;}
    if(action==='shell.journey.handoff'){
    const isPrescriptionPending=activeJourney==='prescription'&&current.route==='customer/prescription-status'&&state.order.review==='Pending'&&state.rx.uploaded;
    if(!isPrescriptionPending&&!journeyGate(activeJourney,current.route,state)){showMessage(journeyGateHint(activeJourney,current.route),'warning');return;}
    const destinationScreen=screens.find(s=>s.route===destination);if(!destinationScreen)return;
    const simulatedRole=workspaceRoles[destinationScreen.workspace]||state.role;
    if(!allowedRole(destinationScreen,simulatedRole)){showMessage('This walkthrough cannot switch to a role that is not allowed for the next screen.','error');return;}
    state.role=simulatedRole;state.location=destinationScreen.workspace==='warehouse'?'Demo Warehouse':'Demo Store 01';persist();
  }
  if(action==='shell.journey.go')switchWorkspace(destination);message=null;navigate(destination,'normal',activeJourney,readRoute().experience?(screens.find(s=>s.route===destination)?.platform==='staff'?'website':screens.find(s=>s.route===destination)?.platform==='rider'?'mobile':readRoute().experience):'');return;
 }
 if(action==='shell.workspace'){switchWorkspace(data.route);message=null;navigate(data.route,'normal',null,data.experience||readRoute().experience);return;}
 if(action==='shell.checkout.example'){
  confirm('Load a checkout example?','Replace the shared fictional records with one customer, one item and an eligible address. No payment or clinical approval is created.',()=>{state=fixtureFor('order');state.role='Customer';state.customer.loggedIn=true;state.customer.profileComplete=true;state.cart=[{productId:'PRD-1',qty:1}];state.order.patientId='self';state.order.addressId=state.customer.addresses.find(a=>a.serviceable)?.id||'';persist();customerHandle('customer.accept-summary',{accepted:true},context());navigate('customer/checkout-summary');});return;
 }
 if(action==='shell.whatif'){
  const key=data.key;if(!scenarios[key]||!current)return;
  if(['payment-pending','confirmation-lost','payment-declined'].includes(key)&&current.platform==='customer'&&(current.route.includes('checkout')||current.route.includes('payment'))){
   if(!allowedRole(current,state.role)||genericBlocks.has(activeScenario)){showMessage('Return to an accessible customer checkout before demonstrating a payment.','warning');return;}
   if(state.order.payment==='Paid'||state.order.method==='cod'&&state.order.status==='Confirmed'){showMessage('This order is already confirmed. Load a new checkout example to demonstrate another payment outcome.','info');return;}
   if(state.order.payment==='Pending'&&key!=='payment-pending'){showMessage('This payment is still being checked. Use Check payment status on the existing reference before exploring a different outcome.','info');return;}
   if(!state.order.quoteAccepted||!state.order.paymentAttempt&&state.order.stock!=='Active'){showMessage('Complete checkout first, or load a valid fictional checkout below. No payment has started.','warning');return;}
   const ctx={...context(),scenario:key,hasScenario:k=>k===key,go:route=>navigate(route,key,activeJourney)};
   customerHandle('customer.pay',{method:'upi'},ctx);return;
  }
  if(key==='session'){if(current.platform==='customer')state.customer.loggedIn=false;else if(current.platform==='rider')state.riderSession=false;else state.staffSession=false;persist();}
  navigate(current.route,key,activeJourney);return;
 }
 if(!current)return;if(genericBlocks.has(activeScenario)||activeScenario==='network'||!allowedRole(current,state.role)||(current.platform==='staff'&&current.workspace!=='access'&&state.staffSession===false)){record('Denied demo action: current role, scenario or revoked session does not permit operation');persist();const copy=activeScenario==='network'?(retryableForm?'This change was not saved. Your entries are still here.':'This action could not complete. Your saved demo records are unchanged.'):'This action is unavailable for your current access. Check your role or sign in again.';showMessage(copy,'error');return;}
 const ctx=context();try{for(const handler of [customerHandle,operationsHandle,staffHandle,accessHandle,extendedHandle])if(handler(action,data,ctx))return;showMessage('This action is unavailable in the current prototype.','info');}catch(error){console.error(error);showMessage('The demo action could not complete. Existing records remain available; reset the demo if needed.','error');}
}
document.addEventListener('click',event=>{if(event.target.closest('.skip-link')){event.preventDefault();document.querySelector('#main')?.focus();return;}const anchor=event.target.closest('a[href^="#/"]');if(anchor?.dataset.action){event.preventDefault();dispatch(anchor.dataset.action,anchor.dataset);return;}if(anchor&&activeJourney){const parts=anchor.getAttribute('href').replace(/^#\/?/,'').split('?')[0].split('/');const exp=['mobile','website'].includes(parts[0])&&parts.length>1?parts.shift():readRoute().experience;const route=parts.join('/');event.preventDefault();navigate(route,'normal',['','choose','mobile','website','journeys','directory'].includes(route)?'':activeJourney,exp);return;}const target=event.target.closest('[data-action]');if(target){event.preventDefault();dispatch(target.dataset.action,target.dataset);}});
document.addEventListener('submit',event=>{const f=event.target.closest('form[data-form]');if(f){event.preventDefault();if(!validateFields(f))return;retryableForm={route:current?.route,name:f.dataset.form,controls:Array.from(f.elements,element=>({value:element.value,checked:element.checked,selected:element.tagName==='SELECT'&&element.multiple?Array.from(element.selectedOptions,option=>option.value):undefined}))};dispatch(f.dataset.form,formData(f,event.submitter));}});
document.addEventListener('change',event=>{if(event.target.name==='scenario'){message=null;navigate(current.route,event.target.value,activeJourney);}else if(event.target.name==='demo-role'){state.role=event.target.value;persist();message=null;render(false);}else if(['platform','module'].includes(event.target.name)&&!current)filterExplorer();});
document.addEventListener('input',event=>{if(event.target.name==='selection-search'){const query=event.target.value.toLowerCase();let count=0;document.querySelectorAll('[data-selection-card]').forEach(card=>{card.hidden=!card.dataset.search.includes(query);if(!card.hidden){count++;card.closest('details')?.setAttribute('open','');}});document.querySelector('[data-selection-count]').textContent=`${count} matching screens`;return;}if(event.target.name==='screen-search')filterExplorer();});
function filterExplorer(){const query=(document.querySelector('[name=screen-search]')?.value||'').toLowerCase();const platform=document.querySelector('[name=platform]')?.value;const module=document.querySelector('[name=module]')?.value;let count=0;document.querySelectorAll('[data-screen-card]').forEach(card=>{const visible=card.dataset.search.includes(query)&&(!platform||card.dataset.platform===platform)&&(!module||card.dataset.module===module);card.hidden=!visible;if(visible)count++;});document.querySelector('#search-count').textContent=`${count} matching screens` ;}
document.querySelector('#confirm-dialog').addEventListener('close',event=>{if(event.target.returnValue==='confirm'&&confirmCallback)confirmCallback();confirmCallback=null;});
document.querySelector('#review-dialog').addEventListener('close',()=>{reviewOpen=false;});
document.querySelector('#journey-start-dialog').addEventListener('close',()=>{if(document.querySelector('#journey-start-dialog').returnValue!=='fixture')pendingJourney='';});
window.addEventListener('hashchange',()=>{previewOverride=null;message=null;render();});
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){state=readState();render(false);announce('Demo data updated in another tab.');}});
window.PHARMVILLE={screens,scenarios,journeys,get state(){return state;},get mode(){return reviewOpen?'review':'experience';},reset(){state=initialState();persist();render(false);},navigate:(route,scenario='normal',experience=null)=>navigate(route,scenario,'',experience),render};
render();


return {screens};
})();

})();
