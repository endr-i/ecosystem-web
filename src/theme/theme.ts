import type { ThemeConfig } from 'antd';

/** Single place for application-level design tokens. */
export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2f54eb',
    colorBgLayout: '#f5f6f8',
    borderRadius: 8,
    borderRadiusLG: 10,
    fontSize: 14,
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 60,
      bodyBg: '#f5f6f8',
      siderBg: '#ffffff',
    },
    Menu: {
      itemBorderRadius: 8,
    },
    Card: {
      paddingLG: 24,
    },
  },
};

/** Spacing scale used by layouts and pages instead of ad-hoc numbers. */
export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
