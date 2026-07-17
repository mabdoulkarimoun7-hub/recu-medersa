const STORAGE_KEY_PREFIX = "medersa_";
const KEYS = {
  students: STORAGE_KEY_PREFIX + "students",
  payments: STORAGE_KEY_PREFIX + "payments",
  lastNumber: STORAGE_KEY_PREFIX + "last_number",
  lastMatricule: STORAGE_KEY_PREFIX + "last_matricule",
  settings: STORAGE_KEY_PREFIX + "settings",
  lastExportAt: STORAGE_KEY_PREFIX + "last_export_at"
};

const SyncState = {
  SYNCED: "synced",
  PENDING: "pending",
  OFFLINE: "offline",
  DISABLED: "disabled",

  _current: "disabled",
  _listeners: [],

  get() { return this._current; },

  set(state) {
    if (this._current === state) return;
    this._current = state;
    this._listeners.forEach(fn => fn(state));
  },

  onChange(fn) {
    this._listeners.push(fn);
    fn(this._current);
  }
};

const Storage = {

  _firestoreListenersActive: false,

  initSync() {
    if (!isFirebaseReady()) {
      SyncState.set(SyncState.DISABLED);
      return;
    }

    const studentsPath = getSchoolCollectionPath("students");
    const paymentsPath = getSchoolCollectionPath("payments");
    if (!studentsPath || !paymentsPath) {
      SyncState.set(SyncState.DISABLED);
      return;
    }

    SyncState.set(SyncState.PENDING);

    this._listenToCollection(studentsPath, KEYS.students);
    this._listenToCollection(paymentsPath, KEYS.payments);
    this._listenToCounters();

    this._firestoreListenersActive = true;
  },

  _listenToCollection(path, localKey) {
    const db = getDb();
    db.collection(path)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        { includeMetadataChanges: true },
        (snapshot) => {
          const docs = [];
          snapshot.forEach(doc => docs.push({ ...doc.data(), _docId: doc.id }));

          localStorage.setItem(localKey, JSON.stringify(docs));

          const hasPending = snapshot.metadata.hasPendingWrites;
          const fromCache = snapshot.metadata.fromCache;

          if (hasPending) {
            SyncState.set(SyncState.PENDING);
          } else if (fromCache) {
            SyncState.set(SyncState.OFFLINE);
          } else {
            SyncState.set(SyncState.SYNCED);
          }
        },
        (err) => {
          console.error("Firestore listen error:", path, err);
          SyncState.set(SyncState.OFFLINE);
        }
      );
  },

  _listenToCounters() {
    const code = CONFIG.getClientCode();
    if (!code) return;
    const db = getDb();

    db.doc(`schools/${code}/meta/counters`).onSnapshot(
      (doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.lastNumber != null) {
            const local = parseInt(localStorage.getItem(KEYS.lastNumber) || "0", 10);
            if (data.lastNumber > local) {
              localStorage.setItem(KEYS.lastNumber, String(data.lastNumber));
            }
          }
          if (data.lastMatricule != null) {
            const local = parseInt(localStorage.getItem(KEYS.lastMatricule) || "0", 10);
            if (data.lastMatricule > local) {
              localStorage.setItem(KEYS.lastMatricule, String(data.lastMatricule));
            }
          }
        }
      },
      (err) => console.error("Firestore counters listen error:", err)
    );
  },

  _syncCounters() {
    if (!isFirebaseReady()) return;
    const code = CONFIG.getClientCode();
    if (!code) return;
    const db = getDb();

    db.doc(`schools/${code}/meta/counters`).set({
      lastNumber: parseInt(localStorage.getItem(KEYS.lastNumber) || "0", 10),
      lastMatricule: parseInt(localStorage.getItem(KEYS.lastMatricule) || "0", 10)
    }, { merge: true }).catch(err => console.error("Sync counters error:", err));
  },

  // ==================== Paramètres ====================

  getSettings() {
    return CONFIG.getSettings();
  },

  saveSettings(overrides) {
    const current = this.getSettings();
    const merged = { ...current, ...overrides };
    localStorage.setItem(KEYS.settings, JSON.stringify(merged));
    this._pushConfigToFirestore(merged);
  },

  _pushConfigToFirestore(settings) {
    if (!isFirebaseReady()) return;
    const path = getSchoolCollectionPath("config");
    if (!path) return;
    getDb().doc(path + "/settings").set({
      classes: settings.classes,
      fraisInscription: settings.fraisInscription,
      fraisMensuels: settings.fraisMensuels,
      modesPaiement: settings.modesPaiement,
      debutAnnee: settings.debutAnnee,
      finAnnee: settings.finAnnee,
      prefixeMatricule: settings.prefixeMatricule,
      devise: settings.devise,
      updatedAt: new Date().toISOString()
    }, { merge: true }).catch(err => console.error("Erreur sync config Firestore:", err));
  },

  // Lecture unique de la config éditable depuis Firestore (au démarrage de l'app).
  // Priorité : Firestore d'abord (source de vérité pour l'état courant),
  // JSON GitHub en secours si Firestore est inaccessible.
  async pullConfigFromFirestore() {
    if (!isFirebaseReady()) return false;
    const path = getSchoolCollectionPath("config");
    if (!path) return false;
    try {
      const doc = await getDb().doc(path + "/settings").get();
      if (!doc.exists) return false;
      const data = doc.data();
      const editableFields = [
        "classes", "fraisInscription", "fraisMensuels",
        "modesPaiement", "debutAnnee", "finAnnee",
        "prefixeMatricule", "devise"
      ];
      const overrides = {};
      editableFields.forEach(f => { if (data[f] !== undefined) overrides[f] = data[f]; });
      if (Object.keys(overrides).length > 0) {
        const current = this.getSettings();
        const merged = { ...current, ...overrides };
        localStorage.setItem(KEYS.settings, JSON.stringify(merged));
      }
      return true;
    } catch (err) {
      console.warn("Lecture config Firestore échouée (hors-ligne ?) :", err.message);
      return false;
    }
  },

  // ==================== Matricules ====================

  generateNextMatricule() {
    const settings = this.getSettings();
    const last = parseInt(localStorage.getItem(KEYS.lastMatricule) || "0", 10);
    const next = last + 1;
    localStorage.setItem(KEYS.lastMatricule, String(next));
    this._syncCounters();
    return settings.prefixeMatricule + "-" + String(next).padStart(3, "0");
  },

  peekNextMatricule() {
    const settings = this.getSettings();
    const last = parseInt(localStorage.getItem(KEYS.lastMatricule) || "0", 10);
    return settings.prefixeMatricule + "-" + String(last + 1).padStart(3, "0");
  },

  // ==================== Numérotation reçus ====================

  peekNextNumber() {
    const last = parseInt(localStorage.getItem(KEYS.lastNumber) || "0", 10);
    return this._formatNumber(last + 1);
  },

  commitNextNumber() {
    const last = parseInt(localStorage.getItem(KEYS.lastNumber) || "0", 10);
    const next = last + 1;
    localStorage.setItem(KEYS.lastNumber, String(next));
    this._syncCounters();
    return this._formatNumber(next);
  },

  _formatNumber(n) {
    const cfg = CONFIG.numerotation;
    const numStr = String(n).padStart(cfg.nombreChiffres, "0");
    const parts = [cfg.prefixe];
    if (cfg.inclureAnnee) parts.push(String(new Date().getFullYear()));
    parts.push(numStr);
    return parts.join("-");
  },

  // ==================== Élèves ====================

  getAllStudents() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.students) || "[]");
    } catch (e) {
      return [];
    }
  },

  saveStudent(student) {
    const all = this.getAllStudents();
    if (!student.id) student.id = "s" + Date.now() + Math.floor(Math.random() * 1000);
    if (!student.matricule) student.matricule = this.generateNextMatricule();
    all.unshift(student);
    localStorage.setItem(KEYS.students, JSON.stringify(all));

    if (isFirebaseReady()) {
      const path = getSchoolCollectionPath("students");
      if (path) {
        getDb().collection(path).doc(student.id).set(student)
          .catch(err => console.error("Firestore save student error:", err));
      }
    }

    return student;
  },

  updateStudent(id, data) {
    const all = this.getAllStudents();
    const idx = all.findIndex(s => s.id === id);
    if (idx === -1) return null;
    Object.assign(all[idx], data);
    localStorage.setItem(KEYS.students, JSON.stringify(all));

    if (isFirebaseReady()) {
      const path = getSchoolCollectionPath("students");
      if (path) {
        getDb().collection(path).doc(id).update(data)
          .catch(err => console.error("Firestore update student error:", err));
      }
    }

    return all[idx];
  },

  findStudentById(id) {
    return this.getAllStudents().find(s => s.id === id) || null;
  },

  findStudentByMatricule(matricule) {
    if (!matricule) return null;
    const needle = matricule.trim().toUpperCase();
    return this.getAllStudents().find(s =>
      s.matricule && s.matricule.toUpperCase() === needle
    ) || null;
  },

  getStudentsByClass(classe) {
    return this.getAllStudents().filter(s => s.classe === classe);
  },

  // ==================== Paiements ====================

  getAllPayments() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.payments) || "[]");
    } catch (e) {
      return [];
    }
  },

  savePayment(payment) {
    const all = this.getAllPayments();
    if (!payment.id) payment.id = "p" + Date.now() + Math.floor(Math.random() * 1000);
    if (!payment.numero) payment.numero = this.commitNextNumber();
    all.unshift(payment);
    localStorage.setItem(KEYS.payments, JSON.stringify(all));

    if (isFirebaseReady()) {
      const path = getSchoolCollectionPath("payments");
      if (path) {
        getDb().collection(path).doc(payment.id).set(payment)
          .catch(err => console.error("Firestore save payment error:", err));
      }
    }

    return payment;
  },

  getPaymentsByStudent(studentId) {
    return this.getAllPayments().filter(p => p.studentId === studentId);
  },

  getPaymentsByMonth(mois) {
    return this.getAllPayments().filter(p => p.type === "mensuel" && p.mois === mois);
  },

  isMonthPaid(studentId, mois) {
    return this.getAllPayments().some(
      p => p.studentId === studentId && p.type === "mensuel" && p.mois === mois
    );
  },

  isInscriptionPaid(studentId) {
    return this.getAllPayments().some(
      p => p.studentId === studentId && p.type === "inscription"
    );
  },

  getSchoolYearMonths() {
    const settings = this.getSettings();
    const start = settings.debutAnnee;
    const end = settings.finAnnee;
    const now = new Date();
    let year = now.getFullYear();
    if (now.getMonth() + 1 < start) year--;

    const months = [];
    let m = start;
    let y = year;
    while (true) {
      months.push({ key: `${y}-${String(m).padStart(2, "0")}`, mois: m, annee: y });
      if (m === end) break;
      m++;
      if (m > 12) { m = 1; y++; }
    }
    return months;
  },

  // ==================== Sauvegarde ====================

  daysSinceLastExport() {
    const ts = localStorage.getItem(KEYS.lastExportAt);
    if (!ts) return null;
    return Math.floor((Date.now() - parseInt(ts, 10)) / (1000 * 60 * 60 * 24));
  },

  exportBackup() {
    const data = {
      type: "medersa_backup",
      version: 4,
      exportedAt: new Date().toISOString(),
      lastNumber: parseInt(localStorage.getItem(KEYS.lastNumber) || "0", 10),
      lastMatricule: parseInt(localStorage.getItem(KEYS.lastMatricule) || "0", 10),
      students: this.getAllStudents(),
      payments: this.getAllPayments(),
      settings: this.getSettings()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sauvegarde_medersa_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    localStorage.setItem(KEYS.lastExportAt, String(Date.now()));
  },

  exportCsv() {
    const students = this.getAllStudents();
    const payments = this.getAllPayments();
    const settings = this.getSettings();

    const BOM = "﻿";
    let csv = BOM + "Matricule;Nom;Classe;Téléphone;Tél. parent;Date inscription;Inscription payée";

    const schoolMonths = this.getSchoolYearMonths();
    schoolMonths.forEach(m => {
      csv += ";" + m.key;
    });
    csv += "\n";

    students.forEach(s => {
      const inscPaid = this.isInscriptionPaid(s.id) ? "Oui" : "Non";
      let row = [
        s.matricule || "",
        (s.nom || "").replace(/;/g, ","),
        (s.classe || "").replace(/;/g, ","),
        s.telephone || "",
        s.telephoneParent || "",
        s.dateInscription || "",
        inscPaid
      ].join(";");

      schoolMonths.forEach(m => {
        row += ";" + (this.isMonthPaid(s.id, m.key) ? "Payé" : "-");
      });

      csv += row + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export_medersa_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  importBackup(data) {
    if (!data || data.type !== "medersa_backup") {
      throw new Error("Fichier de sauvegarde invalide.");
    }
    const currentLast = parseInt(localStorage.getItem(KEYS.lastNumber) || "0", 10);
    if ((data.lastNumber || 0) < currentLast) {
      throw new Error(
        `Numéro de séquence (${data.lastNumber}) inférieur au courant (${currentLast}). Import refusé.`
      );
    }
    localStorage.setItem(KEYS.lastNumber, String(data.lastNumber || 0));
    localStorage.setItem(KEYS.lastMatricule, String(data.lastMatricule || 0));
    localStorage.setItem(KEYS.students, JSON.stringify(data.students || []));
    localStorage.setItem(KEYS.payments, JSON.stringify(data.payments || []));
    if (data.settings) {
      localStorage.setItem(KEYS.settings, JSON.stringify(data.settings));
    }
    localStorage.setItem(KEYS.lastExportAt, String(Date.now()));

    if (isFirebaseReady()) {
      this._uploadAllToFirestore(data.students || [], data.payments || []);
    }
  },

  _uploadAllToFirestore(students, payments) {
    const db = getDb();
    const code = CONFIG.getClientCode();
    if (!db || !code) return;

    const batch = db.batch();
    const studentsPath = `schools/${code}/students`;
    const paymentsPath = `schools/${code}/payments`;

    students.forEach(s => {
      batch.set(db.collection(studentsPath).doc(s.id), s);
    });

    payments.forEach(p => {
      batch.set(db.collection(paymentsPath).doc(p.id), p);
    });

    batch.set(db.doc(`schools/${code}/meta/counters`), {
      lastNumber: parseInt(localStorage.getItem(KEYS.lastNumber) || "0", 10),
      lastMatricule: parseInt(localStorage.getItem(KEYS.lastMatricule) || "0", 10)
    }, { merge: true });

    batch.commit()
      .then(() => console.log("Import synchronisé avec Firestore."))
      .catch(err => console.error("Erreur sync import Firestore:", err));
  },

  // ==================== Reset admin ====================

  resetAllData() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));

    if (isFirebaseReady()) {
      const code = CONFIG.getClientCode();
      if (code) {
        console.log("Note : les données Firestore pour", code, "ne sont pas supprimées automatiquement.");
      }
    }
  }
};
