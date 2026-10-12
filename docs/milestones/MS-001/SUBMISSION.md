# MS-001 copy-ready fields

Status: DRAFT, NOT_SUBMITTED. Use only after the evidence checklist is completed.
Final Portal Submit requires explicit action-time authorization.

Category: Milestones

Title: ScopeExit: wallet-authorized dataset export consumer

What changed: ScopeExit now enforces finalized permission exercise in a real CSV delivery endpoint with buyer signatures and exact resource binding.

Why it matters: A consumer can use the accepted rights primitive to enforce its own delivery boundary while preserving canonical dependency and GEN accounting.

Description:

ScopeExit adds an operational dataset-export consumer to the accepted two-permission primitive. A registered issuer locks the resource version and SHA-256 into the exact buyer-ratified terms. GenLayer still judges prerequisites; finalized cancellation preserves independent Export and its one-time exercise opens issuer earnings. The consumer verifies a short-lived buyer signature, domain/chain/contract/entity/digest binding and finalized exercise history before returning CSV. The app verifies the returned bytes and supports idempotent redownload without another payment. Contract semantics and the accepted deployment are retained. New authentication, provenance, timestamp, state and byte-integrity tests extend the regression suite. Phase-specific Studio Dev and live endpoint evidence are linked in the dossier. Synthetic public data is used; no confidentiality, outside delivery truth or third-party adoption is claimed.

Website: https://scope-exit-genlayer.vercel.app

Changed path: https://scope-exit-genlayer.vercel.app/#/agreements/ms001-export-v1

GitHub: https://github.com/duclucky/scope-exit-genlayer

Contract: https://explorer-studio-dev.genlayer.com/address/0x61619ed664eAB90043765E5bA431EDa35F260fb5

Baseline: 6720db3136498dacef2a81fbedd250de5b1ced66, owner-confirmed accepted.

Current implementation commit / CI: PENDING_VERIFICATION.

Exact steps: [HOW-TO.md](HOW-TO.md).

Expected outcome: Only the registered grant's named buyer can authorize CSV delivery after finalized Export exercise. The CSV digest matches the locked resource. An outsider signature or an unexercised right is denied. Delivery retry moves no GEN and creates no second exercise. Refund and earnings withdrawals retain exact native balance proofs.

Usage measurement: one owner-operated agreement, deduplicated by agreement ID,
digest and resource version. Repeat HTTP reads are not new users or adoption.

Limits: public synthetic dataset, one service-owned issuer and resource, EOA
signatures, Studio Dev only. Extension-operated consumer delivery evidence is
pending until observed; script EIP-191 signing is recorded separately. No
independent Portal acceptance record or score is inferred from the owner report.
