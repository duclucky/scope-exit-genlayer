# Frontend baseline review

Stage: frontend built and reviewed before contract implementation. The typed adapter is deliberately unconfigured. Configuration notices and disabled transactions describe the real state.

`npm run check` on 2026-10-07: four wallet behavior tests passed; TypeScript passed; Vite production build completed. This command currently covers the admitted frontend; contract lint/direct tests will be added when the contract exists.

`FRONTEND_REVIEW_URL=http://127.0.0.1:5178/ node scripts/frontend-review.mjs`: `passed:true`, 28 route checks across 375, 768, 1024 and 1440 px, four modal/form reviews, zero page errors. See [sanitized browser proof](evidence/local/frontend/review.json), [small-screen screenshot](evidence/local/frontend/home-375.png), [desktop screenshot](evidence/local/frontend/home-1440.png).

The review exercised all seven routes, persistent navigation, no horizontal overflow, an empty-wallet picker, Escape dismissal, field validation, a valid unpublished draft and keyboard skip navigation that preserves the app route. Chrome with real extensions also showed a centered picker listing MetaMask and OKX, without automatically choosing either or requesting accounts during discovery.

Findings corrected before moving on: duplicate injected/EIP-6963 provider entries; error messages contaminating input labels; skip link changing the hash route; hero heading hierarchy; mobile input/body sizing. Targeted regressions failed before the relevant fixes and passed afterward. The Vite startup command was corrected after npm interpreted the port as a directory. Wallet selection tests verify actual request routing at the provider interface, not live signed transactions.

Visibility review: primary pages expose terms, participant roles, expiry, eligible actions and user outcomes. Digests and transaction references sit in disclosure panels; validator/configuration/audit internals do not occupy the product surface. Illustrative landing permissions are explicitly labeled examples and never enter agreement state.

Limits: no deployed-contract/RPC proof, browser-wallet transaction lifecycle, GEN transfer, external consumer enforcement or adoption is claimed. Those are separate acceptance gates.
