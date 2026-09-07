import admin from 'firebase-admin';
import { createHash } from 'node:crypto';

admin.initializeApp({credential:admin.credential.applicationDefault(),projectId:'meucontrole-b8f2d'});
const db=admin.firestore(),auth=admin.auth(),messaging=admin.messaging();
const now=Date.now(),STALE=12*60*60*1000;
let pageToken,checked=0,sent=0,skipped=0,failed=0;

const tokenHash=token=>token?createHash('sha256').update(String(token)).digest('hex').slice(0,12):'none';
async function deviceState(uid,x){
  if(!x.deviceId)return {deviceId:'none',currentToken:false,vapid:'unknown',deviceTokenHash:'none'};
  try{
    const snap=await db.collection('users').doc(uid).collection('pushDevices').doc(String(x.deviceId)).get();
    const d=snap.exists?(snap.data()||{}):{};
    return {
      deviceId:String(x.deviceId),
      currentToken:Boolean(d.token&&x.token&&d.token===x.token),
      vapid:String(d.vapid||'legacy'),
      deviceTokenHash:tokenHash(d.token)
    };
  }catch{
    return {deviceId:String(x.deviceId),currentToken:false,vapid:'lookup-error',deviceTokenHash:'unknown'};
  }
}

async function processUser(uid){
  const ref=db.collection('users').doc(uid).collection('pushReminders');
  const snap=await ref.where('sent','==',false).limit(300).get();
  for(const d of snap.docs){
    const x=d.data()||{},fireAt=Number(x.fireAt||0);
    if(!fireAt||fireAt>now)continue;
    checked++;
    const diag=await deviceState(uid,x),base={reminder:d.id,entryId:String(x.entryId||''),phase:String(x.phase||'remind'),fireAt:new Date(fireAt).toISOString(),tokenHash:tokenHash(x.token),...diag};
    if(fireAt<now-STALE){
      skipped++;
      console.log(JSON.stringify({push:'skipped-stale',...base}));
      await d.ref.set({sent:true,skipped:true,sentAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
      continue;
    }
    try{
      const messageId=await messaging.send({
        token:x.token,
        data:{
          title:String(x.title||'Meu Controle'),
          body:String(x.body||'Você tem um lembrete.'),
          entryId:String(x.entryId||''),
          phase:String(x.phase||'remind'),
          url:'https://ceducunha-alt0609.github.io/MeuControle/'
        },
        webpush:{headers:{Urgency:x.phase==='due'?'high':'normal'}}
      });
      sent++;
      console.log(JSON.stringify({push:'sent',messageId:String(messageId||''),...base}));
      await d.ref.set({sent:true,sentAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
    }catch(e){
      failed++;
      const code=String(e?.code||''),message=String(e?.message||e||'');
      const terminal=code.includes('registration-token-not-registered')||code.includes('invalid-registration-token');
      console.log(JSON.stringify({push:'failed',code:code||'unknown',message:message.slice(0,500),terminal,...base}));
      await d.ref.set({lastError:code||message,lastAttemptAt:admin.firestore.FieldValue.serverTimestamp(),...(terminal?{sent:true,invalidToken:true}:{})},{merge:true});
    }
  }
}

do{
  const page=await auth.listUsers(500,pageToken);
  for(const user of page.users)await processUser(user.uid);
  pageToken=page.pageToken;
}while(pageToken);

console.log(JSON.stringify({checked,sent,skipped,failed,at:new Date().toISOString()}));
