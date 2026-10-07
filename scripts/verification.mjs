function whole(value) { return typeof value === 'string' && /^\d+$/.test(value) ? BigInt(value) : null; }
function decimal(value) {
  if (typeof value !== 'string' || !/^\d+(\.\d{1,18})?$/.test(value)) return null;
  const [integer, fraction = ''] = value.split('.');
  return BigInt(integer) * 10n ** 18n + BigInt(fraction.padEnd(18, '0'));
}
export function closedCase(snapshot) {
  const a = snapshot?.agreement;
  return Boolean(a && a.phase === 'CLOSED' && a.escrowGEN === '0' && a.buyerCreditGEN === '0' && a.issuerCreditGEN === '0'
    && whole(a.receivedGEN) !== null && whole(a.receivedGEN) === whole(a.withdrawnGEN)
    && Array.isArray(a.permissions) && a.permissions.length === 2
    && a.permissions.every(p => ['CONSUMED', 'CANCELLED', 'EXPIRED'].includes(p.status)));
}
export function nativeLedgerConserved(snapshot) {
  const a = snapshot?.accounting;
  if (!a?.conserved) return false;
  const escrow = whole(a.escrowGEN), credit = whole(a.creditsGEN), balance = decimal(snapshot.contractBalanceGEN);
  return escrow !== null && credit !== null && balance !== null && balance === (escrow + credit) * 10n ** 18n;
}
