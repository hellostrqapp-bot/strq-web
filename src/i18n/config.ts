// Voeg hier talen toe — dat is alles wat nodig is voor een nieuwe taal
// (plus een JSON bestand in /messages/)
export const locales = ['nl', 'en', 'fr', 'de', 'es', 'pt', 'qu'] as const;
export const defaultLocale = 'nl' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  qu: 'Runasimi',
};

// Taal toevoegen? 3 stappen:
// 1. Voeg de code toe aan 'locales' hierboven
// 2. Voeg de naam toe aan 'localeNames'
// 3. Maak messages/{code}.json aan (kopieer en vertaal nl.json)
