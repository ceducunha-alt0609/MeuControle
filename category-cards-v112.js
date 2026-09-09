/* MeuControle — V1.12: categorias dependentes + ícones + cards essenciais */
(function(){
  if(window.__mcCategoryCardsV112)return;window.__mcCategoryCardsV112=true;
  const VERSION='1.12';
  const CUSTOM_KEY='meu_controle_custom_categories_v1';
  const NEW_VALUE='__mc_new_category__';

  const typeIcons={despesa:'💳',recebimento:'💰',compromisso:'📅',consulta:'🩺',exame:'🧪',lembrete:'📌'};
  const defaults={
    despesa:[['Moradia','🏠'],['Alimentação','🍽️'],['Transporte','🚗'],['Saúde','❤️'],['Educação','📚'],['Lazer','🎉'],['Assinaturas','🔁'],['Condomínio','🏢'],['Compras','🛒'],['Impostos / Taxas','🧾'],['Outros','📁']],
    recebimento:[['Proventos','💰'],['Serviço autônomo','💼'],['Reembolso','↩️'],['Venda','🏷️'],['Rendimentos','📈'],['Outros','📁']],
    compromisso:[['Reunião','🤝'],['Trabalho','💼'],['Pessoal','👤'],['Condomínio','🏢'],['Evento','🎟️'],['Visita','🚪'],['Outros','📁']],
    consulta:[['Saúde','🩺']],
    exame:[['Saúde','🧪']],
    lembrete:[['Aniversário','🎂'],['Futebol','⚽'],['Automobilismo','🏎️'],['Pessoal','👤'],['Outros','📁']]
  };
  const legacyIcons={'Casa':'🏠','Condomínio':'🏢','Saúde':'❤️','Transporte':'🚗','Alimentação':'🍽️','Telefone / Internet':'📱','Banco / Cartão':'💳','Impostos / Taxas':'🧾','Compras':'🛒','Família':'👨‍👩‍👧','Trabalho':'💼','Lazer':'🎉','Outros':'📁'};
  const iconChoices=['🏠','🍽️','🚗','❤️','📚','🎉','🔁','🏢','🛒','🧾','💰','💼','↩️','🏷️','📈','🤝','👤','🎟️','🚪','🎂','⚽','🏎️','📌','📱','🔧','🐾','✈️','🎵','💡','📁'];

  function loadCustom(){try{const x=JSON.parse(localStorage.getItem(CUSTOM_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
  function saveCustom(list){localStorage.setItem(CUSTOM_KEY,JSON.stringify(list))}
  function norm(s){return String(s||'').trim().toLocaleLowerCase('pt-BR')}
  function getEntryCategories(type){
    const map=new Map();
    try{(entries||[]).filter(e=>e.type===type&&e.category).forEach(e=>{const k=norm(e.category);if(!map.has(k))map.set(k,{name:e.category,icon:e.categoryIcon||legacyIcons[e.category]||''})})}catch{}
    return [...map.values()];
  }
  function categoriesFor(type){
    const map=new Map();
    (defaults[type]||[]).forEach(([name,icon])=>map.set(norm(name),{name,icon,source:'default'}));
    loadCustom().filter(x=>x.active!==false&&x.type===type).forEach(x=>map.set(norm(x.name),{name:x.name,icon:x.icon||'📁',source:'custom'}));
    getEntryCategories(type).forEach(x=>{if(!map.has(norm(x.name)))map.set(norm(x.name),{name:x.name,icon:x.icon||legacyIcons[x.name]||'📁',source:'history'})});
    return [...map.values()];
  }
  function iconFor(type,category,entry){
    if(entry?.categoryIcon)return entry.categoryIcon;
    const found=categoriesFor(type).find(x=>norm(x.name)===norm(category));
    return found?.icon||legacyIcons[category]||typeIcons[type]||'📌';
  }
  function typeText(type){return({despesa:'Despesa',recebimento:'Recebimento',compromisso:'Compromisso',consulta:'Consulta',exame:'Exame',lembrete:'Lembrete'})[type]||type}

  function installStyles(){
    if(document.getElementById('mcCategoryCardsV112Style'))return;
    const s=document.createElement('style');s.id='mcCategoryCardsV112Style';s.textContent=`
      .mc-card-icon-v112{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;font-family:system-ui,"Segoe UI Emoji","Apple Color Emoji",sans-serif;font-size:18px;line-height:1}
      .mc-card-star-v112{display:inline-flex;align-items:center;flex:0 0 auto;color:var(--accent,#d1a800);font-family:system-ui,sans-serif;font-size:17px;font-weight:900;line-height:1}
      .mc-done-check-v112{display:inline-flex;align-items:center;justify-content:center;flex:0 0 20px;width:20px;height:20px;border-radius:5px;background:#8eaaa0;color:#fff;font:800 14px/1 system-ui,sans-serif}
      .item.important-item .item-title::before{content:none!important}
      .item .badge,.item .notes{display:none!important}
      .item .status-dot{display:none!important}
      .item .item-title-row{display:flex!important;align-items:center!important;gap:7px!important;flex-wrap:nowrap!important;min-width:0}
      .item .item-title{min-width:0}
      .item .meta{margin-top:6px}
      .item.done .item-title,.item.done .meta{text-decoration:line-through;text-decoration-thickness:1.2px;text-decoration-color:rgba(70,84,76,.52)}
      .item.late .meta{color:#b53d3d!important}
      @media(min-width:701px){
        #launchesPage .item,#calendarPage .item{grid-template-columns:minmax(0,1fr)!important;min-height:88px!important;padding:14px 15px!important}
        #launchesPage .item-main,#calendarPage .item-main{grid-column:1!important;width:100%!important}
        #launchesPage .item-side,#calendarPage .item-side{display:none!important}
        #launchesPage .item-title,#calendarPage .item-title{font-size:17px!important;line-height:1.2!important}
        #launchesPage .meta,#calendarPage .meta{font-size:12px!important;line-height:1.35!important}
      }
      @media(max-width:700px){
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102{height:82px!important;min-height:82px!important;max-height:82px!important;padding:12px 13px!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102.mc-bulk-selectable{padding-left:48px!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-title-row{display:flex!important;grid-template-columns:none!important;gap:7px!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-title{font-size:16px!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .meta{margin-top:6px!important;font-size:11.5px!important}
        #launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .item-side,#launchesPage.mobile-launch-list .item.mc-mobile-compact-v102 .amount{display:none!important}
        #calendarPage .calendar-events-scroll .item{grid-template-columns:minmax(0,1fr)!important;min-height:78px!important;padding:12px 13px!important}
        #calendarPage .calendar-events-scroll .item .status-dot{display:none!important;visibility:hidden!important}
        #calendarPage .calendar-events-scroll .item .item-side,#calendarPage .calendar-events-scroll .item .amount{display:none!important}
        #calendarPage .calendar-events-scroll .item-title{font-size:16px!important}
        #calendarPage .calendar-events-scroll .meta{font-size:11.5px!important}
      }
      .mc-new-category-backdrop-v112{position:fixed;inset:0;z-index:101200;background:rgba(18,35,45,.46);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:18px}
      .mc-new-category-card-v112{width:min(420px,100%);background:#fff;border:1px solid #dfe7e3;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.26);padding:20px;color:#253a30}
      .mc-new-category-card-v112 h3{margin:0;font-size:20px}.mc-new-category-card-v112 p{margin:5px 0 15px;color:#6d7972;font-size:12px;line-height:1.45}
      .mc-new-category-card-v112 input{width:100%;height:44px;margin-bottom:12px}
      .mc-icon-grid-v112{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin:5px 0 16px}.mc-icon-choice-v112{min-height:38px!important;padding:0!important;background:#f1f5f3!important;color:#253a30!important;border:1px solid #dde6e1!important;border-radius:10px!important;font:20px/1 system-ui,sans-serif!important;box-shadow:none!important}.mc-icon-choice-v112.active{outline:2px solid var(--primary);background:#fff!important}
      .mc-new-category-actions-v112{display:flex;justify-content:flex-end;gap:8px}.mc-new-category-actions-v112 button{min-height:42px!important;padding:9px 14px!important}
      @media(max-width:700px){.mc-new-category-backdrop-v112{align-items:flex-end;padding:12px}.mc-new-category-card-v112{border-radius:20px 20px 14px 14px}.mc-icon-grid-v112{grid-template-columns:repeat(6,1fr)}}
    `;document.head.appendChild(s);
  }

  function decorateTypeSelect(){
    const select=document.getElementById('type');if(!select)return;
    const labels={despesa:'💳 Despesa',recebimento:'💰 Recebimento',compromisso:'📅 Compromisso',consulta:'🩺 Consulta',exame:'🧪 Exame',lembrete:'📌 Lembrete'};
    Object.entries(labels).forEach(([value,label])=>{const o=select.querySelector(`option[value="${value}"]`);if(o)o.textContent=label});
  }

  function populateCategory(type,preferred){
    const select=document.getElementById('category');if(!select)return;
    const list=categoriesFor(type),wanted=preferred??select.value;
    select.innerHTML='<option value="">Selecionar...</option>'+list.map(x=>`<option value="${String(x.name).replaceAll('&','&amp;').replaceAll('"','&quot;')}">${x.icon?x.icon+' ':''}${x.name}</option>`).join('')+`<option value="${NEW_VALUE}">＋ Nova categoria...</option>`;
    const single=(type==='consulta'||type==='exame');
    if(single){select.value='Saúde';select.disabled=true}
    else{select.disabled=false;if(wanted&&list.some(x=>norm(x.name)===norm(wanted)))select.value=list.find(x=>norm(x.name)===norm(wanted)).name;else select.value=''}
  }

  function openNewCategory(type){
    document.querySelector('.mc-new-category-backdrop-v112')?.remove();
    let chosen='📌';
    const back=document.createElement('div');back.className='mc-new-category-backdrop-v112';
    back.innerHTML=`<section class="mc-new-category-card-v112" role="dialog" aria-modal="true"><h3>Nova categoria</h3><p>Ela ficará vinculada a ${typeIcons[type]||''} ${typeText(type)}.</p><input class="mc-new-category-name-v112" maxlength="32" placeholder="Nome da categoria"><div class="mc-icon-grid-v112">${iconChoices.map((i,n)=>`<button type="button" class="mc-icon-choice-v112${n===0?' active':''}" data-icon="${i}">${i}</button>`).join('')}</div><div class="mc-new-category-actions-v112"><button type="button" class="ghost mc-new-category-cancel-v112">Cancelar</button><button type="button" class="mc-new-category-save-v112">Salvar categoria</button></div></section>`;
    document.body.appendChild(back);chosen=iconChoices[0];
    back.querySelectorAll('.mc-icon-choice-v112').forEach(b=>b.onclick=()=>{chosen=b.dataset.icon;back.querySelectorAll('.mc-icon-choice-v112').forEach(x=>x.classList.toggle('active',x===b))});
    const close=()=>{back.remove();populateCategory(type,'')};
    back.querySelector('.mc-new-category-cancel-v112').onclick=close;back.addEventListener('click',e=>{if(e.target===back)close()});
    back.querySelector('.mc-new-category-save-v112').onclick=()=>{const name=back.querySelector('.mc-new-category-name-v112').value.trim();if(!name)return back.querySelector('.mc-new-category-name-v112').focus();const all=categoriesFor(type);if(all.some(x=>norm(x.name)===norm(name))){back.querySelector('.mc-new-category-name-v112').value='';back.querySelector('.mc-new-category-name-v112').placeholder='Essa categoria já existe';return}const custom=loadCustom();custom.push({type,name,icon:chosen,active:true});saveCustom(custom);back.remove();populateCategory(type,name)};
    setTimeout(()=>back.querySelector('.mc-new-category-name-v112')?.focus(),0);
  }

  function installFormBehavior(){
    const type=document.getElementById('type'),category=document.getElementById('category'),form=document.getElementById('entryForm');if(!type||!category||!form)return;
    decorateTypeSelect();populateCategory(type.value,category.value);
    if(!type.dataset.mcCatV112){type.dataset.mcCatV112='1';type.addEventListener('change',()=>populateCategory(type.value,''))}
    if(!category.dataset.mcCatV112){category.dataset.mcCatV112='1';category.addEventListener('change',()=>{if(category.value===NEW_VALUE)openNewCategory(type.value)})}
    if(!form.dataset.mcCatSubmitV112){
      form.dataset.mcCatSubmitV112='1';
      form.addEventListener('submit',()=>{
        const editId=typeof editingId!=='undefined'?editingId:null,before=new Set((entries||[]).map(e=>e.id)),t=type.value,c=category.value,ico=iconFor(t,c);
        setTimeout(()=>{try{const targets=editId?entries.filter(e=>e.id===editId):entries.filter(e=>!before.has(e.id));let changed=false;targets.forEach(e=>{if(e.category===c&&e.type===t&&e.categoryIcon!==ico){e.categoryIcon=ico;changed=true}});if(changed){save();renderAll()}}catch{}},0);
      },true);
    }
  }

  function wrapFormFunctions(){
    if(typeof startEdit==='function'&&!startEdit.__mcCatV112){const original=startEdit;const wrapped=function(id){const e=entries.find(x=>x.id===id);const r=original(id);if(e)populateCategory(e.type,e.category||'');return r};wrapped.__mcCatV112=true;startEdit=wrapped}
    if(typeof resetForm==='function'&&!resetForm.__mcCatV112){const original=resetForm;const wrapped=function(){const r=original();setTimeout(()=>populateCategory(document.getElementById('type')?.value||'despesa',''),0);return r};wrapped.__mcCatV112=true;resetForm=wrapped}
    if(typeof typeLabel==='function'&&!typeLabel.__mcCatV112){const wrapped=function(t){return typeText(t)};wrapped.__mcCatV112=true;typeLabel=wrapped}
  }

  function decorateCard(fragment,e){
    if(!fragment?.querySelector)return fragment;const card=fragment.querySelector('.item');if(!card)return fragment;
    const row=card.querySelector('.item-title-row'),title=card.querySelector('.item-title'),meta=card.querySelector('.meta');if(!row||!title)return fragment;
    row.querySelectorAll('.mc-card-icon-v112,.mc-card-star-v112,.mc-done-check-v112').forEach(x=>x.remove());
    if(e.done){const check=document.createElement('span');check.className='mc-done-check-v112';check.textContent='✓';row.insertBefore(check,title)}
    const icon=document.createElement('span');icon.className='mc-card-icon-v112';icon.textContent=iconFor(e.type,e.category,e);row.insertBefore(icon,title);
    if(e.important){const star=document.createElement('span');star.className='mc-card-star-v112';star.textContent='★';title.after(star)}
    if(meta)meta.textContent=[typeof fmtDate==='function'?fmtDate(e.date):e.date,e.time||''].filter(Boolean).join(' · ');
    const amount=card.querySelector('.amount');if(amount)amount.textContent='';
    return fragment;
  }
  function wrapCards(){
    if(typeof createItemNode!=='function'||createItemNode.__mcCategoryCardV112)return;
    const original=createItemNode;const wrapped=function(e,context='list'){return decorateCard(original(e,context),e)};wrapped.__mcCategoryCardV112=true;createItemNode=wrapped;
  }

  function boot(){installStyles();installFormBehavior();wrapFormFunctions();wrapCards();try{renderAll()}catch{}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,120),{once:true});else setTimeout(boot,120);
  window.addEventListener('load',()=>setTimeout(()=>{installFormBehavior();wrapFormFunctions();wrapCards();try{renderAll()}catch{}},700));
  window.MeuControleCategories={version:VERSION,iconFor,categoriesFor,populateCategory,typeIcons};
})();
