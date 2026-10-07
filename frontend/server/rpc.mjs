const allowed = new Set(['eth_chainId', 'eth_call', 'eth_getBalance', 'eth_getTransactionCount', 'eth_estimateGas', 'eth_gasPrice', 'eth_getBlockByNumber', 'eth_blockNumber', 'eth_getTransactionReceipt', 'eth_getTransactionByHash', 'gen_call', 'gen_getTransactionStatus', 'gen_getContractSchema', 'sim_getTransactionByHash', 'sim_getTransactionReceipt', 'sim_getFeeConfig', 'sim_estimateTransactionFees']);
function publicPayload(value) {
  if (Array.isArray(value)) return value.map(publicPayload);
  if (!value || typeof value !== 'object') return value;
  if (value.jsonrpc === '2.0' && value.error) return { jsonrpc: '2.0', id: value.id ?? null, error: { code: Number.isInteger(value.error.code) ? value.error.code : -32000, message: 'Studio Dev RPC request failed' } };
  return Object.fromEntries(Object.entries(value).filter(([key]) => !['node_config', 'validator_config', 'private_key', 'api_key'].includes(key)).map(([key, item]) => [key, publicPayload(item)]));
}
export function proxy(endpoint) {
  return async (request, response) => {
    if (request.method !== 'POST') return response.status(405).json({ error: 'POST required' });
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const batch = Array.isArray(body) ? body : [body];
    if (!batch.length || batch.length > 20 || JSON.stringify(body).length > 100000 || batch.some(item => !item || item.jsonrpc !== '2.0' || !allowed.has(item.method))) return response.status(400).json({ error: 'Unsupported read or estimate request' });
    for (const item of batch) if (item.method === 'sim_estimateTransactionFees' && item.params?.[0]?.type === 'write') item.params[0] = { ...item.params[0], sim_config: { genvm_datetime: new Date().toISOString() } };
    try {
      const upstream = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(55000) });
      response.setHeader('Cache-Control', 'no-store');
      return response.status(upstream.status).json(publicPayload(await upstream.json()));
    } catch { return response.status(502).json({ error: 'Studio Dev is temporarily unavailable' }); }
  };
}
