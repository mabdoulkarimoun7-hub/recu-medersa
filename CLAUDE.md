# Gestion Médersa — Application Midenty

## Description

Application PWA de gestion pour écoles coraniques au Niger, développée pour **Midenty** (+227 88 81 10 81, mabdoulkarimoun7@gmail.com). Gère les inscriptions d'élèves, le suivi des paiements mensuels, et la génération de reçus (PDF, PNG, WhatsApp, impression thermique Bluetooth). Interface bilingue arabe/français.

Initialement construite pour un seul client, l'app évolue vers un **système multi-clients** : une seule URL Netlify dessert toutes les écoles, chaque client ayant sa propre configuration (nom, logo, couleurs, frais) chargée via un code d'accès.

## Historique des versions

- **V1** : Prototype simple — formulaire de reçu avec champs manuels, export PDF/PNG, impression ESC/POS via RawBT.
- **V2** : Ajout du registre d'élèves, scanner QR, design modernisé, motifs de paiement avec prix automatiques.
- **V3** : Refonte complète — splash screen, login par code d'accès, 4 onglets bilingues (Inscription, Classes, Frais mensuels, Paramètres), système de matricules séquentiels (MEI-001...), grille de mois pour paiements, reçus d'inscription et mensuels, sauvegarde/restauration JSON, reset admin sécurisé (tap 5x + code).
- **V4 (en cours)** : Système multi-clients. Login dynamique via `fetch("clients/{code}.json")`, panneau admin Midenty pour créer/gérer les configs clients. Déploiement Netlify à faire.

## Structure du projet

```
recu-medersa/
├── index.html              # Page d'entrée de l'app (doit rester à la racine pour la PWA)
├── service-worker.js       # Moteur hors-ligne (doit rester à la racine pour la PWA)
├── manifest.json           # Fiche d'identité PWA (doit rester à la racine)
├── CLAUDE.md
│
├── app/                    # Code de l'application cliente
│   ├── app.js              # Logique : splash, login dynamique, inscription, classes, mensuel, paramètres
│   ├── config.js           # CONFIG_DEFAULTS + CONFIG (loadClientConfig, applyClientConfig, getSettings)
│   ├── storage.js          # localStorage : élèves, paiements, matricules, settings, backup
│   ├── style.css           # Design mobile-first, bilingue, splash, login, onglets, modals
│   ├── pdf-export.js       # Génération PDF/PNG, partage WhatsApp (arabe via canvas)
│   ├── print-escpos.js     # Impression thermique 58mm via RawBT (arabe en images)
│   └── qr-manager.js       # Génération QR (simplifié)
│
├── admin/                  # Panneau admin Midenty (accessible via /admin/)
│   ├── index.html          # Interface admin (login, liste clients, formulaire CRUD)
│   ├── admin.js            # Logique : CRUD clients, import/export JSON
│   └── admin.css           # Styles du panneau admin
│
├── clients/                # Un fichier JSON par client
│   └── MEI-2026-EDU.json   # Config du premier client (Médersa d'Éducation Islamique)
│
├── assets/                 # Images et icônes
│   ├── logo.png            # Logo par défaut
│   ├── icon-192.png        # Icône PWA
│   └── icon-512.png        # Icône PWA
│
└── docs/                   # Documentation
    └── guide-confidentiel.html  # Page standalone qui génère un PDF guide avec codes secrets
```

## Décisions techniques

- **Zéro backend** : tout est statique (HTML/JS/CSS + JSON). Hébergement gratuit sur Netlify.
- **localStorage** pour toutes les données (élèves, paiements, settings). Chaque appareil a ses propres données — pas de synchronisation entre appareils (choix délibéré pour fonctionner 100% hors-ligne).
- **Network-first** dans le service worker : l'app vérifie d'abord le réseau, puis utilise le cache. Résout le problème des anciennes versions qui restaient en cache.
- **clients/*.json exclus du cache** : toujours chargés depuis le réseau pour que Midenty puisse désactiver un client à distance.
- **Arabe rendu en canvas** pour les PDF (jsPDF) et l'impression thermique (ESC/POS) car ces technologies ne supportent pas l'arabe nativement. Police Amiri (Google Fonts) pour l'affichage écran.
- **Multi-tenant statique** : un seul déploiement, un JSON par client. Le code d'accès du client charge sa config au login, la stocke en localStorage, puis l'app fonctionne hors-ligne.
- **Champs verrouillés vs éditables** : à chaque login, les infos école (nom, logo, couleurs) sont écrasées par le JSON serveur. Les champs éditables (classes, frais) ne sont appliqués qu'au premier login — après, le client les gère localement.

## Codes secrets

- **Code d'accès client 1** : `MEI-2026-EDU`
- **Code reset admin** : `MIDENTY-RESET-2026` (tap 5x sur "À propos" → saisir ce code → DEV ou RESET)
- **Mot de passe panneau admin** : `MIDENTY-ADMIN-2026`

## Règles de sécurité (non négociables)

- **Pas de suppression d'élèves** : seule la modification (nom, classe) est autorisée. Raison : un élève qui a payé ne doit jamais disparaître.
- **Reset en deux étapes** : tap 5x + code secret + confirmation. Seul Midenty connaît le code.
- **Infos école verrouillées** : le client ne peut pas modifier nom/logo/téléphones depuis l'app — seul Midenty via le panneau admin ou le panneau dev caché.

## Préférences de travail de l'utilisateur

- **Ne sait pas coder** — il teste et prend les décisions produit. Toujours expliquer en français simple, sans jargon.
- **Toujours demander confirmation** avant de modifier un fichier existant qui fonctionne déjà.
- **Signaler clairement** si un changement demandé risque de casser quelque chose qui marche.
- **Tester visuellement** chaque changement dans le navigateur avant de le déclarer terminé.
- **Modèle commercial** : vente unique (pas d'abonnement). Support via WhatsApp + vidéos tutos.

## Prochaines étapes

- [ ] Déploiement : créer repo GitHub + connecter à Netlify
- [ ] Tester le flux complet en ligne (admin → créer client → login client → app fonctionne)
- [ ] Futures apps prévues : écoles privées, commerçants (même architecture, templates différents)
