/* MeuControle — V0.97: estrela de Importante sempre dourada */
(()=>{
  if(window.__mcImportantStarV097)return;
  window.__mcImportantStarV097=true;
  const st=document.createElement('style');
  st.id='mcImportantStarV097Style';
  st.textContent=`
    .item.important-item .item-title::before,
    .dashboard-card.important-item strong::before{
      color:var(--accent,#d1a800)!important;
    }
  `;
  document.head.appendChild(st);
  window.MeuControleImportantStarV097={version:'0.97'};
})();