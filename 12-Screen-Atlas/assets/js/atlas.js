/* Pharmville Screen Atlas: static, dependency-free canvas. All metadata is extracted from the real prototype. */
(() => {
  'use strict';
  const data=window.PV_ATLAS_DATA;
  if (!data || !Array.isArray(data.screens)) {document.body.textContent='Screen Atlas data is missing. Keep the assets folder beside index.html.';return;}
  const all=data.screens,flows=data.journeys;
  const $=(sel,ctx=document)=>ctx.querySelector(sel);
  const safe=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label=(s)=>String(s).replaceAll('_',' ').replace(/\bCms\b/gi,'CMS').replace(/\bApi\b/gi,'API').replace('Authentication Access','Authentication & Access').replace('Customer Accounts','Customer Accounts').replace('Rider App','Rider App');
  const colors={Authentication_Access:'#4483a9',Customer_Accounts:'#3a8e74',Product_Catalog:'#59a790',Cart_Checkout:'#468a6a',Prescription_Upload:'#bc8b5a',Pharmacist_Review:'#bf8664',Customer_Orders:'#427e99',Order_Operations:'#547f9c',Store_Operations:'#8e9a54',Inventory:'#88944e',Warehouse:'#8a74ac',Delivery_Operations:'#66959a',Rider_App:'#779c95',Finance_Payments:'#b08562',Notifications:'#9d7ca0',Admin_CMS:'#657ca6',Reporting:'#7b92a1',Audit:'#898e92'};
  const layoutOrder=['Authentication_Access','Customer_Accounts','Product_Catalog','Cart_Checkout','Prescription_Upload','Pharmacist_Review','Customer_Orders','Order_Operations','Store_Operations','Inventory','Warehouse','Delivery_Operations','Rider_App','Finance_Payments','Notifications','Admin_CMS','Reporting','Audit'];
  const byRoute=new Map(all.map(s=>[s.route,s]));
  const modules=[...new Set(all.map(s=>s.module))].sort((a,b)=>layoutOrder.indexOf(a)-layoutOrder.indexOf(b));
  const $world=$('#world'),$viewport=$('#viewport'),$side=$('#side-navigation'),$detail=$('#inspector-content'),$minimap=$('#minimap-canvas');
  const view={mode:'modules',zoom:.73,x:34,y:42,selected:null,search:'',groups:[],worldW:0,worldH:0,spaceDown:false,drag:null};
  const CARD_W=280,CARD_H=274,GROUP_W=919,GROUP_GAP=40;
  const device=(s)=>s.platform==='staff'?'DESKTOP':'MOBILE';
  const routeFor=(s)=>`prototype/index.html#/${s.platform==='staff'?'website':'mobile'}/${s.route}`;
  const match=(s,q)=>!q||[s.title,s.id,s.route,s.module,s.workspace,s.description,...s.features].join(' ').toLowerCase().includes(q);
  const modulesFor=(name)=>all.filter(s=>s.module===name);
  const flowFor=(id)=>flows.find(f=>f.id===id);

  function createCard(s,step=0,role=''){
    const isPhone=s.platform!=='staff';
    return `<article class="screen-card ${step?'flow-card':''}" tabindex="0" role="button" aria-label="Select ${safe(s.title)}" data-route="${safe(s.route)}" title="${safe(s.description)}">
      <div class="screen-preview ${isPhone?'phone':'desktop'}"><img loading="lazy" src="${safe(s.preview)}" alt="Actual wireframe preview of ${safe(s.title)}" draggable="false"><span class="device-chip">${device(s)}</span></div>
      <div class="card-meta"><div class="card-text"><div class="card-name">${safe(s.title)}</div><div class="card-code">${safe(s.id)} · ${safe(s.workspace.replaceAll('-',' '))}</div></div><button class="open-screen" title="Open interactive ${safe(s.title)}" data-open="${safe(s.route)}" aria-label="Open interactive ${safe(s.title)}">↗</button></div>
    </article>`;
  }

  function moduleMarkup(name,index,items){
    const color=colors[name]||'#53917b';
    return `<section class="group" id="group-${safe(name)}" data-group="${safe(name)}" style="--accent:${color}">
      <div class="group-head"><div><div class="group-accent"></div><div class="group-index">MODULE ${String(index+1).padStart(2,'0')}</div><h2 class="group-title">${safe(label(name))}</h2><div class="group-desc">${safe([...new Set(items.map(s=>s.workspace))].map(w=>w.replaceAll('-',' ')).join(' · '))} · Actual documented screens</div></div><span class="group-count">${items.length} screens</span></div>
      <div class="screens-grid">${items.map(s=>createCard(s)).join('')}</div>
    </section>`;
  }
  function journeyMarkup(f,index){
    const unique=[...new Set(f.steps.map(s=>s.route))],missing=f.steps.filter(step=>!byRoute.has(step.route));
    return `<section class="flow-group" data-group="${safe(f.id)}" style="--accent:${['#4a916c','#7796b0','#ac855e','#8c7f9f'][index%4]}">
      <div class="group-head"><div><div class="group-accent"></div><div class="group-index">JOURNEY ${String(index+1).padStart(2,'0')}</div><h2 class="group-title">${safe(f.title)}</h2><div class="group-desc">${safe(f.goal)}${missing.length?` · ${missing.length} missing screen references`:''}</div></div><span class="group-count">${f.steps.length} steps · ${unique.length} unique screens</span></div>
      <div class="flow-line">${f.steps.map((step,i)=>{
        const s=byRoute.get(step.route);
        return `<div class="flow-item"><div class="flow-step">STEP ${String(i+1).padStart(2,'0')} · ${safe(step.title)}</div>${s?createCard(s,i+1,step.role):`<div class="screen-card flow-card missing">Missing route: ${safe(step.route)}</div>`}<div class="flow-role">${safe(step.role||s?.workspace||'')} ${i<f.steps.length-1?'→':''}</div>${i<f.steps.length-1?'<span class="flow-arrow" aria-hidden="true">→</span>':''}</div>`;
      }).join('')}</div>
    </section>`;
  }
  function build(){
    const groups=[];
    $world.innerHTML='';
    if(view.mode==='modules'){
      let y=70,idx=0;
      for(let r=0;r<Math.ceil(modules.length/3);r++){
        let rowMax=0;
        for(let c=0;c<3;c++){
          if(idx>=modules.length)break;
          const name=modules[idx],items=modulesFor(name),rows=Math.ceil(items.length/3);
          const height=164+rows*CARD_H+Math.max(rows-1,0)*16;
          const x=54+c*(GROUP_W+GROUP_GAP);
          const e=document.createElement('div'); e.innerHTML=moduleMarkup(name,idx,items);
          const node=e.firstElementChild; node.style.cssText+=`;left:${x}px;top:${y}px;width:${GROUP_W}px;height:${height}px`;
          $world.appendChild(node);groups.push({id:name,x,y,w:GROUP_W,h:height,count:items.length,title:label(name),color:colors[name]||'#59947b'});
          rowMax=Math.max(rowMax,height);idx++;
        }
        y+=rowMax+GROUP_GAP+10;
      }
      view.worldW=54+3*(GROUP_W+GROUP_GAP);
      view.worldH=y+10;
    } else {
      let y=70,maximum=0;
      flows.forEach((f,i)=>{
        const w=Math.max(940,50+f.steps.length*258+24); const h=459;
        const e=document.createElement('div');e.innerHTML=journeyMarkup(f,i);
        const node=e.firstElementChild;node.style.cssText+=`;left:54px;top:${y}px;width:${w}px;height:${h}px`;
        $world.appendChild(node);
        groups.push({id:f.id,x:54,y,w,h,count:f.steps.length,title:f.title,color:['#4a916c','#7796b0','#ac855e','#8c7f9f'][i%4]});
        maximum=Math.max(maximum,w);y+=h+36;
      });
      view.worldW=maximum+120;view.worldH=y+40;
    }
    view.groups=groups;
    refreshSearch();
    if(view.selected){const selected=document.querySelector(`.screen-card[data-route="${CSS.escape(view.selected)}"]`);if(selected)selected.classList.add('selected');}
    refreshSide();refreshDetail();refreshTransform();
    $('#navigation-label').textContent=view.mode==='modules'?'MODULE GROUPS':'GUIDED JOURNEYS';
    $('#navigation-count').textContent=groups.length;
    $('#current-mode-title').textContent=view.mode==='modules'?'Module overview':'Connected journey map';
    $('#current-mode-subtitle').textContent=view.mode==='modules'?`${all.length} real screen previews · ${modules.length} modules`:`${flows.length} business journeys · connected steps`;
    $('#canvas-context').textContent=view.mode==='modules'?'MODULE MAP · SOURCE-ALIGNED GROUPS':'WORKFLOW MAP · ACTUAL DOCUMENTED STEPS';
  }
  function refreshSide(){
    $side.innerHTML=view.groups.map(g=>`<button class="nav-item" data-focus="${safe(g.id)}" title="Go to ${safe(g.title)}" style="--swatch:${g.color}"><i class="nav-swatch" aria-hidden="true"></i><span class="nav-name">${safe(g.title)}</span><span class="nav-count">${g.count}</span></button>`).join('');
  }
  function refreshDetail(){
    const s=byRoute.get(view.selected);
    if(!s){$detail.innerHTML=`<div class="inspector-heading">PROPERTIES</div><div class="inspector-empty"><div class="empty-icon">▱</div><h2>Select a screen</h2><p>Click any preview to inspect its original ID, module, features and supported scenarios.</p><p>Double-click the screen to open its working prototype.</p></div><div class="disclaimer">This atlas displays snapshots from the existing Pharmville wireframe application—not newly invented designs. All data is fictional.</div>`;return;}
    $detail.innerHTML=`<div class="inspector-heading">SCREEN PROPERTIES</div><div class="detail-image"><img src="${safe(s.preview)}" alt="Preview of ${safe(s.title)}"></div><div class="detail-label">${safe(s.id)} · ${device(s)}</div><h2 class="detail-name">${safe(s.title)}</h2><div class="detail-description">${safe(s.description)}</div><dl class="detail-facts"><dt>MODULE</dt><dd>${safe(label(s.module))}</dd><dt>WORKSPACE / ROLE CONTEXT</dt><dd>${safe(label(s.workspace))} · ${safe(s.platform)}</dd><dt>ROUTE</dt><dd><code>${safe(s.route)}</code></dd><dt>RELATED FEATURE IDS</dt><dd class="chips">${s.features.map(x=>`<span class="chip">${safe(x)}</span>`).join('')||'<span class="chip neutral">Not specified</span>'}</dd><dt>AVAILABLE DEMO STATES (${s.scenarios.length})</dt><dd class="chips">${s.scenarios.map(x=>`<span class="chip neutral">${safe(x)}</span>`).join('')}</dd></dl><button id="inspect-open" class="detail-btn">↗ Open interactive screen</button><a class="detail-secondary" href="${safe(routeFor(s))}" target="_blank" rel="noopener">Open full screen in new tab</a><div class="disclaimer">Prototype access controls and business actions use synthetic browser-only data. Some pages require first completing a journey.</div>`;
    $('#inspect-open').addEventListener('click',()=>openLive(s));
  }
  function setSelected(route){
    view.selected=route;
    $world.querySelectorAll('.screen-card.selected').forEach(c=>c.classList.remove('selected'));
    $world.querySelectorAll('.screen-card').forEach(c=>{if(c.dataset.route===route)c.classList.add('selected');});
    refreshDetail(); if(window.innerWidth<=1050)$('#inspector').classList.add('open');
  }
  function worldClick(e){
    const open=e.target.closest('[data-open]');if(open){e.stopPropagation();openLive(byRoute.get(open.dataset.open));return;}
    const card=e.target.closest('.screen-card[data-route]');if(card){setSelected(card.dataset.route);return;}
    if(window.innerWidth<=1050)$('#inspector').classList.remove('open');
  }
  function worldDoubleClick(e){
    const card=e.target.closest('.screen-card[data-route]');if(card){e.preventDefault();openLive(byRoute.get(card.dataset.route));}
  }
  function worldKeydown(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches('.screen-card[data-route]')){e.preventDefault();setSelected(e.target.dataset.route);}}
  function openLive(s){
    if(!s)return;
    $('#dialog-screen-name').textContent=s.title;$('#dialog-screen-code').textContent=s.id;
    const path=routeFor(s);
    $('#dialog-newtab').href=path;
    $('#live-frame').src=path;
    const dialog=$('#interactive-dialog');if(!dialog.open)dialog.showModal();
  }
  function closeLive(){const dialog=$('#interactive-dialog');if(dialog.open)dialog.close();$('#live-frame').removeAttribute('src');}
  function transformAt(z,anchorX,anchorY){
    const old=view.zoom;const next=Math.max(.085,Math.min(1.55,z));
    view.x=anchorX-(anchorX-view.x)*next/old;view.y=anchorY-(anchorY-view.y)*next/old;view.zoom=next;refreshTransform();
  }
  function refreshTransform(){
    $world.style.transform=`translate(${view.x}px,${view.y}px) scale(${view.zoom})`;
    $('#zoom-label').textContent=`${Math.round(view.zoom*100)}%`;drawMinimap();
  }
  function goHome(){
    const ww=$viewport.clientWidth;
    view.zoom=Math.max(.36,Math.min(.82,(ww-70)/980));view.x=25;view.y=35;refreshTransform();
    refreshActiveNav();
  }
  function fitAll(){const w=$viewport.clientWidth,h=$viewport.clientHeight;const k=Math.max(.085,Math.min(1.2,(w-70)/view.worldW,(h-85)/view.worldH));view.zoom=k;view.x=(w-view.worldW*k)/2;view.y=(h-view.worldH*k)/2;refreshTransform();}
  function focusGroup(id){const g=view.groups.find(g=>g.id===id);if(!g)return;
    const w=$viewport.clientWidth,h=$viewport.clientHeight;
    const wanted=view.mode==='journeys'?Math.max(.32,Math.min(.66,(w-90)/1100)):Math.max(.4,Math.min(.78,(w-80)/(GROUP_W+50)));
    view.zoom=wanted;view.x=(w-Math.min(g.w,w/wanted)*wanted)/2-g.x*wanted;view.y=50-g.y*wanted;
    refreshTransform();refreshActiveNav(id);
  }
  function refreshActiveNav(id){
    if(!id){const midX=($viewport.clientWidth*.5-view.x)/view.zoom, midY=($viewport.clientHeight*.37-view.y)/view.zoom;let nearest=Infinity;for(const g of view.groups){const d=Math.abs(g.x+Math.min(g.w,1000)*.5-midX)+Math.abs(g.y+80-midY);if(d<nearest){id=g.id;nearest=d;}}}
    $side.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.focus===id));
  }
  function refreshSearch(){
    const q=view.search.trim().toLowerCase();let total=0;
    $world.querySelectorAll('.screen-card[data-route]').forEach(node=>{const s=byRoute.get(node.dataset.route);const ok=match(s,q);node.classList.toggle('dim',!ok);if(ok)total++;});
    $('#visible-status').textContent=q?`${total} matching cards`:`${all.length} original screens`;
  }
  function searchChange(e){view.search=e.target.value;refreshSearch();}
  function drawMinimap(){
    const ctx=$minimap.getContext('2d');if(!ctx)return;
    const W=$minimap.width,H=$minimap.height;ctx.clearRect(0,0,W,H);
    const k=Math.min((W-12)/view.worldW,(H-12)/view.worldH),offX=(W-view.worldW*k)/2,offY=(H-view.worldH*k)/2;
    for(const g of view.groups){ctx.fillStyle=g.color+'70';ctx.fillRect(offX+g.x*k,offY+g.y*k,Math.max(2,g.w*k),Math.max(2,g.h*k));}
    const r={x:-view.x/view.zoom,y:-view.y/view.zoom,w:$viewport.clientWidth/view.zoom,h:$viewport.clientHeight/view.zoom};ctx.strokeStyle='#246c4c';ctx.lineWidth=1.7;ctx.strokeRect(offX+r.x*k,offY+r.y*k,r.w*k,r.h*k);
    $minimap.dataset.scale=k;$minimap.dataset.ox=offX;$minimap.dataset.oy=offY;
  }
  function minimapClick(e){const bounds=$minimap.getBoundingClientRect(),k=Number($minimap.dataset.scale),ox=Number($minimap.dataset.ox),oy=Number($minimap.dataset.oy);if(!k)return;
    const wx=(e.clientX-bounds.left-ox)/k,wy=(e.clientY-bounds.top-oy)/k;view.x=$viewport.clientWidth/2-wx*view.zoom;view.y=$viewport.clientHeight/2-wy*view.zoom;refreshTransform();refreshActiveNav();
  }
  function initEvents(){
    $world.addEventListener('click',worldClick);
    $world.addEventListener('dblclick',worldDoubleClick);
    $world.addEventListener('keydown',worldKeydown);
    document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{
      const mode=b.dataset.mode;if(mode===view.mode)return;view.mode=mode;
      document.querySelectorAll('[data-mode]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-selected',String(active));});
      build();goHome();
    }));
    $side.addEventListener('click',e=>{const el=e.target.closest('[data-focus]');if(el)focusGroup(el.dataset.focus);});
    $('#search').addEventListener('input',searchChange);
    $('#search').addEventListener('keydown',e=>{if(e.key==='Enter'){const first=all.find(s=>match(s,view.search.toLowerCase()));if(first){const group=view.mode==='modules'?first.module:flows.find(f=>f.steps.some(x=>x.route===first.route))?.id;if(group)focusGroup(group);setSelected(first.route);}}});
    $('#zoom-in').addEventListener('click',()=>transformAt(view.zoom*1.2,$viewport.clientWidth/2,$viewport.clientHeight/2));
    $('#zoom-out').addEventListener('click',()=>transformAt(view.zoom/1.2,$viewport.clientWidth/2,$viewport.clientHeight/2));
    $('#fit-board').addEventListener('click',fitAll);$('#zoom-label').addEventListener('click',()=>transformAt(1,$viewport.clientWidth/2,$viewport.clientHeight/2));
    $('#home-board').addEventListener('click',goHome);
    $('#open-full-prototype').addEventListener('click',()=>window.open('prototype/index.html','_blank','noopener'));
    $('#dialog-close').addEventListener('click',closeLive);
    $('#interactive-dialog').addEventListener('click',e=>{if(e.target===$('#interactive-dialog'))closeLive();});
    $('#interactive-dialog').addEventListener('close',()=>$('#live-frame').removeAttribute('src'));
    $viewport.addEventListener('pointerdown',e=>{if(e.button!==0&&e.button!==1)return;
      if(e.button===0&&!view.spaceDown&&e.target.closest('.screen-card'))return;
      view.drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:view.x,y:view.y};$viewport.setPointerCapture(e.pointerId);$viewport.classList.add('dragging');
    });
    $viewport.addEventListener('pointermove',e=>{if(!view.drag||view.drag.id!==e.pointerId)return;view.x=view.drag.x+(e.clientX-view.drag.startX);view.y=view.drag.y+(e.clientY-view.drag.startY);refreshTransform();});
    const endDrag=()=>{if(!view.drag)return;view.drag=null;$viewport.classList.remove('dragging');refreshActiveNav();};
    $viewport.addEventListener('pointerup',endDrag);$viewport.addEventListener('pointercancel',endDrag);$viewport.addEventListener('lostpointercapture',endDrag);
    $viewport.addEventListener('wheel',e=>{e.preventDefault();const box=$viewport.getBoundingClientRect();
      if(e.ctrlKey||e.metaKey){transformAt(view.zoom*(e.deltaY<0?1.11:.9),e.clientX-box.left,e.clientY-box.top);}
      else{view.x-=e.deltaX;view.y-=e.deltaY;refreshTransform();}
    },{passive:false});
    window.addEventListener('keydown',e=>{
      if(e.target?.matches('input,textarea'))return;
      if(e.key==='/'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();$('#search').focus();}
      else if(e.key===' '){view.spaceDown=true;if(e.target===document.body||e.target===$viewport)e.preventDefault();}
      else if(e.key==='0'){fitAll();}
      else if(e.key==='+'||e.key==='='){transformAt(view.zoom*1.18,$viewport.clientWidth/2,$viewport.clientHeight/2);}
      else if(e.key==='-'){transformAt(view.zoom/1.18,$viewport.clientWidth/2,$viewport.clientHeight/2);}
      else if(e.key==='Escape'){$('#inspector').classList.remove('open');}
    });
    window.addEventListener('keyup',e=>{if(e.key===' ')view.spaceDown=false;});
    window.addEventListener('resize',refreshTransform);
    $minimap.addEventListener('click',minimapClick);
  }
  build();initEvents();goHome();
  window.PV_SCREEN_ATLAS={get screens(){return all;},get journeys(){return flows;},get mode(){return view.mode;},select:setSelected,open(route){openLive(byRoute.get(route));},fit:fitAll};
})();
