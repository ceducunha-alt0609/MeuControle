/* MeuControle — V1.15: opção de incluir/ocultar observações na impressão */
(()=>{
  if(window.__mcPrintObservationsV115)return;window.__mcPrintObservationsV115=true;
  let includeNotes=true;

  function installStyle(){
    if(document.getElementById('mcPrintObservationsV115Style'))return;
    const st=document.createElement('style');st.id='mcPrintObservationsV115Style';st.textContent=`
      @media(min-width:701px){
        .print-launch-grid-v022{grid-template-columns:repeat(3,minmax(0,1fr))!important}
        .print-period-choice-v022,.print-custom-v022{grid-column:1/-1!important}
        .print-custom-v022{grid-template-columns:1fr 1fr!important}
      }
    `;document.head.appendChild(st);
  }

  function enhanceModal(){
    const grid=document.querySelector('.print-launch-grid-v022');if(!grid||grid.querySelector('.print-notes-v115'))return;
    const status=grid.querySelector('.print-status-v022');if(!status)return;
    const label=document.createElement('label');label.innerHTML='Observações<select class="print-notes-v115"><option value="yes">Sim</option><option value="no">Não</option></select>';
    status.closest('label')?.after(label);
    const select=label.querySelector('select');select.value='yes';select.addEventListener('change',()=>{includeNotes=select.value!=='no'});
  }

  function stripNotes(frame){
    if(includeNotes||!frame)return;
    const clean=()=>{try{frame.contentDocument?.querySelectorAll('.pr-note').forEach(n=>n.remove())}catch{}};
    clean();
    try{const doc=frame.contentDocument;if(doc?.documentElement){const ob=new MutationObserver(clean);ob.observe(doc.documentElement,{childList:true,subtree:true});setTimeout(()=>ob.disconnect(),1200)}}catch{}
  }

  const observer=new MutationObserver(records=>{
    enhanceModal();
    if(!includeNotes)for(const r of records)for(const n of r.addedNodes){if(n?.nodeType===1&&n.id==='printFrameV022')stripNotes(n)}
  });
  function boot(){installStyle();enhanceModal();observer.observe(document.documentElement,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.MeuControlePrintObservationsV115={version:'1.15',refresh:enhanceModal};
})();
