import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getTestimonialById,
  updateTestimonialEntry,
} from "../../utils/dataProvider/testimonial";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import DeleteTestimonial from "../../components/Testi/DeleteTestimonial";
import placeholderProfile from "../../assets/images/placeholder-profile.jpg";

const EditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const controller = useMemo(() => new AbortController(), []);
  const userInfo = useSelector((state) => state.userInfo);

  const initialFormState = {
    name: "",
    location: "",
    rating: "",
    text: "",
    image: "",
  };
  const [form, setForm] = useState(initialFormState);
  const [preview, setPreview] = useState("");
  const [cancel, setCancel] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTestimonialById(id, controller);
        setForm(res.data.data);
      } catch (err) {
        toast.error(err.message);
        navigate("/testimonial");
      }
    };
    fetchData();
  }, [id, navigate, controller]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = userInfo?.token || localStorage.getItem("token");
      await updateTestimonialEntry(id, form, token, controller);
      toast.success("Testimonial updated");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to update testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={cancel} onClose={() => setCancel(false)}>
        <p>Reset the form?</p>
        <div className="flex gap-4 mt-4">
          <button
            className="btn btn-error"
            onClick={() => {
              setForm({ ...initialFormState });
              setCancel(false);
              setPreview("");
            }}
          >
            Yes
          </button>
          <button className="btn" onClick={() => setCancel(false)}>
            No
          </button>
        </div>
      </Modal>

      <Header />
      <main className="global-px py-6">
        <section className="flex flex-col md:flex-row gap-12 py-8">
          {/* Left Section */}
          <section className="flex-1 flex flex-col items-center gap-4">
            <nav className="flex flex-row list-none gap-1">
              <li className="after:content-['>'] after:font-poppins font-semibold text-primary">
                <NavLink to="/testimonial">Testimonials</NavLink>
              </li>
              <li className="text-tertiary font-poppins font-semibold">
                Edit testimonial
              </li>
            </nav>
          </section>

          {/* Right Form Section */}
          <form
            onSubmit={handleSubmit}
            className="flex-[2_2_0%] md:pl-12 lg:pl-24 flex flex-col gap-4"
          >
            <label className="text-tertiary font-bold text-lg">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
              placeholder="Customer's name"
              required
            />

            <label className="text-tertiary font-bold text-lg">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
              placeholder="City or Country"
            />

            <label className="text-tertiary font-bold text-lg">Rating</label>
            <input
              name="rating"
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={handleChange}
              className="border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
              placeholder="Rating 1 to 5"
            />

            <label className="text-tertiary font-bold text-lg">
              Testimonial
            </label>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              placeholder="What did the customer say?"
              rows={4}
              className="border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
              required
            />

            <button
              type="submit"
              className={`${
                isLoading && "loading"
              } btn btn-lg btn-primary text-white mt-4`}
            >
              Save Testimonial
            </button>
            <button
              type="reset"
              onClick={() => setCancel(true)}
              className="btn btn-lg bg-gray-200 text-black"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="btn btn-lg btn-error text-white mt-2"
            >
              Delete Testimonial
            </button>
          </form>
        </section>
      </main>
      <Footer />
      <DeleteTestimonial
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        testimonialId={id}
        testimonialName={form.name}
        onSuccess={() => {
          toast.info("Redirecting after deletion...");
          navigate("/");
        }}
      />
    </>
  );
};

export default EditTestimonial;
