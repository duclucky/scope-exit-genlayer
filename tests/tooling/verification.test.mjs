import test from 'node:test';
import assert from 'node:assert/strict';
import { closedCase, nativeLedgerConserved } from '../../scripts/verification.mjs';
const snapshot = { agreement: { phase: 'CLOSED', receivedGEN: '0', withdrawnGEN: '0', escrowGEN: '0', buyerCreditGEN: '0', issuerCreditGEN: '0', permissions: [{ status: 'CANCELLED' }, { status: 'CANCELLED' }] }, accounting: { receivedGEN: '6', withdrawnGEN: '4', escrowGEN: '2', creditsGEN: '0', conserved: true }, contractBalanceGEN: '2' };
test('an unfunded closed smoke remains valid after other purchases and withdrawals', () => {
  assert.ok(closedCase(snapshot));
  assert.ok(nativeLedgerConserved(snapshot));
  assert.ok(closedCase({ ...snapshot, agreement: { ...snapshot.agreement, receivedGEN: '2', withdrawnGEN: '2' } }));
});
test('credits, surviving rights and a mismatched native balance prevent completion', () => {
  assert.equal(closedCase({ ...snapshot, agreement: { ...snapshot.agreement, buyerCreditGEN: '1' } }), false);
  assert.equal(closedCase({ ...snapshot, agreement: { ...snapshot.agreement, permissions: [{ status: 'ACTIVE' }, { status: 'CANCELLED' }] } }), false);
  assert.equal(nativeLedgerConserved({ ...snapshot, contractBalanceGEN: '1.999999999999999999' }), false);
  assert.equal(nativeLedgerConserved({ ...snapshot, accounting: { ...snapshot.accounting, conserved: false } }), false);
});
