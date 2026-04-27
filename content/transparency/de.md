# Algorithmische Transparenz

> Wie strQ deine XP, Streak und Boni berechnet. Keine Black Box. Keine versteckten Hebel, die dein Verhalten steuern.

*Zuletzt aktualisiert: 27. April 2026*

## Warum diese Seite

Der Digital Services Act (DSA) und die Datenschutz-Grundverordnung (DSGVO) verpflichten uns, automatisierte Entscheidungen zu erklären, die deine Erfahrung prägen. Wir finden das ohnehin sinnvoll. Eine Streak-App, die dein Verhalten steuert, ohne zu erklären wie, ist kein Partner. Hier liest du genau, wie es funktioniert.

## Welche automatisierten Entscheidungen trifft strQ

Wir treffen eine Handvoll automatisierter Entscheidungen. Alle dienen dazu, deine Streak zu erhalten und deinen Fortschritt zu zeigen. Keine Inhaltsempfehlungen, keine Werbung, kein Ranking zwischen Nutzern, keine Profilbildung.

## XP pro Training

Wenn du auf "Ich habe trainiert" tippst, vergeben wir Punkte nach einer festen Formel:

- **Basis-XP.** Eine feste Anzahl pro registriertem Training (zum Zeitpunkt des Schreibens: 25 XP).
- **Streak-Multiplikator.** Ab Tag 3 multiplizieren wir deine Trainings-XP. Je länger deine Streak, desto höher der Multiplikator, mit Obergrenze. Die aktuelle Staffel wird neu kalibriert. Zum Zeitpunkt des Schreibens liegt der Durchschnitt bei etwa 2x, mit der Absicht, auf eine gestaffelte Skala von 1,0x (Tag 1 bis 2), 1,5x (Tag 3 bis 6), 2,0x (Tag 7 bis 13) und 2,25x (ab Tag 14) umzustellen. Die Änderung kündigen wir vorher an.
- **Surprise-Bonus.** Bei etwa 1 von 5 Trainingsbestätigungen erhältst du einen zusätzlichen Bonus von 10 bis 50 XP. Wahrscheinlichkeit und Bereich sind im Code fest und für alle gleich. Wir senden keinen Bonus, um dich nach Inaktivität zurückzulocken.
- **Fuzzy-Bonus nach einem Event.** Wenn du einen Wettkampf beendest, bekommst du einen einmaligen Bonus basierend auf deiner Zeit im Verhältnis zur Zielzeit. Vier Stufen: "gold" (im Ziel), "silver" (innerhalb 5%), "bronze" (innerhalb 10%), "warm" (alles darüber). Auch die Warm-Stufe gibt XP, denn dabei sein zählt.

Alle XP-Buchungen findest du in deinem Profil unter "XP-Historie", mit Grund und Betrag. Wir verstecken nichts.

## Streak-Berechnung

Deine Streak ist die Anzahl aufeinanderfolgender Tage, an denen du etwas registriert hast. Ein paar Regeln:

- Ein Training zählt als Aktivität, ein geplanter Ruhetag ebenfalls. Keiner unterbricht deine Streak.
- Ein verpasster Tag (kein Knopfdruck) setzt deine Streak auf 0.
- Ein in die Zukunft gebuchter Ruhetag erhält deine Streak, ohne dass du an dem Tag etwas tun musst.
- Earned Rest Day und Taper Rest gelten als Ruhetag, nicht als Lücke.

Wir schreiben deine aktuelle Streak täglich nach `streak_state`, zusammen mit deinem längsten Streak. Beides kannst du im Profil einsehen oder über "Meine Daten" als JSON herunterladen.

## Daily Reveal

Ein registriertes Training wird erst beim nächsten Öffnen der App verarbeitet und angezeigt. Das ist eine bewusste Entscheidung: Es macht das Öffnen der App zu einem Mikro-Moment des Fortschritts statt zu einer Routineaufgabe. Die Verzögerung beträgt maximal 24 Stunden, oder kürzer, wenn du früher zurückkehrst.

Der Surprise-Bonus wird in diesem Moment gezogen, nicht bei der Trainingsregistrierung. Der Mechanismus ist eine einfache Zufallsziehung mit fester Wahrscheinlichkeit. Keine variable Chance basierend auf Inaktivität, keine Versuche, dein Verhalten zu steuern.

## Earned Rest Day

Nach 2, 3 oder 4+ aufeinanderfolgenden Trainingstagen kannst du einen "verdienten Ruhetag" einsetzen. Er bringt 25, 40 oder 60 XP. Du kannst sie nicht endlos sammeln, und die Aufladung wird zurückgesetzt, sobald du einen einsetzt oder einen normalen Ruhetag buchst. Der Wert ist im Code fest und für alle gleich.

## Streak-Erinnerungen

Wenn du an einem Tag nichts registriert hast, während deine Streak noch läuft, senden wir maximal eine E-Mail-Erinnerung pro Tag. Der genaue Zeitpunkt wird in einem Zeitfenster zufällig gewählt, damit die Mail nicht vorhersehbar ist und du dich nicht daran gewöhnst. Wir senden niemals eine zweite Erinnerung am selben Tag, auch wenn du nicht reagierst. Wir senden keine Schuldgefühl-Benachrichtigungen.

Du kannst diese Erinnerungen über den Abmelde-Link am Ende jeder Mail deaktivieren.

## Was wir ausdrücklich NICHT tun

Einige gängige Gamification-Mechaniken haben wir bewusst nicht gebaut:

- **Keine Bestenlisten oder Ligen.** Deine Streak ist deine Streak. Kein Vergleich, kein Druck.
- **Keine Social Graph.** Wir wissen nicht, wer deine Freunde sind, du erhältst keine Benachrichtigungen über das, was andere tun.
- **Keine Inhaltsempfehlungen.** Es gibt keinen Feed, kein "for you", keine algorithmisch sortierten Inhalte. Alles, was du siehst, hast du selbst gestartet.
- **Keine Werbung.** Nicht von uns, nicht von Werbetreibenden, nicht als Sponsored Content.
- **Keine variablen Belohnungen aufgrund von Verzögerung.** Wir senden keine zusätzlichen Boni, weil du einen Tag ausgelassen hast.
- **Keine Dark Patterns.** Keine vorausgewählten Häkchen, kein Confirm-Shaming, kein "Bist du sicher, du verlierst deine Streak"-Druck.

## Profiling und automatisierte Entscheidungen

Wir führen kein Profiling im Sinne von DSGVO Art. 22 durch. Du erhältst keinen Score basierend darauf, wer du bist, keine Empfehlung zu trainieren oder zu ruhen aufgrund abgeleiteter Merkmale. Der Algorithmus weiß nur: Hast du heute den Knopf gedrückt oder nicht.

## Widerspruch, Einfluss und Abschalten

Wenn du nicht einverstanden bist, wie ein Mechanismus funktioniert, oder eine Entscheidung für ungerechtfertigt hältst:

- Schreibe eine Mail an hello@strq.app mit deiner Frage oder deinem Widerspruch. Wir antworten innerhalb von 30 Tagen, meist schneller.
- Account-Löschung ist jederzeit über deine Profil-Einstellungen möglich. Alle Daten, einschließlich deiner Streak- und XP-Historie, werden dauerhaft gelöscht. Kein Soft-Delete.

## Änderungen an diesen Algorithmen

Wir ändern keine Algorithmen ohne Ankündigung:

- **Wesentliche Änderung** (XP-Formel, Streak-Regeln, Surprise-Wahrscheinlichkeit): mindestens 14 Tage vorher per E-Mail und in der App angekündigt, mit alten und neuen Werten.
- **Kleinere Kalibrierung** (kleine Anpassungen innerhalb derselben Struktur): im Changelog unten dokumentiert.

## Changelog

- **27. April 2026.** Erstveröffentlichung. Multiplikator-Neukalibrierung angekündigt. Seitdem keine Änderungen.

## Kontakt

Für jede Frage zur Funktionsweise des Algorithmus oder zum Einreichen eines Widerspruchs: hello@strq.app.

---

*Diese Seite wurde unter dem Digital Services Act (Verordnung (EU) 2022/2065) und der Datenschutz-Grundverordnung (DSGVO) erstellt. Gültig ab 11. Mai 2026.*
