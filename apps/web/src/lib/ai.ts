import type { SuggestRequest, SuggestStreamEvent } from '@repo/types';

/**
 * POST /api/ai/suggest and read the SSE stream, invoking `onDelta` for each
 * text chunk as it arrives.
 */
export async function streamSuggestions(
  request: SuggestRequest,
  onDelta: (delta: string) => void,
): Promise<void> {
  const res = await fetch('/api/ai/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`suggest failed: ${res.status} ${await res.text()}`);
  }
  if (!res.body) {
    throw new Error('suggest returned no body');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line.
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      const dataLine = frame
        .split('\n')
        .find((line) => line.startsWith('data: '));
      if (!dataLine) continue;

      const event = JSON.parse(dataLine.slice(6)) as SuggestStreamEvent;
      if (event.done) return;
      if (event.delta) onDelta(event.delta);
    }
  }
}
