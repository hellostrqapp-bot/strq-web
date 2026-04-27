# Transparence algorithmique

> Comment strQ calcule tes XP, ton streak et tes bonus. Pas de boîte noire. Pas de leviers cachés qui orientent ton comportement.

*Dernière mise à jour : 27 avril 2026*

## Pourquoi cette page

Le Digital Services Act (DSA) et le Règlement général sur la protection des données (RGPD) nous obligent à expliquer les décisions automatisées qui façonnent ton expérience. Nous trouvons cela utile de toute façon. Une appli streak qui oriente ton comportement sans expliquer comment n'est pas une partenaire. Voici exactement comment cela fonctionne.

## Quelles décisions automatisées prend strQ

Nous prenons une poignée de décisions automatisées. Toutes visent à maintenir ton streak et à afficher tes progrès. Pas de recommandations de contenu, pas de publicité, pas de classement entre utilisateurs, pas de profilage.

## XP par entraînement

Quand tu appuies sur "J'ai fait ma séance", nous attribuons des points selon une formule fixe :

- **XP de base.** Une quantité fixe par séance enregistrée (au moment de la rédaction : 25 XP).
- **Multiplicateur de streak.** À partir du jour 3, nous multiplions tes XP d'entraînement. Plus ton streak est long, plus le multiplicateur est élevé, avec un plafond. Le barème actuel est en cours de recalibrage. Au moment de la rédaction, la moyenne tourne autour de 2x, avec l'intention d'évoluer vers un palier de 1,0x (jours 1 à 2), 1,5x (jours 3 à 6), 2,0x (jours 7 à 13) et 2,25x (à partir du jour 14). Le changement sera annoncé à l'avance.
- **Bonus surprise.** Environ 1 confirmation d'entraînement sur 5 donne droit à un bonus supplémentaire de 10 à 50 XP. La probabilité et la fourchette sont fixes dans le code et identiques pour tout le monde. Nous n'envoyons pas de bonus pour te ramener après une période d'inactivité.
- **Bonus fuzzy après un événement.** Quand tu termines une course, tu reçois un bonus unique basé sur ton temps par rapport à ton objectif. Quatre niveaux : "gold" (objectif atteint), "silver" (à 5% près), "bronze" (à 10% près), "warm" (au-delà). Le niveau warm donne aussi des XP, parce que se présenter compte.

Toutes les transactions XP figurent dans ton profil sous "Historique XP", avec raison et montant. Nous ne cachons rien.

## Calcul du streak

Ton streak est le nombre de jours consécutifs durant lesquels tu as enregistré quelque chose. Quelques règles :

- Une séance compte comme activité, un jour de repos planifié aussi. Ni l'un ni l'autre ne casse ton streak.
- Un jour manqué (aucun bouton pressé) ramène ton streak à 0.
- Un jour de repos réservé dans le futur préserve ton streak sans que tu aies à faire quoi que ce soit ce jour-là.
- Earned rest day et taper rest comptent comme jours de repos, pas comme trous.

Nous écrivons ton streak actuel dans `streak_state` chaque jour, avec ton plus long streak. Tu peux les consulter via ton profil ou les télécharger via "Mes données" en JSON.

## Daily Reveal

Une séance enregistrée n'est traitée et affichée qu'à ta prochaine ouverture de l'appli. C'est un choix délibéré : cela transforme l'ouverture de l'appli en un micro-moment de progrès au lieu d'une tâche routinière. Le délai est au maximum de 24 heures, ou plus court si tu reviens plus tôt.

Le bonus surprise est tiré à ce moment-là, pas au moment de l'enregistrement de la séance. Le mécanisme est un simple tirage aléatoire à probabilité fixe. Pas de probabilité variable selon ta dernière inactivité, pas de tentative d'orienter ton comportement.

## Earned rest day

Après 2, 3 ou 4+ jours consécutifs d'entraînement, tu peux utiliser un "jour de repos mérité". Il rapporte respectivement 25, 40 ou 60 XP. Tu ne peux pas les accumuler indéfiniment, et la charge se réinitialise dès que tu en utilises un ou réserves un jour de repos normal. La valeur est fixée dans le code et identique pour tout le monde.

## Rappels de streak

Si tu n'as rien enregistré pendant un jour alors que ton streak court encore, nous envoyons au maximum un rappel par e-mail par jour. L'heure exacte est tirée au hasard dans une fenêtre, pour que le mail ne soit pas prévisible et que tu ne t'y habitues pas. Nous n'envoyons jamais de second rappel le même jour, même si tu ne réponds pas. Nous n'envoyons pas de notifications culpabilisantes.

Tu peux désactiver ces rappels via le lien de désinscription en bas de chaque mail.

## Ce que nous ne faisons explicitement PAS

Certaines mécaniques de gamification courantes, nous avons délibérément choisi de ne pas les construire :

- **Pas de classements ni de ligues.** Ton streak est ton streak. Pas de comparaison, pas de pression.
- **Pas de graphe social.** Nous ne savons pas qui sont tes amis, tu ne reçois pas de notifications sur ce que font les autres.
- **Pas de recommandations de contenu.** Il n'y a pas de fil, pas de "pour toi", pas de contenu trié algorithmiquement. Tout ce que tu vois, c'est toi qui l'as déclenché.
- **Pas de publicité.** Ni de notre part, ni d'annonceurs, ni en contenu sponsorisé.
- **Pas de récompenses variables liées au délai.** Nous n'envoyons pas de bonus supplémentaire parce que tu as sauté un jour.
- **Pas de dark patterns.** Pas de cases pré-cochées, pas de confirm-shaming, pas de pression "es-tu sûr, tu vas perdre ton streak".

## Profilage et décisions automatisées

Nous n'effectuons pas de profilage au sens de l'art. 22 du RGPD. Tu n'es pas noté en fonction de qui tu es, tu ne reçois aucune recommandation d'entraînement ou de repos basée sur des caractéristiques inférées. L'algorithme sait seulement : as-tu appuyé sur le bouton aujourd'hui, oui ou non.

## Opposition, influence et désactivation

Si tu n'es pas d'accord avec le fonctionnement d'un mécanisme, ou si tu estimes qu'une décision a été prise injustement :

- Écris à hello@strq.app avec ta question ou ton opposition. Nous répondons sous 30 jours, en général plus vite.
- La suppression de compte est disponible à tout moment via les paramètres de profil. Toutes les données, y compris ton streak et ton historique XP, sont définitivement supprimées. Pas de soft-delete.

## Modifications de ces algorithmes

Nous ne modifions pas d'algorithmes sans préavis :

- **Modification substantielle** (formule XP, règles de streak, probabilité surprise) : annoncée au moins 14 jours à l'avance par e-mail et in-app, avec valeurs anciennes et nouvelles.
- **Calibrage mineur** (petits ajustements à la hausse ou à la baisse dans la même structure) : documenté dans le changelog ci-dessous.

## Changelog

- **27 avril 2026.** Publication initiale. Recalibrage du multiplicateur annoncé. Aucun changement depuis.

## Contact

Pour toute question sur le fonctionnement de l'algorithme ou pour déposer une opposition : hello@strq.app.

---

*Cette page a été préparée sous le Digital Services Act (Règlement (UE) 2022/2065) et le Règlement général sur la protection des données (RGPD). En vigueur à partir du 11 mai 2026.*
