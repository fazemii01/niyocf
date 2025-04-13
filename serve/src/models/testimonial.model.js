import db from "../configs/pg.js";

const testimonialModel = {
  async getAll() {
    const result = await db.query("SELECT * FROM testimonials ORDER BY id DESC");
    return result.rows;
  },

  async getById(id) {
    const result = await db.query("SELECT * FROM testimonials WHERE id = $1", [id]);
    return result.rows[0];
  },

  async create({ name, location, rating, text }) {
    const result = await db.query(
      "INSERT INTO testimonials(name, location, rating, text) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, location, rating, text]
    );
    return result.rows[0];
  },

  async update(id, { name, location, rating, text }) {
    const result = await db.query(
      "UPDATE testimonials SET name = $1, location = $2, rating = $3, text = $4 WHERE id = $5 RETURNING *",
      [name, location, rating, text, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query("DELETE FROM testimonials WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  },
};

export default testimonialModel;