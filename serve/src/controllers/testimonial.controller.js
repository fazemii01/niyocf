import testimonialModel from "../models/testimonial.model.js";

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
      if (!data) return res.status(404).json({ status: "error", message: "Not found" });
      res.json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  async store(req, res) {
    try {
      const data = await testimonialModel.create(req.body);
      res.status(201).json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await testimonialModel.update(req.params.id, req.body);
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