import type React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// ── Types ──

export type Locale = 'en' | 'zh' | 'de';

export type LocaleMeta = {
  label: string;
  nativeLabel: string;
};

export const SUPPORTED_LOCALES: ReadonlyArray<Locale> = ['en', 'zh', 'de'] as const;

export const LOCALE_LABELS: Record<Locale, LocaleMeta> = {
  en: { label: 'English', nativeLabel: 'English' },
  zh: { label: 'Chinese', nativeLabel: '中文' },
  de: { label: 'German', nativeLabel: 'Deutsch' },
};

export type MessageValue = string | Messages;

export interface Messages {
  [key: string]: MessageValue;
}

export type TParams = Record<string, string | number>;

export type TFunction = (key: string, params?: TParams) => string;

// ── Utilities ──

export function getByPath(obj: Messages, key: string): unknown {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function interpolate(tmpl: string, params?: TParams): string {
  if (!params) return tmpl;
  return tmpl.replace(/\{(\w+)\}/g, (_match, key: string) => {
    return key in params ? String(params[key]) : `{${key}}`;
  });
}

// ── Store ──

const DEFAULT_LOCALE: Locale = 'en';
const STORAGE_KEY = 'console_frame.locale';
const COOKIE_KEY = 'locale';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function normalizeLocale(v?: string): Locale | undefined {
  if (v === 'en' || v === 'zh' || v === 'de') return v;
  return undefined;
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const normalized = normalizeLocale(stored);
      if (normalized) return normalized;
    }
  } catch { /* ignore */ }
  const cookieVal = getCookie(COOKIE_KEY);
  if (cookieVal) {
    const normalized = normalizeLocale(cookieVal);
    if (normalized) return normalized;
  }
  return DEFAULT_LOCALE;
}

function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch { /* ignore */ }
  setCookie(COOKIE_KEY, locale);
  document.documentElement.lang = locale;
}

function subscribeLocaleChanges(onChange: (locale: Locale) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      const normalized = normalizeLocale(e.newValue);
      if (normalized) onChange(normalized);
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

// ── I18n Context ──

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TFunction;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  messagesByLocale,
  defaultLocale,
  fallbackLocale,
}: {
  children: React.ReactNode;
  messagesByLocale: Record<Locale, Messages>;
  defaultLocale?: Locale;
  fallbackLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => defaultLocale ?? getStoredLocale());
  const fallback = fallbackLocale ?? 'en';

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    setStoredLocale(next);
  };

  useEffect(() => {
    return subscribeLocaleChanges((newLocale) => {
      setLocaleState(newLocale);
    });
  }, []);

  const t: TFunction = useMemo(
    () => (key: string, params?: TParams) => {
      const messages = messagesByLocale[locale];
      let value = getByPath(messages, key);
      if (value === undefined && locale !== fallback) {
        value = getByPath(messagesByLocale[fallback], key);
      }
      if (typeof value !== 'string') return key;
      return interpolate(value, params);
    },
    [locale, messagesByLocale, fallback],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
