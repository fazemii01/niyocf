import express from "express";

import transactionsController from "../controllers/transactions.controller.js";
import auth from "../middlewares/auth.js";

const transactionsRouter = express.Router();

transactionsRouter.post("/", auth.check, transactionsController.store); // create
transactionsRouter.get(
  "/",
  auth.check,
  auth.admin,
  transactionsController.index
); // read

transactionsRouter.get("/:transactionsId", transactionsController.show); // read
transactionsRouter.patch(
  "/changeStatus",
  auth.check,
  auth.admin,
  transactionsController.statusDone
); // change status

transactionsRouter.patch(
  "/changeStatusToPending",
  auth.check,
  auth.admin,
  transactionsController.statusPending
); // change status to pending

// New route for admin to delete a transaction
transactionsRouter.delete(
  "/:transactionId",
  auth.check,
  auth.admin,
  transactionsController.adminDeleteTransaction
);

transactionsRouter.post(
  // Or use DELETE if preferred and body is handled
  "/bulk-delete",
  auth.check,
  auth.admin,
  transactionsController.bulkDeleteTransactionsHandler
);

// transactionsRouter.patch("/:transactionsId", transactionsController.update); // update
// transactionsRouter.delete("/:transactionsId", transactionsController.destroy); // This was the old delete for 'history' table

export default transactionsRouter;
