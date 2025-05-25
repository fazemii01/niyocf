import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import penIcon from "../../assets/icons/icon-pen.svg";
import productPlaceholder from "../../assets/images/placeholder-image.webp";
import loadingImage from "../../assets/images/loading.svg";
import emptyBox from "../../assets/images/empty.svg";
import moment from "moment";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const GalleryIndex = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_HOST}/apiv1/gallery`
        );
        setItems(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <>
      <Header />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="mb-10 text-3xl font-bold text-center">
          Our Best Moments Captured
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <img src={loadingImage} alt="Loading" className="w-20 h-20" />
          </div>
        ) : items?.length === 0 ? (
          <div className="text-center">
            <img src={emptyBox} alt="Empty" className="w-32 mx-auto mb-4" />
            <p className="text-gray-500">No gallery items available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item?.id}
                className="card bg-base-100 shadow-lg rounded-xl overflow-hidden relative"
              >
                <figure>
                  <img
                    src={item?.image || productPlaceholder}
                    alt="Gallery"
                    className="w-full h-60 object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="font-semibold text-base truncate">
                    {item?.description || "No description"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item?.date
                      ? moment(item.date).format("MMM D, YYYY")
                      : "No date"}
                  </p>
                </div>

                <NavLink
                  to={`/gallery/edit/${item?.id}`}
                  className="btn btn-circle btn-sm absolute top-2 right-2 bg-secondary text-tertiary hover:bg-primary"
                >
                  <img src={penIcon} alt="Edit" className="w-4 h-4" />
                </NavLink>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default GalleryIndex;
