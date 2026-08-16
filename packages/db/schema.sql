-- D1 schema for the writing-companion Worker.
--
-- Users & sessions are managed entirely by Better Auth
-- (auth_user, auth_session, auth_account, auth_verification are created
-- by `wrangler d1 migrations apply` via better-auth's migrate tooling).
--
-- Documents store the JSON state of the Plate.js editor (NOT raw markdown)
-- so formatting is preserved across reloads.

CREATE TABLE IF NOT EXISTS documents (
  id         TEXT PRIMARY KEY,
  userId     TEXT NOT NULL,
  title      TEXT NOT NULL DEFAULT 'Untitled',
  content    TEXT NOT NULL DEFAULT '{}', -- serialized Plate.js value
  createdAt  INTEGER NOT NULL,
  updatedAt  INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES auth_user (id) ON DELETE CASCADE
);

-- Fast reads for the "My Documents" dashboard list.
CREATE INDEX IF NOT EXISTS idx_documents_user_updated
  ON documents (userId, updatedAt DESC);
