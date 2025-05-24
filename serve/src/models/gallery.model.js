import db from "../helpers/postgre.js";

const galleryModel = {
  async index() {
    const result = await db.query("SELECT * FROM gallery ORDER BY id DESC");
    return result.rows;
  },

  async store({ image, description, date }) {
    const result = await db.query(
      `INSERT INTO gallery (image, description, date) VALUES ($1, $2, $3) RETURNING *`,
      [image, description, date]
    );
    return result.rows[0];
  },

  async update(id, { image, description, date }) {
    const result = await db.query(
      `UPDATE gallery SET image = $1, description = $2, date = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [image, description, date, id]
    );
    return result.rows[0];
  },

  async destroy(id) {
    const result = await db.query(
      "DELETE FROM gallery WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  },
};

export default galleryModel;
