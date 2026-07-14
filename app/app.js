/* app.js — logique principale V3 (gestion scolaire bilingue). */

let currentReceipt = null;
let currentReceiptEl = null;
let deferredInstallPrompt = null;

const MONTH_NAMES_FR = ["", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MONTH_NAMES_AR = ["", "يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

document.addEventListener("DOMContentLoaded", () => {
  showSplash();
  setupInstallBanner();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(err =>
      console.error("SW registration failed", err)
    );
  }
});

/* ==================== Splash & Login ==================== */

function showSplash() {
  const s = CONFIG.getSettings();
  document.getElementById("splashNameAr").textContent = s.nomAr;
  document.getElementById("splashNameFr").textContent = s.nomFr;

  setTimeout(() => {
    document.getElementById("splashScreen").classList.add("fade-out");
    setTimeout(() => {
      document.getElementById("splashScreen").classList.add("hidden");
      if (sessionStorage.getItem("medersa_logged_in")) {
        showApp();
      } else {
        document.getElementById("loginScreen").classList.remove("hidden");
        setupLogin();
      }
    }, 500);
  }, 1500);
}

function setupLogin() {
  const btn = document.getElementById("loginBtn");
  const input = document.getElementById("loginCode");
  const error = document.getElementById("loginError");

  const tryLogin = async () => {
    const code = input.value.trim();
    if (!code) return;

    btn.disabled = true;
    btn.textContent = "Connexion...";
    error.classList.add("hidden");

    try {
      const cfg = await CONFIG.loadClientConfig(code);
      CONFIG.applyClientConfig(cfg);
      sessionStorage.setItem("medersa_logged_in", "1");
      document.getElementById("loginScreen").classList.add("hidden");
      showApp();
    } catch (err) {
      if (err.message === "inactive") {
        error.textContent = "Ce compte est désactivé. Contactez Midenty.";
      } else {
        error.textContent = "Code incorrect / رمز غير صحيح";
      }
      error.classList.remove("hidden");
      input.value = "";
      input.focus();
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrer / دخول";
    }
  };

  btn.addEventListener("click", tryLogin);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryLogin(); });
}

function showApp() {
  document.getElementById("appMain").classList.remove("hidden");
  applyBranding();
  setupTabs();
  setupInscription();
  setupClasses();
  setupMensuel();
  setupParametres();
  checkExportWarning();
  initSyncIndicator();
}

function initSyncIndicator() {
  if (typeof initFirebase === "function") {
    initFirebase();
  }

  if (typeof isFirebaseReady === "function" && isFirebaseReady()) {
    Storage.initSync();
  }

  const indicator = document.getElementById("syncIndicator");
  if (!indicator) return;

  const labels = {
    synced: "Synchronisé",
    pending: "En attente...",
    offline: "Hors-ligne",
    disabled: ""
  };

  SyncState.onChange(state => {
    indicator.className = "sync-indicator " + state;
    indicator.querySelector(".sync-label").textContent = labels[state] || "";
  });
}

/* ==================== Branding ==================== */

function applyBranding() {
  const s = CONFIG.getSettings();
  document.getElementById("nomArabe").textContent = s.nomAr;
  document.getElementById("nomFr").textContent = s.nomFr;
  document.getElementById("adresseInfo").textContent = s.adresse + " · " + s.telephones.join(" / ");

  if (s.logo && s.logo !== "assets/logo.png") {
    document.getElementById("appLogo").src = s.logo;
  }

  document.documentElement.style.setProperty("--primary", s.couleurPrincipale || "#0d7a3d");
  document.documentElement.style.setProperty("--secondary", s.couleurSecondaire || "#0b3d91");
  document.documentElement.style.setProperty("--accent", s.couleurAccent || "#c5972c");
}

/* ==================== Tabs ==================== */

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
      document.getElementById("tab-" + btn.dataset.tab).classList.remove("hidden");
      if (btn.dataset.tab === "classes") renderClassesTab();
      if (btn.dataset.tab === "parametres") loadSettingsForm();
      if (btn.dataset.tab === "inscription") { populateClasseDropdown("studentClasse"); renderStudentsList(); refreshMatriculePreview(); }
    });
  });
}

/* ==================== ONGLET 1 : Inscription ==================== */

function setupInscription() {
  refreshMatriculePreview();
  populateClasseDropdown("studentClasse");

  document.getElementById("btnInscrire").addEventListener("click", handleInscription);
  document.getElementById("searchStudents").addEventListener("input", renderStudentsList);
  document.getElementById("btnExportStudentsPdf").addEventListener("click", async () => {
    const students = Storage.getAllStudents();
    if (students.length === 0) return toast("Aucun élève inscrit.");
    await PdfExport.generateStudentsListPdf(students);
  });

  document.getElementById("btnSaveEdit").addEventListener("click", handleSaveEdit);
  document.getElementById("btnCancelEdit").addEventListener("click", () => {
    document.getElementById("editStudentModal").classList.add("hidden");
  });

  setupShareButtons(".btn-share", "inscriptionReceiptPreview");
  renderStudentsList();
}

function refreshMatriculePreview() {
  document.getElementById("matriculePreview").value = Storage.peekNextMatricule();
}

function populateClasseDropdown(selectId) {
  const s = CONFIG.getSettings();
  const select = document.getElementById(selectId);
  const currentVal = select.value;
  const firstOption = select.querySelector("option:first-child");
  select.innerHTML = "";
  if (firstOption) select.appendChild(firstOption);
  s.classes.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
  if (currentVal) select.value = currentVal;
}

function handleInscription() {
  const nom = document.getElementById("studentNom").value.trim();
  const tel = document.getElementById("studentTel").value.trim();
  const telParent = document.getElementById("studentTelParent").value.trim();
  const classe = document.getElementById("studentClasse").value;

  if (!nom) return toast("Saisis le nom de l'élève.");
  if (!classe) return toast("Choisis une classe.");

  const s = CONFIG.getSettings();
  const student = Storage.saveStudent({
    nom, telephone: tel, telephoneParent: telParent,
    classe, dateInscription: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString()
  });

  const payment = Storage.savePayment({
    studentId: student.id,
    matricule: student.matricule,
    type: "inscription",
    mois: null,
    montant: s.fraisInscription,
    date: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString()
  });

  const receipt = {
    numero: payment.numero,
    date: payment.date,
    type: "inscription",
    student,
    montant: s.fraisInscription,
    devise: s.devise,
    createdAt: payment.createdAt
  };

  currentReceipt = receipt;
  currentReceiptEl = document.getElementById("inscriptionReceiptPreview");
  renderInscriptionReceipt(receipt);
  document.getElementById("inscriptionReceiptSection").classList.remove("hidden");
  document.getElementById("inscriptionReceiptSection").scrollIntoView({ behavior: "smooth" });

  document.getElementById("inscriptionForm").reset();
  refreshMatriculePreview();
  renderStudentsList();
  toast("Élève inscrit : " + student.nom + " — " + student.matricule);
}

function renderInscriptionReceipt(receipt) {
  const s = CONFIG.getSettings();
  const el = document.getElementById("inscriptionReceiptPreview");
  el.innerHTML = `
    <img src="${s.logo}" class="rp-logo" alt="Logo">
    <div class="rp-nom-arabe">${s.nomAr}</div>
    <div class="rp-nom-fr">${escapeHtml(s.nomFr)}</div>
    <div class="rp-sub">${escapeHtml(s.adresse)}</div>
    <div class="rp-sub">${s.telephones.join(" / ")}</div>
    <div class="rp-line"></div>
    <div class="rp-field"><span class="rp-field-label">Reçu N° / رقم الإيصال</span><span class="rp-field-value">${receipt.numero}</span></div>
    <div class="rp-field"><span class="rp-field-label">Date / التاريخ</span><span class="rp-field-value">${formatDateFr(receipt.date)}</span></div>
    <div class="rp-field"><span class="rp-field-label">Élève / التلميذ</span><span class="rp-field-value">${escapeHtml(receipt.student.nom)}</span></div>
    <div class="rp-field"><span class="rp-field-label">Matricule / الرقم</span><span class="rp-field-value">${receipt.student.matricule}</span></div>
    <div class="rp-field"><span class="rp-field-label">Classe / القسم</span><span class="rp-field-value">${escapeHtml(receipt.student.classe)}</span></div>
    <div class="rp-line"></div>
    <div class="rp-motif-row"><span>Inscription / التسجيل</span><span>${receipt.montant.toLocaleString("fr-FR")} ${receipt.devise}</span></div>
    <div class="rp-total-row">
      <span class="rp-total-label">TOTAL</span>
      <span class="rp-total-value">${receipt.montant.toLocaleString("fr-FR")} ${receipt.devise}</span>
    </div>
    <div class="rp-matricule-msg">
      <span class="ar">استخدموا هذا الرقم لدفع الرسوم الشهرية: ${receipt.student.matricule}</span>
      Utilisez ce matricule pour payer les frais mensuels : <strong>${receipt.student.matricule}</strong>
    </div>
    <div class="rp-line"></div>
    <div class="rp-message">${escapeHtml(s.messageFinalFr)}</div>
    ${s.messageFinalAr ? `<div class="rp-message-arabe">${s.messageFinalAr}</div>` : ""}
  `;
}

/* --- Liste des élèves --- */

function renderStudentsList() {
  const search = (document.getElementById("searchStudents").value || "").trim().toLowerCase();
  const list = document.getElementById("studentsList");
  const students = Storage.getAllStudents().filter(s => {
    if (!search) return true;
    return s.nom.toLowerCase().includes(search) ||
           (s.matricule || "").toLowerCase().includes(search) ||
           (s.classe || "").toLowerCase().includes(search);
  });

  if (students.length === 0) {
    list.innerHTML = `<p class="hint">${search ? "Aucun résultat." : "Aucun élève inscrit."}</p>`;
    return;
  }

  list.innerHTML = students.map(s => `
    <div class="list-item">
      <div class="list-item-info">
        <span class="list-item-name">${escapeHtml(s.nom)}</span>
        <span class="list-item-sub">${s.matricule} · ${escapeHtml(s.classe || "")} · ${escapeHtml(s.telephoneParent || s.telephone || "-")}</span>
      </div>
      <span class="list-item-badge">${s.matricule}</span>
      <button class="edit-btn" data-id="${s.id}" title="Modifier">✎</button>
    </div>
  `).join("");

  list.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.id));
  });
}

function openEditModal(studentId) {
  const s = Storage.findStudentById(studentId);
  if (!s) return;
  document.getElementById("editStudentNom").value = s.nom;
  document.getElementById("editStudentTel").value = s.telephone || "";
  document.getElementById("editStudentTelParent").value = s.telephoneParent || "";
  populateClasseDropdown("editStudentClasse");
  document.getElementById("editStudentClasse").value = s.classe || "";
  document.getElementById("editStudentId").value = studentId;
  document.getElementById("editStudentModal").classList.remove("hidden");
}

function handleSaveEdit() {
  const id = document.getElementById("editStudentId").value;
  const data = {
    nom: document.getElementById("editStudentNom").value.trim(),
    telephone: document.getElementById("editStudentTel").value.trim(),
    telephoneParent: document.getElementById("editStudentTelParent").value.trim(),
    classe: document.getElementById("editStudentClasse").value
  };
  if (!data.nom) return toast("Le nom est obligatoire.");
  Storage.updateStudent(id, data);
  document.getElementById("editStudentModal").classList.add("hidden");
  renderStudentsList();
  toast("Élève modifié.");
}

/* ==================== ONGLET 2 : Classes ==================== */

function setupClasses() {
  document.getElementById("classeFilter").addEventListener("change", renderClassesTab);
  document.getElementById("btnExportClassePdf").addEventListener("click", async () => {
    const classe = document.getElementById("classeFilter").value;
    if (!classe) return toast("Choisis une classe.");
    const students = Storage.getStudentsByClass(classe);
    if (students.length === 0) return toast("Aucun élève dans cette classe.");
    await PdfExport.generateClassListPdf(students, classe);
  });
}

function renderClassesTab() {
  populateClasseFilter();
  const classe = document.getElementById("classeFilter").value;
  const infoDiv = document.getElementById("classeInfo");
  const listDiv = document.getElementById("classeStudentsList");

  if (!classe) {
    infoDiv.classList.add("hidden");
    const s = CONFIG.getSettings();
    if (s.classes.length === 0) {
      listDiv.innerHTML = `<p class="hint">Aucune classe configurée. Va dans Paramètres pour en créer.</p>`;
    } else {
      listDiv.innerHTML = s.classes.map(c => {
        const count = Storage.getStudentsByClass(c).length;
        return `<div class="list-item"><div class="list-item-info"><span class="list-item-name">${escapeHtml(c)}</span><span class="list-item-sub">${count} élève(s)</span></div><span class="badge">${count}</span></div>`;
      }).join("");
    }
    return;
  }

  const students = Storage.getStudentsByClass(classe);
  infoDiv.classList.remove("hidden");
  document.getElementById("classeInfoTitle").textContent = classe;
  document.getElementById("classeInfoCount").textContent = students.length + " élève(s)";

  if (students.length === 0) {
    listDiv.innerHTML = `<p class="hint">Aucun élève dans cette classe.</p>`;
    return;
  }

  listDiv.innerHTML = students.map(s => `
    <div class="list-item">
      <div class="list-item-info">
        <span class="list-item-name">${escapeHtml(s.nom)}</span>
        <span class="list-item-sub">${s.matricule} · ${escapeHtml(s.telephoneParent || s.telephone || "-")}</span>
      </div>
      <span class="list-item-badge">${s.matricule}</span>
    </div>
  `).join("");
}

function populateClasseFilter() {
  const s = CONFIG.getSettings();
  const select = document.getElementById("classeFilter");
  const val = select.value;
  const firstOpt = select.querySelector("option:first-child");
  select.innerHTML = "";
  select.appendChild(firstOpt);
  s.classes.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
  select.value = val;
}

/* ==================== ONGLET 3 : Frais mensuels ==================== */

let mensuelStudent = null;
let selectedMonths = [];

function setupMensuel() {
  document.getElementById("btnSearchMatricule").addEventListener("click", handleSearchMatricule);
  document.getElementById("mensuelMatricule").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearchMatricule();
  });
  document.getElementById("btnPayerMensuel").addEventListener("click", handlePayerMensuel);
  document.getElementById("consultMonth").addEventListener("change", handleConsultMonth);

  const s = CONFIG.getSettings();
  const modeSelect = document.getElementById("mensuelPaiement");
  modeSelect.innerHTML = s.modesPaiement.map(m => `<option value="${m}">${m}</option>`).join("");

  populateConsultMonths();
  setupShareButtons(".btn-share-mensuel", "mensuelReceiptPreview");
}

function handleSearchMatricule() {
  const matricule = document.getElementById("mensuelMatricule").value.trim();
  if (!matricule) return toast("Saisis un matricule.");

  const student = Storage.findStudentByMatricule(matricule);
  if (!student) {
    toast("Aucun élève trouvé avec ce matricule.");
    document.getElementById("mensuelStudentInfo").classList.add("hidden");
    document.getElementById("mensuelMonthsSection").classList.add("hidden");
    return;
  }

  mensuelStudent = student;
  document.getElementById("mensuelNom").textContent = student.nom;
  document.getElementById("mensuelClasse").textContent = student.classe || "-";
  document.getElementById("mensuelTelParent").textContent = student.telephoneParent || student.telephone || "-";
  document.getElementById("mensuelStudentInfo").classList.remove("hidden");

  renderMonthsGrid();
  document.getElementById("mensuelMonthsSection").classList.remove("hidden");
  document.getElementById("mensuelReceiptSection").classList.add("hidden");
}

function renderMonthsGrid() {
  const grid = document.getElementById("monthsGrid");
  const months = Storage.getSchoolYearMonths();
  selectedMonths = [];

  grid.innerHTML = months.map(m => {
    const paid = Storage.isMonthPaid(mensuelStudent.id, m.key);
    const cls = paid ? "month-cell paid" : "month-cell unpaid";
    return `<div class="${cls}" data-month="${m.key}" data-paid="${paid}">${MONTH_NAMES_FR[m.mois]}<br><span style="font-size:10px">${MONTH_NAMES_AR[m.mois]}</span></div>`;
  }).join("");

  grid.querySelectorAll(".month-cell.unpaid").forEach(cell => {
    cell.addEventListener("click", () => {
      cell.classList.toggle("selected");
      const key = cell.dataset.month;
      if (selectedMonths.includes(key)) {
        selectedMonths = selectedMonths.filter(k => k !== key);
      } else {
        selectedMonths.push(key);
      }
      updateMensuelTotal();
    });
  });

  updateMensuelTotal();
}

function updateMensuelTotal() {
  const s = CONFIG.getSettings();
  const total = selectedMonths.length * s.fraisMensuels;
  document.getElementById("mensuelTotal").textContent = total.toLocaleString("fr-FR") + " " + s.devise;
}

function handlePayerMensuel() {
  if (!mensuelStudent) return toast("Cherche d'abord un élève.");
  if (selectedMonths.length === 0) return toast("Sélectionne au moins un mois.");

  const s = CONFIG.getSettings();
  const montantTotal = selectedMonths.length * s.fraisMensuels;
  const modePaiement = document.getElementById("mensuelPaiement").value;
  const numero = Storage.commitNextNumber();

  selectedMonths.forEach(moisKey => {
    Storage.savePayment({
      studentId: mensuelStudent.id,
      matricule: mensuelStudent.matricule,
      type: "mensuel",
      mois: moisKey,
      montant: s.fraisMensuels,
      numero,
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString()
    });
  });

  const receipt = {
    numero,
    date: new Date().toISOString().slice(0, 10),
    type: "mensuel",
    student: mensuelStudent,
    moisPayes: [...selectedMonths],
    montantParMois: s.fraisMensuels,
    montantTotal,
    modePaiement,
    devise: s.devise,
    createdAt: new Date().toISOString()
  };

  currentReceipt = receipt;
  currentReceiptEl = document.getElementById("mensuelReceiptPreview");
  renderMensuelReceipt(receipt);
  document.getElementById("mensuelReceiptSection").classList.remove("hidden");
  document.getElementById("mensuelReceiptSection").scrollIntoView({ behavior: "smooth" });

  renderMonthsGrid();
  toast("Paiement enregistré — " + receipt.numero);
}

function renderMensuelReceipt(receipt) {
  const s = CONFIG.getSettings();
  const el = document.getElementById("mensuelReceiptPreview");

  const moisLabels = receipt.moisPayes.map(k => {
    const m = parseInt(k.split("-")[1], 10);
    return MONTH_NAMES_FR[m] + " / " + MONTH_NAMES_AR[m];
  }).join(", ");

  el.innerHTML = `
    <img src="${s.logo}" class="rp-logo" alt="Logo">
    <div class="rp-nom-arabe">${s.nomAr}</div>
    <div class="rp-nom-fr">${escapeHtml(s.nomFr)}</div>
    <div class="rp-sub">${escapeHtml(s.adresse)}</div>
    <div class="rp-sub">${s.telephones.join(" / ")}</div>
    <div class="rp-line"></div>
    <div class="rp-field"><span class="rp-field-label">Reçu N°</span><span class="rp-field-value">${receipt.numero}</span></div>
    <div class="rp-field"><span class="rp-field-label">Date</span><span class="rp-field-value">${formatDateFr(receipt.date)}</span></div>
    <div class="rp-field"><span class="rp-field-label">Élève / التلميذ</span><span class="rp-field-value">${escapeHtml(receipt.student.nom)}</span></div>
    <div class="rp-field"><span class="rp-field-label">Matricule</span><span class="rp-field-value">${receipt.student.matricule}</span></div>
    <div class="rp-field"><span class="rp-field-label">Classe</span><span class="rp-field-value">${escapeHtml(receipt.student.classe)}</span></div>
    <div class="rp-field"><span class="rp-field-label">Paiement</span><span class="rp-field-value">${escapeHtml(receipt.modePaiement)}</span></div>
    <div class="rp-line"></div>
    <div class="rp-motif-row"><span>Frais mensuels / الرسوم الشهرية</span></div>
    <div class="rp-field"><span class="rp-field-label">Mois / الشهر</span><span class="rp-field-value" style="font-size:12px">${moisLabels}</span></div>
    <div class="rp-field"><span class="rp-field-label">${receipt.moisPayes.length} mois × ${receipt.montantParMois.toLocaleString("fr-FR")}</span></div>
    <div class="rp-total-row">
      <span class="rp-total-label">TOTAL</span>
      <span class="rp-total-value">${receipt.montantTotal.toLocaleString("fr-FR")} ${receipt.devise}</span>
    </div>
    <div class="rp-line"></div>
    <div class="rp-message">${escapeHtml(s.messageFinalFr)}</div>
    ${s.messageFinalAr ? `<div class="rp-message-arabe">${s.messageFinalAr}</div>` : ""}
  `;
}

/* --- Consultation des paiements --- */

function populateConsultMonths() {
  const months = Storage.getSchoolYearMonths();
  const select = document.getElementById("consultMonth");
  months.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.key;
    opt.textContent = MONTH_NAMES_FR[m.mois] + " " + m.annee + " / " + MONTH_NAMES_AR[m.mois];
    select.appendChild(opt);
  });
}

function handleConsultMonth() {
  const mois = document.getElementById("consultMonth").value;
  const results = document.getElementById("consultResults");
  if (!mois) { results.innerHTML = ""; return; }

  const allStudents = Storage.getAllStudents();
  const paid = [];
  const unpaid = [];

  allStudents.forEach(s => {
    if (Storage.isMonthPaid(s.id, mois)) {
      paid.push(s);
    } else {
      unpaid.push(s);
    }
  });

  let html = "";
  if (unpaid.length > 0) {
    html += `<h4 style="color:var(--danger);margin:8px 0 4px">✗ Impayés (${unpaid.length})</h4>`;
    html += unpaid.map(s => `<div class="list-item"><div class="list-item-info"><span class="list-item-name">${escapeHtml(s.nom)}</span><span class="list-item-sub">${s.matricule} · ${escapeHtml(s.classe || "")}</span></div></div>`).join("");
  }
  if (paid.length > 0) {
    html += `<h4 style="color:var(--primary);margin:12px 0 4px">✓ Payés (${paid.length})</h4>`;
    html += paid.map(s => `<div class="list-item"><div class="list-item-info"><span class="list-item-name">${escapeHtml(s.nom)}</span><span class="list-item-sub">${s.matricule} · ${escapeHtml(s.classe || "")}</span></div></div>`).join("");
  }
  if (allStudents.length === 0) {
    html = `<p class="hint">Aucun élève inscrit.</p>`;
  }

  results.innerHTML = html;
}

/* ==================== ONGLET 4 : Paramètres ==================== */

function setupParametres() {
  document.getElementById("btnSaveSchoolInfo").addEventListener("click", saveSchoolInfo);
  document.getElementById("btnAddClasse").addEventListener("click", addClasse);
  document.getElementById("btnSaveFrais").addEventListener("click", saveFrais);
  document.getElementById("btnSaveAnnee").addEventListener("click", saveAnnee);

  document.getElementById("btnExportBackup").addEventListener("click", () => {
    Storage.exportBackup();
    toast("Sauvegarde téléchargée.");
    checkExportWarning();
    updateLastExportInfo();
  });

  document.getElementById("importFile").addEventListener("change", handleImport);

  document.getElementById("btnExportCsv").addEventListener("click", () => {
    const students = Storage.getAllStudents();
    if (students.length === 0) return toast("Aucun élève à exporter.");
    Storage.exportCsv();
    toast("Fichier CSV téléchargé.");
  });

  // Tap 5x sur "À propos" → code dev ou reset
  let aboutTaps = 0;
  let aboutTimer = null;
  document.getElementById("aboutText").addEventListener("click", () => {
    aboutTaps++;
    clearTimeout(aboutTimer);
    aboutTimer = setTimeout(() => { aboutTaps = 0; }, 3000);
    if (aboutTaps >= 5) {
      aboutTaps = 0;
      const code = prompt("Code développeur / administrateur :");
      if (!code) return;
      if (code === CONFIG.codeResetAdmin) {
        // Choix : panneau dev ou reset
        const action = prompt("Tapez DEV pour configurer, ou RESET pour réinitialiser :");
        if (action && action.toUpperCase() === "RESET") {
          if (confirm("⚠️ Supprimer TOUTES les données ? Cette action est irréversible.")) {
            Storage.resetAllData();
            toast("Données réinitialisées.");
            setTimeout(() => location.reload(), 1000);
          }
        } else if (action && action.toUpperCase() === "DEV") {
          openDevPanel();
        }
      } else {
        toast("Code incorrect.");
      }
    }
  });

  loadSettingsForm();
}

function openDevPanel() {
  const panel = document.getElementById("devPanel");
  panel.classList.remove("hidden");
  const s = CONFIG.getSettings();
  document.getElementById("setColorPrimary").value = s.couleurPrincipale || "#0d7a3d";
  document.getElementById("setColorSecondary").value = s.couleurSecondaire || "#0b3d91";
  document.getElementById("setColorAccent").value = s.couleurAccent || "#c5972c";
  document.getElementById("setCodeAcces").value = CONFIG.getClientCode() || "";
  panel.scrollIntoView({ behavior: "smooth" });
  toast("Panneau développeur ouvert.");
}

function loadSettingsForm() {
  const s = CONFIG.getSettings();

  // Affichage lecture seule des infos école
  document.getElementById("readonlyNomFr").textContent = s.nomFr;
  document.getElementById("readonlyNomAr").textContent = s.nomAr;
  document.getElementById("readonlyAdresse").textContent = s.adresse;
  document.getElementById("readonlyTelephones").textContent = s.telephones.join(" / ");

  // Champs dev (remplis quand le panneau est ouvert)
  document.getElementById("setNomFr").value = s.nomFr;
  document.getElementById("setNomAr").value = s.nomAr;
  document.getElementById("setAdresse").value = s.adresse;
  document.getElementById("setTelephones").value = s.telephones.join(", ");

  document.getElementById("setFraisInscription").value = s.fraisInscription;
  document.getElementById("setFraisMensuels").value = s.fraisMensuels;
  document.getElementById("setPrefixeMatricule").value = s.prefixeMatricule;

  const debutSelect = document.getElementById("setDebutAnnee");
  const finSelect = document.getElementById("setFinAnnee");
  debutSelect.innerHTML = "";
  finSelect.innerHTML = "";
  for (let i = 1; i <= 12; i++) {
    debutSelect.innerHTML += `<option value="${i}" ${i === s.debutAnnee ? "selected" : ""}>${MONTH_NAMES_FR[i]}</option>`;
    finSelect.innerHTML += `<option value="${i}" ${i === s.finAnnee ? "selected" : ""}>${MONTH_NAMES_FR[i]}</option>`;
  }

  renderClassesList();
  updateLastExportInfo();
}

function saveSchoolInfo() {
  const telephones = document.getElementById("setTelephones").value
    .split(",").map(t => t.trim()).filter(Boolean);

  const logoFile = document.getElementById("setLogo").files[0];
  const save = (logoData) => {
    const overrides = {
      nomFr: document.getElementById("setNomFr").value.trim(),
      nomAr: document.getElementById("setNomAr").value.trim(),
      adresse: document.getElementById("setAdresse").value.trim(),
      telephones,
      couleurPrincipale: document.getElementById("setColorPrimary").value,
      couleurSecondaire: document.getElementById("setColorSecondary").value,
      couleurAccent: document.getElementById("setColorAccent").value
    };
    if (logoData) overrides.logo = logoData;
    Storage.saveSettings(overrides);
    applyBranding();
    loadSettingsForm();
    document.getElementById("devPanel").classList.add("hidden");
    toast("Configuration développeur enregistrée.");
  };

  if (logoFile) {
    const reader = new FileReader();
    reader.onload = () => save(reader.result);
    reader.readAsDataURL(logoFile);
  } else {
    save(null);
  }
}

function renderClassesList() {
  const s = CONFIG.getSettings();
  const list = document.getElementById("classesList");
  if (s.classes.length === 0) {
    list.innerHTML = `<p class="hint">Aucune classe créée.</p>`;
    return;
  }
  list.innerHTML = s.classes.map(c => `
    <div class="classe-item">
      <span>${escapeHtml(c)}</span>
      <button data-classe="${escapeHtml(c)}" title="Supprimer">✕</button>
    </div>
  `).join("");

  list.querySelectorAll(".classe-item button").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.classe;
      if (!confirm(`Supprimer la classe "${name}" ?`)) return;
      const s = CONFIG.getSettings();
      s.classes = s.classes.filter(c => c !== name);
      Storage.saveSettings({ classes: s.classes });
      renderClassesList();
      toast("Classe supprimée.");
    });
  });
}

function addClasse() {
  const input = document.getElementById("newClasseName");
  const name = input.value.trim();
  if (!name) return toast("Saisis un nom de classe.");
  const s = CONFIG.getSettings();
  if (s.classes.includes(name)) return toast("Cette classe existe déjà.");
  s.classes.push(name);
  Storage.saveSettings({ classes: s.classes });
  input.value = "";
  renderClassesList();
  toast("Classe ajoutée : " + name);
}

function saveFrais() {
  Storage.saveSettings({
    fraisInscription: parseInt(document.getElementById("setFraisInscription").value) || 0,
    fraisMensuels: parseInt(document.getElementById("setFraisMensuels").value) || 0
  });
  toast("Montants enregistrés.");
}

function saveAnnee() {
  Storage.saveSettings({
    debutAnnee: parseInt(document.getElementById("setDebutAnnee").value),
    finAnnee: parseInt(document.getElementById("setFinAnnee").value),
    prefixeMatricule: document.getElementById("setPrefixeMatricule").value.trim() || "MEI"
  });
  toast("Paramètres enregistrés.");
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!confirm(`Importer ${data.students?.length ?? 0} élève(s) et ${data.payments?.length ?? 0} paiement(s) ?\nCeci remplacera les données actuelles.`)) return;
      Storage.importBackup(data);
      toast("Sauvegarde importée.");
      location.reload();
    } catch (err) {
      alert("Import impossible : " + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = "";
}

/* ==================== Share buttons ==================== */

function setupShareButtons(selector, previewId) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!currentReceipt || !currentReceiptEl) return;
      const type = btn.dataset.type;
      const previewEl = document.getElementById(previewId);
      if (type === "pdf") await PdfExport.generatePdf(previewEl, currentReceipt.numero);
      if (type === "png") await PdfExport.generatePng(previewEl, currentReceipt.numero);
      if (type === "whatsapp") await PdfExport.shareWhatsapp(previewEl, currentReceipt);
      if (type === "print") {
        try { await PrintEscPos.printViaRawBT(currentReceipt); }
        catch (err) { toast("Erreur impression : " + err.message); }
      }
    });
  });
}

/* ==================== Divers ==================== */

function checkExportWarning() {
  const days = Storage.daysSinceLastExport();
  const el = document.getElementById("exportWarning");
  const count = Storage.getAllStudents().length;
  if (count === 0) { el.classList.add("hidden"); return; }
  if (days === null || days >= 7) {
    el.textContent = days === null
      ? "⚠️ Aucune sauvegarde exportée. Fais-le dans Paramètres."
      : `⚠️ Dernière sauvegarde il y a ${days} jours.`;
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

function updateLastExportInfo() {
  const days = Storage.daysSinceLastExport();
  const el = document.getElementById("lastExportInfo");
  if (!el) return;
  el.textContent = days === null ? "Aucune sauvegarde exportée." :
    days === 0 ? "Dernière sauvegarde : aujourd'hui." :
    `Dernière sauvegarde : il y a ${days} jour(s).`;
}

function setupInstallBanner() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const banner = document.getElementById("installBanner");
    if (banner) banner.classList.remove("hidden");
  });

  document.getElementById("installBtn")?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    document.getElementById("installBanner").classList.add("hidden");
  });

  document.getElementById("dismissInstallBtn")?.addEventListener("click", () => {
    document.getElementById("installBanner").classList.add("hidden");
  });
}

/* ==================== Utilitaires ==================== */

function formatDateFr(isoDate) {
  if (!isoDate) return "-";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

let toastTimeout;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  el.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { el.classList.remove("visible"); }, 3500);
}
