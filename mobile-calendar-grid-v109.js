/* MeuControle — ponte calendário mobile V1.11 -> V1.12, lista inferior sem tremida */
(()=>{
  if(window.__meuControleMobileCalendarGridV110Loaded)return;
  if(document.querySelector('script[data-mc-calendar-v110]'))return;
  const mobile=matchMedia('(max-width:700px)').matches;
  let style=null;
  if(mobile){
    document.documentElement.classList.add('mc-agenda-list-boot');
    style=document.createElement('style');
    style.id='mcAgendaListBootV111';
    style.textContent='@media(max-width:700px){html.mc-agenda-list-boot #calendarPage .calendar-events-panel{visibility:hidden!important}}';
    document.head.appendChild(style);
  }
  const reveal=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.documentElement.classList.remove('mc-agenda-list-boot');
    style?.remove();
  }));
  const s=document.createElement('script');
  s.src='./mobile-calendar-grid-v110.js?v=110b';
  s.dataset.mcCalendarV110='1';
  s.onload=reveal;
  s.onerror=reveal;
  document.head.appendChild(s);
})();