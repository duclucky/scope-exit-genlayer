import type {Agreement} from './adapter';
export const CONSUMER: {protocol:string;origin:string;chainId:number;contract:string;issuer:string;resource:string;version:string;sha256:string;component:string;title:string};
export function authorization(agreement: Pick<Agreement,'id'|'digest'>,issuedAt:number):Record<string,unknown>;
export function authorizationMessage(fields:Record<string,unknown>):string;
export function exportTerms():string;
export function registeredGrant(agreement:Agreement):boolean;
export const EXTENSION_GRANT:{id:string;issuer:string;buyer:string};
