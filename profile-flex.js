/* Meu Controle — perfis flexíveis
   Pessoal é a base protegida. Demais perfis podem ser removidos quando vazios. */
(function(){
  function normalizeProfiles(){
    if(typeof profiles==='undefined'||!Array.isArray(profiles))return;
    let changed=false;
    profiles.forEach(p=>{
      const shouldLock=p.id==='pessoal';
      if(Boolean(p.locked)!==shouldLock){p.locked=shouldLock;changed=true;}
    });
    if(changed&&typeof saveProfiles==='function')saveProfiles();
  }

  function installFlexibleProfileRenderer(){
    if(typeof renderProfilesList!=='function'||typeof $!=='function')return;
    normalizeProfiles();

    renderProfilesList=function(){
      normalizeProfiles();
      const box=$('profilesList');
      if(!box)return;
      box.innerHTML='';

      profiles.forEach(p=>{
        const count=entries.filter(e=>(e.profile||'pessoal')===p.id).length;
        const row=document.createElement('div');
        row.className='profile-row';

        const main=document.createElement('div');
        main.className='profile-row-main';
        main.innerHTML=`<strong>${esc(p.name)}</strong><span>${count} lançamento${count===1?'':'s'}</span>`;
        row.appendChild(main);

        if(p.id==='pessoal'){
          const lock=document.createElement('span');
          lock.className='profile-lock-icon';
          lock.textContent='🔒';
          lock.title='Perfil base do Meu Controle';
          lock.setAttribute('aria-label','Perfil base protegido');
          row.appendChild(lock);
        }else{
          const del=document.createElement('button');
          del.type='button';
          del.className='profile-trash-btn';
          del.innerHTML='🗑';
          del.title='Excluir perfil';
          del.setAttribute('aria-label',`Excluir perfil ${p.name}`);
          del.onclick=()=>{
            if(count){
              alert(`O perfil ${p.name} possui ${count} lançamento${count===1?'':'s'}.\n\nPara excluí-lo, primeiro mova ou exclua os lançamentos vinculados.`);
              return;
            }
            if(!confirm(`Excluir o perfil “${p.name}”?`))return;
            createAutoBackup('Antes de excluir perfil');
            profiles=profiles.filter(x=>x.id!==p.id);
            if(activeProfile===p.id){
              activeProfile='all';
              localStorage.setItem(PROFILE_FILTER_KEY,'all');
            }
            saveProfiles();
            renderProfileSelectors();
            renderProfilesList();
            if(typeof renderAll==='function')renderAll();
          };
          row.appendChild(del);
        }
        box.appendChild(row);
      });
    };

    const style=document.createElement('style');
    style.textContent=`
      .profile-row{display:flex;align-items:center;gap:12px}
      .profile-row-main{min-width:0;flex:1}
      .profile-trash-btn{width:42px;height:42px;min-width:42px;padding:0;border:0;border-radius:12px;background:#f8eeee;color:#a53a3a;font-size:18px;display:grid;place-items:center;box-shadow:none}
      .profile-trash-btn:hover,.profile-trash-btn:focus-visible{background:#f2dddd;transform:none}
      .profile-lock-icon{width:42px;height:42px;display:grid;place-items:center;opacity:.55;font-size:15px}
      @media(max-width:700px){.profile-trash-btn,.profile-lock-icon{width:40px;height:40px;min-width:40px}.profile-row{padding-right:10px}}
    `;
    document.head.appendChild(style);

    renderProfilesList();
    if(typeof renderProfileSelectors==='function')renderProfileSelectors();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(installFlexibleProfileRenderer,0));
  else setTimeout(installFlexibleProfileRenderer,0);
})();
