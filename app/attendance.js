/* ==================== Onglet Présences ==================== */

const ATTENDANCE_DRAFT_KEY = "medersa_attendance_draft";

let _rollCallState = null;

function setupPresences() {
  if (!ModulesManager.isActive("presences")) return;

  populateClasseDropdown("presenceClasse");
  populateClasseDropdown("presenceHistClasse");
  populatePresenceHistMonths();

  const dateInput = document.getElementById("presenceDate");
  if (!dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);

  document.getElementById("btnCommencerAppel").addEventListener("click", startRollCall);
  document.getElementById("btnPresent").addEventListener("click", () => markCurrentStudent(true));
  document.getElementById("btnAbsent").addEventListener("click", () => markCurrentStudent(false));
  document.getElementById("btnRetourAppel").addEventListener("click", rollCallGoBack);
  document.getElementById("btnTerminerPlusTard").addEventListener("click", pauseRollCall);
  document.getElementById("btnValiderAppel").addEventListener("click", validateRollCall);
  document.getElementById("presenceHistMonth").addEventListener("change", renderAttendanceHistory);
  document.getElementById("presenceHistClasse").addEventListener("change", renderAttendanceHistory);
  document.getElementById("btnExportAttendancePdf").addEventListener("click", handleExportAttendancePdf);

  renderAttendanceHistory();
}

function refreshPresencesTab() {
  if (!ModulesManager.isActive("presences")) return;
  populateClasseDropdown("presenceClasse");
  populateClasseDropdown("presenceHistClasse");
  renderAttendanceHistory();
  if (!_rollCallState) showPresenceScreen("setup");
}

function showPresenceScreen(name) {
  document.getElementById("presenceSetup").classList.toggle("hidden", name !== "setup");
  document.getElementById("presenceRollcall").classList.toggle("hidden", name !== "rollcall");
  document.getElementById("presenceSummary").classList.toggle("hidden", name !== "summary");
}

/* --- Brouillon d'appel (local uniquement, pas envoyé à Firestore) --- */

function loadAttendanceDraft() {
  try {
    return JSON.parse(localStorage.getItem(ATTENDANCE_DRAFT_KEY) || "null");
  } catch (e) {
    return null;
  }
}

function saveAttendanceDraft() {
  if (!_rollCallState) return;
  localStorage.setItem(ATTENDANCE_DRAFT_KEY, JSON.stringify(_rollCallState));
}

function clearAttendanceDraft() {
  localStorage.removeItem(ATTENDANCE_DRAFT_KEY);
}

/* --- Déroulement de l'appel --- */

function startRollCall() {
  const classe = document.getElementById("presenceClasse").value;
  const date = document.getElementById("presenceDate").value;
  if (!classe) return toast(t("msg_choose_class"));
  if (!date) return toast(t("msg_choose_date_appel"));

  const draft = loadAttendanceDraft();
  if (draft && draft.classe === classe && draft.date === date && draft.index < draft.students.length) {
    if (confirm(t("msg_resume_draft"))) {
      _rollCallState = draft;
      showPresenceScreen("rollcall");
      renderRollCallStudent();
      return;
    }
    clearAttendanceDraft();
  }

  // Une présence déjà enregistrée pour cette classe/date (par cet appareil ou un
  // autre) sera intégralement remplacée si on refait l'appel — on prévient avant
  // d'écraser un appel déjà fait, plutôt que de le perdre silencieusement.
  const existing = Storage.getAttendanceForDate(classe, date);
  if (existing && !(draft && draft.classe === classe && draft.date === date)) {
    if (!confirm(t("msg_attendance_already_exists"))) return;
  }

  const students = Storage.getStudentsByClass(classe);
  if (students.length === 0) return toast(t("msg_no_students_in_class"));

  _rollCallState = {
    classe,
    date,
    students: students.map(s => ({ id: s.id, matricule: s.matricule, nom: s.nom })),
    index: 0,
    results: []
  };
  saveAttendanceDraft();
  showPresenceScreen("rollcall");
  renderRollCallStudent();
}

function renderRollCallStudent() {
  const st = _rollCallState;
  if (!st) return;
  if (st.index >= st.students.length) {
    showRollCallSummary();
    return;
  }
  const student = st.students[st.index];
  document.getElementById("rollcallName").textContent = student.nom;
  document.getElementById("rollcallMatricule").textContent = student.matricule;
  document.getElementById("rollcallProgress").textContent =
    t("txt_rollcall_progress", { current: st.index + 1, total: st.students.length });
}

function markCurrentStudent(present) {
  const st = _rollCallState;
  if (!st || st.index >= st.students.length) return;
  st.results[st.index] = present ? "present" : "absent";
  st.index++;
  saveAttendanceDraft();
  renderRollCallStudent();
}

function rollCallGoBack() {
  const st = _rollCallState;
  if (!st || st.index === 0) return;
  st.index--;
  saveAttendanceDraft();
  showPresenceScreen("rollcall");
  renderRollCallStudent();
}

function pauseRollCall() {
  saveAttendanceDraft();
  _rollCallState = null;
  showPresenceScreen("setup");
  toast(t("msg_attendance_paused"));
}

function showRollCallSummary() {
  const st = _rollCallState;
  if (!st) return;
  const presents = [];
  const absents = [];
  st.students.forEach((s, i) => {
    if (st.results[i] === "absent") absents.push(s);
    else presents.push(s);
  });

  document.getElementById("summaryCounts").innerHTML = `
    <div class="student-info-row"><span>${t("txt_summary_presents")}</span><strong>${presents.length}</strong></div>
    <div class="student-info-row"><span>${t("txt_summary_absents")}</span><strong>${absents.length}</strong></div>
  `;

  const listEl = document.getElementById("summaryAbsentsList");
  if (absents.length === 0) {
    listEl.innerHTML = `<p class="hint">${t("msg_no_absents")}</p>`;
  } else {
    listEl.innerHTML = `<h4>${t("title_absents_list")}</h4>` + absents.map(s => `
      <div class="list-item">
        <div class="list-item-info">
          <span class="list-item-name">${escapeHtml(s.nom)}</span>
        </div>
        <span class="list-item-badge">${s.matricule}</span>
      </div>
    `).join("");
  }

  showPresenceScreen("summary");
}

function validateRollCall() {
  const st = _rollCallState;
  if (!st) return;
  const presents = [];
  const absents = [];
  st.students.forEach((s, i) => {
    if (st.results[i] === "absent") absents.push(s.matricule);
    else presents.push(s.matricule);
  });

  Storage.saveAttendance({
    date: st.date,
    classe: st.classe,
    presents,
    absents,
    enregistrePar: ""
  });

  clearAttendanceDraft();
  _rollCallState = null;
  showPresenceScreen("setup");
  renderAttendanceHistory();
  toast(t("msg_attendance_saved"));
}

/* --- Historique --- */

function populatePresenceHistMonths() {
  const months = Storage.getSchoolYearMonths();
  const select = document.getElementById("presenceHistMonth");
  const previousVal = select.value;
  select.innerHTML = months.map(m => `<option value="${m.key}">${monthName(m.mois)} ${m.annee}</option>`).join("");
  const currentKey = new Date().toISOString().slice(0, 7);
  if (months.some(m => m.key === previousVal)) {
    select.value = previousVal;
  } else if (months.some(m => m.key === currentKey)) {
    select.value = currentKey;
  } else if (months[0]) {
    select.value = months[0].key;
  }
}

function renderAttendanceHistory() {
  const monthKey = document.getElementById("presenceHistMonth").value;
  const classe = document.getElementById("presenceHistClasse").value;
  const grid = document.getElementById("attendanceGrid");

  if (!monthKey || !classe) {
    grid.innerHTML = `<p class="hint">${t("msg_choose_class_and_month")}</p>`;
    return;
  }

  const students = Storage.getStudentsByClass(classe);
  const records = Storage.getAttendanceForClasseMonth(classe, monthKey);

  if (students.length === 0) {
    grid.innerHTML = `<p class="hint">${t("msg_no_student_class")}</p>`;
    return;
  }
  if (records.length === 0) {
    grid.innerHTML = `<p class="hint">${t("msg_no_attendance_data")}</p>`;
    return;
  }

  const days = records.map(r => r.date).sort();

  let html = '<table class="attendance-grid"><thead><tr><th></th>';
  days.forEach(d => { html += `<th>${d.slice(8, 10)}</th>`; });
  html += "</tr></thead><tbody>";

  students.forEach(s => {
    html += `<tr><td class="attendance-grid-name">${escapeHtml(s.nom)}</td>`;
    days.forEach(d => {
      const rec = records.find(r => r.date === d);
      let cls = "attendance-cell-none";
      if (rec) {
        if (rec.presents && rec.presents.includes(s.matricule)) cls = "attendance-cell-present";
        else if (rec.absents && rec.absents.includes(s.matricule)) cls = "attendance-cell-absent";
      }
      html += `<td class="attendance-cell ${cls}"></td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  grid.innerHTML = html;
}

async function handleExportAttendancePdf() {
  const monthKey = document.getElementById("presenceHistMonth").value;
  const classe = document.getElementById("presenceHistClasse").value;
  if (!monthKey || !classe) return toast(t("msg_choose_class_and_month"));

  const students = Storage.getStudentsByClass(classe);
  if (students.length === 0) return toast(t("msg_no_student_class"));

  const records = Storage.getAttendanceForClasseMonth(classe, monthKey);
  if (records.length === 0) return toast(t("msg_no_attendance_data"));

  await PdfExport.generateAttendanceSheetPdf(students, classe, monthKey, records);
}
