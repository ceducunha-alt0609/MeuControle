import admin from 'firebase-admin';

const raw=process.env.FIREBASE_SERVICE_ACCOUNT;
if(!raw){console.log('FIREBASE_SERVICE_ACCOUNT ausente; nada enviado.');process.exit(0)}
let serviceAccount;
try{serviceAccount=JSON.parse(raw)}catch{throw new Error('FIREBASE_SERVICE_ACCOUNT não contém JSON válido.')}

admin.initializeApp({credential:admin.credential.cert(serviceAccount)});
const db=admin.firestore(),auth=admin.auth(),messaging=admin.messaging();
const now=Date.now(),STALE=12*60*60*1000;
let pageToken,checked=0,sent=0,skipped=0,failed=0;

async function processUser(uid){
  const ref=db.collection('users').doc(uid).collection('pushReminders');
  const snap=await ref.where('sent','==',false).limit(300).get();
  for(const d of snap.docs){
    const x=d.data()||{},fireAt=Number(x.fireAt||0);
    if(!fireAt||fireAt>now)continue;
    checked++;
    if(fireAt<now-STALE){
      skipped++;
      await d.ref.set({sent:true,skipped:true,sentAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
      continue;
    }
    try{
      await messaging.send({
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
      await d.ref.set({sent:true,sentAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
    }catch(e){
      failed++;
      const code=String(e?.code||'');
      const terminal=code.includes('registration-token-not-registered')||code.includes('invalid-registration-token');
      await d.ref.set({lastError:code||String(e?.message||e),lastAttemptAt:admin.firestore.FieldValue.serverTimestamp(),...(terminal?{sent:true,invalidToken:true}:{})},{merge:true});
    }
  }
}

do{
  const page=await auth.listUsers(500,pageToken);
  for(const user of page.users)await processUser(user.uid);
  pageToken=page.pageToken;
}while(pageToken);

console.log(JSON.stringify({checked,sent,skipped,failed,at:new Date().toISOString()}));
