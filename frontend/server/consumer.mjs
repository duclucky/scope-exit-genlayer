import { createHash } from 'node:crypto';
import { isAddress, verifyMessage } from 'viem';
import { createClient } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';
import { TransactionHashVariant } from 'genlayer-js/types';
import { CONSUMER, authorization, authorizationMessage, registeredGrant } from '../src/consumer-policy.mjs';
export const CSV = 'record_id,category,value\n1,analysis,12\n2,export,7\n3,reference,5\n';
const same = (a,b) => typeof a==='string' && typeof b==='string' && a.toLowerCase()===b.toLowerCase();
const deny = () => { throw new Error('DENIED'); };
const unpack = value => typeof value==='string'?JSON.parse(value):value;
const client = createClient({chain:{...studioDevnet,rpcUrls:{default:{http:['https://studio-next.genlayer.com/api']}}}});
export async function finalizedReader(method,args) {
  return unpack(await client.readContract({address:CONSUMER.contract,functionName:method,args,
    transactionHashVariant:TransactionHashVariant.LATEST_FINAL}));
}
export async function authorizeExport(input,{reader=finalizedReader,now=Math.floor(Date.now()/1000)}={}) {
  if(!input || Object.keys(input).sort().join(',')!=='fields,signature') deny();
  const f=input.fields;
  if(!f || typeof f!=='object' || Array.isArray(f) || typeof f.agreementId!=='string'
    || !/^[A-Za-z0-9_-]{1,64}$/.test(f.agreementId) || !/^[a-f0-9]{64}$/.test(f.digest??'')
    || !Number.isSafeInteger(f.issuedAt) || f.issuedAt>now || now>=f.issuedAt+120
    || typeof input.signature!=='string' || !/^0x[0-9a-fA-F]{130}$/.test(input.signature)) deny();
  const expected=authorization({id:f.agreementId,digest:f.digest},f.issuedAt);
  if(Object.keys(f).length!==Object.keys(expected).length || Object.keys(expected).some(k=>f[k]!==expected[k])) deny();
  let a,right,history;
  try {
    a=unpack(await reader('get_agreement',[f.agreementId]));
    right=unpack(await reader('get_right',[f.agreementId,'B']));
    history=unpack(await reader('get_history',[f.agreementId]));
  } catch { throw new Error('UNAVAILABLE'); }
  if(!registeredGrant(a) || a.id!==f.agreementId || a.digest!==f.digest || !isAddress(a.buyer??'')
    || !['REVIEWED','CLOSED'].includes(a.phase) || !Number.isSafeInteger(a.expiry) || a.attempt<1
    || a.dependencies?.length!==2 || a.dependencies.some(x=>!['INDEPENDENT','DEPENDENT'].includes(x))
    || a.permissions[1].status!=='CONSUMED' || right?.status!=='CONSUMED'
    || right.agreementId!==a.id || right.component!=='B' || !same(right.holder,a.buyer) || right.expiry!==a.expiry
    || !Array.isArray(history)) deny();
  const exercise=history.filter(e=>e.action==='EXERCISE_B');
  if(exercise.length!==1 || exercise[0].agreementId!==a.id || !same(exercise[0].actor,a.buyer)
    || !Number.isSafeInteger(exercise[0].at) || exercise[0].at>=a.expiry) deny();
  let signed=false;
  try { signed=await verifyMessage({address:a.buyer,message:authorizationMessage(expected),signature:input.signature}); }
  catch { deny(); }
  if(!signed) deny();
  const sha256=createHash('sha256').update(CSV).digest('hex');
  if(sha256!==CONSUMER.sha256) throw new Error('UNAVAILABLE');
  return {csv:CSV,sha256,resource:CONSUMER.resource,version:CONSUMER.version,agreementId:a.id};
}
export async function exportHandler(request,response) {
  response.setHeader('Cache-Control','private, no-store');
  response.setHeader('X-Content-Type-Options','nosniff');
  if(request.method!=='POST') return response.status(405).json({error:'POST required'});
  try {
    if(JSON.stringify(request.body).length>4096) return response.status(400).json({error:'Request too large'});
    const input=typeof request.body==='string'?JSON.parse(request.body):request.body;
    const result=await authorizeExport(input);
    return response.status(200).json(result);
  } catch(error) {
    return response.status(error?.message==='DENIED'?403:503).json({error:error?.message==='DENIED'
      ?'This wallet does not have a finalized export grant for the registered resource.'
      :'Export verification is temporarily unavailable. Retry delivery; do not exercise the right again.'});
  }
}
