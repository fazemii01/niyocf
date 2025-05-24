import twilioHelper from "../helpers/twilioHelper.js";
import { format } from "date-fns"; // For formatting date

const sendWhatsappInvoiceNotification = async (req, res) => {
  const {
    customerName,
    customerPhoneNumber, // Expected in E.164 format, e.g., "whatsapp:+628123..."
    orderTotal,
    orderDate, // Should be a date string or timestamp
    invoiceLink,
    transactionId,
  } = req.body;

  // Basic validation
  if (
    !customerName ||
    !customerPhoneNumber ||
    !orderTotal ||
    !orderDate ||
    !invoiceLink ||
    !transactionId
  ) {
    return res.status(400).json({
      status: 400,
      msg: "Missing required fields for WhatsApp notification.",
    });
  }

  // Format variables for Twilio template
  // Based on user feedback:
  // 1: Name (customer name)
  // 2: Number (customer phone number - for display, not the 'to' field)
  // 3: Total (order total)
  // 4: Date (buying date)
  // 5: Link to invoice
  // 6: ID Transaction
  // 7: Link to invoice (same as 5)

  let formattedOrderDate;
  try {
    // Assuming orderDate might be a timestamp or ISO string, format it
    formattedOrderDate = format(new Date(orderDate), "MM/dd/yyyy");
  } catch (e) {
    console.error("Invalid orderDate format:", orderDate, e);
    formattedOrderDate = "N/A"; // Fallback if date formatting fails
  }

  // Ensure customerPhoneNumber for the 'to' field is correctly formatted and prefixed.
  let e164TargetNumber = customerPhoneNumber;
  if (e164TargetNumber.startsWith("0")) {
    e164TargetNumber = `+62${e164TargetNumber.substring(1)}`;
  } else if (e164TargetNumber.startsWith("62")) {
    e164TargetNumber = `+${e164TargetNumber}`;
  } else if (!e164TargetNumber.startsWith("+")) {
    // If it's a local number not starting with 0 (e.g. 8xxxx) and not +
    // This might need more sophisticated parsing or assumptions.
    // For now, if it doesn't start with 0 or +, assume it might be missing +62
    // Or, if it's already a full E.164 number from another country, this logic is too simple.
    // Given the example, focusing on 08 -> +628.
    // A common case is numbers stored as "628..." without the "+".
  }

  const toWhatsappNumber = e164TargetNumber.startsWith("whatsapp:")
    ? e164TargetNumber // If it somehow already has it (e.g. from profile)
    : `whatsapp:${e164TargetNumber}`;

  const templateVariables = {
    1: customerName,
    2: customerPhoneNumber, // Use original customerPhoneNumber for display in message template
    3: `Rp.${Number(orderTotal).toLocaleString("id-ID")}`, // Format total as currency
    4: formattedOrderDate,
    5: invoiceLink,
    6: transactionId.toString(),
    7: invoiceLink,
  };

  try {
    await twilioHelper.sendWhatsappTemplateMessage(
      toWhatsappNumber,
      templateVariables
    );
    res.status(200).json({
      status: 200,
      msg: "WhatsApp invoice notification sent successfully.",
    });
  } catch (error) {
    console.error("Controller error sending WhatsApp notification:", error);
    res.status(500).json({
      status: 500,
      msg: "Failed to send WhatsApp invoice notification.",
      error: error.message,
    });
  }
};

export default {
  sendWhatsappInvoiceNotification,
};
