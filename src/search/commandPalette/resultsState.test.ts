import { describe, expect, it } from 'vitest';
import { getCommandPaletteSectionVisibility, shouldShowCommandPaletteEmptyState } from './resultsState';

describe('command palette empty state', () => {
  it('returns false when non-page groups still have results', () => {
    expect(
      shouldShowCommandPaletteEmptyState({
        pageCount: 0,
        actionCount: 1,
        helpCount: 0,
      }),
    ).toBe(false);
    expect(
      shouldShowCommandPaletteEmptyState({
        pageCount: 0,
        actionCount: 0,
        helpCount: 1,
      }),
    ).toBe(false);
  });

  it('returns true only when all groups are empty', () => {
    expect(
      shouldShowCommandPaletteEmptyState({
        pageCount: 0,
        actionCount: 0,
        helpCount: 0,
      }),
    ).toBe(true);
  });

  it('shows only groups that actually have results when any result exists', () => {
    expect(
      getCommandPaletteSectionVisibility({
        pageCount: 1,
        actionCount: 0,
        helpCount: 0,
        hasHelpItems: true,
      }),
    ).toEqual({
      showPages: true,
      showActions: false,
      showHelp: false,
      showEmptyState: false,
    });

    expect(
      getCommandPaletteSectionVisibility({
        pageCount: 0,
        actionCount: 1,
        helpCount: 0,
        hasHelpItems: true,
      }),
    ).toEqual({
      showPages: false,
      showActions: true,
      showHelp: false,
      showEmptyState: false,
    });
  });
});
