/*
 * Firebase Configuration — Midenty
 *
 * INSTRUCTIONS : Remplacez les valeurs "VOTRE_..." par celles de votre projet Firebase.
 * Pour les obtenir : console.firebase.google.com → votre projet → Paramètres → Configuration SDK
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA4c1cFNg1qfo3JmoBCsbbysscTU7gXxCg",
  authDomain: "midenty-medersa.firebaseapp.com",
  projectId: "midenty-medersa",
  storageBucket: "midenty-medersa.firebasestorage.app",
  messagingSenderId: "633017547569",
  appId: "1:633017547569:web:2ad27141c649cb22958e10"
};

let _firebaseApp = null;
let _firebaseDb = null;
let _firebaseAuth = null;
let _firebaseReady = false;

function initFirebase() {
  if (_firebaseReady) return true;

  if (FIREBASE_CONFIG.apiKey === "VOTRE_API_KEY") {
    console.warn("Firebase non configuré — mode localStorage uniquement.");
    return false;
  }

  try {
    _firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    _firebaseDb = firebase.firestore();
    _firebaseAuth = firebase.auth();

    // Certains réseaux mobiles/proxys bloquent le streaming temps réel de Firestore
    // sans bloquer le reste d'internet — l'app reste alors bloquée en "Hors-ligne"
    // malgré une connexion internet fonctionnelle. Ce réglage bascule automatiquement
    // sur du long-polling compatible avec ces réseaux.
    _firebaseDb.settings({ experimentalAutoDetectLongPolling: true });

    _firebaseDb.enablePersistence({ synchronizeTabs: true }).catch(err => {
      if (err.code === "failed-precondition") {
        console.warn("Firestore persistence : plusieurs onglets ouverts, un seul peut synchroniser.");
      } else if (err.code === "unimplemented") {
        console.warn("Firestore persistence non supportée par ce navigateur.");
      }
    });

    _firebaseReady = true;
    console.log("Firebase initialisé avec succès.");
    return true;
  } catch (err) {
    console.error("Erreur initialisation Firebase :", err);
    return false;
  }
}

function getDb() {
  return _firebaseDb;
}

function getAuth() {
  return _firebaseAuth;
}

function isFirebaseReady() {
  return _firebaseReady;
}

function getSchoolCollectionPath(collection) {
  const code = CONFIG.getClientCode();
  if (!code) return null;
  return `schools/${code}/${collection}`;
}
