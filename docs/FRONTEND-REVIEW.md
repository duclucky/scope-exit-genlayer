# Frontend baseline review

Stage: frontend built and reviewed before contract implementation. The typed adapter is deliberately unconfigured. Configuration notices and disabled transactions describe the real state.

`npm run check` on 2026-10-07: four wallet behavior tests passed; TypeScript passed; Vite production build completed. This command currently covers the admitted frontend; contract lint/direct tests will be added when the contract exists.

`FRONTEND_REVIEW_URL=http://127.0.0.1:5178/ node scripts/frontend-review.mjs`: `passed:true`, 28 route checks across 375, 768, 1024 and 1440 px, four modal/form reviews, zero page errors. See [sanitized browser proof](evidence/local/frontend/review.json), [small-screen screenshot](evidence/local/frontend/home-375.png), [desktop screenshot](evidence/local/frontend/home-1440.png).

The review exercised all seven routes, persistent navigation, no horizontal overflow, an empty-wallet picker, Escape dismissal, field validation, a valid unpublished draft and keyboard skip navigation that preserves the app route. Chrome with real extensions also showed a centered picker listing MetaMask and OKX, without automatically choosing either or requesting accounts during discovery.

Findings corrected before moving on: duplicate injected/EIP-6963 provider entries; error messages contaminating input labels; skip link changing the hash route; hero heading hierarchy; mobile input/body sizing. Targeted regressions failed before the relevant fixes and passed afterward. The Vite startup command was corrected after npm interpreted the port as a directory. Wallet selection tests verify actual request routing at the provider interface, not live signed transactions.

Visibility review: primary pages expose terms, participant roles, expiry, eligible actions and user outcomes. Digests and transaction references sit in disclosure panels; validator/configuration/audit internals do not occupy the product surface. Illustrative landing permissions are explicitly labeled examples and never enter agreement state.

Historical baseline limits: the Phase 3B review did not prove deployed RPC, wallet signing or transfers. It remains preserved as baseline evidence.

Integration review: `npm run check` now passes 30 frontend tests including all nine methods through the actual SDK, role/state controls, exact purchase GEN, finality, canonical reload and safe failure guidance. `node scripts/browser-rpc-review.mjs` proves both same-origin paths return HTTP 200 and chain 61997 in an actual browser. `node scripts/browser-state-review.mjs` reads four finalized agreements, three canonical result details and 23 historical events, with zero page errors. The same commands against the verified production URL also pass; evidence is in `evidence/studio-dev/frontend-production/`.

Chrome MetaMask is connected to the authorized issuer account. Actual extension-signed lifecycle evidence remains pending. Script-signed native transfers are separately recorded and do not substitute for browser writes. No external consumer enforcement or adoption is claimed.
