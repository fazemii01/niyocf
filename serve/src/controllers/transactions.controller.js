import notification from "../helpers/notification.js";
import db from "../helpers/postgre.js";
import fcmModel from "../models/fcm.model.js";
import transactionsModel from "../models/transactions.model.js";

async function index(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * perPage;
    console.log(page, perPage, offset);

    const { status_id } = req.query;

    const meta = await transactionsModel.getMetaTransactions(
      { status_id },
      perPage,
      page
    );
    const result = await transactionsModel.getTransactions(
      { status_id },
      perPage,
      offset
    );
    res.status(200).json({
      status: 200,
      msg: "Fetch success",
      meta,
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

async function store(req, res) {
  const { authInfo, body } = req;

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    // Removed delivery_id from destructuring as it's no longer used for fee calculation here
    const { payment_id } = body;
    const result = await transactionsModel.createTransaction(
      client,
      body, // body still contains delivery_id from frontend dataProvider default, model will handle it
      authInfo.id
    );
    const transactionId = result.rows[0].id;
    await transactionsModel.createDetailTransaction(
      client,
      body,
      transactionId
    );
    const total = await transactionsModel.grandTotal(client, transactionId);

    // Removed deliveryFee fetching
    const paymentFeeResult = await client.query(
      // Renamed to paymentFeeResult for clarity
      `SELECT fee FROM payments WHERE id = $1`,
      [payment_id]
    );
    const paymentFee =
      paymentFeeResult.rows.length > 0
        ? Number(paymentFeeResult.rows[0].fee)
        : 0;

    const grandTotal =
      Number(total) +
      // Number(deliveryFee.rows[0].fee) + // Removed deliveryFee from grandTotal
      paymentFee;

    await transactionsModel.updateGrandTotal(client, transactionId, grandTotal);

    const result_token = await fcmModel.getAdminTokenFcm();
    if (result_token.rows.length > 0) {
      const tokens = result_token.rows.map((obj) => obj.token);
      console.log(tokens);
      // remote notification
      await notification.send(tokens, {
        title: "New Order Received!",
        body: "Hey dude! new order received, check it out!",
      });
    }
    // await client.query("ROLLBACK");

    await client.query("COMMIT");
    client.release();
    res.status(201).json({
      status: 201,
      msg: "Create Transaction Success",
      data: { transactionId: transactionId }, // Return the transactionId
    });
  } catch (err) {
    console.log(err.message);
    await client.query("ROLLBACK");
    client.release();
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
async function show(req, res) {
  try {
    const result = await transactionsModel.show(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

// params => query (search, filter, sort, paginasi) & path (get detail)
// query => req.query
// path => req.params
async function update(req, res) {
  try {
    const result = await transactionsModel.update(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: "Update success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function destroy(req, res) {
  try {
    const result = await transactionsModel.destroy(req);
    if (result.rows.length === 0) {
      res.status(404).json({
        msg: "Data not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
      msg: "Data was destroyed",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

async function statusDone(req, res) {
  try {
    const { transactions } = req.body;
    const id_array = transactions.split(",").map(function (item) {
      return item.trim();
    });

    const result = await transactionsModel.changeStatusToDone(id_array);

    const ids = result.rows.map((item) => item.user_id);

    const result_token = await fcmModel.getTokenFcmByUserId(ids);
    if (result_token.rows.length > 0) {
      const tokens = result_token.rows.map((obj) => obj.token);
      // remote notification
      await notification.send(tokens, {
        title: "Your order has been processed!",
        body: "Hey coffeeholic, your order has been has been successfully processed! Check it out :)",
      });
    }

    res.status(200).json({
      status: 200,
      msg: "Fetch data success",
      result: result.rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

// Removed the first export default block

async function adminDeleteTransaction(req, res) {
  const { transactionId } = req.params;
  if (!transactionId || isNaN(parseInt(transactionId))) {
    return res.status(400).json({
      status: 400,
      msg: "Invalid transaction ID provided.",
    });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await transactionsModel.removeTransactionById(
      client,
      parseInt(transactionId)
    );

    if (result.rowCount === 0) {
      // If removeTransactionById didn't throw but also didn't delete (e.g. ID not found)
      // This check depends on removeTransactionById throwing an error if ID not found, or returning rowCount.
      // Assuming it throws if critical, or returns rowCount for the transactions table deletion.
      await client.query("ROLLBACK"); // Rollback if no transaction was actually deleted
      return res.status(404).json({
        status: 404,
        msg: `Transaction with ID ${transactionId} not found.`,
      });
    }

    await client.query("COMMIT");
    res.status(200).json({
      status: 200,
      msg: `Transaction with ID ${transactionId} and its details deleted successfully.`,
      data: result.rows, // Optionally return deleted transaction data
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Error deleting transaction ${transactionId}:`, err.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error while deleting transaction.",
      error: err.message,
    });
  } finally {
    client.release();
  }
}

async function statusPending(req, res) {
  try {
    const { transactions } = req.body;
    const id_array = transactions.split(",").map(function (item) {
      return item.trim();
    });

    const result = await transactionsModel.changeStatusToPending(id_array);

    // Optional: Add notification logic here if needed, similar to statusDone
    // For now, keeping it simple.

    res.status(200).json({
      status: 200,
      msg: "Transaction status changed to pending successfully.",
      result: result.rows,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

async function bulkDeleteTransactionsHandler(req, res) {
  const { transactionIds } = req.body; // Expecting an array of IDs

  if (
    !transactionIds ||
    !Array.isArray(transactionIds) ||
    transactionIds.length === 0
  ) {
    return res.status(400).json({
      status: 400,
      msg: "Invalid or empty transaction IDs provided. Expects an array.",
    });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await transactionsModel.removeMultipleTransactionsByIds(
      client,
      transactionIds
    );

    if (result.rowCount === 0 && transactionIds.length > 0) {
      // This case means IDs were provided, but none were found/deleted.
      // It might not be an error if some IDs were invalid, but good to note.
      // If removeMultipleTransactionsByIds already handles empty `ids` array by returning rowCount 0,
      // this specific check might be redundant with the initial validation.
    }

    await client.query("COMMIT");
    res.status(200).json({
      status: 200,
      msg: `${result.rowCount} transaction(s) and their details deleted successfully.`,
      data: result.rows, // Optionally return data of deleted transactions
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Error bulk deleting transactions:`, err.message);
    res.status(500).json({
      status: 500,
      msg: "Internal Server Error while bulk deleting transactions.",
      error: err.message,
    });
  } finally {
    client.release();
  }
}

export default {
  index,
  show,
  store,
  update,
  destroy, // Existing destroy, seems to be for 'history' table
  statusDone,
  statusPending,
  adminDeleteTransaction,
  bulkDeleteTransactionsHandler, // Added new bulk delete handler
};
