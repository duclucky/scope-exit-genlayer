const address = value => typeof value === 'string' && /^0x[\da-f]{40}$/i.test(value) ? value : null;
const hash = value => typeof value === 'string' && /^0x[\da-f]{64}$/i.test(value) ? value : null;
import { executionResult } from '../frontend/src/receipt.mjs';
export { executionResult };

// A strict public allowlist: never persist the original receipt or nested configs.
export function publicReceipt(receipt, transactionHash) {
  return {
    hash: hash(transactionHash ?? receipt?.hash ?? receipt?.transactionHash),
    status: typeof receipt?.status === 'string' ? receipt.status : null,
    executionResult: executionResult(receipt),
    contractAddress: address(receipt?.data?.contract_address ?? receipt?.contractAddress
      ?? receipt?.contract_address),
  };
}
