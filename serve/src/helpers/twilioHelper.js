import twilio from "twilio";

// TODO: Move Account SID and Auth Token to environment variables for security
const accountSid = process.env.TW_ACK; // process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TW_AUTH; // process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Define your Content SID (template ID) from Twilio
const contentSid = process.env.TW_SID; // From test.js
const fromWhatsappNumber = "whatsapp:+14155238886"; // Your Twilio WhatsApp number from test.js

/**
 * Sends a WhatsApp message using a Twilio template.
 * @param {string} toPhoneNumber - Recipient's phone number in E.164 format (e.g., "whatsapp:+6281234567890")
 * @param {object} contentVariables - Object with variables for the template.
 *                                    Example: { "1": name, "2": customerPhoneNumber, ... }
 * @returns {Promise<object>} Twilio message object on success.
 * @throws {Error} If message sending fails.
 */
const sendWhatsappTemplateMessage = async (
  toPhoneNumber,
  templateVariables
) => {
  if (!toPhoneNumber) {
    throw new Error("Recipient phone number (toPhoneNumber) is required.");
  }
  if (!templateVariables || typeof templateVariables !== "object") {
    throw new Error("Template variables object is required.");
  }

  try {
    const message = await twilioClient.messages.create({
      from: fromWhatsappNumber,
      contentSid: contentSid,
      contentVariables: JSON.stringify(templateVariables), // Must be a JSON string
      to: toPhoneNumber,
    });
    console.log(
      `WhatsApp message sent to ${toPhoneNumber}, SID: ${message.sid}`
    );
    return message;
  } catch (error) {
    console.error(
      `Error sending WhatsApp message to ${toPhoneNumber}:`,
      error.message
    );
    // Rethrow or handle more gracefully depending on application needs
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

export default {
  sendWhatsappTemplateMessage,
};
