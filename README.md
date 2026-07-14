# Reçus — Médersa d'Éducation Islamique (V1 pilote)

## 1. Avant de déployer : remplacer les images

Le dossier `assets/` contient pour l'instant des **images de remplacement** (fond vert "LOGO A REMPLACER", fond blanc "CACHET A REMPLACER"). À remplacer par les vraies images avant la mise en service :

- `assets/logo.png` → le logo de la médersa (idéalement fond transparent, carré)
- `assets/cachet.png` → le sceau bleu "Direction Générale" avec signature
- `assets/icon-192.png` et `assets/icon-512.png` → icônes de l'app (peuvent être une version simplifiée du logo, carrée, sans texte trop petit)

Il suffit de remplacer les fichiers en gardant exactement les mêmes noms — rien d'autre à toucher dans le code.

## 2. Déployer sur Netlify

1. Va sur [app.netlify.com](https://app.netlify.com) → "Add new site" → "Deploy manually"
2. Glisse-dépose le dossier `recu-medersa` complet (avec `assets/` à l'intérieur)
3. Netlify te donne un lien du type `nom-au-hasard.netlify.app` — tu peux le renommer dans les réglages du site
4. Le site est en HTTPS automatiquement (obligatoire pour que le Bluetooth et l'installation PWA fonctionnent)

## 3. Installer l'app sur le téléphone du commerçant/de l'école

1. Ouvrir le lien Netlify dans **Chrome sur Android**
2. Une bannière "Installer" doit apparaître dans l'app (ou menu ⋮ → "Ajouter à l'écran d'accueil")
3. Une fois installée, l'app fonctionne comme une app normale, avec son icône

## 4. Tester l'impression thermique (obligatoire avant mise en service réelle)

Deux boutons d'impression sont disponibles sur chaque reçu :

- **Bluetooth** → tentative de connexion directe (fonctionne si l'imprimante est en Bluetooth Low Energy). Un sélecteur d'appareil Bluetooth du téléphone doit s'ouvrir.
- **RawBT** → nécessite l'app gratuite **RawBT** installée une seule fois depuis le Play Store. Après installation, RawBT s'ouvre automatiquement et gère l'impression, quel que soit le type de Bluetooth de l'imprimante (c'est la solution qui couvre le plus de modèles).

**Étapes de test sur le terrain :**
1. Jumeler l'imprimante avec le téléphone via les réglages Bluetooth Android normaux, une fois
2. Essayer le bouton "Bluetooth" d'abord
3. Si rien ne se passe ou si ça échoue → installer RawBT, réessayer avec le bouton "RawBT"
4. Vérifier que le logo et le cachet s'impriment lisiblement (leur taille est calibrée pour du 58mm mais peut nécessiter un ajustement selon le modèle exact — dis-moi ce que tu observes et j'ajuste `LOGO_WIDTH_DOTS` / `CACHET_WIDTH_DOTS` dans `print-escpos.js`)

## 5. Sauvegardes — à répéter régulièrement

Les reçus et le numéro de séquence sont stockés **uniquement sur l'appareil**, dans le navigateur. Il n'y a pas de serveur central en V1.

- Exporter une sauvegarde (onglet Réglages) au moins une fois par semaine, et systématiquement avant de changer de téléphone
- Un bandeau d'alerte rouge apparaît automatiquement dans l'app si aucun export n'a été fait depuis 7 jours

## 6. Limites connues de cette V1 (déjà actées avec l'entrepreneur)

- **iPhone** : l'impression Bluetooth ne fonctionne pas (limitation de Safari/iOS). PDF, image et partage WhatsApp restent disponibles.
- **Un seul appareil par client** : si l'école utilise l'app sur deux téléphones différents, la numérotation des reçus n'est pas synchronisée entre les deux (chacun aura sa propre séquence). Nécessiterait un backend pour être résolu — hors scope V1.
- **Reconnexion Bluetooth directe** : avec le bouton "Bluetooth", il faut relancer la connexion à chaque session (limite du Web Bluetooth du navigateur). Le bouton "RawBT" n'a pas cette limite une fois configuré dans RawBT.
