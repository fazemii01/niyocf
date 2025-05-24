import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import penIcon from "../../assets/icons/icon-pen.svg";
import { useSelector } from "react-redux";
import phProfile from "../../assets/images/person-with-a-coffee.webp";
import loadingImage from "../../assets/images/loading.svg";
import emptyBox from "../../assets/images/empty.svg";
import starIcon from "../../assets/icons/star.svg";

const TestimonialIndex = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userInfo,
  }));
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_HOST}apiv1/testimonial`
        );
        setTestimonials(res.data?.data || []);
      } catch (err) {
        console.error("Error loading testimonials", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="global-px py-10 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-quartenary mb-4">
          What Our Customers Say
        </h2>
        <p className="text-primary max-w-xl mx-auto">
          Real feedback from our awesome community.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <img src={loadingImage} alt="Loading..." className="w-16 h-16" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center text-primary">
          <img
            src={emptyBox}
            alt="No testimonials"
            className="w-32 mx-auto mb-4"
          />
          <p>No testimonials available.</p>
        </div>
      ) : (
        <div className="flex gap-6 flex-wrap justify-center">
          {testimonials.map(({ id, name, location, rating, text, image }) => (
            <div
              key={id}
              className="relative w-[360px] border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Edit button */}
              {Number(userInfo.role) > 1 && (
                <NavLink
                  to={`/testi/edit/${id}`}
                  className="btn btn-circle btn-sm absolute top-4 right-4 bg-secondary text-tertiary hover:bg-primary z-10"
                >
                  <img src={penIcon} alt="Edit" className="w-4 h-4" />
                </NavLink>
              )}

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={image || phProfile}
                  alt={name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-quartenary font-semibold">{name}</p>
                  <p className="text-sm text-primary">{location}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-primary font-medium">
                  {Number(rating).toFixed(1)}
                  <img src={starIcon} alt="star" className="w-4 h-4" />
                </div>
              </div>
              <p className="text-quartenary italic">“{text}”</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

export default TestimonialIndex;
