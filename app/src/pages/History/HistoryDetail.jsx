import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios"; // For axios.isCancel

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getTransactionDetail } from "../../utils/dataProvider/transaction";
import useDocumentTitle from "../../utils/documentTitle";
import { formatDateTime, n_f } from "../../utils/helpers";
import loadingImage from "../../assets/images/loading.svg";
import productPlaceholder from "../../assets/images/placeholder-image.webp";

const initialTransactionState = {
  isLoading: true,
  isError: false,
  id: 0,
  receiver_email: "",
  receiver_name: "",
  delivery_address: "", // May be empty if delivery was removed
  notes: "",
  status_id: 0,
  status_name: "",
  transaction_time: "",
  payment_id: 0,
  payment_name: "",
  payment_fee: 0,
  // delivery_name: "", // Removed as per no delivery
  // delivery_fee: 0, // Removed
  grand_total: 0,
  products: [],
};

function HistoryDetail() {
  const { id: transactionId } = useParams();
  const navigate = useNavigate();
  const authInfo = useSelector((state) => state.userInfo);
  const [transaction, setTransaction] = useState(initialTransactionState);

  useDocumentTitle(
    transaction.isLoading
      ? "Memuat Riwayat..." // Translated
      : `Detail Riwayat Transaksi #${transaction.id}` // Translated
  );

  // const detailController = useMemo(...); // Removed memoized AbortController

  useEffect(() => {
    if (!transactionId) {
      setTransaction({
        ...initialTransactionState,
        isLoading: false,
        isError: true,
      });
      return;
    }

    const controller = new AbortController(); // Create AbortController inside useEffect
    setTransaction(initialTransactionState); // Reset to loading state for new ID

    const fetchTransaction = async () => {
      try {
        const result = await getTransactionDetail(
          transactionId,
          authInfo.token,
          controller // Pass the local controller
        );
        if (result.data.data && result.data.data.length > 0) {
          setTransaction({
            isLoading: false,
            isError: false,
            ...result.data.data[0],
          });
        } else {
          setTransaction({
            ...initialTransactionState,
            isLoading: false,
            isError: true,
            id: transactionId,
          }); // Not found
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
          return;
        }
        console.error("Failed to fetch transaction detail:", error);
        setTransaction({
          ...initialTransactionState,
          isLoading: false,
          isError: true,
          id: transactionId,
        });
      }
    };

    fetchTransaction();

    return () => {
      controller.abort(); // Abort the local controller on cleanup
    };
  }, [transactionId, authInfo.token]); // Removed detailController from dependencies

  if (transaction.isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] flex justify-center items-center">
          <img src={loadingImage} alt="Memuat..." className="w-16 h-16" />{" "}
          {/* Translated */}
        </main>
        <Footer />
      </>
    );
  }

  if (transaction.isError) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Kesalahan</h2>{" "}
          {/* Translated */}
          <p className="text-lg text-gray-700 mb-6">
            Tidak dapat memuat detail untuk transaksi #{transactionId}.
            Transaksi mungkin tidak ada atau terjadi kesalahan.{" "}
            {/* Translated */}
          </p>
          <button
            onClick={() => navigate("/history")}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-focus"
          >
            Kembali ke Riwayat {/* Translated */}
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="global-px py-8 min-h-[calc(100vh-128px)]">
        {" "}
        {/* 128px approx Header+Footer height */}
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-3xl font-bold text-gray-800">
              Detail Transaksi #{transaction.id} {/* Translated */}
            </h1>
            <Link
              to={`/invoice/${transaction.id}`}
              className="bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
            >
              Lihat Invoice {/* Translated */}
            </Link>
          </div>

          <section className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Informasi Pesanan {/* Translated */}
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Status:</strong> {transaction.status_name}
                </p>
                <p>
                  <strong>Tanggal:</strong> {/* Translated */}
                  {formatDateTime(transaction.transaction_time)}
                </p>
                <p>
                  <strong>Metode Pembayaran:</strong> {transaction.payment_name}{" "}
                  {/* Translated */}
                </p>
                {transaction.notes && (
                  <p>
                    <strong>Catatan:</strong> {transaction.notes}{" "}
                    {/* Translated */}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Informasi Pengguna {/* Translated */}
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Nama:</strong> {transaction.receiver_name}{" "}
                  {/* Translated */}
                </p>
                <p>
                  <strong>Email:</strong> {transaction.receiver_email}
                </p>
                {transaction.delivery_address && (
                  <p>
                    <strong>Alamat Pengiriman:</strong> {/* Translated */}
                    {transaction.delivery_address}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Produk Dipesan {/* Translated */}
            </h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk {/* Translated */}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah {/* Translated */}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transaction.products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={product.product_img || productPlaceholder}
                              alt={product.product_name}
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {product.product_name}
                            </div>
                            {/* Size info removed: <div className="text-xs text-gray-500">{product.size}</div> */}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {product.qty}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {n_f(product.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex justify-end items-start pt-4 border-t mt-6">
            {" "}
            {/* items-start & mt-6 */}
            <div className="text-right space-y-1 w-full max-w-xs">
              {" "}
              {/* Added w-full and max-w-xs for better layout */}
              <div className="flex justify-between">
                <span className="text-md text-gray-600">Subtotal Produk:</span>
                <span className="text-md text-gray-800">
                  {n_f(transaction.subtotal_amount)}
                </span>
              </div>
              {transaction.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-md text-gray-600">
                    Diskon ({transaction.promo_name || "Promo"}):
                  </span>
                  <span className="text-md text-red-600">
                    -{n_f(transaction.discount_amount)}
                  </span>
                </div>
              )}
              {transaction.payment_fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-md text-gray-600">
                    Biaya Pembayaran:
                  </span>
                  <span className="text-md text-gray-800">
                    {n_f(transaction.payment_fee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-300 mt-2">
                {" "}
                {/* Separator for grand total */}
                <span className="text-xl font-bold text-gray-800">
                  Total Keseluruhan:
                </span>
                <span className="text-xl font-bold text-gray-800">
                  {n_f(transaction.grand_total)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default HistoryDetail;
