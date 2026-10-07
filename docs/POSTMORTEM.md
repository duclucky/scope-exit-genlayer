# ScopeExit delivery review

Verified on 2026-10-07. Category: Projects. Portal submission and steward
acceptance remain pending until their respective confirmations exist.

## Delivered and verified

One deployed ScopeExit contract owns semantic prerequisite review, internal
rights and fixed GEN accounting. The seven-route application reads canonical
state and implements all nine writes through a selected EVM wallet. There are
111 passing tests: 74 direct Python, one three-validator integration, six
tooling and 30 frontend tests. GenVM lint, TypeScript and production build pass.

Four funded Studio Dev cases are closed. Six native withdrawals prove 8 GEN
leaving the contract in total; final escrow, credits and native balance are
zero. MetaMask issuer publication, review, withdrawal and closure were signed
by the owner and verified separately from script-signed buyer counterparts.
See [browser evidence](BROWSER-EVIDENCE.md) and [network evidence](evidence/studio-dev).

The actual Projects precheck returned `0 BLOCKER, 1 WARN, 7 auto-verified OK`.
The warning concerns a rejecting non-payable helper, with metadata and deployed
schema evidence reviewed in [PRECHECK-REVIEW.md](PRECHECK-REVIEW.md).
CI [37613285520](https://github.com/duclucky/scope-exit-genlayer/actions/runs/37613285520)
passed for implementation/evidence commit `70cd5e4`; later documentation commits
must be checked independently. The live application is
https://scope-exit-genlayer.vercel.app.

## Lessons

- Bind the runner hash and API family together. A newer runner failed bounded
  target probes; the verified compatible runner remained pinned.
- Validate receipt execution results explicitly. Mixed leader/validator entries
  are not several execution outcomes, and finality alone does not prove success.
- Test the real SDK account/provider boundary. A mocked write method cannot
  establish browser-wallet compatibility or correct value encoding.
- Preserve the distinction between issuer extension signatures and script-signed
  counterpart actions. An implemented button is not live browser execution proof.
- Capture balances before requesting a withdrawal signature. Require an exact
  native contract decrease, correct recipient and canonical accounting afterward.
- Keep provider/profiler failures on a finite public error allowlist; never
  forward raw validator configuration or unfiltered RPC errors to the browser.
- Give reviewers individual instructions for role changes, values, confirmation,
  canonical outcomes and recovery. The submission uses twelve detailed steps.

Two process deviations remain recorded: initial value/recovery method bodies
preceded their method-specific failing negative tests, and SDK dependency
preparation overlapped the last contract-check run. Implementation integration
waited for the passing result. Current verification passes; this does not
retroactively establish exact test-first or phase-order compliance.

## Next substantial increment

After an accepted baseline, extend the two-component mechanism to a bounded
multi-component prerequisite graph with complete ordered-pair coverage,
deterministic transitive closure and adversarial graph/accounting tests. Add one
real holder-authorized consumer integration that enforces its own permission
boundary. Record the delta from that accepted version and actual usage evidence.
Signed external exercise receipts would require a separate Evidence Authority
Matrix and live provenance tests. None of these additions is claimed today.

## Unverified scope

External delivery, ownership, legal enforceability, consumer adoption, other
networks, other live extension brands, smart-contract withdrawal recipients and
all nine distinct live extension actions remain unclaimed. Portal submission
does not itself establish acceptance or a score.
