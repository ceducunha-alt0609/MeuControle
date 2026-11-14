/* MeuControle — Datas Especiais V1: eventos por perfil, sem lançamentos duplicados */
(function(){
 'use strict';
 function start(){
 if(window.MeuControleSpecialDatesV1)return;
 const css=document.createElement('style');
 css.id='mc-special-dates-v1-style';
 css.textContent='.mc-special-card{margin-top:14px;padding:14px;border:1px solid #dfe7e2;border-radius:13px;background:var(--card,#fff)}.mc-special-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.mc-special-head h4{margin:0;font-size:15px}.mc-special-head p{margin:4px 0;color:var(--muted,#718078);font-size:11px}.mc-special-items{display:grid;gap:7px;margin-top:12px}.mc-special-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid #e1e8e4;border-radius:10px}.mc-special-item-main{flex:1;min-width:0}.mc-special-item-main strong{display:block;font-size:12px}.mc-special-item-main small{display:block;margin-top:3px;font-size:10px;color:#718078}.mc-special-item button{padding:6px 9px!important;min-height:30px!important;font-size:11px!important}.mc-special-add{white-space:nowrap}.mc-special-calendar-btn{font-size:12px!important;padding:8px 12px!important;margin-left:auto}.mc-special-dot{width:7px;height:7px;background:#a568c9;border-radius:50%;display:block;flex-shrink:0}.mc-special-calendar-panel{border:1px solid rgba(165,104,201,.28);background:rgba(165,104,201,.08);border-radius:11px;padding:10px 12px;margin:8px 0}.mc-special-calendar-panel strong{font-size:12px;display:block;margin-bottom:5px}.mc-special-calendar-panel div{font-size:12px;margin:4px 0}.mc-special-calendar-panel button{font-size:11px!important;padding:5px 8px!important;margin-top:6px}.mc-special-overlay{position:fixed;inset:0;background:rgba(10,20,28,.6);z-index:110000;display:flex;align-items:center;justify-content:center;padding:14px}.mc-special-modal{width:min(440px,100%);max-height:95vh;overflow:auto;background:var(--surface,#fff);color:var(--text,#273b30);border:1px solid #dce6e0;border-radius:18px;padding:20px;box-shadow:0 20px 70px #0004}.mc-special-modal h3{margin:0 0 5px;font-size:19px}.mc-special-modal p{margin:0 0 16px;font-size:12px;color:var(--muted,#718078)}.mc-special-modal label{display:block;font-size:12px;font-weight:700;margin:10px 0}.mc-special-modal input,.mc-special-modal select,.mc-special-modal textarea{display:block;width:100%;margin-top:5px;box-sizing:border-box}.mc-special-modal-actions{display:flex;gap:8px;margin-top:16px;justify-content:flex-end}.mc-special-modal-actions button{min-height:40px!important}.mc-special-empty{font-size:12px;color:#718078;padding:8px 0}.mc-special-day{position:relative}.mc-special-day .mc-special-dot{box-shadow:0 0 0 1px #fff}.mc-special-day.today .mc-special-dot{background:#fff}.mc-special-legend{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--muted,#718078);padding:6px 12px}.mc-dark .mc-special-card,.theme-black .mc-special-card{background:#18252d;border-color:#334851}.mc-dark .mc-special-item,.theme-black .mc-special-item{border-color:#334851}.mc-dark .mc-special-modal,.theme-black .mc-special-modal{background:#19262e;color:#ecf4f6;border-color:#37515e}.mc-dark .mc-special-calendar-panel,.theme-black .mc-special-calendar-panel{background:#30233c;border-color:#664a79}@media(max-width:700px){.mc-special-overlay{align-items:flex-end}.mc-special-modal{border-radius:20px 20px 14px 14px}.mc-special-calendar-btn{font-size:11px!important}}';
 document.head.appendChild(css);
 const safe=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pad=n=>String(n).padStart(2,'0');
 const all=()=>Array.isArray(profiles)?profiles.flatMap(p=>(Array.isArray(p.specialDates)?p.specialDates:[]).map(x=>({...x,profile:p.id,profileName:p.name}))):[];
 const visible=()=>all().filter(x=>typeof activeProfile==='undefined'||activeProfile==='all'||x.profile===activeProfile);
 const occurrence=(x,y)=>{let d=Number(x.day),m=Number(x.month);if(m===2&&d===29&&new Date(y,1,29).getDate()!==29)d=28;return String(y)+'-'+pad(m)+'-'+pad(d)};
 function display(x){return pad(x.day)+'/'+pad(x.month)}
 function age(x,y){return x.year&&Number(x.year)<=y?' • '+(y-Number(x.year))+' anos':''}
 const byDate=date=>visible().filter(x=>occurrence(x,Number(date.slice(0,4)))===date);
 function showEditor(id,initialDate){
   document.querySelector('.mc-special-overlay')?.remove();
   const original=all().find(x=>x.id===id);
   const selectedProfile=original?.profile||(typeof activeProfile!=='undefined'&&activeProfile!=='all'?activeProfile:'pessoal');
   const modal=document.createElement('div');modal.className='mc-special-overlay';
   modal.innerHTML='<form class="mc-special-modal" role="dialog" aria-modal="true" aria-label="Data especial"><h3>'+(original?'Editar data especial':'Nova data especial')+'</h3><p>Cadastre uma vez para aparecer automaticamente todo ano.</p><label>Perfil<select name="profile"></select></label><label>Tipo<select name="type"><option value="birthday">🎂 Aniversário</option><option value="special">💜 Data comemorativa</option></select></label><label>Nome / descrição<input name="name" maxlength="70" required placeholder="Ex.: Aniversário de Maria"></label><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px"><label>Dia<input name="day" type="number" min="1" max="31" required></label><label>Mês<input name="month" type="number" min="1" max="12" required></label><label>Ano (opcional)<input name="year" type="number" min="1900" max="2200"></label></div><label>Observações<textarea name="notes" rows="2" maxlength="400"></textarea></label><div class="mc-special-modal-actions"><button type="button" class="secondary-action mc-special-cancel">Cancelar</button><button type="submit">Salvar data</button></div></form>';
   document.body.appendChild(modal);
   const form=modal.querySelector('form');
   const pick=form.elements.profile;
   (Array.isArray(profiles)?profiles:[]).forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.name;pick.appendChild(o)});
   pick.value=selectedProfile;
   form.elements.type.value=original?.type||'birthday';
   form.elements.name.value=original?.name||'';
   const parts=initialDate?.split('-')||[];
   form.elements.day.value=original?.day||Number(parts[2])||new Date().getDate();
   form.elements.month.value=original?.month||Number(parts[1])||new Date().getMonth()+1;
   form.elements.year.value=original?.year||'';
   form.elements.notes.value=original?.notes||'';
   function close(){modal.remove()}
   modal.querySelector('.mc-special-cancel').onclick=close;
   modal.addEventListener('click',e=>{if(e.target===modal)close()});
   form.onsubmit=e=>{
     e.preventDefault();
     const n=Number(form.elements.day.value),m=Number(form.elements.month.value),y=Number(form.elements.year.value)||null;
     if(!Number.isInteger(n)||!Number.isInteger(m)||m<1||m>12||n<1||n>new Date(2024,m,0).getDate()){alert('Confira o dia e o mês informados.');return}
     if(y&&m===2&&n===29&&new Date(y,1,29).getDate()!==29){alert('O ano informado não possui 29 de fevereiro.');return}
     const profile=profiles.find(p=>p.id===pick.value);if(!profile)return;
     if(typeof createAutoBackup==='function')createAutoBackup('Antes de alterar datas especiais');
     if(original){const prev=profiles.find(p=>p.id===original.profile);if(prev)prev.specialDates=(prev.specialDates||[]).filter(x=>x.id!==original.id)}
     profile.specialDates=Array.isArray(profile.specialDates)?profile.specialDates:[];
     profile.specialDates.push({id:original?.id||'special_'+(crypto.randomUUID?crypto.randomUUID():Date.now()),type:form.elements.type.value,name:form.elements.name.value.trim(),day:n,month:m,year:y,notes:form.elements.notes.value.trim()});
     if(typeof saveProfiles==='function')saveProfiles();
     close();refresh();window.dispatchEvent(new CustomEvent('meucontrole:special-dates-changed'));
   };
 }
 function renderPanel(){
   const host=document.querySelector('#settingsPage .settings-card:has(#profilesList)');if(!host)return;
   let panel=host.querySelector('.mc-special-card');if(!panel){panel=document.createElement('section');panel.className='mc-special-card';panel.innerHTML='<div class="mc-special-head"><div><h4>🎂 Datas Especiais</h4><p>Aniversários e comemorações por perfil</p></div><button type="button" class="mc-special-add">+ Adicionar</button></div><div class="mc-special-items"></div>';host.appendChild(panel);panel.querySelector('.mc-special-add').onclick=()=>showEditor();}
   const list=panel.querySelector('.mc-special-items');
   const sorted=all().slice().sort((a,b)=>a.month-b.month||a.day-b.day||a.name.localeCompare(b.name,'pt-BR'));
   list.innerHTML=sorted.length?'':'<div class="mc-special-empty">Nenhuma data cadastrada. Use + Adicionar para começar.</div>';
   sorted.forEach(x=>{
     const row=document.createElement('div');row.className='mc-special-item';row.innerHTML='<span style="font-size:19px">'+(x.type==='special'?'💜':'🎂')+'</span><div class="mc-special-item-main"><strong>'+safe(x.name)+'</strong><small>'+display(x)+' · '+safe(x.profileName)+'</small></div><button type="button" class="secondary-action">Editar</button><button type="button" class="secondary-action" aria-label="Excluir">×</button>';
     row.children[2].onclick=()=>showEditor(x.id);
     row.children[3].onclick=()=>{
       if(!confirm('Excluir a data especial de '+x.name+'?'))return;
       if(typeof createAutoBackup==='function')createAutoBackup('Antes de excluir data especial');
       const p=profiles.find(p=>p.id===x.profile);if(p)p.specialDates=(p.specialDates||[]).filter(q=>q.id!==x.id);
       if(typeof saveProfiles==='function')saveProfiles();refresh();
     };
     list.appendChild(row);
   });
 }
 function calendarDate(){
   if(typeof calendarYear==='undefined'||typeof calendarMonth==='undefined')return'';
   const desktop=document.querySelector('#calendarPage .mc-cal-day-v124.selected[data-day]');
   if(desktop)return String(calendarYear)+'-'+pad(calendarMonth+1)+'-'+pad(desktop.dataset.day);
   const mobile=window.MeuControleMobileCalendarGridV110?.selected?.();
   return mobile&&mobile.startsWith(String(calendarYear)+'-'+pad(calendarMonth+1))?mobile:'';
 }
 function renderCalendarSpecial(){
   const page=document.getElementById('calendarPage');if(!page||typeof calendarYear==='undefined'||typeof calendarMonth==='undefined')return;
   const head=page.querySelector('.calendar-head');if(head&&!head.querySelector('.mc-special-calendar-btn')){const btn=document.createElement('button');btn.type='button';btn.className='secondary-action mc-special-calendar-btn';btn.textContent='+ Aniversário';btn.onclick=()=>showEditor(null,calendarDate()||String(calendarYear)+'-'+pad(calendarMonth+1)+'-01');head.appendChild(btn)}
   const desktop=page.querySelectorAll('.mc-cal-day-v124[data-day]'),mobile=page.querySelectorAll('.mobile-calendar-day-v109[data-date]');
   desktop.forEach(btn=>{const date=String(calendarYear)+'-'+pad(calendarMonth+1)+'-'+pad(btn.dataset.day);decorateDay(btn,date,'.mc-cal-dots-v124')});
   mobile.forEach(btn=>decorateDay(btn,btn.dataset.date,'.mc-day-dots-v109'));
   const panel=page.querySelector('.calendar-events-panel');if(!panel)return;
   let box=panel.querySelector('.mc-special-calendar-panel');const date=calendarDate();const matches=date?byDate(date):[];
   if(!matches.length){box?.remove();return}
   if(!box){box=document.createElement('section');box.className='mc-special-calendar-panel';const scroll=panel.querySelector('.calendar-events-scroll');panel.insertBefore(box,scroll||null)}
   const yr=Number(date.slice(0,4));
   box.innerHTML='<strong>🎂 Datas especiais · '+pad(Number(date.slice(8)))+'/'+pad(Number(date.slice(5,7)))+'</strong>'+matches.map(x=>'<div>'+(x.type==='special'?'💜':'🎉')+' '+safe(x.name)+safe(age(x,yr))+'</div>').join('')+'<button type="button" class="secondary-action">+ Aniversário</button>';
   box.querySelector('button').onclick=()=>showEditor(null,date);
 }

 function activatePublishedCalendar(){
   /* Existing PWA installs receive specialized desktop/mobile calendars from the service worker. */
   if(window.__mcDesktopCalendarSplitV124 || window.__meuControleMobileCalendarGridV110Loaded || window.__meuControleMobileCalendarGridV109Loaded)return;
   if(typeof renderCalendar!=='function'||typeof calendarEntries!=='function')return;
   const st=document.createElement('style');st.id='mc-special-active-cal';
   st.textContent='#calendarPage .calendar-layout{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;align-items:start}#calendarPage .calendar-months{display:block!important;padding:0!important;overflow:visible!important}#calendarPage .mc-special-month-nav{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:linear-gradient(#edf6fb,#e6f2f9)}#calendarPage .mc-special-month-nav strong{font-size:17px;color:#164f78}#calendarPage .mc-special-month-nav button{border:0;background:#dcebf4;color:#164f78;border-radius:8px;width:33px;height:33px;font-size:20px;padding:0}#calendarPage .mc-special-week,#calendarPage .mc-cal-grid-v124{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}#calendarPage .mc-special-week span{text-align:center;padding:9px 0;font-size:10px;font-weight:800;color:#607b8a;background:#f7fafb}#calendarPage .mc-cal-day-v124{border:0;border-right:1px solid #e9eff3;border-bottom:1px solid #e9eff3;background:#fff;min-height:55px;padding:7px 2px;display:flex;flex-direction:column;align-items:center;gap:7px;box-shadow:none;transform:none;border-radius:0;color:#385066}#calendarPage .mc-cal-day-v124.out{background:#fafcfd;pointer-events:none}#calendarPage .mc-cal-day-v124.selected{background:#e6f2fa;color:#164f78}#calendarPage .mc-cal-day-v124.today .mc-cal-day-num-v124{background:var(--primary);color:#fff;border-radius:99px;padding:3px 7px}#calendarPage .mc-cal-day-num-v124{font-weight:800;font-size:13px}#calendarPage .mc-cal-dots-v124{display:flex;align-items:center;gap:3px;min-height:7px}#calendarPage .mc-special-entry-dot,#calendarPage .mc-special-holiday-dot{width:6px;height:6px;border-radius:50%;background:#d28a07}#calendarPage .mc-special-holiday-dot{background:#1684c6}#calendarPage .mc-special-month-footer{padding:9px;text-align:center}#calendarPage .mc-special-month-footer button{border:0;background:transparent;color:var(--primary);font-size:11px}#calendarPage .calendar-year-nav{display:none!important}body.mc-dark #calendarPage .mc-special-month-nav,body.theme-black #calendarPage .mc-special-month-nav{background:#193442}body.mc-dark #calendarPage .mc-cal-day-v124,body.theme-black #calendarPage .mc-cal-day-v124{background:#14242e;color:#eaf3f6;border-color:#30434e}body.mc-dark #calendarPage .mc-cal-day-v124.selected,body.theme-black #calendarPage .mc-cal-day-v124.selected{background:#254659}@media(max-width:700px){#calendarPage .calendar-layout{grid-template-columns:1fr!important}#calendarPage .mc-cal-day-v124{min-height:45px!important;padding:5px 1px!important}}';
   document.head.appendChild(st);
   let selectedDay=0,lastPeriod='';
   function build(){
     const host=document.getElementById('calendarMonths');if(!host)return;
     const period=calendarYear+'-'+calendarMonth;
     if(period!==lastPeriod){selectedDay=0;lastPeriod=period}
     const first=new Date(calendarYear,calendarMonth,1).getDay(),max=new Date(calendarYear,calendarMonth+1,0).getDate(),count=Math.ceil((first+max)/7)*7;
     const hasEntry=new Set(calendarEntries().map(e=>e.date));
     const holidays=typeof holidayMapSP==='function'?holidayMapSP(calendarYear):new Map();
     let cells='';
     for(let i=0;i<count;i++){
       const d=i-first+1;if(d<1||d>max){cells+='<div class="mc-cal-day-v124 out"></div>';continue}
       const iso=calendarYear+'-'+pad(calendarMonth+1)+'-'+pad(d),now=new Date(),today=now.getFullYear()===calendarYear&&now.getMonth()===calendarMonth&&now.getDate()===d;
       cells+='<button type="button" data-day="'+d+'" class="mc-cal-day-v124'+(today?' today':'')+(selectedDay===d?' selected':'')+'"><span class="mc-cal-day-num-v124">'+d+'</span><span class="mc-cal-dots-v124">'+(hasEntry.has(iso)?'<i class="mc-special-entry-dot"></i>':'')+(holidays.has(iso)?'<i class="mc-special-holiday-dot"></i>':'')+'</span></button>';
     }
     host.innerHTML='<div class="mc-special-month-nav"><button type="button" data-delta="-1" aria-label="Mês anterior">‹</button><strong>'+safe(monthName(calendarMonth))+' '+calendarYear+'</strong><button type="button" data-delta="1" aria-label="Próximo mês">›</button></div><div class="mc-special-week">'+['DOM','SEG','TER','QUA','QUI','SEX','SÁB'].map(x=>'<span>'+x+'</span>').join('')+'</div><div class="mc-cal-grid-v124">'+cells+'</div><div class="mc-special-month-footer"><button type="button">Ver mês inteiro</button></div>';
     host.querySelectorAll('[data-delta]').forEach(b=>b.onclick=()=>{calendarMonth+=Number(b.dataset.delta);if(calendarMonth<0){calendarMonth=11;calendarYear--}else if(calendarMonth>11){calendarMonth=0;calendarYear++}selectedDay=0;renderCalendar()});
     host.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{const d=Number(b.dataset.day);selectedDay=selectedDay===d?0:d;renderCalendar()});
     host.querySelector('.mc-special-month-footer button').onclick=()=>{selectedDay=0;renderCalendar()};
   }
   const previous=renderCalendar;
   renderCalendar=function(){
     const result=previous();build();
     if(selectedDay){
       const date=calendarYear+'-'+pad(calendarMonth+1)+'-'+pad(selectedDay),q=(typeof calendarQuery==='string'?calendarQuery:'').toLowerCase().trim();
       const matches=calendarEntries().filter(e=>e.date===date).filter(e=>!q||searchableText(e).includes(q)).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
       const list=document.getElementById('calendarEventsList'),empty=document.getElementById('calendarEmpty');
       if(list){list.innerHTML='';matches.forEach(e=>list.appendChild(createItemNode(e,'calendar')))}
       if(empty){empty.classList.toggle('hidden',matches.length>0||byDate(date).length>0);empty.textContent='Nenhum lançamento neste dia.'}
       const title=document.getElementById('calendarMonthTitle');if(title)title.textContent=pad(selectedDay)+' de '+monthName(calendarMonth)+' '+calendarYear;
       const summary=document.getElementById('calendarMonthSummary');if(summary)summary.textContent=matches.length+' lançamento'+(matches.length===1?'':'s')+' no dia';
     }
     renderCalendarSpecial();return result;
   };
   renderCalendar();
 }

 function decorateDay(btn,date,slotSelector){
   const special=byDate(date),old=btn.querySelector('.mc-special-dot');btn.classList.toggle('mc-special-day',special.length>0);
   if(!special.length){old?.remove();return}
   const slot=btn.querySelector(slotSelector)||btn;
   if(!old){const dot=document.createElement('i');dot.className='mc-special-dot';dot.setAttribute('aria-label','Data especial');slot.appendChild(dot)}
 }
 function refresh(){renderPanel();renderCalendarSpecial()}
 let queued=false;
 function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})}
 const observer=new MutationObserver(muts=>{
   if(muts.some(m=>m.type==='attributes'&&m.attributeName==='class'&&m.target.matches?.('.mc-cal-day-v124,.mobile-calendar-day-v109')))return queue();
   if(muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('.mc-cal-grid-v124,.mobile-calendar-grid-v109,.calendar-events-panel,.settings-grid,.profiles-list,.profile-row')||n.querySelector?.('.mc-cal-grid-v124,.mobile-calendar-grid-v109,.calendar-events-panel,.settings-grid,.profiles-list,.profile-row')))))queue();
 });
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
 window.addEventListener('meucontrole:user-workspace-imported',queue);
 window.addEventListener('meucontrole:cloud-bootstrap-complete',queue);
 window.addEventListener('meucontrole:cloud-trace',e=>{if(e.detail?.type==='remote-event')setTimeout(queue,350)});
 window.addEventListener('meucontrole:remote-workspace-applied',queue);
 window.addEventListener('storage',e=>{if(e.key==='meu_controle_profiles_v2')queue()});
 document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(queue,60)));
 activatePublishedCalendar();
 window.MeuControleSpecialDatesV1={refresh:queue,list:all,open:showEditor};
 queue();
 }
 if(document.readyState==='complete')setTimeout(start,200);
 else window.addEventListener('load',()=>setTimeout(start,200),{once:true});
})();