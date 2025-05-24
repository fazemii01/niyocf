import React, { useEffect, useMemo, useState } from "react";

// import axios from "axios"; // No longer needed if modal is removed
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom"; // Added useNavigate

import loadingImage from "../../assets/images/loading.svg";
import productPlaceholder from "../../assets/images/placeholder-image.webp";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
// import Modal from "../../components/Modal"; // Modal removed
import {
  // getTransactionDetail, // No longer needed here
  getTransactionHistory,
} from "../../utils/dataProvider/transaction";
import useDocumentTitle from "../../utils/documentTitle";
import { formatDateTime, n_f } from "../../utils/helpers"; // formatDateTime might not be needed here anymore

function History() {
  const authInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate(); // Initialize useNavigate
  const controller = useMemo(() => new AbortController(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const [isLoading, setIsLoading] = useState(true);
  const [listMeta, setListMeta] = useState({
    totalData: "0",
    perPage: 6,
    currentPage: 1,
    totalPage: 1,
    prev: null,
    next: null,
  });
  const [list, setList] = useState([]);
  // Removed state and effects related to modal detail view:
  // const [detail, setDetail] = useState("");
  // const initialValue = { ... };
  // const [dataDetail, setDataDetail] = useState({ ...initialValue });
  // const detailController = useMemo(...);
  // const fetchDetail = async () => { ... };
  // useEffect for fetchDetail
  useDocumentTitle("Riwayat Transaksi"); // Translated

  useEffect(() => {
    if (page && (page < 1 || isNaN(page))) {
      setSearchParams({ page: 1 });
      return;
    }
    window.scrollTo(0, 0);

    setIsLoading(true);
    getTransactionHistory({ page: page || 1 }, authInfo.token, controller)
      .then((result) => {
        setList(result.data.data);
        setIsLoading(false);
        setListMeta(result.data.meta);
      })
      .catch(() => {
        setIsLoading(false);
        setList([]);
      });
  }, [page]);

  return (
    <>
      <Header />
      {/* Modal removed */}
      <main className="bg-history bg-cover bg-center py-6 md:py-12 lg:py-20 text-white">
        <section className="global-px">
          <div className="flex flex-col items-center p-3">
            <h2 className="text-3xl drop-shadow-[0px_10px_10px_rgba(0,0,0,0.6)] font-extrabold mb-5 text-center">
              Mari lihat apa yang sudah Anda beli! {/* Translated */}
            </h2>
            <p>Pilih item untuk melihat detail</p> {/* Translated */}
          </div>
          {/* <nav className="flex flex-row justify-end gap-4">
            <li className="list-none cursor-pointer select-none" id="selectAll">
              <p className="underline font-bold">Select All</p>
            </li>
            <li
              className="list-none cursor-pointer select-none"
              id="deleteSelected"
            >
              <p className="underline font-bold">Delete</p>
            </li>
          </nav> */}
          {!isLoading ? (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black py-7">
                {list.map((item, key) => (
                  <div
                    className="history-card  flex flex-row px-4 py-5 bg-white hover:bg-gray-200 cursor-pointer duration-200 rounded-2xl gap-5 relative group"
                    onClick={() => navigate(`/history/${item.id}`)} // Changed onClick to navigate
                    key={key}
                  >
                    <div className="">
                      <img
                        src={
                          item.products[0].product_img
                            ? item.products[0].product_img
                            : productPlaceholder
                        }
                        alt=""
                        width="100px"
                        className="rounded-full  aspect-square object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center w-auto">
                      <div className="font-extrabold text-lg relative w-full">
                        {item.products[0].product_name}
                        {item.products.length > 1 && (
                          <p className="absolute text-sm font-medium top-1 right-0 bg-white duration-200 group-hover:bg-gray-200">
                            + {item.products.length - 1} lainnya{" "}
                            {/* Translated */}
                          </p>
                        )}
                      </div>
                      <p className="text-tertiary">
                        IDR {n_f(item.grand_total)}
                      </p>
                      <p className="text-tertiary">{item.status_name}</p>
                    </div>
                    {/* <input
                  type="checkbox"
                  className="checkbox-history absolute bottom-4 right-4 delete-checkbox border-secondary bg-secondary rounded h-5 w-5"
                /> */}
                  </div>
                ))}
              </section>
              <section className="flex justify-center">
                <div className="join">
                  {listMeta.prev && (
                    <button
                      onClick={() => {
                        setSearchParams({
                          page: Number(listMeta.currentPage) - 1,
                        });
                      }}
                      className="join-item btn btn-primary text-white"
                    >
                      «
                    </button>
                  )}
                  <button className="join-item btn btn-primary text-white">
                    Halaman {listMeta.currentPage} {/* Translated */}
                  </button>
                  {listMeta.next && (
                    <button
                      onClick={() => {
                        setSearchParams({
                          page: Number(listMeta.currentPage) + 1,
                        });
                      }}
                      className="join-item btn btn-primary text-white"
                    >
                      »
                    </button>
                  )}
                </div>
              </section>
            </>
          ) : (
            <section className="flex justify-center items-center py-7">
              <img src={loadingImage} className="invert" />
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default History;
