import express from "express";

import galleryController from "../controllers/gallery.controller.js";
import auth from "../middlewares/auth.js";
import memoryUpload from "../middlewares/memoryUpload.js";

const router = express.Router();

// ✅ GET all gallery items (MUST be before :id route)
router.get("/", galleryController.index);

// POST create new gallery item
router.post("/", auth.check, auth.admin, memoryUpload, galleryController.store);

// PATCH update existing gallery item
router.patch(
  "/:id",
  auth.check,
  auth.admin,
  memoryUpload,
  galleryController.update
);

// DELETE a gallery item
router.delete("/:id", auth.check, auth.admin, galleryController.destroy);

// ✅ GET /:id route to fetch a single gallery item (only if id is numeric)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await import("../models/gallery.model.js").then((mod) =>
      mod.default.show(id)
    );
    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Gallery item not found" });
    }
    res.json({ status: "success", data: data[0] });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
