const address = value => typeof value === 'string' && /^0x[\da-f]{40}$/i.test(value) ? value : null;
const hash = value => typeof value === 'string' && /^0x[\da-f]{64}$/i.test(value) ? value : null;

export function executionResult(receipt) {
  const leaders = receipt?.consensus_data?.leader_receipt;
  const values = [receipt?.executionResult, receipt?.execution_result,
    ...(Array.isArray(leaders) ? leaders.map(x => x?.execution_result) : [])].filter(x => x != null);
  return values.length > 0 && values.every(x => x === 'SUCCESS') ? 'SUCCESS'
    : values.some(x => x === 'ERROR' || x === 'FAILURE') ? 'ERROR' : 'UNKNOWN';
}

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
