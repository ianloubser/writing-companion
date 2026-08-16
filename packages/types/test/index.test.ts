import { describe, expect, it } from 'vitest';
import { WRITING_STYLES } from '../src/index';

describe('WRITING_STYLES', () => {
  it('exposes the three styles from the spec', () => {
    expect(WRITING_STYLES).toEqual([
      'punchy',
      'professional',
      'conversational',
    ]);
  });
});
