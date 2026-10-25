import assert from 'node:assert/strict';
import {initialState} from '../assets/js/mock-data.js';
import {fixtureFor} from '../assets/js/demo-fixtures.js';
import {handle as customerHandle} from '../customer/screens.js';
import {handle as operationsHandle} from '../operations/screens.js';
import {handle as staffHandle} from '../staff/screens.js';
import {handle as accessHandle} from '../shared/access-screens.js';
import {handle as extendedHandle} from '../operations/extended-screens.js';
import {recordEvent} from '../shared/mock-domain.js';

const checks=[];
const context=state=>({state,screen:{route:'test'},scenario:'normal',messages:[],record(message){state.audit||=[];state.audit.unshift({time:'demo',role:state.role,action:message});},publish(type,reference,summary,recipient){recordEvent(state,{type,reference,summary,recipient});},save(message){this.last=message;},notice(message){this.messages.push(message);},go(route){this.route=route;},confirm(_title,_message,callback){callback();},hasScenario:()=>false,download(){}});
function run(handler,action,data,state,message){const ctx=context(state);assert.equal(handler(action,data,ctx),true,`${action} is handled`);if(message)assert.match(ctx.messages.join(' '),message);checks.push(action);return ctx;}

// One identity service handles staff password+MFA, customer OTP and rider OTP adapters.
{
 const s=initialState();run(accessHandle,'access.password',{identifier:'admin@example.test',password:'fictional'},s);run(accessHandle,'access.mfa',{code:s.demoOtp},s);assert.equal(s.identitySession.identityId,'USR-DEMO-ADMIN');assert.equal(s.identitySession.mfaVerified,true);assert(s.identitySession.permittedWorkspaces.includes('orders'));assert(!s.identitySession.permittedWorkspaces.includes('pharmacy'));run(accessHandle,'access.enter-workspace',{workspace:'pharmacy'},s,/not assigned/);const entered=run(accessHandle,'access.enter-workspace',{workspace:'orders'},s);assert.equal(entered.route,'staff/orders');const stepUp=run(accessHandle,'access.enter-workspace',{workspace:'admin'},s);assert.equal(stepUp.route,'access/mfa');assert.equal(s.stepUpWorkspace,'admin');const elevated=run(accessHandle,'access.mfa',{code:s.demoOtp},s);assert.equal(elevated.route,'staff/dashboard');assert(s.identitySession.stepUpVerifiedFor.includes('admin'));
 const unknown=initialState();run(accessHandle,'access.password',{identifier:'unknown@example.test',password:'fictional'},unknown);const rejected=run(accessHandle,'access.mfa',{code:unknown.demoOtp},unknown,/Verification could not be completed/);assert.equal(unknown.identitySession,null);assert.match(rejected.messages[0],/could not be completed/);
 const customer=initialState();customer.customer.otpRequested=true;run(customerHandle,'customer.verify-otp',{otp:customer.demoOtp},customer);assert.equal(customer.identitySession.role,'Customer');assert.deepEqual(customer.identitySession.permittedWorkspaces,['customer']);
}

// A stockout demand produces one linked PO, one supplier receipt, one transfer and a store availability change.
{
 const s=fixtureFor('replenishment');s.role='Store worker';s.location='Demo Store 01';
 run(operationsHandle,'store.request',{productId:'PRD-5',qty:5,priority:'Normal',intent:'REQ-STOCKOUT-001',reason:'Fictional unavailable product'},s);assert.equal(s.warehouse.transferStatus,'Requested');
 s.role='Procurement';run(extendedHandle,'supply.po-create',{reference:'PO-STOCKOUT-001',supplierId:'SUP-DEMO-01',note:'Synthetic linked purchase order'},s);run(extendedHandle,'supply.po-approve',{id:'PO-STOCKOUT-001'},s);assert.equal(s.warehouse.transferStatus,'Approved');
 s.role='Warehouse worker';s.location='Demo Warehouse';run(operationsHandle,'warehouse.receive',{purchaseOrderRef:'PO-STOCKOUT-001',receiptRef:'GRN-STOCKOUT-001',invoice:'INV-DEMO-001',productId:'PRD-5',batch:'LOT-STOCKOUT-001',manufactured:'2026-06-01',expiry:'2028-06-01',expected:5,qty:5,quality:true},s);assert.equal(s.warehouse.receivedQty,5);assert.equal(s.products.find(p=>p.id==='PRD-5').stock,0,'Warehouse receipt alone does not make store stock available');
 const source=s.inventory.find(l=>l.batch==='LOT-STOCKOUT-001');run(operationsHandle,'warehouse.dispatch',{transferRef:'TRF-STOCKOUT-001',inventoryId:source.id,qty:5,note:'Synthetic transfer',destination:'Demo Store 01'},s);assert.equal(s.warehouse.transferStatus,'In transit');
 s.role='Store worker';s.location='Demo Store 01';run(operationsHandle,'store.receive',{transferRef:'TRF-STOCKOUT-001',qty:5,quality:true},s);assert.equal(s.warehouse.transferStatus,'Received');assert.equal(s.products.find(p=>p.id==='PRD-5').stock,5,'Store receipt updates indicative customer availability');
}

// Reverse logistics requires owner eligibility, custody, quarantine and an independent Finance decision.
{
 const s=fixtureFor('reverse');run(customerHandle,'customer.request-return',{productId:'PRD-1',qty:1,reason:'Damaged or quality issue',detail:'Synthetic demo report',acknowledged:true},s);const c=s.returnCases[0];assert.equal(c.eligibility,'Pending owner policy review');
 s.role='Order operator';run(extendedHandle,'returns.review',{returnId:c.id,decision:'Eligible',policyRef:'POLICY-DEMO-001',reason:'Synthetic owner outcome only'},s);assert.equal(c.eligibility,'Eligible');
 s.role='Dispatcher';run(extendedHandle,'returns.assign-pickup',{returnId:c.id,riderId:'RID-1',pickupRef:'RPU-DEMO-001',note:'Synthetic reverse dispatch'},s);s.role='Rider';run(operationsHandle,'rider.login',{riderId:'RID-1',otp:s.demoOtp},s);run(extendedHandle,'returns.rider-pickup',{pickupRef:'RPU-DEMO-001',verified:true},s);assert.equal(c.pickup.status,'Picked up');
 s.role='Warehouse worker';s.location='Demo Warehouse';const storeQty=s.inventory.filter(l=>l.productId==='PRD-1'&&l.site==='Demo Store 01').reduce((n,l)=>n+l.qty,0);run(extendedHandle,'returns.inspect',{returnId:c.id,disposition:'Quarantine',note:'Synthetic inspection recorded',received:true},s);assert.equal(c.status,'Inspection complete — quarantined');assert.equal(s.inventory.filter(l=>l.productId==='PRD-1'&&l.site==='Demo Store 01').reduce((n,l)=>n+l.qty,0),storeQty,'Return inspection does not restock saleable inventory');
 s.role='Finance';run(extendedHandle,'staff.return-finance-decision',{returnId:c.id,decision:'Approved for refund review',approvalRef:'FIN-DEMO-001',reason:'Synthetic Finance decision'},s);run(staffHandle,'staff.refund-request',{reference:'RF-RETURN-DEMO-001',returnCaseId:c.id,amount:40,reason:'Approved demo return',destination:'Original payment method'},s);assert.equal(c.refundStatus,'Refund pending');run(staffHandle,'staff.refund-query',{id:'RF-RETURN-DEMO-001'},s);assert.equal(c.refundStatus,'Completed');assert.equal(s.order.refund,'Completed');
}

// Customer support cases move through an explicit lifecycle and notify the shared event log.
{
 const s=initialState();s.customer.otpRequested=true;run(customerHandle,'customer.verify-otp',{otp:s.demoOtp},s);run(extendedHandle,'customer.support-case',{reference:s.order.id,issue:'Order status',summary:'Please explain the current demo order status.'},s);const c=s.supportCases[0];assert.equal(c.status,'Open');s.role='Support';run(staffHandle,'staff.support-update',{caseId:c.id,team:'Operations — stock or allocation',status:'Assigned',comment:'Routed to the responsible demo team.'},s);assert.equal(c.status,'Assigned');run(staffHandle,'staff.support-update',{caseId:c.id,team:c.team,status:'Resolved',comment:'Shared the current status and recovery route.'},s);run(staffHandle,'staff.support-update',{caseId:c.id,team:c.team,status:'Closed',comment:'Customer issue closed in the demo.'},s);assert.equal(c.status,'Closed');assert(s.domainEvents.length>=2);
}

console.log(JSON.stringify({passed:true,checks:checks.length,flows:['unified identity','out-of-stock procurement','reverse logistics and refund','customer support lifecycle']},null,2));
