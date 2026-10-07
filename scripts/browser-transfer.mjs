// Read-only native-transfer proof. The owner signs through the extension.
import { readFile, writeFile, access } from 'node:fs/promises';
import { createClient } from '../frontend/node_modules/genlayer-js/dist/index.js';
import { studioDevnet } from '../frontend/node_modules/genlayer-js/dist/chains/index.js';
import { TransactionHashVariant } from '../frontend/node_modules/genlayer-js/dist/types/index.js';
import { formatUnits, parseUnits } from '../frontend/node_modules/viem/_esm/index.js';
import { publicReceipt } from './receipt.mjs';
const endpoint = 'https://studio-next.genlayer.com/api';
const d = JSON.parse(await readFile(new URL('../docs/evidence/studio-dev/deployment.json', import.meta.url), 'utf8'));
const reader = createClient({ chain: { ...studioDevnet, rpcUrls: { default: { http: [endpoint] } } } });
console.warn = () => {}; console.error = () => {};
async function rpc(method, params) {
  const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(45000) });
  const payload = await response.json();
  if (payload.error) throw new Error('READ_UNAVAILABLE');
  return payload.result;
}
const gen = value => formatUnits(value, 18);
try {
  const [mode, id, hash] = process.argv.slice(2);
  if (id !== 'sx-ddc3df46' || !['before', 'after'].includes(mode)) throw new Error('BOUNDED_CASE_REQUIRED');
  if (BigInt(await rpc('eth_chainId', [])) !== 61997n) throw new Error('NETWORK_IDENTITY');
  const result = await reader.readContract({ address: d.contractAddress, functionName: 'get_agreement', args: [id], transactionHashVariant: TransactionHashVariant.LATEST_FINAL });
  const agreement = typeof result === 'string' ? JSON.parse(result) : result;
  const snapshot = { at: new Date().toISOString(), network: 'studio-dev', chainId: 61997, contractAddress: d.contractAddress,
    recipient: agreement.issuer, agreement, contractBalanceGEN: gen(BigInt(await rpc('eth_getBalance', [d.contractAddress, 'latest']))),
    recipientBalanceGEN: gen(BigInt(await rpc('eth_getBalance', [agreement.issuer, 'latest']))) };
  const beforePath = new URL(`../docs/evidence/studio-dev/browser-${id}-withdraw-before.json`, import.meta.url);
  if (mode === 'before') {
    let exists = false; try { await access(beforePath); exists = true; } catch {}
    if (exists) throw new Error('BASELINE_ALREADY_RECORDED');
    if (agreement.issuerCreditGEN !== '1' || snapshot.contractBalanceGEN !== '1') throw new Error('ONE_GEN_CREDIT_REQUIRED');
    await writeFile(beforePath, JSON.stringify(snapshot, null, 2) + '\n');
    console.log(JSON.stringify({ baselineRecorded: true, ...snapshot }));
  } else {
    if (!/^0x[\da-f]{64}$/i.test(hash ?? '')) throw new Error('OBSERVED_HASH_REQUIRED');
    const before = JSON.parse(await readFile(beforePath, 'utf8'));
    const raw = await rpc('eth_getTransactionByHash', [hash]);
    const receipt = publicReceipt(raw, hash);
    const expected = parseUnits(before.agreement.issuerCreditGEN, 18);
    const decrease = parseUnits(before.contractBalanceGEN, 18) - parseUnits(snapshot.contractBalanceGEN, 18);
    const increase = parseUnits(snapshot.recipientBalanceGEN, 18) - parseUnits(before.recipientBalanceGEN, 18);
    const message = raw.messages?.length === 1 ? raw.messages[0] : null;
    const nativeMessageBound = Boolean(message && [0, '0'].includes(message.messageType) && message.onAcceptance === false
      && message.recipient?.toLowerCase() === before.recipient.toLowerCase() && ['', '0x'].includes(message.data)
      && BigInt(message.value) === expected && raw.from_address?.toLowerCase() === before.recipient.toLowerCase()
      && raw.to_address?.toLowerCase() === d.contractAddress.toLowerCase());
    const proven = receipt.status === 'FINALIZED' && receipt.executionResult === 'SUCCESS' && nativeMessageBound
      && decrease === expected && increase > 0n && increase <= expected && agreement.issuerCreditGEN === '0';
    const proof = { command: `node scripts/browser-transfer.mjs after ${id} ${hash}`, before, after: snapshot, receipt,
      expectedGEN: gen(expected), exactContractDecreaseGEN: gen(decrease), recipientNetIncreaseGEN: gen(increase),
      observedNetTransactionCostGEN: gen(expected - increase), nativeMessageBound, proven, extensionSigningReportedByOwner: true };
    await writeFile(new URL(`../docs/evidence/studio-dev/browser-${id}-withdraw-transfer.json`, import.meta.url), JSON.stringify(proof, null, 2) + '\n');
    console.log(JSON.stringify(proof));
    if (!proven) throw new Error('TRANSFER_NOT_PROVEN');
  }
} catch { console.log(JSON.stringify({ failed: true, category: 'BROWSER_NATIVE_PROOF_PENDING' })); process.exitCode = 1; }
