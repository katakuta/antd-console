import React from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import deDE from 'antd/locale/de_DE';
import { useI18n } from '@/i18n';
import type { Locale } from '@/i18n';
import { buildAntdTheme, DEFAULT_CONSOLE_FRAME_SETTINGS, resolveThemeMode } from './themeConfig';
import { loadConsoleFrameSettings, saveConsoleFrameSettings } from './themeStorage';
import type { ConsoleFrameSettings } from './types';

const antdLocaleMap: Record<Locale, typeof enUS> = {
  en: enUS,
  zh: zhCN,
  de: deDE,
};

type ThemeSettingsContextValue = {
  settings: ConsoleFrameSettings;
  setSettings: React.Dispatch<React.SetStateAction<ConsoleFrameSettings>>;
  resetSettings: () => void;
  resolvedMode: 'light' | 'dark';
};

const ThemeSettingsContext = React.createContext<ThemeSettingsContextValue | null>(null);

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<ConsoleFrameSettings>(() =>
    loadConsoleFrameSettings(),
  );

  const { locale } = useI18n();

  const [systemPrefersDark, setSystemPrefersDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  React.useEffect(() => {
    saveConsoleFrameSettings(settings);
  }, [settings]);

  const resolvedMode = resolveThemeMode(settings.mode, systemPrefersDark);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme-mode', resolvedMode);
  }, [resolvedMode]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-container', settings.container);
  }, [settings.container]);

  const value = React.useMemo<ThemeSettingsContextValue>(
    () => ({
      settings,
      setSettings,
      resetSettings: () => setSettings(DEFAULT_CONSOLE_FRAME_SETTINGS),
      resolvedMode,
    }),
    [settings, resolvedMode],
  );

  return (
    <ThemeSettingsContext.Provider value={value}>
      <ConfigProvider theme={buildAntdTheme(settings, systemPrefersDark)} locale={antdLocaleMap[locale]}>
        {children}
      </ConfigProvider>
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings(): ThemeSettingsContextValue {
  const value = React.useContext(ThemeSettingsContext);
  if (!value) throw new Error('useThemeSettings must be used within ThemeSettingsProvider');
  return value;
}
