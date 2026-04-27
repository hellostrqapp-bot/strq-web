# Privacy bij strQ

> Wat we verzamelen, waarom, hoe lang, en wat jij ermee kunt. Geschreven in begrijpelijke taal omdat privacy te belangrijk is voor jargon.

*Laatst bijgewerkt: 26 april 2026*

## Kort en helder

strQ is een gamified consistentie-app voor sporters. We verzamelen alleen wat we nodig hebben om je streak bij te houden en je voortgang te tonen. Geen GPS, geen hartslag, geen route-data, geen reclame, geen verkoop van je gegevens. Punt.

De oprichter van strQ is vertrouwenspersoon van beroep. Privacy is voor ons geen compliance-checkbox maar een uitgangspunt.

## Wie zijn we

strQ.app wordt uitgegeven door Kok Confidential BV, een Nederlandse besloten vennootschap.

- **Email:** hello@strq.app
- **Verwerkingsverantwoordelijke:** Arnoud Kok
- **Privacy-vragen:** stuur een mail naar hello@strq.app

We hebben geen externe Functionaris voor Gegevensbescherming aangesteld omdat we daarvoor te klein zijn. Bij groei boven 10.000 actieve gebruikers herzien we dat.

## Wat we verzamelen, en waarom

### Bij aanmelden

- **Email-adres.** Om je account te maken en je magic-links te sturen. Geen wachtwoord nodig.
- **Voorkeurstaal.** Om de app in jouw taal te tonen.
- **Sport-type (optioneel).** Hyrox, hardlopen, triatlon, wielrennen, anders. Helpt ons je relevante events te tonen.

### Tijdens gebruik

- **Activiteit-log.** Per dag of je hebt getraind of gerust. Optioneel of het matig of intensief was. Geen tijden, geen routes, geen hartslag.
- **Events.** Naam, datum, streeftijd en finishtijd van wedstrijden die jij toevoegt.
- **Tevredenheid (satisfaction).** Na een event vragen we hoe het voelde. Vier knoppen, geen vrije tekst.
- **XP-log.** Hoeveel punten je verdient en waarom. Volledig transparant.

### Technisch

- **Foutmeldingen.** Als de app crasht, sturen we een anonieme stack-trace naar Sentry zodat we het kunnen fixen. Geen email, geen profiel-data in deze meldingen.
- **Anonieme analytics.** Via Umami, een privacy-vriendelijke tegenpool van Google Analytics. Geen cookies, geen IP-opslag, geen device-fingerprinting.

### Wat we expliciet NIET verzamelen

- **Geen GPS, geen routes, geen kilometers.** We hoeven niet te weten waar je trainde.
- **Geen hartslag, geen biometrie.** Een training is voor ons een ja/nee-vraag.
- **Geen foto's, geen vrije tekst.** Geen reflectie-velden.
- **Geen sociale graaf.** We weten niet wie je vrienden zijn.
- **Geen device-fingerprinting.** We willen je niet stiekem herkennen.

## Waarom mogen we dit verwerken (rechtsgrondslag)

We werken met twee grondslagen:

1. **Toestemming (AVG art. 6 lid 1 sub a en art. 9 lid 2 sub a).** Bij aanmelden geef je expliciet toestemming voor verwerking van je gezondheidsgerelateerde data (training/rust, intensiteit, finishtijden). Je kunt deze toestemming op elk moment intrekken door je account te verwijderen.
2. **Gerechtvaardigd belang (AVG art. 6 lid 1 sub f).** Voor foutmonitoring (Sentry) en geaggregeerde analytics (Umami) hebben we een gerechtvaardigd belang om de app stabiel en bruikbaar te houden. Geen persoonsgegevens worden hier voor commerciële doeleinden gebruikt.

## Met wie delen we je data

We delen je gegevens alleen met technische dienstverleners die nodig zijn om strQ te laten werken. Allemaal gevestigd in de EU, allemaal met een verwerkersovereenkomst.

| Dienst | Doel | Locatie |
|---|---|---|
| Supabase | Database, login, server-functies | EU (Ierland) |
| Resend | Verzending van emails | EU |
| Vercel | Hosting van de app | EU edge-locaties |
| Sentry | Foutmonitoring | EU (Duitsland) |
| Umami Cloud | Privacy-analytics | EU |
| ImprovMX | Email-doorsturing van hello@strq.app | EU |

We sturen geen data naar landen buiten de EER. We verkopen geen gegevens. We delen niet met adverteerders. We hebben geen advertenties.

## Hoe lang bewaren we het

| Soort data | Bewaartermijn |
|---|---|
| Account-gegevens | Tot je je account verwijdert, of 24 maanden inactiviteit |
| Activity-log en streak-historie | Tot je je account verwijdert |
| Events en trofeeën | Tot je je account verwijdert |
| Daily reveals | 12 maanden, daarna automatisch verwijderd |
| Email-log (welkomstmail, drip) | 90 dagen |
| Magic-link logs | 30 dagen |
| Foutmeldingen (Sentry) | 90 dagen |
| Geaggregeerde analytics (Umami) | 12 maanden, geen persoonlijke gegevens |

Na 24 maanden geen login krijg je een email-waarschuwing. Reageer je niet binnen 30 dagen, dan verwijderen we je account.

## Jouw rechten

Onder de AVG heb je een rits aan rechten. Wij maken ze zo eenvoudig mogelijk:

- **Inzage.** Download al je gegevens als JSON via je profiel-instellingen.
- **Rectificatie.** Pas je profiel direct aan in de app.
- **Verwijdering.** Klik op "Account verwijderen" in je profiel. Alles wordt permanent verwijderd. Geen soft-delete, geen back-up die nog blijft hangen.
- **Beperking en bezwaar.** Stuur een mail naar hello@strq.app.
- **Dataportabiliteit.** Je inzage-export is in standaard JSON-formaat, importeerbaar elders.
- **Toestemming intrekken.** Verwijder je account, dan is alle toestemming weg.
- **Klacht indienen.** Niet tevreden over hoe wij met je gegevens omgaan? Je kunt een klacht indienen bij de Autoriteit Persoonsgegevens via [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl).

We reageren binnen 30 dagen op verzoeken. Meestal binnen een paar dagen.

## Hoe XP wordt berekend (algoritmische transparantie)

We willen niet dat de app een black box is. Hier is hoe je XP-economie werkt:

- **Basis-XP per training.** Vaste hoeveelheid per geregistreerde training.
- **Streak-multiplier.** Na 3 dagen krijgt je trainings-XP een vermenigvuldiger. Hoe langer je streak, hoe hoger de multiplier (met een plafond, geen oneindige groei).
- **Rust-dagen.** Geen XP, geen straf. Tellen mee voor je streak.
- **Surprise-bonussen.** Soms krijg je een extra bonus bij het openen van de app. Random kans, transparant logica.
- **Event-bonus.** Bij voltooien van een event krijg je een eenmalige XP-boost op basis van je tier (gold, silver, bronze, warm).

Alle XP-transacties staan in je profiel onder "XP geschiedenis", inclusief reden en bedrag. We verbergen niets.

We hebben geen ranglijsten, geen competities tussen gebruikers, geen sociale druk. Het is jouw streak, jouw ritme, jouw avontuur.

## Minderjarigen

strQ is voor sporters van 16 jaar en ouder. Bij aanmelden vragen we je leeftijd te bevestigen. Ben je jonger dan 16, dan kun je nu nog geen account maken. We zijn aan het kijken hoe we strQ veilig en passend kunnen aanbieden voor jongere sporters, met respect voor de regels rond gamification en jongerenwelzijn.

## Beveiliging

Hoe we je data beschermen:

- **TLS 1.3** voor alle verbindingen.
- **Encryption at rest** (AES-256) bij Supabase.
- **Row Level Security** zodat gebruikers alleen hun eigen data zien.
- **Magic-link auth.** Geen wachtwoorden, dus geen wachtwoord-leak risico. Magic-links zijn 60 minuten geldig en eenmalig bruikbaar.
- **Rate limiting** op alle endpoints om misbruik te voorkomen.
- **Dagelijkse backups** in versleutelde vorm.

Geen systeem is 100% veilig, maar we doen wat we kunnen.

## Datalek

Mocht er onverhoopt iets misgaan, dan volgen we onze datalekprocedure:

1. Direct beoordelen of er sprake is van een lek met persoonsgegevens.
2. Lek inperken (toegang blokkeren, sessies invalideren).
3. Binnen 72 uur melden bij de Autoriteit Persoonsgegevens als er enig risico is.
4. Direct mailen naar getroffen gebruikers als er een hoog risico is.

We verzwijgen niets en relativeren niets. Je hoort het zoals het is.

## Wijzigingen in deze policy

Als we deze privacy policy wezenlijk wijzigen, mailen we je vooraf en vragen we opnieuw je toestemming voor de gewijzigde verwerking. Geen sluiproutes via "akkoord met de nieuwe voorwaarden door verder te gaan".

Kleine wijzigingen (taalkundige verfijning, toegevoegde verwerkers met dezelfde grondslag) publiceren we hier en vermelden we in een changelog.

## Contact

Voor alle privacy-vragen: hello@strq.app

We reageren in de regel binnen 48 uur. Stel jezelf voor in de mail dan kunnen we je sneller helpen.

---

*Deze privacy policy is opgesteld onder Nederlands recht en de Algemene Verordening Gegevensbescherming (AVG/GDPR). Geldig vanaf 11 mei 2026.*
