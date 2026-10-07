import { describe, expect, it } from 'vitest';
import { connectWallet, discoverWallets } from './wallet';

describe('explicit browser wallet selection', () => {
  it('discovery never requests accounts or automatically chooses an extension', () => {
    let requests = 0;
    const provider = { request: async () => { requests++; return []; }, isMetaMask: true };
    const target = new EventTarget();
    Object.assign(target, { ethereum: provider });
    const stop = discoverWallets(target as Window, () => {});
    expect(requests).toBe(0);
    stop();
  });
  it('only the explicitly selected provider receives the account request', async () => {
    const calls: string[] = [];
    const account = '0x1111111111111111111111111111111111111111';
    const chosen = { id: 'chosen', name: 'Chosen wallet', provider: { request: async ({ method }: { method: string }) => { calls.push(method); return [account]; } } };
    expect(await connectWallet(chosen)).toBe(account);
    expect(calls).toEqual(['eth_requestAccounts']);
  });
  it('rejects malformed wallet identities instead of enabling writes', async () => {
    await expect(connectWallet({ id: 'bad', name: 'Bad wallet', provider: { request: async () => ['not-an-address'] } })).rejects.toThrow('valid account');
  });
  it('prefers an announced wallet over its duplicate injected fallback', () => {
    const provider = { request: async () => [], isOkxWallet: true };
    const announced = { request: async () => [] };
    const target = new EventTarget();
    Object.assign(target, { ethereum: provider });
    let choices: { name: string; provider: unknown }[] = [];
    const stop = discoverWallets(target as Window, value => { choices = value; });
    target.dispatchEvent(new CustomEvent('eip6963:announceProvider', { detail: { info: { uuid: 'one', name: 'OKX Wallet', rdns: 'com.okex.wallet' }, provider: announced } }));
    expect(choices).toHaveLength(1);
    expect(choices[0].provider).toBe(announced);
    stop();
  });
});
