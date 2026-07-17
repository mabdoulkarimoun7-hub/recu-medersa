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
├── index.html              # Page d'entrée PWA (doit rester à la racine)
├── service-worker.js       # Cache v10, network-first, clients/*.json exclus du cache
├── manifest.json           # Fiche d'identité PWA
├── CLAUDE.md
│
├── app/                    # Code de l'application cliente
│   ├── app.js              # Logique : splash, login, inscription, classes, mensuel, paramètres
│   ├── config.js           # CONFIG_DEFAULTS + CONFIG (loadClientConfig, applyClientConfig, getSettings)
│   ├── storage.js          # Données : localStorage + sync Firestore (online/offline automatique)
│   ├── firebase-config.js  # Init Firebase, Firestore avec persistence hors-ligne
│   ├── i18n.js             # Système trilingue complet (fr/ar/en, 200+ clés par langue)
│   ├── style.css           # Design mobile-first, RTL arabe, splash, login, onglets, modals
│   ├── pdf-export.js       # Génération PDF/PNG, partage WhatsApp (arabe via canvas)
│   ├── print-escpos.js     # Impression thermique 58mm via RawBT (arabe en images)
│   └── qr-manager.js       # Génération QR (simplifié)
│
├── admin/                  # Panneau admin Midenty (accessible via /admin/)
│   ├── index.html          # Interface admin (login Firebase Auth, liste clients, formulaire 9 sections)
│   ├── admin.js            # CRUD clients, push GitHub auto, push index.json, import/export
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

### Ce qui reste à faire

- [ ] **Committer et pousser le guide PDF** (`docs/guide-confidentiel.html`) sur GitHub
- [ ] **Tester le guide PDF** : vérifier la génération complète, le schéma visuel, toutes les sections
- [ ] **Ajouter `typeEtablissement`** dans la config client : menu déroulant dans l'admin qui pré-remplit les réglages selon le type (médersa, école privée, université arabe, université, centre de formation)
- [ ] **Créer les presets de configuration** par type d'établissement (classes par défaut, frais, couleurs, labels)
- [ ] **Tester le flux complet sur téléphone** : admin → créer client → login client → app fonctionne → sync Firebase
- [ ] **Futures fonctionnalités** : bulletins de notes, certificats, tableaux de bord statistiques, app mobile dédiée, multi-devises

## Prochaines étapes prioritaires

1. Tester et pousser le guide PDF
2. Implémenter le système de types d'établissements (champ `typeEtablissement` + presets)
3. Tester la synchronisation Firebase sur téléphone avec connexion instable
