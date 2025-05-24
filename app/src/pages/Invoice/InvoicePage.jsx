import React, { useEffect, useState, useMemo, useRef } from "react"; // Added useRef
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; // For authInfo.token
import axios from "axios"; // For axios.isCancel

import Invoice from "../../components/Invoice";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../utils/documentTitle";
import { getTransactionDetail } from "../../utils/dataProvider/transaction"; // Import real data fetcher
import html2canvas from "html2canvas"; // Added import
import { toast } from "react-hot-toast"; // Added import for notifications

// Removed generateRandomInvoiceId as it's not needed for real data

const InvoicePage = () => {
  const { invoiceId: routeInvoiceId } = useParams();
  const authInfo = useSelector((state) => state.userInfo); // Get token
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState("Memuat Invoice..."); // Translated
  const invoicePrintRef = useRef(null); // Added ref for the printable area

  useDocumentTitle(pageTitle);

  useEffect(() => {
    if (!routeInvoiceId) {
      setError("Tidak ada ID Invoice yang diberikan di URL."); // Translated
      setPageTitle("Error - Tidak Ada ID Invoice"); // Translated
      return;
    }

    const controller = new AbortController();
    setPageTitle(`Invoice #${routeInvoiceId}`); // Translated (or use "Invoice #")
    setInvoiceData(null); // Reset invoice data while fetching new one
    setError(null); // Reset error

    const fetchAndSetInvoiceData = async () => {
      try {
        console.log(`Fetching real data for invoice: ${routeInvoiceId}`);
        const result = await getTransactionDetail(
          routeInvoiceId,
          authInfo.token,
          controller
        );

        if (result.data && result.data.data && result.data.data.length > 0) {
          const transaction = result.data.data[0];

          const items = transaction.products.map((product) => ({
            description: product.product_name,
            quantity: Number(product.qty),
            unitPrice:
              Number(product.qty) > 0
                ? Number(product.subtotal) / Number(product.qty)
                : 0,
          }));

          const calculatedSubtotal = items.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
          );

          const transformedData = {
            invoiceId: transaction.id.toString(),
            companyName: "Niyo Coffee", // Static data
            companyAddress: "Jl. Cokro Sujono, Jogoyudan", // Static data
            companyCityStateZip: "Kec. Lumajang 67315 ", // Static data
            clientName: transaction.receiver_name || "Valued Customer",
            clientAddress:
              transaction.delivery_address || "N/A (Pickup or No Address)",
            clientCityStateZip: "", // Placeholder, not in transaction data
            items: items,
            subtotal: calculatedSubtotal,
            discount: 0, // Not in current transaction data, default to 0
            taxRate: 0, // Set taxRate to 0 as per user request
            paymentMethod: transaction.payment_name || "N/A",
          };
          setInvoiceData(transformedData);
        } else {
          setError(`Invoice #${routeInvoiceId} tidak ditemukan.`); // Translated
          setPageTitle(`Error - Invoice Tidak Ditemukan`); // Translated
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request to fetch invoice canceled");
          return;
        }
        console.error("Failed to fetch real invoice data:", err);
        setError("Tidak dapat memuat detail Invoice. Silakan coba lagi nanti."); // Translated
        setPageTitle("Error - Tidak Dapat Memuat Invoice"); // Translated
      }
    };

    fetchAndSetInvoiceData();

    return () => {
      controller.abort();
    };
  }, [routeInvoiceId, authInfo.token, setPageTitle]);

  const handleDownloadInvoiceImage = async () => {
    if (!invoicePrintRef.current || !invoiceData) {
      toast.error("Invoice content not available for download.");
      return;
    }
    toast("Generating JPG...", { icon: "⏳" });
    try {
      // Ensure a white background for the canvas if the component itself or its parent is transparent
      const canvas = await html2canvas(invoicePrintRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // If images are from other origins
        backgroundColor: "#ffffff", // Explicit white background
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.9); // Quality 0.9

      const link = document.createElement("a");
      link.href = imgData;
      link.download = `invoice-${invoiceData.invoiceId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Invoice JPG downloaded!");
    } catch (err) {
      console.error("Error generating JPG:", err);
      toast.error("Failed to generate JPG.");
    }
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Kesalahan</h1>{" "}
          {/* Translated */}
          <p className="text-gray-700">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!invoiceData) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-gray-700">Memuat detail Invoice...</p>{" "}
          {/* Translated */}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 text-right">
          <button
            onClick={handleDownloadInvoiceImage}
            className="btn btn-accent normal-case"
            disabled={!invoiceData}
          >
            Download Invoice
          </button>
        </div>
        <div ref={invoicePrintRef}>
          {" "}
          {/* Added ref to this wrapper div */}
          <Invoice invoiceData={invoiceData} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default InvoicePage;
