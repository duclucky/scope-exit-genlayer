import { afterEach, describe, expect, it, vi } from 'vitest';
import { abi } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';
import { decodeFunctionData, fromRlp, hexToBytes, bytesToHex } from 'viem';
import { createSDKAdapter, mapAgreement, successfulExecution } from './sdk-adapter';
import { ensureStudioNetwork } from './network';
import type { EVMProvider } from './wallet';
import type { TransactionProgress, WriteMethod } from './adapter';

const sender = '0x1111111111111111111111111111111111111111';
const contract = '0x2222222222222222222222222222222222222222';
const issuer = '0x4444444444444444444444444444444444444444';
const hash = `0x${'33'.repeat(32)}`;
const agreement = { id: 'fixture', title: 'Fixture only', buyer: sender, issuer, digest: 'a'.repeat(64), expiry: 2000000000, phase: 'REVIEWED', permissions: [{ id: 'A', title: 'A', terms: 'A independent', status: 'ACTIVE' }, { id: 'B', title: 'B', terms: 'B independent', status: 'ACTIVE' }], dependencies: ['INDEPENDENT', 'INDEPENDENT'], escrowGEN: '2', buyerCreditGEN: '0', issuerCreditGEN: '0', attempt: 1 };
afterEach(() => vi.unstubAllGlobals());

function offline() {
  const requests: { endpoint: string; method: string }[] = [];
  const sends: Record<string, unknown>[] = [];
  let reads = 0;
  vi.stubGlobal('fetch', vi.fn(async (url: string, options: RequestInit) => {
    const request = JSON.parse(String(options.body));
    requests.push({ endpoint: String(url), method: request.method });
    let result: unknown;
    switch (request.method) {
      case 'sim_getFeeConfig': result = { enabled: false, policy: { genPerTimeUnit: '0', storageUnitPrice: '0', receiptGasPrice: '0' } }; break;
      case 'sim_estimateTransactionFees': result = { recommendedPreset: { distribution: { leaderTimeunitsAllocation: '0', validatorTimeunitsAllocation: '0', appealRounds: '0', executionBudgetPerRound: '0', executionConsumed: '0', totalMessageFees: '0', rotations: ['0'], maxPriceGenPerTimeUnit: '0', storageFeeMaxGasPrice: '0', receiptFeeMaxGasPrice: '0' }, feeValue: '0' } }; break;
      case 'eth_getTransactionCount': result = '0x0'; break;
      case 'eth_estimateGas': result = '0x30d40'; break;
      case 'eth_gasPrice': result = '0x0'; break;
      case 'eth_blockNumber': result = '0x1'; break;
      case 'eth_getTransactionReceipt': result = { transactionHash: hash, transactionIndex: '0x0', blockHash: hash, blockNumber: '0x1', from: sender, to: contract, cumulativeGasUsed: '0x0', gasUsed: '0x0', effectiveGasPrice: '0x0', logs: [], logsBloom: '0x' + '0'.repeat(512), status: '0x1', type: '0x0' }; break;
      case 'eth_getTransactionByHash': result = { hash, from: sender, to: contract, input: '0x', nonce: '0x0', value: '0x0', gas: '0x30d40', gasPrice: '0x0', blockHash: hash, blockNumber: '0x1', transactionIndex: '0x0', type: '0x0', status: 'FINALIZED', execution_result: 'SUCCESS', consensus_data: { leader_receipt: [{ execution_result: 'SUCCESS' }] } }; break;
      case 'sim_getTransactionByHash': result = { status: 'FINALIZED', execution_result: 'SUCCESS', consensus_data: { leader_receipt: [{ execution_result: 'SUCCESS' }] } }; break;
      case 'gen_call': reads++; result = bytesToHex(abi.calldata.encode(JSON.stringify(agreement))).slice(2); break;
      default: throw new Error(`Unexpected offline RPC ${request.method}`);
    }
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: request.id, result }), { headers: { 'content-type': 'application/json' } });
  }));
  const provider: EVMProvider = { request: async request => {
    if (request.method === 'eth_chainId') return '0xf22d';
    if (request.method === 'eth_accounts') return [sender];
    if (request.method === 'eth_sendTransaction') { sends.push((request.params as Record<string, unknown>[])[0]); return hash; }
    throw new Error(`Unexpected offline wallet method ${request.method}`);
  } };
  return { provider, sends, requests, reads: () => reads };
}

describe('actual project adapter through the real SDK, intercepted I/O only', () => {
  it.each(['create_offer', 'accept_offer', 'review_dependencies', 'exit_component', 'consume_component', 'recover_expired', 'withdraw', 'cancel_offer', 'close'] as WriteMethod[])('%s binds caller, target, GEN, finality and finalized reload', async method => {
    const io = offline();
    const adapter = createSDKAdapter({ address: contract, account: sender, provider: io.provider, icRPC: 'https://ic.offline.invalid', walletRPC: 'https://wallet.offline.invalid' });
    const progress: TransactionProgress[] = [];
    await adapter.write(method, ['fixture'], method === 'accept_offer' ? '2' : '0', p => progress.push(p));
    expect(io.sends).toHaveLength(1);
    expect(String(io.sends[0].from).toLowerCase()).toBe(sender);
    expect(String(io.sends[0].to).toLowerCase()).toBe(studioDevnet.consensusMainContract!.address.toLowerCase());
    expect(BigInt(String(io.sends[0].value))).toBe(method === 'accept_offer' ? 2n * 10n ** 18n : 0n);
    const decoded = decodeFunctionData({ abi: studioDevnet.consensusMainContract!.abi, data: io.sends[0].data as `0x${string}` });
    expect(decoded.functionName).toBe('addTransaction');
    const parameters = decoded.args![0] as { sender: string; recipient: string; userValue: bigint; txCalldata: `0x${string}` };
    expect(parameters.sender.toLowerCase()).toBe(sender);
    expect(parameters.recipient.toLowerCase()).toBe(contract);
    expect(parameters.userValue).toBe(method === 'accept_offer' ? 2n * 10n ** 18n : 0n);
    const encoded = fromRlp(parameters.txCalldata, 'hex') as `0x${string}`[];
    expect(abi.calldata.decode(hexToBytes(encoded[0]))).toEqual(new Map<string, unknown>([['', method], ['args', ['fixture']]]));
    expect(progress.map(p => p.stage)).toEqual(['signing', 'submitted', 'accepted', 'finalized']);
    expect(io.reads()).toBe(1);
    expect(io.requests.filter(r => r.method === 'gen_call').every(r => r.endpoint === 'https://ic.offline.invalid')).toBe(true);
    expect(io.requests.filter(r => r.method === 'sim_estimateTransactionFees').every(r => r.endpoint === 'https://wallet.offline.invalid')).toBe(true);
  });
  it('missing configuration, disconnected account and invalid amounts fail before wallet sends', async () => {
    const io = offline();
    for (const options of [{}, { address: 'undefined' }, { address: contract }, { address: contract, account: 'undefined', provider: io.provider }]) {
      await expect(createSDKAdapter(options).write('withdraw', ['fixture'], '0', () => {})).rejects.toThrow();
    }
    await expect(createSDKAdapter({ address: contract, account: sender, provider: io.provider }).write('withdraw', ['fixture'], '1', () => {})).rejects.toThrow('GEN');
    expect(io.sends).toHaveLength(0);
    expect(io.requests).toHaveLength(0);
  });
});

it('requires execution success, never finality alone', () => {
  expect(successfulExecution({ status: 'FINALIZED' })).toBe(false);
  expect(successfulExecution({ status: 'FINALIZED', execution_result: 'ERROR' })).toBe(false);
  expect(successfulExecution({ consensus_data: { leader_receipt: [{ execution_result: 'SUCCESS' }] } })).toBe(true);
  expect(() => mapAgreement({ ...agreement, buyer: 'undefined' })).toThrow();
  expect(() => mapAgreement({ ...agreement, dependencies: ['PAY', 'INDEPENDENT'] })).toThrow();
});

it('adds only the verified chain after unknown-chain error, then verifies switching', async () => {
  let chain = '0x1';
  const calls: string[] = [];
  let firstSwitch = true;
  const provider: EVMProvider = { request: async request => {
    calls.push(request.method);
    if (request.method === 'eth_chainId') return chain;
    if (request.method === 'wallet_switchEthereumChain') { if (firstSwitch) { firstSwitch = false; throw { code: 4902 }; } chain = '0xf22d'; return null; }
    if (request.method === 'wallet_addEthereumChain') return null;
    throw new Error('Unexpected chain test request');
  } };
  await ensureStudioNetwork(provider);
  expect(calls).toEqual(['eth_chainId', 'wallet_switchEthereumChain', 'wallet_addEthereumChain', 'wallet_switchEthereumChain', 'eth_chainId']);
});
