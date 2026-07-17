const CONFIG_DEFAULTS = {
  nomFr: "Médersa d'Éducation Islamique",
  nomAr: "مدرسة التربية الإسلامية",
  adresse: "Niamey - Lossogoungou",
  telephones: ["+227 91 27 33 07", "+227 96 06 28 28"],
  logo: "assets/logo.png",
  typeEtablissement: "medersa",

  classes: [],
  fraisInscription: 5000,
  fraisMensuels: 5000,

  debutAnnee: { mois: 10, annee: 2025 },
  finAnnee: { mois: 7, annee: 2026 },

  prefixeMatricule: "MEI",
  devise: "FCFA",

  modesPaiement: ["Espèces", "Mynita", "Amanata"],

  messageFinalFr: "Que le Coran soit une lumière pour vous",
  messageFinalAr: "ليكن القرآن نوراً لكم",

  couleurPrincipale: "#0d7a3d",
  couleurSecondaire: "#0b3d91",
  couleurAccent: "#c5972c"
};

const CONFIG = {
  codeResetAdmin: "MIDENTY-RESET-2026",

  imprimante: { largeurMM: 58, colonnes: 32 },

  numerotation: { prefixe: "REC", inclureAnnee: true, nombreChiffres: 4 },

  entreprise: {
    nom: "Midenty",
    telephone: "+227 88 81 10 81",
    copyright: "© Midenty — Tous droits réservés"
  },

  getSettings() {
    const saved = localStorage.getItem("medersa_settings");
    const overrides = saved ? JSON.parse(saved) : {};
    const merged = { ...CONFIG_DEFAULTS, ...overrides };
    merged.debutAnnee = CONFIG.normalizeSchoolYearField(merged.debutAnnee);
    merged.finAnnee = CONFIG.normalizeSchoolYearField(merged.finAnnee, merged.debutAnnee);
    return merged;
  },

  // Convertit l'ancien format (mois seul, ex: 10) vers { mois, annee }
  normalizeSchoolYearField(val, refDebut) {
    if (val && typeof val === "object" && val.mois && val.annee) return val;
    const mois = typeof val === "number" ? val : (refDebut ? refDebut.mois : 10);
    let annee;
    if (refDebut) {
      annee = mois < refDebut.mois ? refDebut.annee + 1 : refDebut.annee;
    } else {
      const now = new Date();
      annee = (now.getMonth() + 1 < mois) ? now.getFullYear() - 1 : now.getFullYear();
    }
    return { mois, annee };
  },

  async loadClientConfig(code) {
    const cacheKey = "medersa_client_config";
    const cacheCodeKey = "medersa_client_code";

    try {
      const resp = await fetch("clients/" + encodeURIComponent(code) + ".json");
      if (!resp.ok) throw new Error("not_found");
      const cfg = await resp.json();
      if (!cfg.actif) throw new Error("inactive");

      const previousCode = localStorage.getItem(cacheCodeKey);
      if (previousCode && previousCode !== code) {
        localStorage.removeItem("medersa_settings");
        localStorage.removeItem("medersa_lang");
        localStorage.removeItem("medersa_i18n_overrides");
      }

      localStorage.setItem(cacheKey, JSON.stringify(cfg));
      localStorage.setItem(cacheCodeKey, code);
      return cfg;
    } catch (err) {
      if (err.message === "inactive") throw err;
      const cached = localStorage.getItem(cacheKey);
      const cachedCode = localStorage.getItem(cacheCodeKey);
      if (cached && cachedCode === code) return JSON.parse(cached);
      throw new Error("not_found");
    }
  },

  applyClientConfig(cfg) {
    const lockedFields = [
      "nomFr", "nomAr", "adresse", "telephones", "logo",
      "couleurPrincipale", "couleurSecondaire", "couleurAccent",
      "messageFinalFr", "messageFinalAr", "typeEtablissement",
      "modules", "forfait", "abonnement", "guideConfig"
    ];
    const initFields = [
      "classes", "fraisInscription", "fraisMensuels",
      "debutAnnee", "finAnnee", "prefixeMatricule", "devise",
      "modesPaiement"
    ];

    const current = localStorage.getItem("medersa_settings");
    const existing = current ? JSON.parse(current) : {};
    const isFirstLogin = !current;

    const overrides = {};
    lockedFields.forEach(f => { if (cfg[f] !== undefined) overrides[f] = cfg[f]; });
    if (isFirstLogin) {
      initFields.forEach(f => { if (cfg[f] !== undefined) overrides[f] = cfg[f]; });
    }

    const merged = { ...existing, ...overrides };
    localStorage.setItem("medersa_settings", JSON.stringify(merged));

    if (cfg.i18nOverrides && typeof I18n !== "undefined") {
      localStorage.setItem("medersa_i18n_overrides", JSON.stringify(cfg.i18nOverrides));
      I18n.setOverrides(cfg.i18nOverrides);
    }
  },

  getClientCode() {
    return localStorage.getItem("medersa_client_code") || null;
  }
};
