/*
 * Admin Midenty — Panneau de gestion des clients
 * Authentification via Firebase Auth (email/mot de passe)
 *
 * INSTRUCTIONS : Remplacez les valeurs "VOTRE_..." par celles de votre projet Firebase.
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA4c1cFNg1qfo3JmoBCsbbysscTU7gXxCg",
  authDomain: "midenty-medersa.firebaseapp.com",
  projectId: "midenty-medersa",
  storageBucket: "midenty-medersa.firebasestorage.app",
  messagingSenderId: "633017547569",
  appId: "1:633017547569:web:2ad27141c649cb22958e10"
};

let _adminDb = null;
let _adminAuth = null;

function initAdminFirebase() {
  if (FIREBASE_CONFIG.apiKey === "VOTRE_API_KEY") {
    console.warn("Firebase non configuré — mode local uniquement.");
    return false;
  }
  try {
    const app = firebase.initializeApp(FIREBASE_CONFIG);
    _adminDb = firebase.firestore();
    _adminAuth = firebase.auth();
    return true;
  } catch (err) {
    console.error("Erreur Firebase admin:", err);
    return false;
  }
}

const STORAGE_KEY = "midenty_admin_clients";

let clients = [];
let editingCode = null;
let formClasses = [];
let formModes = ["Espèces", "Mynita", "Amanata"];
let logoBase64 = null;
let firebaseEnabled = false;

document.addEventListener("DOMContentLoaded", () => {
  firebaseEnabled = initAdminFirebase();
  loadClients();
  setupAdminLogin();
  setupListView();
  setupFormView();
});

function loadClients() {
  const raw = localStorage.getItem(STORAGE_KEY);
  clients = raw ? JSON.parse(raw) : [];
}

function saveClients() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

/* ==================== Authentification ==================== */

function setupAdminLogin() {
  const btn = document.getElementById("adminLoginBtn");
  const emailInput = document.getElementById("adminEmail");
  const passInput = document.getElementById("adminPassword");
  const error = document.getElementById("adminError");

  if (firebaseEnabled) {
    _adminAuth.onAuthStateChanged(user => {
      if (user) {
        document.getElementById("adminLogin").classList.add("hidden");
        document.getElementById("adminMain").classList.remove("hidden");
        renderClientsList();
      }
    });
  }

  const tryLogin = async () => {
    const email = emailInput.value.trim();
    const pass = passInput.value.trim();

    if (!email || !pass) {
      error.textContent = "Remplis l'email et le mot de passe.";
      error.style.display = "block";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Connexion...";
    error.style.display = "none";

    if (firebaseEnabled) {
      try {
        await _adminAuth.signInWithEmailAndPassword(email, pass);
        document.getElementById("adminLogin").classList.add("hidden");
        document.getElementById("adminMain").classList.remove("hidden");
        renderClientsList();
      } catch (err) {
        const messages = {
          "auth/user-not-found": "Aucun compte avec cet email.",
          "auth/wrong-password": "Mot de passe incorrect.",
          "auth/invalid-email": "Email invalide.",
          "auth/too-many-requests": "Trop de tentatives. Réessaie plus tard.",
          "auth/invalid-credential": "Email ou mot de passe incorrect."
        };
        error.textContent = messages[err.code] || "Erreur de connexion.";
        error.style.display = "block";
      }
    } else {
      error.textContent = "Firebase non configuré. Consultez le guide de configuration.";
      error.style.display = "block";
    }

    btn.disabled = false;
    btn.textContent = "Connexion";
  };

  btn.addEventListener("click", tryLogin);
  passInput.addEventListener("keydown", e => { if (e.key === "Enter") tryLogin(); });

  document.getElementById("btnLogout").addEventListener("click", async () => {
    if (firebaseEnabled) {
      await _adminAuth.signOut();
    }
    document.getElementById("adminMain").classList.add("hidden");
    document.getElementById("adminLogin").classList.remove("hidden");
    emailInput.value = "";
    passInput.value = "";
    error.style.display = "none";
  });
}

/* ==================== List View ==================== */

function setupListView() {
  document.getElementById("btnNewClient").addEventListener("click", () => openForm(null));
  document.getElementById("btnNewClientEmpty").addEventListener("click", () => openForm(null));
  document.getElementById("btnExportAll").addEventListener("click", exportAllClients);
  document.getElementById("importClients").addEventListener("change", handleImportClients);
}

function setupFormView() {
  document.getElementById("btnBackToList").addEventListener("click", showList);
  document.getElementById("btnCancelForm").addEventListener("click", showList);
  document.getElementById("btnGenerateCode").addEventListener("click", generateCode);
  document.getElementById("btnAddClasse").addEventListener("click", addClasseTag);
  document.getElementById("btnAddMode").addEventListener("click", addModeTag);
  document.getElementById("btnDownloadJson").addEventListener("click", downloadCurrentJson);
  document.getElementById("clientForm").addEventListener("submit", handleSaveClient);

  document.getElementById("cfgLogoFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      logoBase64 = reader.result;
      const img = document.getElementById("cfgLogoPreview");
      img.src = logoBase64;
      img.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("cfgNewClasse").addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); addClasseTag(); }
  });
  document.getElementById("cfgNewMode").addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); addModeTag(); }
  });
}

function renderClientsList() {
  const container = document.getElementById("clientsListContainer");
  if (clients.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Aucun client configuré.</p>
        <button class="btn btn-primary" id="btnNewClientEmpty2">+ Créer le premier client</button>
      </div>`;
    document.getElementById("btnNewClientEmpty2")?.addEventListener("click", () => openForm(null));
    return;
  }

  let html = `<table class="clients-table">
    <thead><tr>
      <th>Nom</th><th>Code d'accès</th><th>Statut</th><th>Créé le</th><th>Actions</th>
    </tr></thead><tbody>`;

  clients.forEach(c => {
    const badge = c.actif !== false
      ? '<span class="badge-active">Actif</span>'
      : '<span class="badge-inactive">Désactivé</span>';
    html += `<tr>
      <td><strong>${esc(c.nomFr)}</strong><br><span style="font-size:12px;color:#888">${esc(c.nomAr || "")}</span></td>
      <td><code>${esc(c.codeAcces)}</code></td>
      <td>${badge}</td>
      <td>${c.dateCreation || "-"}</td>
      <td>
        <button class="btn btn-sm btn-outline" data-edit="${esc(c.codeAcces)}">Modifier</button>
        <button class="btn btn-sm btn-danger" data-delete="${esc(c.codeAcces)}">Suppr.</button>
        <button class="btn btn-sm btn-secondary" data-download="${esc(c.codeAcces)}">JSON</button>
      </td>
    </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;

  container.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => openForm(btn.dataset.edit));
  });
  container.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => deleteClient(btn.dataset.delete));
  });
  container.querySelectorAll("[data-download]").forEach(btn => {
    btn.addEventListener("click", () => downloadClient(btn.dataset.download));
  });
}

function openForm(code) {
  editingCode = code;
  const form = document.getElementById("clientForm");
  form.reset();
  logoBase64 = null;
  document.getElementById("cfgLogoPreview").classList.add("hidden");

  if (code) {
    const c = clients.find(cl => cl.codeAcces === code);
    if (!c) return;
    document.getElementById("formTitle").textContent = "Modifier : " + c.nomFr;
    document.getElementById("cfgNomFr").value = c.nomFr || "";
    document.getElementById("cfgNomAr").value = c.nomAr || "";
    document.getElementById("cfgAdresse").value = c.adresse || "";
    document.getElementById("cfgTelephones").value = (c.telephones || []).join(", ");
    document.getElementById("cfgCouleurPrincipale").value = c.couleurPrincipale || "#0d7a3d";
    document.getElementById("cfgCouleurSecondaire").value = c.couleurSecondaire || "#0b3d91";
    document.getElementById("cfgCouleurAccent").value = c.couleurAccent || "#c5972c";
    document.getElementById("cfgCodeAcces").value = c.codeAcces;
    document.getElementById("cfgActif").value = String(c.actif !== false);
    document.getElementById("cfgFraisInscription").value = c.fraisInscription ?? 5000;
    document.getElementById("cfgFraisMensuels").value = c.fraisMensuels ?? 5000;
    document.getElementById("cfgDebutAnnee").value = c.debutAnnee ?? 10;
    document.getElementById("cfgFinAnnee").value = c.finAnnee ?? 7;
    document.getElementById("cfgPrefixeMatricule").value = c.prefixeMatricule || "MEI";
    document.getElementById("cfgDevise").value = c.devise || "FCFA";
    document.getElementById("cfgMessageFinalFr").value = c.messageFinalFr || "";
    document.getElementById("cfgMessageFinalAr").value = c.messageFinalAr || "";
    formClasses = [...(c.classes || [])];
    formModes = [...(c.modesPaiement || ["Espèces", "Mynita", "Amanata"])];
    if (c.logo && c.logo !== "assets/logo.png") {
      logoBase64 = c.logo;
      const img = document.getElementById("cfgLogoPreview");
      img.src = c.logo;
      img.classList.remove("hidden");
    }
  } else {
    document.getElementById("formTitle").textContent = "Nouveau client";
    formClasses = [];
    formModes = ["Espèces", "Mynita", "Amanata"];
  }

  renderClassesTags();
  renderModesTags();
  document.getElementById("listView").classList.add("hidden");
  document.getElementById("formView").classList.remove("hidden");
}

function showList() {
  document.getElementById("formView").classList.add("hidden");
  document.getElementById("listView").classList.remove("hidden");
  renderClientsList();
}

function buildClientObj() {
  const tels = document.getElementById("cfgTelephones").value
    .split(",").map(t => t.trim()).filter(Boolean);

  return {
    codeAcces: document.getElementById("cfgCodeAcces").value.trim().toUpperCase(),
    nomFr: document.getElementById("cfgNomFr").value.trim(),
    nomAr: document.getElementById("cfgNomAr").value.trim(),
    adresse: document.getElementById("cfgAdresse").value.trim(),
    telephones: tels,
    logo: logoBase64 || "assets/logo.png",
    couleurPrincipale: document.getElementById("cfgCouleurPrincipale").value,
    couleurSecondaire: document.getElementById("cfgCouleurSecondaire").value,
    couleurAccent: document.getElementById("cfgCouleurAccent").value,
    classes: [...formClasses],
    fraisInscription: parseInt(document.getElementById("cfgFraisInscription").value) || 0,
    fraisMensuels: parseInt(document.getElementById("cfgFraisMensuels").value) || 0,
    debutAnnee: parseInt(document.getElementById("cfgDebutAnnee").value),
    finAnnee: parseInt(document.getElementById("cfgFinAnnee").value),
    prefixeMatricule: document.getElementById("cfgPrefixeMatricule").value.trim() || "MEI",
    devise: document.getElementById("cfgDevise").value.trim() || "FCFA",
    modesPaiement: [...formModes],
    messageFinalFr: document.getElementById("cfgMessageFinalFr").value.trim(),
    messageFinalAr: document.getElementById("cfgMessageFinalAr").value.trim(),
    actif: document.getElementById("cfgActif").value === "true",
    dateCreation: editingCode
      ? (clients.find(c => c.codeAcces === editingCode)?.dateCreation || new Date().toISOString().slice(0, 10))
      : new Date().toISOString().slice(0, 10)
  };
}

function handleSaveClient(e) {
  e.preventDefault();
  const obj = buildClientObj();

  if (!obj.codeAcces || !obj.nomFr) {
    return toast("Le code d'accès et le nom français sont obligatoires.");
  }

  if (editingCode) {
    const idx = clients.findIndex(c => c.codeAcces === editingCode);
    if (idx >= 0) clients[idx] = obj;
  } else {
    if (clients.some(c => c.codeAcces === obj.codeAcces)) {
      return toast("Ce code d'accès existe déjà.");
    }
    clients.push(obj);
  }

  saveClients();
  toast("Client enregistré : " + obj.nomFr);
  showList();
}

function deleteClient(code) {
  if (!confirm("Supprimer le client " + code + " ?")) return;
  clients = clients.filter(c => c.codeAcces !== code);
  saveClients();
  renderClientsList();
  toast("Client supprimé.");
}

function downloadClient(code) {
  const c = clients.find(cl => cl.codeAcces === code);
  if (!c) return;
  downloadJson(c, c.codeAcces + ".json");
}

function downloadCurrentJson() {
  const obj = buildClientObj();
  if (!obj.codeAcces) return toast("Remplis le code d'accès d'abord.");
  downloadJson(obj, obj.codeAcces + ".json");
}

function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
  toast("Fichier téléchargé : " + filename);
}

function exportAllClients() {
  if (clients.length === 0) return toast("Aucun client à exporter.");
  clients.forEach(c => {
    downloadJson(c, c.codeAcces + ".json");
  });
  toast(clients.length + " fichier(s) exporté(s).");
}

function handleImportClients(e) {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  let imported = 0;
  let processed = 0;

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.codeAcces || !data.nomFr) throw new Error("Format invalide");
        const idx = clients.findIndex(c => c.codeAcces === data.codeAcces);
        if (idx >= 0) {
          clients[idx] = data;
        } else {
          clients.push(data);
        }
        imported++;
      } catch (err) {
        console.error("Import error:", file.name, err);
      }
      processed++;
      if (processed === files.length) {
        saveClients();
        renderClientsList();
        toast(imported + " client(s) importé(s).");
      }
    };
    reader.readAsText(file);
  });

  e.target.value = "";
}

function generateCode() {
  const prefixe = (document.getElementById("cfgPrefixeMatricule").value.trim() || "ECO").toUpperCase();
  const year = new Date().getFullYear();
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  document.getElementById("cfgCodeAcces").value = prefixe + "-" + year + "-" + suffix;
}

function addClasseTag() {
  const input = document.getElementById("cfgNewClasse");
  const name = input.value.trim();
  if (!name) return;
  if (formClasses.includes(name)) return toast("Classe déjà ajoutée.");
  formClasses.push(name);
  input.value = "";
  renderClassesTags();
}

function renderClassesTags() {
  const container = document.getElementById("cfgClassesTags");
  container.innerHTML = formClasses.map((c, i) =>
    `<span class="class-tag">${esc(c)} <button type="button" data-idx="${i}">&times;</button></span>`
  ).join("");
  container.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      formClasses.splice(parseInt(btn.dataset.idx), 1);
      renderClassesTags();
    });
  });
}

function addModeTag() {
  const input = document.getElementById("cfgNewMode");
  const name = input.value.trim();
  if (!name) return;
  if (formModes.includes(name)) return toast("Mode déjà ajouté.");
  formModes.push(name);
  input.value = "";
  renderModesTags();
}

function renderModesTags() {
  const container = document.getElementById("cfgModesTags");
  container.innerHTML = formModes.map((m, i) =>
    `<span class="class-tag">${esc(m)} <button type="button" data-idx="${i}">&times;</button></span>`
  ).join("");
  container.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      formModes.splice(parseInt(btn.dataset.idx), 1);
      renderModesTags();
    });
  });
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str ?? "";
  return d.innerHTML;
}

let toastTimeout;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove("visible"), 3500);
}
