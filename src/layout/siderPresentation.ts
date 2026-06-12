export const DESKTOP_SIDER_CONTENT_SWAP_DELAY_MS = 160;

type ResolveDesktopSiderContentModeInput = {
  collapsed: boolean;
  expandTransitionPending: boolean;
};

export function resolveDesktopSiderContentMode({
  collapsed,
  expandTransitionPending,
}: ResolveDesktopSiderContentModeInput): 'collapsed' | 'expanded' {
  if (collapsed || expandTransitionPending) return 'collapsed';
  return 'expanded';
}
