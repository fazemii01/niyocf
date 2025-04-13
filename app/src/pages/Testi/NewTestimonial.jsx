import React, { useState, useMemo } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { connect } from "react-redux";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import { createTestimonialEntry } from "../../utils/dataProvider/testimonial";
import useDocumentTitle from "../../utils/documentTitle";
import phProfile from "../../assets/images/placeholder-profile.jpg";

const NewTestimonial = (props) => {
  useDocumentTitle("New Testimonial");
  const [form, setForm] = useState({ name: "", text: "" });
  const [cancel, setCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const controller = useMemo(() => new AbortController(), []);

  const formChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return toast.error("Name too short");
    if (form.text.trim().length < 10)
      return toast.error("Testimonial too short");

    setLoading(true);
    try {
      const token = props.userInfo?.token || localStorage.getItem("token");
      await createTestimonialEntry(form, token, controller);
      toast.success("Testimonial added successfully");
      navigate("/testimonial", { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to add testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={cancel} onClose={() => setCancel(false)}>
        <p>Are you sure want to reset the form?</p>
        <section className="flex justify-center gap-x-5 mt-5">
          <button
            className="btn btn-error"
            onClick={() => {
              setForm({ name: "", text: "" });
              setCancel(false);
            }}
          >
            Yes
          </button>
          <button className="btn" onClick={() => setCancel(false)}>
            No
          </button>
        </section>
      </Modal>

      <Header />
      <main className="global-px py-6">
        <nav className="flex flex-row list-none gap-1">
          <li className="after:content-['>'] after:font-poppins font-semibold text-primary">
            <NavLink to="/testimonial">Testimonials</NavLink>
          </li>
          <li className="text-tertiary font-poppins font-semibold">
            Add new testimonial
          </li>
        </nav>
        <section className="flex flex-col md:flex-row py-14">
          <section className="flex-1 flex flex-col items-center gap-4">
            <div className="avatar">
              <div className="w-52 rounded-full">
                <img src={phProfile} alt="Profile" />
              </div>
            </div>
            <label
              htmlFor="form_name"
              className="btn btn-block btn-lg normal-case btn-secondary text-tertiary"
            >
              Customer&apos;s photo (optional)
            </label>
          </section>

          <form
            onSubmit={submitHandler}
            className="flex-[2_2_0%] md:pl-12 lg:pl-24 flex flex-col gap-4"
          >
            <label
              className="text-tertiary font-bold text-lg"
              htmlFor="form_name"
            >
              Name :
            </label>
            <input
              id="form_name"
              type="text"
              name="name"
              value={form.name}
              onChange={formChangeHandler}
              placeholder="Customer's name"
              required
              className="border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
            />

            <label
              className="text-tertiary font-bold text-lg"
              htmlFor="form_text"
            >
              Testimonial :
            </label>
            <textarea
              id="form_text"
              name="text"
              value={form.text}
              onChange={formChangeHandler}
              placeholder="What did the customer say?"
              rows={4}
              required
              className="border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
            />

            <button
              type="submit"
              className={`${
                loading && "loading"
              } btn btn-block btn-lg normal-case mt-2 btn-primary text-white shadow-lg rounded-2xl`}
            >
              Save Testimonial
            </button>
            <button
              type="reset"
              onClick={() => setCancel(true)}
              className="btn btn-lg normal-case bg-gray-200 hover:bg-gray-300 text-tertiary shadow-lg rounded-2xl"
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

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

export default connect(mapStateToProps)(NewTestimonial);
