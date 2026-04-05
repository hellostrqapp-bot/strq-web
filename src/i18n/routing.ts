import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // strq.app = NL, strq.app/en = English, etc.
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
