# Observed browser issuer lifecycle

The owner operated Chrome MetaMask at the local frontend on Studio Dev, chain
61997. The connected issuer was 0xC495ef51618D03267A1f227aFe5b27B38c748272.
The deployed contract was 0x61619ed664eAB90043765E5bA431EDa35F260fb5.
This proves the issuer workflow for agreement `sx-ddc3df46` through the actual
frontend, selected extension, SDK finality handling and canonical state reload.

| Browser action | Finalized successful transaction | Canonical outcome |
| --- | --- | --- |
| Publish offer | 0x52b386583f0c7f5b3d5be3eeb0733de1151010cb0b48ceb57ccf1fa810d2e343 | Exact terms, buyer and expiry locked; OFFERED |
| Check dependencies | 0x038c34e4f1780428e74c00f3539ff1412a5219e5a00a5617669df31e4cc1788b | Both INDEPENDENT, both ACTIVE; UI progressed from Accepted to Confirmed |
| Withdraw 1 GEN | 0xb57a7252af7a24524f0aba706bbeaeb58848c383df64635e542b817e34376120 | Issuer credit zero; exact native contract decrease 1 GEN |
| Finish agreement | 0x0b6d770ce362907e4ded10c3772ecbe4325f9748be40501da0a078e9f9a34015 | CLOSED; UI All settled / Confirmed, zero escrow/credits |

`node scripts/browser-evidence.mjs sx-ddc3df46 <observed-hash>` independently
checks FINALIZED/SUCCESS, decodes calldata to bind method and agreement, checks
sender/target, and reads finalized agreement/history. Per-action JSON is under
`evidence/studio-dev/browser-sx-ddc3df46-*.json`; raw receipts are never saved.
The creation hash was observed on the official Explorer; later hashes were
observed in the frontend's transaction disclosure. Owner messages confirmed
the manual signatures. Screenshots show review finality and final closure.

For withdrawal, `node scripts/browser-transfer.mjs before sx-ddc3df46` saved the
baseline before signing. The `after` command proved contract 1 -> 0 GEN,
locked-recipient native message, issuer credit 1 -> 0 GEN and recipient net
increase 0.999873692249999177 GEN after transaction cost. The expected transfer
was 1 GEN, not that fee-adjusted net amount.

The named buyer's 2 GEN purchase, partial A exit, B consumption and 1 GEN refund
were signed by the separately authorized script account. They are recorded as
`browser-sx-ddc3df46-*` counterpart attempts in `attempts.json`. That naming
identifies the case, not the signing mechanism. Buyer native refund also proves
an exact 1 GEN contract decrease. These actions are not claimed as extension
signatures. The issuer saw their canonical consequence before withdrawing.

Earlier wallet connection/network/signing failures were displayed as failed
states without a fabricated hash. The user then manually connected and signed;
no failed call was counted as success. Actual SDK regressions cover nine write
wrappers, role/state controls, exact GEN, failures, finality and canonical reload.
All nine distinct actions have not been manually signed through extensions;
other wallet brands and outside consumer adoption remain unverified.
