import type React from 'react';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard, FlaskConical, Table2, FormInput,
  ChartBarBig, LayoutGrid, Users, PackageOpen,
  ListTodo, ScrollText, Activity, Bell, Settings,
  UserCircle,
} from 'lucide-react';

export type MainMenuItem = {
  key: string;
  name: string;
  nameKey?: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MainMenuItem[];
};

/** Menu configuration — 3 categories, 11 leaf pages. */
export const menuData: MainMenuItem[] = [
  // ── Overview ──
  {
    key: 'overview',
    name: 'Overview',
    nameKey: 'nav.overview',
    children: [
      {
        key: '/overview/dashboard',
        path: '/overview/dashboard',
        name: 'Dashboard',
        nameKey: 'nav.dashboard',
        icon: <LayoutDashboard size={18} />,
      },
      {
        key: '/overview/mock-dashboard',
        path: '/overview/mock-dashboard',
        name: 'Mock Dashboard',
        nameKey: 'nav.mockDashboard',
        icon: <Activity size={18} />,
      },
      {
        key: '/overview/design-tokens',
        path: '/overview/design-tokens',
        name: 'Design Tokens',
        nameKey: 'nav.designTokens',
        icon: <FlaskConical size={18} />,
      },
    ],
  },
  // ── Components ──
  {
    key: 'components',
    name: 'Components',
    nameKey: 'nav.components',
    children: [
      {
        key: '/components/table-demo',
        path: '/components/table-demo',
        name: 'Table Demo',
        nameKey: 'nav.tableDemo',
        icon: <Table2 size={18} />,
      },
      {
        key: '/components/form-demo',
        path: '/components/form-demo',
        name: 'Form Demo',
        nameKey: 'nav.formDemo',
        icon: <FormInput size={18} />,
      },
      {
        key: '/components/charts-demo',
        path: '/components/charts-demo',
        name: 'Charts Demo',
        nameKey: 'nav.chartsDemo',
        icon: <ChartBarBig size={18} />,
      },
      {
        key: '/components/data-display',
        path: '/components/data-display',
        name: 'Data Display',
        nameKey: 'nav.dataDisplay',
        icon: <LayoutGrid size={18} />,
      },
    ],
  },
  // ── Examples ──
  {
    key: 'examples',
    name: 'Examples',
    nameKey: 'nav.examples',
    children: [
      {
        key: '/examples/users',
        path: '/examples/users',
        name: 'User Management',
        nameKey: 'nav.userManagement',
        icon: <Users size={18} />,
      },
      {
        key: '/examples/products',
        path: '/examples/products',
        name: 'Product Catalog',
        nameKey: 'nav.productCatalog',
        icon: <PackageOpen size={18} />,
      },
      {
        key: '/examples/tasks',
        path: '/examples/tasks',
        name: 'Task Board',
        nameKey: 'nav.taskBoard',
        icon: <ListTodo size={18} />,
      },
      {
        key: '/examples/activity-log',
        path: '/examples/activity-log',
        name: 'Activity Log',
        nameKey: 'nav.activityLog',
        icon: <ScrollText size={18} />,
      },
    ],
  },
  // ── System ──
  {
    key: 'system',
    name: 'System',
    nameKey: 'nav.system',
    children: [
      {
        key: '/system/notifications',
        path: '/system/notifications',
        name: 'Notifications',
        nameKey: 'nav.notifications',
        icon: <Bell size={18} />,
      },
      {
        key: '/system/profile',
        path: '/system/profile',
        name: 'Profile',
        nameKey: 'nav.profile',
        icon: <UserCircle size={18} />,
      },
    ],
  },
];

export type TranslateMenuLabel = (key: string) => string;

export function getMenuLabel(item: MainMenuItem, t?: TranslateMenuLabel): string {
  return item.nameKey && t ? t(item.nameKey) : item.name;
}

export function toMenuItems(items: MainMenuItem[], t?: TranslateMenuLabel): MenuProps['items'] {
  return items.map((item) => {
    if (item.children?.length) {
      return { key: item.key, label: getMenuLabel(item, t), children: toMenuItems(item.children, t) };
    }
    return { key: item.path ?? item.key, icon: item.icon, label: getMenuLabel(item, t) };
  });
}

export const sideMenuItems: MenuProps['items'] = toMenuItems(menuData);

/** Collect all leaf pages (for collapsed icon rail) */
export function collectLeafItems(items: MainMenuItem[]): MainMenuItem[] {
  const result: MainMenuItem[] = [];
  for (const item of items) {
    if (item.children?.length) result.push(...collectLeafItems(item.children));
    else result.push(item);
  }
  return result;
}

export const allLeafItems = collectLeafItems(menuData);
