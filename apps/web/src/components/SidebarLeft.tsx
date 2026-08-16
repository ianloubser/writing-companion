import type { DocumentMeta } from '@repo/types';

// Placeholder data — wired to Better Auth + D1 once the API is deployed.
const MOCK_DOCUMENTS: DocumentMeta[] = [
  { id: '1', title: 'Untitled draft', updatedAt: Date.now() },
];

export function SidebarLeft() {
  return (
    <aside className="sidebar sidebar-left">
      <header className="sidebar-header">
        <h1>Writing Companion</h1>
      </header>

      <button type="button" className="new-draft">
        + New Draft
      </button>

      <nav className="document-list">
        <h2>My Documents</h2>
        <ul>
          {MOCK_DOCUMENTS.map((doc) => (
            <li key={doc.id}>
              <button type="button" className="document-item">
                {doc.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="user-profile">
        {/* Better Auth user profile goes here once mounted. */}
        <span className="user-profile-label">Signed out</span>
      </footer>
    </aside>
  );
}
