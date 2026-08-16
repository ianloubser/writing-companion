import { WRITING_STYLES } from '@repo/types';
import type { WritingStyle } from '@repo/types';
import { useWritingStore } from '../store/writing';

export function SidebarRight() {
  const activeStyle = useWritingStore((s) => s.activeStyle);
  const setActiveStyle = useWritingStore((s) => s.setActiveStyle);
  const aiFeedback = useWritingStore((s) => s.aiFeedback);
  const isThinking = useWritingStore((s) => s.isThinking);

  return (
    <aside className="sidebar sidebar-right">
      <header className="sidebar-header">
        <h2>AI Feedback</h2>
      </header>

      <section className="style-selector">
        <h3>Style</h3>
        <div className="style-options">
          {WRITING_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              className={style === activeStyle ? 'style-option active' : 'style-option'}
              onClick={() => setActiveStyle(style as WritingStyle)}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      <section className="feedback">
        {isThinking && <p className="feedback-thinking">Analyzing…</p>}
        {aiFeedback ? (
          <p className="feedback-text">{aiFeedback}</p>
        ) : (
          !isThinking && (
            <p className="feedback-empty">
              Pause typing in the editor and the companion will critique the
              paragraph under your cursor.
            </p>
          )
        )}
      </section>
    </aside>
  );
}
