/* MeuControle — V1.32: acabamento dark dos dois paineis do Calendario desktop */
(function(){
 if(window.__mcDarkCalendarV132)return;window.__mcDarkCalendarV132=true;
 const st=document.createElement('style');st.id='mcDarkCalendarV132Style';st.textContent=`
 @media(min-width:701px){
  body.mc-dark #calendarPage .mc-cal-board-v124{background:#182229!important;border-color:#2d3b44!important;box-shadow:0 5px 18px rgba(0,0,0,.14)!important}
  body.mc-dark #calendarPage .mc-cal-nav-v124{background:linear-gradient(180deg,#1b262d,#182229)!important;border-bottom-color:#314049!important}
  body.mc-dark #calendarPage .mc-cal-nav-v124 strong{color:#eef3f6!important}
  body.mc-dark #calendarPage .mc-cal-year-v124{color:#aebbc3!important}
  body.mc-dark #calendarPage .mc-cal-nav-v124 button{background:#26343c!important;color:#d8e8f1!important}
  body.mc-dark #calendarPage .mc-cal-nav-v124 button:hover{background:#2d3d46!important}
  body.mc-dark #calendarPage .mc-cal-week-v124{background:#202b32!important;border-bottom-color:#314049!important}
  body.mc-dark #calendarPage .mc-cal-week-v124 span{color:#b8c4ca!important;border-right-color:#314049!important}
  body.mc-dark #calendarPage .mc-cal-day-v124{background:#182229!important;color:#e7edf1!important;border-right-color:#2d3b44!important;border-bottom-color:#2d3b44!important}
  body.mc-dark #calendarPage .mc-cal-day-v124:hover{background:#202c33!important}
  body.mc-dark #calendarPage .mc-cal-day-v124.out{background:#151e24!important}
  body.mc-dark #calendarPage .mc-cal-day-v124.today{background:var(--primary)!important;color:#fff!important}
  body.mc-dark #calendarPage .mc-cal-day-v124.selected:not(.today){background:#263d4c!important;color:#d9edf9!important;box-shadow:inset 0 0 0 1px #54758b!important}
  body.mc-dark #calendarPage .mc-cal-clear-v124{background:#26343c!important;color:#d8e8f1!important}

  body.mc-dark #calendarPage .calendar-events-panel{background:#182229!important;border-color:#2d3b44!important;color:#e7edf1!important}
  body.mc-dark #calendarPage .calendar-events-head h3,body.mc-dark #calendarPage #calendarMonthTitle{color:#eef3f6!important}
  body.mc-dark #calendarPage .calendar-events-head p,body.mc-dark #calendarPage #calendarMonthSummary{color:#b8c4ca!important}
  body.mc-dark #calendarPage .mc-cal-pending-title-v124{color:#b8c4ca!important}
  body.mc-dark #calendarPage #calendarEventsList .item{background:#1b262d!important;color:#e7edf1!important;border-color:#314049!important}
  body.mc-dark #calendarPage #calendarEventsList .item-title{color:#e7edf1!important}
  body.mc-dark #calendarPage #calendarEventsList .item .meta{color:#aebbc3!important}
  body.mc-dark #calendarPage #calendarEventsList .item.done{background:#172127!important;opacity:.62!important;border-color:#2d3a42!important}
  body.mc-dark #calendarPage #calendarEventsList .item.done .item-title,body.mc-dark #calendarPage #calendarEventsList .item.done .meta{color:#9ca9b0!important}
  body.mc-dark #calendarPage .mc-cal-done-heading-v124{background:linear-gradient(90deg,#202b31,#1c272d)!important;border-top-color:#3a4952!important;border-bottom-color:#314049!important;color:#aeb9bf!important}
  body.mc-dark #calendarPage .mc-cal-done-heading-v124 strong{color:#b9c5cb!important}
  body.mc-dark #calendarPage .mc-cal-done-count-v124{color:#98a6ad!important}
  body.mc-dark #calendarPage .mc-cal-done-toggle-v124{background:#314049!important;border-color:#485a64!important;color:#d8e8f1!important}
  body.mc-dark #calendarPage .mc-cal-no-pending-v124{background:#172127!important;border-color:#3a4952!important;color:#9eabb3!important}
 }
 `;document.head.appendChild(st);
})();