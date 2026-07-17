/* modules-manager.js — Activation/désactivation des onglets selon le forfait client. */

const MODULES_DEFAULTS = {
  inscription: true,
  classes: true,
  paiements: true,
  parametres: true,
  guide: true,
  presences: false,
  bulletins: false,
  attestations: false,
  dashboard: false,
  enseignants: false,
  historique: false
};

const ModulesManager = {
  _modules: { ...MODULES_DEFAULTS },

  FORFAIT_PRESETS: {
    essentiel: {
      inscription: true, classes: true, paiements: true, parametres: true, guide: true,
      presences: false, bulletins: false, attestations: false, dashboard: false,
      enseignants: false, historique: false
    },
    complet: {
      inscription: true, classes: true, paiements: true, parametres: true, guide: true,
      presences: true, bulletins: true, attestations: true, dashboard: true,
      enseignants: false, historique: false
    },
    premium: {
      inscription: true, classes: true, paiements: true, parametres: true, guide: true,
      presences: true, bulletins: true, attestations: true, dashboard: true,
      enseignants: true, historique: true
    }
  },

  init(clientConfig) {
    if (clientConfig && clientConfig.modules) {
      this._modules = { ...MODULES_DEFAULTS, ...clientConfig.modules };
    } else {
      this._modules = { ...MODULES_DEFAULTS };
    }
  },

  isActive(moduleName) {
    return this._modules[moduleName] === true;
  },

  getAll() {
    return { ...this._modules };
  },

  applyToDOM() {
    document.querySelectorAll("[data-module]").forEach(el => {
      const mod = el.getAttribute("data-module");
      if (!this.isActive(mod)) {
        el.remove();
      }
    });
  }
};
