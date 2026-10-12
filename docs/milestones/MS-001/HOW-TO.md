# Try the registered export consumer

## Inspect without spending GEN

Open https://scope-exit-genlayer.vercel.app/#/agreements/ms001-export-v1.
Read Dataset analysis and Dataset export, their dependency summaries, current
states and the registered resource details. A visitor can inspect this record;
only its named buyer can authorize delivery. The test record is not a public
offer to any wallet. Script/extension evidence labels are in the phase dossier.

## Repeat the owner's extension download

1. Open https://scope-exit-genlayer.vercel.app/#/agreements/ms001-extension-v1.
2. Click **Connect wallet**, choose **MetaMask** and select
   `0xc495ef51618d03267a1f227afe5b27b38c748272`. This is this case's named buyer;
   the original demonstration uses a different buyer.
3. Check that Dataset analysis is cancelled and Dataset export is used. Purchase,
   review, exercise, both withdrawals and closure have already finalized through
   authorized preparation scripts. Do not purchase or exercise again.
4. In **Download your dataset**, click **Download verified CSV**.
5. Inspect the **ScopeExit export v1** authorization and sign in MetaMask.
   This is a message signature: no transaction, GEN transfer or network fee.
6. The app verifies the returned digest before downloading
   `scopeexit-sample-records-v1.csv`. The CSV has columns `record_id,category,value`
   and rows `1,analysis,12`, `2,export,7`, `3,reference,5`.
7. On an error, refresh and retry the download with a fresh signature. Closed
   status does not revoke the already consumed Export right. Do not exercise again.

The owner reported successful download and supplied a screenshot of these rows.
See [extension-delivery.json](../../evidence/studio-dev/ms-001/production/extension-delivery.json)
for evidence authority and limits; this is separate from script-signer browser QA.

## Create a new registered grant

1. Connect the service issuer wallet
   `0xC495ef51618D03267A1f227aFe5b27B38c748272` using the wallet picker.
   A different issuer may create normal ScopeExit offers but cannot grant this
   consumer's dataset. No reviewer needs or should request the issuer's key.
2. Open Create an offer. Click **Use registered dataset scopes**. This fills the
   exact resource-bound titles/terms into a draft; it does not publish anything.
   Enter a distinct named buyer's wallet address and an expiry one day ahead.
3. Review all fields, then Publish offer and sign with 0 GEN attached, plus real
   Studio Dev network fees. Wait for Confirmed and save the agreement URL.
4. Switch to that named buyer. Open the URL and Accept for 2 GEN, with fees
   separate. Wait for successful finalization and canonical reload.
5. Either participant clicks Check dependencies and signs with 0 GEN attached.
   Wait for both scopes to show Can stand on its own. If ambiguous, do not use
   either right; follow retry/expiry recovery in the original walkthrough.
6. As buyer, under Dataset analysis click Cancel unused, inspect the 1 GEN
   refund preview, confirm and sign. Wait for Confirmed. Dataset export stays
   available with its 1 GEN escrow.
7. Under Dataset export click Use permission and sign with 0 GEN attached plus
   fees. Wait for successful finalization and the canonical Used status. This
   exercises the internal right once and opens issuer earnings; it is not an
   outside delivery attestation.
8. In **Download your dataset**, click **Download verified CSV**. Sign the readable
   ScopeExit export authorization using that buyer wallet. This is personal_sign,
   not a transaction; it sends no GEN or fee. The message binds the service
   origin, Studio Dev, accepted contract, agreement/digest, resource/version/hash
   and a two-minute timestamp window. Reject unexpected message fields.
9. The server checks the signature and finalized exercise history, then the app
   verifies the returned byte digest before saving
   `scopeexit-sample-records-v1.csv`. It contains a header and three synthetic
   rows. The success notice confirms the registered SHA-256 match.
10. A failed download leaves the consumed right unchanged. Retry download with
    a fresh authorization; do not exercise again. An identical authorized request
    may deliver identical bytes again. Delivery also works after discharged closure.
11. Withdraw the buyer's 1 GEN refund and issuer's 1 GEN earnings through their
    respective wallet accounts; each withdrawal request attaches 0 GEN plus fees.
    Wait for successful finalization and zero credits. Finish agreement once
    rights and liabilities are discharged. If rights remain unused at expiry,
    Recover unused funds follows the original locked-buyer refund rule.

The dataset is public synthetic content. The milestone demonstrates actual
consumer endpoint authorization, not data confidentiality or third-party adoption.
