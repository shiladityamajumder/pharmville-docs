export const userEntries = [
  {label:'Customer', detail:'Find products, place orders and follow delivery.', route:'customer/home'},
  {label:'Pharmacist', detail:'Review prescriptions and record line decisions.', route:'pharmacy/queue'},
  {label:'Store staff', detail:'Prepare accepted orders and hand parcels to riders.', route:'store/queue'},
  {label:'Warehouse staff', detail:'Receive stock and fulfill store requests.', route:'warehouse/receiving'},
  {label:'Delivery manager', detail:'Assign ready parcels and resolve exceptions.', route:'delivery/assignment'},
  {label:'Delivery rider', detail:'Pick up, deliver and record proof on a phone.', route:'rider/tasks'},
  {label:'Admin', detail:'Manage people and approved catalog content.', route:'staff/dashboard'},
  {label:'Finance team', detail:'Review payments, refunds and cash differences.', route:'staff/reconciliation'}
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
  ]}
};

export function stepsForJourney(id, state) {
  const selected=journeys[id];
  if(!selected)return [];
  if(id==='order' && state.cart.some(item=>state.products.find(p=>p.id===item.productId)?.class==='P')) {
    return [step('customer/home','Find a product','Search or browse, then add a prescription medicine.'),step('customer/cart','Review your cart','Check the items and quantities.'),step('customer/checkout-address','Choose a delivery address','Only a confirmed serviceable address can continue.'),step('customer/checkout-patient','Choose the patient','One authorized patient is used for this order.'),step('customer/checkout-summary','Review your order','Accept the current items, address and total.'),step('customer/prescription-upload','Provide prescription details','Enter a fictional filename; no file contents are uploaded.'),step('pharmacy/queue','Pharmacist receives the request','The order waits for an authorized pharmacist.','Pharmacist'),step('pharmacy/review','Review the submitted evidence','Compare the patient, prescription and exact P lines.','Pharmacist'),step('pharmacy/decision','Record a decision','The pharmacist must make the applicable line decision.','Pharmacist'),step('customer/prescription-status','Customer reviews the result','Eligible lines still require customer acceptance.','Customer'),step('customer/payment','Complete the payment step','Payment remains blocked until review and stock checks pass.'),step('customer/payment-result','Check the payment result','The order is updated only after payment is verified.'),step('customer/tracking','Follow the order','See the next fulfillment milestone.')];
  }
  return selected.steps;
}

export function journeyGate(id, route, state) {
  const o=state.order;
  if(id==='signup')return route==='customer/login'?true:route==='customer/otp'?state.customer.otpRequested:route==='customer/profile'?state.customer.loggedIn:true;
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
    if(route==='customer/payment')return o.payment==='Paid'||o.method==='cod'||o.status==='Awaiting payment';
    if(route==='customer/payment-result')return o.payment!=='Not started'||o.method==='cod';
    if(route==='customer/tracking')return o.status==='Confirmed'||o.payment==='Paid'||o.delivery==='Delivered';
  }
  if(id==='payment'){
    if(route==='customer/payment')return o.quoteAccepted&&o.stock==='Active';
    if(route==='customer/payment-result')return o.payment!=='Not started';
    if(route==='customer/payment-recovery')return o.payment==='Pending'||o.payment==='Paid';
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
  if(id==='receiving'&&route==='store/receipt')return state.warehouse.transferStatus==='In transit'||state.warehouse.transferStatus==='Received';
  return true;
}
