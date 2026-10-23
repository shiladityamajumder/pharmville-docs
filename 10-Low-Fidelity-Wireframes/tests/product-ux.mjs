import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
const out=path.resolve(import.meta.dirname,'../artifacts/product-ux');fs.mkdirSync(out,{recursive:true});
const browser=await puppeteer.launch({headless:true,executablePath:process.env.PUPPETEER_EXECUTABLE_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage(),checks=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const assert=(value,message)=>{if(!value)throw Error(message);checks.push(message);};
const wait=()=>new Promise(r=>setTimeout(r,80));
async function open(route,scenario='normal'){
 await page.$eval('[data-action="shell.workspace"]',(button,route)=>{button.dataset.route=route;button.click();},route);await wait();
 await page.evaluate(({route,scenario})=>PHARMVILLE.navigate(route,scenario),{route,scenario});await wait();
}
try{
 await page.setViewport({width:1440,height:900});await page.goto('http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/',{waitUntil:'networkidle0'});
 await page.evaluate(()=>PHARMVILLE.navigate('customer/home'));await wait();
 await page.evaluate(()=>PHARMVILLE.navigate('pharmacy/decision'));await wait();
 assert(await page.evaluate(()=>PHARMVILLE.state.role==='Customer'&&!document.querySelector('.screen-content form')&&document.querySelector('.screen-content').innerText.includes('Access restricted')),'Direct pharmacy URL does not grant a customer pharmacist rights');
 await page.select('[name="demo-role"]','Pharmacist');await wait();assert(await page.evaluate(()=>PHARMVILLE.state.role==='Pharmacist'),'Explicit reviewer role selection works');
 await page.evaluate(()=>PHARMVILLE.navigate('staff/refunds'));await wait();assert(await page.evaluate(()=>PHARMVILLE.state.role==='Pharmacist'&&!document.querySelector('.screen-content form')),'Pharmacist cannot gain Finance permission through a URL');
 await open('customer/home');assert(await page.$$eval('.screen-content nav[aria-label="Customer navigation"]',nodes=>nodes.length===0),'Customer screen renderers no longer duplicate shell navigation');
 await open('customer/login');await page.$eval('form',form=>{form.elements.phone.value='';form.requestSubmit();});assert(await page.$eval('[name="phone"]',input=>input.getAttribute('aria-invalid')==='true'&&document.activeElement===input),'Invalid required input has linked inline feedback and focus');
 await open('customer/search');await page.$eval('form',form=>{form.elements.searchClass.value='P';form.elements.searchSort.value='high';form.requestSubmit();});await wait();
 assert(await page.$$eval('.product-card',cards=>cards.length>0&&cards.every(card=>card.innerText.includes('Prescription required'))),'Product-type filtering changes the displayed records');
 const before=await page.evaluate(()=>JSON.stringify(PHARMVILLE.state.order));await page.$eval('[data-action="shell.view"]',button=>{button.dataset.view='mobile';button.click();});await wait();assert(await page.evaluate(()=>JSON.stringify(PHARMVILLE.state.order))===before,'Device switching preserves the order record');
 await open('customer/otp','otp-expired');await page.$eval('form',form=>{form.elements.otp.value='246810';form.requestSubmit();});await wait();assert(await page.evaluate(()=>!PHARMVILLE.state.customer.loggedIn),'Expired OTP rejects even the correct demonstration code');
 await page.evaluate(async()=>{const {fixtureFor}=await import('./assets/js/demo-fixtures.js');const {writeState,STORAGE_KEY}=await import('./assets/js/mock-data.js');const s=fixtureFor('order');s.cart=[{productId:'PRD-1',qty:1}];s.customer.loggedIn=true;s.customer.profileComplete=true;s.order.addressId='ADDR-1';s.order.patientId='self';writeState(s);window.dispatchEvent(new StorageEvent('storage',{key:STORAGE_KEY}));});await wait();
 await open('customer/checkout-summary');await page.$eval('form[data-form="customer.accept-summary"]',form=>{form.elements.accepted.checked=true;form.requestSubmit();});await wait();
 const accepted=await page.evaluate(()=>({id:PHARMVILLE.state.order.id,revision:PHARMVILLE.state.order.revision,history:PHARMVILLE.state.order.history.length}));
 assert(await page.evaluate(()=>PHARMVILLE.state.order.customerSubmitted&&PHARMVILLE.state.order.stock==='Active'),'Checkout accepts a valid owned address and obtains eligible stock');
 await open('customer/checkout-summary','duplicate');await page.$eval('form[data-form="customer.accept-summary"]',form=>{form.elements.accepted.checked=true;form.requestSubmit();});await wait();
 assert(await page.evaluate(({accepted})=>PHARMVILLE.state.order.id===accepted.id&&PHARMVILLE.state.order.revision===accepted.revision&&PHARMVILLE.state.order.history.length===accepted.history,{accepted}),'Duplicate checkout reuses the order revision without another history or stock effect');
 await page.evaluate(async()=>{const {fixtureFor}=await import('./assets/js/demo-fixtures.js');const {writeState,STORAGE_KEY}=await import('./assets/js/mock-data.js');const s=fixtureFor('prepare');s.order.items=[{productId:'PRD-3',qty:1}];s.order.review='Pending';s.rx={uploaded:true,patientId:s.order.patientId,fileName:'fictional.pdf',status:'Pending'};writeState(s);window.dispatchEvent(new StorageEvent('storage',{key:STORAGE_KEY}));});await wait();
 await open('pharmacy/decision','conflict');await page.$eval('form[data-form="pharmacy.decide"]',form=>{form.elements.checked.checked=true;form.requestSubmit();});await wait();
 assert(await page.evaluate(()=>PHARMVILLE.state.order.review==='Pending'),'Concurrent prescription review cannot overwrite the current decision');
 assert(await page.$eval('.toast',node=>/current|changed|version|reload/i.test(node.textContent)),'Concurrent review explains why refreshed evidence is required');
 // Prepared fixture is test setup, not an automatically executed business operation.
 await page.evaluate(async()=>{const {fixtureFor}=await import('./assets/js/demo-fixtures.js');const {writeState,STORAGE_KEY}=await import('./assets/js/mock-data.js');const state=fixtureFor('prepare');state.cart=structuredClone(state.order.items);state.customer.loggedIn=true;state.customer.profileComplete=true;state.order.patientId='self';writeState(state);window.dispatchEvent(new StorageEvent('storage',{key:STORAGE_KEY}));});await wait();
 const routes=['customer/home','customer/search','customer/product','customer/cart','customer/checkout-summary','customer/payment-result','customer/profile','customer/tracking','pharmacy/review','store/pick','warehouse/receiving','delivery/assignment','rider/tasks','rider/completion','staff/reconciliation'];
 for(const width of [390,1440]){
  await page.setViewport({width,height:width===390?844:900});
  await page.$eval('[data-action="shell.view"]',button=>{button.dataset.view='responsive';button.click();});
  for(const route of routes){await page.evaluate(async route=>{const {fixtureFor}=await import('./assets/js/demo-fixtures.js');const {writeState,STORAGE_KEY}=await import('./assets/js/mock-data.js');const s=fixtureFor('prepare');s.cart=structuredClone(s.order.items);s.customer.loggedIn=true;s.customer.profileComplete=true;s.order.patientId='self';if(route.startsWith('pharmacy/')){s.order.items=[{productId:'PRD-3',qty:1}];s.order.review='Pending';s.rx={uploaded:true,patientId:'self',fileName:'fictional.pdf',status:'Pending'};}if(route.startsWith('rider/')){s.riderSession=true;s.riderId='RID-1';s.order.delivery='Picked up';s.order.pack='Handed over';}if(route==='customer/payment-result'){s.order.payment='Pending';s.order.method='upi';s.order.status='Checking payment';s.order.paymentAttempt='PAY-VISUAL-001';s.order.delivery='Unassigned';}writeState(s);window.dispatchEvent(new StorageEvent('storage',{key:STORAGE_KEY}));},route);await wait();await open(route,route==='customer/payment-result'?'payment-pending':'normal');await page.screenshot({path:path.join(out,route.replaceAll('/','-')+'-'+width+'.png'),fullPage:width>520});}
 }
 assert(errors.length===0,'No JavaScript errors during role, filtering, validation and screenshot review');
}finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors},null,2));await browser.close();}
console.log(JSON.stringify({passed:true,checks:checks.length,screenshots:30,errors},null,2));
