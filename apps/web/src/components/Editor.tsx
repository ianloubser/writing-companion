import { useMemo, useRef, useState } from 'react';
import { createPlateEditor, Plate, PlateContent } from '@udecode/plate/react';
import type { PlateEditor } from '@udecode/plate/react';
import { BasicElementsPlugin } from '@udecode/plate-basic-elements/react';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { NodeApi } from '@udecode/slate';
import type { Value } from '@udecode/slate';
import { useDebouncedCallback } from 'use-debounce';
import { useWritingStore } from '../store/writing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

interface FloatingToolbarPosition {
  top: number;
  left: number;
}

export function Editor() {
  const triggerAnalysis = useWritingStore((s) => s.triggerAnalysis);
  const isThinking = useWritingStore((s) => s.isThinking);

  const containerRef = useRef<HTMLDivElement>(null);
  const [toolbarPos, setToolbarPos] = useState<FloatingToolbarPosition | null>(
    null,
  );

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

  /** Show the floating toolbar above the selected text, or hide it. */
  function updateFloatingToolbar() {
    const container = containerRef.current;
    const selection = window.getSelection();
    if (
      !container ||
      !selection ||
      selection.isCollapsed ||
      selection.rangeCount === 0
    ) {
      setToolbarPos(null);
      return;
    }
    if (
      !container.contains(selection.anchorNode) ||
      !container.contains(selection.focusNode)
    ) {
      setToolbarPos(null);
      return;
    }
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setToolbarPos({
      top: Math.max(rect.top - containerRect.top - 8, 4),
      left: rect.left - containerRect.left + rect.width / 2,
    });
  }

  return (
    <div ref={containerRef} className="relative flex h-full flex-col">
      {toolbarPos && (
        <Card
          className="absolute z-10 flex -translate-x-1/2 items-center gap-0.5 p-1"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.tf.toggleBlock('h1')}
          >
            H1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.tf.toggleBlock('h2')}
          >
            H2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.tf.toggleMark('bold')}
          >
            B
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.tf.toggleMark('italic')}
          >
            I
          </Button>
        </Card>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto" onScroll={updateFloatingToolbar}>
        <Plate
          editor={editor}
          onChange={({ editor: e }: { editor: PlateEditor }) => {
            analyze(focusedBlockContext(e));
          }}
          onSelectionChange={updateFloatingToolbar}
        >
          <PlateContent
            className="prose prose-neutral mx-auto w-full max-w-2xl px-10 py-12 outline-none prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-foreground"
            placeholder="Start writing… the AI sidebar will critique the paragraph you're typing after a short pause."
          />
        </Plate>
      </div>

      {isThinking && (
        <div className="border-t-2 border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
          Analyzing…
        </div>
      )}
    </div>
  );
}
