import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import {fileURLToPath} from 'node:url';

const base=process.env.WIREFRAME_URL||'http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/';
const resultFile=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../artifacts/extended-workflow-results.json');fs.mkdirSync(path.dirname(resultFile),{recursive:true});
const browser=await puppeteer.launch({headless:true,executablePath:process.env.PUPPETEER_EXECUTABLE_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':'/usr/bin/google-chrome')});
const page=await browser.newPage(),checks=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
const verify=(ok,name)=>{assert.ok(ok,name);checks.push(name);};
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function click(name,data={}){const selector=`[data-action="${name}"]`;await page.waitForSelector(selector);await page.$eval(selector,(el,data)=>{Object.assign(el.dataset,data);el.click();},data);await pause(60);}
async function submit(name,values={}){const selector=`form[data-form="${name}"]`;await page.waitForSelector(selector);await page.$eval(selector,(form,values)=>{for(const[key,value]of Object.entries(values)){const field=form.elements.namedItem(key);if(!field)throw new Error(`Missing field ${key}`);if(field.type==='checkbox')field.checked=Boolean(value);else field.value=String(value);}form.requestSubmit();},values);await pause(80);}
async function state(){return page.evaluate(()=>JSON.parse(JSON.stringify(window.PHARMVILLE.state)));}
async function open(route){const experience=route.startsWith('rider/')?'mobile':'website';await page.$eval('[data-action="shell.workspace"]',(button,route)=>{button.dataset.route=route;button.click();},route).catch(async()=>{await page.evaluate(route=>window.PHARMVILLE.navigate(route),route);await page.waitForSelector('[data-action="shell.workspace"]');await page.$eval('[data-action="shell.workspace"]',(button,route)=>{button.dataset.route=route;button.click();},route);});await page.waitForFunction(route=>location.hash.includes(route),{timeout:5000},route);await page.evaluate(({route,experience})=>window.PHARMVILLE.navigate(route,'normal',experience),{route,experience});await page.waitForFunction(({route,experience})=>location.hash.includes(route)&&location.hash.startsWith('#/'+experience+'/'),{timeout:5000},{route,experience});}
async function loadFixture(id){await page.evaluate(()=>window.PHARMVILLE.navigate('journeys'));await page.waitForSelector(`[data-action="shell.flow"][data-flow="${id}"]`);await click('shell.flow',{flow:id});await page.waitForSelector('#journey-start-dialog[open]');await click('shell.journey.start.fixture');await page.waitForFunction(id=>window.PHARMVILLE.state.demoFixture?.id===id,{timeout:5000},id);}

try{
  await page.goto(base,{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.PHARMVILLE?.screens.length===91);

  // Stockout -> purchase-order proposal -> linked receiving -> accepted store stock.
  await loadFixture('replenishment');await open('store/replenishment');
  await submit('store.request',{productId:'PRD-5',qty:5,priority:'Normal',intent:'REQ-UI-STOCKOUT-001',reason:'Synthetic unavailable-item request'});
  verify((await state()).warehouse.transferStatus==='Requested','Store demand is recorded for an unavailable item');
  await open('procurement/orders');await submit('supply.po-create',{reference:'PO-UI-STOCKOUT-001',supplierId:'SUP-DEMO-01',note:'Synthetic request-linked draft'});
  await click('supply.po-approve',{id:'PO-UI-STOCKOUT-001'});verify((await state()).procurement.purchaseOrders[0].status.startsWith('Approved'),'Procurement records an explicit local approval');
  await open('warehouse/receiving');await submit('warehouse.receive',{purchaseOrderRef:'PO-UI-STOCKOUT-001',receiptRef:'GRN-UI-STOCKOUT-001',invoice:'INV-DEMO-UI-001',productId:'PRD-5',batch:'LOT-UI-STOCKOUT-001',manufactured:'2026-06-01',expiry:'2028-06-01',expected:5,qty:5,quality:true});
  verify((await state()).products.find(p=>p.id==='PRD-5').stock===0,'Warehouse receiving does not make store availability appear prematurely');
  const batch=(await state()).inventory.find(i=>i.batch==='LOT-UI-STOCKOUT-001');await open('warehouse/dispatch');await submit('warehouse.dispatch',{transferRef:'TRF-UI-STOCKOUT-001',inventoryId:batch.id,qty:5,note:'Synthetic linked transfer',destination:'Demo Store 01'});
  await open('store/receipt');await submit('store.receive',{transferRef:'TRF-UI-STOCKOUT-001',qty:5,quality:true});verify((await state()).products.find(p=>p.id==='PRD-5').stock===5,'Actual store receipt updates shared customer availability');

  // Delivered-item return -> owner policy outcome -> custody -> quarantine -> separate Finance action.
  await page.evaluate(()=>window.PHARMVILLE.reset());await loadFixture('reverse');await open('customer/return');
  await submit('customer.request-return',{productId:'PRD-1',qty:1,reason:'Damaged or quality issue',detail:'Synthetic report only',acknowledged:true});
  const returnId=(await state()).returnCases[0].id;verify((await state()).returnCases[0].eligibility==='Pending owner policy review','Customer request does not infer return eligibility');
  await open('staff/returns');await submit('returns.review',{returnId,decision:'Eligible',policyRef:'POLICY-UI-DEMO-001',reason:'Synthetic owner decision'});
  await open('delivery/returns');await submit('returns.assign-pickup',{returnId,riderId:'RID-1',pickupRef:'RPU-UI-DEMO-001',note:'Synthetic reverse pickup'});
  await open('rider/login');await submit('rider.login',{riderId:'RID-1',otp:'246810'});await open('rider/returns');await submit('returns.rider-pickup',{pickupRef:'RPU-UI-DEMO-001',verified:true});
  await open('warehouse/returns');const storeQty=(await state()).inventory.filter(i=>i.productId==='PRD-1'&&i.site==='Demo Store 01').reduce((sum,i)=>sum+i.qty,0);
  await submit('returns.inspect',{returnId,disposition:'Quarantine',note:'Synthetic physical receipt and inspection',received:true});verify((await state()).returnCases[0].status==='Inspection complete — quarantined','Warehouse inspection keeps the return quarantined');
  verify((await state()).inventory.filter(i=>i.productId==='PRD-1'&&i.site==='Demo Store 01').reduce((sum,i)=>sum+i.qty,0)===storeQty,'Quarantined return does not increase saleable store stock');
  await open('staff/refunds');await submit('staff.return-finance-decision',{returnId,decision:'Approved for refund review',approvalRef:'FIN-UI-DEMO-001',reason:'Synthetic independent Finance review'});
  await submit('staff.refund-request',{reference:'RF-UI-RETURN-001',returnCaseId:returnId,amount:40,reason:'Approved synthetic return',destination:'Original payment method'});
  verify((await state()).returnCases[0].refundStatus==='Refund pending','Finance approval remains separate from refund completion');
  await click('staff.refund-query',{id:'RF-UI-RETURN-001'});verify((await state()).returnCases[0].refundStatus==='Completed','Customer return status reflects the same completed synthetic refund');

  // Customer support request -> staff assignment and lifecycle -> customer-visible update.
  await page.evaluate(()=>window.PHARMVILLE.reset());await loadFixture('support');await open('customer/login');await submit('customer.request-otp',{phone:'0000000000',consent:true});await open('customer/otp');await submit('customer.verify-otp',{otp:'246810'});
  await open('customer/help');await submit('customer.support-case',{reference:(await state()).order.id,issue:'Order status',summary:'Please explain this synthetic order status.'});
  const caseId=(await state()).supportCases[0].id;await open('staff/support');await submit('staff.support-update',{caseId,team:'Operations — stock or allocation',status:'Assigned',comment:'Routed to the responsible team.'});
  await submit('staff.support-update',{caseId,team:'Operations — stock or allocation',status:'Resolved',comment:'Shared the current status and recovery path.'});
  await open('customer/help');verify((await page.$eval('.screen-content',el=>el.innerText)).includes('Resolved'),'Customer sees the support case update from shared state');

  verify(errors.length===0,`No browser JavaScript errors (${errors.length})`);
  const result={passed:true,checks:checks.length,flows:['procurement stockout recovery','reverse logistics and refund','customer support lifecycle'],errors};fs.writeFileSync(resultFile,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}catch(error){const result={passed:false,checks:checks.length,errors:[...errors,error.message]};fs.writeFileSync(resultFile,JSON.stringify(result,null,2)+'\n');console.error(error);console.log(JSON.stringify(result,null,2));process.exitCode=1;}finally{await browser.close();}
