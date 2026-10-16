/* MeuControle — ponte calendário mobile V1.15: calendário + pesquisa dedicada */
(()=>{
  if(!window.__meuControleMobileCalendarGridV110Loaded&&!document.querySelector('script[data-mc-calendar-v110]')){
    const s=document.createElement('script');
    s.src='./mobile-calendar-grid-v110.js?v=114';
    s.dataset.mcCalendarV110='1';
    document.head.appendChild(s);
  }
  if(!window.__mcAgendaSearchV122&&!document.querySelector('script[data-mc-agenda-search-v122]')){
    const q=document.createElement('script');
    q.src='./mobile-agenda-search-v122.js?v=122';
    q.dataset.mcAgendaSearchV122='1';
    document.head.appendChild(q);
  }
})();