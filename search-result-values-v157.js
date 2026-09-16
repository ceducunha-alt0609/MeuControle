/* MeuControle — V1.57: valores financeiros nos resultados da pesquisa */
(()=>{
 if(window.__mcSearchResultValuesV157)return;window.__mcSearchResultValuesV157=true;
 const style=document.createElement('style');style.textContent=`
 .mc-search-value{display:block!important;margin-top:6px!important;font-size:14px!important;line-height:1.2!important;font-weight:900!important;text-align:left!important}
 .mc-search-value.expense{color:#b53d3d!important}.mc-search-value.income{color:#278457!important}
 body.mc-dark .mc-search-value.expense{color:#ef8b8b!important}body.mc-dark .mc-search-value.income{color:#71c99b!important}
 `;document.head.appendChild(style);
 const money=v=>{try{return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v||0))}catch{return `R$ ${Number(v||0).toFixed(2).replace('.',',')}`}};
 function decorate(){
  const rows=[...document.querySelectorAll('.mc-search-row')];if(!rows.length||typeof entries==='undefined')return;
  const used=new Set();
  rows.forEach(row=>{
   const copy=row.querySelector('.mc-search-copy');if(!copy||copy.querySelector('.mc-search-value'))return;
   const name=row.querySelector('.mc-search-name')?.textContent?.trim()||'',meta=row.querySelector('.mc-search-meta')?.textContent||'';
   const item=entries.find(e=>!used.has(e.id)&&e.description===name&&typeof fmtDate==='function'&&meta.includes(fmtDate(e.date))&&(!e.time||meta.includes(e.time)));
   if(!item)return;used.add(item.id);
   const value=Number(item.value||0);if(value<=0||!['despesa','recebimento'].includes(item.type))return;
   const el=document.createElement('span');el.className=`mc-search-value ${item.type==='despesa'?'expense':'income'}`;el.textContent=money(value);copy.appendChild(el);
  });
 }
 const observer=new MutationObserver(()=>requestAnimationFrame(decorate));observer.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target?.id==='globalSearch')setTimeout(decorate,30)},true);
 window.MeuControleSearchResultValuesV157={version:'1.57',refresh:decorate};
})();