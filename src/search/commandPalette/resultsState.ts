export function shouldShowCommandPaletteEmptyState({
  pageCount,
  actionCount,
  helpCount,
}: {
  pageCount: number;
  actionCount: number;
  helpCount: number;
}) {
  return pageCount === 0 && actionCount === 0 && helpCount === 0;
}

export function getCommandPaletteSectionVisibility({
  pageCount,
  actionCount,
  helpCount,
  hasHelpItems,
}: {
  pageCount: number;
  actionCount: number;
  helpCount: number;
  hasHelpItems: boolean;
}) {
  const showEmptyState = shouldShowCommandPaletteEmptyState({
    pageCount,
    actionCount,
    helpCount,
  });

  return {
    showPages: pageCount > 0,
    showActions: actionCount > 0,
    showHelp: hasHelpItems && helpCount > 0,
    showEmptyState,
  };
}
