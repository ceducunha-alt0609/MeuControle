/* MeuControle — V1.49: data final explícita e protegida nas recorrências */
(()=>{
  if(window.__mcRecurrenceEndGuardV149)return;window.__mcRecurrenceEndGuardV149=true;
  const form=document.getElementById('entryForm');
  const recurrence=document.getElementById('recurrence');
  const start=document.getElementById('date');
  const until=document.getElementById('repeatUntil');
  if(!form||!recurrence||!start||!until)return;

  let userSetUntil=false;
  const syncLimit=()=>{
    const recurring=recurrence.value!=='none';
    until.required=recurring;
    until.min=recurring?(start.value||''):'';
    if(!recurring){until.setCustomValidity('');return}
    if(until.value&&start.value&&until.value<start.value){
      until.setCustomValidity('A data final deve ser igual ou posterior à data inicial.');
    }else until.setCustomValidity('');
  };

  until.addEventListener('input',()=>{userSetUntil=!!until.value;syncLimit()});
  until.addEventListener('change',()=>{userSetUntil=!!until.value;syncLimit()});
  start.addEventListener('change',syncLimit);

  recurrence.addEventListener('change',()=>{
    /* O código-base preenchia silenciosamente +1 ano. Removemos esse prazo
       automático: quem escolhe recorrência escolhe também a data final. */
    if(recurrence.value!=='none'&&!userSetUntil)until.value='';
    if(recurrence.value==='none')userSetUntil=false;
    syncLimit();
  });

  form.addEventListener('submit',ev=>{
    if(recurrence.value==='none')return;
    syncLimit();
    if(!until.value){
      ev.preventDefault();ev.stopImmediatePropagation();
      until.setCustomValidity('Informe até quando este lançamento deve se repetir.');
      until.reportValidity();
      return;
    }
    if(start.value&&until.value<start.value){
      ev.preventDefault();ev.stopImmediatePropagation();until.reportValidity();
    }
  },true);

  syncLimit();
  window.MeuControleRecurrenceEndGuard={version:'1.49'};
})();
