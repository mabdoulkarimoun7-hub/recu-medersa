/* app.js — logique principale V4 (multilingue). */

let currentReceipt = null;
let currentReceiptEl = null;
let deferredInstallPrompt = null;
let _swRegistration = null;

document.addEventListener("DOMContentLoaded", () => {
  showSplash();
  setupInstallBanner();
  setupAppUpdates();
  setupManualRefresh();
});

/* ==================== Mises à jour de l'application ==================== */

function setupAppUpdates() {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("service-worker.js").then(reg => {
    _swRegistration = reg;

    const checkForUpdate = () => reg.update().catch(() => {});

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkForUpdate();
    });
    window.addEventListener("online", checkForUpdate);
    setInterval(checkForUpdate, 5 * 60 * 1000);
  }).catch(err => console.error("SW registration failed", err));

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    const banner = document.getElementById("updateBanner");
    if (banner) banner.classList.remove("hidden");
  });
}

function setupManualRefresh() {
  const btn = document.getElementById("btnManualRefresh");
  const applyBtn = document.getElementById("btnApplyUpdate");
  if (btn) {
    btn.addEventListener("click", () => {
      if (_swRegistration) _swRegistration.update().catch(() => {});
      window.location.reload();
    });
  }
  if (applyBtn) {
    applyBtn.addEventListener("click", () => window.location.reload());
  }
}

/* ==================== Splash & Login ==================== */

function playMidentyIntro() {
  return new Promise(resolve => {
    const overlay = document.getElementById("splashMidenty");
    const copyright = document.getElementById("midentyMessage");
    if (!overlay) { resolve(); return; }

    setTimeout(() => {
      copyright.classList.add("visible");
    }, 1800);

    setTimeout(() => {
      overlay.classList.add("fade-out");
      setTimeout(() => {
        overlay.classList.add("hidden");
        resolve();
      }, 600);
    }, 3000);
  });
}

async function showSplash() {
  await playMidentyIntro();

  applySplashBrandingFromSettings();

  if (sessionStorage.getItem("medersa_logged_in")) {
    showApp();
    return;
  }

  showLanguageSelect();
}

function applySplashBrandingFromSettings() {
  if (window._brandingApplied || window._urlClientCode) return;
  const s = CONFIG.getSettings();
  if (s.nomAr) document.getElementById("splashNameAr").textContent = s.nomAr;
  if (s.nomFr) document.getElementById("splashNameFr").textContent = s.nomFr;
  const logoSrc = (s.logo && s.logo !== "assets/logo.png") ? s.logo : "assets/logo.png";
  const sLogo = document.getElementById("splashLogo");
  const lLogo = document.getElementById("loginLogo");
  sLogo.onload = function(){ sLogo.style.opacity = "1"; };
  lLogo.onload = function(){ lLogo.style.opacity = "1"; };
  sLogo.src = logoSrc;
  lLogo.src = logoSrc;
  if (s.couleurPrincipale) document.documentElement.style.setProperty("--primary", s.couleurPrincipale);
  if (s.couleurSecondaire) document.documentElement.style.setProperty("--secondary", s.couleurSecondaire);
  if (s.couleurAccent) document.documentElement.style.setProperty("--accent", s.couleurAccent);
}

function setupLogin() {
  const btn = document.getElementById("loginBtn");
  const input = document.getElementById("loginCode");
  const error = document.getElementById("loginError");

  if (window._urlClientCode) {
    input.value = window._urlClientCode;
  }

  const tryLogin = async () => {
    const code = input.value.trim();
    if (!code) return;

    btn.disabled = true;
    btn.textContent = t("msg_connecting");
    error.classList.add("hidden");

    try {
      const cfg = await CONFIG.loadClientConfig(code);
      CONFIG.applyClientConfig(cfg);
      markVerified();
      sessionStorage.setItem("medersa_logged_in", "1");
      document.getElementById("loginScreen").classList.add("hidden");
      showApp();
    } catch (err) {
      if (err.message === "inactive") {
        error.innerHTML =
          t("msg_account_disabled") + '<br>' +
          '<a href="https://wa.me/22788811081?text=Bonjour%20Midenty%2C%20mon%20compte%20a%20%C3%A9t%C3%A9%20d%C3%A9sactiv%C3%A9.%20Code%20%3A%20' + encodeURIComponent(code) + '" ' +
          'target="_blank" ' +
          'style="display:inline-block;margin-top:10px;padding:10px 20px;background:#25d366;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">' +
          '💬 ' + t("msg_contact_whatsapp") + '</a>';
      } else {
        error.textContent = t("msg_code_incorrect");
      }
      error.classList.remove("hidden");
      input.value = "";
      input.focus();
    } finally {
      btn.disabled = false;
      btn.textContent = t("btn_login");
    }
  };

  btn.addEventListener("click", tryLogin);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") tryLogin(); });
}

function showLanguageSelect() {
  const screen = document.getElementById("languageSelectScreen");
  screen.classList.remove("hidden");

  screen.querySelectorAll(".lang-option").forEach(btn => {
    btn.addEventListener("click", () => {
      I18n.setLang(btn.dataset.lang);
      screen.classList.add("hidden");
      showWelcomeScreen();
    }, { once: true });
  });
}

function showWelcomeScreen() {
  const screen = document.getElementById("welcomeScreen");
  screen.classList.remove("hidden");
  setTimeout(() => {
    screen.classList.add("hidden");
    showSchoolEntryScreen();
  }, 2500);
}

function showSchoolEntryScreen() {
  const screen = document.getElementById("splashScreen");
  screen.classList.remove("hidden");

  document.getElementById("btnEnterSchool").addEventListener("click", () => {
    screen.classList.add("hidden");
    document.getElementById("loginScreen").classList.remove("hidden");
    setupLogin();
  }, { once: true });
}

const VERIFICATION_KEY = "medersa_last_verified";
const VERIFICATION_INTERVAL_DAYS = 7;

async function showApp() {
  const daysSince = daysSinceLastVerification();

  if (daysSince !== null && daysSince >= VERIFICATION_INTERVAL_DAYS) {
    showVerificationScreen();
    return;
  }

  if (!I18n.getLang()) {
    showLanguageSelect();
    return;
  }

  if (typeof initFirebase === "function") await initFirebase();
  if (typeof isFirebaseReady === "function" && isFirebaseReady()) {
    await Storage.pullConfigFromFirestore();
  }

  applyLanguage();
  document.getElementById("appMain").classList.remove("hidden");
  applyBranding();
  ModulesManager.init(CONFIG.getSettings());
  ModulesManager.applyToDOM();
  setupTabs();
  setupInscription();
  setupClasses();
  setupMensuel();
  setupPresences();
  setupParametres();
  setupGuide();
  checkExportWarning();
  initSyncIndicator();
  setupLanguageSwitcher();
}

function daysSinceLastVerification() {
  const ts = localStorage.getItem(VERIFICATION_KEY);
  if (!ts) return null;
  return Math.floor((Date.now() - parseInt(ts, 10)) / (1000 * 60 * 60 * 24));
}

function markVerified() {
  localStorage.setItem(VERIFICATION_KEY, String(Date.now()));
}

function showVerificationScreen() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("appMain").classList.add("hidden");

  let overlay = document.getElementById("verificationOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "verificationOverlay";
    overlay.className = "login-screen";
    overlay.innerHTML = `
      <div class="login-card" style="text-align:center">
        <div style="font-size:48px;margin-bottom:16px">🔄</div>
        <h2 style="margin-bottom:8px">${t("verify_title")}</h2>
        <p id="verifyMessage" style="color:#666;margin-bottom:20px;font-size:14px;line-height:1.5">
          ${t("verify_message").replace("\n", "<br>")}
        </p>
        <button type="button" id="btnRetryVerify" class="primary-btn login-btn" style="width:100%">
          ${t("btn_verify")}
        </button>
        <div id="verifyError" class="login-error hidden" style="margin-top:12px"></div>
        <a href="https://wa.me/22788811081?text=Bonjour%20Midenty%2C%20j'ai%20besoin%20d'aide%20avec%20mon%20application."
           target="_blank"
           style="display:inline-block;margin-top:16px;color:#25d366;font-size:13px;text-decoration:none">
          💬 ${t("msg_need_help")}
        </a>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  overlay.classList.remove("hidden");

  const btn = document.getElementById("btnRetryVerify");
  const errDiv = document.getElementById("verifyError");
  const msgDiv = document.getElementById("verifyMessage");

  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = t("msg_verifying");
    errDiv.classList.add("hidden");

    const code = CONFIG.getClientCode();
    if (!code) {
      sessionStorage.removeItem("medersa_logged_in");
      overlay.classList.add("hidden");
      document.getElementById("loginScreen").classList.remove("hidden");
      setupLogin();
      return;
    }

    try {
      const resp = await fetch("clients/" + encodeURIComponent(code) + ".json");
      if (!resp.ok) throw new Error("not_found");
      const cfg = await resp.json();

      if (!cfg.actif) {
        msgDiv.innerHTML = t("msg_account_deactivated");
        btn.outerHTML =
          '<a href="https://wa.me/22788811081?text=Bonjour%20Midenty%2C%20mon%20compte%20a%20%C3%A9t%C3%A9%20d%C3%A9sactiv%C3%A9.%20Code%20%3A%20' + encodeURIComponent(code) + '" ' +
          'target="_blank" class="primary-btn login-btn" ' +
          'style="width:100%;display:block;text-align:center;text-decoration:none;background:#25d366">' +
          '💬 ' + t("msg_contact_whatsapp") + '</a>';
        errDiv.classList.add("hidden");
        return;
      }

      CONFIG.applyClientConfig(cfg);
      markVerified();
      overlay.classList.add("hidden");

      if (typeof initFirebase === "function") await initFirebase();
      if (typeof isFirebaseReady === "function" && isFirebaseReady()) {
        await Storage.pullConfigFromFirestore();
      }

      document.getElementById("appMain").classList.remove("hidden");
      applyLanguage();
      applyBranding();
      ModulesManager.init(CONFIG.getSettings());
      ModulesManager.applyToDOM();
      setupTabs();
      setupInscription();
      setupClasses();
      setupMensuel();
      setupParametres();
      setupGuide();
      checkExportWarning();
      initSyncIndicator();
      setupLanguageSwitcher();
    } catch (err) {
      errDiv.textContent = t("msg_no_internet");
      errDiv.classList.remove("hidden");
    } finally {
      btn.disabled = false;
      btn.textContent = t("btn_verify");
    }
  };
}

function initSyncIndicator() {
  if (typeof initFirebase === "function") {
    initFirebase();
  }

  if (typeof isFirebaseReady === "function" && isFirebaseReady()) {
    Storage.initSync();
  }

  const refreshBtn = document.getElementById("btnManualRefresh");
  if (refreshBtn) refreshBtn.title = t("btn_refresh_app_tooltip");

  const indicator = document.getElementById("syncIndicator");
  if (!indicator) return;

  SyncState.onChange(state => {
    indicator.className = "sync-indicator " + state;
    const labels = {
      synced: t("sync_synced"),
      pending: t("sync_pending"),
      offline: t("sync_offline"),
      disabled: ""
    };
    indicator.querySelector(".sync-label").textContent = labels[state] || "";
  });
}

/* ==================== Language switcher ==================== */

function setupLanguageSwitcher() {
  document.querySelectorAll(".lang-switch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      I18n.setLang(btn.dataset.lang);
      updateLangSwitcherUI();
      renderStudentsList();
      renderClassesTab();
      loadSettingsForm();
      populateConsultMonths();
      checkExportWarning();
      updateLastExportInfo();
    });
  });
  updateLangSwitcherUI();
}

function updateLangSwitcherUI() {
  const lang = I18n.getLang();
  document.querySelectorAll(".lang-switch-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

/* ==================== Branding ==================== */

function applyBranding() {
  const s = CONFIG.getSettings();
  document.getElementById("nomArabe").textContent = s.nomAr;
  document.getElementById("nomFr").textContent = s.nomFr;
  document.getElementById("adresseInfo").textContent = s.adresse + " · " + s.telephones.join(" / ");

  var appLogoEl = document.getElementById("appLogo");
  var appLogoSrc = (s.logo && s.logo !== "assets/logo.png") ? s.logo : "assets/logo.png";
  appLogoEl.onload = function(){ appLogoEl.style.opacity = "1"; };
  appLogoEl.src = appLogoSrc;

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
      if (btn.dataset.tab === "presences") refreshPresencesTab();
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
    if (students.length === 0) return toast(t("msg_no_students"));
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

async function handleInscription() {
  const nom = document.getElementById("studentNom").value.trim();
  const tel = document.getElementById("studentTel").value.trim();
  const telParent = document.getElementById("studentTelParent").value.trim();
  const classe = document.getElementById("studentClasse").value;

  if (!nom) return toast(t("msg_enter_name"));
  if (!classe) return toast(t("msg_choose_class"));

  const btn = document.getElementById("btnInscrire");
  if (btn.disabled) return;
  btn.disabled = true;

  try {
    const s = CONFIG.getSettings();
    const student = await Storage.saveStudent({
      nom, telephone: tel, telephoneParent: telParent,
      classe, dateInscription: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString()
    });

    const payment = await Storage.savePayment({
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
    toast(t("msg_student_enrolled", { name: student.nom, matricule: student.matricule }));
  } finally {
    btn.disabled = false;
  }
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
    <div class="rp-field"><span class="rp-field-label">${t("receipt_number")}</span><span class="rp-field-value">${receipt.numero}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_date")}</span><span class="rp-field-value">${formatDateFr(receipt.date)}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_student")}</span><span class="rp-field-value">${escapeHtml(receipt.student.nom)}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_matricule")}</span><span class="rp-field-value">${receipt.student.matricule}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_class")}</span><span class="rp-field-value">${escapeHtml(receipt.student.classe)}</span></div>
    <div class="rp-line"></div>
    <div class="rp-motif-row"><span>${t("receipt_inscription")}</span><span>${receipt.montant.toLocaleString("fr-FR")} ${receipt.devise}</span></div>
    <div class="rp-total-row">
      <span class="rp-total-label">${t("receipt_total")}</span>
      <span class="rp-total-value">${receipt.montant.toLocaleString("fr-FR")} ${receipt.devise}</span>
    </div>
    <div class="rp-matricule-msg">
      ${t("receipt_use_matricule")} <strong>${receipt.student.matricule}</strong>
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
    list.innerHTML = `<p class="hint">${search ? t("msg_no_search_result") : t("msg_no_students")}</p>`;
    return;
  }

  list.innerHTML = students.map(s => `
    <div class="list-item">
      <div class="list-item-info">
        <span class="list-item-name">${escapeHtml(s.nom)}</span>
        <span class="list-item-sub">${s.matricule} · ${escapeHtml(s.classe || "")} · ${escapeHtml(s.telephoneParent || s.telephone || "-")}</span>
      </div>
      <span class="list-item-badge">${s.matricule}</span>
      <button class="edit-btn" data-id="${s.id}" title="${t("btn_modify")}">✎</button>
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
  if (!data.nom) return toast(t("msg_name_required"));
  Storage.updateStudent(id, data);
  document.getElementById("editStudentModal").classList.add("hidden");
  renderStudentsList();
  toast(t("msg_student_modified"));
}

/* ==================== ONGLET 2 : Classes ==================== */

function setupClasses() {
  document.getElementById("classeFilter").addEventListener("change", renderClassesTab);
  document.getElementById("btnExportClassePdf").addEventListener("click", async () => {
    const classe = document.getElementById("classeFilter").value;
    if (!classe) return toast(t("msg_choose_class"));
    const students = Storage.getStudentsByClass(classe);
    if (students.length === 0) return toast(t("msg_no_student_class"));
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
      listDiv.innerHTML = `<p class="hint">${t("msg_no_class_config")}</p>`;
    } else {
      listDiv.innerHTML = s.classes.map(c => {
        const count = Storage.getStudentsByClass(c).length;
        return `<div class="list-item"><div class="list-item-info"><span class="list-item-name">${escapeHtml(c)}</span><span class="list-item-sub">${count} ${t("txt_students_count")}</span></div><span class="badge">${count}</span></div>`;
      }).join("");
    }
    return;
  }

  const students = Storage.getStudentsByClass(classe);
  infoDiv.classList.remove("hidden");
  document.getElementById("classeInfoTitle").textContent = classe;
  document.getElementById("classeInfoCount").textContent = students.length + " " + t("txt_students_count");

  if (students.length === 0) {
    listDiv.innerHTML = `<p class="hint">${t("msg_no_student_class")}</p>`;
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
  document.getElementById("mensuelMatriculePrefix").textContent = s.prefixeMatricule + "-";

  const modeSelect = document.getElementById("mensuelPaiement");
  modeSelect.innerHTML = s.modesPaiement.map(m => `<option value="${m}">${m}</option>`).join("");

  populateConsultMonths();
  setupShareButtons(".btn-share-mensuel", "mensuelReceiptPreview");
}

function handleSearchMatricule() {
  const num = document.getElementById("mensuelMatricule").value.trim();
  if (!num) return toast(t("msg_enter_matricule"));
  const prefix = document.getElementById("mensuelMatriculePrefix").textContent;
  const matricule = prefix + num;

  const student = Storage.findStudentByMatricule(matricule);
  if (!student) {
    toast(t("msg_student_not_found"));
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
    return `<div class="${cls}" data-month="${m.key}" data-paid="${paid}">${monthName(m.mois)}</div>`;
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

async function handlePayerMensuel() {
  if (!mensuelStudent) return toast(t("msg_find_student_first"));
  if (selectedMonths.length === 0) return toast(t("msg_select_month"));

  const btn = document.getElementById("btnPayerMensuel");
  if (btn.disabled) return;
  btn.disabled = true;

  try {
    const s = CONFIG.getSettings();
    const montantTotal = selectedMonths.length * s.fraisMensuels;
    const modePaiement = document.getElementById("mensuelPaiement").value;
    const numero = await Storage.commitNextNumber();

    for (const moisKey of selectedMonths) {
      await Storage.savePayment({
        studentId: mensuelStudent.id,
        matricule: mensuelStudent.matricule,
        type: "mensuel",
        mois: moisKey,
        montant: s.fraisMensuels,
        numero,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString()
      });
    }

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
    toast(t("msg_payment_saved", { numero: receipt.numero }));
  } finally {
    btn.disabled = false;
  }
}

function renderMensuelReceipt(receipt) {
  const s = CONFIG.getSettings();
  const el = document.getElementById("mensuelReceiptPreview");

  const moisLabels = receipt.moisPayes.map(k => {
    const m = parseInt(k.split("-")[1], 10);
    return monthName(m);
  }).join(", ");

  el.innerHTML = `
    <img src="${s.logo}" class="rp-logo" alt="Logo">
    <div class="rp-nom-arabe">${s.nomAr}</div>
    <div class="rp-nom-fr">${escapeHtml(s.nomFr)}</div>
    <div class="rp-sub">${escapeHtml(s.adresse)}</div>
    <div class="rp-sub">${s.telephones.join(" / ")}</div>
    <div class="rp-line"></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_number")}</span><span class="rp-field-value">${receipt.numero}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_date")}</span><span class="rp-field-value">${formatDateFr(receipt.date)}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_student")}</span><span class="rp-field-value">${escapeHtml(receipt.student.nom)}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_matricule")}</span><span class="rp-field-value">${receipt.student.matricule}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_class")}</span><span class="rp-field-value">${escapeHtml(receipt.student.classe)}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_payment_mode")}</span><span class="rp-field-value">${escapeHtml(receipt.modePaiement)}</span></div>
    <div class="rp-line"></div>
    <div class="rp-motif-row"><span>${t("receipt_monthly_fees")}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_month")}</span><span class="rp-field-value" style="font-size:12px">${moisLabels}</span></div>
    <div class="rp-field"><span class="rp-field-label">${t("receipt_months_multiply", { count: receipt.moisPayes.length, amount: receipt.montantParMois.toLocaleString("fr-FR") })}</span></div>
    <div class="rp-total-row">
      <span class="rp-total-label">${t("receipt_total")}</span>
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
  const firstOpt = select.querySelector("option:first-child");
  select.innerHTML = "";
  select.appendChild(firstOpt);
  months.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.key;
    opt.textContent = monthName(m.mois) + " " + m.annee;
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
    html += `<h4 style="color:var(--danger);margin:8px 0 4px">✗ ${t("txt_unpaid")} (${unpaid.length})</h4>`;
    html += unpaid.map(s => `<div class="list-item"><div class="list-item-info"><span class="list-item-name">${escapeHtml(s.nom)}</span><span class="list-item-sub">${s.matricule} · ${escapeHtml(s.classe || "")}</span></div></div>`).join("");
  }
  if (paid.length > 0) {
    html += `<h4 style="color:var(--primary);margin:12px 0 4px">✓ ${t("txt_paid")} (${paid.length})</h4>`;
    html += paid.map(s => `<div class="list-item"><div class="list-item-info"><span class="list-item-name">${escapeHtml(s.nom)}</span><span class="list-item-sub">${s.matricule} · ${escapeHtml(s.classe || "")}</span></div></div>`).join("");
  }
  if (allStudents.length === 0) {
    html = `<p class="hint">${t("msg_no_students")}</p>`;
  }

  results.innerHTML = html;
}

/* ==================== ONGLET : Guide d'utilisation ==================== */

const GUIDE_SECTIONS_BASE = ["inscription", "classes", "paiement", "recus"];
const GUIDE_SECTIONS_MODULES = {
  presences: "presences",
  bulletins: "bulletins",
  attestations: "attestations",
  dashboard: "dashboard"
};

function setupGuide() {
  if (!ModulesManager.isActive("guide")) return;

  const s = CONFIG.getSettings();
  const guideConfig = s.guideConfig || {};
  const videoUrls = {};
  (guideConfig.sections || []).forEach(sec => {
    if (sec.key && sec.videoUrl) videoUrls[sec.key] = sec.videoUrl;
  });

  const msgEl = document.getElementById("guideCustomMessage");
  const lang = I18n.getLang();
  const customMsg = guideConfig.messagePersonnalise && guideConfig.messagePersonnalise[lang];
  if (customMsg) {
    msgEl.textContent = customMsg;
    msgEl.classList.remove("hidden");
  } else {
    msgEl.classList.add("hidden");
  }

  const keys = [...GUIDE_SECTIONS_BASE];
  Object.keys(GUIDE_SECTIONS_MODULES).forEach(mod => {
    if (ModulesManager.isActive(mod)) keys.push(mod);
  });

  const container = document.getElementById("guideSections");
  container.innerHTML = keys.map(key => renderGuideSection(key, videoUrls[key])).join("");

  container.querySelectorAll(".guide-video-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".guide-video-wrap");
      const url = btn.dataset.url;
      wrap.innerHTML = `<iframe class="guide-video-iframe" src="${escapeHtml(url)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    });
  });

  renderGuideForfaits(guideConfig);
  renderGuidePaymentModes(guideConfig, s);
}

function renderGuideSection(key, videoUrl) {
  let videoHtml = "";
  if (videoUrl) {
    videoHtml = `
      <div class="guide-video-wrap">
        <button type="button" class="secondary-btn guide-video-btn" data-url="${escapeHtml(videoUrl)}">${t("guide_video_btn")}</button>
      </div>`;
  }
  return `
    <section class="settings-block">
      <h3>${t("guide_section_" + key + "_title")}</h3>
      <p class="hint">${t("guide_section_" + key + "_desc")}</p>
      ${videoHtml}
    </section>`;
}

function renderGuideForfaits(guideConfig) {
  const block = document.getElementById("guideForfaitsBlock");
  const afficher = !guideConfig.forfaits || guideConfig.forfaits.afficher !== false;
  if (!afficher) {
    block.classList.add("hidden");
    return;
  }
  block.classList.remove("hidden");
  const forfaits = ["essentiel", "complet", "premium"];
  document.getElementById("guideForfaitsList").innerHTML = forfaits.map(f => `
    <div class="school-info-readonly" style="margin-bottom:10px">
      <p><strong>${t("guide_forfait_" + f + "_name")}</strong></p>
      <p>${t("guide_forfait_" + f + "_desc")}</p>
    </div>`).join("");
}

function renderGuidePaymentModes(guideConfig, s) {
  const configured = guideConfig.forfaits && guideConfig.forfaits.modesPaiementAbonnement;
  const modes = (configured && configured.length > 0) ? configured : (s.modesPaiement || []);
  document.getElementById("guidePaymentModes").textContent = modes.join(" · ");
}

/* ==================== ONGLET 4 : Paramètres ==================== */

function setupParametres() {
  document.getElementById("btnSaveSchoolInfo").addEventListener("click", saveSchoolInfo);
  document.getElementById("btnAddClasse").addEventListener("click", addClasse);
  document.getElementById("btnSaveFrais").addEventListener("click", saveFrais);
  document.getElementById("btnSaveAnnee").addEventListener("click", saveAnnee);

  document.getElementById("btnExportBackup").addEventListener("click", () => {
    Storage.exportBackup();
    toast(t("msg_backup_downloaded"));
    checkExportWarning();
    updateLastExportInfo();
  });

  document.getElementById("importFile").addEventListener("change", handleImport);

  document.getElementById("btnExportCsv").addEventListener("click", () => {
    const students = Storage.getAllStudents();
    if (students.length === 0) return toast(t("msg_no_students_export"));
    Storage.exportCsv();
    toast(t("msg_csv_downloaded"));
  });

  let aboutTaps = 0;
  let aboutTimer = null;
  document.getElementById("aboutText").addEventListener("click", () => {
    aboutTaps++;
    clearTimeout(aboutTimer);
    aboutTimer = setTimeout(() => { aboutTaps = 0; }, 3000);
    if (aboutTaps >= 5) {
      aboutTaps = 0;
      const code = prompt(t("txt_dev_prompt"));
      if (!code) return;
      if (code === CONFIG.codeResetAdmin) {
        const action = prompt(t("txt_dev_action_prompt"));
        if (action && action.toUpperCase() === "RESET") {
          const unsynced = SyncState.get() === SyncState.PENDING || SyncState.get() === SyncState.OFFLINE;
          if (unsynced && !confirm(t("txt_reset_unsynced_warning"))) return;
          if (confirm(t("txt_reset_confirm"))) {
            Storage.resetAllData();
            toast(t("msg_data_reset"));
            setTimeout(() => location.reload(), 1000);
          }
        } else if (action && action.toUpperCase() === "DEV") {
          openDevPanel();
        }
      } else {
        toast(t("msg_code_wrong"));
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
  toast(t("msg_dev_panel_opened"));
}

function loadSettingsForm() {
  const s = CONFIG.getSettings();

  document.getElementById("readonlyNomFr").textContent = s.nomFr;
  document.getElementById("readonlyNomAr").textContent = s.nomAr;
  document.getElementById("readonlyAdresse").textContent = s.adresse;
  document.getElementById("readonlyTelephones").textContent = s.telephones.join(" / ");

  document.getElementById("setNomFr").value = s.nomFr;
  document.getElementById("setNomAr").value = s.nomAr;
  document.getElementById("setAdresse").value = s.adresse;
  document.getElementById("setTelephones").value = s.telephones.join(", ");

  document.getElementById("setFraisInscription").value = s.fraisInscription;
  document.getElementById("setFraisMensuels").value = s.fraisMensuels;
  const debutMoisSelect = document.getElementById("setDebutMois");
  const finMoisSelect = document.getElementById("setFinMois");
  const debutAnneeSelect = document.getElementById("setDebutAnneeYear");
  const finAnneeSelect = document.getElementById("setFinAnneeYear");

  debutMoisSelect.innerHTML = "";
  finMoisSelect.innerHTML = "";
  for (let i = 1; i <= 12; i++) {
    debutMoisSelect.innerHTML += `<option value="${i}" ${i === s.debutAnnee.mois ? "selected" : ""}>${monthName(i)}</option>`;
    finMoisSelect.innerHTML += `<option value="${i}" ${i === s.finAnnee.mois ? "selected" : ""}>${monthName(i)}</option>`;
  }

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  debutAnneeSelect.innerHTML = "";
  finAnneeSelect.innerHTML = "";
  years.forEach(y => {
    debutAnneeSelect.innerHTML += `<option value="${y}" ${y === s.debutAnnee.annee ? "selected" : ""}>${y}</option>`;
    finAnneeSelect.innerHTML += `<option value="${y}" ${y === s.finAnnee.annee ? "selected" : ""}>${y}</option>`;
  });

  renderClassesList();
  updateLastExportInfo();

  const whatsappMsg = encodeURIComponent(t("whatsapp_help_message"));
  document.getElementById("aboutText").innerHTML =
    t("about_line1") + "<br>" + t("about_line2") +
    '<br><a href="https://wa.me/22788811081?text=' + whatsappMsg + '" ' +
    'target="_blank" rel="noopener" ' +
    'style="display:inline-block;margin-top:10px;margin-bottom:10px;padding:10px 20px;background:#25d366;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">' +
    '💬 ' + t("msg_contact_whatsapp") + '</a>' +
    "<br>" + t("about_copyright");
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
    toast(t("msg_dev_config_saved"));
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
    list.innerHTML = `<p class="hint">${t("msg_no_class_created")}</p>`;
    return;
  }
  list.innerHTML = s.classes.map(c => `
    <div class="classe-item">
      <span>${escapeHtml(c)}</span>
      <button data-classe="${escapeHtml(c)}" title="${t("msg_class_deleted")}">✕</button>
    </div>
  `).join("");

  list.querySelectorAll(".classe-item button").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.classe;
      if (!confirm(t("txt_delete_class_confirm", { name }))) return;
      const s = CONFIG.getSettings();
      s.classes = s.classes.filter(c => c !== name);
      Storage.saveSettings({ classes: s.classes });
      renderClassesList();
      toast(t("msg_class_deleted"));
    });
  });
}

function addClasse() {
  const input = document.getElementById("newClasseName");
  const name = input.value.trim();
  if (!name) return toast(t("msg_enter_class_name"));
  const s = CONFIG.getSettings();
  if (s.classes.includes(name)) return toast(t("msg_class_exists"));
  s.classes.push(name);
  Storage.saveSettings({ classes: s.classes });
  input.value = "";
  renderClassesList();
  toast(t("msg_class_added", { name }));
}

function saveFrais() {
  Storage.saveSettings({
    fraisInscription: parseInt(document.getElementById("setFraisInscription").value) || 0,
    fraisMensuels: parseInt(document.getElementById("setFraisMensuels").value) || 0
  });
  toast(t("msg_amounts_saved"));
}

function saveAnnee() {
  Storage.saveSettings({
    debutAnnee: {
      mois: parseInt(document.getElementById("setDebutMois").value),
      annee: parseInt(document.getElementById("setDebutAnneeYear").value)
    },
    finAnnee: {
      mois: parseInt(document.getElementById("setFinMois").value),
      annee: parseInt(document.getElementById("setFinAnneeYear").value)
    }
  });
  toast(t("msg_settings_saved"));
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!confirm(t("txt_import_confirm", { students: data.students?.length ?? 0, payments: data.payments?.length ?? 0 }))) return;
      Storage.importBackup(data);
      toast(t("msg_backup_imported"));
      location.reload();
    } catch (err) {
      alert(t("msg_import_error", { error: err.message }));
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
        catch (err) { toast(t("msg_print_error", { error: err.message })); }
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
      ? "⚠️ " + t("msg_no_backup")
      : "⚠️ " + t("msg_backup_days_ago", { days });
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

function updateLastExportInfo() {
  const days = Storage.daysSinceLastExport();
  const el = document.getElementById("lastExportInfo");
  if (!el) return;
  el.textContent = days === null ? t("msg_no_backup_yet") :
    days === 0 ? t("msg_backup_today") :
    t("msg_backup_ago", { days });
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
