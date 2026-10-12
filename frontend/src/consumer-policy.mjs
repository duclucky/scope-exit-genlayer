export const CONSUMER = Object.freeze({
  protocol: 'ScopeExit export v1', origin: 'https://scope-exit-genlayer.vercel.app',
  chainId: 61997, contract: '0x61619ed664eAB90043765E5bA431EDa35F260fb5',
  issuer: '0xC495ef51618D03267A1f227aFe5b27B38c748272',
  resource: 'scopeexit-sample-records', version: '1',
  sha256: 'ccc772323809597156f8ce26adff3c3167158835119e3f485ecbbf4462eb0d29', component: 'B', title: 'Dataset export',
});
export const exportTerms = () => `The named buyer may export resource ${CONSUMER.resource} version ${CONSUMER.version} SHA-256 ${CONSUMER.sha256} independently of analysis permission A. ScopeExit exercise of permission B authorizes repeat delivery of these exact synthetic CSV bytes by the ScopeExit consumer.`;
export const EXTENSION_GRANT = Object.freeze({id:'ms001-extension-v1',issuer:'0x45248be151F7f7e230150db23774733Cd966Eb45',buyer:CONSUMER.issuer});
export function authorization(agreement, issuedAt) {
  return { protocol: CONSUMER.protocol, origin: CONSUMER.origin, chainId: CONSUMER.chainId,
    contract: CONSUMER.contract, agreementId: agreement.id, digest: agreement.digest,
    resource: CONSUMER.resource, version: CONSUMER.version, sha256: CONSUMER.sha256,
    component: 'B', issuedAt };
}
export const authorizationMessage = fields => JSON.stringify(fields);
export function registeredGrant(a) {
  const authorizedIssuer = a?.issuer?.toLowerCase() === CONSUMER.issuer.toLowerCase()
    || a?.id === EXTENSION_GRANT.id && a?.issuer?.toLowerCase() === EXTENSION_GRANT.issuer.toLowerCase()
      && a?.buyer?.toLowerCase() === EXTENSION_GRANT.buyer.toLowerCase();
  return authorizedIssuer
    && a.permissions?.[1]?.id === 'B' && a.permissions[1].title === CONSUMER.title
    && a.permissions[1].terms === exportTerms();
}
