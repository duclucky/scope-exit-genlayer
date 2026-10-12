import {useState} from 'react';
import type {Agreement} from './adapter';
import type {EVMProvider} from './wallet';
import {CONSUMER,registeredGrant} from './consumer-policy.mjs';
import {requestExport} from './consumer-client';
export function ExportPanel({agreement:a,account,provider,refreshing}:{agreement:Agreement;account?:string;provider?:EVMProvider;refreshing:boolean}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[complete,setComplete]=useState(false);
  if(!registeredGrant(a)) return null;
  const eligible=account?.toLowerCase()===a.buyer.toLowerCase() && a.permissions[1].status==='CONSUMED' && !!provider && !refreshing;
  async function download() {
    if(!eligible || busy) return;
    setBusy(true);setError('');setComplete(false);
    try {
      const csv=await requestExport(a,account!,provider!);
      const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
      const link=document.createElement('a');link.href=url;link.download=`${CONSUMER.resource}-v${CONSUMER.version}.csv`;link.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);setComplete(true);
    } catch { setError('Delivery could not be verified. Check your buyer wallet, refresh the agreement and retry download. Do not exercise the right again.'); }
    finally {setBusy(false);}
  }
  return <section className="panel permission-card"><p className="eyebrow">Registered dataset consumer</p><h2>Download your dataset</h2><p>The consumer checks your wallet signature and finalized Export exercise before delivering the registered CSV. This is synthetic demonstration data.</p>{a.permissions[1].status!=='CONSUMED' && <p>As the named buyer, use Dataset export once above after successful dependency review. Then return here to download.</p>}<button className="button" disabled={!eligible || busy} onClick={download}>{busy?'Authorize delivery in your wallet…':'Download verified CSV'}</button><p className="small">The delivery signature sends 0 GEN and no transaction. It expires after two minutes. You may retry downloading identical bytes after exercise, including after agreement closure.</p>{error && <p role="alert" className="error">{error}</p>}{complete && <p role="status">CSV delivered. Its SHA-256 digest matches the registered resource.</p>}<details><summary>Resource details</summary><p>{CONSUMER.resource} · version {CONSUMER.version}</p><code className="address">{CONSUMER.sha256}</code></details></section>;
}
