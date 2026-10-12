# MS-001: wallet-authorized dataset export consumer

Status: SUBMISSION_READY. Baseline: 6720db3136498dacef2a81fbedd250de5b1ced66.
Owner confirmation on 2026-10-12 establishes acceptance for this run; independent
Portal acceptance and points are not claimed. Portal milestone: NOT_SUBMITTED.

## Bounded delta and user journey

An actual ScopeExit-operated CSV delivery endpoint checks a named buyer's signed
request and finalized canonical consumption of permission B before returning
the registered bytes. The service owns the demonstration dataset and authority
policy. Only its locked issuer may grant this service permission; arbitrary
issuer offers, model prose and caller-supplied resource URLs cannot grant access.

The buyer purchases and reviews the exact resource-bound scopes through the
existing flow, cancels independent Analysis A if desired, exercises Export B,
then signs a short-lived export authorization. The endpoint verifies the signer,
domain, chain, contract, entity digest, resource version/hash, timestamp and
finalized canonical exercise event. It returns CSV bytes with their digest.
Identical authorized requests may redownload identical bytes; this is explicitly
idempotent delivery, not another exercise, payment or one-time HTTP claim.

GEN remains entirely in the accepted contract. Purchase is 2 GEN, exercise
credits 1 GEN to the immutable issuer; withdrawals and zero-liability closure
are unchanged. Failed delivery does not reverse a consumed right or certify
external fulfilment. Delivery can be retried for the same consumed right.

Non-goals: graph expansion, another IC, outside IP ownership, third-party
adoption, private dataset confidentiality, signed delivery attestations, model
generation provenance, other networks or dependency/runtime upgrades. The
synthetic dataset is public demonstration content; endpoint enforcement is real
but does not make publicly published bytes secret.

## Quality and overlap audit

No previous milestone IDs exist. NEW on user capability, trust failure (outsider
claiming a consumed holder right), integration/API surface, frontend delivery,
authentication tests and live consumer evidence. Retained contract/storage,
semantic review and fixed GEN consequences are baseline infrastructure, not
new claims. No adoption metric is asserted: measured requests will be identified
as owner-operated tests, deduplicated by agreement/digest/resource.

The delta is substantial integration functionality, preserves accepted semantics,
has a documented before/after (internal exercise only -> consumer-enforced CSV),
and makes the reusable rights interface serve an actual application. Cosmetic
work and acceptance-remediation alone are excluded.

## Admission of the new consumer surface

1. Replacement: consumer cannot choose prerequisite verdict or substitute DB
   state; finalized GenLayer exercise is mandatory for delivery.
2. Judgment: accepted semantic dependency interpretation remains load-bearing;
   independent B survives cancellation of A only after validator review.
3. Evidence availability: bounded canonical agreement/right/history views and
   a fixed service-owned resource descriptor; failures deny delivery retryably.
4. Authenticity: exact authority matrix below; service-owned issuer, resource
   bytes/hash and holder signature precede access. Outsider terms grant nothing.
5. Equivalence: accepted independent meaning replay is preserved.
6. Consequence: finalized surviving exercise opens an actual CSV endpoint;
   accepted fixed GEN allocation remains unchanged.
7. Adversarial: outsider/issuer substitution, stolen digest, wrong signer,
   cross-origin replay and expired authorization must not deliver bytes.
8. State model: canonical keyed rights/history, immutable resource descriptor;
   HTTP retry never mutates ledger or creates another payment.
9. Reuse: one actual data-export consumer; future consumers remain backlog.
10. Contract count: retain one accepted IC; no status-mirroring guard IC.
11. Differentiation: first operational consumer in this project, compared with
    the baseline and zero prior milestones; not relabeled historical exercise.
12. Claim-to-code: matrix below, with tests and live evidence required.
13. Lifecycle: complete design permits implementation; execution remains pending
    until purchase/review/exercise/authenticated delivery and recovery are proved.
14. Scope honesty: public synthetic data, owned endpoint enforcement only;
    no external delivery truth, confidentiality or adoption claim.

These are admission reasons, not execution PASS claims.

## Evidence Authority Matrix

| Consequential claim/fact | Evidence/artifact | Data controller | Authoritative source/issuer | Deterministic verification | Canonical objective/entity/actor binding | Freshness/anti-replay | Semantic role after verification | Non-penalizing failure state | Consequence blocked | Required negative test |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Resource grant | Exact canonical terms | Issuer authors; buyer ratifies | Locked service issuer plus accepted IC | Exact issuer, B title/terms include resource ID/version/hash; authenticated buyer ratification | Chain/contract/agreement/digest/B/resource | Immutable configuration and definition | Accepted validator determines prerequisite relation | Deny, retry source outage | CSV delivery | Outsider issuer, mismatched terms/hash/entity/digest, injected authority |
| Exercise | Finalized right and history | Accepted contract | Accepted IC | B CONSUMED, reviewed relation present, matching EXERCISE_B event/actor before expiry | Buyer/entity/B | Finalized read only, no caller state | No new offchain judgment | Deny | CSV delivery | Active/cancelled/expired/unclear, absent/wrong-actor/late event |
| Delivery authorization | Signed bounded message | Requester | Canonical buyer EOA | Real EIP-191 signature; strict fields/domain/version/resource/contract/chain/digest; short timestamp window | Buyer/agreement/resource | At most 120 seconds; identical replay is idempotent redownload only | None | 403 or retryable unavailable | CSV delivery | Forged signer, field substitution, stale/future, extra keys |
| Returned bytes | Server-owned synthetic CSV | Consumer operator | Consumer operator for owned synthetic resource | SHA-256 exact bytes matches fixed descriptor | Resource ID/version/hash | Immutable version; client verifies returned digest | None | Deny mismatched resource | Wrong-resource delivery | Corrupt resource, arbitrary URL/path and version |

## Delta claim-to-code and safety

| New claim | Method/state | View/read | Tests | Network evidence |
| --- | --- | --- | --- | --- |
| Registered consumer resource | Consumer fixed policy | Canonical get_agreement | Exact issuer/terms/resource negatives | MS-001 consumer lifecycle PENDING |
| Authorized CSV delivery | POST export authentication + B consumed | get_right/get_history/latest-final | Signature/binding/time/state/output tests | MS-001 live endpoint requests PENDING |
| Browser exercise/download | Existing consume_component + signed read | Canonical reload + digest | Consumer UI/actual SDK tests | Browser path PENDING |

| Method | Caller | Allowed | Forbidden | Time | Idempotency | Value | Views | Negative tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Consumer export POST | Signed canonical buyer | Exact grant and finalized consumed B | Outsider/wrong grant/unconsumed/unverifiable | issuedAt <= now < issuedAt+120; no future | Same bytes redownload, no state mutation | 0 GEN; no ledger mutation | Agreement/right/history | Wrong signer/fields/time/state/source/digest; no delivered CSV |

No contract write is changed. Existing exercise/withdraw/recovery safety and
value-destination matrices remain authoritative. No new purse or credit exists.

## Implementation and verification order

1. Pin baseline/authority policy and compare backlog (this dossier).
2. Test-first consumer authorization boundary with real cryptographic signatures.
3. Implement fixed resource, finalized-only reader and bounded export API.
4. Invoke UI/UX skill, add contextual consumer exercise/download controls.
5. Run accepted regression + new tests, npm run check, local browser QA.
6. Execute one phase-specific Studio Dev case via resumable authorized scripts;
   distinguish script signatures from extension proof and verify native recovery.
7. Hygiene, incremental commits, existing public repo, Vercel and live endpoint QA.
8. Record exact counts/range/URLs/limits; prepare Milestone copy. Final Portal
   Submit requires explicit action-time approval. No new phase in this run.

## Current verification checkpoint

`node --test tests/tooling/consumer.test.mjs`: meaningful RED with the unimplemented
authorization boundary, then 22 PASS with actual cryptographic signatures.
`npm run check`: PASS, 74 direct + 1 integration + 28 tooling + 35 frontend =
138 tests, no skip; lint, TypeScript and build PASS. Five new frontend tests
cover selected-holder signing, disconnected/changed accounts, unregistered or
unconsumed grants, returned-byte verification and contextual failure/retry.
This is local evidence. Changed Studio Dev lifecycle, live endpoint and
extension-operated delivery evidence are pending at this checkpoint.

### Studio Dev and local browser checkpoint (2026-10-12)

The earlier pending contract-lifecycle entry is superseded by
[consumer-lifecycle.json](../../evidence/studio-dev/ms-001/consumer-lifecycle.json).
`node scripts/studio.mjs consumer-lifecycle` completed successfully: the new
resource-bound case was created, purchased for 2 GEN, reviewed independent,
Analysis cancelled and Export exercised. The consumer denied the unexercised
grant and an outsider signature, then delivered 64 exact bytes to the buyer.
Two withdrawals each proved an exact native contract decrease of 1 GEN; the
case is CLOSED. Current global accounting: 10 GEN received/withdrawn, zero
escrow/credits/native balance. All eight phase transactions finalized SUCCESS.

[Local browser QA](../../evidence/studio-dev/ms-001/local/browser-review.json)
exercised the actual page, selected signer, endpoint, signature and downloaded
bytes, then disconnected and verified disabled delivery. Widths 375/768/1024/1440
had no overflow; page errors zero. The signer was a real authorized Node-side
EOA exposed through a QA provider, not a Chrome extension. No key entered the
browser and no transaction was sent by that QA run. Extension evidence remains
pending and cannot be inferred from this result. The owner requested no mouse
takeover; no native Windows UI input is used for MS-001.

### Production checkpoint

Implementation commit: `51b1375123937b5ecd31ba0434eb1df3f2033eb3`.
Exact delta: `6720db3136498dacef2a81fbedd250de5b1ced66..51b1375123937b5ecd31ba0434eb1df3f2033eb3`.
Retained contract source, lockfile and CSS have an empty diff against baseline.
`vercel --prod --yes` produced READY deployment
`dpl_9jzpHGwKMtF3UC2Ezmeu27gzmLjo`; live alias is unchanged.
HTTP200, ScopeExit title, React root and JS asset `index-R7-IqJJI.js` verified.

[Production browser QA](../../evidence/studio-dev/ms-001/production/browser-review.json)
passed on the actual live alias: real buyer EIP-191 signature, canonical reads,
API delivery and downloaded 64-byte digest match. Disconnect and four widths
passed with zero page errors. The QA signer remains explicitly script-operated,
not a Chrome extension. Anonymous invalid live requests are rejected.

The verified delivery claim is the consumer endpoint and its browser interface
with cryptographic signer QA. No extension-operated delivery popup, independent
adoption or new contract adjudication is claimed. A participant may repeat
delivery after CLOSED; this does not mint another right or credit.

## Final claim audit and submission status

Implementation CI [38192841555](https://github.com/duclucky/scope-exit-genlayer/actions/runs/38192841555)
completed SUCCESS for51b1375; documentation closure gets separate CI in the
handoff. Source/tests/network/UI were reconciled: unchanged accepted IC,
27 new tests and138 total, eight new finalized successful transactions, two
native transfer proofs, exact consumer authority/resource/signature/time checks
and actual production browser delivery. No invalid transaction or older receipt
is counted as the delta. Endpoint failures return finite public messages and
never expose raw provider/validator payloads.

Measurement interval: 2026-10-12T01:27Z through01:42Z. One owner-operated
agreement, identified by ms001-export-v1, canonical digest and resource version1.
Local/production downloads are repeat tests of that grant, not additional users.
No third-party usage, confidentiality or outside fulfilment claim is made.

The app has a real selected-provider personal_sign control, actual cryptographic
API verification and canonical reload; the live run used a real Node signer in
an isolated browser. Extension popup compatibility for this new signature path
remains unclaimed and can be added later without recounting this milestone.

Copy-ready fields: [SUBMISSION.md](SUBMISSION.md), eleven steps:
[HOW-TO.md](HOW-TO.md). Final Portal Submit requires explicit action-time
authorization. Current Portal reference: NOT_SUBMITTED. Accepted baseline is
not promoted by implementation or submission readiness.
