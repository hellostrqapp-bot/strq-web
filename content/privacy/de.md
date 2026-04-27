# Datenschutz bei strQ

> Was wir erheben, warum, wie lange und was du damit tun kannst. In verständlicher Sprache geschrieben, weil Datenschutz zu wichtig ist für Fachjargon.

*Zuletzt aktualisiert: 26. April 2026*

## Kurz und klar

strQ ist eine gamifizierte Konsistenz-App für Sportler. Wir erheben nur, was wir brauchen, um deine Streak zu verfolgen und deinen Fortschritt zu zeigen. Kein GPS, keine Herzfrequenz, keine Routendaten, keine Werbung, kein Verkauf deiner Daten. Punkt.

Der Gründer von strQ ist von Beruf Vertrauensperson. Datenschutz ist für uns kein Compliance-Häkchen, sondern ein Ausgangspunkt.

## Wer wir sind

strQ.app wird von Kok Confidential BV herausgegeben, einer niederländischen Gesellschaft mit beschränkter Haftung.

- **E-Mail:** hello@strq.app
- **Verantwortlicher:** Arnoud Kok
- **Datenschutzfragen:** sende eine E-Mail an hello@strq.app

Wir haben keinen externen Datenschutzbeauftragten benannt, weil wir dafür zu klein sind. Bei einem Wachstum über 10.000 aktive Nutzer überdenken wir das.

## Was wir erheben und warum

### Bei der Anmeldung

- **E-Mail-Adresse.** Um dein Konto zu erstellen und dir Magic-Links zu schicken. Kein Passwort nötig.
- **Bevorzugte Sprache.** Um die App in deiner Sprache anzuzeigen.
- **Sportart (optional).** Hyrox, Laufen, Triathlon, Radfahren, Sonstiges. Hilft uns, dir relevante Events zu zeigen.

### Während der Nutzung

- **Aktivitätsprotokoll.** Pro Tag, ob du trainiert oder pausiert hast. Optional, ob es moderat oder intensiv war. Keine Zeiten, keine Routen, keine Herzfrequenz.
- **Events.** Name, Datum, Zielzeit und Endzeit von Wettkämpfen, die du selbst hinzufügst.
- **Zufriedenheit (Satisfaction).** Nach einem Event fragen wir, wie es sich angefühlt hat. Vier Knöpfe, kein Freitext.
- **XP-Protokoll.** Wie viele Punkte du verdienst und warum. Voll transparent.

### Technisch

- **Fehlermeldungen.** Wenn die App abstürzt, schicken wir einen anonymen Stack-Trace an Sentry, damit wir es beheben können. Keine E-Mail, keine Profildaten in diesen Meldungen.
- **Anonyme Analytics.** Über Umami, ein datenschutzfreundliches Gegenstück zu Google Analytics. Keine Cookies, keine IP-Speicherung, kein Device-Fingerprinting.

### Was wir ausdrücklich NICHT erheben

- **Kein GPS, keine Routen, keine Kilometer.** Wir müssen nicht wissen, wo du trainiert hast.
- **Keine Herzfrequenz, keine Biometrie.** Eine Trainingseinheit ist für uns eine Ja/Nein-Frage.
- **Keine Fotos, kein Freitext.** Keine Reflexionsfelder.
- **Kein soziales Netzwerk.** Wir wissen nicht, wer deine Freunde sind.
- **Kein Device-Fingerprinting.** Wir wollen dich nicht heimlich erkennen.

## Warum wir das verarbeiten dürfen (Rechtsgrundlage)

Wir arbeiten mit zwei Rechtsgrundlagen:

1. **Einwilligung (DSGVO Art. 6 Abs. 1 lit. a und Art. 9 Abs. 2 lit. a).** Bei der Anmeldung gibst du ausdrücklich deine Einwilligung zur Verarbeitung deiner gesundheitsbezogenen Daten (Training/Ruhe, Intensität, Endzeiten). Du kannst diese Einwilligung jederzeit widerrufen, indem du dein Konto löschst.
2. **Berechtigtes Interesse (DSGVO Art. 6 Abs. 1 lit. f).** Für Fehlermonitoring (Sentry) und aggregierte Analytics (Umami) haben wir ein berechtigtes Interesse, die App stabil und nutzbar zu halten. Hier werden keine personenbezogenen Daten zu kommerziellen Zwecken verwendet.

## Mit wem wir deine Daten teilen

Wir teilen deine Daten nur mit technischen Dienstleistern, die wir für den Betrieb von strQ brauchen. Alle in der EU ansässig, alle mit einem Auftragsverarbeitungsvertrag.

| Dienst | Zweck | Standort |
|---|---|---|
| Supabase | Datenbank, Login, Serverfunktionen | EU (Irland) |
| Resend | Versand von E-Mails | EU |
| Vercel | Hosting der App | EU-Edge-Standorte |
| Sentry | Fehlermonitoring | EU (Deutschland) |
| Umami Cloud | Datenschutzfreundliche Analytics | EU |
| ImprovMX | E-Mail-Weiterleitung von hello@strq.app | EU |

Wir senden keine Daten in Länder außerhalb des EWR. Wir verkaufen keine Daten. Wir teilen sie nicht mit Werbetreibenden. Wir haben keine Werbung.

## Wie lange wir es speichern

| Datenart | Aufbewahrungsfrist |
|---|---|
| Kontodaten | Bis du dein Konto löschst, oder 24 Monate Inaktivität |
| Aktivitätsprotokoll und Streak-Verlauf | Bis du dein Konto löschst |
| Events und Trophäen | Bis du dein Konto löschst |
| Daily Reveals | 12 Monate, dann automatisch gelöscht |
| E-Mail-Protokoll (Willkommens-Mail, Drip) | 90 Tage |
| Magic-Link-Protokolle | 30 Tage |
| Fehlermeldungen (Sentry) | 90 Tage |
| Aggregierte Analytics (Umami) | 12 Monate, keine personenbezogenen Daten |

Nach 24 Monaten ohne Login bekommst du eine E-Mail-Warnung. Reagierst du nicht innerhalb von 30 Tagen, löschen wir dein Konto.

## Deine Rechte

Nach der DSGVO hast du eine ganze Reihe von Rechten. Wir machen sie dir so einfach wie möglich:

- **Auskunft.** Lade alle deine Daten als JSON über deine Profileinstellungen herunter.
- **Berichtigung.** Passe dein Profil direkt in der App an.
- **Löschung.** Klicke in deinem Profil auf "Konto löschen". Alles wird endgültig entfernt. Kein Soft-Delete, kein Backup, das übrig bleibt.
- **Einschränkung und Widerspruch.** Sende eine E-Mail an hello@strq.app.
- **Datenübertragbarkeit.** Dein Auskunfts-Export ist im Standard-JSON-Format und anderswo importierbar.
- **Einwilligung widerrufen.** Lösche dein Konto, dann ist jede Einwilligung weg.
- **Beschwerde einreichen.** Nicht zufrieden, wie wir mit deinen Daten umgehen? Du kannst eine Beschwerde bei der niederländischen Datenschutzbehörde über [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl) einreichen. Wenn du in einem anderen EU-Land lebst, findest du deine zuständige Aufsichtsbehörde über den Europäischen Datenschutzausschuss unter [edpb.europa.eu/about-edpb/about-edpb/members_en](https://edpb.europa.eu/about-edpb/about-edpb/members_en).

Wir antworten innerhalb von 30 Tagen auf Anfragen. Meistens innerhalb weniger Tage.

## Wie XP berechnet wird (algorithmische Transparenz)

Wir wollen nicht, dass die App eine Black Box ist. So funktioniert deine XP-Ökonomie:

- **Basis-XP pro Training.** Feste Menge pro registriertem Training.
- **Streak-Multiplikator.** Nach 3 Tagen bekommt dein Trainings-XP einen Multiplikator. Je länger deine Streak, desto höher der Multiplikator (mit einer Obergrenze, kein unendliches Wachstum).
- **Ruhetage.** Kein XP, keine Strafe. Sie zählen für deine Streak.
- **Überraschungs-Boni.** Manchmal bekommst du beim Öffnen der App einen Extra-Bonus. Zufällige Chance, transparente Logik.
- **Event-Bonus.** Beim Abschluss eines Events bekommst du einen einmaligen XP-Boost, basierend auf deinem Tier (Gold, Silber, Bronze, Warm).

Alle XP-Transaktionen stehen in deinem Profil unter "XP-Verlauf", inklusive Grund und Betrag. Wir verbergen nichts.

Wir haben keine Ranglisten, keine Wettbewerbe zwischen Nutzern, keinen sozialen Druck. Es ist deine Streak, dein Rhythmus, dein Abenteuer.

## Minderjährige

strQ ist für Sportler ab 16 Jahren. Bei der Anmeldung bitten wir dich, dein Alter zu bestätigen. Bist du jünger als 16, kannst du derzeit noch kein Konto erstellen. Wir prüfen, wie wir strQ sicher und altersgerecht für jüngere Sportler anbieten können, mit Respekt vor den Regeln rund um Gamification und Jugendwohl.

## Sicherheit

Wie wir deine Daten schützen:

- **TLS 1.3** für alle Verbindungen.
- **Encryption at rest** (AES-256) bei Supabase.
- **Row Level Security**, sodass Nutzer nur ihre eigenen Daten sehen.
- **Magic-Link-Auth.** Keine Passwörter, also kein Passwort-Leak-Risiko. Magic-Links sind 60 Minuten gültig und einmalig nutzbar.
- **Rate-Limiting** auf allen Endpunkten, um Missbrauch zu verhindern.
- **Tägliche Backups** in verschlüsselter Form.

Kein System ist zu 100% sicher, aber wir tun, was wir können.

## Datenpanne

Sollte trotz allem etwas schiefgehen, folgen wir unserem Datenpannen-Verfahren:

1. Sofort beurteilen, ob ein Vorfall mit personenbezogenen Daten vorliegt.
2. Vorfall eingrenzen (Zugriff blockieren, Sitzungen ungültig machen).
3. Innerhalb von 72 Stunden bei der niederländischen Datenschutzbehörde melden, sofern ein Risiko besteht.
4. Direkt betroffene Nutzer per E-Mail informieren, wenn ein hohes Risiko besteht.

Wir verschweigen nichts und beschönigen nichts. Du erfährst es, wie es ist.

## Änderungen dieser Policy

Bei wesentlichen Änderungen dieser Datenschutzerklärung mailen wir dich vorab und bitten erneut um deine Einwilligung für die geänderte Verarbeitung. Keine Schleichwege über "Mit Weiterklicken stimmst du den neuen Bedingungen zu".

Kleinere Änderungen (sprachliche Verfeinerungen, ergänzte Auftragsverarbeiter mit derselben Rechtsgrundlage) veröffentlichen wir hier und vermerken sie in einem Changelog.

## Kontakt

Für alle Datenschutzfragen: hello@strq.app

In der Regel antworten wir innerhalb von 48 Stunden. Stelle dich in der E-Mail kurz vor, dann können wir dir schneller helfen.

---

*Diese Datenschutzerklärung wurde nach niederländischem Recht und der Datenschutz-Grundverordnung (DSGVO) erstellt. Gültig ab dem 11. Mai 2026.*
