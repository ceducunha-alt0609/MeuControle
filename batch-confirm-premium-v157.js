/* MeuControle — V1.57: confirmação única com visual premium aprovado */
(()=>{
 if(window.__mcBatchConfirmPremiumV157)return;window.__mcBatchConfirmPremiumV157=true;
 const st=document.createElement('style');st.id='mcBatchConfirmPremiumV157Style';st.textContent=`
 .mc-confirm-layer{align-items:center!important;justify-content:center!important;padding:22px!important;background:rgba(20,32,27,.48)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
 .mc-confirm-box{width:min(100%,430px)!important;background:#fff!important;border:0!important;border-radius:24px!important;padding:24px!important;box-shadow:0 18px 55px rgba(0,0,0,.25)!important}
 .mc-confirm-icon{width:48px!important;height:48px!important;border-radius:15px!important;background:#f8e7e7!important;color:#a63232!important;font-size:24px!important;margin-bottom:16px!important}
 .mc-confirm-box h3{margin:0!important;color:#26362e!important;font-size:23px!important;line-height:1.2!important}
 .mc-confirm-box p{margin:9px 0 0!important;color:#6f7b74!important;font-size:15px!important;line-height:1.45!important}
 .mc-confirm-name{display:none!important}
 .mc-confirm-box:after{content:'Esta ação não pode ser desfeita.';display:block;margin-top:9px;color:#8b5d5d;font-size:13px;line-height:1.45}
 .mc-confirm-buttons{display:grid!important;grid-template-columns:1fr 1fr!important;gap:12px!important;margin-top:22px!important}
 .mc-confirm-buttons button{width:100%!important;min-height:52px!important;border-radius:14px!important;font-size:16px!important;font-weight:800!important}
 .mc-confirm-cancel{background:#e8f0ec!important;color:#31503e!important}.mc-confirm-delete{background:#b53d3d!important;color:#fff!important;border-color:#b53d3d!important}
 body.mc-dark .mc-confirm-box{background:#1b272e!important}body.mc-dark .mc-confirm-box h3{color:#edf3f6!important}body.mc-dark .mc-confirm-box p{color:#aebbc3!important}body.mc-dark .mc-confirm-box:after{color:#d5a9a9!important}body.mc-dark .mc-confirm-icon{background:#492c2c!important;color:#f1baba!important}body.mc-dark .mc-confirm-cancel{background:#263d35!important;color:#dce9e2!important}
 `;document.head.appendChild(st);
 document.addEventListener('click',e=>{
   if(!e.target.closest('.mc-search-delete'))return;
   requestAnimationFrame(()=>{
     const box=document.querySelector('.mc-confirm-box'),layer=document.querySelector('.mc-confirm-layer');if(!box||!layer||layer.hidden)return;
     const n=Number((document.querySelector('.mc-search-count')?.textContent||'').match(/\d+/)?.[0]||0);
     box.querySelector('.mc-confirm-icon').textContent='!';
     box.querySelector('h3').textContent=n===1?'Excluir lançamento?':`Excluir ${n} lançamentos?`;
     box.querySelector('.mc-confirm-text').textContent=n===1?'Você está prestes a excluir 1 lançamento selecionado.':`Você está prestes a excluir ${n} lançamentos selecionados.`;
   });
 },true);
 window.MeuControleBatchConfirmPremiumV157={version:'1.57'};
})();