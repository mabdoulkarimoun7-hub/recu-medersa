# MIDENTY ÉDUCATION — Vision Complète V2.1
## Feuille de route fonctionnelle et technique
### Document à transmettre à Claude Code pour implémentation
---
**Date** : Juillet 2026
**Auteur** : Abdoul Karimoun (fondateur Midenty), avec l'assistance de Claude
**Version** : 2.1 (mise à jour avec activation par forfait, module présences précisé, panneau admin temps réel, bulletins par école)

---

## PARTIE 1 — FONCTIONNALITÉS EXISTANTES (déjà en production)

Ces fonctionnalités sont opérationnelles et ne doivent pas être modifiées sans raison :

1. Système multi-clients (un lien, plusieurs écoles, config JSON par client)
2. Connexion par code d'accès ou lien direct personnalisé
3. 4 onglets : Inscription, Classes, Frais mensuels, Paramètres
4. Interface trilingue : français, arabe, anglais
5. Matricules automatiques (préfixe-numéro)
6. Grille de paiement mensuel avec suivi par mois
7. Reçus partageables : PDF, Image, WhatsApp, Impression Bluetooth 58mm
8. Synchronisation Firebase Firestore (online/offline, façon WhatsApp)
9. Panneau admin avec déploiement automatique GitHub → Vercel
10. SMS automatiques via Firebase Cloud Functions
11. PWA installable sur téléphone et ordinateur
12. Sauvegarde manuelle JSON + export Excel/CSV

---

## PARTIE 2 — PRINCIPE FONDAMENTAL : ACTIVATION MODULAIRE PAR FORFAIT

### Le principe (NOUVEAU — priorité maximale)

Toutes les nouvelles fonctionnalités (onglets, menus, sections) doivent pouvoir être **activées ou désactivées individuellement depuis le panneau admin**, en fonction du forfait souscrit par chaque client. C'est ce mécanisme qui donne du sens commercial aux formules Essentiel / Complet / Premium.

### Fonctionnement technique

Dans le fichier JSON de chaque client, ajouter une section `modules` :

```json
{
  "codeAcces": "MEI-2026-EDU",
  "nomFr": "Médersa d'Éducation Islamique",
  "forfait": "complet",
  "modules": {
    "inscription": true,
    "classes": true,
    "paiements": true,
    "presences": true,
    "bulletins": true,
    "attestations": true,
    "dashboard": true,
    "enseignants": false,
    "historique": false
  }
}
```

### Comportement de l'application cliente

- Au démarrage, l'application lit la section `modules` du fichier JSON
- Chaque onglet du menu (Inscription, Paiements, Présences, Bulletins, etc.) n'apparaît QUE si son module est activé (`true`)
- Un module désactivé est totalement invisible pour le client — pas d'onglet grisé, pas de message « fonctionnalité verrouillée » — comme si la fonctionnalité n'existait pas
- Le client ne doit pas savoir quelles fonctionnalités existent en dehors de son forfait (pour ne pas créer de frustration inutile)

### Comportement du panneau admin

- Nouvelle section « Modules activés » lors de la création/modification d'un client
- Interface : une case à cocher par module, avec description courte
- Choix rapide : boutons « Appliquer forfait Essentiel / Complet / Premium » qui cochent automatiquement les bonnes cases
- Possibilité de sur-mesure : cocher/décocher manuellement en dehors des forfaits standards (pour un client qui veut une combinaison particulière)

### Correspondance forfaits → modules par défaut

| Module | Essentiel | Complet | Premium |
|---|---|---|---|
| Inscription | ✓ | ✓ | ✓ |
| Classes | ✓ | ✓ | ✓ |
| Paiements | ✓ | ✓ | ✓ |
| Reçus | ✓ | ✓ | ✓ |
| Présences | — | ✓ | ✓ |
| Bulletins | — | ✓ | ✓ |
| Attestations | — | ✓ | ✓ |
| Tableau de bord | — | ✓ | ✓ |
| Gestion enseignants | — | — | ✓ |
| Historique pluriannuel | — | — | ✓ |
| Multi-utilisateurs | — | — | ✓ |

---

## PARTIE 3 — NOUVEAUTÉ IMPORTANTE : PANNEAU ADMIN EN TEMPS RÉEL

### Le principe (NOUVEAU)

Le panneau admin doit être capable de **détecter en temps réel** toutes les modifications que le client apporte aux paramètres de son application (nom, adresse, classes, frais, textes...), et de les **synchroniser automatiquement dans le fichier JSON du client** stocké sur GitHub.

### Fonctionnement technique

**Aujourd'hui (à changer)** : le fichier JSON du client vit uniquement sur GitHub. Si le client modifie ses paramètres depuis son application, ces changements sont stockés localement/Firestore, mais le JSON GitHub n'est pas mis à jour — d'où un décalage entre ce que le client voit et ce que Midenty voit dans le panneau admin.

**Nouveau fonctionnement** :
1. Toute modification faite par le client dans son application est écrite dans Firestore : `schools/{code}/config`
2. Le panneau admin lit en temps réel cette collection Firestore (pas seulement le JSON GitHub)
3. L'admin voit toujours l'état actuel exact de la configuration de chaque client, à jour à la seconde
4. Quand Midenty modifie un paramètre depuis le panneau admin, la modification est écrite à la fois dans Firestore ET dans le JSON GitHub (via l'API GitHub existante)
5. L'application cliente relit sa configuration à chaque ouverture (priorité : Firestore d'abord, puis JSON GitHub en secours si Firestore inaccessible)

### Résultat concret pour Midenty

- Vous voyez toujours les vraies infos actuelles du client, même s'il les a changées lui-même
- Vous pouvez modifier n'importe quel paramètre depuis le panneau admin, et le client verra le changement à sa prochaine ouverture
- Vous ne perdez jamais le contrôle : le JSON GitHub reste la source de vérité pour le déploiement, Firestore est la source de vérité pour l'état courant

### Ce que le client peut modifier lui-même (paramètres éditables)

- Liste des classes (ajouter/supprimer)
- Montants des frais d'inscription et mensuels
- Modes de paiement
- Année scolaire (mois de début/fin)

### Ce que seul Midenty peut modifier (paramètres verrouillés)

- Nom de l'école (FR/AR)
- Logo
- Couleurs
- Code d'accès
- Forfait et modules activés
- Templates de bulletins et d'attestations

---

## PARTIE 4 — MODULES DÉTAILLÉS

### 4.1 — Module présences et absences (VERSION PRÉCISÉE)

**Priorité : HAUTE — Phase 1**

#### Description précise (corrigée)

Ce n'est PAS un formulaire où l'enseignant coche/décoche les élèves. C'est un **système d'appel oral en classe** : l'enseignant lit à haute voix les noms des élèves, et le système enregistre uniquement les absents (ceux qui ne répondent pas quand leur nom est appelé).

#### Fonctionnement détaillé

**Démarrage de l'appel** :
- L'enseignant ouvre l'onglet « Présences »
- Choix de la classe et de la date (date du jour par défaut, modifiable)
- Bouton « Commencer l'appel »
- L'application affiche le premier élève de la liste : nom en grand, matricule, photo si disponible

**Pendant l'appel** :
- Pour chaque élève affiché à l'écran, deux boutons :
  - **✓ Présent** (bouton vert, grand) — l'enseignant clique quand l'élève répond
  - **✗ Absent** (bouton rouge, grand) — l'enseignant clique quand l'élève ne répond pas
- Après un clic, l'application passe automatiquement à l'élève suivant
- Un compteur affiche la progression : « 5 / 24 élèves »
- Bouton « Retour » pour corriger si erreur sur l'élève précédent
- Bouton « Terminer l'appel plus tard » pour interrompre et reprendre plus tard

**Fin de l'appel** :
- Écran de résumé : nombre de présents, nombre d'absents, liste des absents
- Bouton « Valider et enregistrer » qui sauvegarde l'appel dans Firestore

**Stockage** :
```
schools/{code}/attendance/{YYYY-MM-DD}_{classe}
{
  date: "2026-07-15",
  classe: "Coran 2",
  presents: ["MEI-001", "MEI-003", "MEI-005", ...],
  absents: ["MEI-002", "MEI-004"],
  enregistrePar: "Enseignant Ahmed",
  timestamp: "2026-07-15T08:30:00"
}
```

**Alerte automatique aux parents** :
- Après chaque enregistrement d'appel, une Cloud Function compte les absences de chaque élève pour le mois en cours
- Si un élève atteint le seuil (par défaut 3, configurable par client), un SMS est envoyé au parent
- Template FR : « Bonjour, votre enfant {nom} ({classe}) a été absent {nb} fois ce mois-ci à {nomEcole}. Merci de nous contacter. Tél : {telEcole} »
- Template AR : personnalisable dans le panneau admin
- Une seule alerte par seuil atteint (pas de spam si l'élève continue d'être absent)

**Consultation de l'historique** :
- Vue mensuelle par classe : grille avec les jours en colonnes, les élèves en lignes
- Cases colorées : vert = présent, rouge = absent, gris = pas de cours
- Filtres : par mois, par classe, par élève
- Export PDF de la feuille de présence mensuelle

**Ajouts au panneau admin** :
- Activation/désactivation du module (via le système modules décrit en Partie 2)
- Seuil d'alerte absences
- Templates SMS FR/AR/EN personnalisables
- Choix : alerte SMS, WhatsApp, ou les deux

---

### 4.2 — Module bulletins de notes (VERSION APPROFONDIE)

**Priorité : HAUTE — Phase 2**

#### Le vrai défi identifié

Chaque école a son propre modèle de bulletin (design, structure, informations affichées). Créer UN modèle unique pour toutes les écoles ne fonctionnera pas — les écoles refuseront un bulletin qui ne ressemble pas au leur.

#### La solution retenue : bulletins configurables par école

Comme pour les attestations, chaque école a **son propre modèle de bulletin**, configuré une seule fois par Midenty lors de la mise en service, puis stocké dans le fichier JSON du client. L'application génère les bulletins selon ce modèle.

#### Deux niveaux de personnalisation possibles

**Niveau 1 — Modèle standard configurable** (à implémenter en premier)

Un modèle de bulletin de base, avec des zones configurables par école :
- En-tête : logo, nom de l'école (FR/AR), adresse, téléphones
- Sous-titre : « Bulletin trimestriel » / « Bulletin semestriel » (selon config)
- Bloc informations élève : nom, matricule, classe, période
- Tableau des notes : configurable en colonnes (matière / coefficient / note interrogation / note devoir / note examen / moyenne / appréciation)
- Bas de bulletin : moyenne générale, rang, appréciation du directeur, signature, date
- Pied de page : mention légale personnalisable

**Ce qui est configurable dans le panneau admin** :
- Choix des colonnes affichées dans le tableau des notes
- Système de notation : sur 20, sur 10, sur 100 (au choix)
- Nombre d'évaluations par période : 1 à 5
- Coefficient par matière
- Zones libres : appréciation, mention, décision de passage
- Couleurs (dérivées des couleurs déjà configurées pour l'école)
- Format papier : A4 portrait / A4 paysage / A5

**Niveau 2 — Modèle 100% personnalisé** (à implémenter dans une phase ultérieure, si un client le demande)

Même principe que les attestations : l'école fournit son propre design de bulletin (image de fond avec les cadres, en-têtes décoratifs). Midenty définit dans le panneau admin les zones de texte variable et leurs coordonnées. L'application génère les bulletins en superposant les vraies données sur ce design.

#### Structure dans le fichier JSON du client

```json
{
  "bulletin": {
    "modeleType": "standard",
    "systemeNotation": 20,
    "nombreEvaluations": 3,
    "colonnes": ["matiere", "coefficient", "note1", "note2", "note3", "moyenne", "appreciation"],
    "matieres": [
      { "nom": "Coran", "coefficient": 3 },
      { "nom": "Fiqh", "coefficient": 2 },
      { "nom": "Arabe", "coefficient": 2 }
    ],
    "periodes": "trimestres",
    "mentionsPossibles": ["Excellent", "Bien", "Passable", "Insuffisant"],
    "seuilsMention": [16, 12, 10, 0],
    "zoneLibre1_label": "Appréciation du directeur",
    "zoneLibre2_label": "Décision de passage",
    "signataire": "Le Directeur",
    "formatPapier": "A4-portrait"
  }
}
```

#### Génération concrète

- L'enseignant choisit : classe → période → matière
- Il saisit les notes dans un tableau (type tableur)
- L'application calcule automatiquement : moyenne par matière (selon coefficients), moyenne générale, rang dans la classe, mention selon les seuils
- Bouton « Générer les bulletins » → PDF individuel par élève ou PDF fusionné (une page par élève) ou ZIP avec un PDF par élève

#### Recommandation pour démarrer

**Commencer uniquement par le Niveau 1** (modèle standard configurable). Un seul design de bulletin, mais avec suffisamment d'options pour couvrir la plupart des écoles. Si un client refuse ce modèle standard, on passera au Niveau 2 pour lui spécifiquement — mais ne pas le construire à l'avance pour tous, ce serait beaucoup de travail pour un besoin encore hypothétique.

---

### 4.3 — Attestations et certificats

**Priorité : HAUTE — Phase 2**

Modèles d'attestation uploadés comme images de fond dans le panneau admin. Zones de texte variable (nom, date, numéro) positionnées par-dessus, à des coordonnées configurables. Numérotation automatique. Génération individuelle ou en lot. Export PDF haute résolution.

---

### 4.4 — Tableau de bord directeur

**Priorité : HAUTE — Phase 2**

Vue d'ensemble chiffrée : nombre d'élèves, revenus, taux de recouvrement, impayés, absences (si module actif). Graphiques simples (revenus/mois, inscriptions, répartition par classe). Boutons d'accès rapide vers les listes filtrées. Export rapport mensuel PDF.

---

### 4.5 — Formulaire d'inscription client automatisé

**Priorité : MOYENNE — Phase 3**

Page web publique (midenty-edu.vercel.app/inscription) que le directeur remplit lui-même : nom école (FR/AR), adresse, téléphone, logo, classes, frais, forfait souhaité. Données stockées dans Firestore collection « demandes ». Notification automatique à Midenty (Cloud Function → email/WhatsApp). Dans le panneau admin, section « Demandes en attente » avec pré-remplissage du formulaire de création. Midenty vérifie le paiement puis valide d'un clic — le fichier JSON est créé automatiquement, le déploiement se fait, le code d'accès est envoyé au client par WhatsApp.

---

### 4.6 — Gestion des enseignants

**Priorité : MOYENNE — Phase 5**

Profils enseignants (nom, téléphone, matières, classes affectées). Lien avec module présences (qui a fait l'appel) et bulletins (qui a saisi les notes).

---

### 4.7 — Historique pluriannuel

**Priorité : MOYENNE — Phase 5**

Promotion/redoublement des élèves d'une année à l'autre. Historique complet conservé. Archivage des élèves qui quittent l'école.

---

### 4.8 — Multi-utilisateurs par école (futur)

**Priorité : BASSE — Phase 6**

Rôles : Directeur (tout), Comptable (paiements + tableau de bord), Enseignant (présences + notes de ses classes). Firebase Authentication par utilisateur.

---

### 4.9 — Intégration Mobile Money (futur)

**Priorité : BASSE — Phase 6**

Paiement direct par le parent depuis son téléphone.

---

## PARTIE 5 — MODÈLE COMMERCIAL RECOMMANDÉ

### Frais de mise en service (une seule fois)

| Taille | Prix |
|---|---|
| Petit (moins de 100 élèves) | 15 000 FCFA |
| Moyen (100 à 300 élèves) | 20 000 FCFA |
| Grand (plus de 300 élèves) | 25 000 FCFA |

### Abonnement annuel (modules activés selon le forfait)

| Formule | Modules inclus | Prix/an |
|---|---|---|
| Essentiel | Inscription + Classes + Paiements + Reçus + Sync + Support | 18 000 FCFA |
| Complet | Essentiel + Présences + Bulletins + Attestations + Tableau de bord + SMS (50/mois) | 30 000 FCFA |
| Premium | Complet + Enseignants + Historique + Multi-utilisateurs + SMS illimités | 48 000 FCFA |

### Gestion du non-renouvellement

- L'école ne perd JAMAIS ses données
- Accès en lecture seule (consultation)
- Inscription de nouveaux élèves et nouveaux paiements bloqués
- Réactivation immédiate après paiement

### Gestion technique de l'abonnement

Champ dans le fichier JSON du client :
```json
{
  "abonnement": {
    "formule": "complet",
    "dateDebut": "2026-09-01",
    "dateFin": "2027-08-31",
    "actif": true
  }
}
```

L'application vérifie la date de fin à chaque ouverture. Si expiré, bascule en mode lecture seule. Le panneau admin affiche les abonnements bientôt expirés (30 jours avant) pour relance.

---

## PARTIE 6 — ARCHITECTURE TECHNIQUE

### Nouveaux fichiers à créer

- `app/attendance.js` — Logique appel oral + historique
- `app/bulletins.js` — Saisie notes + génération PDF selon modèle client
- `app/certificates.js` — Génération attestations
- `app/dashboard.js` — Tableau de bord avec graphiques
- `app/modules-manager.js` — Gestion de l'activation/désactivation des onglets selon les modules du client
- `admin/realtime-sync.js` — Synchronisation temps réel Firestore ↔ panneau admin ↔ GitHub

### Nouvelles collections Firestore

```
schools/{code}/config              — Configuration temps réel (modifiable par le client)
schools/{code}/attendance/{date}   — Appels quotidiens
schools/{code}/grades/{periode}    — Notes par période
schools/{code}/certificates/{num}  — Attestations générées
demandes/{id}                      — Demandes d'inscription en attente
```

### Nouvelles Cloud Functions

- `onAbsenceThreshold` — SMS au parent quand seuil d'absences atteint
- `onNewDemande` — Notification à Midenty nouvelle inscription client
- `onConfigChange` — Synchronisation config Firestore → JSON GitHub

---

## PARTIE 7 — ORDRE D'IMPLÉMENTATION

### Phase 0 — Fondations transversales (1 semaine)

**À faire AVANT tout nouveau module**, car ces changements affectent tout :

1. Système d'activation modulaire des onglets (section `modules` dans le JSON client)
2. Panneau admin — nouvelle section « Modules activés » avec boutons forfait
3. Panneau admin — synchronisation temps réel avec Firestore

### Phase 1 — Présences (1-2 semaines)

4. Module présences (appel oral, un élève à la fois)
5. Alerte SMS automatique au seuil d'absences
6. Historique et export PDF

### Phase 2 — Documents (3-4 semaines)

7. Tableau de bord directeur
8. Bulletins de notes (modèle standard configurable — Niveau 1)
9. Attestations et certificats

### Phase 3 — Automatisation (1 semaine)

10. Formulaire d'inscription client automatisé
11. Section « Demandes en attente » dans admin
12. Notification Cloud Function

### Phase 4 — Abonnement (1 semaine)

13. Champ abonnement dans config client
14. Mode lecture seule si expiré
15. Alertes d'expiration dans admin

### Phase 5 — Enrichissement (2-3 semaines)

16. Gestion des enseignants
17. Historique pluriannuel
18. Mise à jour du guide confidentiel PDF

### Phase 6 — Futur

19. Multi-utilisateurs
20. Mobile Money
21. Bulletins Niveau 2 (design personnalisé par école, si demandé)

---

## PARTIE 8 — INSTRUCTIONS POUR CLAUDE CODE

### Règles générales

1. Ne JAMAIS casser ce qui fonctionne — tester après chaque ajout
2. Chaque module = fichier JS séparé
3. Chaque nouveau réglage configurable depuis le panneau admin (rien en dur)
4. Chaque texte via i18n (3 langues FR/AR/EN)
5. Chaque donnée dans Firestore avec sync offline
6. Tout nouveau menu/onglet doit passer par le système modules (activable/désactivable par forfait)
7. Le panneau admin doit refléter en temps réel l'état de la config client
8. Mettre à jour CLAUDE.md après chaque phase terminée
9. Mettre à jour le guide confidentiel PDF après chaque phase terminée
10. Expliquer en français simple chaque décision technique

### Workflow par fonctionnalité

1. D'abord : expliquer le plan d'implémentation en français simple (ne pas coder directement)
2. Obtenir la validation de l'utilisateur sur le plan
3. Implémenter étape par étape, en testant chaque étape
4. Mettre à jour le panneau admin avec les nouveaux réglages
5. Tester le flux complet : panneau admin → configuration → app client → fonctionnalité
6. Mettre à jour le CLAUDE.md

### Point d'attention particulier — Phase 0 obligatoire

**Ne pas commencer les nouveaux modules (présences, bulletins, etc.) avant d'avoir terminé la Phase 0** (activation modulaire + panneau admin temps réel). Sans ces fondations, chaque module devra être re-refactoré après coup pour intégrer ces mécanismes — beaucoup plus coûteux.
