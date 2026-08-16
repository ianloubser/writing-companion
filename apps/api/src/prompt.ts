import type { WritingStyle } from '@repo/types';

const STYLE_GUIDES: Record<WritingStyle, string> = {
  punchy: 'Punchy and direct: short sentences, strong verbs, no fluff.',
  professional:
    'Professional and polished: precise, well-structured, confident prose.',
  conversational:
    'Conversational and friendly: natural, warm, easy to read aloud.',
};

const SYSTEM_PROMPT = `You are an AI writing companion embedded in a text editor.
Your job is to critique and guide the user's writing — never to write it for them.
Given a passage and a target style, respond with focused, actionable feedback:
what works, what doesn't, and one concrete suggested rewrite. Keep it under 150 words.`;

/** Builds the Llama-3 chat messages for a suggest request. */
export function buildMessages(
  context: string,
  precedingContext: string | undefined,
  style: WritingStyle,
): Array<{ role: 'system' | 'user'; content: string }> {
  const messages: Array<{ role: 'system' | 'user'; content: string }> = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  if (precedingContext?.trim()) {
    messages.push({
      role: 'user',
      content: `For context, this is the block directly above the passage under review:\n"""\n${precedingContext}\n"""`,
    });
  }

  messages.push({
    role: 'user',
    content: `Critique this passage in a ${style} style (${STYLE_GUIDES[style]}):\n"""\n${context}\n"""`,
  });

  return messages;
}
