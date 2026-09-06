/* MeuControle — V0.37: onboarding inicial, ajuda contextual e estados vazios */
(function(){
  if(window.__meuControleOnboardingV037Loaded)return;
  window.__meuControleOnboardingV037Loaded=true;
  const VERSION='0.37';
  const TOUR_KEY='meu_controle_onboarding_v037_done';
  const HINT_KEY='meu_controle_launch_hint_v037_seen';
  const isMobile=()=>matchMedia('(max-width:700px)').matches;
  const $=s=>document.querySelector(s);

  function installStyles(){
    if($('#onboardingHelpV037Style'))return;
    const st=document.createElement('style');st.id='onboardingHelpV037Style';st.textContent=`
      .mc-tour-v037{position:fixed;inset:0;z-index:100700;background:rgba(13,27,36,.62);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px}
      .mc-tour-card-v037{width:min(520px,100%);background:#fff;border-radius:22px;padding:24px;box-shadow:0 28px 80px rgba(0,0,0,.3);color:#1e2d35}
      .mc-tour-top-v037{display:flex;align-items:center;justify-content:space-between;gap:14px}
      .mc-tour-mark-v037{width:52px;height:52px;border-radius:16px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900}
      .mc-tour-skip-v037{background:transparent!important;color:#718078!important;padding:7px 5px!important;font-size:12px!important}
      .mc-tour-card-v037 h2{margin:18px 0 7px;font-size:25px}.mc-tour-card-v037 p{margin:0;color:#647269;font-size:14px;line-height:1.55}
      .mc-tour-dots-v037{display:flex;gap:7px;margin:19px 0 17px}.mc-tour-dot-v037{width:7px;height:7px;border-radius:99px;background:#d7ded9}.mc-tour-dot-v037.active{width:22px;background:var(--primary)}
      .mc-tour-actions-v037{display:flex;gap:9px;justify-content:flex-end}.mc-tour-actions-v037 button{min-height:44px}.mc-tour-prev-v037{background:#eef3f0!important;color:#53635a!important}
      .mc-help-card-v037 details{border-top:1px solid #e6ece8;padding:11px 0}.mc-help-card-v037 details:first-of-type{margin-top:8px}.mc-help-card-v037 summary{cursor:pointer;font-weight:800;font-size:14px;color:#2d4035}.mc-help-card-v037 details p{margin:7px 0 0!important;font-size:12px!important;line-height:1.55!important;color:#68776f!important}.mc-help-actions-v037{display:grid;grid-template-columns:1fr;gap:8px;margin-top:14px}
      .mc-launch-hint-v037{margin:0 0 10px;padding:9px 11px;border:1px solid rgba(var(--primary-rgb),.15);border-radius:10px;background:rgba(var(--primary-rgb),.05);font-size:11px;line-height:1.4;color:#607068;display:flex;align-items:center;justify-content:space-between;gap:10px}.mc-launch-hint-v037 button{background:transparent!important;color:#7f8b84!important;padding:2px 4px!important;font-size:13px!important}
      .mc-empty-action-v037{display:none;width:max-content;margin:10px auto 0;min-height:42px;padding:9px 14px}.mc-empty-action-v037.show{display:block}
      @media(max-width:700px){.mc-tour-v037{align-items:flex-end;padding:14px}.mc-tour-card-v037{border-radius:22px 22px 16px 16px;padding:21px 18px}.mc-tour-card-v037 h2{font-size:22px}.mc-tour-actions-v037{display:grid;grid-template-columns:1fr 1fr}.mc-tour-actions-v037 .mc-tour-next-v037:only-child{grid-column:1/-1}.mc-launch-hint-v037{margin-bottom:11px}.mc-help-card-v037{padding-top:16px!important}}
    `;document.head.appendChild(st);
  }

  const steps=[
    {icon:'＋',title:'Comece pelos lançamentos',text:'Cadastre despesas, compromissos, consultas e lembretes. O MeuControle organiza datas, vencimentos e recorrências para você.'},
    {icon:'✓',title:'Conclua sem perder o histórico',text:'Ao concluir uma tarefa, ela vai para o rodapé do próprio mês. Você continua vendo o que já resolveu sem misturar com o que ainda está pendente.'},
    {icon:'▦',title:'Veja o mês no calendário',text:'Use o Calendário para enxergar rapidamente o que está previsto em cada mês e encontrar compromissos sem percorrer toda a lista.'},
    {icon:'⚙',title:'Personalize em Mais',text:'Perfis, backups, aparência, notificações e biometria no celular ficam em Mais/Configurações. Se tiver dúvida depois, a Ajuda continuará disponível lá.'}
  ];

  function tourDone(){try{return localStorage.getItem(TOUR_KEY)==='1'}catch{return true}}
  function setTourDone(v=true){try{v?localStorage.setItem(TOUR_KEY,'1'):localStorage.removeItem(TOUR_KEY)}catch{}}
  function blockersVisible(){const splash=$('.startup-splash-v035'),brief=$('.startup-brief-backdrop-v035:not([hidden])'),lock=$('.mobile-biometric-lock-v036');return !!(splash||brief||lock)}
  function waitAndStart(force=false){
    let tries=0;const tick=()=>{if(!force&&tourDone())return;if(blockersVisible()&&tries++<60)return setTimeout(tick,250);startTour(force)};setTimeout(tick,220);
  }
  function startTour(force=false){
    if($('.mc-tour-v037'))return;if(!force&&tourDone())return;
    let i=0;const root=document.createElement('div');root.className='mc-tour-v037';root.innerHTML='<section class="mc-tour-card-v037" role="dialog" aria-modal="true" aria-label="Conheça o MeuControle"><div class="mc-tour-top-v037"><div class="mc-tour-mark-v037"></div><button type="button" class="mc-tour-skip-v037">Pular</button></div><h2></h2><p></p><div class="mc-tour-dots-v037"></div><div class="mc-tour-actions-v037"><button type="button" class="mc-tour-prev-v037">Voltar</button><button type="button" class="mc-tour-next-v037">Próximo</button></div></section>';document.body.appendChild(root);
    const mark=$('.mc-tour-mark-v037'),title=root.querySelector('h2'),text=root.querySelector('p'),dots=root.querySelector('.mc-tour-dots-v037'),prev=root.querySelector('.mc-tour-prev-v037'),next=root.querySelector('.mc-tour-next-v037');
    const close=()=>{setTourDone(true);root.remove()};
    root.querySelector('.mc-tour-skip-v037').onclick=close;
    const render=()=>{const s=steps[i];mark.textContent=s.icon;title.textContent=s.title;text.textContent=s.text;dots.innerHTML=steps.map((_,n)=>`<span class="mc-tour-dot-v037 ${n===i?'active':''}"></span>`).join('');prev.style.visibility=i?'visible':'hidden';next.textContent=i===steps.length-1?'Começar':'Próximo'};
    prev.onclick=()=>{if(i>0){i--;render()}};next.onclick=()=>{if(i===steps.length-1)close();else{i++;render()}};render();
  }

  function ensureHelp(){
    const grid=$('#settingsPage .settings-grid');if(!grid||$('.mc-help-card-v037'))return;
    const card=document.createElement('article');card.className='settings-card mc-help-card-v037';card.innerHTML=`<h3>Ajuda</h3><p>Respostas rápidas para as principais funções do MeuControle.</p>
      <details><summary>Como criar um lançamento?</summary><p>Abra Lançamentos e escolha Novo lançamento. Preencha descrição e data; os demais campos podem ser usados conforme sua necessidade.</p></details>
      <details><summary>Como concluir ou reabrir?</summary><p>Abra o lançamento e use Concluir. Ele permanece no mês de origem, no bloco Concluídos. Para voltar, use Reabrir.</p></details>
      <details><summary>Como funcionam as recorrências?</summary><p>Escolha Diário, Semanal, Mensal, Semestral ou Anual. Você também pode definir até quando repetir e se o valor será fixo ou variável.</p></details>
      <details><summary>Para que servem os perfis?</summary><p>Perfis separam contextos como Pessoal, Condomínio ou Trabalho sem misturar os lançamentos. O filtro global escolhe qual perfil visualizar.</p></details>
      <details><summary>Como proteger meus dados?</summary><p>Use os backups em Dados e segurança. No celular, a entrada por biometria pode ser ativada em Aplicativo.</p></details>
      <details><summary>Como encontro algo rapidamente?</summary><p>Use a pesquisa em Lançamentos ou Calendário e combine com os filtros Hoje, Próximos, Vencidos e Concluídos.</p></details>
      <div class="mc-help-actions-v037"><button type="button" class="mc-replay-tour-v037">Refazer tour inicial</button></div>`;
    grid.appendChild(card);card.querySelector('.mc-replay-tour-v037').onclick=()=>{setTourDone(false);startTour(true)};

    const moreList=$('.mobile-more-list');if(moreList&&!moreList.querySelector('[data-more="help-v037"]')){
      const btn=document.createElement('button');btn.type='button';btn.className='mobile-more-card';btn.dataset.more='help-v037';btn.innerHTML='<span class="mobile-more-icon">?</span><span class="mobile-more-copy"><strong>Ajuda</strong><small>Guia rápido e tour inicial</small></span><span class="mobile-more-arrow">›</span>';moreList.appendChild(btn);
      btn.onclick=()=>{
        if(!isMobile())return;
        [...grid.children].forEach(c=>c.classList.remove('mobile-settings-active'));
        let back=card.querySelector('.mobile-settings-back');if(!back){back=document.createElement('button');back.type='button';back.className='mobile-settings-back';back.textContent='‹ Voltar para Mais';back.onclick=()=>{card.classList.remove('mobile-settings-active');$('#settingsPage')?.classList.remove('mobile-settings-detail');window.scrollTo({top:0,behavior:'smooth'})};card.insertBefore(back,card.firstChild)}
        card.classList.add('mobile-settings-active');$('#settingsPage')?.classList.add('mobile-settings-detail');window.scrollTo({top:0,behavior:'smooth'});
      };
    }
  }

  function ensureLaunchHint(){
    const tabs=$('#launchesPage .tabs');if(!tabs||$('#mcLaunchHintV037'))return;
    if(localStorage.getItem(HINT_KEY)==='1')return;
    const hint=document.createElement('div');hint.id='mcLaunchHintV037';hint.className='mc-launch-hint-v037';hint.innerHTML=`<span>${isMobile()?'Toque em um lançamento para acessar suas ações.':'Clique em um card para ver editar, concluir ou excluir.'}</span><button type="button" aria-label="Fechar dica">×</button>`;tabs.after(hint);
    const dismiss=()=>{try{localStorage.setItem(HINT_KEY,'1')}catch{}hint.remove()};hint.querySelector('button').onclick=dismiss;
    $('#list')?.addEventListener('click',e=>{if(e.target.closest('.item'))dismiss()},{once:true});
  }

  function ensureEmptyAction(){
    const empty=$('#emptyState');if(!empty||$('#mcEmptyActionV037'))return;
    const btn=document.createElement('button');btn.id='mcEmptyActionV037';btn.type='button';btn.className='mc-empty-action-v037';empty.after(btn);
    const sync=()=>{
      const shown=!empty.classList.contains('hidden');btn.classList.toggle('show',shown);if(!shown)return;
      const searchEmpty=(empty.textContent||'').toLowerCase().includes('encontrado');btn.textContent=searchEmpty?'Limpar pesquisa':'+ Criar primeiro lançamento';btn.dataset.mode=searchEmpty?'clear':'new';
    };
    btn.onclick=()=>{
      if(btn.dataset.mode==='clear'){const input=$('#globalSearch');if(input){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))}return}
      document.querySelector('.nav-btn[data-page="launches"]')?.click();
      setTimeout(()=>{if(isMobile())document.querySelector('[data-mobile-launch="form"]')?.click();else $('#description')?.focus()},100);
    };
    new MutationObserver(sync).observe(empty,{attributes:true,childList:true,subtree:true,characterData:true});sync();
  }

  function boot(){installStyles();ensureHelp();ensureLaunchHint();ensureEmptyAction();waitAndStart(false)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0),{once:true});else setTimeout(boot,0);
  window.addEventListener('load',()=>setTimeout(()=>{ensureHelp();ensureLaunchHint();ensureEmptyAction()},500));
  window.MeuControleOnboarding={version:VERSION,start:()=>startTour(true),reset:()=>setTourDone(false)};
})();
