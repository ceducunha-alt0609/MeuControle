/* Meu Controle — V1.19: acordeão mobile de concluídos, isolado e estável */
(function(){
 if(window.__mcCompletedAccordionMobileFixV118)return;window.__mcCompletedAccordionMobileFixV118=true;
 const list=document.getElementById('list');if(!list)return;
 const mq=matchMedia('(max-width:700px)');
 const state=new Map();
 function keyFor(h){let p=h.previousElementSibling;while(p){if(p.classList?.contains('mobile-month-header'))return (p.textContent||'').replace(/\s+/g,' ').trim();p=p.previousElementSibling}return 'global'}
 function itemsAfter(h){const out=[];let p=h.nextElementSibling;while(p&&!p.classList?.contains('mobile-month-header')&&!p.classList?.contains('mobile-done-header')){if(p.classList?.contains('item')&&p.classList.contains('done'))out.push(p);p=p.nextElementSibling}return out}
 function paint(h,open){h.dataset.mcDoneOpen=open?'1':'0';h.setAttribute('aria-expanded',String(open));h.classList.toggle('mc-done-collapsed-v117',!open);itemsAfter(h).forEach(it=>{if(open){it.classList.remove('mc-done-hidden-v117');it.style.removeProperty('display')}else{it.classList.add('mc-done-hidden-v117');it.style.setProperty('display','none','important')}})}
 function bind(){
  if(!mq.matches)return;
  list.querySelectorAll('.mobile-done-header').forEach(h=>{
   const key=keyFor(h);if(!state.has(key))state.set(key,false);paint(h,state.get(key));
   if(h.__mcMobileDoneHardBound)return;h.__mcMobileDoneHardBound=true;
   const flip=e=>{e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const k=keyFor(h);const next=!state.get(k);state.set(k,next);paint(h,next)};
   h.addEventListener('click',flip,true);
   h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')flip(e)},true);
  });
 }
 let raf=0;const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(bind)};
 new MutationObserver(schedule).observe(list,{childList:true});
 document.addEventListener('click',e=>{if(e.target.closest('#launchesPage .tabs .tab'))setTimeout(schedule,60)},true);
 mq.addEventListener?.('change',schedule);window.addEventListener('load',()=>setTimeout(schedule,700));setTimeout(schedule,250);
 window.MeuControleCompletedAccordionMobileFixV118={version:'1.19',refresh:schedule};
})();
