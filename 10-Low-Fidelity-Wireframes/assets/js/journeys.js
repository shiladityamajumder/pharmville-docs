export const userEntries = [
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

export const journeys = {
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

export function stepsForJourney(id, state) {
  const selected=journeys[id];
  if(!selected)return [];
  if(id==='reverse'&&state.returnCases?.[0]?.eligibility==='Not eligible')return selected.steps.slice(0,2);
  if(id==='order' && state.cart.some(item=>state.products.find(p=>p.id===item.productId)?.class==='P')) {
    return [step('customer/home','Find a product','Search or browse, then add a prescription medicine.'),step('customer/cart','Review your cart','Check the items and quantities.'),step('customer/checkout-address','Choose a delivery address','Only a confirmed serviceable address can continue.'),step('customer/checkout-patient','Choose the patient','One authorized patient is used for this order.'),step('customer/checkout-summary','Review your order','Accept the current items, address and total.'),step('customer/prescription-upload','Provide prescription details','Enter a fictional filename; no file contents are uploaded.'),step('pharmacy/queue','Pharmacist receives the request','The order waits for an authorized pharmacist.','Pharmacist'),step('pharmacy/review','Review the submitted evidence','Compare the patient, prescription and exact P lines.','Pharmacist'),step('pharmacy/decision','Record a decision','The pharmacist must make the applicable line decision.','Pharmacist'),step('customer/prescription-status','Customer reviews the result','Eligible lines still require customer acceptance.','Customer'),step('customer/payment','Complete the payment step','Payment remains blocked until review and stock checks pass.'),step('customer/payment-result','Check the payment result','The order is updated only after payment is verified.'),step('customer/tracking','Follow the order','See the next fulfillment milestone.')];
  }
  return selected.steps;
}

export function journeyGate(id, route, state) {
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
