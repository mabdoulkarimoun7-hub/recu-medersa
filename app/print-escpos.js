/* print-escpos.js — impression thermique ESC/POS via RawBT (V3). */

const LOGO_WIDTH_DOTS = 200;
const ARABIC_HEADER_WIDTH_DOTS = 300;

function loadImageAsCanvas(src, targetWidthDots) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = targetWidthDots;
      const height = Math.max(8, Math.round((img.height / img.width) * width));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function renderTextAsCanvas(text, font, fontSize, width) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px ${font}`;
    const height = Math.max(8, Math.ceil(fontSize * 1.4));
    canvas.height = height;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
    resolve(canvas);
  });
}

function uint8ToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function buildEncodedReceipt(receipt, { columns, withImages }) {
  if (typeof ReceiptPrinterEncoder === "undefined") {
    throw new Error("Librairie d'impression non chargée. Vérifie ta connexion internet et recharge la page.");
  }

  const s = CONFIG.getSettings();
  const encoder = new ReceiptPrinterEncoder({
    language: "esc-pos",
    columns: columns || CONFIG.imprimante.colonnes,
    imageMode: "raster"
  });

  encoder.initialize();

  if (withImages !== false && s.logo) {
    try {
      const logoCanvas = await loadImageAsCanvas(s.logo, LOGO_WIDTH_DOTS);
      if (logoCanvas) encoder.align("center").image(logoCanvas, logoCanvas.width, logoCanvas.height).newline();
    } catch (e) { /* skip */ }
  }

  if (s.nomAr && withImages !== false) {
    try {
      const arCanvas = await renderTextAsCanvas(s.nomAr, "Amiri, serif", 22, ARABIC_HEADER_WIDTH_DOTS);
      encoder.align("center").image(arCanvas, arCanvas.width, arCanvas.height).newline();
    } catch (e) { /* skip */ }
  }

  encoder
    .align("center")
    .bold(true).line(s.nomFr).bold(false)
    .line(s.adresse)
    .line(s.telephones.join(" / "))
    .align("left")
    .rule()
    .line(`Reçu N° ${receipt.numero}`)
    .line(`Date : ${formatDateFr(receipt.date)}`);

  if (receipt.type === "inscription") {
    encoder
      .line(`Élève : ${receipt.student.nom}`)
      .line(`Matricule : ${receipt.student.matricule}`)
      .line(`Classe : ${receipt.student.classe || "-"}`)
      .rule()
      .line(`Inscription : ${receipt.montant.toLocaleString("fr-FR")} ${receipt.devise}`)
      .rule()
      .bold(true).line(`TOTAL : ${receipt.montant.toLocaleString("fr-FR")} ${receipt.devise}`).bold(false)
      .rule()
      .align("center")
      .line(`Matricule: ${receipt.student.matricule}`);

    if (withImages !== false) {
      try {
        const msgCanvas = await renderTextAsCanvas(
          `استخدموا هذا الرقم: ${receipt.student.matricule}`,
          "Amiri, serif", 18, ARABIC_HEADER_WIDTH_DOTS
        );
        encoder.image(msgCanvas, msgCanvas.width, msgCanvas.height);
      } catch (e) { /* skip */ }
    }
  } else if (receipt.type === "mensuel") {
    const moisLabels = (receipt.moisPayes || []).map(k => {
      const m = parseInt(k.split("-")[1], 10);
      return MONTH_NAMES_FR[m] || k;
    }).join(", ");

    encoder
      .line(`Élève : ${receipt.student.nom}`)
      .line(`Matricule : ${receipt.student.matricule}`)
      .line(`Classe : ${receipt.student.classe || "-"}`)
      .line(`Paiement : ${receipt.modePaiement || "-"}`)
      .rule()
      .line(`Frais mensuels`)
      .line(`Mois : ${moisLabels}`)
      .line(`${receipt.moisPayes.length} × ${receipt.montantParMois.toLocaleString("fr-FR")} ${receipt.devise}`)
      .rule()
      .bold(true).line(`TOTAL : ${receipt.montantTotal.toLocaleString("fr-FR")} ${receipt.devise}`).bold(false);
  }

  encoder.rule().align("center").line(s.messageFinalFr);

  if (s.messageFinalAr && withImages !== false) {
    try {
      const msgCanvas = await renderTextAsCanvas(s.messageFinalAr, "Amiri, serif", 18, ARABIC_HEADER_WIDTH_DOTS);
      encoder.align("center").image(msgCanvas, msgCanvas.width, msgCanvas.height);
    } catch (e) { /* skip */ }
  }

  encoder.newline(3).cut();
  return encoder.encode();
}

const PrintEscPos = {
  async printViaRawBT(receipt) {
    let data;
    try {
      data = await buildEncodedReceipt(receipt, { columns: CONFIG.imprimante.colonnes, withImages: true });
    } catch (err) {
      data = await buildEncodedReceipt(receipt, { columns: CONFIG.imprimante.colonnes, withImages: false });
    }
    const base64 = uint8ToBase64(data);
    const url = `rawbt:base64,${base64}`;
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 1000);
  }
};
