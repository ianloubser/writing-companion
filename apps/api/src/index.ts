import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createAuth } from '@repo/db';
import { aiRouter } from './routes/ai';
import type { Env } from './env';

const app = new Hono<{ Bindings: Env }>();

// 1. CORS for the Vite SPA (dev + production Pages origin).
app.use(
  '/api/*',
  cors({
    origin: [
      'http://localhost:5173',
      'https://your-production-url.pages.dev',
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

// 2. Mount Better Auth (sessions, sign-in/up) — imported from the shared db package.
app.all('/api/auth/*', (c) =>
  createAuth({
    ...c.env,
    TRUSTED_ORIGINS: c.env.TRUSTED_ORIGINS?.split(',').filter(Boolean) ?? [],
  }).handler(c.req.raw),
);

// 3. Mount AI endpoints (streaming suggestions).
app.route('/api/ai', aiRouter);

app.get('/', (c) =>
  c.json({ ok: true, service: 'writing-companion-api' }),
);

export default app;
