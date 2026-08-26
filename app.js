// Meu Controle V2.0 — base limpa
const STORAGE_KEY='meu_controle_entries_v2';
const LEGACY_STORAGE_KEY='meu_controle_entries_v1';
const PROFILES_KEY='meu_controle_profiles_v2';
const LEGACY_PROFILES_KEY='meu_controle_profiles_v1';
const PROFILE_FILTER_KEY='meu_controle_profile_filter_v2';
const THEME_KEY='meu_controle_theme_v2';
const FONT_KEY='meu_controle_font_v2';
const LAST_BACKUP_KEY='meu_controle_last_backup_v2';
const AUTO_BACKUPS_KEY='meu_controle_auto_backups_v2';
const AUTO_BACKUP_LIMIT=10;
const BACKUP_SCHEMA='meu-controle-backup';
const BACKUP_VERSION=2;

const $=id=>document.getElementById(id);
const localDateISO=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dateOnly=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const fmtDate=s=>dateOnly(s).toLocaleDateString('pt-BR');
const fmtMoney=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#039;");

function loadEntries(){
  const raw=localStorage.getItem(STORAGE_KEY);
  if(raw) return JSON.parse(raw);
  const legacy=localStorage.getItem(LEGACY_STORAGE_KEY);
  if(legacy){
    const data=JSON.parse(legacy);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
    return data;
  }
  return [];
}
function loadProfiles(){
  const raw=localStorage.getItem(PROFILES_KEY);
  if(raw) return JSON.parse(raw);
  const legacy=localStorage.getItem(LEGACY_PROFILES_KEY);
  if(legacy){
    const data=JSON.parse(legacy);
    localStorage.setItem(PROFILES_KEY,JSON.stringify(data));
    return data;
  }
  return [
    {id:'pessoal',name:'Pessoal',locked:true},
    {id:'condominio',name:'Condomínio',locked:true},
    {id:'escolinha',name:'Escolinha',locked:true}
  ];
}

let entries=loadEntries();
let profiles=loadProfiles();
let activeProfile=localStorage.getItem(PROFILE_FILTER_KEY)||'all';
let currentFilter='all';
let globalQuery='';
let editingId=null;
let calendarYear=new Date().getFullYear();
let calendarMonth=new Date().getMonth();
let dashboardYear=new Date().getFullYear();
let dashboardMonth=new Date().getMonth();
let calendarQuery='';
let pendingRestore=null;


function loadAutoBackups(){
  try{return JSON.parse(localStorage.getItem(AUTO_BACKUPS_KEY)||'[]')}catch{return[]}
}
function createAutoBackup(reason='Alteração'){
  const snapshot={
    id:crypto.randomUUID(),
    createdAt:new Date().toISOString(),
    reason,
    entries:JSON.parse(JSON.stringify(entries)),
    profiles:JSON.parse(JSON.stringify(profiles)),
    preferences:{
      activeProfile,
      theme:localStorage.getItem(THEME_KEY)||'blue',
      font:localStorage.getItem(FONT_KEY)||'merriweather'
    }
  };
  const list=loadAutoBackups();
  list.unshift(snapshot);
  localStorage.setItem(AUTO_BACKUPS_KEY,JSON.stringify(list.slice(0,AUTO_BACKUP_LIMIT)));
  updateAutoBackupLabel();
}
function updateAutoBackupLabel(){
  const list=loadAutoBackups();
  const label=$('lastAutoBackupLabel');
  if(label)label.textContent=list.length?new Date(list[0].createdAt).toLocaleString('pt-BR'):'Ainda não realizada';
}
function renderAutoBackups(){
  const box=$('autoBackupList');box.innerHTML='';
  const list=loadAutoBackups();
  if(!list.length){box.innerHTML='<div class="empty">Nenhum backup automático ainda.</div>';return}
  list.forEach((b,i)=>{
    const row=document.createElement('div');row.className='auto-backup-row';
    row.innerHTML=`<div><strong>${new Date(b.createdAt).toLocaleString('pt-BR')}</strong><span>${esc(b.reason||'Alteração')} • ${b.entries.length} lançamento${b.entries.length===1?'':'s'} • ${b.profiles.length} perfil${b.profiles.length===1?'':'s'}</span></div><div class="auto-backup-row-actions"><button class="small secondary-action">Restaurar</button></div>`;
    row.querySelector('button').onclick=()=>restoreAutoBackup(b.id);
    box.appendChild(row);
  });
}
function restoreAutoBackup(id){
  const b=loadAutoBackups().find(x=>x.id===id);if(!b)return;
  if(!confirm(`Restaurar o estado de ${new Date(b.createdAt).toLocaleString('pt-BR')}?\n\nO estado atual será salvo automaticamente antes da restauração.`))return;
  createAutoBackup('Antes de restaurar backup automático');
  entries=JSON.parse(JSON.stringify(b.entries));
  profiles=JSON.parse(JSON.stringify(b.profiles));
  activeProfile=b.preferences?.activeProfile||'all';
  localStorage.setItem(PROFILE_FILTER_KEY,activeProfile);
  if(b.preferences?.theme)localStorage.setItem(THEME_KEY,b.preferences.theme);
  if(b.preferences?.font)localStorage.setItem(FONT_KEY,b.preferences.font);
  save();saveProfiles();applyAppearance();renderProfileSelectors();renderAll();updateAutoBackupLabel();
  $('autoBackupModal').classList.add('hidden');
  alert('Backup automático restaurado com sucesso.');
}

function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(entries))}
function saveProfiles(){localStorage.setItem(PROFILES_KEY,JSON.stringify(profiles))}
function migrateData(){
  let changed=false;
  for(const e of entries){
    if(!e.profile){e.profile='pessoal';changed=true}
    if(e.valuePending===undefined){e.valuePending=false;changed=true}
    if(e.useBusinessDay===undefined){e.useBusinessDay=false;changed=true}
  }
  if(changed) save();
}
function profileName(id){return profiles.find(p=>p.id===(id||'pessoal'))?.name||'Pessoal'}
function profileFiltered(list,profile=activeProfile){return profile==='all'?list:list.filter(e=>(e.profile||'pessoal')===profile)}
function daysFromToday(s){return Math.round((dateOnly(s)-dateOnly(localDateISO()))/86400000)}
function statusClass(e){if(e.done)return'done';const d=daysFromToday(e.date);if(d<0)return'late';if(d===0)return'today';return'future'}
function typeLabel(t){return({despesa:'Despesa',compromisso:'Compromisso',consulta:'Consulta',lembrete:'Lembrete'})[t]||t}
function recurrenceLabel(r){return({none:'Não repete',daily:'Diário',weekly:'Semanal',monthly:'Mensal',semiannual:'Semestral',yearly:'Anual'})[r]||r}
function monthName(i){return new Date(2020,i,1).toLocaleDateString('pt-BR',{month:'long'}).replace(/^./,c=>c.toUpperCase())}

function easterDate(year){
  const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3);
  const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
  const month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
  return new Date(year,month-1,day);
}
function dateToISO(d){return localDateISO(d)}
function holidayMapSP(year){
  const easter=easterDate(year),gf=new Date(easter),cc=new Date(easter);gf.setDate(gf.getDate()-2);cc.setDate(cc.getDate()+60);
  return new Map([
    [`${year}-01-01`,'Confraternização Universal'],[`${year}-01-25`,'Aniversário da Cidade de São Paulo'],[dateToISO(gf),'Paixão de Cristo'],
    [`${year}-04-21`,'Tiradentes'],[`${year}-05-01`,'Dia do Trabalho'],[dateToISO(cc),'Corpus Christi'],[`${year}-07-09`,'Data Magna do Estado de São Paulo'],
    [`${year}-09-07`,'Independência do Brasil'],[`${year}-10-12`,'Nossa Senhora Aparecida'],[`${year}-11-02`,'Finados'],[`${year}-11-15`,'Proclamação da República'],
    [`${year}-11-20`,'Dia Nacional de Zumbi e da Consciência Negra'],[`${year}-12-25`,'Natal']
  ]);
}
function nonBusinessReason(dateISO){
  if(!dateISO)return null;const d=dateOnly(dateISO);if(d.getDay()===0)return'domingo';if(d.getDay()===6)return'sábado';return holidayMapSP(d.getFullYear()).get(dateISO)||null;
}
function nextBusinessDay(dateISO){
  const reason=nonBusinessReason(dateISO);if(!reason)return{date:dateISO,changed:false,reason:null};
  const d=dateOnly(dateISO);do{d.setDate(d.getDate()+1)}while(nonBusinessReason(dateToISO(d)));return{date:dateToISO(d),changed:true,reason};
}
function businessDayLabel(e){
  if(!e?.useBusinessDay||!e.date)return'';const r=nextBusinessDay(e.date);if(!r.changed)return'';
  return`Próx. dia útil: ${fmtDate(r.date)} — ${dateOnly(r.date).toLocaleDateString('pt-BR',{weekday:'long'})}`;
}
function businessDayPrintLabel(e){
  if(!e?.useBusinessDay||!e.date)return'';const r=nextBusinessDay(e.date);return r.changed?`Próx. útil: ${fmtDate(r.date)}`:'';
}
function updateBusinessDayInfo(){
  const box=$('businessDayInfo');
  if(!$('useBusinessDay').checked||!$('date').value){box.classList.add('hidden');box.innerHTML='';return}
  const r=nextBusinessDay($('date').value);
  box.innerHTML=r.changed?`Vencimento em <strong>${r.reason}</strong>. Próximo dia útil: <strong>${fmtDate(r.date)} — ${dateOnly(r.date).toLocaleDateString('pt-BR',{weekday:'long'})}</strong>.`:'A data informada já cai em dia útil.';
  box.classList.remove('hidden');
}

function searchableText(e){
  return [e.description,e.category,typeLabel(e.type),profileName(e.profile),e.date,fmtDate(e.date),e.time,e.notes,e.value,fmtMoney(e.value),recurrenceLabel(e.recurrence),e.important?'importante estrela':'',e.valuePending?'valor a definir':'',businessDayLabel(e),e.done?'concluído pago':'pendente'].join(' ').toLowerCase();
}
function renderProfileSelectors(){
  const opts=profiles.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
  $('profileFilter').innerHTML=`<option value="all">Todos</option>${opts}`;
  $('profile').innerHTML=opts;
  $('printProfileFilter').innerHTML=`<option value="all">Todos</option>${opts}`;
  if(activeProfile!=='all'&&!profiles.some(p=>p.id===activeProfile))activeProfile='all';
  $('profileFilter').value=activeProfile;
  $('printProfileFilter').value=activeProfile;
  if(!editingId)$('profile').value=activeProfile==='all'?'pessoal':activeProfile;
}
function renderProfilesList(){
  const box=$('profilesList');box.innerHTML='';
  profiles.forEach(p=>{
    const count=entries.filter(e=>(e.profile||'pessoal')===p.id).length;
    const row=document.createElement('div');row.className='profile-row';
    row.innerHTML=`<div class="profile-row-main"><strong>${esc(p.name)}</strong><span>${count} lançamento${count===1?'':'s'}${p.locked?' • perfil padrão':''}</span></div>`;
    if(!p.locked){
      const del=document.createElement('button');del.className='danger small';del.textContent='Excluir';
      del.onclick=()=>{if(count){alert('Este perfil possui lançamentos.');return}createAutoBackup('Antes de excluir perfil');profiles=profiles.filter(x=>x.id!==p.id);saveProfiles();renderProfileSelectors();renderProfilesList()};
      row.appendChild(del);
    }
    box.appendChild(row);
  });
}

function createItemNode(e,context='list'){
  const node=$('itemTemplate').content.cloneNode(true),article=node.querySelector('.item');
  article.classList.add(statusClass(e));if(e.important)article.classList.add('important-item');
  node.querySelector('.item-title').textContent=e.description;
  node.querySelector('.badge').textContent=typeLabel(e.type);
  const meta=[fmtDate(e.date)];if(e.time)meta.push(e.time);meta.push(profileName(e.profile));if(e.category)meta.push(e.category);if(e.recurrence&&e.recurrence!=='none')meta.push(recurrenceLabel(e.recurrence));const bd=businessDayLabel(e);if(bd)meta.push(bd);
  node.querySelector('.meta').textContent=meta.join(' • ');
  node.querySelector('.notes').textContent=e.notes||'';
  node.querySelector('.amount').textContent=e.type==='despesa'?(e.valuePending?'Valor a definir':fmtMoney(e.value)):'';
  node.querySelector('.editBtn').onclick=()=>{startEdit(e.id);showPage('launches')};
  const done=node.querySelector('.doneBtn');done.textContent=e.done?'Reabrir':'Concluir';done.onclick=()=>toggleDone(e.id);
  node.querySelector('.deleteBtn').onclick=()=>removeEntry(e.id);
  return node;
}

function renderSummary(){
  const active=profileFiltered(entries).filter(e=>!e.done);
  $('countToday').textContent=active.filter(e=>daysFromToday(e.date)===0).length;
  $('countNext').textContent=active.filter(e=>{const d=daysFromToday(e.date);return d>=0&&d<=7}).length;
  $('countLate').textContent=active.filter(e=>daysFromToday(e.date)<0).length;
  $('countImportant').textContent=active.filter(e=>e.important).length;
  $('sumPending').textContent=fmtMoney(active.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0));
}
function renderList(){
  const q=globalQuery.trim().toLowerCase();
  const filtered=profileFiltered(entries).slice().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''))).filter(e=>{
    const d=daysFromToday(e.date);let pass=true;
    if(currentFilter==='today')pass=!e.done&&d===0;else if(currentFilter==='next')pass=!e.done&&d>=0&&d<=7;else if(currentFilter==='late')pass=!e.done&&d<0;else if(currentFilter==='done')pass=e.done;
    return pass&&(!q||searchableText(e).includes(q));
  });
  const box=$('list');box.innerHTML='';$('emptyState').classList.toggle('hidden',filtered.length>0);$('emptyState').textContent=q?'Nenhum lançamento encontrado.':'Nenhum lançamento ainda.';
  filtered.forEach(e=>box.appendChild(createItemNode(e)));
}

function dashboardMonthEntries(){
  return profileFiltered(entries).filter(e=>{
    const [y,m]=e.date.split('-').map(Number);
    return y===dashboardYear && m===dashboardMonth+1;
  });
}
function renderDashboard(){
  const allProfile=profileFiltered(entries);
  const active=allProfile.filter(e=>!e.done);
  const monthEntries=dashboardMonthEntries();
  const monthActive=monthEntries.filter(e=>!e.done);

  const today=active.filter(e=>daysFromToday(e.date)===0);
  const monthPending=monthActive.length;
  const monthImportant=monthActive.filter(e=>e.important);
  const totalImportant=active.filter(e=>e.important);
  const monthExpenses=monthActive.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0);
  const totalExpenses=active.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0);
  const late=active.filter(e=>daysFromToday(e.date)<0);
  const lateExpenses=late.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0);

  $('dashMonthLabel').textContent=`${monthName(dashboardMonth)} ${dashboardYear}`;
  $('dashTodayMain').textContent=today.length;
  $('dashTodaySub').textContent=today.length===1?'1 item previsto':`${today.length} itens previstos`;

  $('dashMonthMain').textContent=monthEntries.length;
  $('dashMonthSub').textContent=`${monthPending} pendente${monthPending===1?'':'s'}`;

  $('dashImportantMain').textContent=monthImportant.length;
  $('dashImportantSub').textContent=`${totalImportant.length} no total`;

  $('dashExpensesMain').textContent=fmtMoney(monthExpenses);
  $('dashExpensesSub').textContent=`${fmtMoney(totalExpenses)} total pendente`;

  $('dashLateMain').textContent=late.length;
  $('dashLateSub').textContent=fmtMoney(lateExpenses);
}

function dashboardDetailData(kind){
  const active=profileFiltered(entries).filter(e=>!e.done);
  if(kind==='today'){
    return {
      title:'Hoje',
      subtitle:new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}),
      items:active.filter(e=>daysFromToday(e.date)===0)
    };
  }
  if(kind==='month'){
    const items=dashboardMonthEntries().filter(e=>!e.done);
    return {
      title:`Previstos — ${monthName(dashboardMonth)} ${dashboardYear}`,
      subtitle:`${items.length} pendente${items.length===1?'':'s'} no mês`,
      items
    };
  }
  if(kind==='important'){
    const items=dashboardMonthEntries().filter(e=>!e.done&&e.important);
    return {
      title:`★ Importantes — ${monthName(dashboardMonth)} ${dashboardYear}`,
      subtitle:`${active.filter(e=>e.important).length} importantes pendentes no total`,
      items
    };
  }
  if(kind==='expenses'){
    const items=dashboardMonthEntries().filter(e=>!e.done&&e.type==='despesa');
    return {
      title:`Despesas — ${monthName(dashboardMonth)} ${dashboardYear}`,
      subtitle:`${fmtMoney(items.reduce((s,e)=>s+Number(e.value||0),0))} no mês`,
      items
    };
  }
  const items=active.filter(e=>daysFromToday(e.date)<0);
  return {
    title:'⚠ Vencidos',
    subtitle:`${items.length} pendência${items.length===1?'':'s'} vencida${items.length===1?'':'s'}`,
    items
  };
}

function openDashboardDetail(kind){
  const data=dashboardDetailData(kind);
  $('dashboardDetailTitle').textContent=data.title;
  $('dashboardDetailSubtitle').textContent=data.subtitle;
  const box=$('dashboardDetailList'); box.innerHTML='';

  const items=data.items.slice().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
  if(!items.length){
    box.innerHTML='<div class="empty">Nada por aqui.</div>';
  }else{
    items.forEach(e=>{
      const row=document.createElement('div');
      row.className='dashboard-detail-row'+(e.important?' important-row':'');
      const extra=[fmtDate(e.date),e.time||'',profileName(e.profile),e.category||'',e.type==='despesa'?(e.valuePending?'Valor a definir':fmtMoney(e.value)):'',businessDayLabel(e)].filter(Boolean).join(' • ');
      row.innerHTML=`<div class="dashboard-detail-main"><strong>${e.important?'★ ':''}${esc(e.description)}</strong><span>${esc(extra)}</span></div><div class="dashboard-detail-actions"><button class="small secondary-action">Editar</button><button class="small">Concluir</button></div>`;
      const buttons=row.querySelectorAll('button');
      buttons[0].onclick=()=>{$('dashboardDetailModal').classList.add('hidden');startEdit(e.id);showPage('launches')};
      buttons[1].onclick=()=>{toggleDone(e.id);openDashboardDetail(kind)};
      box.appendChild(row);
    });
  }
  $('dashboardDetailModal').classList.remove('hidden');
}

function calendarEntries(){return profileFiltered(entries).filter(e=>{const [y,m]=e.date.split('-').map(Number);return y===calendarYear&&m===calendarMonth+1})}
function renderCalendar(){
  $('calendarYearLabel').textContent=calendarYear;
  const months=$('calendarMonths');months.innerHTML='';
  for(let m=0;m<12;m++){
    const count=profileFiltered(entries).filter(e=>{const [y,mm]=e.date.split('-').map(Number);return y===calendarYear&&mm===m+1}).length;
    const btn=document.createElement('button');btn.className='calendar-month-btn'+(m===calendarMonth?' active':'');btn.innerHTML=`<span>${monthName(m)}</span><span class="month-badge">${count}</span>`;
    btn.onclick=()=>{calendarMonth=m;renderCalendar()};months.appendChild(btn);
  }
  const all=calendarEntries().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''))),q=calendarQuery.trim().toLowerCase(),filtered=q?all.filter(e=>searchableText(e).includes(q)):all;
  $('calendarMonthTitle').textContent=`${monthName(calendarMonth)} ${calendarYear}`;
  $('calendarMonthSummary').textContent=`${all.length} lançamento${all.length===1?'':'s'} • ${all.filter(e=>!e.done).length} pendente${all.filter(e=>!e.done).length===1?'':'s'} • ${fmtMoney(all.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0))} em despesas`;
  const list=$('calendarEventsList');list.innerHTML='';$('calendarEmpty').classList.toggle('hidden',filtered.length>0);$('calendarEmpty').textContent=q?'Nenhum lançamento encontrado.':'Nenhum lançamento neste mês.';filtered.forEach(e=>list.appendChild(createItemNode(e,'calendar')));
}
function renderAll(){renderSummary();renderDashboard();renderList();renderCalendar();renderProfilesList()}

function updateRecurrenceUI(){
  const recurring=$('recurrence').value!=='none';$('recurrenceOptions').classList.toggle('hidden',!recurring);
  if(recurring&&!$('repeatUntil').value){const d=new Date();d.setFullYear(d.getFullYear()+1);$('repeatUntil').value=localDateISO(d)}
}
function daysInMonth(y,m){return new Date(y,m,0).getDate()}
function nextRecurrenceDate(dateISO,recurrence,anchorDay){
  const [y,m,d]=dateISO.split('-').map(Number);
  if(recurrence==='daily'||recurrence==='weekly'){const x=new Date(y,m-1,d);x.setDate(x.getDate()+(recurrence==='daily'?1:7));return localDateISO(x)}
  const add=recurrence==='monthly'?1:recurrence==='semiannual'?6:recurrence==='yearly'?12:0;if(!add)return null;
  const total=y*12+(m-1)+add,ny=Math.floor(total/12),nm=(total%12)+1,nd=Math.min(anchorDay,daysInMonth(ny,nm));return`${ny}-${String(nm).padStart(2,'0')}-${String(nd).padStart(2,'0')}`;
}
function generateRecurringEntries(first,until,mode){
  const arr=[first];if(!until||first.recurrence==='none')return arr;const anchor=Number(first.date.split('-')[2]);let cursor=first.date,guard=0;
  while(guard++<1000){const next=nextRecurrenceDate(cursor,first.recurrence,anchor);if(!next||next>until)break;const f={...first,id:crypto.randomUUID(),date:next,done:false,doneAt:null};if(first.type==='despesa'&&mode==='variable'){f.value=0;f.valuePending=true}arr.push(f);cursor=next}
  return arr;
}
function resetForm(){
  editingId=null;$('entryForm').reset();$('date').value=localDateISO();$('profile').value=activeProfile==='all'?'pessoal':activeProfile;$('saveBtn').textContent='Salvar lançamento';$('cancelEditBtn').classList.add('hidden');$('formPanel').classList.remove('editing');$('repeatUntil').value='';$('recurringValueMode').value='fixed';updateRecurrenceUI();updateBusinessDayInfo();
}
function startEdit(id){
  const e=entries.find(x=>x.id===id);if(!e)return;editingId=id;
  $('profile').value=e.profile||'pessoal';$('type').value=e.type;$('category').value=e.category||'';$('value').value=e.valuePending?'':(e.value||'');$('description').value=e.description;$('date').value=e.date;$('time').value=e.time||'';$('useBusinessDay').checked=!!e.useBusinessDay;$('recurrence').value=e.recurrence||'none';$('remind').value=String(e.remind??0);$('important').checked=!!e.important;$('notes').value=e.notes||'';updateRecurrenceUI();updateBusinessDayInfo();$('saveBtn').textContent='Salvar alterações';$('cancelEditBtn').classList.remove('hidden');$('formPanel').classList.add('editing');
}
function toggleDone(id){const e=entries.find(x=>x.id===id);if(!e)return;createAutoBackup(e.done?'Antes de reabrir lançamento':'Antes de concluir lançamento');e.done=!e.done;e.doneAt=e.done?new Date().toISOString():null;save();renderAll()}
function removeEntry(id){if(!confirm('Excluir este lançamento?'))return;createAutoBackup('Antes de excluir lançamento');entries=entries.filter(e=>e.id!==id);save();renderAll()}


function applyAppearance(){
  const theme=localStorage.getItem(THEME_KEY)||'blue';
  const font=localStorage.getItem(FONT_KEY)||'merriweather';
  document.body.classList.remove('theme-blue','theme-green','theme-graphite','font-merriweather');
  document.body.classList.add(`theme-${theme}`);
  if(font==='merriweather')document.body.classList.add('font-merriweather');
  document.querySelectorAll('[data-theme]').forEach(b=>b.classList.toggle('active',b.dataset.theme===theme));
  document.querySelectorAll('[data-font]').forEach(b=>b.classList.toggle('active',b.dataset.font===font));
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute('content',getComputedStyle(document.body).getPropertyValue('--primary').trim()||'#164f78');
}
function setTheme(theme){localStorage.setItem(THEME_KEY,theme);applyAppearance()}
function setFont(font){localStorage.setItem(FONT_KEY,font);applyAppearance()}

function showPage(page){
  ['dashboard','launches','calendar','settings'].forEach(p=>$(p+'Page').classList.toggle('hidden',p!==page));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  if(page==='settings')updateLastBackupLabel();
}
function renderImportantModal(){
  const items=profileFiltered(entries).filter(e=>!e.done&&e.important).sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||''))),box=$('importantList');box.innerHTML='';
  if(!items.length){box.innerHTML='<div class="empty">Nenhum item importante pendente.</div>';return}
  items.forEach(e=>{const row=document.createElement('div');row.className='important-row';row.innerHTML=`<div class="important-row-main"><strong>★ ${esc(e.description)}</strong><span>${fmtDate(e.date)} • ${esc(profileName(e.profile))}${e.time?' • '+esc(e.time):''}</span></div><div class="important-row-actions"><button class="small secondary-action">Editar</button><button class="small">Concluir</button></div>`;const bs=row.querySelectorAll('button');bs[0].onclick=()=>{$('importantModal').classList.add('hidden');startEdit(e.id);showPage('launches')};bs[1].onclick=()=>{toggleDone(e.id);renderImportantModal()};box.appendChild(row)});
}

function printEntries(mode){
  const selectedProfile=$('printProfileFilter').value||'all',source=profileFiltered(entries,selectedProfile);
  const selectByMode=list=>{
    if(mode==='today')return{selected:list.filter(e=>!e.done&&daysFromToday(e.date)===0),label:'Hoje'};
    if(mode==='week')return{selected:list.filter(e=>!e.done&&daysFromToday(e.date)>=0&&daysFromToday(e.date)<=7),label:'Próximos 7 dias'};
    if(mode==='month'){const n=new Date();return{selected:list.filter(e=>{const[y,m]=e.date.split('-').map(Number);return y===n.getFullYear()&&m===n.getMonth()+1}),label:`${monthName(n.getMonth())} ${n.getFullYear()}`}}
    return{selected:list.filter(e=>!e.done),label:'Todos os pendentes'};
  };
  const rowHTML=e=>`<tr><td>${e.important?'★':''}</td><td><span class="date-main">${fmtDate(e.date)}</span>${businessDayPrintLabel(e)?`<span class="business-print">${esc(businessDayPrintLabel(e))}</span>`:''}</td><td>${esc(e.time||'')}</td><td>${esc(e.description)}</td><td>${esc(e.category||'')}</td><td>${esc(typeLabel(e.type))}</td><td class="money">${e.type==='despesa'?(e.valuePending?'Valor a definir':(e.value?fmtMoney(e.value):'')):''}</td></tr>`;
  const tableHTML=items=>items.length?`<table><thead><tr><th>★</th><th>Data</th><th>Hora</th><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Valor</th></tr></thead><tbody>${items.map(rowHTML).join('')}</tbody></table>`:'<p>Nenhum lançamento.</p>';
  const groupedByMonth=items=>{const g={};items.forEach(e=>{const[y,m]=e.date.split('-').map(Number),k=`${y}-${String(m).padStart(2,'0')}`;(g[k]??=[]).push(e)});return Object.keys(g).sort().map(k=>{const[y,m]=k.split('-').map(Number),arr=g[k],sub=arr.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0);return`<section class="month-block"><h3>${monthName(m-1)} ${y}</h3>${tableHTML(arr)}<div class="subtotal">Subtotal de despesas: ${fmtMoney(sub)}</div></section>`}).join('')};
  let content='',title='';const modeLabel=selectByMode(source).label;
  if(selectedProfile==='all'){
    title=`Todos os perfis — ${modeLabel}`;content=profiles.map((p,i)=>{const arr=selectByMode(source.filter(e=>(e.profile||'pessoal')===p.id)).selected;if(!arr.length)return'';const sub=arr.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0);return`<section class="profile-block tone-${i%4}"><div class="profile-heading"><strong>${esc(p.name)}</strong><span>${arr.length} lançamento${arr.length===1?'':'s'}</span></div>${mode==='pending'?groupedByMonth(arr):tableHTML(arr)}<div class="profile-total">Total de despesas do perfil: ${fmtMoney(sub)}</div></section>`}).join('')||'<p>Nenhum lançamento.</p>';
  }else{const{selected,label}=selectByMode(source);title=`${label} — ${profileName(selectedProfile)}`;content=mode==='pending'?groupedByMonth(selected):tableHTML(selected)}
  const total=selectByMode(source).selected.filter(e=>e.type==='despesa').reduce((s,e)=>s+Number(e.value||0),0),w=window.open('','_blank','width=1050,height=760');if(!w){alert('Permita pop-ups para imprimir.');return}
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:Arial,sans-serif;margin:30px;color:#222}h1{font-size:22px}h3{font-size:15px;margin:20px 0 7px;border-bottom:1px solid #555}table{width:100%;border-collapse:collapse;font-size:11px;table-layout:fixed}th,td{padding:7px 5px;border-bottom:1px solid #ddd;text-align:left;vertical-align:top}th{background:#f0f1f0}th:nth-child(1),td:nth-child(1){width:4%}th:nth-child(2),td:nth-child(2){width:18%}th:nth-child(3),td:nth-child(3){width:10%}th:nth-child(4),td:nth-child(4){width:26%}th:nth-child(5),td:nth-child(5){width:16%}th:nth-child(6),td:nth-child(6){width:12%}th:nth-child(7),td:nth-child(7){width:14%}.money{text-align:right}.date-main{display:block}.business-print{display:block;margin-top:2px;font-size:9px;color:#666}.profile-heading{display:flex;justify-content:space-between;padding:9px 11px;border-radius:6px;margin:12px 0 10px}.tone-0 .profile-heading{background:#dcefe5;border-left:5px solid #3b7c59}.tone-1 .profile-heading{background:#e6edf5;border-left:5px solid #5d7897}.tone-2 .profile-heading{background:#f3ead8;border-left:5px solid #9a7a3f}.tone-3 .profile-heading{background:#eee4f2;border-left:5px solid #80628a}.subtotal,.profile-total{text-align:right;font-weight:bold;margin-top:7px}.profile-total{padding-top:8px;border-top:1px solid #aaa}.final-total{margin-top:22px;padding-top:10px;border-top:2px solid #222;text-align:right;font-weight:bold}@media print{.profile-heading{-webkit-print-color-adjust:exact;print-color-adjust:exact}.month-block{break-inside:avoid}}</style></head><body><h1>Meu Controle — ${esc(title)}</h1><p>Gerado em ${new Date().toLocaleString('pt-BR')}</p>${content}<div class="final-total">Total geral de despesas: ${fmtMoney(total)}</div><script>window.onload=()=>window.print();<\/script></body></html>`);w.document.close();$('printModal').classList.add('hidden');
}

function updateLastBackupLabel(){const raw=localStorage.getItem(LAST_BACKUP_KEY);$('lastBackupLabel').textContent=raw?new Date(raw).toLocaleString('pt-BR'):'Ainda não realizado'}
function exportBackup(){
  const payload={schema:BACKUP_SCHEMA,version:BACKUP_VERSION,appVersion:'2.0',exportedAt:new Date().toISOString(),data:{entries,profiles,preferences:{activeProfile,theme:localStorage.getItem(THEME_KEY)||'blue',font:localStorage.getItem(FONT_KEY)||'merriweather'}}};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`Meu_Controle_Backup_${localDateISO()}_${String(new Date().getHours()).padStart(2,'0')}-${String(new Date().getMinutes()).padStart(2,'0')}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);localStorage.setItem(LAST_BACKUP_KEY,new Date().toISOString());updateLastBackupLabel();
}
function openRestorePreview(obj){
  if(!obj||obj.schema!==BACKUP_SCHEMA||!obj.data||!Array.isArray(obj.data.entries)||!Array.isArray(obj.data.profiles))throw new Error('Arquivo de backup inválido.');
  pendingRestore=obj;const d=obj.exportedAt?new Date(obj.exportedAt):null;$('restoreSummary').innerHTML=`<div class="restore-stat"><span>Backup criado em</span><strong>${d&&!isNaN(d)?d.toLocaleString('pt-BR'):'Não informado'}</strong></div><div class="restore-stat"><span>Versão</span><strong>${esc(obj.appVersion||'Não informada')}</strong></div><div class="restore-stat"><span>Perfis</span><strong>${obj.data.profiles.length}</strong></div><div class="restore-stat"><span>Lançamentos</span><strong>${obj.data.entries.length}</strong></div>`;$('restoreModal').classList.remove('hidden');
}
function applyRestore(){
  if(!pendingRestore)return;createAutoBackup('Antes de restaurar backup externo');entries=JSON.parse(JSON.stringify(pendingRestore.data.entries));profiles=JSON.parse(JSON.stringify(pendingRestore.data.profiles));activeProfile=pendingRestore.data.preferences?.activeProfile||'all';save();saveProfiles();localStorage.setItem(PROFILE_FILTER_KEY,activeProfile);if(pendingRestore.data.preferences?.theme)localStorage.setItem(THEME_KEY,pendingRestore.data.preferences.theme);if(pendingRestore.data.preferences?.font)localStorage.setItem(FONT_KEY,pendingRestore.data.preferences.font);applyAppearance();pendingRestore=null;$('restoreModal').classList.add('hidden');renderProfileSelectors();renderAll();alert('Backup restaurado com sucesso.');
}

$('entryForm').addEventListener('submit',ev=>{
  ev.preventDefault();createAutoBackup(editingId?'Antes de editar lançamento':'Antes de novo lançamento');const data={profile:$('profile').value,type:$('type').value,category:$('category').value,value:Number($('value').value||0),description:$('description').value.trim(),date:$('date').value,time:$('time').value,useBusinessDay:$('useBusinessDay').checked,recurrence:$('recurrence').value,remind:Number($('remind').value),important:$('important').checked,notes:$('notes').value.trim(),valuePending:false};
  if(editingId){const e=entries.find(x=>x.id===editingId);if(e){Object.assign(e,data);e.valuePending=false}}else{const first={id:crypto.randomUUID(),...data,done:false,doneAt:null,seriesId:data.recurrence!=='none'?crypto.randomUUID():null};entries.push(...generateRecurringEntries(first,$('repeatUntil').value,$('recurringValueMode').value))}
  save();resetForm();renderAll();checkNotifications();
});
$('clearBtn').onclick=resetForm;$('cancelEditBtn').onclick=resetForm;$('recurrence').onchange=updateRecurrenceUI;$('date').onchange=updateBusinessDayInfo;$('useBusinessDay').onchange=updateBusinessDayInfo;
$('globalSearch').oninput=e=>{globalQuery=e.target.value;renderList()};document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentFilter=b.dataset.filter;renderList()});
document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$('profileFilter').onchange=()=>{activeProfile=$('profileFilter').value;localStorage.setItem(PROFILE_FILTER_KEY,activeProfile);$('printProfileFilter').value=activeProfile;if(!editingId)$('profile').value=activeProfile==='all'?'pessoal':activeProfile;renderAll()};
document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{showPage('launches');document.querySelector(`.tab[data-filter="${b.dataset.jump}"]`).click()});
$('importantStat').onclick=()=>{renderImportantModal();$('importantModal').classList.remove('hidden')};$('closeImportantModal').onclick=()=>$('importantModal').classList.add('hidden');
$('calendarPrevYear').onclick=()=>{calendarYear--;renderCalendar()};$('calendarNextYear').onclick=()=>{calendarYear++;renderCalendar()};$('calendarSearch').oninput=e=>{calendarQuery=e.target.value;renderCalendar()};
$('dashPrevMonth').onclick=()=>{
  dashboardMonth--;
  if(dashboardMonth<0){dashboardMonth=11;dashboardYear--}
  renderDashboard();
};
$('dashNextMonth').onclick=()=>{
  dashboardMonth++;
  if(dashboardMonth>11){dashboardMonth=0;dashboardYear++}
  renderDashboard();
};
document.querySelectorAll('[data-dash]').forEach(card=>card.onclick=()=>openDashboardDetail(card.dataset.dash));
$('closeDashboardDetail').onclick=()=>$('dashboardDetailModal').classList.add('hidden');
$('dashboardDetailModal').addEventListener('click',e=>{if(e.target===$('dashboardDetailModal'))$('dashboardDetailModal').classList.add('hidden')});

$('printBtn').onclick=()=>{$('printProfileFilter').value=activeProfile;$('printModal').classList.remove('hidden')};$('closePrintModal').onclick=()=>$('printModal').classList.add('hidden');document.querySelectorAll('.print-choice').forEach(b=>b.onclick=()=>printEntries(b.dataset.print));
$('addProfileBtn').onclick=()=>{const name=$('newProfileName').value.trim();if(!name)return;if(profiles.some(p=>p.name.toLowerCase()===name.toLowerCase())){alert('Já existe um perfil com esse nome.');return}createAutoBackup('Antes de adicionar perfil');profiles.push({id:'perfil_'+crypto.randomUUID(),name,locked:false});saveProfiles();$('newProfileName').value='';renderProfileSelectors();renderProfilesList()};
$('viewAutoBackupsBtn').onclick=()=>{renderAutoBackups();$('autoBackupModal').classList.remove('hidden')};
$('closeAutoBackupModal').onclick=()=>$('autoBackupModal').classList.add('hidden');
$('autoBackupModal').addEventListener('click',e=>{if(e.target===$('autoBackupModal'))$('autoBackupModal').classList.add('hidden')});
$('exportBackupBtn').onclick=exportBackup;$('importBackupBtn').onclick=()=>$('backupFileInput').click();$('backupFileInput').onchange=async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{openRestorePreview(JSON.parse(await file.text()))}catch(err){alert(err.message||'Não foi possível ler o backup.')}};$('closeRestoreModal').onclick=()=>{pendingRestore=null;$('restoreModal').classList.add('hidden')};$('confirmRestoreBtn').onclick=applyRestore;


document.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>setTheme(b.dataset.theme));
document.querySelectorAll('[data-font]').forEach(b=>b.onclick=()=>setFont(b.dataset.font));
$('resetAppearanceBtn').onclick=()=>{
  localStorage.setItem(THEME_KEY,'blue');
  localStorage.setItem(FONT_KEY,'merriweather');
  applyAppearance();
};


// ---------- Instalação PWA ----------
let deferredInstallPrompt=null;
function isStandalone(){
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
}
function updateInstallUI(){
  const btn=$('installAppBtn'),title=$('installStatusTitle'),text=$('installStatusText');
  if(!btn||!title||!text)return;
  if(isStandalone()){
    title.textContent='Meu Controle instalado ✓';
    text.textContent='Você já está usando o app em modo instalado.';
    btn.textContent='Aplicativo instalado';
    btn.disabled=true;
  }else if(deferredInstallPrompt){
    title.textContent='Pronto para instalar';
    text.textContent='A instalação cria um atalho e abre o Meu Controle em janela própria.';
    btn.textContent='Instalar Meu Controle';
    btn.disabled=false;
  }else{
    title.textContent='Instalação disponível via navegador';
    text.textContent='Em HTTPS, use o ícone de instalação do Edge/Chrome caso o botão ainda não esteja habilitado.';
    btn.textContent='Aguardando navegador';
    btn.disabled=true;
  }
}
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredInstallPrompt=e;
  updateInstallUI();
});
window.addEventListener('appinstalled',()=>{
  deferredInstallPrompt=null;
  updateInstallUI();
});
$('installAppBtn').onclick=async()=>{
  if(!deferredInstallPrompt)return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt=null;
  updateInstallUI();
};

// splitter
const workspace=$('workspace'),splitter=$('splitter');let dragging=false;function applySplit(p){p=Math.min(65,Math.max(30,p));workspace.style.gridTemplateColumns=`minmax(360px,${p}%) 10px minmax(460px,${100-p}%)`;localStorage.setItem('meu_controle_split_v2',String(p))}applySplit(Number(localStorage.getItem('meu_controle_split_v2')||44));splitter.onpointerdown=e=>{if(innerWidth<=1100)return;dragging=true;splitter.classList.add('dragging');splitter.setPointerCapture(e.pointerId)};splitter.onpointermove=e=>{if(!dragging)return;const r=workspace.getBoundingClientRect();applySplit((e.clientX-r.left)/r.width*100)};splitter.onpointerup=()=>{dragging=false;splitter.classList.remove('dragging')};

// notifications
async function requestNotifications(){if(!('Notification'in window)){alert('Este navegador não oferece notificações.');return}await Notification.requestPermission();updateNotifyButton();checkNotifications(true)}
function updateNotifyButton(){if('Notification'in window)$('notifyBtn').textContent=Notification.permission==='granted'?'Notificações ativas':'Ativar notificações'}
function checkNotifications(force=false){if(!('Notification'in window)||Notification.permission!=='granted')return;const today=localDateISO(),sent=JSON.parse(localStorage.getItem('meu_controle_sent_v2')||'{}');entries.filter(e=>!e.done).forEach(e=>{const d=daysFromToday(e.date),should=d===e.remind||d===0,key=`${today}:${e.id}:${d}`;if(should&&(force||!sent[key])){let body=e.description;if(e.type==='despesa')body+=` — ${e.valuePending?'Valor a definir':fmtMoney(e.value)}`;if(e.time)body+=` — ${e.time}`;new Notification(d===0?'Hoje':'Lembrete',{body});sent[key]=true}});localStorage.setItem('meu_controle_sent_v2',JSON.stringify(sent))}
$('notifyBtn').onclick=requestNotifications;

migrateData();
applyAppearance();
renderProfileSelectors();
$('todayLabel').textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
$('date').value=localDateISO();
updateRecurrenceUI();updateBusinessDayInfo();updateNotifyButton();renderAll();showPage('dashboard');updateLastBackupLabel();updateAutoBackupLabel();updateInstallUI();checkNotifications();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
setInterval(checkNotifications,60000);
