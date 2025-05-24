import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTestimonials } from "../../utils/dataProvider/testimonial";
import phProfile from "../../assets/images/placeholder-profile.jpg";
import starIcon from "../../assets/icons/star.svg";

const IndexTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await getAllTestimonials();
        setTestimonials(res.data?.data || []);
      } catch (err) {
        console.error("Error loading testimonials:", err);
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
        <p className="text-center text-primary">Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-center text-primary">No testimonials available.</p>
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
                  alt="Profile"
                  className="w-14 aspect-square object-cover rounded-full"
                />
                <div className="flex-1">
                  <p className="font-poppins font-semibold text-quartenary text-lg">
                    {review.name}
                  </p>
                  <p className="text-primary text-sm">{review.location}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  {review.rating} <img src={starIcon} alt="Star" />
                </div>
              </div>
              <p className="text-quartenary">“{review.text}”</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default IndexTestimonial;
