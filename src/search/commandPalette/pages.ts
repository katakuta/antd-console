import { getMenuLabel, menuData, type MainMenuItem, type TranslateMenuLabel } from '@/config/routes';
import type { SearchPage } from './types';

function walk(items: MainMenuItem[], out: SearchPage[], t?: TranslateMenuLabel) {
  for (const item of items) {
    if (item.children?.length) {
      walk(item.children, out, t);
    } else if (item.path) {
      const label = getMenuLabel(item, t);
      out.push({
        type: 'page',
        label,
        path: item.path,
        icon: item.icon,
        keywords: [item.name, label, item.path],
      });
    }
  }
}

export function getSearchPages(t?: TranslateMenuLabel): SearchPage[] {
  const pages: SearchPage[] = [];
  walk(menuData, pages, t);
  return pages;
}
