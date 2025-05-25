import React, { useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPromos } from "../../utils/dataProvider/promo";

import loadingImage from "../../assets/images/loading.svg";
import productPlaceholder from "../../assets/images/placeholder-image.webp";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import { cartActions } from "../../redux/slices/cart.slice";
import { createTransaction } from "../../utils/dataProvider/transaction";
import { sendWhatsappInvoiceNotification } from "../../utils/dataProvider/notifications"; // Import new function
import useDocumentTitle from "../../utils/documentTitle";
import { n_f } from "../../utils/helpers";

function Cart() {
  const userInfo = useSelector((state) => state.userInfo);
  const profile = useSelector((state) => state.profile);
  const cartRedux = useSelector((state) => state.cart);
  const cart = cartRedux.list;
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added missing navigate initialization
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null); // Changed remove state
  const [result, setResult] = useState("");
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({
    // ✅ declare only once
    payment: "",
    delivery_address: "",
    notes: "",
    phone_number: "",
    promo_id: null,
    coupon_code: "",
  });

  const originalTotal = cart.reduce((acc, cur) => acc + cur.price * cur.qty, 0);

  const appliedPromo =
    promos.length > 0 && form.promo_id
      ? promos.find((promo) => promo.id === form.promo_id)
      : null;

  const discountedTotal = appliedPromo
    ? Math.round(originalTotal * (1 - appliedPromo.discount / 100))
    : originalTotal;

  useEffect(() => {
    const controller = new AbortController();
    getPromos(controller)
      .then((res) => {
        setPromos(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to load promos", err);
      });

    return () => controller.abort();
  }, []);

  useDocumentTitle("My Cart");

  function onChangeForm(e) {
    return setForm((form) => {
      return {
        ...form,
        [e.target.name]: e.target.value,
      };
    });
  }
  function redeemCoupon() {
    const userCoupon = (form.coupon_code || "").trim().toUpperCase();

    const foundPromo = promos.find(
      (promo) => (promo.coupon_code || "").toUpperCase() === userCoupon
    );

    if (foundPromo) {
      setForm((form) => ({
        ...form,
        promo_id: foundPromo.id,
      }));
      toast.success(`Promo "${foundPromo.name}" applied successfully! 🎉`);
    } else {
      setForm((form) => ({
        ...form,
        promo_id: null,
      }));
      toast.error("Invalid coupon code ❌");
    }
  }

  useEffect(() => {
    if (profile.isFulfilled) {
      setForm((prevForm) => ({
        ...prevForm,
        phone_number: profile.data?.phone_number,
        delivery_address: profile.data?.address, // Keep for potential display if needed elsewhere
        notes: prevForm.notes || profile.data?.address || "", // Initialize notes (acting as delivery address)
      }));
    }
    // setIsLoading(true);
    //   getCart(userInfo.token)
    //     .then((res) => {
    //       setCart(res.data.data);
    //       setIsLoading(false);
    //     })
    //     .catch((err) => {
    //       setIsLoading(false);
    //       toast.error("Failed to fetch data");
    //     });
  }, [profile]);

  const Loading = (props) => {
    return (
      <section className="min-h-[80vh] flex items-center justify-center flex-col">
        <div>
          <img src={loadingImage} alt="" />
        </div>
      </section>
    );
  };

  const toggleEdit = () => setEditMode(!editMode);
  const saveEditInfo = () => {
    toggleEdit();
  };

  const disabled = form.payment === "";
  const controller = useMemo(() => new AbortController());
  const payHandler = () => {
    if (form.payment === "") return;
    if (userInfo.token === "") {
      toast.error("Login to continue transaction");
      navigate("/auth/login");
      return;
    }
    if (editMode) return toast.error("You have unsaved changes");
    if (cart.length < 1)
      return toast.error("Add at least 1 product to your cart");

    setIsLoading(true);

    createTransaction(
      {
        payment_id: form.payment,
        address: form.notes, // Use form.notes (from the input field) as the delivery address
        notes: "", // If there's no separate true "notes" field anymore, pass empty or remove if backend handles undefined
        promo_id: form.promo_id ? form.promo_id : null,
      },
      cart,
      userInfo.token,
      controller
    )
      .then((response) => {
        // Capture the response
        const transactionId = response.data?.data?.transactionId;
        toast.success("Transaksi berhasil dibuat"); // Translated
        dispatch(cartActions.resetCart());

        if (transactionId) {
          // Prepare data for WhatsApp notification
          const customerName =
            profile.data?.display_name || userInfo.name || "Pelanggan";
          // Ensure phone number is in E.164 format for Twilio, might need adjustment based on how it's stored/entered
          // The backend controller will prefix with "whatsapp:" if not already present.
          const customerPhoneNumber =
            form.phone_number || profile.data?.phone_number;
          const orderTotal = appliedPromo ? discountedTotal : originalTotal;
          const orderDate = new Date().toISOString(); // Current date as ISO string
          const invoiceLink = `${transactionId}`;

          if (customerPhoneNumber) {
            sendWhatsappInvoiceNotification(
              {
                customerName,
                customerPhoneNumber,
                orderTotal,
                orderDate,
                invoiceLink,
                transactionId,
              },
              userInfo.token
            )
              .then(() => {
                toast.success("Notifikasi WhatsApp terkirim!");
              })
              .catch((waErr) => {
                console.error("Failed to send WhatsApp notification:", waErr);
                toast.error("Gagal mengirim notifikasi WhatsApp.");
              });
          } else {
            toast.warn(
              "Nomor telepon tidak tersedia untuk notifikasi WhatsApp."
            );
          }
        } else {
          toast.error(
            "Transaction ID tidak ditemukan, tidak dapat mengirim notifikasi WhatsApp."
          );
        }

        navigate("/history"); // Navigate to history page as per new requirement
      })
      .catch((err) => {
        console.error("Transaction creation failed:", err); // More detailed console logging
        let errorMessage =
          "Terjadi kesalahan, silakan periksa koneksi internet Anda"; // Translated
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          // Keep original error message if it's specific and not a generic one
          errorMessage =
            err.message.includes("network") ||
            err.message.includes("NetworkError")
              ? "Terjadi kesalahan jaringan."
              : err.message;
        }
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const closeRemoveModal = () => {
    setProductToRemove(null); // Changed remove state
  };
  return (
    <>
      <Modal
        isOpen={productToRemove !== null} // Changed modal condition
        onClose={closeRemoveModal} // Changed onClose handler
        className="flex flex-col gap-y-5"
      >
        Are you sure to delete this item form your cart?
        <div className="mx-auto space-x-3">
          <button
            onClick={() => {
              if (productToRemove) {
                dispatch(
                  cartActions.removeFromCart({
                    product_id: productToRemove.product_id, // Use productToRemove state
                    // size_id: remove.size_id, // Removed size_id
                  })
                );
                setProductToRemove(null); // Reset remove state
              }
            }}
            className="btn btn-primary text-white"
          >
            Yes
          </button>
          <div onClick={closeRemoveModal} className="btn btn-error">
            No
          </div>
        </div>
      </Modal>
      <Header />

      <main className="bg-cart bg-cover bg-center">
        <div className="global-px  space-y-3 py-10">
          <section className="text-white lg:text-3xl text-2xl font-extrabold drop-shadow-lg text-center md:text-left">
            Checkout your item now!
          </section>
          <section className="flex flex-col md:flex-row lg:gap-16 gap-10">
            <aside className="flex-1 flex">
              <section className="flex bg-white rounded-lg p-5 lg:p-7 flex-col w-full">
                <div className="w-full my-4 lg:my-6">
                  <p className="text-tertiary font-bold text-xl lg:text-3xl text-center">
                    Order Summary
                  </p>
                </div>
                <section className="flex w-full flex-col gap-4 my-4">
                  {cart.map((list, idx) => {
                    // Removed sizeName logic
                    return (
                      <div
                        className="flex flex-row gap-2 lg:gap-5 w-full lg:text-lg items-center relative"
                        key={idx}
                      >
                        <aside className="flex-1">
                          <img
                            src={
                              isEmpty(list.img) ? productPlaceholder : list.img
                            }
                            alt={list.name}
                            className="aspect-square h-auto object-cover rounded-xl"
                          />
                        </aside>
                        <aside className="flex-[2_2_0%]">
                          <p className="font-semibold">{list.name}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (list.qty - 1 < 1)
                                  return setProductToRemove({
                                    // Changed to setProductToRemove
                                    product_id: list.product_id,
                                    // size_id: list.size_id, // Removed size_id
                                  });
                                dispatch(
                                  cartActions.decrementQty({
                                    product_id: list.product_id,
                                    // size_id: list.size_id, // Removed size_id
                                  })
                                );
                              }}
                              className="rounded-full bg-tertiary text-white font-bold w-6 h-6 items-center justify-center duration-200 hover:bg-primary-focus"
                            >
                              -
                            </button>
                            <p>x {list.qty}</p>
                            <button
                              onClick={() =>
                                dispatch(
                                  cartActions.incrementQty({
                                    product_id: list.product_id,
                                    // size_id: list.size_id, // Removed size_id
                                  })
                                )
                              }
                              className="rounded-full bg-tertiary text-white font-bold w-6 h-6 items-center justify-center duration-200 hover:bg-primary-focus"
                            >
                              +
                            </button>
                          </div>
                          {/* <p>{sizeName}</p> */}
                          {/* Removed sizeName display */}
                        </aside>
                        <aside className="flex-1">
                          <p className="text-right">
                            IDR {n_f(Number(list.price) * Number(list.qty))}
                          </p>
                        </aside>
                        <button
                          onClick={() =>
                            setProductToRemove({
                              // Changed to setProductToRemove
                              product_id: list.product_id,
                              // size_id: list.size_id, // Removed size_id
                            })
                          }
                          className="absolute top-2 right-2 rounded-full h-6 w-6 bg-tertiary text-white font-bold text-xs text-center flex"
                        >
                          <p className="m-auto">X</p>
                        </button>
                      </div>
                    );
                  })}
                </section>
                <hr />
                <section className="flex flex-col w-full my-4">
                  <div className="flex flex-row uppercase lg:text-lg">
                    <p className="flex-[2_2_0%]">Subtotal</p>
                    <p className="flex-1 lg:flex-none text-right">
                      IDR{" "}
                      {n_f(
                        cart.reduce((acc, cur) => acc + cur.price * cur.qty, 0)
                      )}
                    </p>
                  </div>
                  <div className="flex flex-row uppercase lg:text-lg">
                    <p className="flex-[2_2_0%]">Tax & Fees</p>
                    <p className="flex-1 lg:flex-none text-right">IDR 0</p>
                  </div>

                  <div className="flex flex-row uppercase lg:text-xl font-bold my-10 items-center">
                    <p className="flex-[2_2_0%]">Total</p>
                    <div className="flex flex-col lg:flex-row lg:gap-2 text-right">
                      {appliedPromo ? (
                        <>
                          <span className="line-through text-gray-500">
                            IDR {n_f(originalTotal)}
                          </span>
                          <span className="text-primary font-bold">
                            ➔ IDR {n_f(discountedTotal)}
                          </span>
                        </>
                      ) : (
                        <span className="text-primary font-bold">
                          IDR {n_f(originalTotal)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      name="coupon_code"
                      placeholder="Enter coupon code"
                      value={form.coupon_code || ""}
                      onChange={(e) =>
                        setForm((form) => ({
                          ...form,
                          coupon_code: e.target.value,
                        }))
                      }
                      className="input input-bordered w-full"
                    />
                    <button
                      type="button"
                      onClick={redeemCoupon}
                      className="btn btn-secondary w-full"
                    >
                      Redeem Coupon
                    </button>
                  </div>
                </section>
              </section>
            </aside>
            <aside className="flex-1 flex flex-col gap-5">
              <section className="text-white text-xl lg:text-2xl font-extrabold drop-shadow-lg text-center md:text-left relative items-center">
                Detail Informasi Anda
                <button
                  onClick={editMode ? saveEditInfo : toggleEdit}
                  className="absolute text-lg right-0 bottom-0 top-1 hover:underline"
                >
                  {editMode ? "save" : "edit"}
                </button>
              </section>
              <section className="bg-white rounded-xl  p-5 lg:p-7 space-y-2">
                {/* <div className="flex gap-1">
                  <b>Delivery</b> to
                  <input
                    value={form.delivery_address}
                    onChange={onChangeForm}
                    disabled={!editMode}
                    className="outline-none flex-1"
                    name="delivery_address"
                    placeholder="address..."
                  />
                </div> */}
                <hr />
                <label
                  htmlFor="cart-delivery-address"
                  className="text-sm text-gray-600 mb-1"
                >
                  Meja Nomor Berapa?
                </label>
                <textarea
                  id="cart-delivery-address"
                  value={form.notes} // This field now holds the delivery address
                  onChange={onChangeForm}
                  // disabled={!editMode} // Making it always editable, or remove disabled attribute
                  className="outline-none w-full border border-gray-300 rounded p-2 min-h-[60px]"
                  name="notes" // Ensure name matches state key 'notes'
                  placeholder="Enter Delivery Address..."
                />
                <hr />
                <input
                  value={form.phone_number}
                  onChange={onChangeForm}
                  disabled={!editMode}
                  className="outline-none"
                  name="phone_number"
                  placeholder="phone number..."
                />
              </section>
              <section className="text-white text-xl lg:text-2xl font-extrabold drop-shadow-lg text-center md:text-left relative">
                Payment method
              </section>
              <section className="bg-white rounded-xl  p-5 lg:p-7 space-y-3">
                <div className="flex gap-2 items-center">
                  <input
                    type="radio"
                    className="accent-tertiary w-4 h-4"
                    name="payment"
                    value="3"
                    id="paymentCod"
                    checked={form.payment === "3"}
                    onChange={onChangeForm}
                  />
                  <label
                    htmlFor="paymentCod"
                    className="flex items-center gap-2"
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="40" height="40" rx="10" fill="#C4C4C4" />
                      <rect width="40" height="40" rx="10" fill="#FFBA33" />
                      <rect
                        x="8"
                        y="10"
                        width="24"
                        height="21"
                        fill="url(#pattern0)"
                      />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_0_1"
                            transform="matrix(0.00195312 0 0 0.00223214 0 -0.0714286)"
                          />
                        </pattern>
                        <image
                          id="image0_0_1"
                          width="512"
                          height="512"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </svg>
                    Bayar Di tempat
                  </label>
                </div>
              </section>
              <button
                disabled={disabled}
                onClick={payHandler}
                className={`${
                  isLoading && "loading"
                } btn btn-block btn-primary text-white py-4 font-bold rounded-lg disabled:bg-opacity-100`}
              >
                Confirm and Pay
              </button>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Cart;
