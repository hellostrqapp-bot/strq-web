// ═══════════════════════════════════════════════════════════
// strQ — Dashboard helper utilities
// ═══════════════════════════════════════════════════════════

/** Today as YYYY-MM-DD string */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/** Days remaining until a date string */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Format a date string for display (e.g. "23 april") */
export function formatEventDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale === 'nl' ? 'nl-NL' : locale, {
    day: 'numeric',
    month: 'long',
  });
}
