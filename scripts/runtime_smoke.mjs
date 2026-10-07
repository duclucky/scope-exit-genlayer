// Exact-source unsigned GenVM smoke. No environment secrets or wallet signing.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { abi } from '../frontend/node_modules/genlayer-js/dist/index.js';
const endpoint = 'https://studio-next.genlayer.com/api';
const code = await readFile(new URL('../contracts/scope_exit.py', import.meta.url), 'ascii');
const data = abi.transactions.serialize([code, abi.calldata.encode(abi.calldata.makeCalldataObject(undefined, [])), false]);
const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'sim_call', params: [{ type: 'deploy', from: '0x0000000000000000000000000000000000000001', to: '0x0000000000000000000000000000000000000000', data }] }), signal: AbortSignal.timeout(55000) });
const envelope = await response.json();
const receipt = envelope.result ?? envelope.error?.data?.receipt;
const textLeaves = [];
function visit(value) {
  if (typeof value === 'string') textLeaves.push(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(visit);
}
visit(receipt);
const rawText = textLeaves.join('\n');
const categories = ['AttributeError', 'TypeError', 'ImportError', 'NameError', 'SyntaxError', 'UserError', 'runner not found'].filter(x => rawText.includes(x));
const safe = { at: new Date().toISOString(), mode: 'UNSIGNED_EXACT_SOURCE_DEPLOY_SMOKE', endpoint, http: response.status, executionResult: receipt?.execution_result ?? null, rpcErrorCode: Number.isInteger(envelope.error?.code) ? envelope.error.code : null, diagnostics: categories, noKeys: true, noGEN: true, noTransaction: true, passed: receipt?.execution_result === 'SUCCESS' };
await mkdir(new URL('../docs/evidence/studio-dev/', import.meta.url), { recursive: true });
await writeFile(new URL('../docs/evidence/studio-dev/runtime-smoke.json', import.meta.url), JSON.stringify(safe, null, 2) + '\n');
console.log(JSON.stringify(safe));
process.exitCode = safe.passed ? 0 : 1;
