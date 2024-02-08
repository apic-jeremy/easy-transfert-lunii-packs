>:warning: **ATTENTION** :warning:
>
>**EN UTILISANT CE LOGICIEL, VOUS EN ASSUMEZ LE RISQUE.**
>
>Malgré mes efforts pour rendre l'utilisation de ce logiciel sûre, il est distribué **SANS AUCUNE GARANTIE** et pourrait endommager votre appareil.

# EasyTransfertLuniiPacks

EasyTransfertLuniiPacks (ETLP) est un outil créé dans le but de simplifier le transfert des packs depuis le logiciel "STUdio : STUdio - Story Teller Unleashed"[^1] vers "Ma Fabrique à Histoires de Lunii"[^2].

*Actuellement, ETLP est destiné aux personnes ayant des connaissances suffisantes en développement Web pour lancer une solution Angular.*

![Image globale](/src/assets/readme/global.png)

## Présentation d'ETLP

EasyTransfertLuniiPacks (ETLP) est un outil permettant de transférer des packs d'histoires présents dans la bibliothèque STUdio\* vers la Lunii\*. C'est une solution frontale qui correspond à mes besoins. Les actions Back s'appuient intégralement sur le logiciel STUdio\*.

**Cet outil ne contient aucun pack !** Toutes les informations affichées dans ce ReadMe proviennent de ma bibliothèque STUdio\* personnelle.

Si vous avez des questions, des suggestions à propos de l'utilisation de ETLP, n'hésitez pas à m'en faire part dans la partie [Discussions](https://github.com/apic-jeremy/easy-transfert-lunii-packs/discussions).

## Lancement d'ETLP

ETLP nécessite, pour le moment, un environnement de développement pour s'exécuter. Je vous recommande d'utiliser Visual Studio Code.

Il nécessite également que le logiciel STUdio\* v1.3.1 (==> [GitHub](https://github.com/marian-m12l/studio)) soit en cours d'exécution.

Ouvrez la solution et exécutez `npm start` pour lancer l'application. Puis, ouvrez votre navigateur sur [http://localhost:4400](http://localhost:4400).

Au démarrage de la solution, ETLP va lancer le script [update-official-img.bat](/studio-web-ui/update-official-img.bat) permettant de mettre à jour les images officielles des packs. (fichier "db\official.json" utilisé par le logiciel STUdio\*)

## Utilisation d'ETLP

### 1. Le bandeau d'action

![Le bandeau d'action](/src/assets/readme/bandeau-action.png)

- Bouton "**Reload**" : permet de rafraîchir la liste des packs (Lunii\* et STUdio\*)
- Bouton "**Select All**" : permet de sélectionner tous les packs affichés
- Bouton "**Unselect All**" : permet de désélectionner tous les packs affichés
- Bouton "**PUSH PACK**" : permet d'envoyer les packs sélectionnés vers la Lunii\* (disponible uniquement lorsqu'une Lunii\* est détectée, qu'il n'y a pas de recherche et qu'au moins un pack est sélectionné)
- Champ "**Recherche**" : permet de filtrer la liste des packs affichés
- Coche "**Show selected (x)**" : permet d'afficher uniquement les packs sélectionnés, prenant en compte le champ "Recherche". (x) indique le nombre total de packs sélectionnés.
- Coche "**Show disabled (x)**" : permet d'afficher les packs désactivés, sans prendre en compte le champ "Recherche". (x) indique le nombre total de packs désactivés.

>NB : Tous ces boutons sont désactivés pendant les chargements.

### 2. Le bandeau d'information

![Le bandeau d'information](/src/assets/readme/bandeau-info.png)

- "**Librairie (x)**" : indique si la bibliothèque STUdio\* est connectée (affiché en vert si OK, en rouge sinon). (x) indique le nombre de packs exploitables détectés.
- Icône "**Rapport**" : permet d'afficher dans la console du navigateur le contenu de certaines variables. A destination des Devs.
- "**Lunii** (x) + (y)" : indique si la Lunii\* est bien connectée (affiché en vert si OK, en rouge sinon). (x) indique le nombre de packs présents sur la Lunii\*. (y) indique le nombre de packs non connus (selon le matching du fichier [story-name.enum.ts](/src/app/constante/story-name.enum.ts)).

### 3. Le bandeau de rapport

>Ce bandeau trace tous les messages (qui s'affichent également en pop-up pour la plupart), selon un code couleur

![Le bandeau de rapport](/src/assets/readme/bandeau-rapport.png)

- En bleu, les messages d'informations (chargement des packs, transfert du pack en cours, ...)
- En vert, les messages de succès (chargement des packs terminé, transfert terminé, ...)
- En jaune orangé, les messages d'attention (détection de pack inconnu sur la Lunii\*, ...)
- En rouge, les messages d'erreur (Lunii\* non connecté, échec de transfert, ...)
- En noir, les messages non catégorisés, à destination des Devs.

### 4. Le bandeau des packs

>Le bandeau affiche le contenu de la bibliothèque STUdio\*. Par défaut, les packs désactivés ne sont pas affichés. Seuls les packs au format 'fs' sont pris en charge.

![Le bandeau des packs](/src/assets/readme/bandeau-packs.png)

Chaque pack est affiché dans une "card". Celle-ci comporte :
- Une coche permettant de sélectionner/désélectionner le pack
- Un titre
- Une image

>NB : Les packs sont désactivés s'il existe une version, officielle ou non, de ce pack sur la Lunii\* (selon le matching du fichier [story-name.enum.ts](/src/app/constante/story-name.enum.ts))

## Prochaines étapes

- Prise en charge du changement de statut de la Lunii\*
- Affichage des packs de la Lunii\* avec possibilité de les réorganiser
- Refonte graphique

[^1]: STUdio : STUdio - Story Teller Unleashed [GitHub](https://github.com/marian-m12l/studio)
[^2]: "Lunii" et "Ma Fabrique à Histoires" sont des marques enregistrées de Lunii SAS. Je ne suis (et ce travail n'est) en aucun cas affilié à Lunii SAS.