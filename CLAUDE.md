# Midenty Éducation — Plateforme de gestion éducative

## Description

Plateforme PWA de gestion pour établissements éducatifs en Afrique, développée par **Midenty** (+227 88 81 10 81, mabdoulkarimoun7@gmail.com). Gère les inscriptions d'élèves/étudiants, le suivi des paiements, et la génération de reçus (PDF, PNG, WhatsApp, impression thermique Bluetooth). Interface trilingue : français, arabe, anglais.

**Une seule application pour tous les types d'établissements** : médersas, écoles privées, universités arabes, universités, centres de formation. Chaque client a sa propre configuration (nom, logo, couleurs, frais, classes) chargée via un code d'accès unique.

**Vision** : plateforme panafricaine avec des bureaux au Niger, Burkina Faso, Mali, Nigeria, et progressivement dans toute l'Afrique.

## URLs et hébergement

- **Application** : `https://midenty-edu.vercel.app`
- **Panneau admin** : `https://midenty-edu.vercel.app/admin/`
- **Ancienne URL** : `recu-medersa.vercel.app` (redirige automatiquement → 307)
- **Hébergeur** : Vercel (plan Hobby, gratuit, auto-deploy depuis GitHub)
- **Dépôt GitHub** : `mabdoulkarimoun7-hub/recu-medersa` (branche `master`)
- **Firebase** : projet `midenty-medersa` (Auth + Firestore)

## Structure du projet

```
recu-medersa/
├── index.html              # Page d'entrée PWA (doit rester à la racine) — splash, choix langue, bienvenue, login
├── service-worker.js       # Cache (version incrémentée à chaque déploiement), network-first, clients/*.json exclus du cache
├── manifest.json           # Fiche d'identité PWA
├── CLAUDE.md
│
├── app/                    # Code de l'application cliente
│   ├── app.js              # Logique : splash multi-écrans, login, inscription, classes, mensuel, paramètres
│   ├── config.js           # CONFIG_DEFAULTS + CONFIG (loadClientConfig, applyClientConfig, getSettings, migration année scolaire)
│   ├── storage.js          # Données : localStorage + sync Firestore (online/offline automatique)
│   ├── firebase-config.js  # Init Firebase, Firestore avec persistence hors-ligne
│   ├── i18n.js             # Système trilingue complet (fr/ar/en, 200+ clés par langue)
│   ├── style.css           # Design mobile-first, RTL arabe, splash, login, onglets, modals
│   ├── pdf-export.js       # Génération PDF/PNG, partage WhatsApp (arabe via canvas)
│   ├── print-escpos.js     # Impression thermique 58mm via RawBT (arabe en images)
│   └── qr-manager.js       # Génération QR (simplifié)
│
├── admin/                  # Panneau admin Midenty (accessible via /admin/)
│   ├── index.html          # Interface admin (login Firebase Auth, nav Clients/Statistiques, formulaire avec types d'établissement)
│   ├── admin.js            # CRUD clients, presets par type d'établissement, push GitHub auto, push index.json, import/export
│   ├── admin-i18n.js       # Traductions du panneau admin (fr/ar/en), RTL, sélecteur de langue
│   ├── stats.js            # Tableau de bord Statistiques : écoute Firestore temps réel, graphiques Chart.js
│   └── admin.css           # Styles du panneau admin
│
├── clients/                # Un fichier JSON par client
│   ├── index.json          # Manifeste : liste des codes clients (auto-chargement admin)
│   ├── MEI-2026-EDU.json   # Médersa d'Éducation Islamique
│   ├── ABRAR-2026-469.json # Médersa Abrar
│   └── CFT-2026-TIL.json  # Centre Formation Tillabéri
│
├── assets/                 # Images et icônes
│   ├── logo.png            # Logo par défaut
│   ├── icon-192.png        # Icône PWA
│   └── icon-512.png        # Icône PWA
│
└── docs/                   # Documentation
    └── guide-confidentiel.html  # Génère un PDF guide complet (codes, usage, vision future)
```

## Décisions techniques

- **Vercel + GitHub** : hébergement gratuit, auto-deploy à chaque push sur `master`. Migration depuis Netlify (juillet 2026, crédits épuisés).
- **Firebase Firestore** pour les données (élèves, paiements). Synchronisation automatique online/offline : les données sont enregistrées en ligne quand internet est disponible, stockées localement quand hors-ligne, et synchronisées automatiquement au retour de la connexion. `enablePersistence({ synchronizeTabs: true })`.
- **Firebase Auth** pour sécuriser le panneau admin (email/mot de passe).
- **localStorage comme cache** : les données locales servent de cache rapide, Firestore est la source de vérité. L'indicateur de sync dans l'UI montre l'état (synced/pending/offline).
- **Système i18n complet** (`app/i18n.js`) : 3 langues (fr/ar/en), 200+ clés par langue, overrides par client via `i18nOverrides` dans la config JSON.
- **Network-first** dans le service worker : l'app vérifie d'abord le réseau, puis utilise le cache. Résout le problème des anciennes versions en cache.
- **clients/*.json exclus du cache** : toujours chargés depuis le réseau pour que Midenty puisse désactiver un client à distance.
- **Arabe rendu en canvas** pour les PDF (jsPDF) et l'impression thermique (ESC/POS). Police Amiri (Google Fonts) pour l'affichage écran.
- **Multi-tenant statique** : un seul déploiement, un JSON par client. Le code d'accès charge la config au login, la met en cache pour le hors-ligne.
- **Champs verrouillés vs éditables** : à chaque login, les infos école (nom, logo, couleurs) sont écrasées par le JSON serveur. Les champs éditables (classes, frais) ne sont appliqués qu'au premier login.
- **clients/index.json** : manifeste listant tous les codes clients. Mis à jour automatiquement par l'admin lors d'un push GitHub. Permet l'auto-chargement des clients sur un nouveau navigateur.
- **Déploiement admin → GitHub → Vercel** : quand un client est sauvegardé dans l'admin, le JSON est poussé sur GitHub via l'API (Personal Access Token), ce qui déclenche un redéploiement Vercel automatique (~1 min).
- **Types d'établissement** : champ `typeEtablissement` dans la config client (5 valeurs : `medersa`, `ecole_privee`, `universite_arabe`, `universite`, `centre_formation`). Choisi via menu déroulant dans l'admin (section Identité) ; sélectionner un type pré-remplit automatiquement classes/frais/couleurs/messages (`ESTABLISHMENT_PRESETS` dans `admin/admin.js`), uniquement à la création d'un nouveau client (pas en édition). Champ verrouillé côté app (modifiable uniquement par l'admin).
- **Année scolaire au format mois + année** : `debutAnnee`/`finAnnee` sont des objets `{ mois, annee }` (ex. `{ mois: 10, annee: 2025 }`) au lieu d'un simple numéro de mois. `CONFIG.normalizeSchoolYearField()` migre automatiquement l'ancien format (nombre seul) pour les clients existants. 4 sélecteurs (mois début / année début / mois fin / année fin) dans l'admin et dans les Paramètres de l'app.
- **i18n complet du panneau admin** (`admin/admin-i18n.js`) : mêmes 3 langues que l'app (fr/ar/en), sélecteur AR/FR/EN dans l'en-tête admin, support RTL. Attributs `data-i18n-admin` (distincts de `data-i18n` de l'app pour éviter les conflits).
- **Tableau de bord Statistiques** (`admin/stats.js`, onglet "Statistiques" dans la nav admin) : après sélection d'une école, écoute en temps réel les collections Firestore `schools/{code}/students`, `payments`, `attendance` (via `onSnapshot`). Affiche 4 cartes résumé (élèves, reçus, revenus, taux de présence), 4 graphiques Chart.js (élèves par classe, revenus mensuels, statut paiements, présence par classe) et des tableaux détaillés. **Nécessite que les règles de sécurité Firestore autorisent un admin authentifié à lire ces collections** — non encore fait, voir "Ce qui reste à faire".
- **Nouveau flux d'accueil de l'app** : Logo Midenty (intro ~4.5s) → écran de choix de langue (AR/FR/EN) → écran de message de bienvenue (traduit, ~2.5s auto) → écran logo de l'école + bouton "Entrer" → écran de saisie du code d'accès (en texte visible, plus masqué). Géré par `showSplash() → showLanguageSelect() → showWelcomeScreen() → showSchoolEntryScreen() → setupLogin()` dans `app/app.js`. Si une session est déjà active (`sessionStorage.medersa_logged_in`), tout ce parcours est sauté et l'app s'ouvre directement.

## Codes secrets

- **Codes d'accès clients** : `MEI-2026-EDU`, `ABRAR-2026-469`, `CFT-2026-TIL`
- **Code reset admin** : `MIDENTY-RESET-2026` (tap 5x sur "À propos" → saisir ce code → DEV ou RESET)
- **Panneau admin** : connexion Firebase Auth (email/mot de passe, pas de code fixe)
- **Token GitHub** : Personal Access Token configuré dans le panneau admin (section Paramètres)

## Règles de sécurité (non négociables)

- **Pas de suppression d'élèves** : seule la modification (nom, classe) est autorisée. Raison : un élève qui a payé ne doit jamais disparaître.
- **Reset en deux étapes** : tap 5x + code secret + confirmation. Seul Midenty connaît le code.
- **Infos école verrouillées** : le client ne peut pas modifier nom/logo/téléphones depuis l'app — seul Midenty via le panneau admin ou le panneau dev caché.
- **Vérification périodique** : l'app vérifie le statut du compte tous les 7 jours. Si le compte est désactivé, l'accès est bloqué.

## Préférences de travail de l'utilisateur

- **Ne sait pas coder** — il teste et prend les décisions produit. Toujours expliquer en français simple, sans jargon technique.
- **Ne pas mélanger les versions** — ne pas référencer l'historique des anciennes versions (V1/V2/V3), rester focalisé sur l'état actuel.
- **Toujours demander confirmation** avant de modifier un fichier existant qui fonctionne déjà.
- **Signaler clairement** si un changement demandé risque de casser quelque chose qui marche.
- **Tester visuellement** chaque changement dans le navigateur avant de le déclarer terminé.
- **Vérifier le code** avant d'écrire de la documentation : s'assurer que ce qui est décrit est réellement implémenté.
- **Modèle commercial** : vente unique par client (pas d'abonnement). Support via WhatsApp + vidéos tutos.
- **Vision ambitieuse** : Midenty n'est pas une petite app — c'est une plateforme panafricaine. Toujours penser grand dans les descriptions et les plans.

## Session du 16 juillet 2026 — Résumé

### Ce qui a été accompli

1. **Migration Netlify → Vercel** : crédits Netlify épuisés, impossible de déployer. App migrée sur Vercel (plan Hobby gratuit), connectée au repo GitHub pour auto-deploy.

2. **Renommage du projet** : `recu-medersa` → `midenty-edu`. Nouvelle URL : `midenty-edu.vercel.app`. Redirection 307 automatique depuis l'ancienne URL.

3. **Auto-chargement admin** : créé `clients/index.json` (manifeste des codes clients). Le panneau admin charge automatiquement les clients depuis les fichiers déployés quand le localStorage est vide (nouveau navigateur).

4. **Token GitHub** : ancien token perdu lors de la migration. Nouveau token créé et configuré dans le panneau admin.

5. **Guide PDF confidentiel** : réécriture complète de `docs/guide-confidentiel.html` avec 8 sections :
   - Présentation de Midenty (vision panafricaine)
   - Codes secrets et accès (3 clients, reset admin, Firebase Auth, token GitHub)
   - Utilisation de l'app (installation, 4 onglets, reçus, sauvegarde)
   - Panneau Admin (9 sections du formulaire, déploiement auto)
   - Comment l'app fonctionne (Firebase sync, hors-ligne, Vercel)
   - Vision future (5 types d'établissements, expansion Afrique, schéma visuel)
   - Version actuelle (fonctionnalités, sync, hébergement)
   - Support et contact
   - Inclut un schéma visuel dans le PDF (Midenty → 5 types → pays)

### Décisions prises

- **Vercel plutôt que Netlify** : gratuit, auto-deploy fiable, pas de limite de crédits sur le plan Hobby.
- **Redirection 307 (pas suppression)** : l'ancienne URL `recu-medersa.vercel.app` redirige vers la nouvelle, pour ne pas casser les liens existants des 2 clients en beta.
- **Pas d'historique V1/V2/V3 dans le guide** : l'utilisateur veut rester focalisé sur le présent et le futur, pas le passé.
- **Guide PDF = document vivant** : sera mis à jour à chaque évolution de la plateforme.

### Ce qui reste à faire (à cette date)

- [x] Guide PDF confidentiel : committé et déployé (fait dans une session antérieure)
- [x] Types d'établissements + presets, année scolaire mois+année, i18n admin, nouveau flux d'accueil, dashboard statistiques : tout implémenté (voir session du 17 juillet ci-dessous)

## Session du 17 juillet 2026 — Résumé

### Ce qui a été accompli

Refonte majeure en 4 phases (plan complet suivi à la lettre) :

1. **Panneau admin trilingue** (`admin/admin-i18n.js`, nouveau fichier) : ~200 clés fr/ar/en, sélecteur de langue AR/FR/EN, support RTL complet.
2. **Types d'établissements** : menu déroulant (5 types) dans le formulaire admin, pré-remplissage automatique des classes/frais/couleurs/messages à la création d'un client.
3. **Année scolaire mois + année** : migration du format (nombre de mois seul → `{ mois, annee }`), 4 sélecteurs dans l'admin et dans l'app, migration automatique rétrocompatible pour les clients existants.
4. **Tableau de bord Statistiques** (`admin/stats.js`, nouveau fichier) : nouvel onglet "Statistiques" dans l'admin, écoute Firestore temps réel par école, 4 graphiques Chart.js + cartes résumé + tableaux détaillés.
5. **Nouveau flux d'accueil de l'app** : Logo Midenty → choix de langue → message de bienvenue → logo école + bouton "Entrer" → code d'accès (en texte visible).
6. **Texte "À propos" centré** dans les 3 langues.
7. **Préfixe matricule retiré** des Paramètres de l'app (reste modifiable uniquement depuis l'admin).
8. **Version du service worker incrémentée** suite à tous ces changements.

Tout a été testé en direct dans le navigateur (flux complet de l'app du splash jusqu'à l'app principale avec un vrai code client, et chargement du panneau admin avec vérification des scripts/traductions/RTL).

### Décisions prises

- Le choix de la langue se fait maintenant **avant** la connexion (au tout début du parcours), et non plus après — la langue est donc déjà appliquée quand l'écran de bienvenue et l'écran de connexion s'affichent.
- Les presets de type d'établissement ne s'appliquent **qu'à la création** d'un nouveau client, jamais en modification d'un client existant (pour ne pas écraser une configuration déjà personnalisée).
- Migration de l'année scolaire faite de façon **rétrocompatible** : les anciens clients avec un format "mois seul" sont automatiquement convertis à la volée, sans script de migration manuel à lancer.

### Ce qui reste à faire

- [ ] **Rien n'a encore été committé/poussé sur GitHub** — tous les changements de cette session sont encore en local, à valider puis pousser sur `master` pour déclencher le déploiement Vercel.
- [ ] **Règles de sécurité Firestore à mettre à jour** : en testant le dashboard Statistiques, les lectures de `schools/{code}/students`, `payments`, `attendance` renvoient "permission-denied". Il faut adapter les règles Firestore pour qu'un admin authentifié (Firebase Auth) puisse lire ces collections pour n'importe quelle école — sinon les graphiques resteront vides en production.
- [ ] **Tester le flux complet sur téléphone** avec les 3 codes clients (`MEI-2026-EDU`, `ABRAR-2026-469`, `CFT-2026-TIL`) et les 3 langues, en conditions réelles (connexion instable, PWA installée).
- [ ] **Bug d'affichage préexistant repéré (non lié à cette session)** : dans l'en-tête de l'app, un badge rouge de synchronisation ("1") se superpose visuellement au nom de l'école. À corriger séparément.
- [ ] **Futures fonctionnalités** (vision long terme) : bulletins de notes, certificats, app mobile dédiée, multi-devises.

## Prochaines étapes prioritaires

1. Committer et pousser tous les changements de cette session sur GitHub (déclenche le déploiement Vercel).
2. Corriger les règles de sécurité Firestore pour que le dashboard Statistiques admin puisse lire les données de chaque école.
3. Tester le flux complet sur téléphone (3 langues, 3 codes clients, connexion instable).
