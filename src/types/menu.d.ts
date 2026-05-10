import type { MenuItem } from './api';

export type MenuMode = 'vertical' | 'horizontal' | 'inline';

export interface RouteConfig {
  path: string;
  name: string;
  component?: React.ComponentType;
  children?: RouteConfig[];
  meta?: {
    title?: string;
    icon?: React.ReactNode;
    permission?: string[];
    hideInMenu?: boolean;
    hideInBreadcrumb?: boolean;
  };
}

export interface BreadcrumbItem {
  path: string;
  breadcrumbName: string;
}

export interface HeaderConfig {
  logo?: string;
  title?: string;
  defaultMenus?: MenuItem[];
}

export interface LayoutConfig {
  siderWidth?: number;
  fixedHeader?: boolean;
  fixedSider?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}
