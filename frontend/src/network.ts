import { studioDevnet } from 'genlayer-js/chains';
import { isAddress } from 'viem';
import type { EVMProvider } from './wallet';

export const IC_RPC = '/api/ic-rpc';
export const WALLET_RPC = '/api/wallet-rpc';
export const officialWalletRPC = studioDevnet.rpcUrls.default.http[0];
export function studioChain(endpoint: string) {
  if (studioDevnet.id !== 61997 || !studioDevnet.consensusMainContract || !isAddress(studioDevnet.consensusMainContract.address)) throw new Error('Studio Dev chain configuration is invalid.');
  return { ...studioDevnet, rpcUrls: { ...studioDevnet.rpcUrls, default: { http: [endpoint] } } };
}
export async function ensureStudioNetwork(provider: EVMProvider) {
  const chainId = `0x${studioDevnet.id.toString(16)}`;
  const current = await provider.request({ method: 'eth_chainId' });
  if (typeof current === 'string' && current.toLowerCase() === chainId) return;
  try { await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] }); }
  catch (error) {
    if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 4902) throw new Error('Approve switching your selected wallet to Studio Dev.');
    await provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId, chainName: studioDevnet.name, nativeCurrency: studioDevnet.nativeCurrency, rpcUrls: [officialWalletRPC], blockExplorerUrls: ['https://explorer-studio-dev.genlayer.com'] }] });
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
  }
  if (await provider.request({ method: 'eth_chainId' }) !== chainId) throw new Error('The selected wallet did not switch to Studio Dev.');
}

export async function checkBrowserRPC() {
  for (const path of [IC_RPC, WALLET_RPC]) {
    const response = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] }) });
    const result = await response.json();
    if (!response.ok || result.error || BigInt(result.result) !== BigInt(studioDevnet.id)) throw new Error('Studio Dev RPC identity could not be verified.');
  }
  return true;
}
