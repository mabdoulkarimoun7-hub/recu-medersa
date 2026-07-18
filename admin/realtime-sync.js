/*
 * realtime-sync.js — Synchronisation temps réel Firestore <-> panneau admin <-> GitHub.
 *
 * Le panneau admin lit en temps réel schools/{code}/config/settings pour voir
 * l'état actuel exact de la configuration éditable d'un client (classes, frais,
 * modes de paiement, année scolaire), même si le client l'a modifiée lui-même
 * depuis son application. Le JSON GitHub reste la source de vérité pour le
 * déploiement ; Firestore est la source de vérité pour l'état courant.
 */

let _configUnsubscribe = null;
let _latestFirestoreConfig = null;

const FIRESTORE_EDITABLE_FIELDS = [
  "classes", "fraisInscription", "fraisMensuels",
  "modesPaiement", "debutAnnee", "finAnnee",
  "prefixeMatricule", "devise"
];

function startConfigListener(code, onUpdate) {
  stopConfigListener();
  if (!firebaseEnabled || !code) { onUpdate(null, "no-firebase"); return; }
  _configUnsubscribe = _adminDb.doc(`schools/${code}/config/settings`).onSnapshot(
    doc => {
      _latestFirestoreConfig = doc.exists ? doc.data() : null;
      onUpdate(_latestFirestoreConfig, null);
    },
    err => {
      console.error("Erreur écoute config Firestore:", err);
      onUpdate(null, err);
    }
  );
}

function stopConfigListener() {
  if (_configUnsubscribe) {
    _configUnsubscribe();
    _configUnsubscribe = null;
  }
  _latestFirestoreConfig = null;
}

async function pushConfigToFirestore(code, settings) {
  if (!firebaseEnabled || !code) return;
  try {
    const data = {};
    FIRESTORE_EDITABLE_FIELDS.forEach(f => { if (settings[f] !== undefined) data[f] = settings[f]; });
    data.updatedAt = new Date().toISOString();
    await _adminDb.doc(`schools/${code}/config/settings`).set(data, { merge: true });
  } catch (err) {
    console.error("Erreur push config Firestore:", err);
  }
}

