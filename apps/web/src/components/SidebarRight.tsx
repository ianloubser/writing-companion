import { WRITING_STYLES } from '@repo/types';
import type { WritingStyle } from '@repo/types';
import { useWritingStore } from '../store/writing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function SidebarRight() {
  const activeStyle = useWritingStore((s) => s.activeStyle);
  const setActiveStyle = useWritingStore((s) => s.setActiveStyle);
  const aiFeedback = useWritingStore((s) => s.aiFeedback);
  const isThinking = useWritingStore((s) => s.isThinking);

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-l-2 border-border bg-muted p-4">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-foreground">AI Feedback</h2>
      </header>

      <section>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Style
        </h3>
        <div className="flex flex-col gap-1 rounded-md border-2 border-border p-1">
          {WRITING_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              className={cn(
                'rounded-sm px-3 py-1.5 text-left text-sm transition-colors active:translate-y-[1px]',
                style === activeStyle
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent',
              )}
              onClick={() => setActiveStyle(style as WritingStyle)}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 flex flex-col gap-3">
        {isThinking && (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Analyzing…
            </CardContent>
          </Card>
        )}
        {aiFeedback ? (
          <Card>
            <CardContent className="p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {aiFeedback}
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm">
                  Apply Edit
                </Button>
                <Button variant="outline" size="sm">
                  Discard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          !isThinking && (
            <Card>
              <CardContent className="p-4 text-sm text-muted-foreground">
                Pause typing in the editor and the companion will critique the
                paragraph under your cursor.
              </CardContent>
            </Card>
          )
        )}
      </section>
    </aside>
  );
}
