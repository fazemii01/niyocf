import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import { NavLink } from "react-router-dom";
import { getPromos } from "../../utils/dataProvider/promo";
import { Navigation } from "swiper/modules";
import penIcon from "../../assets/icons/icon-pen.svg";
import productPlaceholder from "../../assets/images/placeholder-image.webp";
import loadingImage from "../../assets/images/loading.svg";
import emptyBox from "../../assets/images/empty.svg";

const MenuSlider = () => {
  const navigate = useNavigate();
  const { catId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(catId || "1");

  const { userInfo } = useSelector((state) => ({
    userInfo: state.userInfo,
  }));

  const categories = [
    { id: "1", name: "Coffee", icon: "ti-coffee" },
    { id: "2", name: "Non Coffee", icon: "ti-cup" },
    { id: "3", name: "Foods", icon: "ti-burger" },
    { id: "4", name: "Add-on", icon: "ti-plus" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    getPromos(controller)
      .then((res) => {
        setPromos(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching promos", err);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (catId) {
      setSelectedCategory(catId);
    }
  }, [catId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5500/apiv1/products", {
        params: {
          page: searchParams.get("page") || 1,
          limit: 1000,
          sort: searchParams.get("sort") || "id_desc",
          orderBy: searchParams.get("orderBy") || "name",
          q: searchParams.get("q") || "",
        },
      });

      if (response.data && response.data.data) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate(`/category/${categoryId}`);
    setSearchParams({ page: 1 });
  };

  const filteredProducts = products.filter(
    (product) => String(product.category_id) === selectedCategory
  );

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="mb-10 text-2xl font-semibold text-center">
        Menu That Always Makes You Fall In Love
      </h2>

      <div className="flex gap-5 mb-8 max-sm:flex-wrap justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex gap-2.5 items-center px-5 py-2.5 rounded-3xl transition ${
              selectedCategory === category.id
                ? "bg-gray-300"
                : "bg-neutral-100 hover:bg-gray-200"
            }`}
            aria-label={`Filter by ${category.name}`}
          >
            <i className={`ti ${category.icon}`} aria-hidden="true"></i>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center">
          <img src={loadingImage} alt="Loading" className="w-20 h-20" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center">
          <img src={emptyBox} alt="Empty" className="w-40 h-40" />
          <p className="text-center">No products available in this category.</p>
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mt-6"
        >
          {filteredProducts.map((product) => {
            const matchedPromo = promos.find(
              (promo) => Number(promo.product_id) === product.id
            );

            return (
              <SwiperSlide key={product.id} className="relative">
                <div className="card bg-base-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 rounded-xl overflow-hidden relative">
                  <figure className="w-full h-60 overflow-hidden">
                    <img
                      src={product.img ? product.img : productPlaceholder}
                      alt={product.name}
                      className="w-full h-auto object-cover mt-[-110px]"
                    />
                  </figure>
                  <div className="card-body p-4 mt-2 text-center">
                    <h3 className="font-semibold text-xl text-base truncate">
                      {product.name}
                    </h3>
                    <div className="mt-2 text-center">
                      {matchedPromo ? (
                        <>
                          <p className="text-primary text-xl font-bold">
                            Rp {matchedPromo.discounted_price.toLocaleString()}
                          </p>
                          <p className="text-gray-400 text-sm line-through">
                            Rp {matchedPromo.original_price.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-primary text-xl font-bold">
                          Rp {product.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {Number(userInfo.role) > 1 && (
                    <NavLink
                      to={`/products/edit/${product.id}`}
                      className="btn btn-circle btn-sm absolute top-2 right-2 bg-secondary text-tertiary hover:bg-primary"
                    >
                      <img src={penIcon} alt="Edit" className="w-4 h-4" />
                    </NavLink>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default MenuSlider;
