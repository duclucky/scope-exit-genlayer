// @vitest-environment jsdom
// Isolated UI fixtures only. Actual production adapter is tested separately.
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { Agreement, TransactionProgress, WriteMethod } from './adapter';

const context = vi.hoisted(() => ({ account: '0x1111111111111111111111111111111111111111', agreement: null as Agreement | null, writes: [] as { method: WriteMethod; args: unknown[]; value: string }[], reads: 0 }));
vi.mock('./sdk-adapter', () => ({ createSDKAdapter: () => ({ configured: true,
  list: async () => [context.agreement], history: async () => [],
  agreement: async () => { context.reads++; return context.agreement; },
  write: async (method: WriteMethod, args: unknown[], value: string, progress: (p: TransactionProgress) => void) => {
    context.writes.push({ method, args, value });
    for (const stage of ['signing', 'submitted', 'accepted', 'finalized'] as const) progress({ stage, message: `Fixture ${stage}` });
  } }) }));
vi.mock('./network', () => ({ ensureStudioNetwork: async () => {} }));
import App from './App';
const buyer = '0x1111111111111111111111111111111111111111';
const issuer = '0x2222222222222222222222222222222222222222';
let host: HTMLElement;
let root: ReturnType<typeof createRoot>;
beforeEach(() => {
  sessionStorage.clear();
  context.account = buyer; context.reads = 0; context.writes = [];
  context.agreement = { id: 'fixture', title: 'UI fixture only', buyer, issuer, digest: 'a'.repeat(64), expiry: Math.floor(Date.now() / 1000) + 3600, phase: 'REVIEWED', permissions: [{ id: 'A', title: 'Analysis', terms: 'A independent', status: 'ACTIVE' }, { id: 'B', title: 'Export', terms: 'B depends on A', status: 'ACTIVE' }], dependencies: ['INDEPENDENT', 'DEPENDENT'], escrowGEN: '2', buyerCreditGEN: '0', issuerCreditGEN: '0', attempt: 1 };
  Object.defineProperty(window, 'ethereum', { configurable: true, value: { isMetaMask: true, request: async ({ method }: { method: string }) => { if (method === 'eth_requestAccounts') return [context.account]; return '0xf22d'; } } });
  HTMLDialogElement.prototype.showModal = function() { this.open = true; };
  HTMLDialogElement.prototype.close = function() { this.open = false; };
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  location.hash = '#/agreements/fixture';
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals(); });
function button(text: string) { const result = [...host.querySelectorAll('button')].find(x => x.textContent?.trim() === text); if (!result) throw new Error(`UI button missing: ${text}`); return result; }
async function click(text: string) { await act(async () => button(text).click()); }
async function renderAndConnect() {
  await act(async () => root.render(<HashRouter><App /></HashRouter>));
  await click('Connect wallet');
  await click('MetaMask');
}

it.each([
  ['accept_offer', 'OFFERED', buyer, 'Accept for 2 GEN', '2'],
  ['review_dependencies', 'FUNDED', issuer, 'Check dependencies', '0'],
  ['review_dependencies', 'RETRYABLE', buyer, 'Retry review', '0'],
  ['consume_component', 'REVIEWED', buyer, 'Use permission', '0'],
  ['recover_expired', 'FUNDED', issuer, 'Recover unused funds', '0'],
  ['withdraw', 'REVIEWED', buyer, 'Withdraw 1 GEN', '0'],
  ['cancel_offer', 'OFFERED', issuer, 'Cancel offer', '0'],
  ['close', 'REVIEWED', issuer, 'Finish agreement', '0'],
] as const)('%s control calls adapter and reloads after finality', async (method, phase, account, label, value) => {
  context.account = account;
  const a = context.agreement!; a.phase = phase;
  if (method === 'recover_expired') a.expiry = Math.floor(Date.now() / 1000) - 1;
  if (method === 'withdraw') a.buyerCreditGEN = '1';
  if (method === 'close') { a.permissions.forEach(p => p.status = 'CANCELLED'); a.escrowGEN = '0'; }
  await renderAndConnect();
  const before = context.reads;
  await click(label);
  expect(context.writes[0]).toEqual({ method, args: method === 'accept_offer' ? ['fixture', a.digest] : method === 'consume_component' ? ['fixture', 'A'] : ['fixture'], value });
  expect(context.reads).toBeGreaterThan(before);
  expect(host.textContent).toContain('Confirmed');
});

it('cancellation requires preview before it calls the adapter', async () => {
  await renderAndConnect();
  await click('Cancel unused');
  expect(context.writes).toHaveLength(0);
  expect(host.textContent).toContain('2 GEN');
  await click('Confirm cancellation');
  expect(context.writes).toEqual([{ method: 'exit_component', args: ['fixture', 'A'], value: '0' }]);
});

it('third failed review disables retry while recovery remains available at expiry', async () => {
  context.agreement!.phase = 'RETRYABLE'; context.agreement!.attempt = 3;
  await renderAndConnect();
  expect(button('Retry review').disabled).toBe(true);
  expect(context.writes).toHaveLength(0);
});

it('address menu logout clears selected identity and participant controls', async () => {
  await renderAndConnect();
  await act(async () => host.querySelector<HTMLButtonElement>('.account-button')!.click());
  await click('Disconnect wallet');
  expect(host.querySelector('.account-button')).toBeNull();
  expect([...host.querySelectorAll('button')].some(b => b.textContent === 'Use permission')).toBe(false);
});

it('new-offer form publishes through its wrapper after reviewing exact terms', async () => {
  context.account = issuer; location.hash = '#/new';
  await renderAndConnect();
  const values = { title: 'Fixture offer', buyer, expiry: new Date(Date.now() + 3600000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16), titleA: 'A', titleB: 'B', termsA: 'A independent.', termsB: 'B independent.' };
  for (const [id, value] of Object.entries(values)) {
    const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
    const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    await act(async () => { Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); });
  }
  await click('Review offer'); await click('Publish offer');
  expect(context.writes[0].method).toBe('create_offer');
  expect(context.writes[0].value).toBe('0');
  expect(context.writes[0].args.slice(1, 7)).toEqual(['Fixture offer', buyer, 'A', 'A independent.', 'B', 'B independent.']);
});
