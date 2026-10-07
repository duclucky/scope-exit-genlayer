// Studio Dev only. Resumable writes; all persisted/output fields are allowlisted.
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createAccount, createClient } from '../frontend/node_modules/genlayer-js/dist/index.js';
import { studioDevnet } from '../frontend/node_modules/genlayer-js/dist/chains/index.js';
import { TransactionHashVariant } from '../frontend/node_modules/genlayer-js/dist/types/index.js';
import { formatUnits, isAddress } from '../frontend/node_modules/viem/_esm/index.js';
import { publicReceipt } from './receipt.mjs';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = resolve(project, 'docs/evidence/studio-dev');
const endpoint = 'https://studio-next.genlayer.com/api';
const walletEndpoint = studioDevnet.rpcUrls.default.http[0];
const explorer = 'https://explorer-studio-dev.genlayer.com';
const source = await readFile(resolve(project, 'contracts/scope_exit.py'), 'ascii');
const sourceHash = createHash('sha256').update(source).digest('hex');
const runner = source.match(/py-genlayer:([a-z0-9]+)/)[1];
const chain = url => ({ ...studioDevnet, rpcUrls: { ...studioDevnet.rpcUrls, default: { http: [url] } } });
const env = {};
for (const path of [resolve(project, '.env'), resolve(dirname(project), '.env')]) {
  if (!existsSync(path)) continue;
  for (const [name, value] of Object.entries(parseEnv(await readFile(path, 'utf8')))) if (!env[name]) env[name] = value;
}
const names = { issuer: 'STUDIONET_PRIVATE_KEY', buyer: 'STUDIONET_INTEGRATOR_PRIVATE_KEY', observer: 'STUDIONET_STEWARD_PRIVATE_KEY' };
const accounts = {};
for (const [role, name] of Object.entries(names)) if (/^0x[\da-f]{64}$/i.test(env[name] ?? '')) accounts[role] = createAccount(env[name]);
const clients = Object.fromEntries(Object.entries(accounts).map(([role, account]) => [role, createClient({ chain: chain(walletEndpoint), account })]));
const reader = createClient({ chain: chain(endpoint) });
const journalPath = resolve(directory, 'attempts.json');
let journal = existsSync(journalPath) ? JSON.parse(await readFile(journalPath, 'utf8')) : { network: 'studio-dev', chainId: 61997, sourceHash, attempts: {} };
if (journal.sourceHash !== sourceHash) throw new Error('Source revision changed; archive prior identity before writing');
await mkdir(directory, { recursive: true });
const json = value => JSON.stringify(value, (_, x) => typeof x === 'bigint' ? x.toString() : x, 2) + '\n';
async function save(path, value) { const temporary = path + '.tmp'; await writeFile(temporary, json(value)); await rename(temporary, path); }
const persist = () => save(journalPath, journal);
const output = value => console.log(json(value).trim());
// SDK error objects may contain raw RPC/configuration. Report safe categories below.
console.warn = () => {};
console.error = () => {};
let active;
const fetchRPC = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  let request;
  if (typeof options?.body === 'string') {
    request = JSON.parse(options.body);
    // Simulation time is fee-estimation context, never production legality.
    if (request.method === 'sim_estimateTransactionFees' && request.params?.[0]?.type === 'write') {
      request.params[0] = { ...request.params[0], sim_config: { genvm_datetime: new Date().toISOString() } };
      options = { ...options, body: JSON.stringify(request) };
    }
  }
  const response = await fetchRPC(url, options);
  if (active && request?.method === 'eth_sendRawTransaction') {
    const hash = (await response.clone().json()).result;
    if (typeof hash === 'string' && /^0x[\da-f]{64}$/i.test(hash)) {
      journal.attempts[active].hash = hash;
      journal.attempts[active].stage = 'SUBMITTED';
      await persist();
      output({ attempt: active, stage: 'SUBMITTED', hash });
    }
  }
  return response;
};

async function rpc(method, params = [], url = endpoint) {
  const response = await fetchRPC(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(45000) });
  const envelope = await response.json();
  if (envelope.error) throw Object.assign(new Error('RPC_FAILED'), { safeCode: Number.isInteger(envelope.error.code) ? envelope.error.code : null });
  return envelope.result;
}
async function identity() {
  for (const url of [endpoint, walletEndpoint]) if (BigInt(await rpc('eth_chainId', [], url)) !== 61997n) throw new Error('NETWORK_IDENTITY');
}
async function balance(address) { return BigInt(await rpc('eth_getBalance', [address, 'latest'])); }
const gen = amount => formatUnits(amount, 18);
async function deployment() {
  const path = resolve(directory, 'deployment.json');
  if (!existsSync(path)) return null;
  const d = JSON.parse(await readFile(path, 'utf8'));
  if (d.sourceHash !== sourceHash || d.network !== 'studio-dev' || d.chainId !== 61997 || !isAddress(d.contractAddress)) throw new Error('DEPLOYMENT_IDENTITY');
  return d;
}
async function read(address, functionName, args = []) {
  const value = await reader.readContract({ address, functionName, args, transactionHashVariant: TransactionHashVariant.LATEST_FINAL });
  return typeof value === 'string' ? JSON.parse(value) : value;
}
async function wait(hash, key) {
  let last;
  for (let index = 0; index < 150; index++) {
    const raw = await rpc('eth_getTransactionByHash', [hash]);
    const proof = { ...publicReceipt(raw, hash), observedAt: new Date().toISOString(), explorer: `${explorer}/tx/${hash}` };
    if (key) { journal.attempts[key].receipt = proof; journal.attempts[key].stage = proof.status; await persist(); }
    if (last !== proof.status) { output({ attempt: key, ...proof }); last = proof.status; }
    if (proof.status === 'FINALIZED') {
      if (proof.executionResult !== 'SUCCESS') throw new Error('EXECUTION_FAILED');
      return { raw, proof };
    }
    if (['UNDETERMINED', 'CANCELED', 'FAILED'].includes(proof.status)) throw new Error('EXECUTION_FAILED');
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  throw new Error('PENDING_FINALITY');
}
async function execute(key, role, method, args = [], amount = 0n) {
  const old = journal.attempts[key];
  if (old?.hash) return wait(old.hash, key);
  if (old) throw new Error('AMBIGUOUS_SUBMISSION');
  const client = clients[role];
  if (!client) throw new Error('ROLE_UNAVAILABLE');
  const d = method === 'deploy' ? null : await deployment();
  if (method !== 'deploy' && !d) throw new Error('DEPLOYMENT_IDENTITY');
  if (amount > 0n && !journal.zeroValueSmokePassed) throw new Error('ZERO_VALUE_SMOKE_REQUIRED');
  const estimate = method === 'deploy' ? await client.estimateTransactionFees()
    : await client.estimateTransactionFeesForWrite({ address: d.contractAddress, functionName: method, args, value: amount, transactionHashVariant: TransactionHashVariant.LATEST_FINAL });
  output({ attempt: key, role, method, valueGEN: gen(amount), feeBudgetGEN: gen(estimate.feeValue), quote: method === 'deploy' ? 'LIVE_POLICY_BOOTSTRAP' : 'SDK_SIMULATION' });
  journal.attempts[key] = { actor: accounts[role].address, role, method, args, valueGEN: gen(amount), feeBudgetGEN: gen(estimate.feeValue), beforeActorGEN: gen(await balance(accounts[role].address)), beforeContractGEN: d ? gen(await balance(d.contractAddress)) : null, startedAt: new Date().toISOString(), stage: 'SUBMITTING' };
  await persist(); active = key;
  try {
    const fees = { distribution: estimate.distribution, feeValue: estimate.feeValue, messageAllocations: estimate.messageAllocations };
    const hash = method === 'deploy' ? await client.deployContract({ code: source, args: [], fees })
      : await client.writeContract({ address: d.contractAddress, functionName: method, args, value: amount, fees });
    journal.attempts[key].hash = hash; await persist();
    return wait(hash, key);
  } finally { active = undefined; }
}
async function inspect() {
  await identity();
  const d = await deployment();
  const roles = {};
  for (const [role, account] of Object.entries(accounts)) roles[role] = { address: account.address, balanceGEN: gen(await balance(account.address)) };
  output({ network: 'studio-dev', chainId: 61997, sourceHash, runner, secretPresence: Object.fromEntries(Object.entries(names).map(([role, name]) => [role, Boolean(env[name])])), roles, distinctRoles: new Set(Object.values(accounts).map(a => a.address)).size, deployment: d ? { contractAddress: d.contractAddress, sourceCommit: d.sourceCommit } : null, attempts: Object.fromEntries(Object.entries(journal.attempts).map(([k, a]) => [k, { hash: a.hash ?? null, stage: a.stage }])) });
  if (d) output({ accounting: await read(d.contractAddress, 'get_accounting'), contractBalanceGEN: gen(await balance(d.contractAddress)) });
}
async function deploy() {
  await inspect();
  if (await deployment()) { output({ reused: true }); return; }
  const smoke = JSON.parse(await readFile(resolve(directory, 'runtime-smoke.json'), 'utf8'));
  if (!smoke.passed) throw new Error('SOURCE_SMOKE_REQUIRED');
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: project, encoding: 'utf8' }).trim();
  if (execFileSync('git', ['status', '--porcelain', '--', 'contracts/scope_exit.py'], { cwd: project, encoding: 'utf8' }).trim()) throw new Error('COMMITTED_SOURCE_REQUIRED');
  const { proof } = await execute('deploy-v1', 'issuer', 'deploy');
  if (!proof.contractAddress) throw new Error('DEPLOYMENT_ADDRESS');
  const policy = await read(proof.contractAddress, 'get_policy');
  if (policy.policy !== 'SX1' || policy.purchaseGEN !== '2') throw new Error('DEPLOYED_POLICY');
  const d = { network: 'studio-dev', chainId: 61997, endpoint, walletEndpoint, sourceHash, sourceCommit, runner, api: 'v0.3.0', sdk: 'genlayer-js@2.0.0-rc.1', contractAddress: proof.contractAddress, deployHash: proof.hash, explorer: `${explorer}/address/${proof.contractAddress}`, verifiedAt: new Date().toISOString() };
  await save(resolve(directory, 'deployment.json'), d);
  output({ deployment: d, policy });
}
try {
  const command = process.argv[2] ?? 'inspect';
  if (command === 'inspect') await inspect();
  else if (command === 'deploy') await deploy();
  else throw new Error('UNKNOWN_COMMAND');
} catch (error) {
  const allowed = ['NETWORK_IDENTITY', 'DEPLOYMENT_IDENTITY', 'EXECUTION_FAILED', 'PENDING_FINALITY', 'AMBIGUOUS_SUBMISSION', 'ROLE_UNAVAILABLE', 'ZERO_VALUE_SMOKE_REQUIRED', 'SOURCE_SMOKE_REQUIRED', 'COMMITTED_SOURCE_REQUIRED', 'DEPLOYMENT_ADDRESS', 'DEPLOYED_POLICY', 'UNKNOWN_COMMAND', 'RPC_FAILED'];
  output({ failed: true, errorType: error.name, category: allowed.includes(error.message) ? error.message : 'OPERATION_INCOMPLETE', rpcCode: error.safeCode ?? null });
  process.exitCode = 1;
}
