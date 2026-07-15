const { logger } = require("firebase-functions");

async function sendSMS({ to, message, provider, apiKey, apiSecret, senderId, apiUrl }) {
  if (!to || !message) {
    logger.warn("sendSMS: numéro ou message manquant", { to, message });
    return { success: false, error: "Numéro ou message manquant" };
  }

  const cleanNumber = to.replace(/\s+/g, "").replace(/^00/, "+");

  logger.info(`SMS → ${cleanNumber} via ${provider}`, { message });

  try {
    if (provider === "africastalking") {
      return await sendAfricasTalking({ to: cleanNumber, message, apiKey, senderId });
    }
    if (provider === "twilio") {
      return await sendTwilio({ to: cleanNumber, message, apiKey, apiSecret, senderId });
    }
    if (provider === "generic") {
      return await sendGeneric({ to: cleanNumber, message, apiKey, senderId, apiUrl });
    }

    logger.error(`Fournisseur SMS inconnu: ${provider}`);
    return { success: false, error: `Fournisseur inconnu: ${provider}` };
  } catch (err) {
    logger.error("Erreur envoi SMS", err);
    return { success: false, error: err.message };
  }
}

async function sendAfricasTalking({ to, message, apiKey, senderId }) {
  const res = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      "apiKey": apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: new URLSearchParams({
      username: senderId || "sandbox",
      to,
      message
    })
  });

  const data = await res.json();
  const recipient = data?.SMSMessageData?.Recipients?.[0];

  if (recipient && recipient.statusCode === 101) {
    return { success: true, messageId: recipient.messageId };
  }
  return { success: false, error: JSON.stringify(data) };
}

async function sendTwilio({ to, message, apiKey, apiSecret, senderId }) {
  const accountSid = apiKey;
  const authToken = apiSecret;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      To: to,
      From: senderId,
      Body: message
    })
  });

  const data = await res.json();
  if (data.sid) {
    return { success: true, messageId: data.sid };
  }
  return { success: false, error: data.message || JSON.stringify(data) };
}

async function sendGeneric({ to, message, apiKey, senderId, apiUrl }) {
  if (!apiUrl) {
    return { success: false, error: "URL API manquante pour le fournisseur générique" };
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ to, message, from: senderId })
  });

  const data = await res.json();
  return { success: res.ok, messageId: data.messageId || data.id, error: data.error };
}

module.exports = { sendSMS };
