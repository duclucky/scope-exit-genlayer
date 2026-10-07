# Projects acceptance review

The actual local workspace command ran against this child project, with category
`projects`, applicable dynamic checks enabled, and the repository, Explorer and
submission description supplied:

```powershell
$env:PATH=(Resolve-Path '.venv\Scripts').Path+';'+$env:PATH
$env:PYTHONUTF8='1'
$env:GENVM_VERSION='v0.6.0-rc8'
& '..\tools\genlayer-grading-bot\genlayer-precheck.ps1' -Project (Get-Location).Path -Category projects -RepoUrl https://github.com/duclucky/scope-exit-genlayer -ExplorerUrl https://explorer-studio-dev.genlayer.com/address/0x61619ed664eAB90043765E5bA431EDa35F260fb5 -NotesFile docs\SUBMISSION-DESCRIPTION.txt
```

Actual output: `Summary: 0 BLOCKER, 1 WARN, 7 auto-verified OK`.
Dynamic `npm run check` and `gltest tests/` passed; all five Projects grade gates
passed. The process exits 1 for the warning. This is not a zero-warning result
and the rubric estimate is not an official steward score.

The payability warning matches `_no_value`, which reads and rejects any attached
value for every non-purchase write. It does not receive funds. Only
`accept_offer` is payable: the direct AST/metadata regression, GenVM lint and
the deployed 16-method schema agree. Making the rejecting helper payable would
weaken the implementation and is not a valid fix for this heuristic.

The rubric's custom-validator heuristic misses the actual independently replayed
`run_nondet_default` validator. Its simulation heuristic matches honest help text
and test fixtures. Meaning replay and account/value/finality behavior are tested
through the actual SDK; test fixtures never become canonical product state.
Network and browser evidence retain their separate labels. A final receipt alone
does not establish transfer: native balance changes are required and recorded.

The workspace checker is intentionally outside the public deliverable. Its raw
control reports are ignored; this document records the allowlisted result and
the manual resolution. Browser issuer create/review/withdraw/close now passes with exact native proof;
final public-commit CI and final audit are being reconciled separately.
