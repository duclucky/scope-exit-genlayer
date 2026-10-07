# Local verification

`npm run check` runs official GenVM lint and SDK validation, direct contract tests,
GLSim fluent RPC integration, receipt projection tests, frontend tests,
TypeScript and the production build. Python is 3.12; the concrete contract
Depends hash remains paired with the v0.6.0-rc8 runner artifacts.

The upstream linter's AST entrypoint table predates `run_nondet_default`.
`scripts/genvm_lint.py` extends its safe-entry AND nested-spawn tables in memory.
Negative tests prove unguarded nondeterminism and nested spawns still fail.
Official SDK semantic validation is unchanged. No installed package is edited.

Direct tests use upstream storage and calldata argument round trips. The Windows
loader needs deferred unlink of its locked stdin file; test warp needs to expose
the VM timestamp through the v0.3 message context. Neither changes production
clock, authorization, judgment or accounting. Validator replay tests call the
actual captured validator and reject a valid-shaped alternative meaning.

The isolated GLSim server has three validators and strict preinstalled web/LLM
mocks. It has no wallet secrets or paid provider handlers. Two documented
transport accommodations expose the SDK's empty-string calldata method key to
the simulator dispatcher and its already-decoded signed user value to the VM.
They do not change signed SDK encoding or contract checks. A fixed official
reference cache must match the production source digest before use.

GLSim validates purchase, independent semantic replay and dependency closure
into buyer credit. This GLSim version does not implement the native GEN ledger
for the current EVM recipient boundary. Direct withdrawal tests prove locked
recipient, debit-before-emit, conservation and one-time closure using a clearly
mocked external boundary. Neither is proof of an actual GEN transfer. Studio Dev
must separately prove the exact native contract-balance decrease, recipient
receipt/balance result, final successful execution and zero-liability closure.

Local UI, mocked consensus and unsigned runtime probes are not finalized Studio
Dev lifecycle or browser-wallet signing evidence. Those remain pending.
