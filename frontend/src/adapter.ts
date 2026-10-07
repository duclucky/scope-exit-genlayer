export type ComponentId = 'A' | 'B';
export type Dependency = 'DEPENDENT' | 'INDEPENDENT' | 'UNVERIFIABLE';
export type ComponentStatus = 'LOCKED' | 'ACTIVE' | 'CONSUMED' | 'CANCELLED' | 'EXPIRED';
export type Phase = 'OFFERED' | 'FUNDED' | 'RETRYABLE' | 'REVIEWED' | 'CANCELLED' | 'CLOSED';
export interface Permission { id: ComponentId; title: string; terms: string; status: ComponentStatus }
export interface Agreement {
  id: string; title: string; issuer: string; buyer: string; digest: string; expiry: number;
  phase: Phase; permissions: [Permission, Permission]; dependencies: [Dependency, Dependency] | null;
  escrowGEN: string; buyerCreditGEN: string; issuerCreditGEN: string; attempt: number;
}
export interface Activity { id: string; agreementId: string; title: string; action: string; at: number }
export interface OfferInput { id: string; title: string; buyer: string; titleA: string; termsA: string; titleB: string; termsB: string; expiry: number }
export type WriteMethod = 'create_offer' | 'accept_offer' | 'review_dependencies' | 'exit_component' | 'consume_component' | 'recover_expired' | 'withdraw' | 'cancel_offer' | 'close';
export type TxStage = 'signing' | 'submitted' | 'accepted' | 'finalized' | 'failed';
export interface TransactionProgress { stage: TxStage; hash?: string; message: string }
export interface ContractAdapter {
  configured: boolean;
  list(): Promise<Agreement[]>;
  agreement(id: string): Promise<Agreement>;
  history(): Promise<Activity[]>;
  write(method: WriteMethod, args: unknown[], valueGEN: '0' | '1' | '2', progress: (p: TransactionProgress) => void): Promise<void>;
}
export class ConfigurationError extends Error {
  constructor() { super('The deployed agreement service is not configured yet. Live reads and transactions will be available after deployment.'); }
}
export const phaseLabel: Record<Phase, string> = { OFFERED: 'Awaiting purchase', FUNDED: 'Ready for review', RETRYABLE: 'Review needs another try', REVIEWED: 'Permissions ready', CANCELLED: 'Offer cancelled', CLOSED: 'Complete' };
export const rightLabel: Record<ComponentStatus, string> = { LOCKED: 'Waiting for review', ACTIVE: 'Available', CONSUMED: 'Used', CANCELLED: 'Cancelled', EXPIRED: 'Expired' };
export function cancellationSet(a: Agreement, root: ComponentId): ComponentId[] {
  if (!a.dependencies) return [];
  const other = root === 'A' ? 'B' : 'A';
  const dependency = a.dependencies[other === 'A' ? 0 : 1];
  return dependency === 'DEPENDENT' ? [root, other] : [root];
}
export function sameAddress(a?: string, b?: string): boolean { return !!a && !!b && a.toLowerCase() === b.toLowerCase(); }
