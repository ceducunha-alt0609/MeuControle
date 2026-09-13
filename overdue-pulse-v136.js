/* MeuControle — V1.36.5: vencidos com borda vermelha fixa */
(function(){
 if(window.__mcOverduePulseV136)return;window.__mcOverduePulseV136=true;
 const st=document.createElement('style');
 st.id='mcOverduePulseV136Style';
 st.textContent=`
 .item.late:not(.done),
 #launchesPage .item.late:not(.done),
 #calendarPage .item.late:not(.done){
   animation:none!important;
   box-shadow:none!important;
   border-style:solid!important;
   border-width:2px!important;
   border-color:#d64747!important;
 }
 body.mc-dark .item.late:not(.done),
 body.mc-dark #launchesPage .item.late:not(.done),
 body.mc-dark #calendarPage .item.late:not(.done){
   animation:none!important;
   box-shadow:none!important;
   border-style:solid!important;
   border-width:2px!important;
   border-top-color:#e45a5a!important;
   border-right-color:#e45a5a!important;
   border-bottom-color:#e45a5a!important;
   border-left-color:#e45a5a!important;
 }
 body.mc-dark .item.late:not(.done) .meta{color:#e36a6a!important}
 `;
 document.head.appendChild(st);
})();