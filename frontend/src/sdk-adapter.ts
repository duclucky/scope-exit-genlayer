import { createClient } from 'genlayer-js';
import { TransactionHashVariant } from 'genlayer-js/types';
import type { CalldataEncodable, TransactionHash } from 'genlayer-js/types';
import { isAddress, getAddress, formatUnits } from 'viem';
import { ConfigurationError } from './adapter';
import type { Agreement, Activity, ContractAdapter, TransactionProgress } from './adapter';
import type { EVMProvider } from './wallet';
import { ensureStudioNetwork, IC_RPC, WALLET_RPC, studioChain } from './network';

export interface AdapterConfig { address?: string; account?: string; provider?: EVMProvider; icRPC?: string; walletRPC?: string }
const record = (raw: unknown): Record<string, unknown> => {
  if (typeof raw === 'string') raw = JSON.parse(raw);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Canonical response is invalid.');
  return raw as Record<string, unknown>;
};
export function mapAgreement(raw: unknown): Agreement {
  const a = record(raw);
  const phases = ['OFFERED', 'FUNDED', 'RETRYABLE', 'REVIEWED', 'CANCELLED', 'CLOSED'];
  const statuses = ['LOCKED', 'ACTIVE', 'CONSUMED', 'CANCELLED', 'EXPIRED'];
  if (typeof a.id !== 'string' || typeof a.title !== 'string' || typeof a.issuer !== 'string' || !isAddress(a.issuer) || typeof a.buyer !== 'string' || !isAddress(a.buyer)
      || typeof a.digest !== 'string' || !/^[a-f0-9]{64}$/.test(a.digest) || typeof a.phase !== 'string' || !phases.includes(a.phase)
      || !Number.isSafeInteger(a.expiry) || !Number.isSafeInteger(a.attempt) || !Array.isArray(a.permissions) || a.permissions.length !== 2
      || !a.permissions.every((p, i) => p && p.id === (i ? 'B' : 'A') && typeof p.title === 'string' && typeof p.terms === 'string' && statuses.includes(p.status))
      || !['escrowGEN', 'buyerCreditGEN', 'issuerCreditGEN'].every(k => typeof a[k] === 'string' && /^\d+$/.test(a[k] as string))
      || !(a.dependencies === null || Array.isArray(a.dependencies) && a.dependencies.length === 2 && a.dependencies.every(x => ['DEPENDENT', 'INDEPENDENT', 'UNVERIFIABLE'].includes(x)))) throw new Error('Canonical agreement fields could not be verified.');
  return a as unknown as Agreement;
}
export function successfulExecution(raw: unknown) {
  const r = record(raw);
  const c = r.consensus_data as { leader_receipt?: { execution_result?: string }[] } | undefined;
  const results = [r.executionResult, r.execution_result, ...(c?.leader_receipt?.map(x => x.execution_result) ?? [])].filter(x => x != null);
  return results.length > 0 ? results.every(x => x === 'SUCCESS') : r.txExecutionResultName === 'FINISHED_WITH_RETURN';
}
export function createSDKAdapter(config: AdapterConfig): ContractAdapter {
  const configured = typeof config.address === 'string' && isAddress(config.address) && !/^0x0{40}$/i.test(config.address);
  const target = () => { if (!configured) throw new ConfigurationError(); return getAddress(config.address!); };
  const reader = createClient({ chain: studioChain(config.icRPC ?? IC_RPC) });
  const read = async (functionName: string, args: CalldataEncodable[] = []) => reader.readContract({ address: target(), functionName, args, transactionHashVariant: TransactionHashVariant.LATEST_FINAL });
  const list = async () => {
    const agreements: Agreement[] = [];
    for (let page = 0; page < 200; page++) {
      const r = record(await read('list_agreements', [page * 50, 50]));
      if (!Array.isArray(r.records) || !Number.isSafeInteger(r.count) || Number(r.count) < 0) throw new Error('Canonical list pagination is invalid.');
      agreements.push(...r.records.map(mapAgreement));
      if (agreements.length >= Number(r.count)) return agreements;
      if (r.records.length !== 50) throw new Error('Canonical list is incomplete.');
    }
    throw new Error('Too many agreements to load. Narrowing pagination is required.');
  };
  return { configured, list, agreement: async id => mapAgreement(await read('get_agreement', [id])),
    history: async () => {
      const agreements = await list();
      const groups = await Promise.all(agreements.map(async a => {
        const raw = await read('get_history', [a.id]);
        const events = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!Array.isArray(events) || !events.every(e => e && typeof e.id === 'string' && e.agreementId === a.id && typeof e.title === 'string' && typeof e.action === 'string' && Number.isSafeInteger(e.at))) throw new Error('Canonical history is invalid.');
        return events as Activity[];
      }));
      return groups.flat();
    },
    write: async (method, rawArgs, valueGEN, progress) => {
      const address = target();
      if (!config.provider || !config.account || !isAddress(config.account)) throw new Error('Connect a valid selected wallet before signing.');
      if ((method === 'accept_offer' && valueGEN !== '2') || (method !== 'accept_offer' && valueGEN !== '0')) throw new Error('The selected action has an invalid GEN amount.');
      const value = BigInt(valueGEN) * 10n ** 18n;
      const args = rawArgs as CalldataEncodable[];
      let hash: TransactionHash | undefined;
      try {
        await ensureStudioNetwork(config.provider);
        const accounts = await config.provider.request({ method: 'eth_accounts' });
        if (!Array.isArray(accounts) || typeof accounts[0] !== 'string' || accounts[0].toLowerCase() !== config.account.toLowerCase()) throw new Error('The selected wallet account changed. Reconnect before signing.');
        const selected = config.provider;
        const writeChain = studioChain(config.walletRPC ?? WALLET_RPC);
        const writer = createClient({ chain: writeChain, account: getAddress(config.account), provider: { request: async (request: Parameters<EVMProvider['request']>[0]) => {
          const result = await selected.request(request);
          if (request.method === 'eth_sendTransaction' && typeof result === 'string' && /^0x[0-9a-f]{64}$/i.test(result)) {
            hash = result as TransactionHash;
            progress({ stage: 'submitted', hash, message: 'Transaction submitted. Waiting for its execution and consensus decision.' });
          }
          return result;
        } } });
        const fees = await writer.estimateTransactionFeesForWrite({ address, functionName: method, args, value, transactionHashVariant: TransactionHashVariant.LATEST_FINAL });
        progress({ stage: 'signing', message: `Review ${valueGEN} GEN and the network fee budget of ${formatUnits(fees.feeValue, 18)} GEN in your selected wallet.` });
        const submitted = await writer.writeContract({ address, functionName: method, args, value, fees: { distribution: fees.distribution, feeValue: fees.feeValue, messageAllocations: fees.messageAllocations } });
        if (hash !== submitted) progress({ stage: 'submitted', hash: submitted, message: 'Transaction submitted. Waiting for an accepted decision.' });
        hash = submitted;
        const accepted = await reader.waitForTransactionReceipt({ hash: hash!, waitUntil: 'decided', interval: 1500, retries: 120 });
        if (!successfulExecution(accepted)) throw new Error('The accepted execution was unsuccessful.');
        progress({ stage: 'accepted', hash, message: 'The decision is accepted. Finalization and canonical reload are still pending.' });
        const finalized = await reader.waitForTransactionReceipt({ hash: hash!, waitUntil: 'finalized', interval: 1500, retries: 160 });
        if (!successfulExecution(finalized)) throw new Error('Finalized execution was unsuccessful.');
        // Read the finalized owning entity before reporting completion.
        const fresh = mapAgreement(await read('get_agreement', [String(rawArgs[0])]));
        progress({ stage: 'finalized', hash, message: fresh.phase === 'RETRYABLE' ? 'Review could not establish clear dependencies. Escrow is unchanged. Retry within the attempt limit or recover unused funds after expiry.' : 'Successful finalization confirmed. The latest agreement state has been reloaded.' });
      } catch {
        const update: TransactionProgress = { stage: 'failed', hash, message: hash ? 'Confirmation is incomplete. Refresh canonical state and inspect this transaction before sending it again.' : 'The wallet action was not completed. Check the selected account and Studio Dev connection.' };
        progress(update);
        throw new Error(update.message);
      }
    } };
}
