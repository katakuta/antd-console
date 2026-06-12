import type { Locale, Messages } from './index';
import en from './en';
import zh from './zh';
import de from './de';

export const messagesByLocale: Record<Locale, Messages> = {
  en,
  zh,
  de,
};
