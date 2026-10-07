interface Request { method?: string; body: unknown }
interface Response { status(code: number): Response; json(value: unknown): void; setHeader(name: string, value: string): void }
export function proxy(endpoint: string): (request: Request, response: Response) => Promise<unknown>;
