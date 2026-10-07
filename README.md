# ScopeExit

ScopeExit is a GenLayer project for purchasing two conditional permissions, cancelling their dependent unused parts, and keeping independent rights with exact GEN accounting.

Status: implemented and locally verified. Studio Dev deployment, native GEN lifecycle, browser-wallet signing, public hosting, CI, adoption and submission evidence remain pending.

The issuer and buyer ratify exact terms for protocol-created rights. GenLayer validators interpret the semantic prerequisites; deterministic code governs cancellation, one-time exercise, fixed refunds and withdrawals. Each component costs 1 GEN; the purchase costs 2 GEN. These permissions do not prove external delivery, ownership or legal enforceability.

Product specification: [docs/README.md](docs/README.md).

Run `python -m venv .venv` using Python 3.12, install `requirements.txt`, run
`npm ci` and `npm --prefix frontend ci`, then `npm run check`.
Start the frontend with `npm --prefix frontend run dev`; the deployed contract
address is configured through `frontend/.env` (see `.env.example`).

Local testing and simulator limitations: [LOCAL-VERIFICATION.md](docs/LOCAL-VERIFICATION.md).
