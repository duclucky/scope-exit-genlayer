import { studioDevnet } from 'genlayer-js/chains';
import { isAddress } from 'viem';
import type { EVMProvider } from './wallet';

export const IC_RPC = '/api/ic-rpc';
export const WALLET_RPC = '/api/wallet-rpc';
export const officialWalletRPC = studioDevnet.rpcUrls.default.http[0];
export class WalletNetworkError extends Error {}
function networkFailure(error: unknown): WalletNetworkError {
  const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'number' ? error.code : undefined;
  if (code === -32002) return new WalletNetworkError('A wallet request is already pending. Open MetaMask and complete or dismiss its existing request, then reconnect.');
  if (code === 4001) return new WalletNetworkError('The wallet network request was declined. Switch the selected wallet to Studio Dev before trying again.');
  if (code === 4900 || code === 4901) return new WalletNetworkError('The selected wallet is disconnected from Studio Dev. Open the extension and check its network connection.');
  return new WalletNetworkError(`The selected wallet could not verify Studio Dev${Number.isInteger(code) ? ` (provider code ${code})` : ''}. Open the extension and reconnect its network.`);
}
export function studioChain(endpoint: string) {
  if (studioDevnet.id !== 61997 || !studioDevnet.consensusMainContract || !isAddress(studioDevnet.consensusMainContract.address)) throw new Error('Studio Dev chain configuration is invalid.');
  return { ...studioDevnet, rpcUrls: { ...studioDevnet.rpcUrls, default: { http: [endpoint] } } };
}
export async function ensureStudioNetwork(provider: EVMProvider) {
 let step = 'READ_CHAIN';
 let observed: unknown;
 try {
  const chainId = `0x${studioDevnet.id.toString(16)}`;
  const current = await provider.request({ method: 'eth_chainId' });
  observed = current;
  if (typeof current === 'string' && current.toLowerCase() === chainId) return;
  step = 'SWITCH_CHAIN';
  try { await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] }); }
  catch (error) {
    if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 4902) throw error;
    step = 'ADD_CHAIN';
    await provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId, chainName: studioDevnet.name, nativeCurrency: studioDevnet.nativeCurrency, rpcUrls: [officialWalletRPC], blockExplorerUrls: ['https://explorer-studio-dev.genlayer.com'] }] });
    step = 'SWITCH_CHAIN';
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
  }
  step = 'VERIFY_CHAIN';
  observed = await provider.request({ method: 'eth_chainId' });
  if (observed !== chainId) throw new Error('The selected wallet did not switch to Studio Dev.');
 } catch (error) {
   const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'number' ? error.code : null;
   const errorClass = error instanceof Error && ['Error', 'TypeError', 'ReferenceError', 'RangeError'].includes(error.name) ? error.name : 'ProviderError';
   const text = error instanceof Error ? error.message : '';
   console.info('ScopeExit wallet preflight', JSON.stringify({ step, code, errorClass, observedChain: typeof observed === 'string' && /^0x[0-9a-f]{1,16}$/i.test(observed) ? observed : null, hints: ['undefined', 'not a function', 'read only', 'pending', 'switch', 'disconnect', 'Proxy', 'frozen'].filter(x => text.includes(x)) }));
   throw networkFailure(error);
 }
}

export async function checkBrowserRPC() {
  for (const path of [IC_RPC, WALLET_RPC]) {
    const response = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] }) });
    const result = await response.json();
    if (!response.ok || result.error || BigInt(result.result) !== BigInt(studioDevnet.id)) throw new Error('Studio Dev RPC identity could not be verified.');
  }
  return true;
}
