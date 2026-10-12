// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {expect,it,vi} from 'vitest';
import {ExportPanel} from './ExportPanel';
import {CONSUMER,exportTerms} from './consumer-policy.mjs';
import type {Agreement} from './adapter';
vi.mock('./consumer-client',()=>({requestExport:async()=>{throw new Error('NO_RESOURCE');}}));
it('consumer control is contextual, disables disconnected/unconsumed rights and retains safe retry after failure',async()=>{
  Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
  const a:Agreement={id:'fixture',title:'UI fixture',issuer:CONSUMER.issuer,buyer:'0x1111111111111111111111111111111111111111',digest:'a'.repeat(64),expiry:1,phase:'CLOSED',attempt:1,dependencies:['INDEPENDENT','INDEPENDENT'],permissions:[{id:'A',title:'A',terms:'A',status:'CANCELLED'},{id:'B',title:CONSUMER.title,terms:exportTerms(),status:'CONSUMED'}],escrowGEN:'0',buyerCreditGEN:'0',issuerCreditGEN:'0'};
  const host=document.createElement('div');document.body.append(host);const root=createRoot(host);
  const provider={request:async()=>null};
  try {
    await act(async()=>root.render(<ExportPanel agreement={a} refreshing={false}/>));
    expect(host.querySelector('button')!.disabled).toBe(true);
    await act(async()=>root.render(<ExportPanel agreement={a} account={a.buyer} provider={provider} refreshing={false}/>));
    expect(host.querySelector('button')!.disabled).toBe(false);
    await act(async()=>host.querySelector('button')!.click());
    expect(host.querySelector('[role="alert"]')!.textContent).toContain('Do not exercise');
    expect(host.querySelector('[role="status"]')).toBeNull();
    expect(host.querySelector('button')!.disabled).toBe(false);
    await act(async()=>root.render(<ExportPanel agreement={a} refreshing={false}/>));
    expect(host.querySelector('button')!.disabled).toBe(true);
    a.issuer=a.buyer;
    await act(async()=>root.render(<ExportPanel agreement={a} refreshing={false}/>));
    expect(host.querySelector('button')).toBeNull();
  } finally {await act(async()=>root.unmount());host.remove();}
});
