# ScopeExit

ScopeExit is a GenLayer project for purchasing two conditional permissions, cancelling their dependent unused parts, and keeping independent rights with exact GEN accounting.

Status: implemented and locally verified, with a deployed Studio Dev contract and three finalized native-GEN lifecycles. Actual browser canonical reads are verified. Browser-wallet signing, public hosting, CI, adoption and submission evidence remain pending.

The issuer and buyer ratify exact terms for protocol-created rights. GenLayer validators interpret the semantic prerequisites; deterministic code governs cancellation, one-time exercise, fixed refunds and withdrawals. Each component costs 1 GEN; the purchase costs 2 GEN. These permissions do not prove external delivery, ownership or legal enforceability.

Product specification: [docs/README.md](docs/README.md).

Run `python -m venv .venv` using Python 3.12, install `requirements.txt`, run
`npm ci` and `npm --prefix frontend ci`, then `npm run check`.
Start the frontend with `npm --prefix frontend run dev`; the deployed contract
address is configured through `frontend/.env` (see `.env.example`).

Local testing and simulator limitations: [LOCAL-VERIFICATION.md](docs/LOCAL-VERIFICATION.md).

## Deployed Contract

Studio Dev (chain 61997): `0x61619ed664eAB90043765E5bA431EDa35F260fb5`.
[Contract Explorer](https://explorer-studio-dev.genlayer.com/address/0x61619ed664eAB90043765E5bA431EDa35F260fb5).

The deployed source is commit `9e5de0c122f27967c735034bd73dc67961bbe6cb`, pinned to the v0.3 / 5j GenVM API family. [Deployment and lifecycle proof](docs/evidence/studio-dev/README.md) records dependent cancellation, independent-right preservation and exercise, ambiguous review, expiry recovery, and exact native withdrawal decreases. Purchase deposits were 2 GEN; refunds and earnings withdrawals were 1 or 2 GEN. All three cases closed with zero remaining liabilities; 6 GEN received equals 6 GEN withdrawn.

## Verification

`npm run check` currently passes GenVM lint, 74 direct Python tests, one three-validator GLSim integration, five Node tooling tests, 28 frontend tests, TypeScript and the production build, with no skipped tests. Simulator behavior is distinct from actual Studio Dev execution and extension signing.

[Browser read proof](docs/evidence/local/frontend/state-review.json) checks actual deployed agreement views, results, and canonical history through the same-origin IC proxy. The app includes seven routes, detected-wallet selection, logout and all nine write wrappers; real extension signing evidence remains pending.

## Live App

Production hosting has not yet been verified. Run the local app with the deployed address to inspect canonical state; do not treat a local URL as public hosting evidence.

## Limits

The current primitive handles exactly two permissions and fixed whole-GEN prices. Mutual prerequisite cycles and unclear terms remain retryable, with unused escrow recoverable at expiry. It does not authenticate external model generation, delivery, ownership, legal enforceability, or consumer adoption. No separately deployed consumer is claimed.
