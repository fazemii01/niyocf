import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { connect } from "react-redux";
import { Link } from "react-router-dom"; // Added for potential links

import loadingImage from "../../assets/images/loading.svg";
// import productPlaceholder from "../../assets/images/placeholder-image.webp"; // Not used in table
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import {
  getTransactions,
  setTransactionDone,
  deleteTransactionById,
  setTransactionPending,
  getTransactionDetail, // Added for invoice image
  deleteMultipleTransactions, // Added for bulk delete
} from "../../utils/dataProvider/transaction";
import useDocumentTitle from "../../utils/documentTitle";
import { n_f, formatDateTime, getEmailUsername } from "../../utils/helpers"; // Added getEmailUsername
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client"; // For rendering invoice off-screen
import Invoice from "../../components/Invoice"; // Import Invoice component

const ManageOrder = (props) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for "Mark as Done" modal
  const [transactionToMarkDone, setTransactionToMarkDone] = useState(null);
  const [isMarkingDone, setIsMarkingDone] = useState(false);

  // State for "Delete" modal
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for "Mark as Pending" modal
  const [transactionToMarkPending, setTransactionToMarkPending] =
    useState(null);
  const [isMarkingPending, setIsMarkingPending] = useState(false);

  // State for checkboxes
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  // State for bulk action confirmation modals
  const [showBulkDoneModal, setShowBulkDoneModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  useDocumentTitle("Kelola Pesanan"); // Translated

  // Removed useMemo for controller, each fetch will manage its own.

  const fetchOrders = () => {
    // This function is now primarily for manual refresh
    const refreshController = new AbortController();
    setLoading(true);
    getTransactions(
      { page: 1, limit: 100 },
      props.userInfo.token,
      refreshController
    )
      .then((result) => {
        setOrders(result.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Order refresh fetch canceled.");
          // setLoading(false) might be needed here if cancellation is frequent
          return;
        }
        setLoading(false);
        toast.error("Gagal memuat ulang data pesanan."); // Translated
        console.error(err);
      });
    // Note: This refreshController is not explicitly aborted on component unmount here,
    // as it's tied to a handler action. If the component unmounts during this specific
    // refresh, the request might complete in the background. This is often acceptable.
  };

  useEffect(() => {
    // Effect for initial load and token changes
    const effectController = new AbortController();
    setLoading(true);
    getTransactions(
      { page: 1, limit: 100 },
      props.userInfo.token,
      effectController
    )
      .then((result) => {
        setOrders(result.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Initial order fetch canceled by effect cleanup.");
          return; // setLoading(false) is not called, component might be unmounting
        }
        setLoading(false);
        toast.error("Gagal mengambil data pesanan.");
        console.error(err);
      });

    return () => {
      effectController.abort();
    };
  }, [props.userInfo.token]); // Only depends on token now

  const handleSelectAllOrders = (event) => {
    if (event.target.checked) {
      const allOrderIds = new Set(orders.map((order) => order.id));
      setSelectedOrders(allOrderIds);
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(orderId)) {
        newSelected.delete(orderId);
      } else {
        newSelected.add(orderId);
      }
      return newSelected;
    });
  };

  const openDoneModal = (orderId) => setTransactionToMarkDone(orderId);
  const closeDoneModal = () => setTransactionToMarkDone(null);

  const openPendingModal = (orderId) => setTransactionToMarkPending(orderId);
  const closePendingModal = () => setTransactionToMarkPending(null);

  const handleMarkAsDone = async () => {
    if (!transactionToMarkDone) return;
    setIsMarkingDone(true);
    try {
      // setTransactionDone and deleteTransactionById can take an optional controller
      // For simplicity here, not passing one for these specific actions.
      // If cancellation of these specific actions is needed, a controller could be created and passed.
      await setTransactionDone(
        transactionToMarkDone.toString(),
        props.userInfo.token
        // controller // Removed controller from here
      ); // API expects string or comma-separated string
      toast.success(
        `Pesanan #${transactionToMarkDone} berhasil ditandai selesai.`
      );
      fetchOrders(); // Refresh list
    } catch (err) {
      toast.error("Gagal menandai pesanan selesai.");
      console.error(err);
    } finally {
      setIsMarkingDone(false);
      closeDoneModal();
    }
  };

  const handleMarkAsPending = async () => {
    if (!transactionToMarkPending) return;
    setIsMarkingPending(true);
    try {
      await setTransactionPending(
        transactionToMarkPending.toString(),
        props.userInfo.token
      );
      toast.success(
        `Pesanan #${transactionToMarkPending} berhasil ditandai pending.`
      );
      fetchOrders(); // Refresh list
    } catch (err) {
      toast.error("Gagal menandai pesanan pending.");
      console.error(err);
    } finally {
      setIsMarkingPending(false);
      closePendingModal();
    }
  };

  const openDeleteModal = (orderId) => setTransactionToDelete(orderId);
  const closeDeleteModal = () => setTransactionToDelete(null);

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTransactionById(
        transactionToDelete,
        props.userInfo.token /*, controller */
      ); // Controller removed
      toast.success(`Pesanan #${transactionToDelete} berhasil dihapus.`);
      fetchOrders(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.msg || "Gagal menghapus pesanan.");
      console.error(err);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const handleBulkAction = async (actionType) => {
    if (selectedOrders.size === 0) {
      toast.error("Tidak ada pesanan yang dipilih.");
      return;
    }

    const orderIds = Array.from(selectedOrders);
    setIsProcessingBulk(true);

    try {
      if (actionType === "selesai") {
        await setTransactionDone(orderIds, props.userInfo.token);
        toast.success(`${orderIds.length} pesanan berhasil ditandai selesai.`);
      } else if (actionType === "delete") {
        await deleteMultipleTransactions(orderIds, props.userInfo.token); // Using the new bulk delete function
        toast.success(`${orderIds.length} pesanan berhasil dihapus.`);
      }
      fetchOrders(); // Refresh the list
      setSelectedOrders(new Set()); // Clear selection
    } catch (err) {
      toast.error(`Gagal melakukan aksi bulk ${actionType}.`);
      console.error(`Bulk ${actionType} error:`, err);
    } finally {
      setIsProcessingBulk(false);
      setShowBulkDoneModal(false);
      setShowBulkDeleteModal(false);
    }
  };

  const handleDownloadInvoiceImage = async (orderItem) => {
    toast("Generating JPG...", { icon: "⏳" });
    try {
      // Fetch full transaction details if necessary
      // const detailController = new AbortController();
      // const detailResult = await getTransactionDetail(orderItem.id, props.userInfo.token, detailController);
      // const transactionDetails = detailResult.data.data[0];
      // For now, using orderItem and mocking/deriving missing parts for simplicity in this step
      const transactionDetails = orderItem;

      const companyDetails = {
        companyName: "Niyo Coffee",
        companyAddress: "123 Coffee Street",
        companyCityStateZip: "Jakarta, Indonesia 12345",
        taxRate: 0.11, // 11% example
      };

      const itemsForInvoice = transactionDetails.products.map((p) => ({
        description: p.product_name,
        quantity: p.qty,
        unitPrice: p.subtotal / p.qty,
      }));

      const calculatedSubtotal = itemsForInvoice.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      const invoiceData = {
        invoiceId: transactionDetails.id,
        ...companyDetails,
        clientName: transactionDetails.receiver_name,
        clientAddress: transactionDetails.delivery_address || "N/A",
        clientCityStateZip: "",
        items: itemsForInvoice,
        subtotal: calculatedSubtotal,
        discount: transactionDetails.discount_amount || 0,
        paymentMethod: transactionDetails.payment_name || "N/A",
      };

      const invoiceElement = document.createElement("div");
      invoiceElement.id = `invoice-print-${transactionDetails.id}`;
      invoiceElement.style.position = "absolute";
      invoiceElement.style.left = "-9999px";
      invoiceElement.style.width = "800px";
      invoiceElement.style.backgroundColor = "white"; // Ensure background for JPG
      document.body.appendChild(invoiceElement);

      const root = ReactDOM.createRoot(invoiceElement);
      // Wrap Invoice in a div that ensures all styles are applied if Invoice itself is transparent
      root.render(
        <div style={{ padding: "20px", backgroundColor: "white" }}>
          <Invoice invoiceData={invoiceData} />
        </div>
      );

      await new Promise((resolve) => setTimeout(resolve, 500)); // Allow component to render

      html2canvas(invoiceElement.firstChild, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 0.9); // Quality 0.9 for JPG

          const link = document.createElement("a");
          link.href = imgData;
          link.download = `invoice-${transactionDetails.id}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          root.unmount();
          document.body.removeChild(invoiceElement);
          toast.success("Invoice JPG downloaded!");
        })
        .catch((err) => {
          console.error("Error generating JPG with html2canvas:", err);
          toast.error("Failed to generate JPG.");
          root.unmount();
          if (document.getElementById(invoiceElement.id)) {
            document.body.removeChild(invoiceElement);
          }
        });
    } catch (error) {
      console.error("Error preparing invoice data for JPG:", error);
      toast.error("Failed to prepare invoice for JPG.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="py-7 flex flex-col gap-5 items-center justify-center bg-gray-100 min-h-[calc(100vh-128px)]">
          <img src={loadingImage} alt="Memuat..." className="w-16 h-16" />
          <p className="text-center text-gray-700">
            Mohon tunggu, mengambil data pesanan...
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {/* "Mark as Done" Confirmation Modal */}
      <Modal isOpen={transactionToMarkDone !== null} onClose={closeDoneModal}>
        <p className="text-lg font-semibold mb-2">Konfirmasi Selesai</p>
        <p>
          Apakah Anda yakin ingin menandai Pesanan #{transactionToMarkDone}{" "}
          sebagai telah diproses?
        </p>
        <div className="mt-4 mx-auto space-x-2">
          <button
            onClick={handleMarkAsDone}
            className="btn btn-primary"
            disabled={isMarkingDone}
          >
            {isMarkingDone ? "Memproses..." : "Ya"}
          </button>
          <button
            onClick={closeDoneModal}
            className="btn btn-outline"
            disabled={isMarkingDone}
          >
            Batal
          </button>
        </div>
      </Modal>

      {/* "Mark as Pending" Confirmation Modal */}
      <Modal
        isOpen={transactionToMarkPending !== null}
        onClose={closePendingModal}
      >
        <p className="text-lg font-semibold mb-2">Konfirmasi Pending</p>
        <p>
          Apakah Anda yakin ingin menandai Pesanan #{transactionToMarkPending}{" "}
          sebagai pending?
        </p>
        <div className="mt-4 mx-auto space-x-2">
          <button
            onClick={handleMarkAsPending}
            className="btn btn-warning" // Changed to warning color
            disabled={isMarkingPending}
          >
            {isMarkingPending ? "Memproses..." : "Ya, Tandai Pending"}
          </button>
          <button
            onClick={closePendingModal}
            className="btn btn-outline"
            disabled={isMarkingPending}
          >
            Batal
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={transactionToDelete !== null} onClose={closeDeleteModal}>
        <p className="text-lg font-semibold mb-2">Konfirmasi Penghapusan</p>
        <p>Apakah Anda yakin ingin menghapus Pesanan #{transactionToDelete}?</p>
        <p className="text-sm text-red-600">
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-4 mx-auto space-x-2">
          <button
            onClick={handleDeleteTransaction}
            className="btn btn-error"
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
          <button
            onClick={closeDeleteModal}
            className="btn btn-outline"
            disabled={isDeleting}
          >
            Batal
          </button>
        </div>
      </Modal>

      {/* Bulk Mark as Done Modal */}
      <Modal
        isOpen={showBulkDoneModal}
        onClose={() => setShowBulkDoneModal(false)}
        disabled={isProcessingBulk}
      >
        <p className="text-lg font-semibold mb-2">Konfirmasi Bulk Selesai</p>
        <p>
          Apakah Anda yakin ingin menandai {selectedOrders.size} pesanan
          terpilih sebagai selesai?
        </p>
        <div className="mt-4 mx-auto space-x-2">
          <button
            onClick={() => handleBulkAction("selesai")}
            className="btn btn-primary"
            disabled={isProcessingBulk}
          >
            {isProcessingBulk ? "Memproses..." : "Ya, Tandai Selesai"}
          </button>
          <button
            onClick={() => setShowBulkDoneModal(false)}
            className="btn btn-outline"
            disabled={isProcessingBulk}
          >
            Batal
          </button>
        </div>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        disabled={isProcessingBulk}
      >
        <p className="text-lg font-semibold mb-2">Konfirmasi Bulk Hapus</p>
        <p>
          Apakah Anda yakin ingin menghapus {selectedOrders.size} pesanan
          terpilih?
        </p>
        <p className="text-sm text-red-600">
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-4 mx-auto space-x-2">
          <button
            onClick={() => handleBulkAction("delete")}
            className="btn btn-error"
            disabled={isProcessingBulk}
          >
            {isProcessingBulk ? "Memproses..." : "Ya, Hapus"}
          </button>
          <button
            onClick={() => setShowBulkDeleteModal(false)}
            className="btn btn-outline"
            disabled={isProcessingBulk}
          >
            Batal
          </button>
        </div>
      </Modal>

      <main className="bg-gray-50 min-h-[calc(100vh-100px)]">
        {" "}
        {/* Adjusted min-height */}
        <div className="global-px pt-10 pb-24">
          {" "}
          {/* Increased bottom padding */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Kelola Pesanan</h1>
            <p className="text-gray-600">
              Lihat dan kelola semua pesanan pelanggan.
            </p>
          </section>
          {selectedOrders.size > 0 && !loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-blue-700 font-medium">
                {selectedOrders.size} pesanan dipilih.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowBulkDoneModal(true)}
                  className="btn btn-sm btn-success text-white normal-case"
                  disabled={isProcessingBulk}
                >
                  {isProcessingBulk
                    ? "Memproses..."
                    : `Tandai Selesai (${selectedOrders.size})`}
                </button>
                <button
                  onClick={() => setShowBulkDeleteModal(true)}
                  className="btn btn-sm btn-error text-white normal-case"
                  disabled={isProcessingBulk}
                >
                  {isProcessingBulk
                    ? "Memproses..."
                    : `Hapus (${selectedOrders.size})`}
                </button>
              </div>
            </div>
          )}
          {orders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-xl text-gray-500">
                Tidak ada pesanan untuk ditampilkan.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto pb-8 pr-8">
              {" "}
              {/* Added pr-8 */} {/* Added pb-8 */}
              <table className="table table-fixed w-full table-zebra">
                <thead>
                  <tr>
                    <th className="p-4 w-12">
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={
                            orders.length > 0 &&
                            selectedOrders.size === orders.length &&
                            orders.every((order) =>
                              selectedOrders.has(order.id)
                            )
                          }
                          onChange={handleSelectAllOrders}
                          disabled={orders.length === 0 || isProcessingBulk}
                          title={
                            orders.length > 0
                              ? selectedOrders.size === orders.length &&
                                orders.every((order) =>
                                  selectedOrders.has(order.id)
                                )
                                ? "Batal Pilih Semua"
                                : "Pilih Semua"
                              : "Tidak ada pesanan untuk dipilih"
                          }
                        />
                      </label>
                    </th>
                    <th className="p-4 text-left">ID Pesanan</th>
                    <th className="p-4 text-left">Pelanggan</th>
                    <th className="p-4 text-left">Tanggal</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center w-56">Aksi</th>{" "}
                    {/* Added w-56 for explicit width */}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((orderItem) => (
                    <tr key={orderItem.id} className="hover">
                      <td className="p-4 border-b border-gray-200">
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={selectedOrders.has(orderItem.id)}
                            onChange={() => handleSelectOrder(orderItem.id)}
                          />
                        </label>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <Link
                          to={`/history/${orderItem.id}`}
                          className="text-primary hover:underline"
                        >
                          #{orderItem.id}
                        </Link>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        {orderItem.receiver_name ||
                          getEmailUsername(orderItem.receiver_email)}
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        {formatDateTime(orderItem.transaction_time)}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-right">
                        {n_f(orderItem.grand_total)}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            orderItem.status_id === 1
                              ? "bg-yellow-200 text-yellow-800" // Pending
                              : orderItem.status_id === 2
                              ? "bg-green-200 text-green-800" // Selesai (Done)
                              : "bg-gray-200 text-gray-800" // Other statuses (e.g., 3 if it's used for something else)
                          }`}
                        >
                          {orderItem.status_name}
                        </span>
                      </td>
                      <td className="p-5 border-b border-gray-200 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          {orderItem.status_id === 1 && (
                            <button
                              onClick={() => openDoneModal(orderItem.id)}
                              className="btn btn-xs btn-outline btn-success normal-case"
                              title="Tandai Selesai"
                            >
                              Selesai
                            </button>
                          )}
                          {orderItem.status_id === 2 && ( // If status is "Done"
                            <button
                              onClick={() => openPendingModal(orderItem.id)}
                              className="btn btn-xs btn-outline btn-warning normal-case"
                              title="Tandai Pending"
                            >
                              Pending
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDownloadInvoiceImage(orderItem)
                            }
                            className="btn btn-xs btn-outline btn-accent normal-case"
                            title="Download Invoice JPG"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => openDeleteModal(orderItem.id)}
                            className="btn btn-xs btn-outline btn-error normal-case"
                            title="Hapus Pesanan"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Basic Pagination (can be enhanced later) */}
          {/* <div className="mt-8 flex justify-center">
            <div className="btn-group">
              <button className="btn" disabled>«</button>
              <button className="btn">Halaman 1</button>
              <button className="btn" disabled>»</button>
            </div>
          </div> */}
        </div>
      </main>
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

// const mapDispatchToProps = {}; // Not needed if not dispatching actions from here

export default connect(mapStateToProps)(ManageOrder);
