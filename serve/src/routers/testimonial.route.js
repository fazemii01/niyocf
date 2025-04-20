import express from "express";
import testimonialController from "../controllers/testimonial.controller.js";
import memoryUpload from "../middlewares/memoryUpload.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", testimonialController.index);
router.get("/:id", testimonialController.show);
router.post(
  "/",
  auth.check,
  auth.admin,
  memoryUpload,
  testimonialController.store
);
router.patch(
  "/:id",
  auth.check,
  auth.admin,
  memoryUpload,
  testimonialController.update
);
router.delete("/:id", auth.check, auth.admin, testimonialController.destroy);

export default router;
