# Confidentialité chez strQ

> Ce que nous collectons, pourquoi, pour combien de temps, et ce que tu peux en faire. Écrit en langage clair parce que la vie privée est trop importante pour le jargon.

*Dernière mise à jour : 26 avril 2026*

## En bref

strQ est une application de constance gamifiée pour sportifs. Nous ne collectons que ce dont nous avons besoin pour suivre ta streak et afficher ta progression. Pas de GPS, pas de fréquence cardiaque, pas de données de parcours, pas de publicité, pas de revente de tes données. Point.

Le fondateur de strQ est conseiller de confiance (vertrouwenspersoon) de profession. La vie privée n'est pas pour nous une case à cocher de conformité, c'est un point de départ.

## Qui nous sommes

strQ.app est éditée par Kok Confidential BV, une société à responsabilité limitée néerlandaise.

- **E-mail :** hello@strq.app
- **Responsable du traitement :** Arnoud Kok
- **Questions de confidentialité :** envoie un e-mail à hello@strq.app

Nous n'avons pas désigné de Délégué à la Protection des Données externe parce que nous sommes trop petits pour cela. Nous reverrons ce choix lorsque nous dépasserons 10 000 utilisateurs actifs.

## Ce que nous collectons et pourquoi

### À l'inscription

- **Adresse e-mail.** Pour créer ton compte et t'envoyer des magic-links. Aucun mot de passe nécessaire.
- **Langue préférée.** Pour afficher l'application dans ta langue.
- **Type de sport (facultatif).** Hyrox, course à pied, triathlon, cyclisme, autre. Nous aide à te montrer des événements pertinents.

### Pendant l'utilisation

- **Journal d'activité.** Par jour, si tu t'es entraîné ou reposé. Optionnellement, si l'effort était modéré ou intense. Pas d'horaires, pas de parcours, pas de fréquence cardiaque.
- **Événements.** Nom, date, temps cible et temps final des compétitions que tu ajoutes toi-même.
- **Satisfaction.** Après un événement, nous te demandons comment ça s'est passé. Quatre boutons, pas de texte libre.
- **Journal d'XP.** Combien de points tu gagnes et pourquoi. Totalement transparent.

### Technique

- **Rapports d'erreur.** Si l'application plante, nous envoyons une stack trace anonyme à Sentry pour pouvoir corriger. Pas d'e-mail, pas de données de profil dans ces rapports.
- **Analytics anonymes.** Via Umami, un équivalent respectueux de la vie privée à Google Analytics. Pas de cookies, pas de stockage d'IP, pas de fingerprinting.

### Ce que nous ne collectons explicitement PAS

- **Pas de GPS, pas de parcours, pas de kilomètres.** Nous n'avons pas besoin de savoir où tu t'es entraîné.
- **Pas de fréquence cardiaque, pas de biométrie.** Pour nous, une séance d'entraînement est une question oui/non.
- **Pas de photos, pas de texte libre.** Pas de champs de réflexion.
- **Pas de graphe social.** Nous ne savons pas qui sont tes amis.
- **Pas de fingerprinting.** Nous ne voulons pas te reconnaître en douce.

## Pourquoi nous pouvons traiter ces données (base juridique)

Nous nous appuyons sur deux bases juridiques :

1. **Consentement (RGPD art. 6 paragraphe 1 point a et art. 9 paragraphe 2 point a).** À l'inscription, tu donnes ton consentement explicite au traitement de tes données liées à la santé (entraînement/repos, intensité, temps finaux). Tu peux retirer ce consentement à tout moment en supprimant ton compte.
2. **Intérêt légitime (RGPD art. 6 paragraphe 1 point f).** Pour la surveillance des erreurs (Sentry) et les analytics agrégés (Umami), nous avons un intérêt légitime à garder l'application stable et utilisable. Aucune donnée personnelle n'est utilisée ici à des fins commerciales.

## Avec qui nous partageons tes données

Nous partageons tes données uniquement avec les prestataires techniques nécessaires au fonctionnement de strQ. Tous établis dans l'UE, tous liés par un contrat de sous-traitance.

| Service | Finalité | Localisation |
|---|---|---|
| Supabase | Base de données, login, fonctions serveur | UE (Irlande) |
| Resend | Envoi d'e-mails | UE |
| Vercel | Hébergement de l'application | Sites edge UE |
| Sentry | Surveillance des erreurs | UE (Allemagne) |
| Umami Cloud | Analytics respectueux de la vie privée | UE |
| ImprovMX | Redirection d'e-mails de hello@strq.app | UE |

Nous n'envoyons pas de données vers des pays hors EEE. Nous ne vendons pas de données. Nous ne partageons pas avec des annonceurs. Nous n'avons pas de publicités.

## Combien de temps nous conservons

| Type de données | Durée de conservation |
|---|---|
| Données de compte | Jusqu'à la suppression de ton compte, ou 24 mois d'inactivité |
| Journal d'activité et historique de streak | Jusqu'à la suppression de ton compte |
| Événements et trophées | Jusqu'à la suppression de ton compte |
| Daily reveals | 12 mois, puis suppression automatique |
| Journal e-mail (mail de bienvenue, drip) | 90 jours |
| Journaux des magic-links | 30 jours |
| Rapports d'erreur (Sentry) | 90 jours |
| Analytics agrégés (Umami) | 12 mois, sans données personnelles |

Après 24 mois sans connexion, tu reçois un avertissement par e-mail. Si tu ne réponds pas dans les 30 jours, nous supprimons ton compte.

## Tes droits

Le RGPD te donne toute une série de droits. Nous te les rendons aussi simples que possible :

- **Accès.** Télécharge toutes tes données au format JSON via les paramètres de ton profil.
- **Rectification.** Modifie ton profil directement dans l'application.
- **Effacement.** Clique sur "Supprimer le compte" dans ton profil. Tout est supprimé définitivement. Pas de soft-delete, pas de sauvegarde qui traîne.
- **Limitation et opposition.** Envoie un e-mail à hello@strq.app.
- **Portabilité.** Ton export d'accès est au format JSON standard, importable ailleurs.
- **Retrait du consentement.** Supprime ton compte, et tout consentement disparaît.
- **Réclamation.** Pas satisfait de la manière dont nous traitons tes données ? Tu peux déposer une réclamation auprès de l'autorité néerlandaise de protection des données via [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl). Si tu vis ailleurs dans l'UE, tu peux trouver ton autorité locale via le Comité européen de la protection des données à l'adresse [edpb.europa.eu/about-edpb/about-edpb/members_en](https://edpb.europa.eu/about-edpb/about-edpb/members_en). En France, il s'agit de la CNIL.

Nous répondons aux demandes dans un délai de 30 jours. La plupart du temps en quelques jours.

## Comment l'XP est calculé (transparence algorithmique)

Nous ne voulons pas que l'application soit une boîte noire. Voici comment fonctionne ton économie d'XP :

- **XP de base par entraînement.** Quantité fixe par entraînement enregistré.
- **Multiplicateur de streak.** Après 3 jours, ton XP d'entraînement reçoit un multiplicateur. Plus ta streak est longue, plus le multiplicateur est élevé (avec un plafond, pas de croissance infinie).
- **Jours de repos.** Pas d'XP, pas de pénalité. Ils comptent pour ta streak.
- **Bonus surprise.** Parfois, tu reçois un bonus supplémentaire en ouvrant l'application. Chance aléatoire, logique transparente.
- **Bonus d'événement.** À l'achèvement d'un événement, tu reçois un boost d'XP unique en fonction de ton tier (gold, silver, bronze, warm).

Toutes les transactions d'XP figurent dans ton profil sous "Historique d'XP", avec la raison et le montant. Nous ne cachons rien.

Nous n'avons pas de classements, pas de compétitions entre utilisateurs, pas de pression sociale. C'est ta streak, ton rythme, ton aventure.

## Mineurs

strQ est destiné aux sportifs de 16 ans et plus. À l'inscription, nous te demandons de confirmer ton âge. Si tu as moins de 16 ans, tu ne peux pas encore créer de compte. Nous étudions comment proposer strQ de manière sûre et adaptée aux plus jeunes sportifs, dans le respect des règles autour de la gamification et du bien-être des jeunes.

## Sécurité

Comment nous protégeons tes données :

- **TLS 1.3** pour toutes les connexions.
- **Encryption at rest** (AES-256) chez Supabase.
- **Row Level Security** pour que les utilisateurs ne voient que leurs propres données.
- **Auth par magic-link.** Pas de mots de passe, donc pas de risque de fuite de mot de passe. Les magic-links sont valables 60 minutes et utilisables une seule fois.
- **Rate limiting** sur tous les endpoints pour éviter les abus.
- **Sauvegardes quotidiennes** sous forme chiffrée.

Aucun système n'est sûr à 100%, mais nous faisons ce que nous pouvons.

## Fuite de données

Si malgré tout quelque chose se passe mal, nous suivons notre procédure en cas de fuite de données :

1. Évaluer immédiatement s'il s'agit bien d'une fuite de données personnelles.
2. Contenir la fuite (bloquer l'accès, invalider les sessions).
3. Notifier l'autorité néerlandaise de protection des données dans les 72 heures s'il existe un risque.
4. Envoyer un e-mail directement aux utilisateurs concernés en cas de risque élevé.

Nous ne cachons rien et nous ne minimisons rien. Tu l'apprends tel que c'est.

## Modifications de cette politique

Si nous apportons des modifications substantielles à cette politique de confidentialité, nous t'enverrons un e-mail au préalable et te demanderons à nouveau ton consentement pour le traitement modifié. Pas de raccourci du genre "tu acceptes les nouvelles conditions en continuant".

Les petites modifications (affinements linguistiques, sous-traitants ajoutés sur la même base juridique) sont publiées ici et mentionnées dans un changelog.

## Contact

Pour toute question relative à la confidentialité : hello@strq.app

En règle générale, nous répondons dans les 48 heures. Présente-toi dans l'e-mail pour que nous puissions t'aider plus vite.

---

*Cette politique de confidentialité est rédigée selon le droit néerlandais et le Règlement Général sur la Protection des Données (RGPD/GDPR). En vigueur à partir du 11 mai 2026.*
