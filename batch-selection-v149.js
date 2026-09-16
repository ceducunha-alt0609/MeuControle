/* MeuControle — V1.49: seleção e exclusão em lote na consulta */
(()=>{
 if(window.__mcBatchSelectionV149)return;window.__mcBatchSelectionV149=true;
 const page=document.getElementById('launchesPage'),list=document.getElementById('list');if(!page||!list)return;
 const selected=new Set();let mode=false,longTimer=null,longTarget=null;
 const st=document.createElement('style');st.textContent=`
 .mc-batch-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 10px;padding:9px 10px;border:1px solid #dfe6e1;border-radius:11px;background:#f7faf8}
 .mc-batch-bar button{min-height:36px;padding:7px 10px;font-size:12px}.mc-batch-count{margin-right:auto;font-size:12px;font-weight:800;color:#526159}.mc-batch-delete{background:#b53d3d!important;color:#fff!important;border-color:#b53d3d!important}.mc-batch-delete:disabled{opacity:.45}
 #launchesPage.mc-batch-mode #list .item{position:relative;padding-left:48px!important;cursor:pointer!important;user-select:none;-webkit-user-select:none}
 .mc-batch-check{display:none;position:absolute;left:14px;top:50%;transform:translateY(-50%);width:24px;height:24px;border:2px solid #aebbb4;border-radius:7px;background:#fff;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:15px;font-weight:900;color:#fff;z-index:3}
 #launchesPage.mc-batch-mode .mc-batch-check{display:flex}.item.mc-batch-selected{outline:2px solid var(--primary)!important;outline-offset:-2px!important;background:rgba(var(--primary-rgb),.065)!important}.item.mc-batch-selected .mc-batch-check{background:var(--primary);border-color:var(--primary)}.item.mc-batch-selected .mc-batch-check::after{content:'✓'}
 #launchesPage.mc-batch-mode .item-actions{pointer-events:none;opacity:.35}
 .mc-batch-start{margin-left:auto!important}
 body.mc-dark .mc-batch-bar{background:#1b272e;border-color:#40505a}.mc-dark .mc-batch-count{color:#dce6eb}.mc-dark .mc-batch-check{background:#1b272e;border-color:#70818a}.mc-dark .item.mc-batch-selected{background:rgba(76,151,194,.12)!important}
 @media(max-width:700px){.mc-batch-bar{position:sticky;top:76px;z-index:30;margin-bottom:9px}.mc-batch-start{display:none!important}#launchesPage.mc-batch-mode #list .item{padding-left:43px!important}}
 `;document.head.appendChild(st);
 const tabs=page.querySelector('.tabs');
 const start=document.createElement('button');start.type='button';start.className='tab mc-batch-start';start.textContent='Selecionar';tabs?.appendChild(start);
 const bar=document.createElement('div');bar.className='mc-batch-bar';bar.hidden=true;bar.innerHTML='<strong class="mc-batch-count">0 selecionados</strong><button type="button" class="ghost mc-batch-all">Selecionar todos os resultados</button><button type="button" class="ghost mc-batch-cancel">Cancelar</button><button type="button" class="danger mc-batch-delete" disabled>Excluir</button>';
 tabs?.after(bar);
 const count=bar.querySelector('.mc-batch-count'),del=bar.querySelector('.mc-batch-delete');
 function cards(){return [...list.querySelectorAll('.item')]}
 function ensureChecks(){cards().forEach(card=>{if(!card.querySelector('.mc-batch-check')){const c=document.createElement('span');c.className='mc-batch-check';card.prepend(c)}})}
 function sync(){ensureChecks();cards().forEach(c=>c.classList.toggle('mc-batch-selected',selected.has(c)));const n=selected.size;count.textContent=`${n} selecionado${n===1?'':'s'}`;del.disabled=!n;del.textContent=n?`Excluir ${n}`:'Excluir'}
 function enter(seed){mode=true;page.classList.add('mc-batch-mode');bar.hidden=false;selected.clear();ensureChecks();if(seed)selected.add(seed);sync()}
 function exit(){mode=false;selected.clear();page.classList.remove('mc-batch-mode');bar.hidden=true;cards().forEach(c=>c.classList.remove('mc-batch-selected'));sync()}
 function toggle(card){if(!mode)enter(card);else{selected.has(card)?selected.delete(card):selected.add(card);sync()}}
 start.onclick=()=>enter();bar.querySelector('.mc-batch-cancel').onclick=exit;
 bar.querySelector('.mc-batch-all').onclick=()=>{if(!mode)enter();cards().forEach(c=>selected.add(c));sync()};
 del.onclick=()=>{const chosen=[...selected];if(!chosen.length)return;const n=chosen.length;if(!confirm(`Excluir ${n} lançamento${n===1?'':'s'} selecionado${n===1?'':'s'}?\n\nEsta ação não pode ser desfeita, mas o MeuControle mantém backups automáticos.`))return;const buttons=chosen.map(c=>c.querySelector('.deleteBtn')).filter(Boolean);const original=window.confirm;try{window.confirm=()=>true;buttons.forEach(b=>b.click())}finally{window.confirm=original}exit()};
 list.addEventListener('click',e=>{if(!mode)return;const card=e.target.closest('.item');if(!card)return;e.preventDefault();e.stopPropagation();toggle(card)},true);
 list.addEventListener('pointerdown',e=>{if(mode||e.pointerType==='mouse')return;const card=e.target.closest('.item');if(!card)return;longTarget=card;longTimer=setTimeout(()=>{longTimer=null;enter(longTarget);navigator.vibrate?.(25)},560)},{passive:true});
 const cancelLong=()=>{if(longTimer){clearTimeout(longTimer);longTimer=null}longTarget=null};list.addEventListener('pointerup',cancelLong,{passive:true});list.addEventListener('pointercancel',cancelLong,{passive:true});list.addEventListener('pointermove',e=>{if(longTimer&&longTarget){const r=longTarget.getBoundingClientRect();if(e.clientX<r.left-12||e.clientX>r.right+12||e.clientY<r.top-12||e.clientY>r.bottom+12)cancelLong()}},{passive:true});
 new MutationObserver(()=>{if(mode){selected.clear();sync()}}).observe(list,{childList:true});
 window.MeuControleBatchSelection={version:'1.49',enter,exit};
})();