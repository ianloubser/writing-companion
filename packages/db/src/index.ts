export { createAuth } from './auth';
export type { AuthEnv } from './auth';

/** Raw query helper for documents, kept in the db package so queries stay
 *  co-located with the schema. */
export async function listDocuments(db: D1Database, userId: string) {
  return db
    .prepare(
      `SELECT id, title, updatedAt
         FROM documents
        WHERE userId = ?
        ORDER BY updatedAt DESC`,
    )
    .bind(userId)
    .all<{ id: string; title: string; updatedAt: number }>();
}
