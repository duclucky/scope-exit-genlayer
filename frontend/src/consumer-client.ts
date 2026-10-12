import {stringToHex} from 'viem';
import type {Agreement} from './adapter';
import type {EVMProvider} from './wallet';
import {authorization,authorizationMessage,CONSUMER,registeredGrant} from './consumer-policy.mjs';
export async function requestExport(a:Agreement,account:string,provider:EVMProvider) {
  if(!registeredGrant(a) || account.toLowerCase()!==a.buyer.toLowerCase() || a.permissions[1].status!=='CONSUMED') throw new Error('The connected buyer must exercise this registered export right first.');
  const accounts=await provider.request({method:'eth_accounts'});
  if(!Array.isArray(accounts) || typeof accounts[0]!=='string' || accounts[0].toLowerCase()!==account.toLowerCase()) throw new Error('Your wallet account changed. Reconnect before authorizing delivery.');
  const fields=authorization(a,Math.floor(Date.now()/1000));
  const signature=await provider.request({method:'personal_sign',params:[stringToHex(authorizationMessage(fields)),account]});
  if(typeof signature!=='string' || !/^0x[0-9a-fA-F]{130}$/.test(signature)) throw new Error('The wallet did not complete the export authorization.');
  const response=await fetch('/api/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields,signature}),signal:AbortSignal.timeout(60000)});
  if(!response.ok) throw new Error(response.status===403?'The server could not verify your finalized export grant. Refresh the agreement.':'Delivery is temporarily unavailable. Retry download; do not exercise the right again.');
  const result=await response.json();
  if(typeof result.csv!=='string' || result.csv.length>10000 || result.resource!==CONSUMER.resource || result.version!==CONSUMER.version || result.agreementId!==a.id || result.sha256!==CONSUMER.sha256) throw new Error('The returned resource identity could not be verified.');
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(result.csv));
  if([...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')!==CONSUMER.sha256) throw new Error('The delivered CSV does not match the registered digest.');
  return result.csv as string;
}
