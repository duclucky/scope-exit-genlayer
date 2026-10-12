export function exportHandler(request: {method?:string;body:unknown},response: {status(code:number):any;json(value:unknown):void;setHeader(name:string,value:string):void}):Promise<unknown>;
