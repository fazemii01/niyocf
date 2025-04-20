import db from "../helpers/postgre.js";

const testimonialModel = {
  async getAll() {
    const result = await db.query(
      "SELECT * FROM testimonials ORDER BY id DESC"
    );
    return result.rows;
  },

  async getById(id) {
    const result = await db.query("SELECT * FROM testimonials WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  },

  async create({ name, location, rating, text, image }) {
    const result = await db.query(
      `INSERT INTO testimonials (name, location, rating, text, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, location, rating, text, image || null]
    );
    return result.rows[0];
  },

  async update(id, { name, location, rating, text, image }) {
    const result = await db.query(
      `UPDATE testimonials
       SET name = $1,
           location = $2,
           rating = $3,
           text = $4,
           image = COALESCE($5, image),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, location, rating, text, image || null, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      "DELETE FROM testimonials WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  },
};

export default testimonialModel;
