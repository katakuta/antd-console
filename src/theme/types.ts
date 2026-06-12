import type { ThemeConfig } from 'antd';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeDensity = 'default' | 'compact' | 'spacious';
export type ContainerMode = 'fluid' | 'boxed';
export type ThemePresetId = 'robinhood' | 'ocean' | 'violet' | 'gold' | 'rose' | 'graphite';

export type ConsoleFrameLayoutMode = 'side' | 'top';

export type ConsoleFrameSettings = {
  layout: ConsoleFrameLayoutMode;
  container: ContainerMode;
  navTheme: 'light' | 'realDark';
  collapsed: boolean;
  mode: ThemeMode;
  density: ThemeDensity;
  themePreset: ThemePresetId;
  colorPrimary: string;
  borderRadius: number;
  fontSize: number;
  wireframe: boolean;
};

export type ConsoleFrameThemeConfig = ThemeConfig;
