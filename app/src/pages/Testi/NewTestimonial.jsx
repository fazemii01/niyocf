import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import { createTestimonialEntry } from "../../utils/dataProvider/testimonial";
import placeholderProfile from "../../assets/images/placeholder-profile.jpg";

const NewTestimonial = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();
  const controller = useMemo(() => new AbortController(), []);

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

  useEffect(() => {
    if (!form.image) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(form.image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.image]);

  const handleFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) return toast.error("Image max 2MB");

    setForm({ ...form, image: file });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.rating || !form.text) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    try {
      const token = userInfo?.token || localStorage.getItem("token");

      await createTestimonialEntry(
        {
          name: form.name,
          location: form.location,
          rating: parseInt(form.rating),
          text: form.text,
          // image: form.image, // if backend supports image upload
        },
        token,
        controller
      );

      toast.success("Testimonial submitted!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to submit testimonial");
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
              setPreview("");
              setCancel(false);
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
          <section className="flex-1 flex flex-col items-center gap-4">
            <nav className="flex flex-row list-none gap-1">
              <li className="after:content-['>'] after:font-poppins font-semibold text-primary">
                <NavLink to="/testimonial">Testimonials</NavLink>
              </li>
              <li className="text-tertiary font-poppins font-semibold">
                Add new testimonial
              </li>
            </nav>
            <input
              id="form_image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </section>

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
              required
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
              required
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
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NewTestimonial;
