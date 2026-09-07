import type { ReactNode } from 'react';
import { TeamOutlined } from '@ant-design/icons';

export type NavigationItem = {
  key: string;
  label: string;
  icon: ReactNode;
  to: string;
};

export type NavigationSection = {
  key: string;
  label?: string;
  items: NavigationItem[];
};

/**
 * Sidebar navigation. New product areas are added as extra sections/items here
 * without touching the layout component.
 */
export const navigationSections: NavigationSection[] = [
  {
    key: 'workspace',
    items: [{ key: 'accounts', label: 'Accounts', icon: <TeamOutlined />, to: '/accounts' }],
  },
];

export function findActiveKey(pathname: string): string | undefined {
  const items = navigationSections.flatMap((section) => section.items);
  return items.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))?.key;
}
