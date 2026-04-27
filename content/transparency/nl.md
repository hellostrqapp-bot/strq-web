# Algoritmische transparantie

> Hoe strQ je XP, streak en bonussen berekent. Geen black box. Geen verborgen knoppen die jouw gedrag sturen.

*Laatst bijgewerkt: 27 april 2026*

## Waarom deze pagina

De Digital Services Act (DSA) en de Algemene Verordening Gegevensbescherming (AVG) verplichten ons uit te leggen welke automatische beslissingen we nemen die jouw ervaring vormen. Wij vinden dat sowieso een goed idee. Een streak-app die jouw gedrag stuurt zonder uit te leggen hoe, is geen partner. Hieronder lees je precies hoe het werkt.

## Welke automatische beslissingen neemt strQ

We nemen een handjevol automatische beslissingen. Allemaal gericht op het in stand houden van jouw streak en het laten zien van je voortgang. Geen content-aanbevelingen, geen advertenties, geen ranking tussen gebruikers, geen profilering.

## XP per training

Wanneer je op de "Ik heb getraind"-knop drukt, kennen we punten toe volgens een vaste formule:

- **Basis-XP.** Een vast aantal punten per geregistreerde training (op het moment van schrijven: 25 XP).
- **Streak-multiplier.** Vanaf dag 3 vermenigvuldigen we je trainings-XP. Hoe langer je streak, hoe hoger de multiplier, met een plafond. De huidige staffel is in herijking. Op het moment van schrijven gemiddeld 2x, met de bedoeling om dit terug te brengen naar een staffel van 1.0x (dag 1 tot 2), 1.5x (dag 3 tot 6), 2.0x (dag 7 tot 13) en 2.25x (dag 14 en verder). De wijziging kondigen we vooraf aan.
- **Surprise bonus.** Bij circa 1 op de 5 trainings-bevestigingen krijg je een extra bonus van 10 tot 50 XP. De kans en het bereik staan vast in de code en zijn voor iedereen gelijk. We sturen geen bonus om je terug te lokken na inactiviteit.
- **Fuzzy bonus na een event.** Als je een wedstrijd voltooit, krijg je een eenmalige bonus op basis van je tijd ten opzichte van je streeftijd. Vier categorieën: "gold" (binnen je doel), "silver" (binnen 5%), "bronze" (binnen 10%), "warm" (alles daarboven). De warm-categorie levert ook XP op, want meedoen telt.

Alle XP-transacties staan in je profiel onder "XP geschiedenis", inclusief reden en bedrag. We verbergen niets.

## Streak-berekening

Je streak is het aantal opeenvolgende dagen waarop je iets hebt geregistreerd. Een paar regels:

- Een training telt als activiteit, een geplande rustdag óók. Beide breken je streak niet.
- Een gemiste dag (geen knop ingedrukt) breekt je streak naar 0.
- Een ingeboekte rustdag in de toekomst houdt je streak in stand zonder dat je iets hoeft te doen op die dag.
- Earned rest day en taper rest tellen mee als rust-dag, niet als gat.

We schrijven elke dag de huidige streak weg in `streak_state`, samen met de langste streak ooit. Die kun je inzien via je profiel, of downloaden via "Mijn data" als JSON.

## Daily Reveal

Een training die je registreert, wordt pas verwerkt en getoond bij je volgende app-opening. Dat is een bewuste keuze: het maakt het openen van de app een micro-moment van voortgang in plaats van een routinetaak. De delay is maximaal 24 uur, of korter als je eerder terugkeert.

De surprise-bonus wordt op dat moment getrokken, niet op het moment van trainings-registratie. Het mechanisme is een eenvoudige random-trekking met een vaste kans. Geen variabele kans op basis van wanneer je voor het laatst inactief was, geen pogingen om je gedrag te sturen.

## Earned rest day

Na 2, 3 of 4+ opeenvolgende trainings-dagen kun je een "verdiende rustdag" inzetten. Die levert respectievelijk 25, 40 of 60 XP op. Je kunt 'm niet eindeloos opsparen, en de oplading reset zodra je 'm gebruikt of een gewone rustdag inboekt. De waarde is in code vastgelegd en voor iedereen gelijk.

## Streak reminders

Als je een dag niets hebt geregistreerd terwijl je streak nog loopt, sturen we maximaal één reminder per dag per email. Het exacte moment is gerandomiseerd binnen een tijdvenster, zodat de mail niet voorspelbaar is en je er niet aan went. We sturen nooit een tweede reminder op dezelfde dag, ook niet als je niet reageert. We sturen geen schuldgevoel-notificaties.

Je kunt deze reminders uitzetten via de unsubscribe-link onderin elke mail.

## Wat we expliciet NIET doen

Sommige veelgebruikte gamification-mechanieken hebben we bewust niet gebouwd:

- **Geen ranglijsten of leagues.** Je streak is jouw streak. Geen vergelijking, geen druk.
- **Geen sociale graaf.** We weten niet wie je vrienden zijn, je krijgt geen notificaties over wat anderen doen.
- **Geen content-aanbevelingen.** Er is geen feed, geen "for you", geen algoritmisch geordende inhoud. Alles wat je ziet, heb je zelf gestart.
- **Geen advertenties.** Niet van ons, niet van adverteerders, niet als sponsored content.
- **Geen variable rewards op basis van uitstel.** We sturen geen extra bonussen omdat je een dag niet hebt geopend.
- **Geen dark patterns.** Geen pre-checked boxes, geen confirm-shaming, geen "weet je het zeker, je verliest je streak"-druk.

## Profilering en geautomatiseerde beslissingen

We voeren geen profilering uit zoals bedoeld in AVG art. 22. Je krijgt geen score op basis van wie je bent, geen aanbeveling om wel of niet te trainen op basis van afgeleide kenmerken. Het algoritme weet alleen: heb je vandaag op de knop gedrukt of niet.

## Bezwaar, beïnvloeding en uitschakelen

Als je het oneens bent met hoe een mechanisme werkt, of als je vindt dat een beslissing onterecht is genomen:

- Stuur een mail naar hello@strq.app met je vraag of bezwaar. We reageren binnen 30 dagen, meestal sneller.
- Account verwijderen kan op elk moment via je profiel-instellingen. Alle data, inclusief je streak en XP-historie, wordt permanent verwijderd. Geen soft-delete.

## Wijzigingen aan deze algoritmes

Wij wijzigen geen algoritmes zonder dat te melden:

- **Wezenlijke wijziging** (XP-formule, streak-regels, surprise-kans): we kondigen de verandering minimaal 14 dagen vooraf aan via email en in-app, met de oude en nieuwe waarde.
- **Kleine kalibratie** (kleine ophogingen of verlagingen binnen dezelfde structuur): documenteren we hier in de changelog.

## Changelog

- **27 april 2026.** Initiële publicatie. Multiplier in herijking aangekondigd. Geen wijzigingen sindsdien.

## Contact

Voor alle vragen over hoe het algoritme werkt, of als je een bezwaar wilt indienen: hello@strq.app.

---

*Deze pagina is opgesteld onder de Digital Services Act (Verordening (EU) 2022/2065) en de Algemene Verordening Gegevensbescherming (AVG/GDPR). Geldig vanaf 11 mei 2026.*
