# strQ MVP Deploy Checklist — 5 april 2026

## Gedaan (door Claude via Cowork)

- [x] **Migratie 004** gedraaid in Supabase SQL Editor
  - profiles, activities, streak_state, xp_log, events, daily_reveals
  - RLS policies, triggers, indexes
- [x] **Supabase Auth** geconfigureerd
  - Site URL: `https://strq.app`
  - Redirect URLs: `https://strq.app/auth/callback` + `http://localhost:3000/auth/callback`
  - Email provider: enabled (magic link via `signInWithOtp`)
- [x] **Resend account** aangemaakt (hello.strqapp@gmail.com)
  - Domain `strq.app` toegevoegd (eu-west-1)
  - API key `strq-production` gegenereerd
- [x] **RESEND_API_KEY** opgeslagen in Supabase Edge Function Secrets
- [x] **PWA icons** gegenereerd (icon-192.png + icon-512.png)

## Nog te doen door Arnoud

### 1. DNS records bij TransIP (zie DNS-RECORDS-TRANSIP.md)

Ga naar TransIP > Domeinen > strq.app > DNS:

| Type | Name | Content | Priority |
|------|------|---------|----------|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEB...IDAQAB` | - |
| MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | - |

Na toevoegen: Resend > Domains > strq.app > Verify

### 2. Git commit + push

In Terminal (`~/Library/Mobile Documents/com~apple~CloudDocs/STRQ/strq-web`):

```bash
git add public/icon-192.png public/icon-512.png DNS-RECORDS-TRANSIP.md DEPLOY-CHECKLIST.md
git commit -m "Add PWA icons and deploy documentation"
git push origin main
```

Vercel deployt automatisch na push.

### 3. Edge Functions deployen

```bash
cd ~/Library/Mobile Documents/com~apple~CloudDocs/STRQ/strq-web
npx supabase functions deploy send-welcome-email
npx supabase functions deploy send-drip-email
npx supabase functions deploy unsubscribe
```

Je moet mogelijk eerst `npx supabase login` doen als je nog niet ingelogd bent.

### 4. Verificatie

- [ ] `strq.app/nl/login` — magic link formulier zichtbaar
- [ ] Magic link ontvangen na email invoer
- [ ] Na klikken: redirect naar `/nl/app` (streak dashboard)
- [ ] Waitlist signup → welkomstmail ontvangen
- [ ] Unsubscribe link in mail → werkt

## Blokkeerders

- **DNS propagatie** kan 5-60 min duren → Resend mails werken pas na verificatie
- **Edge Functions** moeten deployed zijn voordat welkomstmails werken
- **Git push** moet vóór Edge Functions deploy (Vercel moet de auth callback route hebben)
