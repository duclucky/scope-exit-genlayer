# ScopeExit walkthrough

Use two distinct Studio Dev wallet accounts. Purchase value is 2 GEN; other calls attach 0 GEN and still require network fees. Wait for successful finalization and canonical reload after each write.

## 1. Prepare issuer and buyer wallets

Open https://scope-exit-genlayer.vercel.app. Use two distinct wallet accounts: an issuer and a named buyer. Both need Studio Dev GEN for network fees; the buyer also needs 2 GEN for the purchase. Click Connect wallet, choose a detected extension, and approve connection. Confirm the issuer address shown in the header. The app checks Studio Dev (chain 61997) before writes.

## 2. Create and define both scopes

Click Create an offer. Enter an Offer title and the full Buyer wallet address of the second account. Choose Permission expiry (your local time) more than one minute and no more than 30 days ahead; one day is suitable for this walkthrough. Check that the buyer is different from the connected issuer. Set Permission A name to Analysis and its terms to: The named buyer may analyse the registered record independently of export permission B. Set Permission B name to Export and its terms to: The named buyer may export the registered record independently of analysis permission A. Each component costs 1 GEN. These create internal ScopeExit rights, not proof of external delivery.

## 3. Review and publish

Click Review offer. Check both scopes, buyer, expiry and total purchase of 2 GEN. Click Publish offer and sign with the issuer wallet; the attached purchase value is 0 GEN, with network fees separate. Wait for successful finalization and the agreement detail page. Save the agreement URL for both parties; published terms are immutable.

## 4. Buy as the named buyer

Switch the extension to the named buyer account. If the header does not show that buyer, click the connected address, Disconnect wallet, then reconnect and choose the extension. Open the saved agreement URL. Read both scopes and click Accept for 2 GEN. Check the wallet value is 2 GEN plus network fees, sign, and wait for Confirmed with canonical state reloaded.

## 5. Check dependencies

Either named party can click Check dependencies before expiry. Sign the request with 0 GEN attached plus network fees. Wait through submission, acceptance and finalization. For these independent terms, both permissions should show Can stand on its own. If review is unclear, funds remain held safely; do not proceed to cancellation or use until a successful review.

## 6. Cancel Analysis as buyer

Reconnect or switch to the named buyer. Under Analysis, click Cancel unused. Read the preview: only Analysis should be cancelled and the refund should be 1 GEN. Click Confirm cancellation and sign with 0 GEN attached plus fees. Wait for Confirmed. Analysis should show Cancelled, while Export remains available with 1 GEN held for that unused permission.

## 7. Use Export once

As the buyer, under Export click Use permission before expiry and sign with 0 GEN attached plus fees. Wait for Confirmed and the canonical reload. Export becomes Used; its 1 GEN slice becomes issuer earnings. This one-time use is an internal right transition, not a claim that an outside service delivered an export.

## 8. Withdraw refund and earnings

While connected as the buyer, click Withdraw 1 GEN on the agreement page. Sign the withdrawal request with 0 GEN attached plus fees. Wait for successful finalization; the refund credit becomes zero and the buyer wallet receives 1 GEN, less the transaction fee paid by that wallet. Check the transaction reference if needed. Switch or reconnect to the issuer account and open the same agreement. Confirm Your available earnings: 1 GEN, then click Withdraw 1 GEN and sign with 0 GEN attached plus fees. Wait for Confirmed. Issuer credit becomes zero; receipt and native balance evidence should show 1 GEN leaving the contract for the locked issuer.

## 9. Finish the agreement

Once both rights are terminal and escrow plus both credits are zero, either party can click Finish agreement and sign with 0 GEN attached plus fees. Wait for Confirmed. The page should show All settled, no unused funds and no remaining withdrawal or exercise actions.

## 10. Recover after expiry if needed

Alternative branch: if review stays unclear or a permission remains unused, wait until the displayed expiry. Click Recover unused funds, sign, and wait for Confirmed. Only remaining unused slices become buyer refund credit; an already used slice remains issuer earnings. The buyer then withdraws the refund, the issuer withdraws any earnings, and a party finishes the discharged agreement. Retry review is available before expiry, up to three attempts.

## 11. Cancel an unfunded offer

Alternative branch: before the buyer purchases, the issuer can click Cancel offer and sign with 0 GEN attached plus fees. Wait for Confirmed, then Finish agreement when eligible. This cancellation is available only for an unfunded offer; it cannot cancel a funded purchase or redirect funds.

## 12. Verify history and existing cases

Open Activity to inspect canonical offer, purchase, review, cancellation, use, withdrawal and closure events. For a no-payment review, open Agreements and inspect demo-independent-v1: Analysis cancelled, Export used, closed with zero liabilities. demo-dependent-v1 shows a 2 GEN buyer refund; demo-unclear-v1 shows safe ambiguity followed by expiry recovery. Expand Verification details or transaction references only when checking identity and receipts.
