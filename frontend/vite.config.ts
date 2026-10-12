import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { proxy } from './server/rpc.mjs';
import { exportHandler } from './server/consumer.mjs';
export default defineConfig({ plugins: [react(), {
  name: 'scopeexit-local-rpc',
  configureServer(server) {
    server.middlewares.use('/api/export', async (request,response) => {
      let body=''; for await(const part of request) { body+=String(part); if(body.length>4096) { response.statusCode=413; response.end(); return; } }
      const reply={status(code:number){response.statusCode=code;return reply;},json(value:unknown){response.setHeader('Content-Type','application/json');response.end(JSON.stringify(value));},setHeader(name:string,value:string){response.setHeader(name,value);}};
      await exportHandler({method:request.method,body},reply);
    });
    for (const [path, endpoint] of [['/api/ic-rpc', 'https://studio-next.genlayer.com/api'], ['/api/wallet-rpc', 'https://studio-dev.genlayer.com/api']]) {
      server.middlewares.use(path, async (request, response) => {
        let body = '';
        for await (const part of request) body += String(part);
        const reply = {
          status(code: number) { response.statusCode = code; return reply; },
          json(value: unknown) { response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(value)); },
          setHeader(name: string, value: string) { response.setHeader(name, value); },
        };
        try { await proxy(endpoint)({ method: request.method, body }, reply); }
        catch { reply.status(400).json({ error: 'Invalid request' }); }
      });
    }
  },
}] });
