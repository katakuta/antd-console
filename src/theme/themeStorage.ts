import { DEFAULT_CONSOLE_FRAME_SETTINGS } from './themeConfig';
import type { ConsoleFrameSettings } from './types';

export const CONSOLE_FRAME_SETTINGS_KEY = 'console_frame.settings.v1';

function getStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function normalizeSettings(input: Partial<ConsoleFrameSettings>): ConsoleFrameSettings {
  return {
    ...DEFAULT_CONSOLE_FRAME_SETTINGS,
    ...input,
    colorPrimary: input.colorPrimary || DEFAULT_CONSOLE_FRAME_SETTINGS.colorPrimary,
    borderRadius:
      typeof input.borderRadius === 'number'
        ? input.borderRadius
        : DEFAULT_CONSOLE_FRAME_SETTINGS.borderRadius,
    fontSize:
      typeof input.fontSize === 'number' ? input.fontSize : DEFAULT_CONSOLE_FRAME_SETTINGS.fontSize,
  };
}

export function loadConsoleFrameSettings(): ConsoleFrameSettings {
  const storage = getStorage();
  if (!storage) return DEFAULT_CONSOLE_FRAME_SETTINGS;

  try {
    const raw = storage.getItem(CONSOLE_FRAME_SETTINGS_KEY);
    if (!raw) return DEFAULT_CONSOLE_FRAME_SETTINGS;
    return normalizeSettings(JSON.parse(raw) as Partial<ConsoleFrameSettings>);
  } catch {
    storage.removeItem(CONSOLE_FRAME_SETTINGS_KEY);
    return DEFAULT_CONSOLE_FRAME_SETTINGS;
  }
}

export function saveConsoleFrameSettings(settings: ConsoleFrameSettings): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(CONSOLE_FRAME_SETTINGS_KEY, JSON.stringify(settings));
}
