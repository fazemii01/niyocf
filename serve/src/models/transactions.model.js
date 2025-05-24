import db from "../helpers/postgre.js";

function index(req) {
  return new Promise((resolve, reject) => {
    // const limit = `LIMIT ${!isNaN(req.query.limit) ? req.query.limit : 10}`;
    const sql = `SELECT 
    t.id, 
    u.email as receiver_email, 
    up.display_name as receiver_name, 
    pm.id as payment_id, 
    pm.fee as payment_fee, 
    -- d.name as delivery, -- Removed delivery
    -- d.fee as delivery_fee, -- Removed delivery
    t.grand_total,
    json_agg(
      json_build_object(
        'product_id', p.id,
        'product_name', p.name,
        'product_img', p.img,
        -- 'size_id', ps.id, -- Removed size
        -- 'size', ps.name, -- Removed size
        'qty', tps.qty,
        'subtotal', tps.subtotal -- Assuming subtotal is now directly in tps
      )
    ) as products,
    count(*) OVER() as total_count
  FROM 
    transactions t
    JOIN users u ON t.user_id = u.id
    JOIN user_profile up ON t.user_id = up.user_id
    JOIN payments pm ON t.payment_id = pm.id
    -- JOIN deliveries d ON t.delivery_id = d.id -- Removed delivery JOIN
    JOIN transaction_product_size tps ON tps.transaction_id = t.id
    JOIN products p ON tps.product_id = p.id
    -- JOIN product_size ps ON tps.size_id = ps.id -- Removed size JOIN
  GROUP BY 
    t.id, 
    u.email, 
    up.display_name, 
    pm.id, 
    pm.fee 
    -- d.name, -- Removed delivery
    -- d.fee -- Removed delivery
    `; // Semicolon was inside the string, moved out if this is the end of SQL

    db.query(sql, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function list(id_transaction) {
  return new Promise((resolve, reject) => {
    // Updated SQL to remove product_size references
    const sql = `SELECT ROW_NUMBER() OVER() AS number, p.name as product_name -- Removed ps.name as size
    FROM transaction_product_size tps
    JOIN transactions t ON tps.transaction_id = t.id
    JOIN products p ON tps.product_id = p.id
    -- JOIN product_size ps ON tps.size_id = ps.id -- Removed JOIN with product_size
    WHERE tps.transaction_id = $1`;

    db.query(sql, [id_transaction], (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

const createTransaction = (client, body, userId) => {
  return new Promise((resolve, reject) => {
    // delivery_id is removed from destructuring and SQL query
    const { payment_id, promo_id, notes, address } = body;
    const sql =
      "INSERT INTO transactions (user_id, payment_id, promo_id, notes, shipping_address) values ($1, $2, $3, $4, $5) RETURNING id";
    const values = [
      userId,
      payment_id,
      // delivery_id, // Removed
      promo_id || 0,
      notes,
      address,
    ];
    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const createDetailTransaction = (client, body, transactionId) => {
  return new Promise(async (resolve, reject) => {
    const { products } = body;
    // Modified to remove product_size
    let sql = `INSERT INTO transaction_product_size (transaction_id, product_id, qty, subtotal) values`; // Removed size_id
    let values = [];
    for (let i = 0; i < products.length; i++) {
      const { product_id, qty } = products[i]; // Removed size_id from destructuring
      const resultProduct = await client.query(
        `SELECT price FROM products WHERE id = $1`,
        [product_id]
      );

      // Add check for product existence
      if (!resultProduct.rows[0]) {
        throw new Error(
          `Product with id ${product_id} not found during transaction detail creation.`
        );
      }
      // Removed query for product_size

      // Subtotal calculation no longer uses size price
      const subtotal = resultProduct.rows[0].price * qty;

      if (values.length) sql += ", ";
      // Adjusted placeholders for fewer columns (4 instead of 5)
      sql += `($${1 + 4 * i}, $${2 + 4 * i}, $${3 + 4 * i}, $${4 + 4 * i})`;
      values.push(transactionId, product_id, qty, subtotal); // Removed size_id
    }

    // console.log(sql);
    // console.log(values);
    await client.query(sql, values, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const grandTotal = (client, transactionId) => {
  return new Promise((resolve, reject) => {
    client.query(
      "SELECT SUM(subtotal) as total_subtotal FROM transaction_product_size WHERE transaction_id = $1",
      [transactionId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        const totalSubtotal = result.rows[0].total_subtotal;
        resolve(totalSubtotal);
      }
    );
  });
};

const updateGrandTotal = (client, transactionId, grandTotal) => {
  return new Promise((resolve, reject) => {
    client.query(
      "UPDATE transactions SET grand_total = $2 WHERE id = $1 ",
      [transactionId, grandTotal],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
};

const store = (req) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO history 
      (user_id, product_id, quantity, discount, promo_id, payment_method, price, total_price) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, (SELECT price FROM products WHERE id = $2), $3 * ((SELECT price FROM products WHERE id = $2) - ((SELECT price FROM products WHERE id = $2) * $4/100)))
      RETURNING *`;

    const data = req.body;
    const values = [
      data.user_id,
      data.product_id,
      data.quantity,
      data.discount,
      data.promo_id,
      data.payment_method,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getTransactions = ({ status_id }, perPage, offset) => {
  return new Promise((resolve, reject) => {
    let add = "";
    const values = [perPage, offset];
    if (status_id) {
      add = "WHERE t.status_id = $3";
      values.push(status_id);
    }

    const sql = `SELECT 
    t.id, 
    u.email as receiver_email, 
    up.display_name as receiver_name, 
    t.shipping_address as delivery_address,
    t.notes as notes,
    t.status_id as status_id,
    s.name as status_name,
    t.transaction_time, -- Added transaction_time
    pm.id as payment_id, 
    pm.fee as payment_fee, 
    -- d.name as delivery_name, -- Removed
    -- d.fee as delivery_fee, -- Removed
    t.grand_total,
    json_agg(
      json_build_object(
        'product_id', p.id,
        'product_name', p.name,
        'product_img', p.img,
        -- 'size_id', ps.id, -- Removed
        -- 'size', ps.name, -- Removed
        'qty', tps.qty,
        'subtotal', tps.subtotal
      )
    ) as products
    FROM 
      transactions t
      JOIN users u ON t.user_id = u.id
      JOIN status s ON t.status_id = s.id
      JOIN user_profile up ON t.user_id = up.user_id
      JOIN payments pm ON t.payment_id = pm.id
      -- JOIN deliveries d ON t.delivery_id = d.id -- Removed
      JOIN transaction_product_size tps ON tps.transaction_id = t.id
      JOIN products p ON tps.product_id = p.id
      -- JOIN product_size ps ON tps.size_id = ps.id -- Removed
    ${add}
    GROUP BY 
      t.id, 
      u.email, 
      up.display_name, 
      pm.id, 
      pm.fee,
      s.id
      -- d.name, -- Removed
      -- d.fee -- Removed
    ORDER BY t.id DESC
    LIMIT $1
    OFFSET $2;
    `;
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const getMetaTransactions = ({ status_id }, perPage, page) => {
  return new Promise((resolve, reject) => {
    let add = "";
    const values = [];
    if (status_id) {
      add = "WHERE status_id = $1";
      values.push(status_id);
    }
    const sql = `SELECT COUNT(*) as total_data  FROM transactions t ${add}`;
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      const totalData = result.rows[0].total_data;
      const totalPage = Math.ceil(result.rows[0].total_data / perPage);

      function getPrevLink(baseUrl, limit, page) {
        if (page === 1) {
          return null;
        } else {
          const prevPage = page - 1;
          const prevUrl = `${baseUrl}?limit=${limit}&page=${prevPage}`;
          return prevUrl;
        }
      }

      function getNextLink(baseUrl, limit, page, totalPage) {
        if (page >= totalPage) {
          return null;
        } else {
          const nextPage = page + 1;
          const nextUrl = `${baseUrl}?limit=${limit}&page=${nextPage}`;
          return nextUrl;
        }
      }

      const baseUrl = "/apiv1/userPanel/transactions";
      const prevLink = getPrevLink(baseUrl, perPage, page);
      const nextLink = getNextLink(baseUrl, perPage, page, totalPage);

      const meta = {
        totalData,
        perPage: perPage,
        currentPage: page,
        totalPage,
        prev: prevLink,
        next: nextLink,
      };
      resolve(meta);
    });
  });
};

const getTransactionByUserId = (userId, perPage, offset) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    t.id, 
    u.email as receiver_email, 
    up.display_name as receiver_name, 
    pm.id as payment_id, 
    pm.fee as payment_fee, 
    -- d.name as delivery_name, -- Removed
    t.shipping_address as delivery_address, -- This can remain if address is general
    s.name as status_name,
    t.status_id as status_id,
    -- d.fee as delivery_fee, -- Removed
    t.grand_total,
    json_agg(
      json_build_object(
        'product_id', p.id,
        'product_name', p.name,
        'product_img', p.img,
        -- 'size_id', ps.id, -- Removed
        -- 'size', ps.name, -- Removed
        'qty', tps.qty,
        'subtotal', tps.subtotal
      )
    ) as products
FROM 
    transactions t
    JOIN users u ON t.user_id = u.id
    JOIN user_profile up ON t.user_id = up.user_id
    JOIN status s ON t.status_id = s.id
    JOIN payments pm ON t.payment_id = pm.id
    -- JOIN deliveries d ON t.delivery_id = d.id -- Removed
    JOIN transaction_product_size tps ON tps.transaction_id = t.id
    JOIN products p ON tps.product_id = p.id
    -- JOIN product_size ps ON tps.size_id = ps.id -- Removed
  WHERE 
    t.user_id = $1
  GROUP BY 
    t.id, 
    u.email, 
    up.display_name, 
    pm.id,
    s.name,
    s.id,
    pm.fee
    -- d.name, -- Removed
    -- d.fee -- Removed
    ORDER BY t.id DESC
  LIMIT $2
  OFFSET $3;
    `;
    const values = [userId, perPage, offset];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const getMetaTransactionByUserId = (userId, perPage, page) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) as total_data  FROM transactions WHERE user_id = $1`;
    db.query(sql, [userId], (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      const totalData = result.rows[0].total_data;
      const totalPage = Math.ceil(result.rows[0].total_data / perPage);

      function getPrevLink(baseUrl, limit, page) {
        if (page === 1) {
          return null;
        } else {
          const prevPage = page - 1;
          const prevUrl = `${baseUrl}?limit=${limit}&page=${prevPage}`;
          return prevUrl;
        }
      }

      function getNextLink(baseUrl, limit, page, totalPage) {
        if (page >= totalPage) {
          return null;
        } else {
          const nextPage = page + 1;
          const nextUrl = `${baseUrl}?limit=${limit}&page=${nextPage}`;
          return nextUrl;
        }
      }

      const baseUrl = "/apiv1/userPanel/transactions";
      const prevLink = getPrevLink(baseUrl, perPage, page);
      const nextLink = getNextLink(baseUrl, perPage, page, totalPage);

      const meta = {
        totalData,
        perPage: perPage,
        currentPage: page,
        totalPage,
        prev: prevLink,
        next: nextLink,
      };
      resolve(meta);
    });
  });
};

function show(req) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    t.id, 
    u.email as receiver_email, 
    up.display_name as receiver_name, 
    t.shipping_address as delivery_address,
    t.notes as notes,
    t.status_id as status_id,
    s.name as status_name,
    t.transaction_time as transaction_time,
    pm.id as payment_id, 
    pm.name as payment_name, 
    pm.fee as payment_fee, 
    -- d.name as delivery_name, -- Removed
    -- d.fee as delivery_fee, -- Removed
    t.grand_total,
    json_agg(
      json_build_object(
        'product_id', p.id,
        'product_name', p.name,
        'product_img', p.img,
        -- 'size_id', ps.id, -- Removed
        -- 'size', ps.name, -- Removed
        'qty', tps.qty,
        'subtotal', tps.subtotal
      )
    ) as products
    FROM 
      transactions t
      JOIN users u ON t.user_id = u.id
      JOIN status s ON t.status_id = s.id
      JOIN user_profile up ON t.user_id = up.user_id
      JOIN payments pm ON t.payment_id = pm.id
      -- JOIN deliveries d ON t.delivery_id = d.id -- Removed
      JOIN transaction_product_size tps ON tps.transaction_id = t.id
      JOIN products p ON tps.product_id = p.id
      -- JOIN product_size ps ON tps.size_id = ps.id -- Removed
    WHERE
      t.id = $1
    GROUP BY 
      t.id, 
      u.email, 
      up.display_name, 
      pm.id, 
      pm.fee,
      s.id,
      -- d.name, -- Removed
      -- d.fee, -- Removed
      pm.name
      ORDER BY t.id DESC`;
    const values = [req.params.transactionsId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function update(req) {
  return new Promise((resolve, reject) => {
    const { historyId } = req.params;
    const sql = `UPDATE history 
    SET 
       user_id = $1, 
       product_id = $2, 
       quantity = $3, 
       discount = $4, 
       promo_id = $5, 
       payment_method = $6, 
       price = (SELECT price FROM products WHERE id = $2), 
       total_price = $3 * ((SELECT price FROM products WHERE id = $2) - ((SELECT price FROM products WHERE id = $2) * $4/100))
    WHERE 
       id = $7 
    RETURNING *`;
    const data = req.body;
    const values = [
      data.user_id,
      data.product_id,
      data.quantity,
      data.discount,
      data.promo_id,
      data.payment_method,
      historyId,
    ];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

function destroy(req) {
  return new Promise((resolve, reject) => {
    const { historyId } = req.params;
    const sql = `DELETE FROM history WHERE id = $1 RETURNING *`;
    const values = [historyId];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

const changeStatusToDone = (ids) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE transactions
    SET status_id = 2
    WHERE id = ANY($1::int[]) RETURNING *`;
    db.query(sql, [ids], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const changeStatusToPending = (ids) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE transactions
    SET status_id = 1
    WHERE id = ANY($1::int[]) RETURNING *`;
    db.query(sql, [ids], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// New function to delete a transaction and its details
const removeTransactionById = async (client, transactionId) => {
  // It's crucial that this is called within a DB transaction (BEGIN/COMMIT/ROLLBACK in controller)
  // First, delete from transaction_product_size (child table)
  const deleteDetailsSql = `DELETE FROM transaction_product_size WHERE transaction_id = $1 RETURNING *`;
  await client.query(deleteDetailsSql, [transactionId]);

  // Then, delete from transactions (parent table)
  const deleteTransactionSql = `DELETE FROM transactions WHERE id = $1 RETURNING *`;
  const result = await client.query(deleteTransactionSql, [transactionId]);
  return result;
};

const removeMultipleTransactionsByIds = async (client, transactionIds) => {
  // Ensure transactionIds is an array of numbers if they come as strings
  const ids = transactionIds
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id) && id !== null);
  if (ids.length === 0) {
    // Consider if throwing an error or returning a specific status is better
    // For now, returning an object indicating no rows affected, similar to single delete.
    return { rowCount: 0, rows: [] };
  }

  // Delete from transaction_product_size (child table)
  // No RETURNING * needed here as we primarily care about the parent deletion result.
  const deleteDetailsSql = `DELETE FROM transaction_product_size WHERE transaction_id = ANY($1::int[])`;
  await client.query(deleteDetailsSql, [ids]);

  // Then, delete from transactions (parent table)
  const deleteTransactionSql = `DELETE FROM transactions WHERE id = ANY($1::int[]) RETURNING *`;
  const result = await client.query(deleteTransactionSql, [ids]);
  return result; // Contains rowCount and rows of deleted transactions
};

export default {
  index,
  show,
  store,
  update,
  destroy, // This existing one seems to be for a 'history' table
  removeTransactionById, // New function for 'transactions' table
  list,
  createDetailTransaction,
  getTransactionByUserId,
  getMetaTransactionByUserId,
  createTransaction,
  grandTotal,
  updateGrandTotal,
  changeStatusToDone,
  changeStatusToPending, // Added new function
  getTransactions,
  getMetaTransactions,
  removeMultipleTransactionsByIds, // Added new bulk delete function
};
