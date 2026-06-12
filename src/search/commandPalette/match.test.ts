import { describe, expect, it } from 'vitest';
import { matchItems } from './match';

describe('command palette match', () => {
  it('matches by includes and tokenized words', () => {
    const items = [
      { label: 'User Management', keywords: ['user management'] },
      { label: 'Dashboard', keywords: ['dashboard'] },
    ];
    const res = matchItems(items, 'user manage');
    expect(res[0]?.label).toBe('User Management');
  });
});

