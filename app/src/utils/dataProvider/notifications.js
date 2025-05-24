import api from "./base";

/**
 * Calls the backend to send a WhatsApp invoice notification.
 * @param {object} data - The data payload for the notification.
 *                        Expected to include: customerName, customerPhoneNumber,
 *                        orderTotal, orderDate, invoiceLink, transactionId.
 * @param {string} token - The user's authentication token.
 * @param {AbortController} [controller] - Optional AbortController for the request.
 * @returns {Promise<object>} API response.
 */
export const sendWhatsappInvoiceNotification = (data, token, controller) => {
  return api.post("/apiv1/notifications/send-whatsapp-invoice", data, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller?.signal, // Make controller optional
  });
};
