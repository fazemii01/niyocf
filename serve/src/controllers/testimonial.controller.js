import testimonialModel from "../models/testimonial.model.js";
import cloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "testimonials" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const testimonialController = {
  async index(req, res) {
    try {
      const data = await testimonialModel.getAll();
      res.json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  async show(req, res) {
    try {
      const data = await testimonialModel.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ status: "error", message: "Not found" });
      }
      res.json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  async store(req, res) {
    try {
      const { name, location, rating, text } = req.body;
      if (!name || !location || !rating || !text) {
        return res
          .status(400)
          .json({ status: "error", message: "All fields required" });
      }

      let imageUrl = null;
      if (req.file?.buffer) {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      }

      const data = await testimonialModel.create({
        name,
        location,
        rating: parseFloat(rating),
        text,
        image: imageUrl,
      });

      res.status(201).json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { name, location, rating, text } = req.body;

      let imageUrl = null;
      if (req.file?.buffer) {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      }

      const data = await testimonialModel.update(req.params.id, {
        name,
        location,
        rating: rating ? parseFloat(rating) : null,
        text,
        image: imageUrl,
      });

      res.json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const data = await testimonialModel.delete(req.params.id);
      res.json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },
};

export default testimonialController;
