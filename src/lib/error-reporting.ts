// ═══════════════════════════════════════════════════════════
// strQ — Lightweight Error Reporting
// Sends errors to Sentry via their HTTP API (no SDK needed).
// Zero dependencies, ~1KB, privacy-first.
//
// Setup: set NEXT_PUBLIC_SENTRY_DSN in .env.local + Vercel
// Free tier: 5K errors/month — more than enough for beta.
// ═══════════════════════════════════════════════════════════

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? '';

// Parse DSN: https://{key}@{host}/{project_id}
function parseDSN(dsn: string) {
  try {
    const url = new URL(dsn);
    const key = url.username;
    const projectId = url.pathname.replace('/', '');
    const host = url.hostname;
    return { key, projectId, host };
  } catch {
    return null;
  }
}

const parsed = parseDSN(SENTRY_DSN);

/**
 * Report an error to Sentry.
 * Safe to call anywhere — silently no-ops if DSN not configured.
 *
 * @param error - Error object or string
 * @param context - Optional metadata (component, action, userId)
 */
export function reportError(
  error: Error | string,
  context?: Record<string, string>
): void {
  // No-op if Sentry not configured
  if (!parsed) return;

  const err = typeof error === 'string' ? new Error(error) : error;

  const payload = {
    event_id: crypto.randomUUID().replace(/-/g, ''),
    timestamp: new Date().toISOString(),
    platform: 'javascript',
    level: 'error',
    logger: 'strq',
    environment: process.env.NODE_ENV ?? 'production',
    exception: {
      values: [
        {
          type: err.name,
          value: err.message,
          stacktrace: err.stack
            ? {
                frames: err.stack
                  .split('\n')
                  .slice(1, 10)
                  .map((line) => ({ filename: line.trim() })),
              }
            : undefined,
        },
      ],
    },
    tags: {
      app: 'strq-web',
      ...context,
    },
  };

  const url = `https://${parsed.host}/api/${parsed.projectId}/store/`;

  // Fire and forget — never block the UI
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=strq/1.0, sentry_key=${parsed.key}`,
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Silently ignore — error reporting should never cause errors
  });
}

/**
 * Wrap an async function with automatic error reporting.
 * Returns the result or re-throws after reporting.
 */
export async function withErrorReporting<T>(
  fn: () => Promise<T>,
  context?: Record<string, string>
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    reportError(err instanceof Error ? err : new Error(String(err)), context);
    throw err;
  }
}
