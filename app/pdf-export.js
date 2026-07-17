/* pdf-export.js — génération PDF/PNG du reçu + partage WhatsApp + listes PDF. */

const PdfExport = {
  async _renderCanvas(el) {
    return await html2canvas(el, { scale: 3, backgroundColor: "#ffffff" });
  },

  async generatePdf(el, filename) {
    const canvas = await this._renderCanvas(el);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  },

  async generatePng(el, filename) {
    const canvas = await this._renderCanvas(el);
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  async _canvasToBlob(canvas) {
    return await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  },

  async shareWhatsapp(el, receipt) {
    const canvas = await this._renderCanvas(el);
    const blob = await this._canvasToBlob(canvas);
    const file = new File([blob], `${receipt.numero}.png`, { type: "image/png" });
    const s = CONFIG.getSettings();
    const montant = receipt.montantTotal ?? receipt.montant ?? 0;
    const text = `${t("receipt_number")} ${receipt.numero} — ${s.nomFr} — ${montant.toLocaleString("fr-FR")} ${s.devise}`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: t("receipt_number"), text });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${receipt.numero}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast(t("msg_image_downloaded"));
  },

  _renderArabicText(text, font, fontSize, maxWidth) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = `${fontSize}px ${font}`;
      const measured = ctx.measureText(text);
      const w = Math.min(Math.ceil(measured.width) + 10, maxWidth);
      const h = Math.ceil(fontSize * 1.5);
      canvas.width = w;
      canvas.height = h;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#000000";
      ctx.font = `${fontSize}px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2);
      resolve(canvas);
    });
  },

  _hasArabic(str) {
    return /[؀-ۿݐ-ݿࢠ-ࣿ]/.test(str);
  },

  async generateStudentsListPdf(students) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const s = CONFIG.getSettings();
    const ml = 15;
    const mt = 20;
    const lh = 7;
    const ph = pdf.internal.pageSize.getHeight();
    const colNom = ml;
    const colMat = ml + 65;
    const colClasse = ml + 95;
    const colTel = ml + 135;
    let y = mt;

    const addArabicName = async (name, x, yPos) => {
      const canvas = await this._renderArabicText(name, "Amiri, serif", 28, 180);
      const imgW = (canvas.width / canvas.height) * 5;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, yPos - 4, imgW, 5);
    };

    const drawHeader = () => {
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text(s.nomFr, ml, y);
      y += 7;
      pdf.setFontSize(11);
      pdf.text(t("pdf_students_list"), ml, y);
      y += 5;
      pdf.setFontSize(9);
      pdf.text(t("pdf_exported_on", { date: new Date().toLocaleDateString("fr-FR"), count: students.length }), ml, y);
      y += 8;
      pdf.setFont(undefined, "bold");
      pdf.setFontSize(10);
      pdf.text(t("pdf_col_name"), colNom, y);
      pdf.text(t("pdf_col_matricule"), colMat, y);
      pdf.text(t("pdf_col_class"), colClasse, y);
      pdf.text(t("pdf_col_parent_tel"), colTel, y);
      y += 2;
      pdf.line(ml, y, 195, y);
      y += 6;
      pdf.setFont(undefined, "normal");
      pdf.setFontSize(10);
    };

    drawHeader();

    for (const st of students) {
      if (y > ph - 20) {
        pdf.addPage();
        y = mt;
        drawHeader();
      }

      if (this._hasArabic(st.nom || "")) {
        await addArabicName(st.nom, colNom, y);
      } else {
        pdf.text((st.nom || "-").slice(0, 30), colNom, y);
      }
      pdf.text(st.matricule || "-", colMat, y);
      pdf.text((st.classe || "-").slice(0, 18), colClasse, y);
      pdf.text(st.telephoneParent || st.telephone || "-", colTel, y);
      y += lh;
    }

    pdf.save(`liste_eleves_${new Date().toISOString().slice(0, 10)}.pdf`);
  },

  async generateClassListPdf(students, className) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const s = CONFIG.getSettings();
    const ml = 15;
    const mt = 20;
    const lh = 7;
    const ph = pdf.internal.pageSize.getHeight();
    const colN = ml + 8;
    const colNom = ml + 18;
    const colMat = ml + 80;
    const colTel = ml + 115;
    let y = mt;

    const addArabicName = async (name, x, yPos) => {
      const canvas = await this._renderArabicText(name, "Amiri, serif", 28, 200);
      const imgW = (canvas.width / canvas.height) * 5;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, yPos - 4, imgW, 5);
    };

    const drawHeader = () => {
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text(s.nomFr, ml, y);
      y += 7;
      pdf.setFontSize(12);
      pdf.text(`${t("pdf_col_class")} : ${className}`, ml, y);
      y += 5;
      pdf.setFontSize(9);
      pdf.text(`${t("pdf_exported_on", { date: new Date().toLocaleDateString("fr-FR"), count: students.length })}`, ml, y);
      y += 8;
      pdf.setFont(undefined, "bold");
      pdf.setFontSize(10);
      pdf.text(t("pdf_col_number"), ml, y);
      pdf.text(t("pdf_col_name"), colNom, y);
      pdf.text(t("pdf_col_matricule"), colMat, y);
      pdf.text(t("pdf_col_parent_tel"), colTel, y);
      y += 2;
      pdf.line(ml, y, 195, y);
      y += 6;
      pdf.setFont(undefined, "normal");
      pdf.setFontSize(10);
    };

    drawHeader();

    for (let i = 0; i < students.length; i++) {
      const st = students[i];
      if (y > ph - 20) {
        pdf.addPage();
        y = mt;
        drawHeader();
      }

      pdf.text(String(i + 1), ml, y);

      if (this._hasArabic(st.nom || "")) {
        await addArabicName(st.nom, colNom, y);
      } else {
        pdf.text((st.nom || "-").slice(0, 28), colNom, y);
      }
      pdf.text(st.matricule || "-", colMat, y);
      pdf.text(st.telephoneParent || st.telephone || "-", colTel, y);
      y += lh;
    }

    pdf.save(`classe_${className.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
};
