/* MeuControle v1.70 — Etapas: cadastro + cards de Consulta */
(function(){
 const q=id=>document.getElementById(id), STORAGE='mc-entry-steps-v170';
 function load(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{return{}}}
 function store(v){localStorage.setItem(STORAGE,JSON.stringify(v))}
 function entryId(){return window.editingId||null}
 function init(){const add=q('mcAddStep'),box=q('mcSteps');if(!add||!box)return;
 const style=document.createElement('style');style.textContent='.mc-enh-box{border:1px solid var(--border,#33444d);border-radius:13px;padding:11px 13px;background:transparent}.mc-enh-title{display:flex;justify-content:space-between;font-weight:800;font-size:12px;margin-bottom:5px}.mc-enh-title small{font-weight:500;opacity:.65}.mc-add-step{background:transparent!important;color:var(--primary)!important;box-shadow:none!important;padding:6px 0!important;min-height:28px!important;font-size:12px!important;font-weight:700!important}.mc-step-row{display:grid;grid-template-columns:1fr 36px;gap:7px;margin:7px 0}.mc-step-row button{background:transparent!important;box-shadow:none!important;padding:0!important;color:#b66b64!important}.mc-card-steps{margin-top:9px;border-top:1px solid rgba(120,140,130,.18);padding-top:7px}.mc-card-steps-toggle{border:0!important;background:transparent!important;box-shadow:none!important;padding:3px 0!important;min-height:26px!important;color:var(--primary)!important;font-size:11px!important;font-weight:800!important}.mc-card-steps-list{display:none;padding:5px 0 1px}.mc-card-steps.open .mc-card-steps-list{display:block}.mc-card-step{display:flex;align-items:flex-start;gap:8px;padding:5px 0;font-size:12px;line-height:1.3}.mc-card-step input{margin-top:1px;accent-color:var(--primary)}.mc-card-step.done span{text-decoration:line-through;opacity:.55}.mc-card-progress{display:inline-block;margin-left:5px;opacity:.68;font-weight:700}';document.head.appendChild(style);
 function count(){const n=box.querySelectorAll('.mc-step-row').length,x=q('mcStepCount');if(x)x.textContent=n?n+' etapa'+(n>1?'s':''):''}
 function addRow(text=''){const row=document.createElement('div');row.className='mc-step-row';row.innerHTML='<input type="text" maxlength="120" placeholder="Ex.: Solicitar orçamento"><button type="button" aria-label="Remover etapa">×</button>';row.querySelector('input').value=text;row.querySelector('button').onclick=()=>{row.remove();count()};box.appendChild(row);count();return row}
 add.addEventListener('click',()=>addRow().querySelector('input').focus());

 setTimeout(()=>{},0);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();