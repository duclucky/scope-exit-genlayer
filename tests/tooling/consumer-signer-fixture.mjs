// Ephemeral Node test signer. Never loaded by the production frontend.
import {generatePrivateKey,privateKeyToAccount} from '../../frontend/node_modules/viem/_esm/accounts/index.js';
export const testHolder=privateKeyToAccount(generatePrivateKey());
