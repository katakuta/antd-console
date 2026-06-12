import type { MainMenuItem } from './routes';
import { menuData } from './routes';

const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MENU === 'true';

let cachedFiltered: MainMenuItem[] | null = null;

/**
 * Return the full menu data.
 * In a real app, you could filter menus based on user permissions here.
 * For the framework demo, we show all menus.
 */
export function getFilteredMenuData(): MainMenuItem[] {
  if (cachedFiltered) return cachedFiltered;

  let result = menuData;

  // In production, you might filter based on user roles/permissions
  // For demo: show everything
  if (!isDev) {
    // Example: hide Overview category in production
    // result = result.filter((g) => g.key !== 'overview');
  }

  cachedFiltered = result;
  return cachedFiltered;
}

/** Clear cache — call after logout or login */
export function clearMenuFilterCache(): void {
  cachedFiltered = null;
}
