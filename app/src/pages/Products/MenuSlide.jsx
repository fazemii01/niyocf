import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import productPlaceholder from "../../assets/images/placeholder-image.webp";
import loadingImage from "../../assets/images/loading.svg";
import emptyBox from "../../assets/images/empty.svg";

const MenuSlider = () => {
  const navigate = useNavigate();
  const { catId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(catId || "1");

  const categories = [
    { id: "1", name: "Coffee", icon: "ti-coffee" },
    { id: "2", name: "Non Coffee", icon: "ti-cup" },
    { id: "3", name: "Foods", icon: "ti-burger" },
    { id: "4", name: "Add-on", icon: "ti-plus" },
  ];

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory, searchParams]);

  const fetchProducts = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5500/apiv1/products", {
        params: {
          category_id: category,
          page: searchParams.get("page") || 1,
          limit: 8,
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
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center">
          <img src={emptyBox} alt="Empty" className="w-40 h-40" />
          <p className="text-center">No products available in this category.</p>
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={2}
          className="mt-6"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="relative">
              <img
                src={product.img ? product.img : productPlaceholder}
                alt={product.name}
                className="w-full h-60 object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-3 py-2 rounded">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-sm">IDR {product.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default MenuSlider;
