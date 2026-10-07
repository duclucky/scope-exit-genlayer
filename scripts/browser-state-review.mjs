// Actual deployed canonical views in a browser; no wallet or signed writes.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const base = process.env.FRONTEND_REVIEW_URL ?? 'http://127.0.0.1:5178/';
const out = new URL(process.env.FRONTEND_REVIEW_OUTPUT ?? '../docs/evidence/local/frontend/', import.meta.url);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = [], errors = [];
try {
  await mkdir(out, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', () => errors.push('PAGE_ERROR'));
  await page.goto(`${base}#/agreements`);
  for (const title of ['Unfunded metadata smoke', 'dependent permission bundle', 'independent permission bundle', 'unclear permission bundle']) {
    await page.getByRole('heading', { name: title, exact: true }).waitFor({ timeout: 90000 });
  }
  results.push({ route: '/agreements', allFourFinalizedCasesRead: true });
  await page.screenshot({ path: fileURLToPath(new URL('deployed-agreements.png', out)), fullPage: true });
  for (const kind of ['dependent', 'independent', 'unclear']) {
    await page.goto(`${base}#/agreements/demo-${kind}-v1`);
    await page.getByRole('heading', { name: `${kind} permission bundle`, exact: true }).waitFor({ timeout: 90000 });
    await page.getByText('Funds held for unused permissions:', { exact: false }).waitFor();
    assert.match(await page.locator('.detail-note').innerText(), /0 GEN/);
    assert.equal(await page.getByRole('button', { name: /Withdraw|Accept for|Check dependencies|Use permission|Recover unused/ }).count(), 0);
    if (kind === 'dependent') await page.getByText('Needs permission A to remain active.', { exact: true }).waitFor();
    if (kind === 'independent') assert.equal(await page.getByText('Can stand on its own.', { exact: true }).count(), 2);
    if (kind === 'unclear') await page.locator('.next-step .notice').waitFor();
    results.push({ route: `/agreements/demo-${kind}-v1`, canonicalTermsAndDependenciesRead: true, escrowGEN: '0', noIllegalWriteControl: true });
  }
  await page.screenshot({ path: fileURLToPath(new URL('deployed-unclear.png', out)), fullPage: true });
  await page.goto(`${base}#/activity`);
  await page.locator('.activity-list li').first().waitFor({ timeout: 90000 });
  const historyCount = await page.locator('.activity-list li').count();
  assert.ok(historyCount >= 20);
  results.push({ route: '/activity', canonicalEvents: historyCount });
  assert.equal(errors.length, 0);
  const proof = { at: new Date().toISOString(), command: 'node scripts/browser-state-review.mjs', base, network: 'studio-dev', contractAddress: '0x61619ed664eAB90043765E5bA431EDa35F260fb5', mode: 'ACTUAL_BROWSER_CANONICAL_READS', noWallet: true, noSignedTransactions: true, pageErrors: 0, results, passed: true };
  await writeFile(new URL('state-review.json', out), JSON.stringify(proof, null, 2) + '\n');
  console.log(JSON.stringify(proof));
} finally { await browser.close(); }
