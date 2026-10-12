# ScopeExit milestone program

## Accepted baseline

On 2026-10-12 the owner explicitly confirmed that ScopeExit was accepted and
directed implementation without another Portal verification gate. Acceptance
authority for this run is that owner confirmation; no independent Portal
acceptance record or awarded score is claimed. The previous observed submission
was Projects, ID prefix adc69bb2, submitted 2026-10-07.

Pinned repository baseline: `6720db3136498dacef2a81fbedd250de5b1ced66`.
Contract source: `9e5de0c122f27967c735034bd73dc67961bbe6cb`.
Studio Dev contract: `0x61619ed664eAB90043765E5bA431EDa35F260fb5`.
Runner/API: concrete 5j runner, v0.3.0, as recorded in deployment.json.
Baseline: two internal rights, semantic dependency review, GEN escrow/refunds,
seven frontend routes and typed wallet writes; no actual consumer enforcement.

## Active phase

| ID | Title | Status | Baseline | Relationship | Commit range | Deployment | Evidence | Portal | Outcome | Follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MS-001 | Wallet-authorized dataset export consumer | BUILDING | 6720db3 | NEW; extends internal rights into an actual consumer-owned delivery endpoint | 6720db3..PENDING | Retain accepted IC; new Vercel consumer endpoint | [Dossier](milestones/MS-001/README.md) | NOT_SUBMITTED | Pending | Graph expansion deferred |

Only MS-001 is active. No previous milestone exists. Acceptance of this phase
must be reconciled before another phase is selected.

## Adaptive backlog

1. NEW: actual dataset-export consumer, chosen as the smallest complete integration.
2. EXTENDS: bounded multi-component prerequisite graphs, deferred to a separate
   phase with its own value model, deployment and full graph evidence.
3. NEW: additional independently operated consumer and measured adoption,
   deferred; the demonstration service is not third-party adoption.
4. EXTENDS: authenticated external exercise/delivery receipts, deferred; no
   outside delivery attestation is used to move GEN in MS-001.
5. REMEDIATES: onboarding, open examples and broader extension QA support these
   increments but cannot be submitted alone as a milestone.

## Claim and evidence inventory

The accepted contract, 111 tests, four closed funded cases, six native transfers,
issuer MetaMask journey and twelve instructions are baseline evidence only.
MS-001 may claim only its new consumer policy/authentication/delivery controls,
new tests, new browser path and new phase-specific live evidence. No historical
receipt, screenshot or baseline test is counted as new impact.
