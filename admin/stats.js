/*
 * Admin Stats — Tableau de bord statistiques en temps réel
 * Écoute les collections Firestore d'une école et affiche graphiques + tables
 */

const AdminStats = {
  _listeners: [],
  _students: [],
  _payments: [],
  _attendance: [],
  _charts: {},
  _currentCode: null,

  startListening(code) {
    this.stopListening();
    this._currentCode = code;
    this._students = [];
    this._payments = [];
    this._attendance = [];

    if (!_adminDb) return;

    const studentsRef = _adminDb.collection("schools/" + code + "/students").orderBy("createdAt", "desc");
    const paymentsRef = _adminDb.collection("schools/" + code + "/payments").orderBy("createdAt", "desc");
    const attendanceRef = _adminDb.collection("schools/" + code + "/attendance");

    this._listeners.push(
      studentsRef.onSnapshot(snap => {
        this._students = [];
        snap.forEach(doc => this._students.push({ ...doc.data(), _docId: doc.id }));
        this.render();
      })
    );

    this._listeners.push(
      paymentsRef.onSnapshot(snap => {
        this._payments = [];
        snap.forEach(doc => this._payments.push({ ...doc.data(), _docId: doc.id }));
        this.render();
      })
    );

    this._listeners.push(
      attendanceRef.onSnapshot(snap => {
        this._attendance = [];
        snap.forEach(doc => this._attendance.push({ ...doc.data(), _docId: doc.id }));
        this.render();
      })
    );
  },

  stopListening() {
    this._listeners.forEach(unsub => { try { unsub(); } catch(e) {} });
    this._listeners = [];
    this._currentCode = null;
    Object.values(this._charts).forEach(c => { try { c.destroy(); } catch(e) {} });
    this._charts = {};
  },

  // ===== Computed stats =====

  getTotalStudents() { return this._students.length; },

  getStudentsByClass() {
    const map = {};
    this._students.forEach(s => {
      const cls = s.classe || "?";
      map[cls] = (map[cls] || 0) + 1;
    });
    return map;
  },

  getTotalReceipts() { return this._payments.length; },

  getTotalRevenue() {
    return this._payments.reduce((sum, p) => sum + (p.montant || p.montantTotal || 0), 0);
  },

  getMonthlyRevenue() {
    const map = {};
    this._payments.forEach(p => {
      const d = p.date || p.createdAt || "";
      const key = d.substring(0, 7);
      if (key) map[key] = (map[key] || 0) + (p.montant || p.montantTotal || 0);
    });
    const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
    return { labels: sorted.map(e => e[0]), values: sorted.map(e => e[1]) };
  },

  getPaymentStatus() {
    const inscriptionPaid = new Set();
    this._payments.forEach(p => {
      if (p.type === "inscription" && p.studentId) inscriptionPaid.add(p.studentId);
    });
    const paid = inscriptionPaid.size;
    const unpaid = Math.max(0, this._students.length - paid);
    return { paid, unpaid };
  },

  getAttendanceRate() {
    const classStats = {};
    this._attendance.forEach(a => {
      const cls = a.classe || "?";
      if (!classStats[cls]) classStats[cls] = { present: 0, total: 0 };
      const presents = Array.isArray(a.presents) ? a.presents.length : 0;
      const absents = Array.isArray(a.absents) ? a.absents.length : 0;
      classStats[cls].present += presents;
      classStats[cls].total += presents + absents;
    });
    const result = {};
    Object.entries(classStats).forEach(([cls, data]) => {
      result[cls] = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
    });
    return result;
  },

  getAverageAttendance() {
    const rates = Object.values(this.getAttendanceRate());
    if (rates.length === 0) return 0;
    return Math.round(rates.reduce((s, v) => s + v, 0) / rates.length);
  },

  // ===== Rendering =====

  render() {
    this.renderCards();
    this.renderCharts();
    this.renderDetails();
  },

  renderCards() {
    const t = AdminI18n.t.bind(AdminI18n);
    const revenue = this.getTotalRevenue();
    const client = clients.find(c => c.codeAcces === this._currentCode);
    const devise = (client && client.devise) || "FCFA";

    document.getElementById("statsCards").innerHTML = `
      <div class="stats-card">
        <div class="stats-card-value">${this.getTotalStudents()}</div>
        <div class="stats-card-label">${t("admin_stats_total_students")}</div>
      </div>
      <div class="stats-card">
        <div class="stats-card-value">${this.getTotalReceipts()}</div>
        <div class="stats-card-label">${t("admin_stats_total_receipts")}</div>
      </div>
      <div class="stats-card">
        <div class="stats-card-value">${revenue.toLocaleString()} ${esc(devise)}</div>
        <div class="stats-card-label">${t("admin_stats_total_revenue")}</div>
      </div>
      <div class="stats-card">
        <div class="stats-card-value">${this.getAverageAttendance()}%</div>
        <div class="stats-card-label">${t("admin_stats_attendance_rate")}</div>
      </div>
    `;
  },

  renderCharts() {
    const t = AdminI18n.t.bind(AdminI18n);
    const COLORS = ["#2980b9", "#27ae60", "#e67e22", "#8e44ad", "#c0392b", "#16a085", "#d35400", "#2c3e50", "#f39c12", "#1abc9c"];

    // Students by class
    const byClass = this.getStudentsByClass();
    const classLabels = Object.keys(byClass);
    const classValues = Object.values(byClass);
    this._renderChart("chartStudentsByClass", "bar", {
      labels: classLabels,
      datasets: [{
        label: t("admin_stats_total_students"),
        data: classValues,
        backgroundColor: classLabels.map((_, i) => COLORS[i % COLORS.length])
      }]
    }, { plugins: { legend: { display: false } } });

    // Monthly revenue
    const monthly = this.getMonthlyRevenue();
    this._renderChart("chartMonthlyRevenue", "line", {
      labels: monthly.labels,
      datasets: [{
        label: t("admin_stats_monthly_revenue"),
        data: monthly.values,
        borderColor: "#27ae60",
        backgroundColor: "rgba(39,174,96,0.1)",
        fill: true,
        tension: 0.3
      }]
    }, { plugins: { legend: { display: false } } });

    // Payment status
    const status = this.getPaymentStatus();
    this._renderChart("chartPaymentStatus", "doughnut", {
      labels: [t("admin_stats_paid"), t("admin_stats_unpaid")],
      datasets: [{
        data: [status.paid, status.unpaid],
        backgroundColor: ["#27ae60", "#e74c3c"]
      }]
    }, {});

    // Attendance by class
    const attendance = this.getAttendanceRate();
    const attLabels = Object.keys(attendance);
    const attValues = Object.values(attendance);
    this._renderChart("chartAttendanceRate", "bar", {
      labels: attLabels,
      datasets: [{
        label: "%",
        data: attValues,
        backgroundColor: attLabels.map((_, i) => COLORS[i % COLORS.length])
      }]
    }, {
      plugins: { legend: { display: false } },
      scales: { y: { max: 100, beginAtZero: true } }
    });
  },

  _renderChart(canvasId, type, data, options) {
    if (this._charts[canvasId]) {
      try { this._charts[canvasId].destroy(); } catch(e) {}
    }
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    this._charts[canvasId] = new Chart(canvas, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        ...options
      }
    });
  },

  renderDetails() {
    const t = AdminI18n.t.bind(AdminI18n);
    const container = document.getElementById("statsDetails");

    // Students table (last 20)
    const recentStudents = this._students.slice(0, 20);
    let html = '<h3 class="stats-section-title">' + t("admin_stats_students_list") + '</h3>';
    html += '<table class="stats-table"><thead><tr>';
    html += '<th>' + t("admin_stats_student_name") + '</th>';
    html += '<th>' + t("admin_stats_student_class") + '</th>';
    html += '<th>' + t("admin_stats_student_matricule") + '</th>';
    html += '<th>' + t("admin_stats_student_date") + '</th>';
    html += '</tr></thead><tbody>';
    recentStudents.forEach(s => {
      html += '<tr><td>' + esc(s.nom || "") + '</td><td>' + esc(s.classe || "") + '</td><td>' + esc(s.matricule || "") + '</td><td>' + esc((s.dateInscription || "").substring(0, 10)) + '</td></tr>';
    });
    if (recentStudents.length === 0) html += '<tr><td colspan="4" style="text-align:center;color:#888">—</td></tr>';
    html += '</tbody></table>';

    // Payments table (last 20)
    const recentPayments = this._payments.slice(0, 20);
    html += '<h3 class="stats-section-title">' + t("admin_stats_recent_payments") + '</h3>';
    html += '<table class="stats-table"><thead><tr>';
    html += '<th>' + t("admin_stats_payment_receipt") + '</th>';
    html += '<th>' + t("admin_stats_student_name") + '</th>';
    html += '<th>' + t("admin_stats_payment_amount") + '</th>';
    html += '<th>' + t("admin_stats_payment_type") + '</th>';
    html += '<th>' + t("admin_stats_payment_date") + '</th>';
    html += '</tr></thead><tbody>';
    recentPayments.forEach(p => {
      const name = (p.student && p.student.nom) || "";
      const typeLabel = p.type === "inscription" ? t("admin_stats_inscription") : t("admin_stats_mensuel");
      const amount = (p.montant || p.montantTotal || 0).toLocaleString();
      html += '<tr><td>' + esc(p.numero || "") + '</td><td>' + esc(name) + '</td><td>' + amount + '</td><td>' + typeLabel + '</td><td>' + esc((p.date || "").substring(0, 10)) + '</td></tr>';
    });
    if (recentPayments.length === 0) html += '<tr><td colspan="5" style="text-align:center;color:#888">—</td></tr>';
    html += '</tbody></table>';

    container.innerHTML = html;
  }
};
