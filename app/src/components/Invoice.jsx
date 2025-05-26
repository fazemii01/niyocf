import React from "react";

const Invoice = ({ invoiceData }) => {
  if (!invoiceData) {
    return <div>Memuat data Invoice...</div>;
  }

  const {
    invoiceId,
    companyName,
    companyAddress,
    companyCityStateZip,
    clientName,
    clientAddress,
    clientCityStateZip,
    items,
    subtotal,
    discount, // Assuming discount is a monetary value
    taxRate, // Assuming taxRate is a percentage e.g., 0.10 for 10%
    paymentMethod,
    paymentFee, // Added
    grandTotal, // Added
    promoName, // Added
  } = invoiceData;

  // const taxAmount = subtotal * taxRate; // taxRate is 0, so taxAmount is 0
  // The grandTotal from invoiceData is the authoritative final total.
  // We display components: subtotal, discount, paymentFee, and then grandTotal.

  // Helper function to format currency to IDR
  const formatIDR = (amount) => {
    if (typeof amount !== "number") {
      return "Rp 0";
    }
    return `Rp ${amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold uppercase">Invoice</h1>
          <p className="text-gray-600">Invoice #{invoiceId}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">{companyName}</h2>
          <p className="text-gray-600">{companyAddress}</p>
          <p className="text-gray-600">{companyCityStateZip}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Tagih Kepada:</h3>
        <p className="text-gray-700">{clientName}</p>
        <p className="text-gray-700">{clientAddress}</p>
        <p className="text-gray-700">{clientCityStateZip}</p>
      </div>

      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3 border-b-2 border-gray-300">
              Deskripsi
            </th>
            <th className="text-center p-3 border-b-2 border-gray-300">
              Jumlah
            </th>
            <th className="text-right p-3 border-b-2 border-gray-300">
              Harga Satuan
            </th>
            <th className="text-right p-3 border-b-2 border-gray-300">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-3 border-b border-gray-200">
                {item.description}
              </td>
              <td className="text-center p-3 border-b border-gray-200">
                {item.quantity}
              </td>
              <td className="text-right p-3 border-b border-gray-200">
                {formatIDR(item.unitPrice)}
              </td>
              <td className="text-right p-3 border-b border-gray-200">
                {formatIDR(item.quantity * item.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-full md:w-1/3">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-gray-800 font-semibold">
              {formatIDR(subtotal)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">
                Diskon {promoName ? `(${promoName})` : "(Promo)"}:
              </span>
              <span className="text-red-500 font-semibold">
                -{formatIDR(discount)}
              </span>
            </div>
          )}
          {/* Tax is currently 0, so taxAmount line can be omitted or kept conditional if tax might be added later */}
          {/* {taxRate > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">
                Pajak ({(taxRate * 100).toFixed(0)}%):
              </span>
              <span className="text-gray-800 font-semibold">
                {formatIDR(subtotal * taxRate)}
              </span>
            </div>
          )} */}
          {paymentFee > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Biaya Pembayaran:</span>
              <span className="text-gray-800 font-semibold">
                {formatIDR(paymentFee)}
              </span>
            </div>
          )}
          <hr className="my-2 border-gray-300" />
          <div className="flex justify-between text-xl font-bold">
            <span>Total Keseluruhan:</span>
            <span>{formatIDR(grandTotal)}</span>{" "}
            {/* Use grandTotal from props */}
          </div>
        </div>
      </div>

      {paymentMethod && (
        <div className="mt-8 pt-4 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-2">Informasi Pembayaran:</h3>
          <p className="text-gray-700">Metode Pembayaran: {paymentMethod}</p>
        </div>
      )}

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Terima kasih atas kepercayaan Anda!</p>
        <p>Jika ada pertanyaan mengenai Invoice ini, silakan hubungi kami.</p>
      </div>
    </div>
  );
};

export default Invoice;
