import express from "express";
import notificationsController from "../controllers/notifications.controller.js";
import authMiddleware from "../middlewares/auth.js"; // Assuming auth.check is the correct middleware

const notificationsRouter = express.Router();

// POST endpoint to send WhatsApp invoice notification
// This should be protected, e.g., by ensuring the user is logged in (auth.check)
// If only specific roles can trigger this, auth.admin or other role checks might be needed.
// For now, assuming any authenticated user who completes a transaction can trigger it for themselves.
notificationsRouter.post(
  "/send-whatsapp-invoice",
  authMiddleware.check, // Protect the endpoint
  notificationsController.sendWhatsappInvoiceNotification
);

export default notificationsRouter;
