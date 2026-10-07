export interface EVMProvider {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
  on?(event: string, callback: (...args: unknown[]) => void): void;
  removeListener?(event: string, callback: (...args: unknown[]) => void): void;
  [key: string]: unknown;
}
export interface WalletChoice { id: string; name: string; provider: EVMProvider }
export function discoverWallets(target: Window, update: (choices: WalletChoice[]) => void): () => void {
  const choices: WalletChoice[] = [];
  const add = (provider: unknown, id: string, name: string) => {
    if (!provider || typeof (provider as EVMProvider).request !== 'function') return;
    if (id.startsWith('eip:')) {
      for (let index = choices.length - 1; index >= 0; index--) if (!choices[index].id.startsWith('eip:') && choices[index].name === name && choices[index].provider !== provider) choices.splice(index, 1);
    }
    const existing = choices.find(x => x.provider === provider || x.id === id);
    if (existing) { if (id.startsWith('eip:')) { existing.id = id; existing.name = name; existing.provider = provider as EVMProvider; } }
    else choices.push({ id, name, provider: provider as EVMProvider });
    update([...choices]);
  };
  const announce = (event: Event) => {
    const detail = (event as CustomEvent<{ info?: { uuid?: string; name?: string; rdns?: string }; provider?: EVMProvider }>).detail;
    if (detail?.info?.uuid && detail.info.name) add(detail.provider, `eip:${detail.info.rdns ?? detail.info.uuid}`, detail.info.name);
  };
  target.addEventListener('eip6963:announceProvider', announce);
  const injected = target as unknown as Record<string, unknown>;
  const ethereum = injected.ethereum as EVMProvider | undefined;
  const candidates = Array.isArray(ethereum?.providers) ? ethereum.providers : ethereum ? [ethereum] : [];
  for (const [index, provider] of candidates.entries()) {
    const p = provider as EVMProvider;
    const name = p.isRabby ? 'Rabby' : p.isOkxWallet || p.isOKExWallet ? 'OKX Wallet' : p.isCoinbaseWallet ? 'Coinbase Wallet' : p.isBraveWallet ? 'Brave Wallet' : p.isMetaMask ? 'MetaMask' : 'Browser wallet';
    add(p, `injected:${index}`, name);
  }
  for (const [key, name] of [['okxwallet', 'OKX Wallet'], ['rabby', 'Rabby'], ['coinbaseWalletExtension', 'Coinbase Wallet'], ['brave', 'Brave Wallet']]) add(injected[key], `fallback:${key}`, name);
  target.dispatchEvent(new Event('eip6963:requestProvider'));
  update([...choices]);
  return () => target.removeEventListener('eip6963:announceProvider', announce);
}
export async function connectWallet(choice: WalletChoice): Promise<string> {
  const accounts = await choice.provider.request({ method: 'eth_requestAccounts' });
  if (!Array.isArray(accounts) || typeof accounts[0] !== 'string' || !/^0x[0-9a-f]{40}$/i.test(accounts[0])) throw new Error('The wallet did not return a valid account.');
  return accounts[0];
}
