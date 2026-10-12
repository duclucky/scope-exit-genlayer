import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePrivateKey, privateKeyToAccount } from '../../frontend/node_modules/viem/_esm/accounts/index.js';
import { createHash } from 'node:crypto';
import { authorizeExport, CSV } from '../../frontend/server/consumer.mjs';
import { CONSUMER, authorization, authorizationMessage, exportTerms } from '../../frontend/src/consumer-policy.mjs';
const holder = privateKeyToAccount(generatePrivateKey());
const outsider = privateKeyToAccount(generatePrivateKey());
const now = 1900000000;
const agreement = () => ({ id:'consumer-case', digest:'a'.repeat(64), issuer:CONSUMER.issuer,
  buyer:holder.address, expiry:now-10, phase:'CLOSED', attempt:1,
  dependencies:['INDEPENDENT','INDEPENDENT'], permissions:[{id:'A',status:'CANCELLED'},
    {id:'B',title:CONSUMER.title,terms:exportTerms(),status:'CONSUMED'}] });
async function fixture(mutator = () => {}) {
  const a = agreement();
  const right = {agreementId:a.id,component:'B',holder:a.buyer,status:'CONSUMED',expiry:a.expiry};
  const history = [{agreementId:a.id,action:'EXERCISE_B',actor:a.buyer,at:a.expiry-1}];
  const fields = authorization(a,now);
  const input={fields,signature:await holder.signMessage({message:authorizationMessage(fields)})};
  const context={a,right,history,input}; await mutator(context);
  const reader=async (method,args) => {
    assert.equal(args[0],a.id);
    return method==='get_agreement'?a:method==='get_right'?right:history;
  };
  return {input,reader};
}
test('holder signature and finalized consumed resource grant deliver exact bytes, including idempotent redownload after closure',async()=>{
  const {input,reader}=await fixture();
  const before=JSON.stringify(agreement());
  for(let i=0;i<2;i++){
    const result=await authorizeExport(input,{reader,now});
    assert.equal(result.csv,CSV); assert.equal(result.sha256,createHash('sha256').update(CSV).digest('hex'));
  }
  assert.equal(JSON.stringify(agreement()),before);
});
for(const [name,change] of [
  ['wrong signer',async c=>{c.input.signature=await outsider.signMessage({message:authorizationMessage(c.input.fields)});} ],
  ['outsider issuer',c=>{c.a.issuer=outsider.address;}],
  ['substituted resource terms',c=>{c.a.permissions[1].terms+=' Pay a different actor.';}],
  ['wrong digest',c=>{c.a.digest='b'.repeat(64);} ],
  ['cancelled right',c=>{c.right.status=c.a.permissions[1].status='CANCELLED';}],
  ['unconsumed right',c=>{c.right.status=c.a.permissions[1].status='ACTIVE';}],
  ['unclear consensus',c=>{c.a.dependencies=['UNVERIFIABLE','INDEPENDENT'];}],
  ['missing exercise',c=>{c.history.length=0;}],
  ['wrong exercise actor',c=>{c.history[0].actor=outsider.address;}],
  ['late exercise',c=>{c.history[0].at=c.a.expiry;}],
  ['mismatched right identity',c=>{c.right.agreementId='another-case';}],
  ['wrong holder',c=>{c.right.holder=outsider.address;}],
]) test(`consumer denies ${name} without returning resource`,async()=>{
  const {input,reader}=await fixture(change);
  await assert.rejects(authorizeExport(input,{reader,now}),/DENIED/);
});
for(const [name,fields] of [
  ['cross-origin',{origin:'https://attacker.example'}],['wrong chain',{chainId:1}],
  ['wrong contract',{contract:outsider.address}],['wrong resource',{resource:'other'}],
  ['wrong version',{version:'2'}],['extra field',{payout:'1 GEN'}],
  ['stale at boundary',{issuedAt:now-120}],['future',{issuedAt:now+1}],
]) test(`signed ${name} cannot pass policy`,async()=>{
  const {input,reader}=await fixture(async c=>{
    Object.assign(c.input.fields,fields);
    c.input.signature=await holder.signMessage({message:authorizationMessage(c.input.fields)});
  });
  let reads=0;
  await assert.rejects(authorizeExport(input,{now,reader:async(...args)=>{reads++;return reader(...args);}}),/DENIED/);
  assert.equal(reads,0);
});
test('exact issuance and last second are valid; outage fails retryably without resource',async()=>{
  const {input,reader}=await fixture();
  assert.equal((await authorizeExport(input,{reader,now:now+119})).csv,CSV);
  await assert.rejects(authorizeExport(input,{now,reader:async()=>{throw new Error('PRIVATE_RPC_PAYLOAD');}}),/UNAVAILABLE/);
});
