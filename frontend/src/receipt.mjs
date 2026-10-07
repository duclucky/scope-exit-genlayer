// Raw Studio can include leader and validator-path entries in leader_receipt.
// Read execution from leader mode and cross-check the protocol result. A
// validator-path return is not the contract's execution result.
export function executionResult(raw) {
  if (!raw || typeof raw !== 'object') return 'UNKNOWN';
  const entries = raw.consensus_data?.leader_receipt;
  const receipts = Array.isArray(entries) ? entries : entries && typeof entries === 'object' ? [entries] : [];
  const marked = receipts.some(x => x?.mode != null);
  const leaders = marked ? receipts.filter(x => x?.mode === 'leader' || x?.mode === 'LEADER') : receipts;
  if (marked && leaders.length !== 1) return 'UNKNOWN';
  const signals = [raw.executionResult, raw.execution_result, ...leaders.map(x => x?.execution_result)].filter(x => x != null);
  const protocol = raw.txExecutionResultName ?? raw.tx_execution_result_name ?? raw.txExecutionResult ?? raw.tx_execution_result;
  if (protocol === 0 || protocol === '0' || protocol === 'NOT_VOTED') return 'UNKNOWN';
  if (protocol != null) signals.push(protocol === 'FINISHED_WITH_RETURN' || protocol === 1 || protocol === '1' ? 'SUCCESS' : 'ERROR');
  if (signals.some(x => x !== 'SUCCESS')) return 'ERROR';
  return signals.length ? 'SUCCESS' : 'UNKNOWN';
}
