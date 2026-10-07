# Studio Dev evidence

Network identity: chain 61997. Intelligent Contract RPC is the locked Studio
Next alias; wallet/EVM RPC is the matching SDK's canonical Studio Dev endpoint.
Both identities were checked before signing. Evidence from another network is
not included.

Active deployment: `deployment.json` binds the exact source hash and commit,
concrete Depends runner/API family, SDK version, network, address and successful
finalized deployment hash. `runtime-smoke.json` is an **unsigned simulation**,
not a submitted deployment. `zero-value-smoke.json` checks the deployed schema
and a real unfunded create/cancel/close cycle before value is sent.

Deployment Result: SUCCESS; Status: FINALIZED. The exact deployment hash is
`0x0e835e7637327a287ecc1d141d514e7e03581740f1876e901a88b5f6a228a8ef`.
This statement is supported by the projected deploy receipt in `attempts.json`.

`attempts.json` contains only public actors, action inputs, GEN amounts, quoted
fee budgets, transaction hashes, projected status/execution results, canonical
reads and transfer proofs. No raw receipts, stdout, stderr, traces or validator
configurations are saved. Fee budgets are network estimates; they are not the
application purchase purse.

`dependent-review.json` records the actual canonical A->B INDEPENDENT / B->A
DEPENDENT verdict after live source retrieval and independent semantic review.
The B clause included an untrusted attempt to override classification/payment;
it did not redefine authority or destinations. `dependent-lifecycle.json`
records the final closed agreement. Its buyer withdrawal is separately proven
in `attempts.json`: exactly 2 GEN left the native contract balance, an external
message binds the locked buyer and amount, the buyer's native balance increased
after transaction costs, and the credit became zero.

`independent-review.json` and `independent-lifecycle.json` prove a 1 GEN buyer
refund while B survives and is exercised once for 1 GEN issuer earnings. Both
withdrawals have separate exact native-decrease and locked-recipient proofs.
`unclear-review.json` records MODEL_UNCLEAR with two UNVERIFIABLE relations and
unchanged 2 GEN escrow. After expiry, an unrelated observer recovered unused
escrow to the locked buyer; `unclear-lifecycle.json` records withdrawal and
closure. That checkpoint showed 6 GEN received/withdrawn and zero liability. After the
additional browser issuer case, current totals are 8 GEN received/withdrawn,
zero escrow/credits and zero native contract balance.

The browser issuer case sx-ddc3df46 proves real MetaMask create/review/withdraw/close
with canonical reload and an exact 1 GEN native transfer. Buyer purchase/exit/use/refund
are explicitly script-signed counterpart actions. See ../../BROWSER-EVIDENCE.md.
All four funded cases are closed and six native withdrawals are proven.
