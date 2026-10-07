// Actual browser fetch through same-origin local proxies; no wallet or writes.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5178/');
  const results = await page.evaluate(async () => {
    const checks = [];
    for (const path of ['/api/ic-rpc', '/api/wallet-rpc']) {
      try {
        const response = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] }) });
        const payload = await response.json();
        checks.push({ path, http: response.status, chainIdMatches: payload.result === '0xf22d', browserFetchSucceeded: true });
      } catch { checks.push({ path, browserFetchSucceeded: false }); }
    }
    return checks;
  });
  assert.ok(results.every(x => x.browserFetchSucceeded && x.http === 200 && x.chainIdMatches));
  const safe = { at: new Date().toISOString(), mode: 'ACTUAL_LOCAL_BROWSER_RPC_READ', noWallet: true, noTransaction: true, results, passed: true };
  await mkdir(new URL('../docs/evidence/local/frontend/', import.meta.url), { recursive: true });
  await writeFile(new URL('../docs/evidence/local/frontend/rpc-review.json', import.meta.url), JSON.stringify(safe, null, 2) + '\n');
  console.log(JSON.stringify(safe));
} finally { await browser.close(); }
