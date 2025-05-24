import galleryModel from "../models/gallery.model.js";
import cloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";

const galleryController = {
  async index(req, res) {
    try {
      const data = await galleryModel.index();
      res.json({ status: "success", data });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  async store(req, res) {
    try {
      const { description, date } = req.body;

      console.log("GALLERY BODY:", req.body);
      console.log("GALLERY FILE:", req.file?.originalname);
      console.log("GALLERY BUFFER SIZE:", req.file?.buffer?.length);

      if (!req.file || !req.file.buffer) {
        return res
          .status(400)
          .json({ status: "error", message: "Image file is required." });
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "gallery" },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const imageUrl = await streamUpload();

      const data = await galleryModel.store({
        image: imageUrl,
        description,
        date: new Date(date).toISOString(), // ✅ safe for PostgreSQL
      });

      return res.status(201).json({ status: "success", data });
    } catch (error) {
      console.error("❌ GALLERY STORE ERROR:", error);
      return res.status(500).json({ status: "error", message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { description, date } = req.body;
      const id = req.params.id;
      let imageUrl = null;

      if (req.file) {
        const streamUpload = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "gallery" },
              (error, result) => {
                if (result) resolve(result.secure_url);
                else reject(error);
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });

        imageUrl = await streamUpload();
      }

      const data = await galleryModel.update(id, {
        image: imageUrl,
        description,
        date: new Date(date).toISOString(), // ✅ same fix here too
      });

      res.json({ status: "success", data });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      const data = await galleryModel.destroy(id);
      res.json({ status: "success", data });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  },
};

export default galleryController;
