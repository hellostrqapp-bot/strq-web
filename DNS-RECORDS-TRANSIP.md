# DNS Records voor strq.app bij TransIP

Voeg deze records toe in het TransIP DNS-paneel voor strq.app.

## 1. DKIM (Domain Verification)

- **Type:** TXT
- **Name:** `resend._domainkey`
- **Content:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDT8ErQ/jye7GWgRgUbERreSLJ0wSrhuVHuKqvjAr+BirENXUNRgq9813ANqtKUwzGBghVK4YyZOUCmbhNVChMck/Hmuvf0G6oAzOEi+6h0RDlgxtxMe1mDDTupP9kJhkOWoK0CNVrc/Tng2cN6Bqav607xGEyJRS/5MK8Ef/QdvwIDAQAB`
- **TTL:** Auto

## 2. SPF - MX Record (Enable Sending)

- **Type:** MX
- **Name:** `send`
- **Content:** `feedback-smtp.eu-west-1.amazonses.com`
- **TTL:** Auto
- **Priority:** 10

## 3. SPF - TXT Record (Enable Sending)

- **Type:** TXT
- **Name:** `send`
- **Content:** `v=spf1 include:amazonses.com ~all`
- **TTL:** Auto

---

Na toevoegen: ga terug naar Resend > Domains > strq.app en klik "Verify".
DNS-propagatie kan 5-60 minuten duren.
