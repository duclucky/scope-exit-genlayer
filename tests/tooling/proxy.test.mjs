import test from 'node:test';
import assert from 'node:assert/strict';
import { proxy } from '../../frontend/server/rpc.mjs';
test('RPC errors cannot expose validator payloads through SDK logging', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ jsonrpc: '2.0', id: 7, error: { code: -32000, message: 'PRIVATE_VALIDATOR_PAYLOAD', data: { config: 'PRIVATE_VALIDATOR_PAYLOAD' } } }));
  let payload;
  const response = { status() { return this; }, setHeader() {}, json(value) { payload = value; } };
  try { await proxy('https://offline.invalid')({ method: 'POST', body: { jsonrpc: '2.0', id: 7, method: 'sim_estimateTransactionFees', params: [] } }, response); }
  finally { globalThis.fetch = original; }
  assert.equal(payload.error.code, -32000);
  assert.equal(payload.error.message, 'Studio Dev RPC request failed');
  assert.equal(JSON.stringify(payload).includes('PRIVATE_VALIDATOR_PAYLOAD'), false);
});
