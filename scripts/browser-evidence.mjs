// Read-only browser-write reconciliation. No keys, signing or raw receipt logs.
import { readFile, writeFile } from 'node:fs/promises';
import { createClient, abi } from '../frontend/node_modules/genlayer-js/dist/index.js';
import { studioDevnet } from '../frontend/node_modules/genlayer-js/dist/chains/index.js';
import { TransactionHashVariant } from '../frontend/node_modules/genlayer-js/dist/types/index.js';
import { publicReceipt } from './receipt.mjs';
import { formatUnits } from '../frontend/node_modules/viem/_esm/index.js';
const endpoint = 'https://studio-next.genlayer.com/api';
const deployment = JSON.parse(await readFile(new URL('../docs/evidence/studio-dev/deployment.json', import.meta.url), 'utf8'));
const client = createClient({ chain: { ...studioDevnet, rpcUrls: { default: { http: [endpoint] } } } });
console.warn = () => {};
console.error = () => {};
let stage = 'NETWORK', rpcMethod;
async function rpc(method, params) {
  rpcMethod = method;
  const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(45000) });
  const payload = await response.json();
  if (payload.error) throw Object.assign(new Error('READ_UNAVAILABLE'), { safeCode: Number.isInteger(payload.error.code) ? payload.error.code : null });
  return payload.result;
}
try {
  if (BigInt(await rpc('eth_chainId', [])) !== 61997n) throw new Error('NETWORK_IDENTITY');
  const id = process.argv[2];
  if (!id || !/^[a-zA-Z0-9_-]{1,64}$/.test(id)) throw new Error('AGREEMENT_ID_REQUIRED');
  const read = async functionName => {
    const value = await client.readContract({ address: deployment.contractAddress, functionName, args: [id], transactionHashVariant: TransactionHashVariant.LATEST_FINAL });
    return typeof value === 'string' ? JSON.parse(value) : value;
  };
  stage = 'AGREEMENT';
  const agreement = await read('get_agreement');
  stage = 'HISTORY';
  const history = await read('get_history');
  stage = 'TRANSACTIONS';
  const hash = process.argv[3];
  if (!/^0x[\da-f]{64}$/i.test(hash ?? '')) throw new Error('EXPLORER_HASH_REQUIRED');
  const transaction = await rpc('eth_getTransactionByHash', [hash]);
  const encoded = transaction?.data?.calldata;
  const decoded = typeof encoded === 'string' ? abi.calldata.decode(Buffer.from(encoded, 'base64')) : null;
  const field = name => decoded instanceof Map ? decoded.get(name) : decoded?.[name];
  const method = field('') ?? field('method');
  const args = field('args');
  const receipt = publicReceipt(transaction, hash);
  const sender = transaction.from_address;
  const destination = transaction.to_address;
  const methodBound = ['create_offer', 'review_dependencies', 'withdraw', 'close', 'accept_offer', 'exit_component', 'consume_component', 'cancel_offer', 'recover_expired'].includes(method);
  const bound = methodBound && args?.[0] === id && destination?.toLowerCase() === deployment.contractAddress.toLowerCase()
    && [agreement.issuer, agreement.buyer].includes(sender?.toLowerCase());
  if (!bound || receipt.status !== 'FINALIZED' || receipt.executionResult !== 'SUCCESS') throw new Error('RECEIPT_NOT_PROVEN');
  const accountingRaw = await client.readContract({ address: deployment.contractAddress, functionName: 'get_accounting', args: [], transactionHashVariant: TransactionHashVariant.LATEST_FINAL });
  const accounting = typeof accountingRaw === 'string' ? JSON.parse(accountingRaw) : accountingRaw;
  const contractBalanceGEN = formatUnits(BigInt(await rpc('eth_getBalance', [deployment.contractAddress, 'latest'])), 18);
  const proof = { at: new Date().toISOString(), command: `node scripts/browser-evidence.mjs ${id} ${hash}`,
    network: 'studio-dev', chainId: 61997, contractAddress: deployment.contractAddress,
    sourceCommit: deployment.sourceCommit, sourceHash: deployment.sourceHash,
    receipt: { ...receipt, actor: sender, target: destination, method, agreementId: id, calldataBindingProven: bound },
    agreement, history, accounting, contractBalanceGEN, hashSource: 'Observed transaction link on official Explorer or frontend', noSignedWrites: true };
  await writeFile(new URL(`../docs/evidence/studio-dev/browser-${id}-${method}.json`, import.meta.url), JSON.stringify(proof, null, 2) + '\n');
  console.log(JSON.stringify(proof));
} catch (error) { console.log(JSON.stringify({ failed: true, category: 'BROWSER_RECONCILIATION_PENDING', stage, rpcMethod, rpcCode: error.safeCode ?? null, errorClass: error instanceof Error && ['Error', 'TypeError'].includes(error.name) ? error.name : 'ReadError' })); process.exitCode = 1; }
