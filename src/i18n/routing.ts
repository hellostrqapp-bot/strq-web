import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // strq.app = English, strq.app/nl = Nederlands, etc.
  localeDetection: true, // browsertaal of gekozen taal (cookie) op paden zonder prefix
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
