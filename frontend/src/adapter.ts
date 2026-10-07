export type ComponentId = 'A' | 'B';
export type Dependency = 'DEPENDENT' | 'INDEPENDENT' | 'UNVERIFIABLE';
export type ComponentStatus = 'LOCKED' | 'ACTIVE' | 'CONSUMED' | 'CANCELLED' | 'EXPIRED';
export type Phase = 'OFFERED' | 'FUNDED' | 'RETRYABLE' | 'REVIEWED' | 'CANCELLED' | 'CLOSED';
export interface Permission { id: ComponentId; title: string; terms: string; status: ComponentStatus }
export interface Agreement {
  id: string; title: string; issuer: string; buyer: string; digest: string; expiry: number;
  phase: Phase; permissions: [Permission, Permission]; dependencies: [Dependency, Dependency] | null;
  escrowGEN: string; buyerCreditGEN: string; issuerCreditGEN: string; attempt: number;
  reviewReason?: string;
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
export const activityLabel: Record<string, string> = {
  OFFER_CREATED: 'Offer published', PURCHASE_RATIFIED: 'Purchase confirmed', REVIEW_ACCEPTED: 'Dependencies reviewed', REVIEW_RETRYABLE: 'Review needs another attempt',
  CANCEL_A: 'Unused permissions cancelled', CANCEL_B: 'Unused permissions cancelled', EXERCISE_A: 'Permission A used', EXERCISE_B: 'Permission B used',
  UNUSED_ESCROW_RECOVERED: 'Expired escrow recovered', BUYER_WITHDRAWAL: 'Buyer refund withdrawn', ISSUER_WITHDRAWAL: 'Issuer earnings withdrawn', UNFUNDED_OFFER_CANCELLED: 'Unfunded offer cancelled', AGREEMENT_CLOSED: 'Agreement finished',
};
export const reviewReasonLabel: Record<string, string> = {
  SOURCE_UNAVAILABLE: 'The fixed reference could not be retrieved. No permission or payment was allocated.',
  SOURCE_VERSION: 'The reference version could not be confirmed. Purchase funds remain protected.',
  SOURCE_DIGEST: 'The retrieved reference differs from the locked version. Purchase funds remain protected.',
  SOURCE_PARSE: 'The reference could not be read safely. Purchase funds remain protected.',
  MODEL_FORMAT: 'The review could not return a usable decision. No permission or payment was allocated.',
  MODEL_SCHEMA: 'The review did not cover the required permission pairs correctly. No permission or payment was allocated.',
  MODEL_UNCLEAR: 'The terms do not establish clear prerequisites. Unused funds remain available for expiry recovery.',
  CYCLE_UNSUPPORTED: 'Both permissions require each other. This version cannot activate that cycle; recover unused funds at expiry.',
};
export function cancellationSet(a: Agreement, root: ComponentId): ComponentId[] {
  if (!a.dependencies) return [];
  const other = root === 'A' ? 'B' : 'A';
  const dependency = a.dependencies[other === 'A' ? 0 : 1];
  return dependency === 'DEPENDENT' ? [root, other] : [root];
}
export function sameAddress(a?: string, b?: string): boolean { return !!a && !!b && a.toLowerCase() === b.toLowerCase(); }
