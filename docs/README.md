# ScopeExit product specification

The category is locked to Projects. This specification preserves the Phase 4 design and its originally pending evidence plan. The executed trace below records the current verified state; those completed proofs supersede the historical pending entries. Successful extension-signed workflow evidence remains pending.

## Identity

- Idea ID: IDEA-041
- Project name: ScopeExit
- Project slug: scope-exit
- Category: Projects
- Status: BUILDING; fourteen admission gates pass; signed contract execution verified; browser-wallet execution pending
- Repository: https://github.com/duclucky/scope-exit-genlayer (public)
- Target network: Studio Dev, chain 61997; active address and exact evidence linked in project README

## One-sentence product hook

Cancel dependent parts of a prepaid permission bundle, recover their GEN, and keep the rights that stand on their own.

## Provisional contract capability sketch

An issuer offers two named internal permission components A and B to a named buyer, for 1 GEN each. The buyer reviews exact immutable terms and ratifies a 2 GEN purchase. Either named party may request semantic dependency review; failure or ambiguity keeps the purchase waiting without a penalty. After successful review the buyer can cancel an unused component together with its unused dependants, or exercise a surviving independent component once. Cancellation opens buyer refund credit; exercise opens issuer credit. After expiry, unused escrow returns to buyer through recovery even if review never completes. Credited actors withdraw GEN and may close a fully discharged agreement. Views expose terms, participant roles, expiry, component status, refund/earnings balances, dependency meaning and chronological review/action history. Exact API/storage/safety cards are completed at Phase 4, before contract code.

## Trust problem

- Decision that must not depend on one party: whether a purchased unused permission must cease when another component is cancelled.
- Why database/ordinary EVM/backend LLM is insufficient: signatures establish agreed bytes, while neutral interpretation of conditional natural-language prerequisites needs independent validators. Deterministic code alone cannot infer that meaning; an issuer-selected LLM can bias refund scope.
- Value/rights/access at risk: two internal one-time permissions and a fixed 2 GEN buyer escrow, partitioned into 1 GEN per component. No external delivery/ownership fact is admitted.

## Fingerprint

- Trust problem: neutral severance of paid conditional permission components.
- Actors/adversary: issuer and named buyer, with opposed retained-payment/refund and surviving-right interests.
- Evidence class + authenticity mechanism: exact constitutive terms from authenticated issuer transaction and named buyer digest-bound ratification; canonical chain state; fixed-origin, exact-digest W3C ODRL 2018 reference.
- Consensus question: does A require B to remain active, and does B require A to remain active, under the exact operative terms?
- State machine: OFFERED -> FUNDED -> REVIEWED; failed review -> RETRYABLE; components LOCKED -> ACTIVE -> CONSUMED/CANCELLED/EXPIRED; credits withdrawn; zero-liability CLOSED.
- Direct consequence: dependency closure cancels exactly affected unused internal rights and opens fixed buyer refunds; independent rights retain escrow; authenticated one-time exercise opens fixed issuer earnings.
- Reuse surface: stable agreement/right/attempt/history/accounting views and typed lifecycle adapter, without a redundant consumer contract.

## Mandatory gate matrix

| Gate | PASS/FAIL | Evidence/reason |
| --- | --- | --- |
| Replacement | PASS_ADMISSION | Neutral prerequisite judgment is lost with an issuer-controlled database/LLM. |
| Judgment | PASS_ADMISSION | Conditional scope, paraphrases and ambiguity require semantic evaluation. |
| Evidence availability | PASS_ADMISSION | Two target-runtime SUCCESS probes, source HTTP 200 and four correct semantic examples per run; canonical state is public. |
| Evidence authenticity | PASS_ADMISSION | Complete authority matrix below; signatures authenticate constitutive ratification, never outside delivery; exact source digest verified in target runtime. |
| Equivalence | PASS_ADMISSION | Independent semantic replay and exact complete normalized ordered relation vector; structure alone cannot pass. |
| Consequence | PASS_ADMISSION | Reviewed matrix governs internal rights cancellation and exact per-component GEN refund/exercise allocation. |
| Adversarial | PASS_ADMISSION | Buyer and issuer benefit from opposed severability interpretations. |
| State model | PASS_ADMISSION | Isolated immutable agreements, append-only events/attempts, direct temporal guards, all escrow/credit destinations and no double action. |
| Reuse | PASS_ADMISSION | AgentToolLeaseAdapter, DataRoomExportGateway and CreativeWorkflowBundleGateway integration designs; adoption unclaimed. |
| Contract count | PASS_ADMISSION | One ScopeExit Intelligent Contract; recipient EVM interface is not a second deployed IC. |
| Differentiation | PASS_ADMISSION | Partial purchased-rights unwind differs in question/state/consequence/interface from closest registry mechanisms. |
| Claim-to-code | PASS_ADMISSION | Every claim maps to write, canonical view, negative test and explicit pending network evidence. |
| Full lifecycle | PASS_ADMISSION / CONTRACT_EXECUTION_PASS / BROWSER_PENDING | Three real finalized lifecycles and four native withdrawals close with zero liabilities; actual extension-signed user workflow remains pending. Admission is distinct from execution. |
| Scope honesty | PASS_ADMISSION | Protocol rights/GEN only; no outside ownership, delivery, automatic consumer enforcement or adoption claims. |

## Actors, roles and incentives

| Actor | Permissions | Value at risk | Incentive to bias |
| --- | --- | --- | --- |
| Issuer | Create/cancel unfunded offer, request review, withdraw own exercise earnings, close discharged agreement | Up to 2 GEN potential earnings, no issuer deposit | Declare dependence or obscure refund options |
| Named buyer | Ratify exact offer with 2 GEN, request review, exercise/cancel unused rights, withdraw own refunds, close discharged agreement | 2 GEN escrow and internal component rights | Seek refund while retaining dependent benefit |
| Recovery caller | Recover remaining unused escrow at expiry; no choice of destination | No caller payment or reward | No permitted allocation discretion |
| Validator/leader | Evaluate bounded authenticated input and independently verify meaning | No product purse ownership | Malicious leader may inject invalid relation/coverage; deterministic checks and replay reject |
| Consumer | Read canonical rights; buyer-authorized integration may invoke exercise | Its own outside enforcement boundary | Must not claim external execution as proven by ScopeExit |

## Scope and non-goals

### In scope

- Two transaction-authenticated constitutive permission components; semantic prerequisite classification; partial cancellation; one-time exercise; fixed GEN escrow/refunds/earnings; expiry recovery; multi-page English browser product.

### Out of scope

- External service delivery, real-world ownership/legal validity, automatic third-party access enforcement, arbitrary payout judgments, model generation authentication, signed offchain use receipts, third-party adoption claims and more than two components in MVP.

## Product/frontend blueprint

> Required for Projects. Provisional in Stage 1; finalized in Stage 2 before
> contract implementation.

### Human users and jobs

| User/role | Primary job | Decision or outcome needed |
| --- | --- | --- |
| Issuer | Offer conditional rights to a named buyer; see exercised rights and withdraw earnings | Exact offered scope, purchase/review state, eligible earnings |
| Buyer | Understand a purchase, cancel unused rights safely, keep independent rights, exercise them or recover funds | Terms/prerequisites, affected cancellation set, 1–2 GEN effect, expiry and canonical outcome |
| Returning participant | Find a prior agreement and finish a pending action | Search/filter, deep-linked detail, chronological activity and recovery |
| Integrating builder | Check canonical internal permission and payment state | Typed adapter and contextual verification links; no claimed outside enforcement |

### Information architecture

| Screen/view | User purpose | Primary action | Required states | Mobile behavior |
| --- | --- | --- | --- | --- |
| Home / | Understand partial cancellation and its limits | Browse agreements | Intro, honest network/configuration status, explanatory illustration clearly labeled example | Stacked hero and example; persistent wrapping nav |
| Agreements /agreements | Find purchases/offers and resume | Open agreement; search and filter by role/status | Unconfigured, loading, first-run empty, no matches, read error/retry, canonical list | Cards stack; labeled filters remain usable |
| New offer /new | Issuer defines two permission scopes and named buyer | Validate then publish offer | Editable form, inline errors, review terms, wallet/config missing, submitting/failure/finalized | Single-column fields, visible labels, non-obscured actions |
| Agreement /agreements/:id | Buyer ratifies, reviews, cancels or exercises; issuer sees result | Contextual next legal action | Not found/unconfigured/loading/error; offered/funded/retryable/reviewed/expired/terminal; full tx finality | Terms and outcome above disclosures; stacked components |
| Activity /activity | Revisit canonical history and outcomes | Open historical agreement | Unconfigured/loading/empty/error; append-only event history | Chronological readable list; no horizontal table |
| Account /account | Understand connected identity, credits and pending withdrawals | Withdraw eligible agreement credit or disconnect | Disconnected/config missing/loading/error/no credits/credits/finality | Address wraps; clear wallet logout |
| Help /help | Learn what rights mean and recover from failure | Expand task-specific guidance; link to agreements | Real explanatory content, source reference, explicit limits | Native expandable sections; narrow reading measure |

Persistent header: Home, Agreements, Activity, Help and Account; prominent New offer inside Agreements and contextual issuer entry. Real HashRouter routes preserve deep links without a hosting rewrite; active nav and route focus identify location. Primary buyer journey: Home -> Agreements -> detail terms -> ratify purchase -> semantic review -> preview cancellation -> confirm -> finalized canonical rights/refund -> Account withdrawal -> Activity -> return to detail. Issuer journey: New offer -> validate/review -> publish -> detail -> observe exercise -> Account withdrawal. Before Phase 7/9 integration, writes are visibly disabled with a configuration reason; there is no fake finality or substitute data.

### Visibility matrix

Use exactly one visibility class per row: `USER_PRIMARY`,
`USER_CONTEXTUAL`, or `SYSTEM_ONLY`.

| Function/data group | Visibility | Eligible role/state | User need or reason hidden |
| --- | --- | --- | --- |
| Offer title, terms, 1 GEN component price, 2 GEN total, parties, expiry | USER_PRIMARY | Everyone viewing offer | Decide whether to purchase/use/cancel |
| Component rights, human prerequisite summary, cancellation preview, next action | USER_PRIMARY | Connected eligible buyer after review | Understand exactly which unused rights and GEN are affected |
| Refund and earnings credit, withdrawal/recovery | USER_PRIMARY | Credited participant or eligible expired agreement | Finish money lifecycle |
| Agreement status and canonical chronological activity | USER_PRIMARY | Participants/readers | Resume and verify user outcome |
| Contract address, Explorer links, digest, transaction hash | USER_CONTEXTUAL | Detail verification disclosure | Optional independent verification |
| Raw pair IDs/enums, leader/validator prompts/configuration, storage maps, fee internals, run/checklist/Portal status | SYSTEM_ONLY | Tooling and reviewers outside product | No ordinary user decision requires these fields |

### UI action matrix

In Stage 1, the contract capability/method may be provisional. Stage 2 must
replace it with the finalized public interface before contract code.

| Visible control | Contract capability/method | Eligible role | Legal state | Input/value | Finality | Failure/recovery |
| --- | --- | --- | --- | --- | --- | --- |
| Publish offer | create_offer | Connected issuer | New unique offer | Buyer, title, A/B terms, expiry; 0 GEN | Submitted -> accepted -> finalized SUCCESS -> detail read | Field errors retained; failed transaction can retry after canonical reload |
| Accept for 2 GEN | accept_offer | Named buyer | Offered before expiry | Exact digest; 2 GEN | Same lifecycle, purchase/escrow canonical reload | Wrong role/digest/time blocked; no simulated balance |
| Check dependencies / Retry review | review_dependencies | Issuer or buyer | Funded/retryable before expiry | Agreement ID; 0 GEN | Same lifecycle; rights/matrix/attempt read | Source or ambiguity -> waiting/retry guidance, expiry recovery |
| Cancel component | exit_component | Buyer | Reviewed, unused component before expiry; no consumed dependant | A/B selection; 0 GEN | Preview derived from canonical matrix; finalized rights/credit read | Reject impossible closure; reload canonical state |
| Use permission | consume_component | Buyer | Reviewed active component with active prerequisites, before expiry | A/B; 0 GEN | Finalized consumed right/issuer credit read | No double exercise; explanatory disabled reason |
| Recover unused funds | recover_expired | Any connected caller | Funded/reviewed expired with unused escrow | Agreement ID; 0 GEN | Finalized buyer credit/component read | Equality is expired; no caller-selected recipient |
| Withdraw available GEN | withdraw | Credited issuer/buyer | Positive agreement credit, not closed | Agreement ID; 0 GEN | Finalized receipt + credit reload; network evidence separately proves transfer | Wallet rejection/failure leaves canonical read authoritative |
| Cancel unpublished offer | cancel_offer | Issuer | Offered only | Agreement ID; 0 GEN | Finalized cancellation read | No funded cancellation bypass |
| Finish agreement | close | Issuer or buyer | Terminal components, zero escrow and credits | Agreement ID; 0 GEN | Finalized closed read | Pending withdrawal/rights prevent closure |
| Choose wallet / account menu logout | Provider layer | User | Any route | Explicit detected provider choice before account request | Actual wallet permission, no transaction | No provider -> install/open wallet guidance; logout clears selected provider/account |

### User-facing state language

| Canonical status/violation | User-facing label | User consequence/next step |
| --- | --- | --- |
| OFFERED | Awaiting purchase | Named buyer reviews exact terms |
| FUNDED | Ready for dependency review | Purchase escrow is held; request review |
| RETRYABLE / UNVERIFIABLE | Review needs another try | No rights or GEN settled; retry before expiry or recover afterward |
| REVIEWED | Permissions ready | Buyer can exercise or cancel eligible components |
| ACTIVE / CONSUMED / CANCELLED / EXPIRED | Available / Used / Cancelled / Expired | Show component-specific outcome and eligible next action |
| CLOSED | Complete | All rights terminal and all GEN liabilities discharged |
| Wrong caller / late / dependent already used | Action unavailable | Explain role, deadline or affected used right without changing raw adapter state |
| Submitted / accepted / finalized / failed | Sent / Accepted, waiting for finalization / Confirmed / Transaction failed | Reload canonical state after confirmed successful execution; failure offers canonical refresh and retry |

### Visual preservation constraints

- Visual language/layout to preserve through integration: verified project-local ui-ux-pro-max SaaS query, Hero + Features + CTA, restrained Glassmorphism, light background #F8FAFC, primary #2563EB/white, accent #EA580C/black, text #1E293B, muted #475569, cards white, border #E2E8F0, danger #DC2626/white; Plus Jakarta Sans; spacious grid, subtle glass header/modal, readable terms. Shared 8px spacing, visible focus, minimum 44px controls, reduced motion, 375/768/1024/1440 responsive review. No dark-mode claim; light theme only.
- Allowed functional edits: typed adapter integration, legitimate loading/finality/retry feedback, contract-derived roles and data, network/wallet compatibility fixes; keep routes, hierarchy, tokens and user language.
- System/reviewer details excluded from the primary UI: validator raw output, runner hashes, fee distribution settings, internal evidence/audit/checklists, deployment operations and submission criteria.
- Skill verification: initial fintech query matched crypto palette and was narrowed once; verified SaaS category/style above. UX query keyboard focus modal returned Focus States (Interaction). React stack query forms routing async state returned async Actions, controlled inputs and caught errors. Database guidance does not create fabricated logos/testimonials/adoption.
- Wallet design: EIP-6963 announcements plus injected fallbacks; centered native dialog with explicit provider buttons, Escape/close and focus restoration. User selection precedes eth_requestAccounts. Clickable account opens logout; account/chain change events refresh identity. Verified official EVM wallet switch/add and separate same-origin IC read proxy are integration tasks before first write. Missing configuration is always labeled; no raw string per-call account override or browser secret.

## State model

### Stable IDs

Agreement ID is unique, 1–64 ASCII alphanumeric/underscore/hyphen characters and never overwritten. Component IDs are exactly A and B. Review key is `<agreement>:<monotonic attempt>`, derived in code; no caller chooses an attempt ID. Event index is append-only, with canonical agreement binding. Protocol/source policy is immutable SX-1. Ratification digest SHA-256 covers chain 61997, deployed contract address, agreement ID, issuer, buyer, title, both component IDs/names/exact terms, expiry, fixed prices and SX-1; artifact prose supplies none of those authority fields.

### Structured storage

One validator-visible `ScopeExit(gl.contract.Contract)`. Storage-allowed dataclasses for Agreement, ReviewAttempt and ActivityEvent; `TreeMap[str, Record]` for keyed state, `DynArray[str]` indexes, sized integers for timestamps/counters, `bigint` for exact money. No bare int/list/dict persistent storage, no global last-result fields and no collection reassignment in constructor. Public views serialize explicitly shaped records to JSON; all public amount fields carry GEN units. Paged index reads limit 1–50 items; each agreement has at most three reviews and two component terminal actions, so history is bounded per agreement.

### State machine

```text
OFFERED --buyer exact ratification + 2 GEN before expiry--> FUNDED
OFFERED --issuer unfunded cancellation--> CANCELLED
FUNDED/RETRYABLE --successful complete semantic review before expiry--> REVIEWED
FUNDED/RETRYABLE --source/ambiguity/invalid normalized result--> RETRYABLE
REVIEWED --buyer exit or exercise before expiry--> REVIEWED (component state changes)
FUNDED/RETRYABLE/REVIEWED --recover unused escrow at/after expiry--> same phase (unused components EXPIRED)
LOCKED --successful review--> ACTIVE
ACTIVE --one-time exercise--> CONSUMED
ACTIVE --validated buyer exit closure--> CANCELLED
LOCKED/ACTIVE --expiry recovery--> EXPIRED
terminal components + zero escrow and participant credits --party close--> CLOSED
```

Review never moves GEN. On successful review, the complete matrix activates internal rights. A consumed permission no longer counts as an active prerequisite. Buyer can exercise a dependent component while its prerequisite remains active, then exercise the independent prerequisite. A cancellation closure touching any CONSUMED component is forbidden. A cyclic two-way dependency is unsupported in SX-1 and produces non-penalizing RETRYABLE, never partial activation or payment. This protects one-time exercise semantics; future graph extensions need separately verified rules.

### Temporal entrypoint rules

Canonical clock is the pinned v0.3 SDK's `gl.message.raw["datetime"]`, parsed as timezone-aware ISO time; no frontend, caller or wall-clock time is authority. A target-runtime policy probe verified timezone, year 2026 and chain ID 61997. Reject missing/invalid time; do not fall back to local time. Check chain ID deterministically at write boundary.

Creation requires `now + 60 <= expiry <= now + 30 days`. Acceptance, review, exit and exercise each independently enforce `now < expiry` before any mutation; exact equality is late. Recovery independently requires `now >= expiry`; it works with a deliberately stale FUNDED/RETRYABLE/REVIEWED phase. Unfunded issuer cancellation, withdrawal of existing credits and zero-liability close are non-temporal for explicit reasons in their safety cards. No phase-advance/keeper exists.

### Illegal transitions

No ID overwrite, changing ratified terms/source/actors/price/expiry, self-buying, duplicate funding, review after success/three attempts/expiry, exit before review or after use, cancelling a consumed dependant, exercise with inactive prerequisite, late exercise, recovery before expiry or without unused escrow, withdrawal without own credit, new GEN through a nonpayable entrypoint, close while any right/escrow/credit remains, or any write on CLOSED.

### Authorization

Issuer/buyer are transaction-authenticated distinct nonzero EVM addresses. Only issuer creates/cancels an unfunded offer; only named buyer accepts, exits and exercises. Review requires issuer/buyer. Recovery may be called by anyone after expiry but credits only locked buyer. Withdrawal credits/destination are locked to the calling participant, not an argument. Close requires a named party. Frontend role hints are convenience; contract checks are authoritative.

### Idempotency and double-action prevention

Duplicates revert without state/accounting changes. IDs, funded state, locked matrix, terminal components, monotonic attempts, consumed credit and CLOSED guards make each irreversible transition once-only. Tooling reads canonical state before resume/retry and never retries ambiguous signed funding/withdrawal on a guess. Events and attempts are append-only; no retry can rewrite successful or earlier records.

## Write-method safety matrix

| Method | Caller | Allowed states | Forbidden states | Temporal/expiry gate | Idempotency | Value/accounting effect | Views affected | Negative tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| create_offer | Authenticated issuer; distinct valid buyer | Unique new ID | Existing ID, invalid actor/terms/network/value | now+60 <= expiry <= now+30 days; invalid clock reverts | Unique ID; duplicate rejected | 0 GEN; no credit/escrow; reject nonzero value | agreement/index/history/policy | Duplicate ID, self/zero/malformed buyer, bounds-1/equality/+1, malformed time, unexpected value, no change |
| accept_offer | Locked buyer | OFFERED only | Other caller, digest/version/binding mismatch, funded/cancelled/closed | now < expiry directly; equality late, stale offered phase tested | Fund once; duplicate rejected | Exactly 2 GEN payable; escrow/received +2 GEN; credits unchanged | agreement/accounting/history/right | Wrong signer with valid digest, wrong objective/ID/version, replay, wrong value 1 GEN, boundary cases, snapshots unchanged |
| review_dependencies | Issuer or buyer | FUNDED/RETRYABLE, attempt <3 | Unratified/reviewed/cancelled/closed, cap reached, wrong caller/value | now < expiry directly; expiry equality late with stale phase | New monotonic attempt; never overwrite/redo successful matrix | 0 GEN; escrow/credit invariant; failure may append retry record only | agreement/attempt/history/right | Caller/state/time/cap, digest/source auth tripwires, injection, malicious coverage/enums/cycle, semantic replay mismatch; unchanged GEN |
| exit_component | Locked buyer | REVIEWED; selected ACTIVE; closure entirely ACTIVE | Wrong caller/ID, pending/closed, used/expired/cancelled component or consumed dependant | now < expiry directly | Each component terminal once; repeated exit rejected | 1 GEN per affected unused slice: escrow -> buyer credit, no external transfer | agreement/right/accounting/history | Wrong caller/state/component, duplicate/closed, exact boundary, consumed dependency, invariants and no double refund |
| consume_component | Locked buyer | REVIEWED; component ACTIVE; needed prerequisite ACTIVE | Wrong caller, wrong component/state, inactive prerequisite, closed | now < expiry directly | One-time exercise; duplicate rejected | Fixed 1 GEN escrow -> issuer credit, no external transfer | agreement/right/accounting/history | Caller/state/duplicate/closed/boundary/inactive prerequisite; no duplicate earning or orphaned slice |
| recover_expired | Any authenticated caller; destination fixed buyer | FUNDED/RETRYABLE/REVIEWED with unused escrow | OFFERED/closed, unexpired, no unused escrow | now >= expiry directly; equality permitted; stale phase deliberately tested | Remaining unused slices only; duplicate/no-escrow rejected | Every remaining 1 GEN slice -> buyer credit; LOCKED/ACTIVE -> EXPIRED; prior credits unchanged | agreement/right/accounting/history | Before/equality/after, zero escrow, closed, third-party recipient-injection ignored/rejected, partial exercise, no double recovery |
| withdraw | Credited locked participant | Nonclosed agreement; own positive credit | Outsider, no credit, closed, unexpected value | N/A: discharging already allocated credit remains legal after expiry and cannot create rights | Debit all own agreement credit before external message; duplicate rejected | Own credit -> locked EVM recipient; withdrawn counter updated; exact transfer verified on network | agreement/accounting/history + native balance proof | Wrong caller/no credit/duplicate/closed/value, mocked boundary and ordering, accounting, failed child handling, exact contract decrease and recipient proof |
| cancel_offer | Locked issuer | OFFERED, never funded | Buyer/outsider, funded/retry/reviewed/cancelled/closed | N/A: unfunded offer withdrawal cannot orphan money or defeat a purchased right, before or after expiry | Terminal cancellation once | 0 GEN, all unfunded components CANCELLED, no credits | agreement/right/history | Caller/state/duplicate/closed/value; unchanged accounting; cancellation cannot refund/steal funded purse |
| close | Locked issuer or buyer | Nonclosed; all components terminal; escrow/both credits zero | Outsider, active/locked rights, any liability, closed | N/A: finalizes only a fully discharged record; no time-dependent entitlement | CLOSED once; duplicate rejected | 0 GEN and zero liability prerequisite | agreement/history/accounting | Caller/state/duplicate/active rights/remaining credit/closed/value; no double settlement or trapped liability |

## Frontend lifecycle coverage matrix

Every write follows the shared typed `ContractAdapter.write` boundary, TransactionBox feedback and canonical `revision` reload after finalized successful execution. The actual SDK and deployed address are now configured and tested; the matrix below preserves the Phase 4 evidence plan. Actual local and production browser canonical reads pass, while no successful extension-signed transaction is claimed yet.

| Canonical state | User action | Contract write | UI component | Frontend test | Evidence status |
| --- | --- | --- | --- | --- | --- |
| New unique offer | Define/review/publish | create_offer | NewOffer validation/review | frontend-review invalid/valid draft; integrated role/write regression planned | Baseline browser draft PASS; signed publish PENDING |
| OFFERED | Ratify for 2 GEN | accept_offer | AgreementContent buyer next step | Real-SDK selected-account/value regression + buyer/issuer control tests planned | Signed browser purchase PENDING |
| FUNDED/RETRYABLE | Review/retry dependencies | review_dependencies | AgreementContent review control | Cap/time/role/retry and finalized reload tests planned | Real review/canonical reads PENDING |
| REVIEWED + unused rights | Preview/confirm cancellation | exit_component | cancellation preview/confirmation | Closure affects unused IDs only; consumed dependant disabled; finality reload planned | Browser cancellation PENDING |
| REVIEWED + usable right | Exercise once | consume_component | component contextual action | Dependency/time/role/once-only and finalized reload planned | Browser exercise PENDING |
| Expired unused escrow | Recover funds | recover_expired | expired next step | Equality/stale phase/remaining credit UI planned | Browser recovery PENDING |
| Participant credit >0 | Withdraw allocated GEN | withdraw | agreement detail; Account links to eligible agreements | Wrong account/no-credit/duplicate disabled; actual SDK adapter and reload planned | Browser withdrawal and native transfer PENDING |
| OFFERED | Withdraw unfunded offer | cancel_offer | issuer contextual control | Issuer-only/no-funded-cancel test planned | Browser cancellation PENDING |
| Terminal, zero liability | Finish record | close | contextual finish control | All rights/credits checked; duplicate closed guard planned | Browser close PENDING |
| Any page | Choose/disconnect wallet | EVM provider layer | centered WalletDialog/account menu | Four wallet regressions PASS; actual Chrome detects MetaMask and OKX once | Detection/modal PASS; selected-account network/write proof PENDING |

## Evidence policy

- Authoritative sources: canonical transaction-ratified constitutive terms and fixed https://www.w3.org/TR/2018/REC-odrl-model-20180215/ reference. No interested actor's external deliverable/receipt is accepted.
- Provenance/authentication: issuer/buyer gl.message.sender_address, chain ID 61997, immutable contract/entity/actor/digest binding; TLS-authenticated fixed W3C host and exact fetched body digest.
- Authorized attestor/signer: issuer authors the internal offer; named buyer ratifies its exact digest through its own transaction. Neither is an attestor of external ownership or performance.
- Anti-replay event/digest identity: unique agreement and deployed contract; SX-1; immutable terms digest; monotonic review attempt; one-time component transitions and credits.
- Signed timestamp bounds: canonical signed transaction context; no actor-supplied timestamp; create expiry 60 seconds–30 days ahead, active writes strictly before expiry, recovery at/after.
- Immutable policy/source version URLs and hashes: SX-1, dated ODRL 2018 Recommendation, exact UTF-8 body SHA-256 `af187a2c26b2429a579039403f34d9a5d5f29a1e01019662043068fa1ca2beaa`. Source hash is not evidence of an actor's outside claim. Terms digest uses exact locked fields and is recomputed before ratification/review.
- Allowed schemes/domains/paths: only fixed HTTPS W3C URL above; no actor URL input, hostname substitution, arbitrary redirects or claimant-hosted substitute. Non-200 response fails safely.
- Time/window rules: historical source version deliberately pinned; source is refetched per semantic evaluation. This is vocabulary grounding, not current real-world event evidence.
- Size/count bounds: body <=300000 bytes; expected date/version and permission anchor required; extract bounded permission section after full-body digest verification; two components, terms <=2000 chars each, titles <=80 chars, IDs <=64, three review attempts, page limit <=50.
- Missing evidence: non-penalizing RETRYABLE; escrow/credits/rights unchanged.
- Contradictory evidence: ambiguous prerequisite -> UNVERIFIABLE and RETRYABLE; cyclic two-way prerequisites unsupported and retryable; no partial activation.
- Unavailable source: distinguish SOURCE_UNAVAILABLE, SOURCE_VERSION, SOURCE_DIGEST, SOURCE_PARSE from MODEL_FORMAT/MODEL_SCHEMA/MODEL_UNCLEAR/CYCLE_UNSUPPORTED, retaining only safe reason codes.
- Invalid/unverifiable attestation: unauthorized ratification/binding reverts before mutation; source/output failure appends a retry attempt only; no hard consequence.
- Canonical objective/policy source and hash: onchain terms and code-locked SX-1/reference hash; neither terms nor source prose can redefine authority, expected IDs, recipients or amounts.
- Workflow/entity, step/requirement, actor/subject binding: exact agreement ID, deployed contract, issuer, buyer, A/B IDs, digest and attempt; no verdict reused across agreements.
- Prompt-injection boundary: descriptions/reference text are quoted data; instructions to reviewer, alternate IDs, authority or payout are non-operative. Output contains relations only; settlement is deterministic code.
- Private/unverifiable evidence excluded: screenshots, claimant JSON, logs, fake signatures, model generation proofs and all external delivery/ownership assertions.

### Evidence Authority Matrix

| Consequential claim/fact | Evidence/artifact | Data controller | Authoritative source/issuer | Deterministic verification | Canonical objective/entity/actor binding | Freshness/anti-replay | Semantic role after verification | Non-penalizing failure state | Consequence blocked | Required negative test |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Two internal permissions offered at fixed prices | Canonical offer transaction and exact terms | Issuer authors text; locked after create | Authenticated issuer transaction for constitutive internal rights | Valid distinct actors/unique ID/bounded data/chain; derive A/B and 1 GEN slices; lock source/policy/expiry; compute digest | Contract, chain, agreement, issuer/buyer, A/B, SX-1 and exact digest | Unique ID and immutable creation/expiry; no overwriting or actor clock | Only interpret operative jointly ratified internal permissions | Unauthorized/malformed creation reverts; unratified offer cannot enter judgment/consequence | Purchase activation, refund, issuer earning, exercise, settlement | Valid-digest artifact authored by outsider/wrong entity/version/actor attempts to claim approval or redefine recipient; no canonical authorized ratification, no hard state/GEN change |
| Buyer agrees to purchase those exact rights | Buyer signed acceptance carrying canonical digest and 2 GEN | Named buyer approves; cannot rewrite offer | Authenticated locked buyer transaction | Caller==buyer, OFFERED, now<expiry, supplied digest==recomputed exact locked digest; payable exact 2 GEN | Same deployed contract/agreement/buyer/issuer/A/B/policy/digest | Once-only funding; duplicate/replay/expired acceptance rejected | Ratified descriptions eligible for semantic review; no outside fact certified | Invalid caller/digest/state/time/value reverts before mutation | Funding/rights, judgment, payout/refund/settlement | Correct bytes+digest with forged signer, wrong objective/ID/actor/version; body claims authority/payment; reject and compare complete state/accounting snapshots |
| Reference defines permission vocabulary | Exact bounded historical W3C bytes | W3C; actor cannot choose fetch destination | Fixed HTTPS W3C 2018 Recommendation | Status200, <=300000 bytes, expected date/permission anchor, SHA-256 exact full fetched bytes before LLM; fixed origin/path | SX-1 exact source URL/hash and canonical terms, never source-prose objective/payout | Historical version pinned; fresh fetch each leader/validator evaluation; attempt identity locked | Interpret permission/prerequisite meaning only | SOURCE_* -> RETRYABLE attempt; no permission or accounting mutation | Activation/cancellation/exercise, credit/payment/refund, settlement | Digest-valid claimant-hosted replacement URL cannot be passed; wrong source version/binding rejected; terms embedding an alternate source or authority do not override canonical fetch |
| Complete dependency result | Independently evaluated ordered A->B/B->A matrix | Leader may be malicious, validator independently replays | GenLayer consensus over verified canonical input | Exact pair coverage once each; known enum only; no extra keys/IDs/amounts/payees; independent normalized semantic equality; reject unsupported cycle | Immutable agreement digest, source version, pair IDs, current attempt | New attempt only in funded/retryable before expiry, max3; success matrix immutable; no cross-case replay | Identify whether an operative permission requires another active permission | Invalid schema/invariants revert or safe retry reason; any UNVERIFIABLE leaves all escrow/rights untouched | Every hard right/value consequence and settlement | Valid-shaped malicious JSON with extra/missing/duplicate/wrong pair, bad enum/cycle, invented recipient/root; independent replay rejects biased meaning; GEN/accounting unchanged |

Consumption is the buyer's authenticated one-time exercise, not a self-reported external delivery artifact. Recovery uses canonical clock and locked buyer; withdrawal uses the caller's locked credit and authenticated EVM transfer boundary. No artifact can add a consequence path.

## Consensus design

### Leader task

- Inputs: immutable agreement identity/digest, both exact component names/terms, SX-1, fixed expected ordered pairs; actors, monetary law and policy are locked state, never model instructions from descriptions.
- Fetch: fixed bounded W3C reference. Recompute its full exact-byte hash before extracting any content or invoking the LLM; mismatch takes SOURCE_DIGEST with no consequence. Independently repeated by validator.
- Extraction: expected version and permission anchor; bounded reference section, stripped HTML; parse failure is distinct from source availability and model failure.
- Normalization: response_format=json; force Lazy only when needed by pinned SDK; accept a JSON object or parse a whole JSON string with an optional entire code-fence wrapper. Do not salvage arbitrary surrounding prose, alias fields, coerce enums or ignore surplus keys.
- Structured output: exactly `{"pairs":[{"from":"A","to":"B","relation":"INDEPENDENT|DEPENDENT|UNVERIFIABLE"},{"from":"B","to":"A","relation":"INDEPENDENT|DEPENDENT|UNVERIFIABLE"}]}`. Order normalized to expected pair order; each pair must appear exactly once. There are no money/recipient/authority/root/fault/reason fields in LLM output.

### Consensus-critical fields

| Field | Type/bounds | Comparison rule | Why critical |
| --- | --- | --- | --- |
| Canonical input digest | SHA-256 exact locked constitution | Recompute and exact match | Cannot review substituted or cross-entity terms |
| Source validity and version | Fixed URL/hash/date/anchor/body bound | Independently valid; failure class normalized | Source/authenticity must precede semantic consequence |
| Complete pair identities | Exactly A->B and B->A once each | Exact coverage, canonical order | No missing/extra/duplicate relations may change closure |
| Relation per pair | DEPENDENT, INDEPENDENT, UNVERIFIABLE only | Independent semantic evaluation and exact normalized class agreement | It controls rights closure and permissible exercise |
| Safe failure status/reason | Explicit allowed finite reason set, no prose | Independently reproduced outcome; disagreements rejected | Leader cannot fabricate outage/ambiguity to authorize money or state |

### Validator

Use sandboxed `gl.vm.run_nondet_default`; candidate must be `gl.vm.Return`. Validator independently refetches the exact authoritative source and reruns the same task on immutable canonical inputs. Validate/normalize both outcomes and compare complete stable relation/status fields, not JSON format or prose. Bad leader shape cannot be accepted just because its enums look legal. Any disagreement returns false and invokes consensus retry/rotation; no unsafe API or shape-only validator. Validator may never mutate storage or choose recipients.

Source/model errors produce bounded retry outcomes only when their independently observed normalized meaning agrees. Unexpected host/fatal errors abort the transaction with no state commitment, rather than claiming a review succeeded. UNVERIFIABLE in either pair and unsupported mutual cycle block all rights/consequence; an append-only retry attempt can be stored after accepted safe output.

### Rationale policy

No free-form leader reasoning is stored or used for settlement. Human dependency summaries derive from the normalized matrix. Safe retry reason codes are product-translated; raw provider payload, prompts and validator configuration are never logged or shown.

### Settlement invariants before any consequence

| Invariant | Expected coverage/IDs/classes | Root/dependency rule | Derived consequence/value law | Invalid outcome |
| --- | --- | --- | --- | --- |
| Complete authenticated input | Exactly ratified A/B, matching entity/digest/SX-1 and sufficient fixed source | External factual claims have no admitted root | No valid input -> no review activation or consequence | Revert deterministic binding failure; source failure RETRYABLE |
| Pair coverage | A->B and B->A exactly once; no self/extra/missing/duplicate/invalid enum | Dependence is the validated directed edge, never a prose label | Only complete valid matrix can activate rights | MODEL_SCHEMA retry or invariant rejection before hard state/GEN |
| Semantic certainty | Both pairs DEPENDENT/INDEPENDENT; UNVERIFIABLE blocks; two-way DEPENDENT unsupported | No fault/root-cause classes exist; N/A because there is no blame/slashing mechanism | Code determines usable rights from canonical prerequisites | MODEL_UNCLEAR/CYCLE_UNSUPPORTED retry; escrow unchanged |
| Exit closure | Selected buyer component A/B; every affected ID exists once and is ACTIVE | Selected root comes from authorized buyer, not model; every additional cancellation must have an accepted path to that root; consumed dependant blocks closure | Exactly 1 GEN per unused affected component -> locked buyer credit; other escrow/rights remain | Revert before component or accounting changes |
| Exercise/accounting | Exact ACTIVE selected ID and active needed prerequisite | No inherited/fault class trusted from output | Exactly one 1 GEN slice -> locked issuer credit; no model amount/payee | Revert before mutation; no double earning |
| Conservation/remainder | No fees/bonds/proportional rounding in SX-1; two exact whole-GEN slices | N/A: no blame allocation or fractional partition | Received = held unused escrow + buyer credits + issuer credits + withdrawn; remainder 0 GEN by construction | Any invariant violation reverts; no orphaned escrow |

## Consequence and accounting

| Verdict | Canonical state change | Consumer action | Value movement |
| --- | --- | --- | --- |
| Complete certain acyclic matrix | REVIEWED; both LOCKED -> ACTIVE; matrix immutable | Read eligibility; holder may exercise or cancel | No GEN movement on review |
| Source/model ambiguity/invalidity/cycle | RETRYABLE plus immutable attempt; rights remain LOCKED | Retry eligible review before expiry or recover unused afterward | No escrow/credit change |
| Buyer exit over valid active closure | Affected ACTIVE -> CANCELLED | Affected internal permits unusable; independent right retained | Fixed 1 GEN each held slice -> buyer credit |
| Buyer exercise with active prerequisites | Selected ACTIVE -> CONSUMED once | One-time internal exercise, outside consumer enforces its own boundary | Fixed 1 GEN slice -> issuer credit |
| Expiry recovery | Remaining LOCKED/ACTIVE -> EXPIRED | All remaining unused rights unavailable | All remaining escrow -> buyer credit |
| Credited participant withdrawal | Own agreement credit ->0; cumulative withdrawal increases | Recipient observes native GEN transfer | Locked EVM recipient receives credited amount; no caller-specified payout |
| Zero-liability close | CLOSED once | Record becomes read-only history | 0 GEN; no credit/escrow may remain |

### Value-destination matrix

| Value item | Payer/source | Locked state | Release/refund destination | Terminal/recovery states | Duplicate/late/retry behavior | Canonical proof |
| --- | --- | --- | --- | --- | --- | --- |
| A slice, 1 GEN | Named buyer's exact 2 GEN acceptance | Agreement A unused escrow | Used -> issuer credit; cancellation/expiry -> buyer credit | CONSUMED/CANCELLED/EXPIRED | Once-only; late use/exit rejected; failed review holds until retry/expiry | agreement component/escrow/credits; accounting/history |
| B slice, 1 GEN | Same buyer acceptance | Agreement B unused escrow | Same fixed law, dependencies derive cancellation set | CONSUMED/CANCELLED/EXPIRED | No partial/duplicate allocation or invented payee | same views and balance lifecycle |
| Buyer refund credit, 1–2 GEN | Cancelled/expired unused slices | Per-agreement buyer credit | Only locked buyer EVM address | Withdrawn before CLOSED | Withdrawal allowed after expiry; duplicate/no-credit rejected | credit before/after, exact native contract decrease and recipient receipt/balance |
| Issuer earning credit, 1–2 GEN | Authenticated consumed slices | Per-agreement issuer credit | Only locked issuer EVM address | Withdrawn before CLOSED | No exercise -> no earning; no double-credit/withdraw | same receipt/native decrease/recipient proof |
| Application fee, bond, reward, slashing purse, rounding remainder | N/A; not present in SX-1 | No ledger item created | N/A; no application charge or prorating | N/A | Protocol transaction fees are separately quoted and paid by initiating EOA; never deducted from purchase slices | Public policy and SDK fee proof; remainder 0 GEN |

- Accepted/finalized boundary: semantic result commits through consensus; no external backend verdict is authoritative. Frontend/scripts wait for FINALIZED plus execution SUCCESS before claiming completion or issuing dependent actions; accepted/decided alone is pending. EVM plain transfers use the pinned external-message API, which has no `on` parameter; do not invent it. Require actual finalized parent/child/native-balance proof.
- Ledger invariant: per agreement received = unused escrow + buyer credit + issuer credit + withdrawn, all nonnegative exact internal amounts. Global totals maintain the same equation across isolated agreements. Each terminal slice has exactly one destination. Failed/boundary/duplicate calls preserve every accounting field.
- Child-message/transfer evidence: exact contract native balance decrease, known recipient transfer receipt and fee-aware recipient before/after balance; zero internal credit or parent finalization alone is insufficient. Never use gl.chain.Account to transfer. Human output is GEN; SDK/VM exact internal arithmetic uses 18-decimal integers.
- Withdrawal/settlement: debit own credit and check accounting before `_Recipient(Address(locked_actor)).emit_transfer(...)` through @gl.evm.contract_interface; reentrant/no-credit replay fails. Supported live proof uses authorized EOAs. Smart-contract recipient execution is not claimed; failed external settlement cannot be marked complete. An actually broken revision is abandoned under the documented replacement exception and never receives further GEN.
- Cure/appeal/restore: no punitive suspension/slash, appeal purse or restoration exists in SX-1. Source retry and expiry refund are the explicit non-penalizing recovery paths; terminal consumed/cancelled/expired rights cannot be restored or reopened.

## Reusable interface

### Write methods

`create_offer(id:str,title:str,buyer:str,title_a:str,terms_a:str,title_b:str,terms_b:str,expiry:int)->None`; `accept_offer(id:str,digest:str)->None` is the sole payable entrypoint (exact 2 GEN); `review_dependencies(id:str)->None`; `exit_component(id:str,component:str)->None`; `consume_component(id:str,component:str)->None`; `recover_expired(id:str)->None`; `withdraw(id:str)->None`; `cancel_offer(id:str)->None`; `close(id:str)->None`. All other methods reject incoming value. Exact actor/state/time law is in safety cards.

### View methods

`get_agreement(id)->str` shaped JSON, including immutable terms/roles/digest/expiry, phase, components, ordered normalized dependency vector or null, attempt count, escrowGEN/buyerCreditGEN/issuerCreditGEN; `list_agreements(start:int,limit:int)->str` paged records/count; `get_attempt(id,attempt:int)->str` immutable safe result; `get_right(id,component)->str` current internal eligibility, actor, status/prerequisite and expiry; `get_history(id)->str` chronological canonical events; `get_accounting()->str` global GEN totals and invariant; `get_policy()->str` SX-1, prices, limits, network/source/runtime bindings. No view exposes raw validator/provider configuration.

Frontend adapter performs paged canonical reads and history composition, never localStorage authority. It binds selected provider/account in real SDK createClient, keeps EVM wallet signing RPC separate from IC reads/proxy, and exposes typed wrappers. A script cannot substitute a claimed browser action.

### Consumer/callback

- Authentication: no separate callback/consumer contract. Integrators read canonical holder/right state and require the holder's authenticated exercise; outside enforcement is their responsibility.
- Idempotency key: deployed contract + agreement ID + component ID, terminal one-time exercise enforced here.
- Failure/retry: no external action is certified from a failed/unfinalized transaction; re-read canonical right. Outside consumer retries must respect consumed state and their own idempotency boundary.
- Authorized cancellation: only buyer's validated unused closure; consumer must observe canonical cancelled/expired rights. No operator-supplied arbitrary recipient/amount or pass-through guard.

## Threat model

| Threat | Attack | Mitigation | Test |
| --- | --- | --- | --- |
| Forged approval | Third party submits exact valid terms digest and forged buyer declaration | Signed sender must equal locked buyer; prose has no approval authority | Correct bytes/digest wrong signer + full unchanged state/accounting |
| Cross-case replay | Reuse digest/verdict/attempt from another agreement | Contract/chain/ID/actor/version digest binding and internally derived attempts | Same terms with wrong entity/actor/ID/version and replay |
| Evidence fabrication | Actor embeds claimant URL, screenshot, fake external receipt or payout instruction | No such source parameter; fixed normative source; internal constitutive rights only | Valid digest but unratified/cross-bound provenance cannot reach consequence |
| Source substitution | Wrong dated source, content digest, redirect or missing permission section | Fixed HTTPS path, bounded HTTP200, exact byte hash before LLM | Source/version/hash/parse failures keep GEN and hard rights unchanged |
| Prompt injection | Terms instruct model to pay/choose authority/ignore prerequisites | Quoted data, locked objective/IDs/value law, strict relations-only output and independent replay | Injected operative permission vs instruction; no model recipient/amount accepted |
| Malicious leader | Correct shape but biased semantic relation | Independent re-fetch/re-evaluation and exact normalized agreement | Validator replay rejects semantically different classes |
| Settlement bypass | Missing/duplicate/extra pairs, invalid classes, invented root or unsupported cycle | Exact deterministic coverage/enum/cycle checks before state change | Valid JSON with invalid settlement meaning leaves accounting unchanged |
| Entity overwrite | Global last-result or mutable active terms | Keyed immutable records, append-only attempt/history | Two agreements isolate configuration, balances and verdicts |
| Temporal race | Leave phase stale past expiry then call accept/review/exit/use | Direct canonical transaction-time guard inside every relevant write | Boundary-1/equality/+1 with stale phase and unchanged failed snapshots |
| Recovery theft | Outsider attempts refund to itself or premature recovery | Deterministic locked buyer destination and now>=expiry | Caller/destination manipulation, before/equality/after, partial and duplicate |
| Double allocation | Repeated exit/consume/recover/withdraw/close | Terminal component/credit/phase checks and conservation | Repeated writes cannot double-credit/withdraw/settle |
| Orphaned purchase | Review source disappears or buyer never exercises | Bounded retry, unconditional deterministic unused expiry recovery | Funded-but-unreviewed/ambiguous/partial-used recovery returns all unused slices |
| Transfer illusion | Parent finalized, credit zero, recipient not actually paid | Correct EVM boundary + exact native balance/recipient receipt proof; failed revision not completion | AST boundary check, emit ordering, bounded live withdrawal; no claim from parent alone |
| Wallet mismatch | Wrong extension auto-picked; string per-call account override | EIP-6963 chooser, selected client account, real SDK regression, verified EVM chain/read proxy | Discovery/selection/logout/network and actual SDK encoding/account/value tests |
| Secret/config leakage | Save entire Studio receipt, validator config, key or public frontend env | Explicit safe field allowlist, root-only ignored key discovery, staged/history public hygiene | Sanitizer hostile receipt fixtures and public paths/content scan |

## Test plan

- Happy path: dependent full unwind/refund and independent partial unwind plus surviving exercise; correct rights, exact slice allocations and closed zero liability.
- Unauthorized: create invalid/self actors; wrong buyer approval with correct digest; unauthorized review/exit/use/cancel/withdraw/close; recovery outsider cannot choose destination.
- Isolation: two agreements with same terms but different IDs/actors/digests; changes to one never alter the other's rights, attempts or GEN.
- Evidence failure: missing/malformed/unavailable HTTP body, oversized, non200, wrong date/path/hash/anchor; source failure distinguished from invalid model JSON/schema and semantic ambiguity.
- Malicious leader: allowed-shape wrong semantic relation, extra/missing/duplicate/self/wrong pair IDs, invalid enums, wrong policy/objective/entity/actor binding, invented fault/root/payment fields and cycle; reject before consequence.
- Prompt injection: preserve an operative prerequisite despite quoted instructions to mark independent/pay issuer; no actor text changes source, authority, IDs or allocation.
- Semantic mismatch: explicitly execute validator path against an independently mocked semantic result; leader-only direct success is insufficient consensus proof. Bounded live Studio smoke supplements tests.
- Verdict classes: independent, A-dependent, B-dependent, either UNVERIFIABLE, both-dependent unsupported; safe reason-code mapping and code-derived closure.
- Duplicate: funding, reviewed success, terminal component exit/use, expiry recovery, credit withdrawal and CLOSED call; no double settlement or overwrite.
- Recovery/value write safety: each nine-card method covers wrong caller where authorization applies, wrong state, duplicate, closed, nonzero unexpected value, invariant and no double allocation. Recovery intentionally permits any caller but blocks destination choice; no fake wrong-caller requirement.
- Temporal: create minimum/maximum expiry boundary triples; accept/review/exit/use expiry-1/equality/+1; recover expiry-1/equality/+1 with phase deliberately stale; rejected canonical fields and accounting unchanged. Withdrawal/close/cancel_offer explicitly non-temporal, tested after expiry too.
- Accounting/value: exactly payable accept_offer metadata; 2 GEN receipt and 1–2 GEN slice allocation; all failed invariant paths preserve balances; debit precedes EVM emit; global/per-entity conservation; withdrawal receipt + exact native decrease + fee-aware recipient proof live.
- Cure/restore: N/A punitive cure/appeal; non-penalizing review retry/expiry recovery tested instead. No restoration of terminal rights.
- Consumer enforcement: canonical get_right checks holder, expiry, active prerequisite and one-time consumption; no outside system adoption/enforcement assertion.
- Undetermined/retry: append-only attempt identities, dynamic current attempt, max3, no mutation of earlier attempts or terminal rights; exhausted attempts still recover funds at expiry.
- Tooling: raw and normalized Studio receipt parsers require finalized plus execution SUCCESS; hostile receipts cannot leak private config; SDK account/address regression uses real SDK; direct semantics supplemented by AST/decorator/lint/schema and bounded exact-source Studio smoke before funding.
- Frontend: existing four wallet tests and baseline isolated browser checks retained; add real adapter/role/time/closure/finality/reload/network/proxy regressions. Every claimed browser write receives its own observed transaction evidence, not a deployment script substitute.
- Mock discipline: install web/model mocks before the transaction. Use exact public reference bytes cached locally with verified digest; no live provider calls in fast direct cases. Pin runtime/tools; local GLSim/direct proof remains distinct from Studio finalized consensus and browser wallet proof.

## Claim-to-code matrix

| Claim | Contract method/state | View/read | Test | Network evidence |
| --- | --- | --- | --- | --- |
| Exact jointly ratified 2 GEN purchase | create_offer/accept_offer; immutable digest and roles | get_agreement/get_policy | Forged signer, same digest wrong entity/version, wrong value, duplicate and expiry | PENDING: finalized creation/acceptance SUCCESS + 2 GEN escrow; browser control evidence |
| Validators determine permission prerequisites | review_dependencies; complete locked matrix/attempts | get_attempt/get_agreement | Independent semantic replay, injection, source digest/provenance, complete coverage/enum/cycle | PENDING: real LLM/validators, finalized matrix and canonical read |
| Cancellation affects exactly dependent unused rights | exit_component; ACTIVE->CANCELLED closure | get_right/get_agreement/accounting | Partial/full closure, consumed dependant, wrong role/time/state, no extra ID/refund | PENDING: finalized exit and correct affected IDs/refund credit |
| Independent permission survives and can be exercised once | consume_component; ACTIVE->CONSUMED | get_right/get_agreement | Inactive prerequisite, preserved independent state, duplicate and deadline | PENDING: real surviving-right exercise/issuer credit and browser state reload |
| Ambiguity/source failure is non-penalizing | safe RETRYABLE attempt, no hard state/credit change | get_attempt/accounting | All source/model failure codes, valid-digest unauthenticated binding, accounting snapshots | PENDING: bounded safe failure/retry or recovery canonical proof; never fabricate a provider outage |
| Every unused slice can recover after expiry | recover_expired; LOCKED/ACTIVE->EXPIRED | get_agreement/get_right/accounting | Stale phase boundary triples, partial use, no-escrow duplicate and fixed buyer destination | PENDING: expired funded recovery, refund credit and native payout |
| Credits really pay their locked recipient | withdraw; credit debit then EVM boundary | agreement/accounting + native balances | Wrong caller/duplicate/emit ordering/AST/payable metadata | PENDING: parent and recipient receipt, exact contract 1–2 GEN decrease, fee-aware recipient increase |
| No value remains in a completed agreement | close; terminal rights and zero liability | get_agreement/accounting/history | Active/locked/right-credit close rejected, zero-liability close once | PENDING: zero canonical liability and closed view, global balance reconciled |
| Full product uses real selected wallet and canonical state | Typed adapter and contextual UI controls | Paged agreement/right/history/accounting reads | Four wallet tests + SDK regression + browser routes/finality/reload/CORS | Baseline route/modal/draft PASS; real transaction/IC browser proof PENDING |
| Builders can integrate without forking judgment | Public views/adapter, single IC owner | get_right and documented wrappers | Permission eligibility and once-only boundary | Interface/design only; actual downstream adoption PENDING/unclaimed |

## Analogue and differentiation matrix

| Analogue/prior idea | Similar dimensions | Structural difference | Collision decision |
| --- | --- | --- | --- |
| CoverWeave | Constitutive authenticated grants; broad buyer/issuer incentives | Coalition completion/marginal issuer sharing -> component severance closure; atomic aggregate permit -> independently terminal slices; partial refund/preserved escrow/exercise interface | Fewer than four matching fingerprint dimensions; no duplicate |
| ConsentDelta | Ratified text affects internal rights | Amendment consent set/charter adoption -> bilateral purchased prerequisite cancellation; no council amendment vote or proposer purse | Distinct question/state/consequence/reuse |
| GrantLattice | Authenticated permission language | Parent-child attenuation/ancestry -> cross-component peer prerequisites backed by unused escrow; no grant hierarchy | Distinct mechanism |
| TraceSettle | Semantic dependency vocabulary and GEN | Fault attribution over outside workflow -> constitutive severability with no fault evidence/bonds; voluntary cancellation, no slashing | Distinct trust/evidence/question/consequence |
| SemanticSetoff | Co-ratified promises | Debt netting/discharge -> internal right partial unwind; fixed prepaid slices, no debt/netting law | Distinct state/consequence/interface |
| ParityOption | Constitutive scopes, buyer/provider and GEN | First-refusal allocation/equivalence -> dependency closure and one-time per-component exercise; no outsider or priority window | Fewer than four matching dimensions |
| ConcordBatch / SemanticNonce | Bounded graph/tickets or semantic one-time meaning | Order/conflict batch or meaning novelty -> prerequisite severability of already purchased components; not selection or semantic dedup | Distinct question/state/consequence |
| EpisodeCap / RankReserve | Complete normalized verdict and deterministic accounting | Causal report grouping/payment waterfall -> internal permission prerequisite graph; no scarce priority/occurrence policy | Distinct evidence/trust/question/state/reuse |
| Generic agent escrow / Internet Court | Bilateral money and semantic adjudication broadly | No delivery dispute or discretionary payout; neutral partial cancellation preserves unrelated rights under fixed tranche law | Broad ecosystem similarity only; no claim that generic escrow itself is novel |

All forty prior active registry fingerprints were screened at admission. The idea is not selected because of a new domain/name/frontend: the consequential partial severance mechanism is the substantive delta.

## Deployment and evidence plan

- Network: only Studio Dev, chain61997, locked IC RPC https://studio-next.genlayer.com/api, explorer https://explorer-studio-dev.genlayer.com/; verify official EVM wallet path/chain object before browser writes. Do not mix legacy Studionet or another testnet.
- Actors/wallet separation: reuse the authorized ignored parent issuer/integrator/steward EOAs as distinct issuer/buyer/recovery roles after safe variable discovery; never log/copy keys into frontend/public files. No new EOA or faucet.
- Deploy steps: npm run check -> metadata/direct/lint/schema -> unsigned exact-source simulation -> source commit/runtime identity -> signed zero-value deployment and bounded smoke -> canonical schema/state/receipt SUCCESS -> only then funded lifecycle. Keep active deployment.json and archive every superseded revision. Broken revision exception is explicit, not fake recovery.
- Consequential lifecycle: dependent A/B full 2 GEN refund; independent partial cancellation 1 GEN refund plus surviving exercise 1 GEN issuer earning; expired unreviewed/partial-used recovery; unfunded cancellation and discharged close. Demo value is 1 or 2 GEN, never dust. All required browser-visible writes need actual UI control/transaction evidence.
- Canonical reads: agreement/right/current attempt/history/policy/accounting after FINALIZED+SUCCESS; status accepted/decided alone insufficient. Read IDs dynamically; no hardcoded first attempt or invented address.
- Balance/receipt proof: explicitly allowlisted transaction ID/status/execution result/network/source identity; exact native contract decrease per withdrawal and recipient transfer/balance proof with sender fees accounted for. No raw transaction/config/stdout dumps.
- Evidence path: docs/evidence/studio-dev/ for network only; local baseline remains docs/evidence/local/frontend/. Record current command and sanitized actual output; never present simulations as deployed lifecycle.
- Resume/idempotency: check deployment identity and canonical states first; recover already-finalized writes instead of replaying. For ambiguous funding/withdrawal inspect transaction and balance before any retry. Source failure vs structural prompt/schema failure gets separate diagnosis.
- Publication/hosting/submission: proper child Git root, exact staged/history/allowlist/secret audit before every push, CI green, Vercel Vite dist, real HTTP200/name/root verification, final README links, offline precheck Projects no BLOCKER and four-source audit. Portal packet with exact counts/current links; authenticated submission only under master authorization, otherwise deliver packet without fabricating confirmation.

## Executed claim and authority trace

The following current proof supersedes the originally pending network cells above. `npm run check` validates the actual contract and adapter; exact test totals are maintained in the current README and final audit.

| Claim / authority path | Deterministic guard and semantic boundary | Required negative-test proof | Current canonical and network proof |
| --- | --- | --- | --- |
| Jointly ratified immutable internal rights | Signed issuer creates exact terms; named buyer accepts exact recomputed digest including network/contract/entity/roles/policy/expiry; only 2 GEN purchase | `test_ratification_digest_cannot_replay_between_entities`, `test_unauthorized_participant_preserves_every_view`, exact value/digest/config-lock tests | `attempts.json` has three finalized successful creations/purchases and 2 GEN escrow; `get_agreement` binds each pair |
| Fixed authoritative vocabulary | `_source_context` fetches fixed W3C origin, recomputes exact-body SHA before `_judge`; no actor URL/version/objective or destination | `test_modified_authoritative_source_cannot_reach_consequence`, malformed/source-failure and authenticated-definition tripwires | Three `*-review.json` files bind source hash, agreement digest and current attempt; live injection did not redefine authority |
| Neutral prerequisite meaning | `review_dependencies` independently reruns meaning; exact two pair IDs/enums and cycle/ambiguity rules before activation | `test_real_validator_replays_meaning_not_shape`, normalization/coverage/payout/cycle tests, `test_invalid_consensus_settlement_preserves_accounting` | Dependent `[INDEPENDENT,DEPENDENT]`, independent `[INDEPENDENT,INDEPENDENT]`, unclear `[UNVERIFIABLE,UNVERIFIABLE]`; actual browser detail reads |
| Exact cancellation / surviving one-time exercise | Contract computes closure and fixed slices; no model payee/amount/class prose accepted | Full/partial/reverse closure, consumed-dependant prohibition, inactive prerequisite, duplicate/caller/state/time negatives | Dependent 2 GEN refund; independent A refund 1 GEN and B consumed for issuer 1 GEN; canonical before/after snapshots in attempts |
| Non-penalizing ambiguity and expiry recovery | Retry changes only permitted review record; `recover_expired` independently enforces equality/late clock and fixed buyer destination | Stale-phase boundary triples, attempt cap, no-escrow duplicate, unauthorized and accounting snapshots | Unclear MODEL_UNCLEAR kept 2 GEN escrow; observer expiry recovery returned both unused slices to locked buyer |
| Native transfer and closure | Credit debited before EVM recipient emit; only terminal rights and zero escrow/credits may close | `test_credit_debit_precedes_locked_recipient_emit_and_close`, duplicate/value/state/metadata/receipt tests | Four `transferProof.proven:true` entries: exact 2/1/1/2 GEN contract decreases and fee-aware recipient increases; all CLOSED; global 6 GEN received/withdrawn, liabilities/native balance zero |
| Browser product / reusable interface | Selected-provider SDK account configuration, EVM chain preflight, separate IC reads, all nine wrappers/control/tests/finality/reload | `wallet.test.ts`, `sdk-adapter.test.ts`, `lifecycle-ui.test.tsx`; actual browser proxy/read commands | Seven functional routes, MetaMask/OKX detection, connected issuer; local and production actual canonical reads PASS. MetaMask write currently fails network preflight before hash; successful browser writes PENDING |

Proposed consumers and milestone headroom remain design claims. No outside delivery, ownership, legal enforceability, autonomous consumer enforcement or adoption is claimed.

## Definition of Done

### Shared contribution requirements

- [x] Reusable primitive, substantive semantic trust problem and fourteen admission gates.
- [x] Complete product blueprint and own skill-designed multi-page frontend baseline with typecheck/build/browser route review.
- [x] One ASCII pinned-runtime recognized contract, production semantic validator and source/settlement checks implemented and linted.
- [x] All direct/gltest/adversarial/temporal/accounting/metadata/parser/SDK tests and required npm run check pass.
- [x] Actual finalized Studio Dev judgment -> rights/money consequence -> recovery/withdrawal -> zero-liability closure; sanitized canonical/native transfer proof.
- [ ] Category remains Projects; actual public repository, CI, hosting, live verification and truthful documentation.

### Projects

- [ ] Real frontend wallet writes for every claimed lifecycle step, provider chooser and logout, verified EVM chain, separate IC read path/proxy and real SDK account regression.
- [ ] Submitted, accepted/decided, finalized successful, failed and retry feedback; canonical reads after finalization.
- [ ] Meaningful buyer partial unwind/surviving exercise and issuer earnings; every required step has wrapper/control/test/evidence.
- [ ] Browser-local RPC/CORS verification; actual extension wallet signed lifecycle evidence distinct from scripts.
- [x] UI preserves accepted design, English user copy, role/state eligibility and contextual verification rather than a system console.
- [ ] Exact current contract/test counts and README/submission claims trace to state/view/test/evidence.
- [ ] genlayer-precheck.ps1 -Project scope-exit -Category projects reports NO BLOCKER with applicable dynamic checks.
- [ ] Final master reread item-by-item proof audit; uncertainty explicitly listed; postmortem/registry updated and milestone delta recorded.

Until every unchecked item has fresh proof, this specification is an implementation design, not completion or submission readiness.

## Honest limitations

Two constitutive internal one-time rights only; no proof of outside ownership, actual agent execution/delivery, legal enforceability, automatic external access control or verified adoption. The reference is a historical fixed vocabulary snapshot; if exact bytes change, review safely waits instead of silently trusting a new document. Three bounded review attempts; ambiguous/cyclic terms may require a new unfunded offer after expiry recovery, never unilateral rewriting of a funded agreement. EOAs are the tested native withdrawal recipients; smart-contract receiver compatibility is unclaimed. Models can disagree or be wrong; independent consensus and deterministic accounting reduce unilateral authority but do not establish external truth. Local direct/simulation/UI baseline is distinct from deployed consensus, native transfer and browser signing. Public/CI/live/Portal evidence is pending until executed.

Adoption path: publish the typed rights adapter for AgentToolLeaseAdapter, DataRoomExportGateway and CreativeWorkflowBundleGateway; these are proposed consumers, not live users. Next substantial milestone after acceptance: bounded multi-component prerequisite graphs with complete pair/path validation, plus an actual holder-authorized consumer integration and new graph/accounting evidence. Document the accepted-version delta and meaningful usage; no cosmetic repackaging. Later signed consumer receipts need their own authority matrix and live authenticity proof.

## Kill criteria

Stop/reject or redesign if an interested actor can supply all consequential bytes without canonical joint ratification/authoritative origin; if any of fourteen admission gates fails; if collision review finds four matching dimensions without a structural delta; if target runtime/source/semantic spike cannot work; if validator only checks output shape; if settlement can trust model IDs/payees/amounts or strand committed unused value; if a frontend action is fake/script-only while claimed as browser complete; if a native withdrawal cannot prove actual balance decrease; if local checks or final Projects precheck have unresolved blockers. Never compensate with naming, frontend size, longer prompts or extra contracts.
