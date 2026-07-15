const MOIS_FR = {
  "01": "Janvier", "02": "Février", "03": "Mars", "04": "Avril",
  "05": "Mai", "06": "Juin", "07": "Juillet", "08": "Août",
  "09": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre"
};

const MOIS_AR = {
  "01": "يناير", "02": "فبراير", "03": "مارس", "04": "أبريل",
  "05": "مايو", "06": "يونيو", "07": "يوليو", "08": "أغسطس",
  "09": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر"
};

function formatMois(moisKey, lang) {
  if (!moisKey) return "";
  const num = moisKey.split("-").pop();
  const map = lang === "ar" ? MOIS_AR : MOIS_FR;
  return map[num] || moisKey;
}

function getInscriptionMessage({ nomEleve, classe, nomEcole, matricule, lang }) {
  if (lang === "ar") {
    return `${nomEcole}: تم تسجيل ${nomEleve} في ${classe}، رقم ${matricule}. مرحبا!`;
  }
  return `${nomEcole} - Inscription confirmee: ${nomEleve}, classe ${classe}, matricule ${matricule}. Bienvenue!`;
}

function getPaymentMessage({ nomEleve, mois, montant, devise, nomEcole, lang }) {
  const moisNom = formatMois(mois, lang);
  if (lang === "ar") {
    return `${nomEcole}: تم استلام ${montant} ${devise} عن ${moisNom}. التلميذ: ${nomEleve}. شكرا!`;
  }
  return `${nomEcole} - Paiement recu: ${montant} ${devise} pour ${moisNom}. Eleve: ${nomEleve}. Merci!`;
}

module.exports = { getInscriptionMessage, getPaymentMessage };
