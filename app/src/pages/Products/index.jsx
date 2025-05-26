import "react-loading-skeleton/dist/skeleton.css";

/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from "react";

import _ from "lodash";
import Skeleton from "react-loading-skeleton";
import { connect, useSelector } from "react-redux";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import penIcon from "../../assets/icons/icon-pen.svg";
import illustrationsPromo from "../../assets/illustrations/mobile-search-undraw.png";
import images from "../../assets/images/person-with-a-coffee.webp";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { getPromos } from "../../utils/dataProvider/promo";
import useDocumentTitle from "../../utils/documentTitle";
import GetAllProducts from "./GetAllProducts";

const promos = [
  {
    name: "Limited Time Offer: 50% off!",
    desc: "Hurry, don't miss out!",
  },
  {
    name: "Buy One, Get One Free!",
    desc: "Double the fun.",
  },
  {
    name: "Exclusive Online Deal: Save 20%",
    desc: "Shop now and save.",
  },
  {
    name: "Flash Sale Alert: 24 Hours Only!",
    desc: "Act fast, limited stock.",
  },
];

function Products(props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [ddMenu, setDdmenu] = useState(false);
  const [sort, setSort] = useState(undefined);
  const [promo, setPromo] = useState([]);
  const [promoLoad, setPromoLoad] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const controller = useMemo(() => new AbortController(), []);
  const [search, setSearch] = useState(
    searchParams.has("q") ? searchParams.get("q") : undefined
  );
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userInfo,
  }));

  const toggleDdmenu = () => {
    setDdmenu(!ddMenu);
  };
  const navigate = useNavigate();

  const navigateWithParams = (newParams) => {
    const searchParams = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) =>
      searchParams.set(key, value)
    );
    navigate(`${location.pathname}?${searchParams}`);
  };

  const navigateDeleteParams = (deleteParams) => {
    const searchParams = new URLSearchParams(location.search);
    Object.entries(deleteParams).forEach(([key, value]) =>
      searchParams.delete(key)
    );
    navigate(`${location.pathname}?${searchParams}`);
  };

  const delayedSort = _.debounce((orderBy, sort) => {
    navigateWithParams({ orderBy, sort });
  }, 200);

  const delayedSearch = useCallback(
    _.debounce((q) => {
      navigateWithParams({ q });
    }, 1500),
    []
  );

  useEffect(() => {
    if (sort) {
      const currSort = sort.split("_", 2);
      delayedSort(currSort[0], currSort[1]);
    }
    return () => {};
  }, [sort]);

  useEffect(() => {
    if (search) {
      delayedSearch(search);
    } else {
      navigateDeleteParams({ q: null });
    }
  }, [search]);

  const fetchPromo = async () => {
    try {
      setPromoLoad(true);
      const result = await getPromos({ page: 1 }, controller);
      setPromo(result.data.data);
      setPromoLoad(false);
    } catch (error) {
      setPromoLoad(false);
      setPromo([]);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPromo();
  }, []);

  useDocumentTitle(props.title);
  return (
    <>
      <Header />

      <main className="flex flex-col-reverse md:flex-row global-px">
        <section className="flex-1 flex flex-col items-center gap-5 py-5 md:border-r-2 border-solid md:pr-6">
          <h2 className="font-bold text-2xl">Promo Today</h2>
          <p className="text-center">
            Coupons will be updated every weeks.
            <br />
            Check them out!
          </p>
          <div className="flex flex-col justify-center gap-5">
            {promoLoad ? (
              <Skeleton
                height={125}
                count={4}
                containerClassName="flex-1 w-[350px] md:w-auto lg:w-[346px]"
                style={{ marginBottom: "1rem", minWidth: 250 }}
              />
            ) : promo.length < 1 ? (
              <div className="flex flex-col text-center">
                <img src={illustrationsPromo} width={200} />
                <p className="text-tertiary font-semibold">No promo today</p>
                <p className="text-black font-medium text-sm">
                  Dont worry, check tommorow
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                {promo.map((promo, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow p-4 flex flex-col"
                  >
                    <div className="flex justify-center mb-4">
                      <img
                        src={promo.img || promo.product_img || images}
                        alt="promo-img"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                      <h3 className="font-bold text-lg">{promo.name}</h3>
                      <p className="text-gray-600 text-sm">{promo.desc}</p>
                      <p className="font-bold text-gray-600 text-sm">
                        Kode Kupon {promo.coupon_code}
                      </p>
                      <div className="mt-2">
                        <p className="text-primary text-xl font-bold">
                          Rp {promo.discounted_price.toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-sm line-through">
                          Rp {promo.original_price.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Until {new Date(promo.end_date).toLocaleDateString()}
                      </p>
                      {(() => {
                        const endDate = new Date(promo.end_date);
                        endDate.setHours(23, 59, 59, 999);
                        const currentDate = new Date();
                        if (currentDate > endDate) {
                          return (
                            <p className="text-red-500 font-bold text-sm mt-1">
                              Expired
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {Number(userInfo.role) > 1 && (
                      <NavLink
                        to={`/promo/edit/${promo.id}`}
                        className="absolute top-3 right-3 bg-primary p-2 rounded-full shadow hover:bg-primary-focus"
                      >
                        <img
                          src={penIcon}
                          className="w-4 h-4"
                          alt="edit-icon"
                        />
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {Number(props.userInfo.role) > 1 && (
            <div className="mt-auto flex w-full">
              <button
                onClick={() => navigate("/promo/new")}
                className="btn btn-block btn-secondary text-tertiary font-bold normal-case"
              >
                Add new promo
              </button>
            </div>
          )}
        </section>
        <section className="flex-[2_2_0%] flex flex-col md:pl-16 py-5">
          <nav className="list-none flex flex-row md:justify-between justify-evenly flex-wrap gap-5 mb-10 ">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-tertiary border-b-2 border-tertiary pb-1 drop-shadow-lg"
                    : "" +
                      " hover:drop-shadow-lg hover:border-b-2 border-tertiary pb-1"
                }
                to="/products"
                end
              >
                Favorite & Promo
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-tertiary border-b-2 border-tertiary pb-1 drop-shadow-lg"
                    : "" +
                      " hover:drop-shadow-lg hover:border-b-2 border-tertiary pb-1"
                }
                to="category/1"
              >
                Coffee
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-tertiary border-b-2 border-tertiary pb-1 drop-shadow-lg"
                    : "" +
                      " hover:drop-shadow-lg hover:border-b-2 border-tertiary pb-1"
                }
                to="category/2"
              >
                Non Coffee
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-tertiary border-b-2 border-tertiary pb-1 drop-shadow-lg"
                    : "" +
                      " hover:drop-shadow-lg hover:border-b-2 border-tertiary pb-1"
                }
                to="category/3"
              >
                Foods
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-tertiary border-b-2 border-tertiary pb-1 drop-shadow-lg"
                    : "" +
                      " hover:drop-shadow-lg hover:border-b-2 border-tertiary pb-1"
                }
                to="category/4"
              >
                Add-on
              </NavLink>
            </li>
            <li className="relative">
              <button
                onClick={toggleDdmenu}
                className={
                  (ddMenu ? "rotate-180" : "rotate-0") +
                  " duration-150 focus:bg-none"
                }
              >
                ▼
              </button>
              <div
                className={
                  (!ddMenu ? "opacity-0 z-0 " : " z-[5]") +
                  " absolute w-72 shadow border-1 border-gray-200 bg-white rounded-md right-0 p-5 top-10 text-primary duration-200 transition-opacity"
                }
              >
                <section className="flex flex-col">
                  <aside className="flex-1 flex flex-col">
                    <label
                      htmlFor="searchProduct"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Keywords
                    </label>
                    <input
                      type="text"
                      name="searchProduct"
                      id="searchProduct"
                      className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </aside>
                  <aside className="flex-1">
                    <label
                      htmlFor="orderBy"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Order by
                    </label>
                    <select
                      id="orderBy"
                      className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value={undefined}>Choose a order</option>
                      <option value="price_asc">Price (Asc)</option>
                      <option value="price_desc">Price (Desc)</option>
                      <option value="id_desc">Newest</option>
                      <option value="id_asc">Oldest</option>
                      <option value="category_asc">Category (Asc)</option>
                      <option value="category_desc">Category (Desc)</option>
                    </select>
                  </aside>
                </section>
              </div>
            </li>
          </nav>
          <Routes path="/products/*">
            <Route
              index
              element={
                <GetAllProducts
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  sort={sort}
                  setSort={setSort}
                />
              }
            ></Route>
            <Route
              path="category/:catId"
              element={
                <GetAllProducts
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  sort={sort}
                  setSort={setSort}
                />
              }
            />
          </Routes>

          <section className="my-6 text-tertiary">
            *harga akan mendapat potongan jika sudah me-redeem kode diskon
          </section>
          {Number(props.userInfo.role) > 1 && (
            <div className="mt-auto flex w-full">
              <button
                onClick={() => navigate("/products/new")}
                className="btn btn-block btn-primary text-white font-bold normal-case"
              >
                Add new product
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
