/* MeuControle — V1.16: correção cirúrgica do check duplicado no Calendário desktop */
(()=>{
  if(window.__mcDesktopCalendarDoneFixV116)return;window.__mcDesktopCalendarDoneFixV116=true;
  const st=document.createElement('style');st.id='mcDesktopCalendarDoneFixV116Style';st.textContent=`
    @media(min-width:701px){
      #calendarPage .item.done .status-dot{display:none!important;visibility:hidden!important}
      #calendarPage .item.done{grid-template-columns:minmax(0,1fr)!important}
      #calendarPage .item.done .item-main{grid-column:1!important;width:100%!important}
    }
  `;document.head.appendChild(st);
})();
