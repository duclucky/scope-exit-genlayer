// Isolated browser QA with a real Node-side EIP-191 signer. No extension proof.
// Keys never enter the browser, logs, evidence or public files. No transaction allowed.
import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseEnv} from 'node:util';
import {createHash} from 'node:crypto';
import {privateKeyToAccount} from '../frontend/node_modules/viem/_esm/accounts/index.js';
import {hexToString} from '../frontend/node_modules/viem/_esm/index.js';
import {CONSUMER,authorization,authorizationMessage} from '../frontend/src/consumer-policy.mjs';
const project=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const base=process.env.CONSUMER_REVIEW_URL??'http://127.0.0.1:5178/';
if(!['http://127.0.0.1:5178/','https://scope-exit-genlayer.vercel.app/'].includes(base)) throw new Error('UNAUTHORIZED_QA_ORIGIN');
const env={};
for(const path of [resolve(project,'.env'),resolve(project,'../.env')]) {
  if(existsSync(path)) for(const [k,v] of Object.entries(parseEnv(await readFile(path,'utf8')))) if(!env[k]) env[k]=v;
}
const account=privateKeyToAccount(env.STUDIONET_INTEGRATOR_PRIVATE_KEY);
const browser=await chromium.launch({channel:'msedge',headless:true});
const out=resolve(project,'docs/evidence/studio-dev/ms-001',base.startsWith('https')?'production':'local');
const errors=[]; const walletRequests=[];
try {
  await mkdir(out,{recursive:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});
  page.on('pageerror',()=>errors.push('PAGE_ERROR'));
  await page.exposeFunction('scopeExportQASigner',async({method,params})=>{
    walletRequests.push(method);
    if(['eth_accounts','eth_requestAccounts'].includes(method)) return [account.address];
    if(method==='eth_chainId') {
      const r=await fetch('https://studio-dev.genlayer.com/api',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params:[]})});
      const chain=(await r.json()).result;
      if(chain!=='0xf22d') throw new Error('NETWORK_IDENTITY');return chain;
    }
    if(method!=='personal_sign' || params?.[1]?.toLowerCase()!==account.address.toLowerCase()) throw new Error('QA_NO_TRANSACTION_ALLOWED');
    const fields=JSON.parse(hexToString(params[0]));
    if(fields.agreementId!=='ms001-export-v1' || fields.issuedAt>Math.floor(Date.now()/1000)
      || fields.issuedAt<Math.floor(Date.now()/1000)-120
      || authorizationMessage(fields)!==authorizationMessage(authorization({id:fields.agreementId,digest:fields.digest},fields.issuedAt))) throw new Error('QA_SIGN_SCOPE');
    return account.signMessage({message:authorizationMessage(fields)});
  });
  await page.addInitScript(()=>{
    const provider={request:request=>window.scopeExportQASigner(request)};
    const info={uuid:'aaaabbbb-cccc-4ddd-8eee-ffffffffffff',name:'Script signer QA (not an extension)',icon:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',rdns:'org.scopeexit.qa'};
    window.addEventListener('eip6963:requestProvider',()=>window.dispatchEvent(new CustomEvent('eip6963:announceProvider',{detail:{info,provider}})));
  });
  await page.goto(`${base}#/agreements/ms001-export-v1`);
  await page.getByRole('heading',{name:'Registered dataset export',exact:true}).waitFor({timeout:90000});
  await page.getByRole('heading',{name:'Download your dataset',exact:true}).waitFor();
  if(!await page.getByRole('button',{name:'Download verified CSV',exact:true}).isDisabled()) throw new Error('DISCONNECTED_WRITE_ELIGIBILITY');
  await page.getByRole('button',{name:'Connect wallet',exact:true}).first().click();
  await page.getByRole('button',{name:'Script signer QA (not an extension)',exact:true}).click();
  await page.getByRole('button',{name:'Download verified CSV',exact:true}).waitFor();
  const download=page.waitForEvent('download',{timeout:90000});
  await page.getByRole('button',{name:'Download verified CSV',exact:true}).click();
  const file=await download;
  const localPath=await file.path();
  const bytes=await readFile(localPath);
  if(createHash('sha256').update(bytes).digest('hex')!==CONSUMER.sha256) throw new Error('DOWNLOAD_DIGEST');
  await page.getByText('CSV delivered. Its SHA-256 digest matches the registered resource.',{exact:true}).waitFor();
  await page.screenshot({path:resolve(out,'delivered.png'),fullPage:true});
  await page.locator('.account-button').click();
  await page.getByRole('button',{name:'Disconnect wallet',exact:true}).click();
  if(!await page.getByRole('button',{name:'Download verified CSV',exact:true}).isDisabled()) throw new Error('DISCONNECT_ELIGIBILITY');
  const layouts=[];
  for(const width of [375,768,1024,1440]){
    await page.setViewportSize({width,height:950});
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)) throw new Error('HORIZONTAL_OVERFLOW');
    layouts.push(width);
  }
  if(errors.length) throw new Error('BROWSER_ERROR');
  const proof={at:new Date().toISOString(),phase:'MS-001',base,mode:'ISOLATED_BROWSER_REAL_NODE_SIGNER_NO_EXTENSION',
    keyInBrowser:false,noTransactionSent:true,canonicalRead:true,registeredResource:CONSUMER.resource,
    signer:account.address,walletRequests,downloadBytes:bytes.length,sha256:CONSUMER.sha256,
    disconnectedDisabled:true,disconnectClearsEligibility:true,widths:layouts,pageErrors:0,
    limitation:'A real authorized script signer answers personal_sign. This proves browser controls, real signature, live canonical API and downloaded bytes; it does not prove a Chrome wallet extension popup.',passed:true};
  await writeFile(resolve(out,'browser-review.json'),JSON.stringify(proof,null,2)+'\n');
  console.log(JSON.stringify(proof));
} catch {console.log(JSON.stringify({phase:'MS-001',failed:true,category:'BROWSER_QA_INCOMPLETE',base}));process.exitCode=1;}
finally{await browser.close();}
