/**
 * Shared TypeScript interfaces for the AI request/response payloads.
 * Used by both the Vite frontend (apps/web) and the Worker API (apps/api)
 * so the two stay in sync across the workspace boundary.
 */

/** Writing styles selectable in the AI sidebar. */
export type WritingStyle = 'punchy' | 'professional' | 'conversational';

/** Metadata for a document in the "My Documents" list. */
export interface DocumentMeta {
  id: string;
  title: string;
  updatedAt: number;
}

/** Payload sent from the editor to `/api/ai/suggest`. */
export interface SuggestRequest {
  /** Text of the currently focused block (paragraph/heading). */
  context: string;
  /** Optional preceding block, sent for extra context. */
  precedingContext?: string;
  style: WritingStyle;
}

/** One SSE frame emitted by `/api/ai/suggest`. */
export interface SuggestStreamEvent {
  /** Incremental text delta; empty on the final frame. */
  delta: string;
  /** True on the final frame. */
  done?: boolean;
}

/** Full (non-streaming) suggestion result. */
export interface AISuggestion {
  feedback: string;
  style: WritingStyle;
  generatedAt: string;
}

/** All writing styles, for rendering selectors. */
export const WRITING_STYLES: WritingStyle[] = [
  'punchy',
  'professional',
  'conversational',
];
