/* MeuControle — ponte calendário mobile V1.11 -> V1.12 */
(()=>{
  if(window.__meuControleMobileCalendarGridV110Loaded)return;
  if(document.querySelector('script[data-mc-calendar-v110]'))return;
  const s=document.createElement('script');
  s.src='./mobile-calendar-grid-v110.js?v=110';
  s.dataset.mcCalendarV110='1';
  document.head.appendChild(s);
})();