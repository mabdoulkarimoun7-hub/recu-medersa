const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { sendSMS } = require("./sms-service");
const { getInscriptionMessage, getPaymentMessage } = require("./sms-templates");

admin.initializeApp();
const db = admin.firestore();

exports.onPaymentCreated = onDocumentCreated(
  "schools/{schoolCode}/payments/{paymentId}",
  async (event) => {
    const payment = event.data?.data();
    const { schoolCode } = event.params;

    if (!payment) {
      logger.warn("Document payment vide", { schoolCode });
      return;
    }

    const smsConfigSnap = await db.doc(`schools/${schoolCode}/config/sms`).get();
    if (!smsConfigSnap.exists) {
      logger.info("Pas de config SMS pour cette école", { schoolCode });
      return;
    }

    const smsConfig = smsConfigSnap.data();
    if (!smsConfig.enabled) {
      logger.info("SMS désactivé pour cette école", { schoolCode });
      return;
    }

    if (payment._smsTest) {
      const testMessage = `[TEST] SMS configuré pour ${schoolCode}. Si vous recevez ce message, tout fonctionne !`;
      const result = await sendSMS({
        to: payment._testPhone,
        message: testMessage,
        provider: smsConfig.provider,
        apiKey: smsConfig.apiKey,
        apiSecret: smsConfig.apiSecret,
        senderId: smsConfig.senderId,
        apiUrl: smsConfig.apiUrl
      });
      logger.info("SMS test envoyé", { result });
      await event.data.ref.delete();
      return;
    }

    const studentSnap = await db.doc(`schools/${schoolCode}/students/${payment.studentId}`).get();
    if (!studentSnap.exists) {
      logger.warn("Élève introuvable", { studentId: payment.studentId, schoolCode });
      return;
    }

    const student = studentSnap.data();
    const phoneNumber = student.telephoneParent || student.telephone;

    if (!phoneNumber) {
      logger.warn("Pas de numéro de téléphone pour cet élève", {
        studentId: payment.studentId,
        nom: student.nom
      });
      return;
    }

    const schoolConfigSnap = await db.doc(`schools/${schoolCode}/config/settings`).get();
    const nomEcole = schoolConfigSnap.exists
      ? (schoolConfigSnap.data().nomEcole || schoolCode)
      : schoolCode;

    const lang = smsConfig.language || "fr";
    let message;

    if (payment.type === "inscription") {
      message = getInscriptionMessage({
        nomEleve: student.nom,
        classe: student.classe,
        nomEcole,
        matricule: student.matricule || payment.matricule,
        lang
      });
    } else if (payment.type === "mensuel") {
      message = getPaymentMessage({
        nomEleve: student.nom,
        mois: payment.mois,
        montant: payment.montant,
        devise: smsConfig.devise || "FCFA",
        nomEcole,
        lang
      });
    } else {
      logger.info("Type de paiement non géré pour SMS", { type: payment.type });
      return;
    }

    const result = await sendSMS({
      to: phoneNumber,
      message,
      provider: smsConfig.provider,
      apiKey: smsConfig.apiKey,
      apiSecret: smsConfig.apiSecret,
      senderId: smsConfig.senderId,
      apiUrl: smsConfig.apiUrl
    });

    await event.data.ref.update({
      smsStatus: result.success ? "sent" : "failed",
      smsError: result.error || null,
      smsMessageId: result.messageId || null,
      smsSentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    if (result.success) {
      logger.info("SMS envoyé", { to: phoneNumber, messageId: result.messageId });
    } else {
      logger.error("Échec envoi SMS", { to: phoneNumber, error: result.error });
    }
  }
);
