import { describe, expect, it } from 'vitest';
import { buildMessages } from '../src/prompt';

describe('buildMessages', () => {
  it('includes the system prompt and the passage to critique', () => {
    const messages = buildMessages('Hello world', undefined, 'punchy');
    expect(messages).toHaveLength(2);
    expect(messages[0]?.role).toBe('system');
    expect(messages[1]?.content).toContain('Hello world');
    expect(messages[1]?.content).toContain('punchy');
  });

  it('adds the preceding block as extra context when provided', () => {
    const messages = buildMessages('Target', 'Context above', 'professional');
    expect(messages).toHaveLength(3);
    expect(messages[1]?.content).toContain('Context above');
  });

  it('skips blank preceding context', () => {
    const messages = buildMessages('Target', '   ', 'conversational');
    expect(messages).toHaveLength(2);
  });
});
