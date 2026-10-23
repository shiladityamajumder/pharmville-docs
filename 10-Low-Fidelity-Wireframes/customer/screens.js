import {h, link, button, field, select, form, table, badge, panel, notice, money, timeline, empty} from '../shared/ui.js';

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

export const screens = [
  sc(1, 'login', 'Sign in with your mobile', 'Customer_Accounts', ['ACC-01', 'ACC-05', 'AUTH-03'], 'Mobile sign-in, current privacy notice and explicit acknowledgement.', [...basic, 'otp-delivery', 'otp-fallback', 'rate-limit'], ctx => `<p>Sign in to save your cart and manage your orders.</p>${ctx.scenario === 'rate-limit' ? notice('Too many requests. A new code cannot be requested until the configured security window allows it.', 'error') : ''}${ctx.scenario === 'otp-delivery' ? notice('WhatsApp delivery is unavailable. Request status stays pending; configured fallback can be checked on the next screen.', 'warning') : ''}${ctx.scenario === 'otp-fallback' ? notice('Demo fallback: WhatsApp fails and the same challenge is sent through SMS once.') : ''}${form('customer.request-otp', field('Mobile number', 'phone', ctx.state.customer.phone, 'tel', 'autocomplete="tel" inputmode="tel" required') + '<p>Your details are used to manage your account and orders. Read the privacy notice before continuing.</p>' + check('I have read privacy notice DEMO-v1', 'consent'), 'Request code')}${link('Browse without signing in', 'customer/home')}`),
  sc(2, 'otp', 'Verify your code', 'Customer_Accounts', ['ACC-01', 'AUTH-03'], 'Wrong, expired, delayed and fallback verification paths preserve one session.', [...basic, 'otp-wrong', 'otp-expired', 'otp-delivery', 'otp-fallback', 'rate-limit', 'duplicate'], ctx => `${panel('Delivery status', `<p>Number ending ${h(String(ctx.state.customer.phone || '').slice(-4))} · ${h(ctx.state.customer.otpDelivery || 'No code requested')}</p><p>Demo code: <strong>246810</strong>. Use this code for the fictional walkthrough.</p>`)}${ctx.scenario === 'otp-wrong' ? notice('Incorrect-code scenario: verification will fail without signing you in.', 'error') : ''}${ctx.scenario === 'otp-expired' ? notice('This code has expired. Request a new challenge.', 'warning') : ''}${ctx.scenario === 'otp-delivery' ? notice('Delivery is pending. Check configured SMS fallback; identity proof cannot be bypassed.', 'warning') : ''}${ctx.scenario === 'otp-fallback' ? notice('SMS fallback is configured for this demo challenge; use the same code.') : ''}${form('customer.verify-otp', field('Six-digit code', 'otp', '', 'text', 'autocomplete="one-time-code" inputmode="numeric" maxlength="6" required'), 'Verify and continue')}${actions(button('Resend code', 'customer.resend-otp'), button('Check SMS fallback', 'customer.otp-fallback'), link('Change mobile', 'customer/login'))}`),
  sc(3, 'profile', 'My profile', 'Customer_Accounts', ['ACC-02'], 'Complete signup and safely request a verified contact change.', [...basic, 'conflict', 'permission'], ctx => `${!ctx.state.customer.profileComplete ? notice('Complete your name before checkout. A verified phone alone does not complete signup.', 'warning') : ''}${form('customer.save-profile', field('Full name', 'name', ctx.state.customer.name, 'text', 'autocomplete="name" maxlength="100" required') + field('Email (optional)', 'email', ctx.state.customer.email, 'email', 'autocomplete="email"') + field('Mobile', 'phone', ctx.state.customer.phone, 'tel', 'autocomplete="tel"') + '<p>Changing a verified contact requires another verification step. Your current contact remains active until then.</p>', 'Save profile')}${ctx.state.customer.contactPending ? notice(`Replacement contact ${ctx.state.customer.contactPending} awaits approved verification. Existing mobile preserved.`) : ''}${ctx.state.customer.emailPending ? notice(`Email change to ${ctx.state.customer.emailPending} awaits approved proof; existing email preserved.`) : ''}${actions(link('Saved addresses', 'customer/addresses'), link('Family profiles', 'customer/family'), link('Privacy and consent', 'customer/privacy'), link('Account deletion', 'customer/deletion'), link('Wishlist', 'customer/wishlist'), button('Sign out', 'customer.signout'))}`),
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
  sc(25, 'order-detail', 'Order details and confirmation', 'Customer_Orders', ['ORD-01', 'ORD-02', 'ORD-03', 'ORD-04', 'ORD-05', 'ORD-06', 'ORD-09'], 'Read current accepted order, timeline and eligible aftercare actions.', [...basic, 'permission', 'confirmation-lost', 'conflict'], ctx => `${orderFacts(ctx.state)}<p>Total ${money(ctx.state.order.total)} · destination ${h(address(ctx.state)?.line || 'Not selected')} · patient ${h(patientOptions(ctx.state).find(p => p[0] === ctx.state.order.patientId)?.[1] || 'Not selected')}</p>${linesTable(ctx.state, items(ctx.state))}${panel('Order history', timeline(ctx.state.order.history || ['Order draft created']))}${panel('Confirmation messages', `<p>Delivery status: ${h(ctx.state.notification.status)}. Message delivery never creates a second order.</p>`)}${actions(link('Delivery tracking and OTP', 'customer/tracking'), link('Cancel request', 'customer/cancellation'), link('Return / quality complaint', 'customer/return'), link('Refund status', 'customer/refund'), link('Invoice', 'customer/invoice'), button('Change items / address (policy pending)', 'customer.edit-placed-order'), link('Check payment', 'customer/payment-recovery'))}<p>Post-order edits await ORD-09 / D-010 approval and cannot silently change accepted terms.</p>`),
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

export function handle(action, data, ctx) {
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
      c.loggedIn = true; c.otpConsumed = true; ctx.record('Customer demo challenge consumed once; one session active'); ctx.save('Signed in.'); return go(c.profileComplete ? 'customer/home' : 'customer/profile');
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
    case 'customer.signout': c.loggedIn = false; ctx.save('Signed out; local synthetic history retained.'); return go('customer/login');
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
      o.returnStatus = 'Requested'; o.returnRequest = {productId: data.productId, qty, reason: String(data.reason), detail: String(data.detail || '')}; addHistory(ctx, 'Customer item-specific return/quality request submitted; policy and inspection pending'); return save('Return request recorded for eligibility review. No refund or saleable stock was created.');
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

