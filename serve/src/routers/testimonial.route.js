import express from "express";
import testimonialController from "../controllers/testimonial.controller.js";

const router = express.Router();

router.get("/", testimonialController.index);
router.get("/:id", testimonialController.show);
router.post("/", testimonialController.store);
router.patch("/:id", testimonialController.update);
router.delete("/:id", testimonialController.destroy);

export default router;