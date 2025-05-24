import api from "./base";

export const createTransaction = (
  {
    // delivery_id removed from destructured parameters
    payment_id = 1,
    // delivery_id = 1, // Removed
    status_id = 3, // status_id is still sent, backend model doesn't use it for INSERT but controller might
    address = "Table no 4",
    notes = "Makkah",
  },
  products = [],
  token,
  controller
) => {
  const body = {
    payment_id,
    // delivery_id, // Removed from body sent to API
    status_id,
    products,
    address,
    notes,
  };
  return api.post(`/apiv1/transactions`, body, {
    signal: controller.signal,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTransactionById = (transactionId, token, controller) => {
  return api.delete(`/apiv1/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller?.signal, // Make controller optional for simple deletes
  });
};

export const getTransactions = (
  options = {}, // Changed to options object
  token,
  controller
) => {
  const { status_id, page = 1 } = options; // Destructure from options
  const params = { page };
  if (status_id !== undefined) {
    // Only add status_id to params if it's provided
    params.status_id = status_id;
  }

  return api.get("/apiv1/transactions", {
    params, // Use the conditionally built params object
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  });
};

export const setTransactionDone = (ids = [], token, controller) => {
  let convertedIds = ids.toString();
  if (typeof ids === "object") {
    convertedIds = ids.join(",");
  }
  console.log(convertedIds);
  return api.patch(
    "/apiv1/transactions/changeStatus",
    {
      transactions: convertedIds,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller?.signal, // Made controller optional
    }
  );
};

export const setTransactionPending = (ids = [], token, controller) => {
  let convertedIds = ids.toString();
  if (typeof ids === "object") {
    convertedIds = ids.join(",");
  }
  return api.patch(
    "/apiv1/transactions/changeStatusToPending",
    {
      transactions: convertedIds,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller?.signal, // Made controller optional
    }
  );
};

export const deleteMultipleTransactions = (
  transactionIds = [],
  token,
  controller
) => {
  // API expects an array of IDs in the body, e.g., { transactionIds: [...] }
  return api.post(
    // Using POST as defined in the router
    `/apiv1/transactions/bulk-delete`,
    { transactionIds }, // Send IDs in the request body
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller?.signal, // Make controller optional
    }
  );
};

export const getTransactionHistory = (
  { page = "1", limit = "9" },
  token,
  controller
) => {
  return api.get("/apiv1/userPanel/transactions", {
    params: {
      page,
      limit,
    },
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  });
};

export const getTransactionDetail = (transactionId, token, controller) => {
  return api.get(`/apiv1/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  });
};
