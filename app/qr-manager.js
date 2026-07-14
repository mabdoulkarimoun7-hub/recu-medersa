/* qr-manager.js — génération de QR codes (V3 simplifié, pas de scanner). */

const QrManager = {
  generateQrToElement(el, text, size) {
    if (typeof QRCode === "undefined") return;
    el.innerHTML = "";
    new QRCode(el, {
      text: text,
      width: size || 100,
      height: size || 100,
      correctLevel: QRCode.CorrectLevel.M
    });
  }
};
