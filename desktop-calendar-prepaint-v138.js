/* MeuControle — V1.38: evita flash dos cards antigos no Calendário desktop */
(()=>{
  if(window.__mcDesktopCalendarPrepaintV138)return;window.__mcDesktopCalendarPrepaintV138=true;
  if(!matchMedia('(min-width:701px)').matches)return;

  const style=document.createElement('style');
  style.id='mcDesktopCalendarPrepaintV138Style';
  style.textContent=`
    @media(min-width:701px){
      html.mc-calendar-prepaint #calendarPage .calendar-layout{
        visibility:hidden!important;
      }
    }
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add('mc-calendar-prepaint');

  const reveal=()=>document.documentElement.classList.remove('mc-calendar-prepaint');
  const ready=()=>!!document.querySelector('#calendarPage .mc-cal-board-v124');
  if(ready()){reveal();return}

  const root=document.getElementById('calendarPage')||document.body;
  const observer=new MutationObserver(()=>{
    if(ready()){
      observer.disconnect();
      requestAnimationFrame(()=>requestAnimationFrame(reveal));
    }
  });
  observer.observe(root,{childList:true,subtree:true});

  /* Fallback de segurança: nunca deixa a área invisível indefinidamente. */
  setTimeout(()=>{observer.disconnect();reveal()},1400);
})();
