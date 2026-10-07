# ScopeExit submission packet

Recommended category: **Projects**

Title / project name: **ScopeExit**

Primary tag: **Marketplaces**; focus: **Service Escrow**.

One-liner (174 characters, 22 words):

ScopeExit uses GenLayer semantic consensus to cancel dependent parts of prepaid permissions, refund unused GEN, and preserve independent rights with deterministic accounting.

Description (965 characters, excluding the final newline):

ScopeExit lets an issuer and named buyer ratify two internal permissions at 1 GEN each. GenLayer validators interpret whether either permission requires the other to remain active, using immutable signed terms and an exact-hash W3C reference. Independent replay compares prerequisite meaning; deterministic code validates coverage and computes cancellation scope, fixed refunds and one-time exercise earnings. Cancelling unused prerequisites refunds unused dependants; independent rights retain escrow. Ambiguity stays non-penalizing; expiry returns unused escrow to the buyer. Rights, history and accounting views form the reusable interface. One contract has four closed Studio Dev cases and six proven native withdrawals. The seven-route app reads canonical state; MetaMask issuer publication, review, withdrawal and closure are verified. Buyer counterpart actions are script-signed. External delivery, ownership, legal enforceability and adoption are unclaimed.

Website: https://scope-exit-genlayer.vercel.app

GitHub: https://github.com/duclucky/scope-exit-genlayer

Primary contract: https://explorer-studio-dev.genlayer.com/address/0x61619ed664eAB90043765E5bA431EDa35F260fb5

Consumer contract: N/A. The single primitive owns judgment, rights and GEN accounting; no pass-through consumer is deployed.

Lifecycle evidence: https://github.com/duclucky/scope-exit-genlayer/tree/main/docs/evidence/studio-dev

Browser issuer evidence: https://github.com/duclucky/scope-exit-genlayer/blob/main/docs/BROWSER-EVIDENCE.md

CI: https://github.com/duclucky/scope-exit-genlayer/actions/workflows/check.yml

Verified implementation/evidence checkpoint: commit `70cd5e4`, successful run
https://github.com/duclucky/scope-exit-genlayer/actions/runs/37613285520.
The final handoff identifies the successful run for the latest documentation
commit separately. A workflow link alone is not a CI success claim.

Demo video: optional on the authenticated Portal form; none claimed.

How-to: copy all 12 numbered steps from [HOW-TO.md](HOW-TO.md). The exact paired
heading/instruction fields are also available in [SUBMISSION-HOW-TO.json](SUBMISSION-HOW-TO.json).
They cover both roles, exact independent scopes, purchase, review, partial exit,
one-time exercise, both withdrawals, closure, recovery, cancellation and history.

Expected verification outcome (302 characters):

The independent case shows Analysis cancelled, Export used, zero escrow and a closed record. Evidence proves one 1 GEN buyer refund and one 1 GEN issuer withdrawal. The dependent case refunds 2 GEN; ambiguous review preserves escrow until expiry recovery. All results come from deployed contract views.

Verified facts:

- One deployed Intelligent Contract: ScopeExit; seven views and nine writes.
- 74 direct Python tests, one three-validator GLSim integration, six Node tooling tests, 30 frontend tests: 111 passing tests; no critical skip/xfail. GenVM lint, TypeScript and production build pass.
- Studio Dev only, chain 61997. Four funded cases closed; six native withdrawals; total 8 GEN received and withdrawn; zero escrow/credit/native balance in the final snapshot.
- Real MetaMask issuer publication, review, 1 GEN withdrawal and closure are finalized successfully, with canonical UI reload. The named buyer counterpart was script-signed. All nine wrappers have actual-SDK tests, but all nine distinct actions have not been manually signed through extensions.
- Actual local and production browser RPC/canonical reads pass. Public hosting is HTTP200 with the app title and React root.
- The Projects precheck reports zero BLOCKER and one reviewed helper-payability warning. This is not a zero-warning or official-scoring claim.

Why Projects:

ScopeExit delivers a seven-route application around the permission purchase and
partial cancellation workflow. GenLayer's validator judgment controls the
contract's rights and GEN consequences, and the frontend reads those canonical
outcomes and signs through a selected EVM extension. The contribution includes
the product, deployed primitive and observed issuer journey, so Projects fits
the delivered scope.

Limits:

Two internal one-time permissions, fixed 1 GEN slices, bounded review attempts
and no external delivery, ownership, legal enforceability or consumer adoption
claim. Other networks, other live extension brands and smart-contract native
withdrawal recipients have not been verified. Buyer browser actions remain an
implementation/test claim, with live script execution identified separately.

Portal draft was inspected in an authenticated session on 2026-10-07. It offers
12 how-to rows, an optional demo-video URL and reCAPTCHA. No submission or
acceptance is claimed until an actual confirmation is observed.

The completed delivery review, remaining scope limits and next substantial
milestone are recorded in [POSTMORTEM.md](POSTMORTEM.md).
