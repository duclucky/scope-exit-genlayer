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
| MS-001 | Wallet-authorized dataset export consumer | SUBMISSION_READY | 6720db3 | NEW; extends internal rights into an actual consumer-owned delivery endpoint | 6720db3..51b1375 implementation; later docs-only closure | Retained IC; production dpl_9jzpHGwKMtF3UC2Ezmeu27gzmLjo | [Dossier](milestones/MS-001/README.md) | NOT_SUBMITTED | Pending | Graph expansion deferred; extension popup unclaimed |

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

## Candidate review and ten-dimension comparison

Compared prior milestone IDs: none. Comparison target is the original accepted
Project at 6720db3, including its source, deployment, docs and all claimed evidence.

| Dimension | MS-001 consumer (NEW) | Graph increment (EXTENDS, deferred) | Independent consumer (NEW, deferred) | Signed fulfilment (NEW, deferred) |
| --- | --- | --- | --- | --- |
| User capability/journey | Exercise -> authorize -> real CSV | More than two interdependent rights | Third-party endpoint use | Authenticated external fulfilment |
| Trust/failure | Unauthorized resource delivery | Incomplete graph closure | Operator boundary isolation | Forged delivery report |
| Methods/storage/transitions | Accepted IC retained; delivery API new | New IC schema/state required | New consumer policy | New receipt acceptance rules |
| Judgment/authenticated evidence | Accepted judgment; EIP-191 buyer auth | Larger bounded pair judgment | Accepted judgment; consumer-owned authority | New issuer/origin evidence |
| Consequence/GEN | Real delivery after existing exercise; GEN unchanged | New closure/value law | External endpoint enforcement | Potential new settlement consequence |
| Integration/deployment | New Vercel export API | New Studio deployment | Separate operator deployment | Signing/origin integration |
| Frontend writes/views | Existing exercise plus signed delivery; final views | New bundle creation/read paths | Consumer-specific workflow | Receipt/recovery workflow |
| Tests/lifecycle | 27 new tests plus new consumer case | New graph adversarial lifecycle | Live independent integration | Authenticity/replay lifecycle |
| Adoption/window | Owner-operated test only, 2026-10-12 | No usage yet | External evidence absent | No usage yet |
| Evidence overlap | Baseline cited only; new ms-001 evidence | No prior graph evidence | No external consumer evidence | No prior authenticated receipt evidence |

All four directions could qualify as substantial functionality, preserve the
accepted primitive, require a documented independent delta and move toward
usage. Only MS-001 has a bounded ready authority/evidence path now. Graph work
would add unnecessary contract/value scope to this phase. Independent adoption
needs a real outside operator; signed fulfilment needs an authoritative issuer
and its own gate process. Neither can be implied by a local demonstration.
Routine UI remediation/seed data alone fails substantiality and is not selected.

## 2026-10-12 verification amendment

MS-001 progressed SELECTED -> BUILDING -> VERIFIED -> SUBMISSION_READY.
Eight new Studio Dev script-signed transactions finalized SUCCESS; the case is
CLOSED after two exact 1 GEN withdrawals. Local check138 tests PASS;
implementation CI38192841555 at51b1375 SUCCESS. Production deployed and actual
browser delivery QA passed with a real authorized Node-side signature, exact
bytes/digest, canonical reads and logout. This does not claim a Chrome extension
popup or adoption. The selected claim is limited to the operational consumer
and verified browser interface; historical exercise proof remains distinct.
Submission copy929 chars and eleven detailed steps are in the dossier.
Final Portal Submit has not been authorized or performed. Accepted baseline
remains6720db3; no later phase is selected.
