import test from 'node:test';
import assert from 'node:assert/strict';
import { executionResult, publicReceipt } from '../../scripts/receipt.mjs';

test('raw Studio leaders and normalized SDK receipts require execution SUCCESS', () => {
  assert.equal(executionResult({ consensus_data: { leader_receipt: [{ execution_result: 'SUCCESS' }] } }), 'SUCCESS');
  assert.equal(executionResult({ executionResult: 'SUCCESS' }), 'SUCCESS');
  assert.equal(executionResult({ status: 'FINALIZED' }), 'UNKNOWN');
  assert.equal(executionResult({ executionResult: 'SUCCESS', consensus_data: { leader_receipt: [{ execution_result: 'ERROR' }] } }), 'ERROR');
});

test('public projection discards all validator and payload material', () => {
  const result = publicReceipt({ status: 'FINALIZED', execution_result: 'SUCCESS',
    node_config: { confidential: 'must-not-survive' }, data: { contract_address: '0x' + 'a'.repeat(40), private: 'must-not-survive' } }, '0x' + 'b'.repeat(64));
  assert.deepEqual(Object.keys(result), ['hash', 'status', 'executionResult', 'contractAddress']);
  assert.equal(result.contractAddress, '0x' + 'a'.repeat(40));
  assert.ok(!JSON.stringify(result).includes('must-not-survive'));
});

test('actual Studio leader + validator-path shape agrees with protocol result', () => {
  const receipt = { status: 'FINALIZED', txExecutionResult: 1,
    consensus_data: { leader_receipt: [
      { mode: 'leader', execution_result: 'SUCCESS' },
      { mode: 'validator', execution_result: 'ERROR' },
    ] } };
  assert.equal(executionResult(receipt), 'SUCCESS');
  assert.equal(executionResult({ ...receipt, txExecutionResult: 2 }), 'ERROR');
  assert.equal(executionResult({ status: 'PENDING', txExecutionResult: 0 }), 'UNKNOWN');
  assert.equal(executionResult({ status: 'PENDING', txExecutionResultName: 'NOT_VOTED' }), 'UNKNOWN');
  assert.equal(executionResult({ ...receipt, consensus_data: { leader_receipt: [{ mode: 'leader', execution_result: 'ERROR' }] } }), 'ERROR');
  assert.equal(executionResult({ consensus_data: { leader_receipt: [{ mode: 'validator', execution_result: 'SUCCESS' }] } }), 'UNKNOWN');
});
