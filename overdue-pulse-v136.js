/* MeuControle — V1.36.3: borda uniforme nos vencidos */
(function(){
 if(window.__mcOverduePulseV136)return;window.__mcOverduePulseV136=true;
 const st=document.createElement('style');
 st.id='mcOverduePulseV136Style';
 st.textContent=`
 @keyframes mc-overdue-pulse-v136{
   0%,100%{box-shadow:0 0 0 0 rgba(190,55,55,0)}
   50%{box-shadow:0 0 0 4px rgba(190,55,55,.10)}
 }
 .item.late:not(.done),
 #launchesPage .item.late:not(.done),
 #calendarPage .item.late:not(.done){
   border:2px solid rgba(214,71,71,.88)!important;
   animation:mc-overdue-pulse-v136 2.8s ease-in-out infinite!important;
 }
 body.mc-dark #launchesPage .item.late:not(.done),
 body.mc-dark #calendarPage .item.late:not(.done){
   border:2px solid rgba(226,79,79,.92)!important;
 }
 body.mc-dark .item.late:not(.done) .meta{color:#e36a6a!important}
 @media(prefers-reduced-motion:reduce){
   .item.late:not(.done){animation:none!important;box-shadow:none!important}
 }
 `;
 document.head.appendChild(st);
})();