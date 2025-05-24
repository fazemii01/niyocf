/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import loadingImage from "../../assets/images/loading.svg";
import lostImage from "../../assets/images/not_found.svg";
import productPlaceholder from "../../assets/images/placeholder-image.webp";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { cartActions } from "../../redux/slices/cart.slice";
import { getProductbyId } from "../../utils/dataProvider/products";
import useDocumentTitle from "../../utils/documentTitle";

function ProductDetail(props) {
  const [form, setForm] = useState({
    delivery: 0, // This seems unused, consider removing if not needed elsewhere
    count: 1,
    now: 0, // This seems unused
    time: "", // This seems unused
    // size: 1, // Removed size from form state
  });
  // const [cart, setCart] = useState([]); // Local cart state seems unused, Redux cart is primary
  const [detail, setDetail] = useState({
    price: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { productId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userInfo);
  const cartRedux = useSelector((state) => state.cart);
  const filteredCart = cartRedux.list.filter(
    (obj) => String(obj.product_id) === String(productId)
  );

  const controller = React.useMemo(() => new AbortController(), []);

  useEffect(() => {
    setIsLoading(true);
    getProductbyId(productId, controller)
      .then((response) => {
        setDetail(response.data.data[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        setNotFound(true);
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const NotFound = () => {
    return (
      <section className="w-full min-h-[80vh] flex justify-center flex-col gap-10 text-center py-5">
        <img src={lostImage} alt="404" className="h-72" />
        <div className="flex flex-col gap-3">
          <p className="text-xl font-poppins font-semibold">
            Product Not Found
          </p>
          <NavLink to={"/products/"}>
            <button className="rounded-[25px] bg-secondary px-10 text-tertiary font-poppins font-semibold py-2">
              Back to Products
            </button>
          </NavLink>
        </div>
      </section>
    );
  };

  const Loading = () => {
    return (
      <section className="min-h-[80vh] flex items-center justify-center flex-col">
        <div>
          <img src={loadingImage} alt="" />
        </div>
      </section>
    );
  };

  function onChangeForm(e) {
    return setForm((form) => {
      return {
        ...form,
        [e.target.name]: e.target.value,
      };
    });
  }

  const countIncrement = () => {
    return setForm((form) => {
      return {
        ...form,
        count: form.count + 1,
      };
    });
  };
  const countDecrement = () => {
    if (form.count > 1) {
      return setForm((form) => {
        return {
          ...form,
          count: form.count - 1,
        };
      });
    }
  };
  const checkoutHandler = () => {
    if (cartRedux.list.length < 1) {
      // Use cartRedux.list here
      return toast.error("Add at least 1 item to cart"); // Updated message
    }
    navigate("/cart");
    // toast.promise(
    //   addCart(detail.id, cart, userInfo.token).then((res) => {
    //     return res;
    //   }),
    //   {
    //     loading: "Adding to cart...",
    //     success: () => {
    //       navigate("/cart");
    //       return "Succesfully add to cart";
    //     },
    //     error: "Error while adding to cart",
    //   }
    // );
  };

  const handleAddToCart = () => {
    // Removed size from newItem and related checks
    const newItem = {
      count: Number(form.count),
    };

    if (newItem.count < 1) {
      toast.error("Invalid count");
      return;
    }

    dispatch(
      cartActions.addtoCart({
        product_id: detail.id,
        // size_id: newItem.size, // Removed size_id
        qty: form.count,
        name: detail.name,
        img: detail.img,
        price: detail.price, // Assuming detail.price is the single price now
      })
    );

    // Removed local cart state update logic as it was based on size and seems redundant with Redux
    // setCart((prevItems) => { ... });

    setForm((prevForm) => ({ ...prevForm, count: 1 })); // Reset count, keep other form fields if any
  };

  const Detail = (props) => {
    const p = props.data;
    const desc = !p.desc
      ? "This product does not have a description yet."
      : p.desc;
    useDocumentTitle(p.name);
    return (
      <main className="global-px py-10">
        <nav className="flex flex-row list-none gap-1">
          <li className="after:content-['>'] after:font-poppins font-semibold text-primary">
            <NavLink to="/products">Favorite & Promo </NavLink>
          </li>
          <li className="text-tertiary font-poppins font-semibold">{p.name}</li>
        </nav>
        <section className="flex my-10 gap-16 flex-col md:flex-row">
          <aside className="flex-1 flex flex-col items-center justify-between gap-10">
            <img
              src={p.img ? p.img : productPlaceholder}
              alt={p.name}
              className="aspect-square object-cover rounded-full w-64"
            />
          </aside>
          <aside className="flex-1 flex flex-col gap-5 justify-between">
            <p className="font-black text-5xl uppercase w-full text-center mb-4">
              {p.name}
            </p>
            <p className="text-tertiary text-lg text-justify md:min-h-[200px]">
              {desc}
            </p>

            <div className="flex justify-between items-center">
              <div className="custom-number-input h-10 w-32">
                <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1v text-tertiary font-bold">
                  <button
                    onClick={countDecrement}
                    className=" bg-white h-full w-20 rounded-l cursor-pointer outline-none border-gray-400 border-2 border-r-0"
                  >
                    <span className="m-auto text-xl">−</span>
                  </button>
                  <input
                    type="number"
                    className="outline-none focus:outline-none text-center w-full bg-white text-md  md:text-basecursor-default flex items-center border-gray-400 border-2"
                    name="custom-input-number"
                    value={form.count}
                    onChange={onChangeForm}
                    min="1"
                  ></input>
                  <button
                    onClick={countIncrement}
                    className="bg-white h-full w-20 rounded-r cursor-pointer border-gray-400 border-2 border-l-0"
                  >
                    <span className="m-auto text-xl">+</span>
                  </button>
                </div>
              </div>
              <p className="font-bold text-xl">
                IDR {p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </p>
            </div>
            <button
              className="mt-4 block bg-tertiary text-white font-bold text-lg py-4 rounded-xl"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="block bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed text-tertiary font-bold text-lg py-4 rounded-xl"
              disabled
            >
              Ask a Staff
            </button>
          </aside>
        </section>
        {/* Entire section for size selection and cart summary preview removed */}
        {/* <section className="flex flex-col md:flex-row gap-8"> ... </section> */}
        {/* The section below that showed cart items with sizes is also removed for simplicity.
           If a cart preview is still desired here, it needs to be re-implemented without sizes.
           For now, removing it to avoid errors with size_id.
        */}
        <section className="flex flex-col md:flex-row gap-8 mt-10">
          {/* Placeholder for if you want to add a simplified cart summary or other elements back */}
          {/* Example: Display total items in cart from Redux */}
          <aside className="flex-1 p-5 rounded-xl shadow-primary">
            <h3 className="font-bold text-xl mb-3">Order Summary</h3>
            <p>
              Items in cart:{" "}
              {cartRedux.list.reduce((acc, item) => acc + item.qty, 0)}
            </p>
            <button
              className="mt-4 w-full bg-primary text-white font-bold text-lg py-3 rounded-xl hover:bg-primary-focus"
              onClick={checkoutHandler}
              disabled={cartRedux.list.length === 0}
            >
              Go to Checkout
            </button>
          </aside>
          <aside className="flex-[3_3_0] rounded-xl shadow-primary flex items-center px-6 md:px-14 py-8 gap-4 flex-wrap lg:flex-nowrap">
            <div className="">
              <img
                src={productPlaceholder}
                alt=""
                className="h-24 aspect-square object-cover rounded-full"
              />
            </div>
            <div className="flex-[4_4_0] min-w-[100px] space-y-2">
              <p className="font-black uppercase text-xl text-center md:text-left">
                {p.name}
              </p>
              <div className={`grid grid-rows-1 gap-2 text-lg`}>
                {/* Simplified display of cart items without size */}
                {filteredCart.map((item, idx) => (
                  <div key={idx}>
                    <p>
                      x{item.qty} {item.name}
                    </p>{" "}
                    {/* Assuming item.name exists from Redux cart */}
                  </div>
                ))}
                {filteredCart.length === 0 && (
                  <p>Your cart is currently empty for this product.</p>
                )}
              </div>
            </div>
            <div className="flex-1 font-bold text-lg w-full content-end md:hidden">
              <p className="text-right">Checkout</p>
            </div>
            <div className="flex-1">
              <button
                className="bg-secondary h-14 aspect-square flex items-center justify-center object-cover rounded-full"
                onClick={checkoutHandler}
              >
                <svg
                  width="32"
                  height="30"
                  viewBox="0 0 33 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32.4142 16.4142C33.1953 15.6332 33.1953 14.3668 32.4142 13.5858L19.6863 0.857864C18.9052 0.0768156 17.6389 0.0768156 16.8579 0.857864C16.0768 1.63891 16.0768 2.90524 16.8579 3.68629L28.1716 15L16.8579 26.3137C16.0768 27.0948 16.0768 28.3611 16.8579 29.1421C17.6389 29.9232 18.9052 29.9232 19.6863 29.1421L32.4142 16.4142ZM0 17L31 17V13L0 13L0 17Z"
                    fill="#6A4029"
                  />
                </svg>
              </button>
            </div>
          </aside>
        </section>
      </main>
    );
  };

  return (
    <>
      <Header />
      {isLoading ? (
        <Loading />
      ) : notFound ? (
        <NotFound />
      ) : (
        <Detail data={detail} />
      )}
      <Footer />
    </>
  );
}
export default ProductDetail;
