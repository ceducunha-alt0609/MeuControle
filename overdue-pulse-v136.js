/* MeuControle — V1.36.4: a propria borda dos vencidos respira suavemente */
(function(){
 if(window.__mcOverduePulseV136)return;window.__mcOverduePulseV136=true;
 const st=document.createElement('style');
 st.id='mcOverduePulseV136Style';
 st.textContent=`
 @keyframes mc-overdue-pulse-v136{
   0%,100%{border-color:rgba(190,55,55,.58);box-shadow:0 0 0 0 rgba(190,55,55,0)}
   50%{border-color:rgba(232,58,58,1);box-shadow:0 0 0 2px rgba(210,55,55,.07)}
 }
 @keyframes mc-overdue-pulse-dark-v136{
   0%,100%{border-color:rgba(196,62,62,.62);box-shadow:0 0 0 0 rgba(225,65,65,0)}
   50%{border-color:rgba(255,82,82,1);box-shadow:0 0 0 2px rgba(235,70,70,.09)}
 }
 .item.late:not(.done),
 #launchesPage .item.late:not(.done),
 #calendarPage .item.late:not(.done){
   border-style:solid!important;
   border-width:2px!important;
   border-color:rgba(190,55,55,.58)!important;
   animation:mc-overdue-pulse-v136 2.8s ease-in-out infinite!important;
 }
 body.mc-dark .item.late:not(.done),
 body.mc-dark #launchesPage .item.late:not(.done),
 body.mc-dark #calendarPage .item.late:not(.done){
   border-style:solid!important;
   border-width:2px!important;
   border-color:rgba(196,62,62,.62)!important;
   animation:mc-overdue-pulse-dark-v136 2.8s ease-in-out infinite!important;
 }
 body.mc-dark .item.late:not(.done) .meta{color:#e36a6a!important}
 @media(prefers-reduced-motion:reduce){
   .item.late:not(.done){animation:none!important;border-color:rgba(214,71,71,.88)!important;box-shadow:none!important}
   body.mc-dark .item.late:not(.done){border-color:rgba(226,79,79,.92)!important}
 }
 `;
 document.head.appendChild(st);
})();