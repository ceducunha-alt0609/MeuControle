/* MeuControle — V1.39: prepaint + estabilização anti-flicker do Calendário desktop */
(()=>{
  if(window.__mcDesktopCalendarPrepaintV138)return;window.__mcDesktopCalendarPrepaintV138=true;
  if(!matchMedia('(min-width:701px)').matches)return;

  const style=document.createElement('style');
  style.id='mcDesktopCalendarPrepaintV138Style';
  style.textContent=`
    @media(min-width:701px){
      html.mc-calendar-prepaint #calendarPage .calendar-layout,
      html.mc-desktop-calendar-boot #calendarPage .calendar-layout{
        visibility:hidden!important;
      }
    }
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add('mc-calendar-prepaint');

  const reveal=()=>{
    document.documentElement.classList.remove('mc-calendar-prepaint');
    document.documentElement.classList.remove('mc-desktop-calendar-boot');
  };
  const ready=()=>!!document.querySelector('#calendarPage .mc-cal-board-v124');

  /*
   * Alguns módulos legados do calendário ainda fazem renderizações tardias.
   * O V124 é o layout final. Se um render antigo substituir os cards depois
   * de a tela já estar pronta, restauramos o V124 no mesmo ciclo de mutação,
   * antes de o navegador ter oportunidade de pintar o estado intermediário.
   */
  let stabilizing=false;
  const finalListReady=()=>{
    const list=document.getElementById('calendarEventsList');
    if(!list)return false;
    if(!list.children.length)return true;
    return !!list.querySelector('.mc-cal-pending-title-v124,.mc-cal-no-pending-v124,.mc-cal-done-heading-v124');
  };
  const stabilize=()=>{
    if(stabilizing||!window.MeuControleDesktopCalendarSplitV124?.refresh)return;
    if(finalListReady())return;
    stabilizing=true;
    try{window.MeuControleDesktopCalendarSplitV124.refresh()}catch{}
    queueMicrotask(()=>{stabilizing=false});
  };

  const list=document.getElementById('calendarEventsList');
  if(list){
    new MutationObserver(()=>stabilize()).observe(list,{childList:true,subtree:false});
  }

  if(ready()){
    requestAnimationFrame(()=>requestAnimationFrame(reveal));
  }else{
    const root=document.getElementById('calendarPage')||document.body;
    const observer=new MutationObserver(()=>{
      if(ready()){
        observer.disconnect();
        requestAnimationFrame(()=>requestAnimationFrame(reveal));
      }
    });
    observer.observe(root,{childList:true,subtree:true});
    /* Fallback de segurança: nunca deixa a área invisível indefinidamente. */
    setTimeout(()=>{observer.disconnect();reveal()},1600);
  }

  /* Reforço após load: apenas estabiliza se algum legado tiver repintado a lista. */
  window.addEventListener('load',()=>{
    queueMicrotask(stabilize);
    setTimeout(stabilize,150);
    setTimeout(stabilize,700);
  });
})();
