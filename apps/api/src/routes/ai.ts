import { Hono } from 'hono';
import type { SuggestRequest, SuggestStreamEvent } from '@repo/types';
import type { Env } from '../env';
import { buildMessages } from '../prompt';

export const aiRouter = new Hono<{ Bindings: Env }>();

/**
 * POST /api/ai/suggest
 *
 * Streams AI feedback as Server-Sent Events. The frontend reads the
 * readable stream chunk by chunk and appends deltas to `aiFeedback`.
 */
aiRouter.post('/suggest', async (c) => {
  const body = await c.req.json<SuggestRequest>().catch(() => null);
  if (!body || !body.context?.trim()) {
    return c.json({ error: 'context is required' }, 400);
  }
  const { context, precedingContext, style } = body;

  const stream = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
    stream: true,
    messages: buildMessages(context, precedingContext, style),
  });

  const encoder = new TextEncoder();
  const sse = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream as AsyncIterable<{
          response: string;
        }>) {
          const event: SuggestStreamEvent = { delta: chunk.response };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          );
        }
        const done: SuggestStreamEvent = { delta: '', done: true };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(done)}\n\n`));
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
});
