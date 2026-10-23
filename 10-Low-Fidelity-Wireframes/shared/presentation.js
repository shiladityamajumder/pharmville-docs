// Layout-only composition. Business decisions remain in the existing screen handlers.
export function composeScreen(root,screen,state){
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

export function validateFields(form){
 form.querySelectorAll('.field-error').forEach(error=>error.remove());form.querySelectorAll('[aria-invalid]').forEach(input=>{input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');});
 const invalid=[...form.elements].filter(input=>input.willValidate&&!input.validity.valid);
 for(const [index,input]of invalid.entries()){
  const message=document.createElement('p');message.className='field-error';message.id=`validation-${index}`;message.textContent=input.validity.valueMissing?'Complete this field to continue.':input.validity.typeMismatch?'Enter a valid value for this field.':input.validationMessage;
  input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',message.id);input.after(message);
 }
 if(invalid.length){invalid[0].focus();return false;}return true;
}
