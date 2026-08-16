import { describe, expect, it } from 'vitest';
import { listDocuments } from '../src/index';

/** Minimal D1 mock that records the SQL it was given. */
function mockDb() {
  const calls: string[] = [];
  const stmt = {
    bind() {
      return stmt;
    },
    async all<T = unknown>() {
      return { results: [] as T[], success: true };
    },
  };
  const db = {
    prepare(sql: string) {
      calls.push(sql);
      return stmt;
    },
  };
  return { db: db as unknown as D1Database, calls };
}

describe('listDocuments', () => {
  it('orders by userId then updatedAt DESC', async () => {
    const { db, calls } = mockDb();
    await listDocuments(db, 'user-123');

    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('WHERE userId = ?');
    expect(calls[0]).toContain('ORDER BY updatedAt DESC');
  });

  it('returns a successful result set', async () => {
    const { db } = mockDb();
    const res = await listDocuments(db, 'user-123');
    expect(res.success).toBe(true);
    expect(res.results).toEqual([]);
  });
});
