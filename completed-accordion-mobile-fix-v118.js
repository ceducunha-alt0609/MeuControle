/* Meu Controle — V1.18: correção mobile do acordeão de concluídos */
(function(){
 if(window.__mcCompletedAccordionMobileFixV118)return;window.__mcCompletedAccordionMobileFixV118=true;
 const list=document.getElementById('list');if(!list)return;
 const mq=matchMedia('(max-width:700px)');
 function bind(){
  if(!mq.matches)return;
  list.querySelectorAll('.mobile-done-header').forEach(h=>{
   if(h.__mcMobileDoneHardBound)return;h.__mcMobileDoneHardBound=true;
   const items=[];let p=h.nextElementSibling;
   while(p&&!p.classList?.contains('mobile-month-header')&&!p.classList?.contains('mobile-done-header')){if(p.classList?.contains('item')&&p.classList.contains('done'))items.push(p);p=p.nextElementSibling}
   const setOpen=open=>{h.dataset.mcDoneOpen=open?'1':'0';h.setAttribute('aria-expanded',String(open));h.classList.toggle('mc-done-collapsed-v117',!open);items.forEach(it=>{if(open)it.style.removeProperty('display');else it.style.setProperty('display','none','important')})};
   setOpen(false);
   h.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setOpen(h.dataset.mcDoneOpen!=='1')},true);
   h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setOpen(h.dataset.mcDoneOpen!=='1')}},true);
  });
 }
 const schedule=()=>requestAnimationFrame(bind);
 new MutationObserver(schedule).observe(list,{childList:true});
 document.addEventListener('click',e=>{if(e.target.closest('#launchesPage .tabs .tab'))setTimeout(schedule,50)},true);
 window.addEventListener('load',()=>setTimeout(schedule,700));setTimeout(schedule,250);
})();
