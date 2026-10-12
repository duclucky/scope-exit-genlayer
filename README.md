# ScopeExit

ScopeExit is a GenLayer project for purchasing two conditional permissions, cancelling their dependent unused parts, and keeping independent rights with exact GEN accounting.

Accepted baseline: the owner confirmed Project acceptance on 2026-10-12, at repository baseline `6720db3`. An independent Portal acceptance record and awarded score are not claimed. The original contract, native lifecycles, canonical browser reads and issuer MetaMask journey remain baseline evidence; buyer counterparts were script-signed. [MS-001](docs/milestones/MS-001/README.md) adds a registered dataset-export consumer and tracks its new evidence separately. No milestone has been submitted.

The issuer and buyer ratify exact terms for protocol-created rights. GenLayer validators interpret the semantic prerequisites; deterministic code governs cancellation, one-time exercise, fixed refunds and withdrawals. Each component costs 1 GEN; the purchase costs 2 GEN. These permissions do not prove external delivery, ownership or legal enforceability.

Product specification: [docs/README.md](docs/README.md).
Full issuer/buyer walkthrough: [12 detailed steps](docs/HOW-TO.md), including recovery and unfunded cancellation.

Run `python -m venv .venv` using Python 3.12, install `requirements.txt`, run
`npm ci` and `npm --prefix frontend ci`, then `npm run check`.
Start the frontend with `npm --prefix frontend run dev`; the deployed contract
address is configured through `frontend/.env` (see `.env.example`).

Local testing and simulator limitations: [LOCAL-VERIFICATION.md](docs/LOCAL-VERIFICATION.md).

## Deployed Contract

Studio Dev (chain 61997): `0x61619ed664eAB90043765E5bA431EDa35F260fb5`.
[Contract Explorer](https://explorer-studio-dev.genlayer.com/address/0x61619ed664eAB90043765E5bA431EDa35F260fb5).

The deployed source is commit `9e5de0c122f27967c735034bd73dc67961bbe6cb`, pinned to the v0.3 / 5j GenVM API family. [Deployment and lifecycle proof](docs/evidence/studio-dev/README.md) records dependent cancellation, independent-right preservation and exercise, ambiguous review, expiry recovery, and exact native withdrawal decreases. Purchase deposits were 2 GEN; refunds and earnings withdrawals were 1 or 2 GEN. Those three cases closed with zero remaining liabilities. An additional browser issuer case also closed: current totals are 8 GEN received and 8 GEN withdrawn, with zero escrow, credits and native contract balance.

## Verification

`npm run check` passes GenVM lint, 74 direct Python tests, one three-validator GLSim integration, 32 Node tooling tests, 35 frontend tests, TypeScript and the production build: 142 tests with no skipped tests. Simulator behavior is distinct from actual Studio Dev execution and extension signing.

[Browser read proof](docs/evidence/local/frontend/state-review.json) checks actual deployed agreement views, results, and canonical history through the same-origin IC proxy. The app includes seven routes, detected-wallet selection, logout and all nine write wrappers. [Browser publication proof](docs/evidence/studio-dev/browser-sx-ddc3df46-create_offer.json) binds a real MetaMask-signed, finalized successful transaction to its canonical agreement. [Browser issuer lifecycle proof](docs/BROWSER-EVIDENCE.md) covers publication, review, withdrawal and closure, with buyer counterpart actions explicitly script-signed.

## Live App

[ScopeExit](https://scope-exit-genlayer.vercel.app). HTTP 200, the ScopeExit HTML title and React root were verified with `curl.exe`. [Production browser proof](docs/evidence/studio-dev/frontend-production/state-review.json) reads the four finalized agreements and canonical history; [RPC proof](docs/evidence/studio-dev/frontend-production/rpc-review.json) verifies both browser proxy paths. Read proof is distinct from extension-signed writes.

[Public repository](https://github.com/duclucky/scope-exit-genlayer) and [CI workflow](https://github.com/duclucky/scope-exit-genlayer/actions/workflows/check.yml). The submission packet identifies the successful run for the final public commit.

## Architecture and deployment

One `ScopeExit` Intelligent Contract owns immutable ratified terms, semantic review, rights, escrow and credits. The selected EVM extension signs transactions through the Studio Dev wallet path. Canonical Intelligent Contract reads and fee estimation use separate same-origin proxy routes. Seven frontend routes cover offer creation, purchase and review, partial cancellation, exercise, recovery, withdrawals and history.

For a fresh authorized Studio Dev deployment:

1. Install the pinned Python 3.12 requirements and root/frontend npm dependencies, then run `npm run check`.
2. Discover signing configuration from the ignored project `.env`, then the authorized parent `.env`. Never print or place keys in frontend environment variables.
3. Run `node scripts/runtime_smoke.mjs`, commit the contract source, and run `node scripts/studio.mjs inspect` before signing.
4. Run `node scripts/studio.mjs deploy` and `node scripts/studio.mjs zero-smoke`. Verify finalized successful execution, policy and sole payable purchase metadata.
5. Run `node scripts/studio.mjs lifecycle dependent`, `independent` and `unclear`. The unclear case waits for its immutable expiry; rerun after expiry to resume recovery. Commands reuse finalized attempts and never replay an ambiguous submission.
6. Write the returned public address into ignored `frontend/.env` as `VITE_CONTRACT_ADDRESS`, then run the frontend and production build. Use the detected-wallet picker and sign only after reading the exact terms.

The checked-in evidence belongs to the active address above. A new revision needs its own source/network identity and receipts; the unsigned runtime smoke is not a deployment or transfer.

One-line pitch: Cancel dependent unused permissions, recover their GEN, and keep the rights that stand on their own through GenLayer semantic consensus.

## Limits

The current primitive handles exactly two permissions and fixed whole-GEN prices. Mutual prerequisite cycles and unclear terms remain retryable, with unused escrow recoverable at expiry. It does not authenticate external model generation, delivery, ownership, legal enforceability, or consumer adoption. No additional consumer IC is deployed. MS-001's consumer enforces its own endpoint over public synthetic CSV content; it does not make public bytes confidential or prove outside fulfilment. A two-minute signed delivery request is reusable for idempotent redownload of the same resource.

## Registered dataset consumer (MS-001)

The consumer's locked issuer can select **Use registered dataset scopes** in the
offer form. After a named buyer purchases, reviews and exercises **Dataset export**,
the agreement exposes **Download verified CSV**. The selected wallet signs a
read authorization; the server verifies its buyer signature, domain, chain,
contract, exact terms/digest, resource hash and finalized exercise history.
Delivery retry sends no GEN and never exercises or pays again. Only the locked
service issuer's exact resource grant is accepted; a lookalike offer grants no
access. See the phase dossier for current local, Studio Dev, live-service and
browser-extension proof status.

A bounded extension-verification grant also admits issuer
0x45248be151F7f7e230150db23774733Cd966Eb45 only for case
ms001-extension-v1 and buyer 0xc495ef51618d03267a1f227afe5b27b38c748272.
It requires the same exact resource terms and finalized exercise; changing the
case or buyer denies access. This preserves all original grants and lets the
owner verify delivery using an existing extension account without importing keys.

MS-001 now has two additional CLOSED funded cases, four exact 1 GEN native
withdrawals and verified 64-byte consumer delivery. The owner reported the
extension download and supplied the matching CSV rows; its evidence is labeled
separately from independently executed script-signer browser QA.
Current global totals: 12 GEN received/withdrawn, zero liabilities/native balance.
The original 8 GEN checkpoint above remains baseline context.
