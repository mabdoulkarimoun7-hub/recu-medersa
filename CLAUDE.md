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
│   ├── firebase-config.js  # Init Firebase, Firestore avec persistence hors-ligne, connexion anonyme
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
- **Tableau de bord Statistiques** (`admin/stats.js`, onglet "Statistiques" dans la nav admin) : après sélection d'une école, écoute en temps réel les collections Firestore `schools/{code}/students`, `payments`, `attendance` (via `onSnapshot`). Affiche 4 cartes résumé (élèves, reçus, revenus, taux de présence), 4 graphiques Chart.js (élèves par classe, revenus mensuels, statut paiements, présence par classe) et des tableaux détaillés. Fonctionne en production (vérifié avec un vrai client le 18 juillet 2026).
- **Nouveau flux d'accueil de l'app** : Logo Midenty (intro ~4.5s) → écran de choix de langue (AR/FR/EN) → écran de message de bienvenue (traduit, ~2.5s auto) → écran logo de l'école + bouton "Entrer" → écran de saisie du code d'accès (en texte visible, plus masqué). Géré par `showSplash() → showLanguageSelect() → showWelcomeScreen() → showSchoolEntryScreen() → setupLogin()` dans `app/app.js`. Si une session est déjà active (`sessionStorage.medersa_logged_in`), tout ce parcours est sauté et l'app s'ouvre directement.
- **Connexion Firebase anonyme obligatoire** (`app/firebase-config.js`, `initFirebase()`) : les règles Firestore exigent `request.auth != null`. L'app (contrairement à l'admin qui utilise Firebase Auth email/mot de passe) ne demande pas de compte à l'établissement — elle s'authentifie donc silencieusement via `signInAnonymously()` avant toute lecture/écriture. Sans ça, toute la synchronisation cloud échoue silencieusement (bug critique découvert et corrigé le 18 juillet 2026, voir session ci-dessous). Nécessite que le fournisseur "Anonymous" soit activé dans Firebase Console → Authentication → Sign-in method.
- **Numérotation reçus/matricules sécurisée par transaction Firestore** (`Storage._nextCounterValue()` dans `app/storage.js`) : l'attribution du prochain numéro passe par `db.runTransaction()` sur `schools/{code}/meta/counters` quand l'app est en ligne, pour garantir qu'aucun numéro n'est attribué deux fois si 2 appareils du même établissement l'utilisent en même temps. Repli sur le compteur local si hors-ligne. `Storage.saveStudent()` et `Storage.savePayment()` sont donc devenus `async`.
- **Synchronisation automatique intégrale, sans étape manuelle** (directive explicite de l'utilisateur le 18 juillet 2026 : *"il faut tout mettre en automatique quel qu'en soit les problèmes"*) : aussi bien dans le panneau admin que dans l'app cliente, les champs éditables (classes, frais, modes de paiement, année scolaire, préfixe, devise) sont désormais lus en direct depuis Firestore via `onSnapshot`, jamais via une action manuelle. Côté app : `Storage._listenToConfig()` dans `app/storage.js` (même principe que `Storage._listenToCounters()`), actif dès `initSync()`. Côté admin : `admin/realtime-sync.js` + `admin/admin.js` (`applyFirestoreConfigToForm`, `_firestoreSyncConfirmed`) bloque le bouton Enregistrer tant que les vraies données du client n'ont pas été chargées.
- **Un client "supprimé" n'est jamais vraiment effacé, seulement désactivé** (`admin/admin.js`, `deleteClient()`) : même principe que "pas de suppression d'élèves". Le bouton "Suppr." pousse `actif:false` sur le fichier `clients/{code}.json` de GitHub (donc bloque la connexion immédiatement, pas seulement au bout de 7 jours) au lieu de simplement retirer le client de la liste locale de l'admin — sinon le fichier restait actif sur GitHub/Vercel et le client pouvait continuer à se connecter indéfiniment.
- **`clients/index.json` toujours reconstruit depuis les vrais fichiers GitHub**, jamais depuis la mémoire locale d'un onglet admin (`fetchActualClientCodesFromGitHub()` dans `admin/admin.js`, utilisée par `pushClientsIndex()`) : si deux admins/onglets travaillent en parallèle, aucun ne peut plus faire disparaître un client du manifeste par écrasement.
- **Code d'accès verrouillé après création d'un client** (`cfgCodeAcces` en `readOnly` dans `admin/admin.js` `openForm()`, + vérification côté JS dans `handleSaveClient()`) : le modifier en édition pouvait auparavant écraser les données d'un tout autre client partageant le nouveau code, en contournant la protection de synchronisation Firestore (liée à l'ancien code). Pour renommer un code d'accès, il faut créer un nouveau client.
- **Paiements avec identifiant déterministe** (`Storage.savePayment()` dans `app/storage.js`) : l'id Firestore d'un paiement "mensuel" est `${studentId}_mensuel_${mois}` et celui d'une "inscription" est `${studentId}_inscription}`, au lieu d'un id aléatoire. Si 2 appareils enregistrent le même paiement avant de se synchroniser, le second écrase le premier au lieu de créer un doublon qui compterait l'argent deux fois.
- **Police arabe Amiri chargée explicitement avant tout rendu canvas** (`ensureArabicFontLoaded()` dans `app/pdf-export.js`, réutilisée dans `app/print-escpos.js`) : un `<canvas>` non affiché à l'écran ne déclenche pas lui-même le téléchargement d'une police web — sans `document.fonts.load()` explicite avant `fillText()`, un reçu généré/imprimé juste après l'ouverture de l'app (ou hors-ligne) pouvait figer le texte arabe dans la police de secours.
- **`googleapis.com` retiré des motifs de contournement du cache** (`service-worker.js`, `BYPASS_PATTERNS`) : ce motif générique bloquait aussi la feuille de style Google Fonts (`fonts.googleapis.com`) — indispensable au rendu de la police Amiri — de tout mise en cache, la rendant indisponible hors-ligne. Les exclusions Firebase spécifiques (`firestore.googleapis.com`, `identitytoolkit.googleapis.com`, `securetoken.googleapis.com`) restent en place.

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

- [x] Committer et pousser sur GitHub — fait le 18 juillet 2026 (voir session ci-dessous).
- [x] Règles de sécurité Firestore / permission-denied — fait le 18 juillet 2026 (voir session ci-dessous).
- [ ] **Tester le flux complet sur téléphone** avec les 3 codes clients (`MEI-2026-EDU`, `ABRAR-2026-469`, `CFT-2026-TIL`) et les 3 langues, en conditions réelles (connexion instable, PWA installée).
- [x] Badge rouge de synchronisation superposé au nom de l'école — corrigé le 18 juillet 2026.
- [ ] **Futures fonctionnalités** (vision long terme) : bulletins de notes, certificats, app mobile dédiée, multi-devises.

## Session du 17-18 juillet 2026 — Résumé (suite de la session du 17 juillet)

**Découverte critique** : l'app cliente ne s'authentifiait jamais auprès de Firebase (seul l'admin le fait, via email/mot de passe). Résultat : toute la synchronisation cloud échouait silencieusement en production depuis le début (masquée en "hors-ligne"), et le dashboard Statistiques ne recevait jamais rien. Corrigé par connexion anonyme automatique (voir "Décisions techniques").

Corrections apportées et vérifiées en production avec un vrai client (Médersa Al-Abrar) :
1. Connexion Firebase anonyme ajoutée (`app/firebase-config.js`).
2. Numérotation reçus/matricules sécurisée par transaction Firestore (`app/storage.js`, `app/app.js`).
3. Badge de synchronisation qui se superposait au nom de l'école — corrigé (`app/style.css`).

Actions manuelles faites par l'utilisateur sur la console Firebase : fournisseur "Anonymous" activé dans Authentication ; règles Firestore vérifiées déjà correctes (aucune republication nécessaire).

Tout committé et poussé sur `master` (service worker → v17). Vérifié en ligne sur `midenty-edu.vercel.app` : version déployée à jour, dashboard Statistiques testé avec un vrai client et données réelles remontées correctement.

## Session du 18 juillet 2026 (suite) — Audit technique complet avant vente réelle

**Déclencheur** : après la correction du bug des classes effacées d'Abrar (voir ci-dessus) et la directive "tout doit être automatique", l'utilisateur a demandé un audit complet du code pour trouver d'autres bugs du même genre avant de vendre la plateforme à de vrais clients. 3 audits ont tourné en parallèle (panneau admin/déploiement, synchronisation/stockage, application cliente/reçus) et ont remonté 6 problèmes critiques/importants et 5 problèmes moyens/mineurs. L'utilisateur a demandé de **tout corriger immédiatement** ("Corrige TOUS maintenant").

### Corrigé dans cette session (voir aussi "Décisions techniques" ci-dessus)

1. **Panneau admin — code d'accès modifiable en édition** (pouvait écraser un autre client + contourner la protection Firestore du 18 juillet) : champ verrouillé après création. `admin/admin.js`, `admin/index.html`.
2. **Panneau admin — "Supprimer" ne bloquait pas vraiment l'accès du client** : transformé en désactivation réelle (`actif:false` poussé sur GitHub). `admin/admin.js`.
3. **Panneau admin — `clients/index.json` pouvait perdre des clients** si deux onglets/admins travaillaient en parallèle : reconstruit à chaque fois depuis les vrais fichiers GitHub. `admin/admin.js`.
4. **Panneau admin — aucune validation du format du code d'accès** (espaces/caractères spéciaux pouvaient casser un déploiement) : regex `[A-Za-z0-9-]+` ajoutée (HTML + JS). `admin/admin.js`, `admin/index.html`.
5. **Panneau admin — échecs silencieux** : échec de mise à jour du manifeste après déploiement désormais signalé par un toast ; listener Firestore arrêté aussi en quittant le formulaire par le menu du haut (pas seulement par "Retour"). `admin/admin.js`.
6. **App cliente — classes/frais pouvaient être écrasés depuis l'app elle-même** (même famille de bug que celui de l'admin, mais côté app : une tablette restée ouverte pendant qu'un autre appareil ou l'admin modifie les réglages écrasait leurs changements) : ajout d'un écouteur temps réel `Storage._listenToConfig()`, même principe que pour les compteurs de reçus. `app/storage.js`.
7. **App cliente — paiements mensuels/inscription potentiellement comptés deux fois** si 2 appareils hors-ligne enregistraient le même paiement avant synchronisation : identifiant déterministe par élève+mois (ou élève+inscription) au lieu d'un identifiant aléatoire. `app/storage.js`.
8. **App cliente — le compteur de reçus pouvait reculer** dans de rares cas de repli hors-ligne, ouvrant un risque de doublon de numéro : le repli lit désormais la valeur distante connue et ne garde que le maximum. `app/storage.js`.
9. **App cliente — deux appareils marquant la présence de la même classe le même jour s'écrasaient silencieusement** : un avertissement de confirmation s'affiche désormais si une présence existe déjà pour cette classe/date avant de la refaire. `app/attendance.js`, nouvelle clé i18n `msg_attendance_already_exists`.
10. **App cliente — échecs d'enregistrement jamais signalés** (l'app disait "enregistré" même quand la sauvegarde en ligne échouait vraiment) : avertissement toast (limité à 1 fois/15s) sur échec réel d'écriture Firestore pour élèves/paiements. `app/storage.js`, nouvelle clé i18n `msg_sync_write_error`.
11. **Reçus — texte arabe pouvait s'imprimer dans la mauvaise police** si le reçu était généré juste après l'ouverture de l'app ou hors-ligne (la police Amiri n'avait pas fini de charger) : attente explicite du chargement de la police avant tout dessin sur canvas. `app/pdf-export.js` (nouvelle fonction `ensureArabicFontLoaded`), `app/print-escpos.js`.
12. **Reçus hors-ligne — la police Amiri ne pouvait jamais se mettre en cache** à cause d'un motif de contournement du service worker trop large (`googleapis.com` bloquait aussi `fonts.googleapis.com`) : motif retiré, exclusions Firebase spécifiques conservées. `service-worker.js` (cache → v19).
13. **Restauration de sauvegarde sans vérification de fraîcheur** : `Storage.importBackup()` refuse désormais l'import si des élèves/paiements/présences plus récents que la date de la sauvegarde existent déjà localement (comparaison via `createdAt`, nouvelle fonction `Storage._newestRecordTimestamp()`), pour ne pas écraser des données créées ailleurs depuis. `app/storage.js`. Testé en preview : sauvegarde plus ancienne → import bloqué avec message clair ; sauvegarde plus récente → import accepté normalement.
14. **Aucun avertissement avant "Réinitialiser" (reset admin)** : si `SyncState` est `pending` ou `offline` au moment de taper RESET dans le panneau dev caché, une confirmation supplémentaire prévient que des données non synchronisées seront perdues, avant la confirmation finale. `app/app.js`, nouvelle clé i18n `txt_reset_unsynced_warning` (fr/ar/en).

### Tests effectués (session suivante, avec un vrai compte : MD-2026-420 "MIDENTY", compte de démo interne repéré dans `clients/index.json`, choisi pour ne pas polluer les données des 3 vrais clients payants — rappel : les élèves ne peuvent jamais être supprimés)

- ✅ Inscription d'un élève avec nom en écriture arabe → reçu généré (REC-2026-0001), export PDF réussi (6,9 Mo) sans erreur de police.
- ✅ Paiement mensuel (recherche par matricule, sélection du mois, génération du reçu REC-2026-0002).
- ✅ Doublon d'appel de présence (même classe, même date) → avertissement affiché (point 9 de l'audit) ; annulé si refusé, refait normalement si accepté.
- ✅ Aucune erreur dans la console du navigateur sur l'ensemble de ces parcours.
- Les points 13 et 14 (import de sauvegarde, avertissement reset) avaient déjà été testés en isolation dans la session précédente (fonctions appelées directement, sans compte réel).
- **Non testé** : édition/suppression d'un client dans le panneau admin — nécessite une vraie connexion Firebase Auth (identifiants non disponibles pour Claude) et déclenche un vrai push GitHub + déploiement Vercel à chaque sauvegarde ; l'utilisateur a choisi de le tester lui-même plutôt que de le faire tester par Claude.

### À reprendre dans la prochaine session

1. L'utilisateur teste lui-même l'admin (édition/suppression d'un client) quand il en a l'occasion.
2. Tester le flux complet sur téléphone (3 langues, 3 codes clients, connexion instable, PWA installée).
3. Revoir le périmètre de fonctionnalités de la "pré-version" avec l'utilisateur (voir mémoire `prelaunch-blockers`).

## Prochaines étapes prioritaires

1. Tester le flux complet sur téléphone (3 langues, 3 codes clients, connexion instable, PWA installée).
2. Revoir le périmètre de fonctionnalités de la "pré-version" avec l'utilisateur (voir mémoire `prelaunch-blockers`).
3. Tester l'admin (édition/suppression d'un client) — à faire par l'utilisateur lui-même.
