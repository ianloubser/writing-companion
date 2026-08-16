import { createPlateEditor, Plate, PlateContent } from '@udecode/plate/react';
import type { PlateEditor } from '@udecode/plate/react';
import { BasicElementsPlugin } from '@udecode/plate-basic-elements/react';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { NodeApi } from '@udecode/slate';
import type { Value } from '@udecode/slate';
import { useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useWritingStore } from '../store/writing';

const initialValue: Value = [{ type: 'p', children: [{ text: '' }] }];

interface BlockContext {
  context: string;
  precedingContext?: string;
}

/**
 * Text of the top-level block containing the cursor, plus the block above it.
 * We only send the focused block (not the whole document) per the spec.
 */
function focusedBlockContext(editor: PlateEditor): BlockContext | undefined {
  const selection = editor.selection;
  if (!selection) return undefined;

  const blockIndex = selection.anchor.path[0];
  if (blockIndex === undefined) return undefined;

  const block = NodeApi.get(editor, [blockIndex]);
  if (!block) return undefined;

  const context = NodeApi.string(block).trim();
  const prev =
    blockIndex > 0 ? NodeApi.get(editor, [blockIndex - 1]) : undefined;
  const precedingContext = prev ? NodeApi.string(prev).trim() : undefined;

  return { context, precedingContext };
}

export function Editor() {
  const triggerAnalysis = useWritingStore((s) => s.triggerAnalysis);
  const isThinking = useWritingStore((s) => s.isThinking);

  const editor = useMemo(
    () =>
      createPlateEditor({
        plugins: [BasicElementsPlugin, BasicMarksPlugin],
        value: initialValue,
      }),
    [],
  );

  // Debounce the analysis trigger so we only fire after the user pauses.
  const analyze = useDebouncedCallback((ctx: BlockContext | undefined) => {
    if (ctx?.context) void triggerAnalysis(ctx.context, ctx.precedingContext);
  }, 1500);

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => editor.tf.toggleBlock('h1')}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.tf.toggleBlock('h2')}
        >
          H2
        </button>
        <button type="button" onClick={() => editor.tf.toggleMark('bold')}>
          B
        </button>
        <button type="button" onClick={() => editor.tf.toggleMark('italic')}>
          I
        </button>
      </div>
      <Plate
        editor={editor}
        onChange={({ editor: e }: { editor: PlateEditor }) => {
          analyze(focusedBlockContext(e));
        }}
      >
        <PlateContent
          className="editor-content"
          placeholder="Start writing… the AI sidebar will critique the paragraph you're typing after a short pause."
        />
      </Plate>
      {isThinking && <div className="editor-status">Analyzing…</div>}
    </div>
  );
}
