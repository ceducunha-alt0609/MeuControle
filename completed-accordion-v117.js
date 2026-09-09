/* Meu Controle — V1.17: acordeão dos concluídos em Lançamentos (desktop + mobile) */
(function(){
 if(window.__mcCompletedAccordionV117)return;window.__mcCompletedAccordionV117=true;
 const list=document.getElementById('list');if(!list)return;
 const state=new Map();let scheduled=false;
 function installStyles(){if(document.getElementById('mcCompletedAccordionV117Style'))return;const s=document.createElement('style');s.id='mcCompletedAccordionV117Style';s.textContent=`
 #launchesPage .desktop-done-heading-v020,#launchesPage .mobile-done-header{cursor:pointer;user-select:none}
 #launchesPage .mc-done-toggle-v117{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;margin-left:7px;border:1px solid rgba(var(--primary-rgb),.16);border-radius:7px;background:rgba(255,255,255,.68);color:var(--primary);font:800 14px/1 system-ui,sans-serif;transition:transform .16s ease}
 #launchesPage .mc-done-collapsed-v117 .mc-done-toggle-v117{transform:rotate(-90deg)}
 #launchesPage .mc-done-hidden-v117{display:none!important}
 `;document.head.appendChild(s)}
 function monthKeyFor(el){let p=el.previousElementSibling;while(p){if(p.classList?.contains('desktop-month-heading-v020')){const t=p.querySelector('strong')?.textContent||'';return 'd:'+t}if(p.classList?.contains('mobile-month-header')){return 'm:'+(p.textContent||'').replace(/\s+/g,' ').trim()}p=p.previousElementSibling}return 'global'}
 function apply(){scheduled=false;const headers=[...list.querySelectorAll('.desktop-done-heading-v020,.mobile-done-header')];headers.forEach(h=>{const key=monthKeyFor(h);if(!state.has(key))state.set(key,false);let items=[],p=h.nextElementSibling;while(p&&!p.classList?.contains('desktop-month-heading-v020')&&!p.classList?.contains('mobile-month-header')&&!p.classList?.contains('desktop-done-heading-v020')&&!p.classList?.contains('mobile-done-header')){if(p.classList?.contains('item'))items.push(p);p=p.nextElementSibling}const open=state.get(key);h.classList.toggle('mc-done-collapsed-v117',!open);h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded',String(open));items.forEach(x=>x.classList.toggle('mc-done-hidden-v117',!open));let toggle=h.querySelector('.mc-done-toggle-v117');if(!toggle){toggle=document.createElement('i');toggle.className='mc-done-toggle-v117';toggle.setAttribute('aria-hidden','true');toggle.textContent='⌄';h.appendChild(toggle)}if(!h.__mcDoneBoundV117){h.__mcDoneBoundV117=true;const flip=e=>{e?.preventDefault();e?.stopPropagation();state.set(key,!state.get(key));schedule()};h.addEventListener('click',flip);h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')flip(e)})}})}
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
 installStyles();new MutationObserver(schedule).observe(list,{childList:true,subtree:false});window.addEventListener('load',()=>setTimeout(schedule,650));document.addEventListener('click',e=>{if(e.target.closest('#launchesPage .tabs .tab'))setTimeout(schedule,50)},true);setTimeout(schedule,220);
 window.MeuControleCompletedAccordionV117={version:'1.17',refresh:schedule};
})();
