import React, { useEffect, useState } from "react";
import axios from "axios";
import phProfile from "../../assets/images/person-with-a-coffee.webp";
import loadingImage from "../../assets/images/loading.svg";
import emptyBox from "../../assets/images/empty.svg";

const TestimonialIndex = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("http://localhost:5500/apiv1/testimonials");
        setTestimonials(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="global-px py-8 md:py-20">
      <div className="flex flex-col items-center mb-8 md:mb-20 text-center">
        <h2 className="text-3xl md:text-[35px] text-quartenary font-poppins font-semibold mb-5">
          Loved by Customer of
          <br /> Happy Customer
        </h2>
        <p className="text-[1rem] text-center max-w-[555px] text-primary">
          These are the stories of our customers who have visited us with great
          pleasure.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <img src={loadingImage} alt="Loading" className="w-20 h-20" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center">
          <img
            src={emptyBox}
            alt="No Testimonials"
            className="w-32 mx-auto mb-4"
          />
          <p className="text-gray-500">No testimonials available.</p>
        </div>
      ) : (
        <div className="overflow-auto flex flex-row gap-5 flex-wrap lg:flex-nowrap">
          {testimonials.map((review, idx) => (
            <div
              className="w-[400px] border-gray-300 hover:border-tertiary border-2 duration-200 rounded-xl p-7 space-y-4 hover:shadow-2xl mx-auto"
              key={idx}
            >
              <div className="flex flex-row gap-2 items-center">
                <img
                  src={review.image || phProfile}
                  alt={review.name}
                  className="w-14 aspect-square object-cover rounded-full"
                />
                <div className="flex-1">
                  <p className="font-poppins font-semibold text-quartenary text-lg">
                    {review.name}
                  </p>
                  <p className="text-primary text-sm">{review.location}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  {review.rating || "5.0"}{" "}
                  <img src={starIcon} alt="Rating" className="w-5 h-5" />
                </div>
              </div>
              <p className="text-quartenary">“{review.message}”</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TestimonialIndex;
