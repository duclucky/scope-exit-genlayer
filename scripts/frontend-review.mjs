// Repository UI verification in an isolated, wallet-free headless browser.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const base = process.env.FRONTEND_REVIEW_URL ?? 'http://127.0.0.1:5178/';
const out = new URL('../docs/evidence/local/frontend/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = [];
try {
  for (const width of [375, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', () => errors.push('PAGE_ERROR'));
    for (const [path, title] of [['/', 'Let go of a part.'], ['/agreements', 'Agreements'], ['/new', 'Create a permission offer'], ['/activity', 'Activity'], ['/account', 'Account'], ['/help', 'Rights, refunds & limits'], ['/agreements/not-a-live-agreement', 'Live agreements are not available yet']]) {
      await page.goto(`${base}#${path}`);
      await page.getByRole('heading', { name: new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).waitFor();
      assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').count(), 5);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      assert.equal(overflow, false, `${width}px ${path} horizontal overflow`);
      if (path === '/') {
        const before = page.url();
        await page.getByRole('link', { name: 'Skip to content' }).press('Enter');
        assert.equal(page.url(), before, 'Skip link must preserve the app route');
        assert.equal(await page.evaluate(() => document.activeElement?.id), 'main');
      }
      results.push({ width, path, navigation: true, horizontalOverflow: false });
      if (path === '/' && [375, 1440].includes(width)) await page.screenshot({ path: fileURLToPath(new URL(`home-${width}.png`, out)), fullPage: true });
    }
    await page.getByRole('button', { name: 'Connect wallet', exact: true }).click();
    await page.getByRole('dialog').waitFor();
    await page.getByText('No EVM wallet was detected.', { exact: false }).waitFor();
    await page.getByRole('button', { name: 'Close wallet selection' }).press('Escape');
    assert.equal(await page.getByRole('dialog').isVisible(), false);
    await page.goto(`${base}#/new`);
    await page.getByRole('button', { name: 'Review offer' }).click();
    await page.getByText('Check the highlighted fields').waitFor();
    for (const [label, value] of [['Offer title', 'Local draft only'], ['Buyer wallet address', '0x2222222222222222222222222222222222222222'], ['Permission A name', 'Analysis'], ['Permission A terms', 'Analyze independently of export.'], ['Permission B name', 'Export'], ['Permission B terms', 'Export requires analysis A to stay active.']]) await page.getByLabel(label, { exact: true }).fill(value);
    await page.getByLabel('Permission expiry (your local time)').fill(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
    await page.getByRole('button', { name: 'Review offer' }).click();
    await page.getByRole('heading', { name: 'Ready for a final check' }).waitFor();
    await page.getByText('Your draft is not an onchain offer.', { exact: false }).waitFor();
    assert.equal(errors.length, 0, 'No uncaught React/browser errors');
    results.push({ width, modalEscape: true, emptyWalletHonest: true, invalidFormBlocked: true, validDraftReview: true, noFakeOnchainOffer: true, pageErrors: 0 });
    await context.close();
  }
  const proof = { at: new Date().toISOString(), command: 'node scripts/frontend-review.mjs', mode: 'ISOLATED_HEADLESS_EDGE', phase: '3B', productionAdapter: 'UNCONFIGURED', noWalletKeys: true, noSignedTransactions: true, noGENSent: true, limitations: 'Route, responsive, modal and draft behavior only. No deployed IC/RPC, browser-extension wallet lifecycle or value-transfer evidence.', passed: true, results };
  await writeFile(new URL('review.json', out), JSON.stringify(proof, null, 2) + '\n');
  console.log(JSON.stringify({ passed: true, widths: [375,768,1024,1440], routeChecks: 28, modalAndDraftChecks: 4, pageErrors: 0, screenshots: ['docs/evidence/local/frontend/home-375.png', 'docs/evidence/local/frontend/home-1440.png'] }));
} finally { await browser.close(); }
