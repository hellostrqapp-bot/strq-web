// ═══════════════════════════════════════════════════════════
// strQ — Service Worker Registration
// Client component that registers sw.js on mount.
// ═══════════════════════════════════════════════════════════

'use client';

import { useEffect } from 'react';

export default function SWRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Auto-update: when a new SW is found, activate it
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'activated' &&
                  navigator.serviceWorker.controller
                ) {
                  // New version available — reload silently on next nav
                  console.log('[strQ] New version available');
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[strQ] SW registration failed:', err);
        });
    }
  }, []);

  return null;
}
