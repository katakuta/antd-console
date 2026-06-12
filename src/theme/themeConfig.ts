import { theme, type ThemeConfig } from 'antd';
import type { ConsoleFrameSettings, ThemePresetId } from './types';

export const CONSOLE_FRAME_FONT_FAMILY =
  '"plusJakarta", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

export const CONSOLE_FRAME_FONT_FAMILY_CODE =
  '"geistMono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const DEFAULT_CONSOLE_FRAME_SETTINGS: ConsoleFrameSettings = {
  layout: 'side',
  container: 'fluid',
  navTheme: 'light',
  collapsed: false,
  mode: 'system',
  density: 'default',
  themePreset: 'graphite',
  colorPrimary: '#27364d',
  borderRadius: 8,
  fontSize: 14,
  wireframe: false,
};

const lightThemeBaseToken = {
  sizeStep: 6,
  borderRadius: 8,
  wireframe: false,
  sizeUnit: 2,
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  boxShadowSecondary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
};

const darkThemeBaseToken = {
  sizeStep: 4,
  sizeUnit: 2,
  borderRadius: 8,
  wireframe: true,
  boxShadow: '0 6px 16px 0 rgb(0 0 0 / 0.32), 0 3px 6px -4px rgb(0 0 0 / 0.32)',
  boxShadowSecondary: '0 6px 16px 0 rgb(0 0 0 / 0.28), 0 3px 6px -4px rgb(0 0 0 / 0.24)',
};

type PresetTokenSubset = Record<string, string | number | boolean>;

type ThemePresetDefinition = {
  id: ThemePresetId;
  label: string;
  swatch: string;
  light: PresetTokenSubset;
  dark: PresetTokenSubset;
};

export type NavigationThemeTarget = 'top' | 'side';
type NavigationCssSource = {
  colorBgContainer: string;
  colorBgElevated: string;
  colorBgTextHover: string;
  colorBorderSecondary: string;
  colorPrimary: string;
  colorPrimaryBg: string;
  colorText: string;
  colorTextSecondary: string;
};
export const NAVIGATION_CSS_VARS = {
  bgContainer: '--app-nav-bg-container',
  bgElevated: '--app-nav-bg-elevated',
  bgHover: '--app-nav-bg-hover',
  border: '--app-nav-border',
  primary: '--app-nav-primary',
  primaryBg: '--app-nav-primary-bg',
  text: '--app-nav-text',
  textSecondary: '--app-nav-text-secondary',
} as const;
export type NavigationCssVarName = (typeof NAVIGATION_CSS_VARS)[keyof typeof NAVIGATION_CSS_VARS];
export type NavigationCssVars = Record<NavigationCssVarName, string>;

export const THEME_PRESETS: readonly ThemePresetDefinition[] = [
  {
    id: 'robinhood',
    label: 'Robinhood',
    swatch: '#00a300',
    light: { colorPrimary: '#00a300', colorSuccess: '#5aa63f', colorError: '#ce5e60', colorTextBase: '#071106' },
    dark: { colorPrimary: '#49c24f', colorSuccess: '#67b24c', colorWarning: '#c89b5d', colorError: '#d97173', colorBgBase: '#09140d', colorBgContainer: '#101d15', colorBgElevated: '#15261c', colorBgLayout: '#0b1610', colorBorder: '#203527', colorBorderSecondary: '#18291d', colorText: '#e6f3e9', colorTextSecondary: '#acc7b1' },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    swatch: '#0085b9',
    light: { colorPrimary: '#0085b9', colorSuccess: '#73b751', colorError: '#ce5e60', colorTextBase: '#071018' },
    dark: { colorPrimary: '#5ab7df', colorSuccess: '#6faa4f', colorWarning: '#c89b5d', colorError: '#d97173', colorBgBase: '#08141b', colorBgContainer: '#10202a', colorBgElevated: '#152a36', colorBgLayout: '#0a1720', colorBorder: '#204051', colorBorderSecondary: '#173141', colorText: '#e6f2f8', colorTextSecondary: '#a8c1cf' },
  },
  {
    id: 'violet',
    label: 'Violet',
    swatch: '#615ed6',
    light: { colorPrimary: '#615ed6', colorSuccess: '#73b751', colorError: '#ce5e60', colorTextBase: '#0c0b17' },
    dark: { colorPrimary: '#9894f0', colorSuccess: '#6faa4f', colorWarning: '#c89b5d', colorError: '#d97173', colorBgBase: '#0f1020', colorBgContainer: '#171931', colorBgElevated: '#1d2140', colorBgLayout: '#121428', colorBorder: '#2a2f55', colorBorderSecondary: '#202546', colorText: '#eeedfb', colorTextSecondary: '#bbb8dd' },
  },
  {
    id: 'gold',
    label: 'Gold',
    swatch: '#ac5b00',
    light: { colorPrimary: '#ac5b00', colorSuccess: '#73b751', colorError: '#ce5e60', colorTextBase: '#140d06' },
    dark: { colorPrimary: '#d38b37', colorSuccess: '#6faa4f', colorWarning: '#d6a35a', colorError: '#d97173', colorBgBase: '#17110a', colorBgContainer: '#231a10', colorBgElevated: '#302115', colorBgLayout: '#1b140c', colorBorder: '#46301d', colorBorderSecondary: '#362515', colorText: '#f6efe7', colorTextSecondary: '#cfbfac' },
  },
  {
    id: 'rose',
    label: 'Rose',
    swatch: '#bc3181',
    light: { colorPrimary: '#bc3181', colorSuccess: '#73b751', colorError: '#ce5e60', colorTextBase: '#170911' },
    dark: { colorPrimary: '#de75b0', colorSuccess: '#6faa4f', colorWarning: '#c89b5d', colorError: '#de7d97', colorBgBase: '#180d16', colorBgContainer: '#24121f', colorBgElevated: '#31192a', colorBgLayout: '#1c0f19', colorBorder: '#46233b', colorBorderSecondary: '#361b2d', colorText: '#f8eaf1', colorTextSecondary: '#d4b1c3' },
  },
  {
    id: 'graphite',
    label: 'Graphite',
    swatch: '#27364d',
    light: { colorPrimary: '#27364d', colorPrimaryBg: '#cdd5df', colorSuccess: '#73b751', colorWarning: '#ed9a00', colorError: '#ce5e60', colorTextBase: '#050b0f' },
    dark: { colorPrimary: '#8ea3c0', colorSuccess: '#4d9c25', colorWarning: '#ed9a00', colorError: '#d97173', colorBgBase: '#0b1220', colorBgContainer: '#121a2a', colorBgElevated: '#182234', colorBgLayout: '#0f1726', colorBorder: '#2a364a', colorBorderSecondary: '#202b3d', colorText: '#e6edf7', colorTextSecondary: '#aab7ca' },
  },
] as const;

const THEME_PRESET_MAP: Record<ThemePresetId, ThemePresetDefinition> = Object.fromEntries(
  THEME_PRESETS.map((preset) => [preset.id, preset]),
) as Record<ThemePresetId, ThemePresetDefinition>;

function getModePresetTokens(
  settings: ConsoleFrameSettings,
  resolvedMode: 'light' | 'dark',
): PresetTokenSubset & { colorPrimary: string } {
  const preset = THEME_PRESET_MAP[settings.themePreset];
  const baseToken = resolvedMode === 'dark' ? darkThemeBaseToken : lightThemeBaseToken;
  const colorToken = (resolvedMode === 'dark' ? preset.dark : preset.light) as PresetTokenSubset & { colorPrimary: string };
  const mergedToken = { ...baseToken, ...colorToken };
  if (typeof colorToken.colorPrimary !== 'string') {
    throw new Error(`Theme preset "${settings.themePreset}" is missing colorPrimary for ${resolvedMode} mode`);
  }
  return mergedToken as unknown as PresetTokenSubset & { colorPrimary: string };
}

export function resolveThemeMode(
  mode: ConsoleFrameSettings['mode'],
  systemPrefersDark: boolean,
): 'light' | 'dark' {
  if (mode === 'system') return systemPrefersDark ? 'dark' : 'light';
  return mode;
}

export function buildAntdTheme(
  settings: ConsoleFrameSettings,
  systemPrefersDark = false,
): ThemeConfig {
  const resolvedMode = resolveThemeMode(settings.mode, systemPrefersDark);
  const algorithms = [];
  if (resolvedMode === 'dark') algorithms.push(theme.darkAlgorithm);
  if (settings.density === 'compact') algorithms.push(theme.compactAlgorithm);

  const modeToken = getModePresetTokens(settings, resolvedMode);
  const colorPrimary = modeToken.colorPrimary as string;

  const spaciousToken =
    settings.density === 'spacious'
      ? { sizeUnit: 3, sizeStep: 8, paddingContentHorizontal: 20, paddingContentVertical: 16 }
      : {};

  return {
    algorithm: algorithms.length > 0 ? algorithms : theme.defaultAlgorithm,
    token: {
      ...modeToken,
      ...spaciousToken,
      colorPrimary,
      colorInfo: colorPrimary,
      borderRadius: settings.borderRadius,
      fontSize: settings.fontSize,
      wireframe: resolvedMode === 'dark' ? Boolean(modeToken.wireframe) : settings.wireframe,
      fontFamily: CONSOLE_FRAME_FONT_FAMILY,
      fontFamilyCode: CONSOLE_FRAME_FONT_FAMILY_CODE,
    },
    components: {
      Button: { ...(resolvedMode === 'dark' ? { algorithm: true } : {}) },
      Layout: {
        headerBg: resolvedMode === 'dark' ? '#111827' : '#f6f7f9',
        siderBg: resolvedMode === 'dark' ? '#111827' : '#ffffff',
        bodyBg: resolvedMode === 'dark' ? '#0f172a' : '#f6f7f9',
      },
      Menu: {
        itemBorderRadius: 6,
        itemHeight: 32,
        itemMarginInline: 8,
        subMenuItemBg: 'transparent',
      },
      Card: { borderRadiusLG: settings.borderRadius },
      Modal: {
        borderRadiusLG: settings.borderRadius,
        titleFontSize: settings.fontSize + 1,
        titleLineHeight: 1.4,
        titleColor: (modeToken.colorText as string | undefined) ?? colorPrimary,
        contentBg: (modeToken.colorBgElevated as string | undefined) ?? (modeToken.colorBgContainer as string | undefined) ?? '#ffffff',
        headerBg: (modeToken.colorBgElevated as string | undefined) ?? (modeToken.colorBgContainer as string | undefined) ?? '#ffffff',
        footerBg: (modeToken.colorBgElevated as string | undefined) ?? (modeToken.colorBgContainer as string | undefined) ?? '#ffffff',
      },
      Table: { headerBg: resolvedMode === 'dark' ? '#111827' : '#f8fafc' },
    },
  };
}

export function resolveNavigationMode(
  settings: ConsoleFrameSettings,
  resolvedMode: 'light' | 'dark',
  target: NavigationThemeTarget,
): 'light' | 'dark' {
  if (target === 'top') return resolvedMode;
  return settings.navTheme === 'realDark' ? 'dark' : 'light';
}

export function buildNavigationTheme(
  settings: ConsoleFrameSettings,
  resolvedMode: 'light' | 'dark',
  target: NavigationThemeTarget = 'side',
): ThemeConfig {
  const navigationMode = resolveNavigationMode(settings, resolvedMode, target);
  return buildAntdTheme({ ...settings, mode: navigationMode }, false);
}

export function buildNavigationCssVars(tokens: NavigationCssSource): NavigationCssVars {
  return {
    [NAVIGATION_CSS_VARS.bgContainer]: tokens.colorBgContainer,
    [NAVIGATION_CSS_VARS.bgElevated]: tokens.colorBgElevated,
    [NAVIGATION_CSS_VARS.bgHover]: tokens.colorBgTextHover,
    [NAVIGATION_CSS_VARS.border]: tokens.colorBorderSecondary,
    [NAVIGATION_CSS_VARS.primary]: tokens.colorPrimary,
    [NAVIGATION_CSS_VARS.primaryBg]: tokens.colorPrimaryBg,
    [NAVIGATION_CSS_VARS.text]: tokens.colorText,
    [NAVIGATION_CSS_VARS.textSecondary]: tokens.colorTextSecondary,
  };
}

export function needsDarkSidebar(
  settings: ConsoleFrameSettings,
  resolvedMode: 'light' | 'dark' = 'light',
): boolean {
  return resolveNavigationMode(settings, resolvedMode, 'side') === 'dark' && resolvedMode === 'light';
}
