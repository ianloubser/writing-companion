import type { DocumentMeta } from '@repo/types';
import { Button } from '@/components/ui/button';

// Placeholder data — wired to Better Auth + D1 once the API is deployed.
const MOCK_DOCUMENTS: DocumentMeta[] = [
  { id: '1', title: 'Untitled draft', updatedAt: Date.now() },
];

export function SidebarLeft() {
  return (
    <aside className="flex h-full flex-col overflow-y-auto border-r-2 border-border bg-muted p-4">
      <header className="mb-4">
        <h1 className="text-base font-semibold text-foreground">
          Writing Companion
        </h1>
      </header>

      <Button className="mb-4">+ New Draft</Button>

      <nav>
        <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          My Documents
        </h2>
        <ul className="flex flex-col gap-1">
          {MOCK_DOCUMENTS.map((doc) => (
            <li key={doc.id}>
              <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
                {doc.title}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-auto border-t-2 border-border pt-4 text-sm text-muted-foreground">
        {/* Better Auth user profile goes here once mounted. */}
        <span>Signed out</span>
      </footer>
    </aside>
  );
}
