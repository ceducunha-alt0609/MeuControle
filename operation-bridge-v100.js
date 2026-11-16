/* MeuControle — ponte única entre o app base e o motor de operações */
(function(){
  if(window.MeuControleLocalBridge)return;
  const clone=v=>JSON.parse(JSON.stringify(v));
  const baseRemove=typeof removeEntry==='function'?removeEntry:null;
  window.MeuControleLocalBridge={
    version:'1.0',
    getEntries:()=>clone(entries),
    replaceEntries(next,{render=true,backupReason=''}={}){
      if(backupReason&&typeof createAutoBackup==='function')createAutoBackup(backupReason);
      entries=clone(Array.isArray(next)?next:[]);save();if(render)renderAll();
    },
    async removeEntries(ids,{backupReason=''}={}){
      const set=new Set(ids||[]);if(!set.size)return false;
      const before=clone(entries);
      const uid=window.MeuControleUserDataScope?.activeUid?.()||'';
      // Uma cópia verificada no IndexedDB protege a operação mesmo com localStorage cheio.
      if(typeof preserveEntryFormSnapshot!=='function')throw new Error('Proteção de exclusão indisponível.');
      await preserveEntryFormSnapshot(backupReason||'Antes de excluir lançamentos');
      if(uid!==(window.MeuControleUserDataScope?.activeUid?.()||'')||
         JSON.stringify(before)!==JSON.stringify(entries))throw new Error('Dados alterados durante a proteção; exclusão cancelada.');
      entries=entries.filter(e=>!set.has(e.id));
      try{save()}catch(error){entries=before;throw error}
      try{window.MeuControleUserDataScope?.saveCurrent?.()}catch(error){console.warn('[MeuControle] Falha ao salvar escopo',error)}
      renderAll();
      return true;
    },
    backup:reason=>typeof createAutoBackup==='function'&&createAutoBackup(reason)
  };
  removeEntry=async function(id){
    for(let i=0;i<40&&!window.MeuControleOps?.deleteEntries;i++)await new Promise(r=>setTimeout(r,50));
    if(window.MeuControleOps?.deleteEntries)return window.MeuControleOps.deleteEntries([id]);
    if(baseRemove)return baseRemove(id);
  };
})();
