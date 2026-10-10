import { locales, defaultLocale, type Locale } from './config';

const localePattern = new RegExp(`^/(${locales.join('|')})(?=/|$)`);

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// localePrefix is 'as-needed': de standaardtaal heeft geen prefix
export function localePath(locale: string, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale || !isLocale(locale)) {
    return clean;
  }
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

// Taal uit het begin van een pad, of null als er geen prefix is
export function localeFromPath(pathname: string): Locale | null {
  const match = pathname.match(localePattern);
  return match ? (match[1] as Locale) : null;
}

export function stripLocale(pathname: string): string {
  return pathname.replace(localePattern, '') || '/';
}
