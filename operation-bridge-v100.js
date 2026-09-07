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
    removeEntries(ids,{backupReason=''}={}){
      const set=new Set(ids||[]);if(!set.size)return;
      if(backupReason&&typeof createAutoBackup==='function')createAutoBackup(backupReason);
      entries=entries.filter(e=>!set.has(e.id));save();renderAll();
    },
    backup:reason=>typeof createAutoBackup==='function'&&createAutoBackup(reason)
  };
  removeEntry=async function(id){
    for(let i=0;i<40&&!window.MeuControleOps?.deleteEntries;i++)await new Promise(r=>setTimeout(r,50));
    if(window.MeuControleOps?.deleteEntries)return window.MeuControleOps.deleteEntries([id]);
    if(baseRemove)return baseRemove(id);
  };
})();
