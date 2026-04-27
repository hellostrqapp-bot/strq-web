# Privacy at strQ

> What we collect, why, for how long, and what you can do about it. Written in plain language because privacy is too important for jargon.

*Last updated: 26 April 2026*

## Short and clear

strQ is a gamified consistency app for athletes. We only collect what we need to track your streak and show your progress. No GPS, no heart rate, no route data, no advertising, no selling of your data. Period.

The founder of strQ is a confidential counsellor (vertrouwenspersoon) by profession. Privacy is not a compliance checkbox for us, it is a starting point.

## Who we are

strQ.app is published by Kok Confidential BV, a Dutch private limited company.

- **Email:** hello@strq.app
- **Data controller:** Arnoud Kok
- **Privacy questions:** send an email to hello@strq.app

We have not appointed an external Data Protection Officer because we are too small for that. Once we grow beyond 10,000 active users we will revisit that decision.

## What we collect, and why

### When you sign up

- **Email address.** To create your account and send you magic links. No password needed.
- **Preferred language.** To show the app in your language.
- **Sport type (optional).** Hyrox, running, triathlon, cycling, other. Helps us show you relevant events.

### While you use the app

- **Activity log.** Per day, whether you trained or rested. Optionally whether it was moderate or intense. No times, no routes, no heart rate.
- **Events.** Name, date, target time and finish time of races you add yourself.
- **Satisfaction.** After an event we ask how it felt. Four buttons, no free text.
- **XP log.** How many points you earn and why. Fully transparent.

### Technical

- **Error reports.** If the app crashes, we send an anonymous stack trace to Sentry so we can fix it. No email, no profile data in these reports.
- **Anonymous analytics.** Through Umami, a privacy-friendly counterpart to Google Analytics. No cookies, no IP storage, no device fingerprinting.

### What we explicitly do NOT collect

- **No GPS, no routes, no kilometres.** We do not need to know where you trained.
- **No heart rate, no biometrics.** A training session is a yes/no question for us.
- **No photos, no free text.** No reflection fields.
- **No social graph.** We do not know who your friends are.
- **No device fingerprinting.** We do not want to recognise you behind your back.

## Why we are allowed to process this (legal basis)

We rely on two legal bases:

1. **Consent (GDPR art. 6 (1)(a) and art. 9 (2)(a)).** When you sign up you give explicit consent for processing of your health-related data (training/rest, intensity, finish times). You can withdraw this consent at any time by deleting your account.
2. **Legitimate interest (GDPR art. 6 (1)(f)).** For error monitoring (Sentry) and aggregated analytics (Umami) we have a legitimate interest in keeping the app stable and usable. No personal data is used here for commercial purposes.

## Who we share your data with

We only share your data with technical service providers we need to run strQ. All located in the EU, all bound by a data processing agreement.

| Service | Purpose | Location |
|---|---|---|
| Supabase | Database, login, server functions | EU (Ireland) |
| Resend | Sending emails | EU |
| Vercel | Hosting the app | EU edge locations |
| Sentry | Error monitoring | EU (Germany) |
| Umami Cloud | Privacy-friendly analytics | EU |
| ImprovMX | Email forwarding for hello@strq.app | EU |

We do not send data to countries outside the EEA. We do not sell data. We do not share with advertisers. We do not run advertising.

## How long we keep it

| Type of data | Retention period |
|---|---|
| Account data | Until you delete your account, or 24 months of inactivity |
| Activity log and streak history | Until you delete your account |
| Events and trophies | Until you delete your account |
| Daily reveals | 12 months, then automatically deleted |
| Email log (welcome mail, drip) | 90 days |
| Magic link logs | 30 days |
| Error reports (Sentry) | 90 days |
| Aggregated analytics (Umami) | 12 months, no personal data |

After 24 months without a login you will get an email warning. If you do not respond within 30 days we delete your account.

## Your rights

Under the GDPR you have a long list of rights. We try to make exercising them as easy as possible:

- **Access.** Download all your data as JSON via your profile settings.
- **Rectification.** Update your profile directly in the app.
- **Erasure.** Click "Delete account" in your profile. Everything is permanently removed. No soft delete, no leftover backup.
- **Restriction and objection.** Send an email to hello@strq.app.
- **Data portability.** Your access export is in standard JSON format, importable elsewhere.
- **Withdraw consent.** Delete your account, then all consent is gone.
- **Lodge a complaint.** Not happy with how we handle your data? You can file a complaint with the Dutch data protection authority via [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl). If you live elsewhere in the EU, you can find your local supervisory authority via the European Data Protection Board at [edpb.europa.eu/about-edpb/about-edpb/members_en](https://edpb.europa.eu/about-edpb/about-edpb/members_en).

We respond to requests within 30 days. Usually within a few days.

## How XP is calculated (algorithmic transparency)

We do not want the app to be a black box. Here is how your XP economy works:

- **Base XP per training.** Fixed amount per registered training.
- **Streak multiplier.** After 3 days your training XP gets a multiplier. The longer your streak, the higher the multiplier (with a ceiling, no infinite growth).
- **Rest days.** No XP, no penalty. They count towards your streak.
- **Surprise bonuses.** Sometimes you get an extra bonus when opening the app. Random chance, transparent logic.
- **Event bonus.** When you complete an event you get a one-off XP boost based on your tier (gold, silver, bronze, warm).

All XP transactions are listed in your profile under "XP history", including reason and amount. We hide nothing.

We have no leaderboards, no competitions between users, no social pressure. It is your streak, your rhythm, your adventure.

## Minors

strQ is for athletes aged 16 and over. When you sign up we ask you to confirm your age. If you are younger than 16 you cannot create an account yet. We are exploring how we can offer strQ safely and appropriately to younger athletes, respecting the rules around gamification and youth wellbeing.

## Security

How we protect your data:

- **TLS 1.3** for all connections.
- **Encryption at rest** (AES-256) at Supabase.
- **Row Level Security** so users only see their own data.
- **Magic link auth.** No passwords, so no password leak risk. Magic links are valid for 60 minutes and single-use.
- **Rate limiting** on all endpoints to prevent abuse.
- **Daily backups** in encrypted form.

No system is 100% safe, but we do what we can.

## Data breach

If something goes wrong despite our efforts, we follow our data breach procedure:

1. Immediately assess whether there is a breach involving personal data.
2. Contain the breach (block access, invalidate sessions).
3. Notify the Dutch data protection authority within 72 hours if there is any risk.
4. Email affected users directly if there is a high risk.

We do not hide anything and we do not downplay anything. You hear it as it is.

## Changes to this policy

If we make material changes to this privacy policy, we will email you in advance and ask for your consent to the changed processing again. No sneaky routes via "you agree to the new terms by continuing".

Minor changes (linguistic refinements, added processors with the same legal basis) we publish here and note in a changelog.

## Contact

For all privacy questions: hello@strq.app

As a rule we respond within 48 hours. Introduce yourself in the email so we can help you faster.

---

*This privacy policy is drawn up under Dutch law and the General Data Protection Regulation (GDPR). Effective from 11 May 2026.*
