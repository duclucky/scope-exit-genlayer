import {afterEach,expect,it,vi} from 'vitest';
import {testHolder as holder} from '../../tests/tooling/consumer-signer-fixture.mjs';
import {hexToString} from 'viem';
import {webcrypto} from 'node:crypto';
import {requestExport} from './consumer-client';
import {CONSUMER,exportTerms} from './consumer-policy.mjs';
import type {Agreement} from './adapter';
const csv='record_id,category,value\n1,analysis,12\n2,export,7\n3,reference,5\n';
const agreement=():Agreement=>({id:'consumer-test',digest:'a'.repeat(64),title:'Test fixture',issuer:CONSUMER.issuer,buyer:holder.address,expiry:1,phase:'CLOSED',attempt:1,dependencies:['INDEPENDENT','INDEPENDENT'],permissions:[{id:'A',title:'Analysis',terms:'Independent',status:'CANCELLED'},{id:'B',title:CONSUMER.title,terms:exportTerms(),status:'CONSUMED'}],escrowGEN:'0',buyerCreditGEN:'0',issuerCreditGEN:'0'});
afterEach(()=>vi.unstubAllGlobals());
const provider=(calls:string[])=>({request:async({method,params}:{method:string;params?:unknown[]})=>{
  calls.push(method);
  if(method==='eth_accounts') return [holder.address];
  if(method==='personal_sign') return holder.signMessage({message:hexToString(params![0] as `0x${string}`)});
  throw new Error('Unexpected wallet request');
}});
it('uses the selected holder for a real EIP-191 authorization, checks returned bytes, and sends no transaction',async()=>{
  vi.stubGlobal('crypto',webcrypto);
  const calls:string[]=[];
  vi.stubGlobal('fetch',vi.fn(async(_url,options)=>{
    const body=JSON.parse(options.body);
    expect(body.fields.contract).toBe(CONSUMER.contract);expect(body.fields.digest).toBe(agreement().digest);
    return new Response(JSON.stringify({csv,sha256:CONSUMER.sha256,resource:CONSUMER.resource,version:CONSUMER.version,agreementId:'consumer-test'}));
  }));
  expect(await requestExport(agreement(),holder.address,provider(calls))).toBe(csv);
  expect(calls).toEqual(['eth_accounts','personal_sign']);
});
it('disconnect or changed account cannot sign or fetch',async()=>{
  const calls:string[]=[];const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);
  const p={request:async()=>[]};
  await expect(requestExport(agreement(),holder.address,p)).rejects.toThrow('account changed');
  expect(fetcher).not.toHaveBeenCalled();expect(calls).toEqual([]);
});
it('unexercised and unregistered grants do not ask the wallet to sign',async()=>{
  const calls:string[]=[];const a=agreement();a.permissions[1].status='ACTIVE';
  await expect(requestExport(a,holder.address,provider(calls))).rejects.toThrow('exercise');
  a.permissions[1].status='CONSUMED';a.issuer=holder.address;
  await expect(requestExport(a,holder.address,provider(calls))).rejects.toThrow('exercise');expect(calls).toEqual([]);
});
it('corrupt CSV and unavailable endpoint never return a success payload',async()=>{
  vi.stubGlobal('crypto',webcrypto);const calls:string[]=[];
  vi.stubGlobal('fetch',async()=>new Response(JSON.stringify({csv:csv+'forged',sha256:CONSUMER.sha256,resource:CONSUMER.resource,version:CONSUMER.version,agreementId:'consumer-test'})));
  await expect(requestExport(agreement(),holder.address,provider(calls))).rejects.toThrow('digest');
  vi.stubGlobal('fetch',async()=>new Response('{}',{status:503}));
  await expect(requestExport(agreement(),holder.address,provider(calls))).rejects.toThrow('do not exercise');
});
