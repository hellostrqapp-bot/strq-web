// ═══════════════════════════════════════════════════════════
// strQ — Allowed Testers
// Whitelist for MVP beta access. Only these emails can log in.
// Add testers here as needed during Fase 1 (5-10 users).
// Remove this gate entirely when moving to open beta.
// ═══════════════════════════════════════════════════════════

export const ALLOWED_TESTERS: string[] = [
  'arnoud.kok@gmail.com',
  'sharondrenth@hotmail.com',
];

export function isAllowedTester(email: string): boolean {
  return ALLOWED_TESTERS.includes(email.toLowerCase().trim());
}
